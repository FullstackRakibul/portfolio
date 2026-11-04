// pdfjs-dist ships types for legacy/build/pdf.mjs (pdf.d.mts) but not for its minified twin, which
// composables/usePdf.ts loads. Same module, same exports: re-use the typed build's declarations.
// (The worker's `?url` import is typed by Vite's client types, which Nuxt already includes.)
declare module 'pdfjs-dist/legacy/build/pdf.min.mjs' {
  export * from 'pdfjs-dist/legacy/build/pdf.mjs'
}
