// Opens a PDF with pdf.js (loaded only when a book is opened), fetching only the parts it needs, and draws
// pages onto canvases with a selectable text layer. Also: the PDF's own contents, text search, a cover thumbnail.
import type { PDFDocumentLoadingTask, PDFDocumentProxy, RenderTask } from 'pdfjs-dist/legacy/build/pdf.mjs'

type PdfJs = typeof import('pdfjs-dist/legacy/build/pdf.mjs')
let lib: Promise<PdfJs> | null = null

// The legacy build also runs on older phones (no Promise.withResolvers and friends needed).
function pdfjs(): Promise<PdfJs> {
  lib ??= Promise.all([
    import('pdfjs-dist/legacy/build/pdf.min.mjs') as Promise<PdfJs>,
    import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url'),
  ]).then(([m, worker]) => {
    m.GlobalWorkerOptions.workerSrc = worker.default
    return m
  })
  return lib
}

const CHUNK = 65536
export interface OutlineItem { title: string; page: number; depth: number }
export interface SearchHit { page: number; before: string; match: string; after: string }

/**
 * Range loading that works even when the host hides `Accept-Ranges` from other sites (pdf.js only asks for
 * ranges when it can read that header). We fetch the ranges ourselves; the host only has to allow the
 * `Range` request header. Returns null when the host ignores ranges; throws when it refuses to share.
 */
async function rangeTransport(m: PdfJs, url: string, onBytes: (n: number) => void) {
  const ctl = new AbortController()
  const first = await fetch(url, { headers: { Range: `bytes=0-${CHUNK - 1}` }, signal: ctl.signal })
  if (first.status !== 206) { ctl.abort(); return null }
  const total = Number(/\/(\d+)$/.exec(first.headers.get('Content-Range') ?? '')?.[1])
    || Number((await fetch(url, { method: 'HEAD', signal: ctl.signal })).headers.get('Content-Length'))
  if (!total) { ctl.abort(); return null }
  const head = new Uint8Array(await first.arrayBuffer())
  onBytes(head.byteLength)

  class Ranges extends m.PDFDataRangeTransport {
    override requestDataRange(begin: number, end: number) {
      fetch(url, { headers: { Range: `bytes=${begin}-${end - 1}` }, signal: ctl.signal })
        .then(async (r) => {
          const buf = await r.arrayBuffer()
          onBytes(buf.byteLength)
          this.onDataRange(begin, new Uint8Array(r.status === 206 ? buf : buf.slice(begin, end)))
        })
        .catch(() => { /* aborted on close, or offline: pdf.js reports the page that cannot draw */ })
    }
    override abort() { ctl.abort() }
  }
  return new Ranges(total, head)
}

const sameOrigin = (src: string) => new URL(src, location.href).origin === location.origin

export function usePdf() {
  const doc = shallowRef<PDFDocumentProxy | null>(null)
  const pages = ref(0)
  /** Width ÷ height of the first page; every page is laid out with it until drawn. */
  const aspect = ref(2 / 3)
  const loading = ref(false)
  const error = ref('')
  /** Share of the file pdf.js has received, 0–100 (null while unknown). */
  const percent = ref<number | null>(null)
  /** Bytes fetched so far: with ranges, far less than the file for a long book. */
  const fetched = ref(0)
  const ranged = ref(false)
  const tasks = new WeakMap<HTMLCanvasElement, RenderTask>()
  const texts = new Map<number, string>()
  let mod: PdfJs | null = null
  // pdf.js v6 frees a document through the task that loaded it.
  let loadingTask: PDFDocumentLoadingTask | null = null

  async function open(src: string) {
    loading.value = true
    error.value = ''
    percent.value = null
    fetched.value = 0
    try {
      const m = mod = await pdfjs()
      const opts = { disableAutoFetch: true, disableStream: false, rangeChunkSize: CHUNK }
      const range = sameOrigin(src) ? null : await rangeTransport(m, src, n => (fetched.value += n))
      ranged.value = !!range
      loadingTask = m.getDocument(range ? { ...opts, range } : { ...opts, url: src })
      loadingTask.onProgress = ({ loaded, total }: { loaded: number; total: number }) => {
        if (total) percent.value = Math.min(100, Math.round((loaded / total) * 100))
      }
      const d = await loadingTask.promise
      const first = await d.getPage(1)
      const vp = first.getViewport({ scale: 1 })
      aspect.value = vp.width / vp.height
      pages.value = d.numPages
      doc.value = d
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e)
    } finally {
      loading.value = false
    }
  }

  /**
   * Draws page `n` at `cssWidth` px wide (and no taller than `maxHeight`) into `canvas`, and its text
   * into `textLayer` so it can be selected. The canvas keeps its old picture until the new one is ready. Resolves to the page's
   * CSS size, or null when a newer draw replaced this one.
   */
  async function render(canvas: HTMLCanvasElement, n: number, cssWidth: number, textLayer?: HTMLElement | null, maxHeight = Infinity) {
    const d = doc.value
    if (!d || !mod || n < 1 || n > d.numPages) return null
    tasks.get(canvas)?.cancel()
    const page = await d.getPage(n)
    const base = page.getViewport({ scale: 1 })
    const scale = Math.min(cssWidth / base.width, maxHeight / base.height)
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const vp = page.getViewport({ scale })
    const hi = page.getViewport({ scale: scale * dpr })

    const off = document.createElement('canvas')
    off.width = Math.floor(hi.width)
    off.height = Math.floor(hi.height)
    // pdf.js v6 takes the canvas itself (canvasContext alone is deprecated).
    const task = page.render({ canvas: off, viewport: hi })
    tasks.set(canvas, task)
    try {
      await task.promise
    } catch {
      return null // cancelled by a newer draw
    }
    if (tasks.get(canvas) !== task) return null
    canvas.width = off.width
    canvas.height = off.height
    canvas.style.width = `${Math.round(vp.width)}px`
    canvas.style.height = `${Math.round(vp.height)}px`
    canvas.getContext('2d')?.drawImage(off, 0, 0)
    off.width = off.height = 0

    if (textLayer) {
      textLayer.replaceChildren()
      textLayer.style.setProperty('--total-scale-factor', String(scale))
      await new mod.TextLayer({ textContentSource: page.streamTextContent(), container: textLayer, viewport: vp }).render()
        .catch(() => { /* no text on this page */ })
    }
    return { width: vp.width, height: vp.height }
  }

  /** Lets go of a page's pixels when it is far from view. */
  function release(canvas: HTMLCanvasElement) {
    tasks.get(canvas)?.cancel()
    tasks.delete(canvas)
    canvas.width = canvas.height = 0
  }

  /** Fetches what page `n` needs (fonts, pictures) so that turning to it draws at once. */
  function prefetch(n: number) {
    const d = doc.value
    if (d && n >= 1 && n <= d.numPages) d.getPage(n).then(p => p.getOperatorList()).catch(() => {})
  }

  /** The PDF's own table of contents, flattened, each entry with the page it opens. */
  async function outline(): Promise<OutlineItem[]> {
    const d = doc.value
    if (!d) return []
    const out: OutlineItem[] = []
    type Node = { title: string; dest: unknown; items: Node[] }
    const walk = async (items: Node[], depth: number) => {
      for (const it of items) {
        let dest = it.dest
        if (typeof dest === 'string') dest = await d.getDestination(dest).catch(() => null)
        const ref = Array.isArray(dest) ? dest[0] : null
        const page = ref && typeof ref === 'object'
          ? (await d.getPageIndex(ref as Parameters<typeof d.getPageIndex>[0]).catch(() => -1)) + 1
          : typeof ref === 'number' ? ref + 1 : 0
        if (page > 0 && it.title.trim()) out.push({ title: it.title.trim(), page, depth })
        if (it.items?.length) await walk(it.items, depth + 1)
      }
    }
    await walk(((await d.getOutline()) ?? []) as Node[], 0)
    return out
  }

  async function textOf(n: number) {
    const hit = texts.get(n)
    if (hit !== undefined || !doc.value) return hit ?? ''
    const content = await (await doc.value.getPage(n)).getTextContent()
    const s = content.items.map(i => ('str' in i ? i.str + (i.hasEOL ? ' ' : '') : '')).join('').replace(/\s+/g, ' ')
    texts.set(n, s)
    return s
  }

  /** Every match of `query`, page by page; `onPage` reports how far the search has got. */
  async function search(query: string, onHit: (h: SearchHit) => void, onPage: (n: number) => void, signal: AbortSignal) {
    const q = query.trim().toLowerCase()
    const total = doc.value?.numPages ?? 0
    if (!q) return
    for (let n = 1; n <= total && !signal.aborted; n++) {
      const s = await textOf(n).catch(() => '')
      const low = s.toLowerCase()
      let at = low.indexOf(q)
      while (at !== -1 && !signal.aborted) {
        onHit({ page: n, before: s.slice(Math.max(0, at - 48), at), match: s.slice(at, at + q.length), after: s.slice(at + q.length, at + q.length + 64) })
        at = low.indexOf(q, at + q.length)
      }
      onPage(n)
    }
  }

  /** Page 1, small, as a picture for the shelf. */
  async function thumbnail(width = 240): Promise<Blob | null> {
    const canvas = document.createElement('canvas')
    if (!(await render(canvas, 1, width / Math.min(window.devicePixelRatio || 1, 2)))) return null
    return new Promise(resolve => canvas.toBlob(b => { release(canvas); resolve(b) }, 'image/webp', 0.82))
  }

  function close() {
    loadingTask?.destroy()
    loadingTask = null
    doc.value = null
    pages.value = 0
    texts.clear()
  }

  return { doc, pages, aspect, loading, error, percent, fetched, ranged, open, render, release, prefetch, outline, search, textOf, thumbnail, close }
}
