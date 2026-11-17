// /llms.txt and /llms-full.txt (llmstxt.org proposal), written at build time from the same data files the pages
// render, so the AI-facing text can never drift from the site.
import { CAPABILITIES, CONTACT, EXPERIMENTS, MOSTISKO_MODULES, MOSTISKO_STACK, MOSTISKO_URL } from '~/data/portfolio'
import { EMPLOYERS, monthLabel } from '~/data/experience'
import { EARLIER_PROJECTS, PROJECTS } from '~/data/projects'
import { POSTS } from '~/data/writing'
import { CERTIFICATIONS } from '~/data/certifications'
import { BIO, CAREER_START_LABEL, COMPANY_COUNT, EMPLOYER, FAQ, NAME, PROJECT_COUNT, ROLE_TITLE, CURRENT_FOCUS } from '~/data/profile'

const span = (start: string, end?: string) => `${monthLabel(start)} – ${end ? monthLabel(end) : 'present'}`
const pitch = (p: typeof PROJECTS[number]) => [p.kind, p.translation ?? p.pitch].filter(Boolean).join(': ')

const summary = () =>
  `${BIO} He has worked in software since ${CAREER_START_LABEL} across ${COMPANY_COUNT} companies, and is currently ${ROLE_TITLE} at ${EMPLOYER} (${CURRENT_FOCUS.replace(/\.$/, '')}). This site lists ${PROJECT_COUNT} projects, his Medium writing, and ${CERTIFICATIONS.length} Anthropic certificates.`

const experience = () => EMPLOYERS.flatMap(e => e.positions.map(p => `- ${p.title}, ${e.company} (${span(p.start, p.end)})`))
const projects = () => [
  ...PROJECTS.map(p => `- [${p.title}](${p.url}): ${pitch(p)}`),
  `- [Mostisko](${MOSTISKO_URL}): Locally hosted AI workspace, in active development`,
  ...EARLIER_PROJECTS.map(p => (p.url ? `- [${p.title}](${p.url}): ${p.description}` : `- ${p.title}: ${p.description}`)),
]
const writing = () => POSTS.map(p => `- [${p.title}](${p.url}) (${p.date})`)
const certs = () => CERTIFICATIONS.map(c => `- ${c.title}: ${c.issuer}, ${monthLabel(c.issued)}, credential ID ${c.credentialId}`)
const contact = () => [
  `- Email: ${CONTACT.email}`,
  `- GitHub: ${CONTACT.github}`,
  `- LinkedIn: ${CONTACT.linkedin}`,
  `- Medium: ${CONTACT.medium}`,
]

export function llmsTxt(site: string) {
  return [
    `# ${NAME}`,
    '',
    `> ${BIO}`,
    '',
    summary(),
    '',
    '## About',
    `- [Home](${site}/): Who he is, experience, capabilities, projects, certifications and writing on one page`,
    `- [Résumé](${site}/resume): Printable résumé`,
    `- [Full text for language models](${site}/llms-full.txt): Every section of the site in Markdown`,
    '',
    '## Experience',
    ...experience(),
    '',
    '## Projects',
    ...projects(),
    '',
    '## Writing',
    ...writing(),
    '',
    '## Certifications',
    ...certs(),
    '',
    '## Contact',
    ...contact(),
    '',
  ].join('\n')
}

export function llmsFullTxt(site: string) {
  const out: string[] = [`# ${NAME}`, '', `> ${BIO}`, '', summary(), '', `Source: ${site}/`, '']

  out.push('## Experience', '')
  for (const e of EMPLOYERS) {
    out.push(`### ${e.company}`, '')
    for (const p of e.positions) {
      out.push(`- **${p.title}** (${span(p.start, p.end)})${p.focus ? `: ${p.focus}` : ''}`)
      if (p.skills?.length) out.push(`  - Skills: ${p.skills.join(', ')}`)
    }
    out.push('')
  }

  out.push('## Engineering capabilities', '')
  for (const c of CAPABILITIES) out.push(`### ${c.name}`, '', c.note, '', `Technologies: ${c.items.join(', ')}`, '')

  out.push('## Currently building: Mostisko', '', `Mostisko (মস্তিষ্ক, “the brain”) is an extensible, locally hosted AI workspace. Live: ${MOSTISKO_URL}`, '', `Stack: ${MOSTISKO_STACK.join(', ')}`, '')
  for (const m of MOSTISKO_MODULES) out.push(`- **${m.name}** (${m.status}): ${m.summary}`)
  out.push('')

  out.push('## Projects', '')
  for (const p of PROJECTS) {
    out.push(`### ${p.title}`, '', `${pitch(p)}`, '', `- URL: ${p.url}`, `- Status: ${p.status}${p.version ? `, ${p.version}` : ''}`)
    if (p.related) out.push(`- Related: [${p.related.label}](${p.related.url})`)
    if (p.caseStudy) {
      out.push('', p.caseStudy.what, '', 'What it does:', ...p.caseStudy.does.map(d => `- ${d}`), '', `Stack: ${p.caseStudy.stack.join(', ')}`)
    }
    out.push('')
  }
  out.push('### Earlier work', '', ...EARLIER_PROJECTS.map(p => `- ${p.url ? `[${p.title}](${p.url})` : p.title}: ${p.description}${p.stack ? ` (${p.stack.join(', ')})` : ''}`), '')

  out.push('## Experiments and research', '')
  for (const x of EXPERIMENTS) {
    out.push(`### ${x.title}`, '', `- Status: ${x.status}`, `- Objective: ${x.objective}`, `- Technology: ${x.technology.join(', ')}`, `- Findings: ${x.findings}`, '')
  }

  out.push('## Writing (on Medium)', '')
  for (const p of POSTS) out.push(`- [${p.title}](${p.url}), ${p.date}${p.excerpt ? `: ${p.excerpt}` : ''}`)
  out.push('')

  out.push('## Licenses and certifications', '', ...certs(), '')

  out.push('## Frequently asked questions', '')
  for (const f of FAQ) out.push(`### ${f.q}`, '', f.a, '')

  out.push('## Contact', '', ...contact(), '')
  return out.join('\n')
}
