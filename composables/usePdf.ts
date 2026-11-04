// Opens a PDF with pdf.js (loaded only when a book is opened) and draws its pages onto canvases.
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

export function usePdf() {
  const doc = shallowRef<PDFDocumentProxy | null>(null)
  const pages = ref(0)
  /** Width ÷ height of the first page; every page is laid out with it. */
  const aspect = ref(2 / 3)
  const loading = ref(false)
  const error = ref('')
  const tasks = new WeakMap<HTMLCanvasElement, RenderTask>()
  // pdf.js v6 frees a document through the task that loaded it.
  let loadingTask: PDFDocumentLoadingTask | null = null

  async function open(src: string) {
    loading.value = true
    error.value = ''
    try {
      const m = await pdfjs()
      loadingTask = m.getDocument({ url: src })
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

  /** Draws page `n` at `cssWidth` px wide. The canvas keeps its old picture until the new one is ready. */
  async function render(canvas: HTMLCanvasElement, n: number, cssWidth: number) {
    const d = doc.value
    if (!d || n < 1 || n > d.numPages) return false
    tasks.get(canvas)?.cancel()
    const page = await d.getPage(n)
    const base = page.getViewport({ scale: 1 })
    const scale = cssWidth / base.width
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5)
    const vp = page.getViewport({ scale: scale * dpr })

    const off = document.createElement('canvas')
    off.width = Math.floor(vp.width)
    off.height = Math.floor(vp.height)
    // pdf.js v6 takes the canvas itself (canvasContext alone is deprecated).
    const task = page.render({ canvas: off, viewport: vp })
    tasks.set(canvas, task)
    try {
      await task.promise
    } catch {
      return false // cancelled by a newer render
    }
    if (tasks.get(canvas) !== task) return false
    canvas.width = off.width
    canvas.height = off.height
    canvas.style.width = `${Math.round(vp.width / dpr)}px`
    canvas.style.height = `${Math.round(vp.height / dpr)}px`
    canvas.getContext('2d')?.drawImage(off, 0, 0)
    return true
  }

  function close() {
    loadingTask?.destroy()
    loadingTask = null
    doc.value = null
    pages.value = 0
  }

  return { doc, pages, aspect, loading, error, open, render, close }
}
