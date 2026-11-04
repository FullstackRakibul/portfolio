// Books on the bookshelf (/bookshelf). Edit here; the pages only render it.
//
// Adding a book:
//   1. Put the PDF in public/books/<slug>.pdf and set `pdf: '/books/<slug>.pdf'`.
//      A PDF on another site works too (`pdf: 'https://…/file.pdf'`) when that site allows it
//      (CORS); if it does not, the reader offers to open the file in a new tab instead.
//   2. Optional cover: public/books/covers/<slug>.jpg (2:3). Without one, a cover is drawn
//      from the title, the author and `tint`.
//   3. A book that only exists in an online flipbook (AnyFlip, Issuu …) sets `embed` instead of `pdf`.
//
// The reader opens at /#/bookshelf/<slug> and remembers each reader's page in their browser.

export interface Book {
  /** Address of the book: /#/bookshelf/<slug>. Lowercase words joined by hyphens. */
  slug: string
  title: string
  author: string
  /** Year first published. */
  year?: number
  /** Shelf the book sits on; also the filter chips. */
  genre: string
  /** One or two sentences, shown on the featured card. */
  blurb?: string
  /** PDF read in the built-in reader. */
  pdf?: string
  /** An online viewer to embed instead, when there is no PDF. */
  embed?: string
  /** Cover image, ideally 2:3. */
  cover?: string
  /** Colour of the drawn cover when there is no image (and of the cover's glow). */
  tint: string
  /** Shown first on the shelf when nobody has started a book yet. */
  featured?: boolean
}

export const books: Book[] = [
  {
    slug: 'the-gift-of-the-magi',
    title: 'The Gift of the Magi',
    author: 'O. Henry',
    year: 1905,
    genre: 'Short stories',
    blurb: 'One dollar and eighty-seven cents, a day before Christmas, and two people who each give up the one thing they treasure.',
    pdf: '/books/the-gift-of-the-magi.pdf',
    cover: '/books/covers/the-gift-of-the-magi.jpg',
    tint: '#6d2a2a',
    featured: true,
  },
  {
    slug: 'the-last-leaf',
    title: 'The Last Leaf',
    author: 'O. Henry',
    year: 1907,
    genre: 'Short stories',
    blurb: 'In a Greenwich Village studio, a painter with pneumonia counts the ivy leaves outside her window.',
    pdf: '/books/the-last-leaf.pdf',
    cover: '/books/covers/the-last-leaf.jpg',
    tint: '#2f4a3a',
  },
  {
    slug: 'the-cask-of-amontillado',
    title: 'The Cask of Amontillado',
    author: 'Edgar Allan Poe',
    year: 1846,
    genre: 'Classics',
    blurb: 'A carnival night, a rare wine and a walk down into the catacombs: Poe’s coldest tale of revenge.',
    pdf: '/books/the-cask-of-amontillado.pdf',
    cover: '/books/covers/the-cask-of-amontillado.jpg',
    tint: '#1f2530',
  },
  {
    slug: 'to-kill-a-mockingbird',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    year: 1960,
    genre: 'Classics',
    blurb: 'Scout Finch, her brother Jem and their father Atticus, in a small Alabama town in the 1930s.',
    embed: 'https://online.anyflip.com/ijojv/xcod/index.html',
    cover: 'https://i0.wp.com/www.mindfulmuslimreader.com/wp-content/uploads/2022/10/mockingbird-e1666245397419.webp?w=800&ssl=1',
    tint: '#3d4a2c',
  },
]

export const findBook = (slug: string) => books.find(b => b.slug === slug)
