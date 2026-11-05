// The library at /bookshelf. Edit here; the pages only render it.
//
// Adding a book is one line:
//   fromUrl('https://api.hameemgroup.com:9012/Resources/Pdfs/Title_Words-Author_Name.pdf', { categories: ['classics'] }),
// The file name gives the title and the author (underscores are spaces, the author follows the last "-"),
// the slug (/#/bookshelf/<slug>) and a cover colour. Override anything in the second argument:
// title, author, year, language, description, pagesHint, addedAt ('YYYY-MM-DD', for "Recently added").
//
// Hosting: a PDF on another site must allow this one to read it (CORS) and answer Range requests, or the
// reader falls back to the browser's own viewer. See "Bookshelf" in CLAUDE.md for the headers it needs.
// A book that only exists as an online flipbook (AnyFlip, Issuu …) sets `embed` instead of `pdf`.

export interface Category {
  id: string
  name: string
  /** One line, shown under the category's name. */
  description: string
}

export interface Book {
  /** Address of the book: /#/bookshelf/<slug>. Lowercase words joined by hyphens. */
  slug: string
  title: string
  author: string
  /** Shelves the book sits on (Category ids); a book can be on several. */
  categories: string[]
  /** Year first published. */
  year?: number
  /** Language the book was first written in. */
  language?: string
  /** One or two sentences, shown on the "Continue reading" card and in search. */
  description?: string
  /** Page count of the PDF, shown before it is opened. */
  pagesHint?: number
  /** Day the book joined the library (ISO date), for "Recently added". */
  addedAt?: string
  /** PDF read in the built-in reader. */
  pdf?: string
  /** An online viewer to embed instead, when there is no PDF. */
  embed?: string
  /** Cover image, ideally 2:3. Without one, a cover is set from the title, the author and `tint`. */
  cover?: string
  /** Colour of the drawn cover. */
  tint: string
  /** Shown first on the shelf when nobody has started a book yet. */
  featured?: boolean
}

export const categories: Category[] = [
  { id: 'russian', name: 'Russian literature', description: 'Tolstoy, Dostoevsky and Turgenev: the long Russian nineteenth century.' },
  { id: 'philosophy', name: 'Philosophy & mind', description: 'How to think, argue and live, from Schopenhauer to Gibran.' },
  { id: 'strategy', name: 'Strategy & power', description: 'On winning: war, statecraft and the argument at the table.' },
  { id: 'poetry', name: 'Poetry', description: 'Verse to read slowly, and aloud.' },
  { id: 'drama', name: 'Drama', description: 'Plays for the page: jealousy, and a comedy of manners.' },
  { id: 'gothic', name: 'Gothic & strange', description: 'Plagues, doubles, a raven, and a man who wakes as an insect.' },
  { id: 'classics', name: 'Classic novels', description: 'The long novels everyone means to read.' },
  { id: 'esoteric', name: 'Esoteric', description: 'Old books of hidden arts.' },
]

/** Cover colours: deep enough for light lettering, none of them loud. */
const PALETTE = ['#6d2a2a', '#2f4a3a', '#1f2530', '#3d4a2c', '#5a3d28', '#1f4447', '#2b2b2b', '#6b5320', '#4a2c34', '#34403f']

export const slugify = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

/** The same colour for the same book on every visit. */
function tintFor(slug: string) {
  let h = 0
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return PALETTE[h % PALETTE.length]
}

type Overrides = Partial<Omit<Book, 'pdf'>> & Pick<Book, 'categories'>

/** A book from its PDF's address: `Title_Words-Author_Name.pdf` gives the title, the author and the slug. */
export function fromUrl(url: string, overrides: Overrides): Book {
  const file = decodeURIComponent(url.split(/[?#]/)[0].split('/').pop() ?? '').replace(/\.pdf$/i, '')
  const cut = file.lastIndexOf('-')
  const words = (s: string) => s.replace(/_/g, ' ').replace(/\s+/g, ' ').trim()
  const title = overrides.title ?? words(cut > 0 ? file.slice(0, cut) : file)
  const author = overrides.author ?? (cut > 0 ? words(file.slice(cut + 1)) : 'Unknown')
  const slug = overrides.slug ?? slugify(title)
  return { tint: tintFor(slug), ...overrides, slug, title, author, pdf: url }
}

const HOST = 'https://api.hameemgroup.com:9012/Resources/Pdfs/'
const ADDED = '2026-11-05'

export const books: Book[] = [
  fromUrl(`${HOST}War_and_Peace-Leo_Tolstoy.pdf`, { categories: ['russian', 'classics'], year: 1869, language: 'Russian', pagesHint: 1736, addedAt: ADDED, description: 'Five families, Napoleon’s march on Moscow and the long peace after it: Tolstoy’s novel of history and of private lives.' }),
  fromUrl(`${HOST}Anna_Karenina-Leo_Tolstoy.pdf`, { categories: ['russian', 'classics'], year: 1878, language: 'Russian', pagesHint: 1069, addedAt: ADDED, description: 'A marriage in Petersburg society comes apart, while on a country estate Levin looks for a life that means something.' }),
  fromUrl(`${HOST}A_Confession-Leo_Tolstoy.pdf`, { categories: ['russian', 'philosophy'], year: 1882, language: 'Russian', pagesHint: 79, addedAt: ADDED, description: 'At the height of his fame, Tolstoy asks what any of it is for, and writes down how he found an answer.' }),
  fromUrl(`${HOST}The_Death_of_Ivan_Ilych-Leo_Tolstoy.pdf`, { categories: ['russian'], year: 1886, language: 'Russian', pagesHint: 66, addedAt: ADDED, description: 'A judge who did everything properly falls ill, and has to face the question of whether he lived at all.' }),
  fromUrl(`${HOST}Crime_and_Punishment-Fyodor_Dostoevsky.pdf`, { categories: ['russian', 'classics'], year: 1866, language: 'Russian', pagesHint: 557, addedAt: ADDED, description: 'A poor former student kills a pawnbroker to prove a theory, then lives through what it does to him.' }),
  fromUrl(`${HOST}The_Brothers_Karamazov-Fyodor_Dostoevsky.pdf`, { categories: ['russian', 'classics'], year: 1880, language: 'Russian', pagesHint: 852, addedAt: ADDED, description: 'Three brothers, their father’s murder and a trial: Dostoevsky’s last novel, on faith, doubt and freedom.' }),
  fromUrl(`${HOST}The_Idiot-Fyodor_Dostoevsky.pdf`, { categories: ['russian', 'classics'], year: 1869, language: 'Russian', pagesHint: 641, addedAt: ADDED, description: 'Prince Myshkin, a truly good man, returns to Petersburg society, and it cannot hold him.' }),
  fromUrl(`${HOST}Notes_from_Underground-Fyodor_Dostoevsky.pdf`, { categories: ['russian', 'philosophy'], year: 1864, language: 'Russian', pagesHint: 126, addedAt: ADDED, description: 'A bitter, brilliant voice from under the floorboards argues against reason, progress and himself.' }),
  fromUrl(`${HOST}White_Nights-Fyodor_Dostoevsky.pdf`, { categories: ['russian'], year: 1848, language: 'Russian', pagesHint: 66, featured: true, addedAt: ADDED, description: 'Four nights in a Petersburg summer: a lonely dreamer meets a young woman waiting for someone else.' }),
  fromUrl(`${HOST}The_Dream_of_a_Ridiculous_Man-Fyodor_Dostoevsky.pdf`, { categories: ['russian'], year: 1877, language: 'Russian', pagesHint: 25, addedAt: ADDED, description: 'A man resolved to die falls asleep and dreams of an innocent world, and of how he ruined it.' }),
  fromUrl(`${HOST}First_Love-Ivan_Turgenev.pdf`, { categories: ['russian'], year: 1860, language: 'Russian', pagesHint: 78, addedAt: ADDED, description: 'One summer at a dacha, a sixteen-year-old falls for the princess next door, and learns who else loves her.' }),
  fromUrl(`${HOST}As_a_Man_Thinketh-James_Allen.pdf`, { categories: ['philosophy'], year: 1903, language: 'English', pagesHint: 29, addedAt: ADDED, description: 'A short essay on how the way we think shapes our character, our health and our circumstances.' }),
  fromUrl(`${HOST}The_Art_of_Being_Right-Arthur_Schopenhauer.pdf`, { categories: ['philosophy', 'strategy'], year: 1831, language: 'German', pagesHint: 46, addedAt: ADDED, description: 'Thirty-eight tricks for winning an argument whether you are right or not, set out with a straight face.' }),
  fromUrl(`${HOST}The_Prophet-Khalil_Gibran.pdf`, { categories: ['philosophy', 'poetry'], year: 1923, language: 'English', pagesHint: 49, author: 'Khalil Gibran', addedAt: ADDED, description: 'Before he sails home, the prophet Almustafa speaks to the people of Orphalese on love, work, children and death.' }),
  fromUrl(`${HOST}The_Art_of_War-Sun_Tzu.pdf`, { categories: ['strategy'], language: 'Chinese', pagesHint: 47, addedAt: ADDED, description: 'Thirteen chapters on conflict, attributed to the general Sun Tzu: win without fighting where you can.' }),
  fromUrl(`${HOST}The_Prince-Niccolo_Machiavelli.pdf`, { categories: ['strategy'], year: 1532, language: 'Italian', pagesHint: 79, author: 'Niccolò Machiavelli', addedAt: ADDED, description: 'How a prince takes power and keeps it, written for the Medici by a diplomat out of work.' }),
  fromUrl(`${HOST}Paradise_Lost-John_Milton.pdf`, { categories: ['poetry'], year: 1667, language: 'English', pagesHint: 309, addedAt: ADDED, description: 'Satan’s fall, Eden, and the loss of it, in twelve books of blank verse.' }),
  fromUrl(`${HOST}The_Raven-Edgar_Allan_Poe.pdf`, { categories: ['poetry', 'gothic'], year: 1845, language: 'English', pagesHint: 7, addedAt: ADDED, description: 'A grieving student, a December midnight, and a bird that has only one word.' }),
  fromUrl(`${HOST}Othello-William_Shakespeare.pdf`, { categories: ['drama'], year: 1603, language: 'English', pagesHint: 202, addedAt: ADDED, description: 'A general, his wife Desdemona and Iago, who turns trust into jealousy one hint at a time.' }),
  fromUrl(`${HOST}The_Importance_of_Being_Earnest-Oscar_Wilde.pdf`, { categories: ['drama'], year: 1895, language: 'English', pagesHint: 67, addedAt: ADDED, description: 'Two young men invent people to escape their duties, and both court as “Ernest”. Wilde’s last play.' }),
  fromUrl(`${HOST}The_Masque_of_the_Red_Death-Edgar_Allan_Poe.pdf`, { categories: ['gothic'], year: 1842, language: 'English', pagesHint: 9, addedAt: ADDED, description: 'A prince walls his court inside an abbey to wait out a plague, and throws a masked ball.' }),
  fromUrl(`${HOST}The_Strange_Case_of_Dr._Jekyll_and_Mr._Hyde-Robert_Louis_Stevenson.pdf`, { categories: ['gothic'], year: 1886, language: 'English', pagesHint: 72, title: 'Dr. Jekyll and Mr. Hyde', addedAt: ADDED, description: 'A London lawyer looks into the link between his respectable friend Dr. Jekyll and the brutal Mr. Hyde.' }),
  fromUrl(`${HOST}The_Metamorphosis-Franz_Kafka.pdf`, { categories: ['gothic'], year: 1915, language: 'German', pagesHint: 49, addedAt: ADDED, description: 'Gregor Samsa wakes up as a giant insect, and his family has to decide what he is to them now.' }),
  fromUrl(`${HOST}The_Adventures_of_Tom_Sawyer-Mark_Twain.pdf`, { categories: ['classics'], year: 1876, language: 'English', pagesHint: 212, addedAt: ADDED, description: 'A boy on the Mississippi whitewashes a fence, witnesses a murder and gets lost in a cave.' }),
  {
    slug: 'to-kill-a-mockingbird',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    categories: ['classics'],
    year: 1960,
    language: 'English',
    addedAt: '2026-11-04',
    description: 'Scout Finch, her brother Jem and their father Atticus, in a small Alabama town in the 1930s.',
    embed: 'https://online.anyflip.com/ijojv/xcod/index.html',
    cover: 'https://i0.wp.com/www.mindfulmuslimreader.com/wp-content/uploads/2022/10/mockingbird-e1666245397419.webp?w=800&ssl=1',
    tint: '#3d4a2c',
  },
]

export const findBook = (slug: string) => books.find(b => b.slug === slug)
export const findCategory = (id: string) => categories.find(c => c.id === id)
export const booksIn = (id: string) => books.filter(b => b.categories.includes(id))
export const categoryNames = (b: Book) => b.categories.map(id => findCategory(id)?.name ?? id)
