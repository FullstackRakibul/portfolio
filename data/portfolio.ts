// Content for the homepage. Edit here; components only render it.
// Experience, projects and certifications have their own files: experience.ts, projects.ts, certifications.ts.

export interface Fact { label: string; value: string }
export interface CapabilityGroup { id: string; name: string; note: string; items: string[] }
/** A real stack: tools that work together in one piece of work, drawn as a connected path. */
export interface CapabilityPath { id: string; label: string; note: string; items: string[] }
export type ModuleStatus = 'building' | 'planned'
export interface LabModule {
  id: string
  name: string
  latin?: string
  status: ModuleStatus
  summary: string
  /** position on the 600×440 system map */
  x: number
  y: number
  links: string[]
}
export type DiagramKind = 'local' | 'context' | 'gateway' | 'tracking' | 'template'
export interface Experiment {
  id: string
  title: string
  status: 'Ongoing' | 'Running in production' | 'Early notes'
  objective: string
  technology: string[]
  findings: string
  related: string[]
  /** drawn in code by components/lab/Diagram.vue */
  diagram: DiagramKind
  caption: string
}

export const CONTACT = {
  email: 'rakibul.cse.47@gmail.com',
  github: 'https://github.com/fullstackrakibul',
  linkedin: 'https://www.linkedin.com/in/fullstackrakibul/',
  website: 'https://rabbitic.com',
  medium: 'https://medium.com/@rakibul.h.rabbi',
}

export const LOCATION = { city: 'Dhaka, Bangladesh', lat: '23.8103° N', lon: '90.4125° E', timeZone: 'Asia/Dhaka' }

export const FACTS: Fact[] = [
  { label: 'Based in', value: 'Dhaka, Bangladesh' },
  { label: 'Works at', value: 'Ha-Meem Group' },
  { label: 'Role', value: 'Software Support Engineer, full-stack developer' },
]

export const BEYOND_WORK = [
  'Local AI infrastructure',
  'LLM-powered applications',
  'Developer productivity tools',
  'Automation',
]

export const CAPABILITIES: CapabilityGroup[] = [
  {
    id: 'backend',
    name: 'Backend engineering',
    note: 'C# and .NET for enterprise services; Laravel and Node.js where a project already lives.',
    items: ['C#', '.NET 8', 'ASP.NET Core', 'ASP.NET MVC', 'Laravel', 'Node.js', 'REST API architecture'],
  },
  {
    id: 'frontend',
    name: 'Frontend engineering',
    note: 'Vue and Nuxt by preference; React, Angular and Next.js when the team calls for them.',
    items: ['Vue.js', 'Nuxt.js', 'React', 'Angular', 'Next.js', 'TypeScript', 'Tailwind CSS'],
  },
  {
    id: 'database',
    name: 'Database engineering',
    note: 'SQL Server every working day: schema design and the queries production depends on.',
    items: ['Microsoft SQL Server', 'PostgreSQL', 'MySQL', 'SQLite', 'Query optimization', 'Database architecture'],
  },
  {
    id: 'infra',
    name: 'Infrastructure & DevOps',
    note: 'IIS and Windows services in production; Docker, Nginx and Linux for newer work.',
    items: ['Docker', 'IIS', 'Nginx', 'Git', 'CI/CD', 'Azure', 'AWS', 'Linux'],
  },
  {
    id: 'ai',
    name: 'AI & experimental',
    note: 'Ollama, local models and context engineering: the ground Mostisko stands on.',
    items: ['Ollama', 'Local LLM infrastructure', 'LLM context engineering', 'Agentic workflows', 'Document intelligence', 'AI-assisted development'],
  },
]

// Paths through the toolkit, from the work itself: confirm before launch.
export const CAPABILITY_PATHS: CapabilityPath[] = [
  {
    id: 'mostisko', label: 'Mostisko',
    note: 'The local AI workspace: a Vue client over .NET services, SQL Server for state, Ollama for the models.',
    items: ['Vue.js', '.NET 8', 'Microsoft SQL Server', 'Ollama', 'LLM context engineering', 'Agentic workflows'],
  },
  {
    id: 'enterprise', label: 'Enterprise systems',
    note: 'ERP and HRM work at Ha-Meem Group: C# services on IIS, SQL Server underneath, tuned queries for reporting.',
    items: ['ASP.NET MVC', 'C#', 'ASP.NET Core', 'Microsoft SQL Server', 'Query optimization', 'IIS'],
  },
  {
    id: 'tooling', label: 'Developer tools',
    note: 'Calcifer and Rookie: the API foundation and the scaffolding that stop the same work being done twice.',
    items: ['C#', 'ASP.NET Core', 'REST API architecture', 'Git'],
  },
]

// Status per module: confirm before launch.
export const MOSTISKO_MODULES: LabModule[] = [
  {
    id: 'oddity', name: 'Oddity', status: 'building', x: 300, y: 104, links: ['contextsource', 'workspace', 'core'],
    summary: 'An API gateway built around Ollama-compatible requests and responses, adding contextual processing, request tracking, analytics and per-user configuration.',
  },
  {
    id: 'contextsource', name: 'ContextSource', status: 'building', x: 132, y: 220, links: ['core'],
    summary: 'Context management that hands local models structured, relevant context instead of raw documents.',
  },
  {
    id: 'workspace', name: 'Agentic Workspace', status: 'building', x: 468, y: 220, links: ['core', 'contextsource'],
    summary: 'A workspace for intelligent task execution, document processing, data extraction and contextual AI workflows.',
  },
  {
    id: 'hr', name: 'মানব সম্পদ', latin: 'Human Resources', status: 'planned', x: 92, y: 360, links: ['contextsource'],
    summary: 'An AI-assisted HR knowledge system for company policies, employee benefits, settlement rules and HR documentation.',
  },
  {
    id: 'matrix', name: 'Matrix', status: 'planned', x: 300, y: 384, links: ['workspace'],
    summary: 'An experimental analytics engine that turns complex Excel and CSV reports into structured insight, dashboards and conversational analytics.',
  },
  {
    id: 'truth', name: 'সত্য মন্ত্রণালয়', latin: 'Ministry of Truth', status: 'planned', x: 508, y: 360, links: ['oddity'],
    summary: 'A public technology intelligence platform gathering programming news, cybersecurity updates and service status.',
  },
]

export const MOSTISKO_CORE = { x: 300, y: 236, label: 'Ollama · local LLMs' }
export const MOSTISKO_STACK = ['.NET 8', 'Vue.js', 'SQL Server', 'Ollama', 'Local LLMs', 'RBAC', 'Context engineering', 'Agentic workflows']
export const MOSTISKO_URL = 'https://mostisko.vercel.app'
export const MOSTISKO_REPO = 'https://github.com/FullstackRakibul/rabbitiChat'

// "Findings so far" are sample wording: confirm before launch.
export const EXPERIMENTS: Experiment[] = [
  {
    id: 'ollama',
    title: 'Running LLMs locally with Ollama',
    status: 'Ongoing',
    objective: 'Run useful language models on company hardware so documents never leave the building.',
    technology: ['Ollama', '.NET 8', 'Local LLMs'],
    findings: 'Temperature is a task setting, not a personality: near zero for extracting invoice fields, higher only when variation is the point.',
    related: ['Mostisko', 'Oddity'],
    diagram: 'local',
    caption: 'Documents stay inside the company network; the model runs beside them.',
  },
  {
    id: 'context',
    title: 'Context engineering',
    status: 'Ongoing',
    objective: 'Give a small local model the right few pages instead of everything, and measure the difference.',
    technology: ['Embeddings', 'SQL Server', 'Vue.js'],
    findings: 'Similarity search decides what the model sees; the quality of that selection matters more than model size.',
    related: ['ContextSource', 'Mostisko'],
    diagram: 'context',
    caption: 'Similarity search picks three pages of twenty-four for a small model.',
  },
  {
    id: 'gateway',
    title: 'An Ollama-compatible API gateway',
    status: 'Ongoing',
    objective: 'Keep the Ollama request shape so existing clients work, and add tracking, analytics and per-user settings behind it.',
    technology: ['ASP.NET Core', 'RBAC', 'Ollama API'],
    findings: 'Matching an existing protocol is the cheapest integration there is: every client that speaks Ollama works on day one.',
    related: ['Oddity'],
    diagram: 'gateway',
    caption: 'Any Ollama client, through Oddity, to the local model.',
  },
  {
    id: 'efcore',
    title: 'Read-only queries in EF Core',
    status: 'Running in production',
    objective: 'Cut the overhead of reporting screens that only read data in ASP.NET Core applications.',
    technology: ['ASP.NET Core', 'EF Core', 'SQL Server'],
    findings: 'Turning off change tracking for read-only queries removes work the screen never needed.',
    related: ['Ha-Meem ERP'],
    diagram: 'tracking',
    caption: 'The same query with and without change tracking.',
  },
  {
    id: 'tooling',
    title: 'Scaffolding instead of repeating',
    status: 'Running in production',
    objective: 'Stop rebuilding auth, RBAC and project structure for every new .NET service.',
    technology: ['C#', '.NET CLI', 'Clean Architecture'],
    findings: 'A template earns its keep the third time; Calcifer and Rookie exist because the same foundation kept coming back.',
    related: ['Calcifer', 'Rookie'],
    diagram: 'template',
    caption: 'One template, stamped into each new service.',
  },
]

/** Page sections in order. `bar: false` keeps a section out of the header bar (the menu and palette list all). */
export const SECTIONS: { id: string; label: string; bar?: false }[] = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'engineering', label: 'Engineering', bar: false },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'experiments', label: 'Experiments', bar: false },
  { id: 'writing', label: 'Writing' },
  { id: 'contact', label: 'Contact', bar: false },
]
