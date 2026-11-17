import { llmsTxt } from '../utils/llms'

// Prerendered to .output/public/llms.txt (nuxt.config nitro.prerender.routes).
export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return llmsTxt(useRuntimeConfig().public.siteUrl as string)
})
