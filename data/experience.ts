// Work history for the Experience timeline. Edit here; components/lab/Experience.vue only renders it.
// Order is the order on the page: newest first. Roles held at one company sit under that company.
// Months are 'YYYY-MM'; leave `end` out for a role that is still current.

export type EmploymentType = 'Full-time' | 'Part-time' | 'Freelance'

export interface Position {
  title: string
  start: string
  end?: string
  /** Shown after the dates, e.g. 'Dhaka, on-site'. */
  location?: string
  skills?: string[]
  /** One line on what the role centres on. */
  focus?: string
}

export interface Employer {
  company: string
  type: EmploymentType
  location?: string
  /** Total time at the company, as LinkedIn states it, for companies with more than one role. */
  tenure?: string
  /** The company's own line, shown as a quotation. */
  motto?: string
  /** A sentence about the work, when there is one. */
  note?: string
  positions: Position[]
}

export const EMPLOYERS: Employer[] = [
  {
    company: 'Ha-Meem Group',
    type: 'Full-time',
    location: 'Dhaka',
    positions: [
      {
        title: 'Software Support Engineer',
        start: '2023-11',
        skills: ['React.js', 'ASP.NET MVC', '.NET', 'SQL Server', 'Vue'],
        focus: 'Enterprise ERP: HRM, Payroll and Production.',
      },
    ],
  },
  {
    company: 'bdCalling IT Ltd',
    type: 'Full-time',
    location: 'Dhaka',
    positions: [{ title: 'Web Developer', start: '2023-08', end: '2023-11', skills: ['WordPress', 'Bubble.io'] }],
  },
  {
    company: 'Global IT Solutions',
    type: 'Full-time',
    location: 'Dhaka',
    positions: [{ title: 'Project Manager', start: '2023-06', end: '2023-08', skills: ['Vue.js', 'Laravel'] }],
  },
  {
    company: 'Creative Tech Park',
    type: 'Full-time',
    tenure: '1 yr 1 mo',
    positions: [
      { title: 'Project Manager', start: '2022-12', end: '2023-07', location: 'Dhaka, on-site', skills: ['Git', 'Vue.js'] },
      { title: 'Web Developer', start: '2022-07', end: '2022-11', skills: ['WordPress', 'Git'] },
    ],
  },
  {
    company: 'Pixlabit',
    type: 'Freelance',
    location: 'Dhaka',
    positions: [{ title: 'Web Developer', start: '2022-06', end: '2022-08', skills: ['WordPress'] }],
  },
  {
    company: 'Rabbitic.com',
    type: 'Full-time',
    location: 'Dhaka',
    motto: 'The Business That Makes Sense',
    positions: [{ title: 'Web Developer', start: '2021-07', end: '2022-08', skills: ['Laravel', 'CSS'] }],
  },
  {
    company: 'Xoombazar',
    type: 'Part-time',
    location: 'Jhalakathi, Barisal',
    tenure: '2 yrs 10 mos',
    positions: [
      { title: 'Web Developer', start: '2019-11', end: '2022-08', skills: ['Laravel', 'PHP'] },
      { title: 'Graphic Designer', start: '2020-06', end: '2022-08' },
    ],
  },
  {
    company: 'Buyme BD',
    type: 'Part-time',
    location: 'Dhaka',
    note: 'Full e-commerce site with complete WooCommerce functionality.',
    positions: [{ title: 'Web Developer', start: '2020-03', end: '2020-06' }],
  },
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** '2023-11' → 'Nov 2023'. */
export const monthLabel = (ym: string) => `${MONTHS[Number(ym.slice(5, 7)) - 1]} ${ym.slice(0, 4)}`

/** The years a company spans, e.g. '2023 → now' or '2019 → 2022'. */
export const employerYears = (e: Employer) => {
  const starts = e.positions.map(p => p.start).sort()
  const current = e.positions.some(p => !p.end)
  const ends = e.positions.map(p => p.end ?? '9999').sort()
  const from = starts[0]!.slice(0, 4)
  const to = current ? 'now' : ends[ends.length - 1]!.slice(0, 4)
  return from === to ? from : `${from} → ${to}`
}
