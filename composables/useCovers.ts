// Page-1 thumbnails of books this reader has opened, kept in IndexedDB and shown on the shelf in place of
// the drawn cover. A thumbnail is only ever made from a book already open in the reader: the shelf never
// downloads a PDF to make a cover.

const DB = 'bookshelf'
const STORE = 'covers'

function db(): Promise<IDBDatabase | null> {
  if (!import.meta.client || !('indexedDB' in window)) return Promise.resolve(null)
  return new Promise((resolve) => {
    const req = indexedDB.open(DB, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => resolve(null) // private mode or blocked: drawn covers only
  })
}

export function useCovers() {
  /** slug → object URL of its thumbnail. */
  const urls = useState<Record<string, string>>('bookshelf-covers', () => ({}))
  const loaded = useState('bookshelf-covers-loaded', () => false)

  async function loadAll() {
    if (loaded.value) return
    loaded.value = true
    const d = await db()
    if (!d) return
    const tx = d.transaction(STORE, 'readonly').objectStore(STORE)
    const keys = await new Promise<IDBValidKey[]>(r => { const q = tx.getAllKeys(); q.onsuccess = () => r(q.result); q.onerror = () => r([]) })
    const blobs = await new Promise<Blob[]>(r => { const q = tx.getAll(); q.onsuccess = () => r(q.result); q.onerror = () => r([]) })
    const next: Record<string, string> = {}
    keys.forEach((k, i) => { if (blobs[i] instanceof Blob) next[String(k)] = URL.createObjectURL(blobs[i]) })
    urls.value = { ...next, ...urls.value }
  }

  const has = (slug: string) => !!urls.value[slug]

  async function put(slug: string, blob: Blob) {
    const d = await db()
    if (!d) return
    await new Promise<void>((r) => {
      const tx = d.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).put(blob, slug)
      tx.oncomplete = tx.onerror = () => r()
    })
    if (urls.value[slug]) URL.revokeObjectURL(urls.value[slug])
    urls.value = { ...urls.value, [slug]: URL.createObjectURL(blob) }
  }

  return { urls, loadAll, has, put }
}
