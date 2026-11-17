// Calcifer, the site's assistant (components/chat/, composables/useCalcifer.ts).
// For now every answer is scripted from the data files below, so it can only say what the site already says.
// SYSTEM_PROMPT is ready for when a model is wired in; keep the rules in step with the scripted answers.

import { CONTACT, FACTS, CAPABILITIES, LOCATION, MOSTISKO_URL } from './portfolio'
import { PROJECTS } from './projects'
import { EMPLOYERS } from './experience'
import { FLOATING_CONTACT } from './contact'
import { BIO, EMPLOYER, FAQ, JOB_TITLE, NAME, ROLE_TITLE } from './profile'

export interface ChatLink { label: string; to?: string; href?: string }
export interface Reply { text: string; links?: ChatLink[] }

export const CALCIFER = {
  name: 'Calcifer',
  status: 'Rakibul’s assistant',
  greeting: 'Hi, I’m Calcifer, Rakibul’s assistant. Ask me what he builds, what he has shipped, or how to reach him.',
  suggestions: ['What does Rakibul build?', 'Show me his projects', 'How do I book a call?'],
}

const fact = (label: string) => FACTS.find(f => f.label === label)?.value ?? ''
const job = EMPLOYERS[0]
/** "Backend engineering" → "backend engineering", but "AI & experimental" keeps its capitals. */
const lower = (s: string) => (/^[A-Z]{2}/.test(s) ? s : s[0]!.toLowerCase() + s.slice(1))
const and = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs.at(-1)}`)

// Same name, bio, title and employer as the site, the JSON-LD and /llms.txt (all from data/profile.ts).
export const SYSTEM_PROMPT = `You are Calcifer, Rakibul's assistant on his portfolio site. Introduce yourself as "Calcifer, Rakibul's assistant".
Answer only from the facts below. If something isn't there, say you don't know and point to email.
Never invent projects, employers, dates, prices or availability. Call him ${NAME}.
- Bio: ${BIO}
- Titles: ${JOB_TITLE} (site); ${ROLE_TITLE} at ${EMPLOYER} (current role)
- Based in: ${LOCATION.city} (${LOCATION.timeZone})
- Capabilities: ${CAPABILITIES.map(c => `${c.name} (${c.items.join(', ')})`).join('; ')}
- Projects: ${PROJECTS.map(p => p.title).join(', ')}
- Contact: email ${CONTACT.email}, LinkedIn ${CONTACT.linkedin}, GitHub ${CONTACT.github}
Answers to common questions, to repeat in substance:
${FAQ.map(f => `Q: ${f.q}\nA: ${f.a}`).join('\n')}`

const contactLinks = (): ChatLink[] => [
  { label: `Email ${CONTACT.email}`, href: `mailto:${CONTACT.email}` },
  ...(FLOATING_CONTACT.booking ? [{ label: 'Book a call', href: FLOATING_CONTACT.booking }] : []),
  ...(FLOATING_CONTACT.chat ? [{ label: 'Message him directly', href: FLOATING_CONTACT.chat }] : []),
  { label: 'LinkedIn', href: CONTACT.linkedin },
]

const faq = (start: string) => FAQ.find(f => f.q.startsWith(start))!.a

const REPLIES: { test: RegExp; reply: () => Reply }[] = [
  {
    test: /\b(freelance|freelancing|collaborat\w*|contract|side project)\b/,
    reply: () => ({ text: faq('Is he open'), links: contactLinks() }),
  },
  {
    test: /\b(book|call|meet|meeting|schedule|hire|hiring|contact|reach|email|mail|talk|available)\b/,
    reply: () => ({
      text: FLOATING_CONTACT.booking
        ? 'Pick a time on his calendar, or email him if none of the slots fit.'
        : `The best way is email. Say what you’re working on and suggest a few times; he’s in ${LOCATION.city} (GMT+6).`,
      links: contactLinks(),
    }),
  },
  {
    test: /\b(project|projects|work|portfolio|shipped|built|show)\b/,
    reply: () => {
      const top = PROJECTS.slice(0, 5).map(p => p.title).join(', ')
      return { text: `A few of his projects: ${top}. The Projects section has screenshots, links and the rest.`, links: [{ label: 'See all projects', to: '/projects' }] }
    },
  },
  {
    test: /\b(build|builds|do|does|skill|skills|stack|tech|technology|backend|frontend|ai|dotnet|vue)\b/,
    reply: () => ({
      text: `He’s a ${fact('Role').replace(', ', ' and ')} at ${fact('Works at')}. His work covers ${and(CAPABILITIES.map(c => lower(c.name)))}.`,
      links: [{ label: 'Engineering', to: '/engineering' }, { label: 'Résumé', to: '/resume' }],
    }),
  },
  {
    test: /\b(experience|job|jobs|career|company|employer|years)\b/,
    reply: () => ({
      text: job ? `He works at ${job.company} as ${job.positions[0]?.title}. His full history is in the Experience section.` : 'His work history is in the Experience section.',
      links: [{ label: 'Experience', to: '/experience' }, { label: 'Résumé', to: '/resume' }],
    }),
  },
  {
    test: /\b(mostisko|llm|ollama|local)\b/,
    reply: () => ({ text: 'Mostisko is his local-AI workspace built on Ollama and local LLMs.', links: [{ label: 'Open Mostisko', href: MOSTISKO_URL }] }),
  },
  {
    test: /\b(resume|résumé|cv)\b/,
    reply: () => ({ text: 'Here’s his résumé.', links: [{ label: 'Résumé', to: '/resume' }] }),
  },
  {
    test: /\b(where|location|based|dhaka|time ?zone)\b/,
    reply: () => ({ text: `He’s based in ${LOCATION.city} (GMT+6).` }),
  },
  {
    test: /\b(hi|hello|hey|who are you|your name)\b/,
    reply: () => ({ text: CALCIFER.greeting }),
  },
]

/** The scripted answer for a message. Unknown questions get an honest "I don't know" and the email. */
export const answer = (message: string): Reply => {
  const m = message.toLowerCase()
  const hit = REPLIES.find(r => r.test.test(m))
  return hit ? hit.reply() : {
    text: 'I only know what’s on this site, and that isn’t in it. Ask about his projects or skills, or email Rakibul directly.',
    links: [{ label: `Email ${CONTACT.email}`, href: `mailto:${CONTACT.email}` }],
  }
}
