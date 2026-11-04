// Projects for the Projects section. Edit here; components/lab/Projects.vue only renders it.
// Each entry is a card. `featured` makes the large card at the top (one at a time).
// The status sets the badge and the group the card appears in.

export type ProjectStatus = 'production' | 'live' | 'experiment' | 'hobby'

export interface CaseStudy {
  what: string
  does: string[]
  stack: string[]
  solved: { problem: string; fix: string }[]
  next: string[]
}

export interface Project {
  id: string
  title: string
  /** What the product is, shown beside the title. */
  kind?: string
  /** One line. Set `quote` when it is the product's own tagline. */
  pitch: string
  quote?: boolean
  /** Language of the pitch when it is not English, e.g. 'bn'. */
  lang?: string
  /** English rendering of a pitch in another language. */
  translation?: string
  url: string
  /** Version shown in an outlined pill, as the product states it. */
  version?: string
  status: ProjectStatus
  /** Screenshot of the live site, 16:10, in public/assets/work. */
  image?: string
  featured?: boolean
  caseStudy?: CaseStudy
}

/** Older work, listed compactly under the cards. */
export interface EarlierProject { title: string; url?: string; description: string; stack?: string[] }

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  production: 'Production',
  live: 'Live',
  experiment: 'Experiment',
  hobby: 'Hobby',
}

export const PROJECT_GROUPS: { status: ProjectStatus; title: string }[] = [
  { status: 'live', title: 'Work and client sites' },
  { status: 'experiment', title: 'Experimental' },
  { status: 'hobby', title: 'Hobby' },
]

const W = '/assets/work/'

export const PROJECTS: Project[] = [
  {
    id: 'pipilika',
    title: 'PIPILIKA',
    kind: 'Attendance Management Software',
    pitch: 'Because every second matters.',
    quote: true,
    url: 'https://pipilika-terminal.vercel.app/',
    version: 'v1.1',
    status: 'production',
    image: W + 'pipilika.jpg',
    featured: true,
  },
  {
    id: 'ha-meem-group',
    title: 'Ha-Meem Group',
    pitch: 'Corporate website.',
    url: 'https://ha-meem-group.vercel.app/',
    status: 'live',
    image: W + 'ha-meem-group.jpg',
  },
  {
    id: 'ha-meem-ching-tai',
    title: 'Ha-Meem Ching Tai',
    pitch: 'Fabrics are mostly made in Bangladesh; accessories were not. We make them here: pocketing, interlinings, labels.',
    quote: true,
    url: 'https://ha-meem-ching-tai.vercel.app/',
    status: 'live',
    image: W + 'ha-meem-ching-tai.jpg',
  },
  {
    id: 'ats-cv',
    title: 'ATS Optimization Platform (CV)',
    pitch: 'Optimizes CVs for applicant tracking systems.',
    url: 'https://calciferphoenix.vercel.app/',
    status: 'live',
    image: W + 'ats-cv.jpg',
  },
  {
    id: 'calcifer-shop',
    title: 'Calcifer Shop',
    pitch: 'Stop Writing Code. Start Controlling Value.',
    quote: true,
    url: 'https://calcifershop.vercel.app/',
    status: 'live',
    image: W + 'calcifer-shop.jpg',
  },
  {
    id: 'newspaper-ui',
    title: 'Newspaper UI',
    pitch: 'News portal interface.',
    url: 'https://newspaper-ui-one.vercel.app/',
    status: 'live',
    image: W + 'newspaper-ui.jpg',
  },
  {
    id: 'featured-artworks',
    title: 'Featured Artworks',
    pitch: 'Art and sign-symbol gallery.',
    url: 'https://artsignsymbols.vercel.app/',
    status: 'live',
    image: W + 'featured-artworks.jpg',
  },
  {
    id: 'kotha',
    title: 'কথা (Kotha)',
    pitch: 'একসাথে আড্ডা, সিনেমা এবং বই পড়া — এখন এক জায়গাতেই।',
    lang: 'bn',
    translation: 'Hangouts, movies and reading together, all in one place.',
    url: 'https://kotha-bondhu.vercel.app/',
    status: 'live',
    image: W + 'kotha.jpg',
  },
  {
    id: 'election-admin',
    title: 'Election Management Admin Panel',
    kind: 'Election Data Entry Module',
    pitch: 'A Vue 3 and TypeScript admin panel where election officers enter, search and filter vote records.',
    // The /login route returns 404 when opened directly; the root redirects to it.
    url: 'https://django-election-app.vercel.app/',
    status: 'experiment',
    image: W + 'election-admin.jpg',
    caseStudy: {
      what: 'A Vue 3 + TypeScript admin panel where election officers enter, search and filter vote records. It is one module of a larger system with Election Summary, Users, Common Data, Operations and Election configuration sections.',
      does: [
        'Entry form for vote count, election, worker or officer, election center and a “Sent to Audit” flag, with validation and reset on submit.',
        'Records table with search, pagination and an audit-status filter, showing readable names instead of raw IDs.',
        'Recursive, typed menu navigation.',
      ],
      stack: ['Vue 3 Composition API', 'TypeScript', 'Ant Design Vue', 'Tailwind CSS', 'Ant Design Icons', 'Custom API service layer'],
      solved: [
        { problem: 'Election centers not displaying.', fix: 'Fixed the service call and added fallbacks.' },
        { problem: 'Crash on menu items without icons.', fix: 'Made the icon optional, added safe rendering and typed the recursive findMenuItem.' },
        { problem: 'Raw IDs in the table.', fix: 'Replaced them with lookup-resolved names.' },
      ],
      next: [
        'Loading states',
        'Success and error notifications',
        'Duplicate checks',
        'Role-based permissions',
        'Unit tests for the lookups and menu recursion',
        'Centralized data loading',
      ],
    },
  },
  {
    id: 'primordial-spiral',
    title: 'The Primordial Spiral',
    // The site's own subtitle.
    pitch: 'String theory and the mathematical black hole.',
    url: 'https://fullstackrakibul.github.io/sweetheart/',
    status: 'hobby',
    image: W + 'primordial-spiral.jpg',
  },
]

export const EARLIER_PROJECTS: EarlierProject[] = [
  { title: 'Corporate Assistant', url: 'https://corporate-assistant-lac.vercel.app', description: 'HR, finance and career tools', stack: ['Vue'] },
  { title: 'Channel 24 CRM', url: 'https://panel-ch24.vercel.app/#/login', description: 'Billing and client management panel', stack: ['Vue'] },
  { title: 'Les Showdagar', url: 'https://les-showdagar.vercel.app/', description: 'Inventory and premium storefront', stack: ['Vue'] },
  { title: 'Shobdo Bisharod', url: 'https://shobdo-bisharod21.vercel.app', description: 'Dynamic web application', stack: ['Vue'] },
  { title: 'Weavo Go', url: 'https://weavo-go.vercel.app/', description: 'Dynamic web platform' },
  { title: '5 Lakhs Portal', url: 'https://5lakhs.vercel.app/', description: 'Secure portal with authentication', stack: ['Vue'] },
  { title: 'Calcifer', url: 'https://www.nuget.org/packages/Calcifer.Microservice.Api.Template', description: 'Microservice API template: core, auth, RBAC', stack: ['C#', '.NET'] },
  { title: 'Rookie', description: '.NET scaffolding CLI', stack: ['C#', '.NET'] },
  { title: 'Global IT Solutions', url: 'https://globalitsolutions.com.bd/', description: 'Technology agency website' },
  { title: 'Taash Clothing', url: 'https://taashclothing.com/', description: 'Fashion and apparel store' },
  { title: 'Paakhi Home', url: 'https://paakhihome.com/', description: 'Home decor and furniture store' },
  { title: 'Spice N Organics', url: 'https://spice-n-organics.com/', description: 'Organic grocery and spices' },
  { title: 'Green Foods Express', url: 'https://greenfoods.express/', description: 'Fresh food delivery' },
  { title: 'Opa Care', url: 'https://opacare.net/', description: 'Personal care products store' },
  { title: 'Zeen Woman', url: 'https://zeenwoman.com/', description: "Women's fashion and lifestyle" },
  { title: 'Miah Shop', url: 'https://miah.shop/', description: 'E-commerce storefront' },
  { title: 'Restaurant Basmati', url: 'https://restaurantbasmati.com/', description: 'Restaurant menu and booking' },
  { title: 'My Prime Box', url: 'https://myprimebox.com/', description: 'Subscription box service' },
  { title: 'Innovative BD', url: 'https://innovativebd.org/', description: 'Organisation and initiatives' },
]
