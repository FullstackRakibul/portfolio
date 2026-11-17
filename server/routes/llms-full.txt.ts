import { llmsFullTxt } from '../utils/llms'

// Prerendered to .output/public/llms-full.txt (nuxt.config nitro.prerender.routes).
export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return llmsFullTxt(useRuntimeConfig().public.siteUrl as string)
})
