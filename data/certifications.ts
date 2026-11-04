// Licenses and certifications. Edit here; components/lab/Certifications.vue only renders it.
// Newest first. `issued` is 'YYYY-MM'. Add `url` only when there is a real credential page to link.

export interface Certification {
  title: string
  issuer: 'Anthropic'
  issued: string
  credentialId: string
  skills: string[]
  url?: string
}

export const CERTIFICATIONS: Certification[] = [
  { title: 'Model Context Protocol: Advanced Topics', issuer: 'Anthropic', issued: '2026-08', credentialId: '72z8cpbdgivn', skills: ['MCP Integration', 'MCP Server Development & Integration'] },
  { title: 'Building with the Claude API', issuer: 'Anthropic', issued: '2026-08', credentialId: '9msurd5d76bp', skills: ['Prompt Caching', 'Prompt Evaluation'] },
  { title: 'AI Fluency for Small Businesses', issuer: 'Anthropic', issued: '2026-08', credentialId: 'jpoab7kzusx2', skills: ['AI Fluency', 'AI Ethics & Governance'] },
  { title: 'AI Fluency for Students', issuer: 'Anthropic', issued: '2026-08', credentialId: 'bb57c6dnfbwf', skills: ['4Ds Framework', 'AI Fluency'] },
  { title: 'Claude Code in Action', issuer: 'Anthropic', issued: '2026-04', credentialId: 'j4mer56opqqf', skills: ['Agentic AI Development', 'AI Pair Programming'] },
  { title: 'Introduction to Claude Cowork', issuer: 'Anthropic', issued: '2026-04', credentialId: '58w5kxx7asvs', skills: ['Coworking', 'Agentic AI Development'] },
]
