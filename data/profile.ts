// Who Rakibul is, in one place: the JSON-LD graph (composables/useSiteSchema.ts), /llms.txt and /llms-full.txt
// (server/routes), the FAQ (components/lab/Faq.vue), page descriptions and Calcifer (data/calcifer.ts) all read
// from here, so the site, the structured data and the AI-facing files can never say different things.
// Every value comes from content already on the site, or was confirmed by Rakibul.

import { CONTACT, FACTS, LOCATION, MOSTISKO_URL } from './portfolio'
import { EMPLOYERS, monthLabel } from './experience'
import { EARLIER_PROJECTS, PROJECTS } from './projects'

export const NAME = 'Rakibul H. Rabbi'
/** Confirmed by Rakibul; the spelling the résumé photo uses. */
export const ALTERNATE_NAME = 'Rakibul Hasan Rabbi'
/** Site hero title. LinkedIn uses the role title below, so both appear in the Person markup. */
export const JOB_TITLE = 'Full-Stack Engineer'
export const ROLE_TITLE = EMPLOYERS[0]!.positions[0]!.title // 'Software Support Engineer'
export const EMPLOYER = EMPLOYERS[0]!.company // 'Ha-Meem Group'
export const CITY = 'Dhaka'
export const COUNTRY = 'BD'
export const COUNTRY_NAME = 'Bangladesh'
export const PHOTO = '/assets/img/rakibul-h-hasan-office.jpg'

/** The one-line bio, used word for word everywhere (site, JSON-LD, llms.txt, Calcifer). */
export const BIO = `${NAME} is a full-stack engineer in ${CITY}, ${COUNTRY_NAME}, building enterprise ERP systems at ${EMPLOYER} with .NET, SQL Server and Vue.`

export const SAME_AS = [CONTACT.github, CONTACT.linkedin, CONTACT.medium]

export const KNOWS_ABOUT = [
  '.NET', 'C#', 'SQL Server', 'Vue.js', 'React', 'Angular', 'Laravel', 'Django',
  'Enterprise ERP', 'HRM and payroll systems', 'System architecture', 'Local AI infrastructure', 'Model Context Protocol',
]

/* Facts derived from the data files, never typed by hand. */
const starts = EMPLOYERS.flatMap(e => e.positions.map(p => p.start)).sort()
/** '2019-11': the first role on the site. */
export const CAREER_START = starts[0]!
export const CAREER_START_LABEL = monthLabel(CAREER_START)
export const COMPANY_COUNT = EMPLOYERS.length
export const PROJECT_COUNT = PROJECTS.length + EARLIER_PROJECTS.length
const role = EMPLOYERS[0]!.positions[0]!
export const CURRENT_FOCUS = role.focus ?? '' // 'Enterprise ERP: HRM, Payroll and Production.'
export const CURRENT_SINCE = monthLabel(role.start)

const pipilika = PROJECTS.find(p => p.id === 'pipilika')!

export interface FaqItem { q: string; a: string }

/** 40–60 words each, only facts on the site. */
export const FAQ: FaqItem[] = [
  {
    q: `Who is ${NAME}?`,
    a: `${BIO} He has worked in software since ${CAREER_START_LABEL}, across ${COMPANY_COUNT} companies, moving from WordPress and Laravel sites to enterprise systems. He also builds developer tools and Mostisko, a locally hosted AI workspace.`,
  },
  {
    q: `What does he work on at ${EMPLOYER}?`,
    a: `He has been a ${ROLE_TITLE} at ${EMPLOYER} since ${CURRENT_SINCE}. He works on the enterprise ERP behind the group's HRM, Payroll and Production, along with production workflows, HRM integrations, Windows-based services and other business-critical applications, using .NET, ASP.NET MVC, SQL Server, React and Vue.`,
  },
  {
    q: 'What is his tech stack?',
    a: 'On the backend he uses C#, .NET 8, ASP.NET Core and ASP.NET MVC, with Laravel and Node.js where a project already lives. Data sits in SQL Server. Interfaces are built in Vue.js, React and Angular. For AI work he runs local LLMs through Ollama and holds Anthropic certificates in the Model Context Protocol and the Claude API.',
  },
  {
    q: 'What is PIPILIKA?',
    a: `PIPILIKA is ${pipilika.kind?.toLowerCase()} built by ${NAME}, with the tagline “${pipilika.pitch}” It is in production at version ${pipilika.version?.replace(/^v/, '')} and is the first project on his portfolio, which borrows its look. A live version runs at ${pipilika.url.replace(/^https:\/\//, '').replace(/\/$/, '')}.`,
  },
  {
    q: 'What is Mostisko?',
    a: 'Mostisko (মস্তিষ্ক, “the brain”), also called RabbitIC on the site, is an extensible, locally hosted AI workspace he is building. It brings together conversation, context engineering, document intelligence, automation and enterprise workflows, running on Ollama and local LLMs. It is in active development, with some modules still planned.',
  },
  {
    q: 'Is he open to freelance or collaboration?',
    a: `Yes. He takes on freelance work and collaborations alongside his role at ${EMPLOYER}. Email is the best way to start: describe what you are working on and suggest a few times to talk. He is in ${CITY}, ${COUNTRY_NAME} (GMT+6).`,
  },
  {
    q: 'How can I contact him?',
    a: `Email ${CONTACT.email}; it is the fastest way to reach him, and for a call you can suggest a few times that suit you. He is also on LinkedIn (linkedin.com/in/fullstackrakibul), GitHub (github.com/fullstackrakibul) and Medium (@rakibul.h.rabbi), where he writes engineering notes. The site's assistant, Calcifer, can also point you to the right link.`,
  },
  {
    q: 'Where is he based?',
    a: `He is based in ${LOCATION.city}, where he works full-time at ${EMPLOYER}. His time zone is Bangladesh Standard Time (GMT+6, Asia/Dhaka); the footer of this site shows his current local time. Email is the easiest way to arrange a call across time zones.`,
  },
]

export const LINKS = { ...CONTACT, mostisko: MOSTISKO_URL }
export { FACTS }
