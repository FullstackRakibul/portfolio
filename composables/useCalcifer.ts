// Conversation state for Calcifer (components/chat/Panel.vue). Replies are scripted (data/calcifer.ts) and
// revealed a few words at a time, like a streamed answer; under reduced motion they appear at once.
import { answer, type ChatLink } from '~/data/calcifer'

export interface ChatMessage { id: number; role: 'assistant' | 'user'; text: string; links?: ChatLink[] }

export function useCalcifer() {
  const messages = useState<ChatMessage[]>('calcifer-messages', () => [])
  const typing = useState('calcifer-typing', () => false)
  const streaming = useState('calcifer-streaming', () => false)
  const reduce = useReducedMotion()
  let seq = 0
  let timer: ReturnType<typeof setTimeout> | undefined

  const send = (raw: string) => {
    const text = raw.trim()
    if (!text || streaming.value) return
    messages.value.push({ id: ++seq, role: 'user', text })
    const reply = answer(text)
    streaming.value = true
    typing.value = true
    timer = setTimeout(() => {
      typing.value = false
      const words = reply.text.split(' ')
      const msg: ChatMessage = { id: ++seq, role: 'assistant', text: reduce.value ? reply.text : '' }
      messages.value.push(msg)
      const live = messages.value[messages.value.length - 1]!
      if (reduce.value) { live.links = reply.links; streaming.value = false; return }
      let i = 0
      const step = () => {
        live.text = words.slice(0, ++i).join(' ')
        if (i < words.length) timer = setTimeout(step, 28)
        else { live.links = reply.links; streaming.value = false }
      }
      step()
    }, reduce.value ? 200 : 650)
  }

  const reset = () => {
    clearTimeout(timer)
    messages.value = []
    typing.value = false
    streaming.value = false
  }

  return { messages, typing, streaming, send, reset }
}
