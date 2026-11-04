// Medium posts for the Writing section (home teaser) and the writing page (/onTheWayToBeCreative).
// Newest first. Adding a post is one entry. At build time server/api/writing.get.ts reads the Medium feed
// and adds any newer post automatically; this list fills in what the feed lacks (topic, read time) and is
// the fallback when the feed cannot be reached.
// Every detail below was taken from the feed or the post page on 2026-11-04: nothing is estimated.

export interface MediumPost {
  title: string
  url: string
  /** Publish date, 'YYYY-MM-DD'. */
  date: string
  /** The post's own opening line(s). */
  excerpt?: string
  /** Cover image from the post. */
  cover?: string
  /** As Medium shows it, e.g. '3 min read'. */
  readTime?: string
  /** One short topic label for the card. */
  topic?: string
  /** A related piece of work on this site. */
  related?: { label: string; url: string }
}

export const MEDIUM_PROFILE = 'https://medium.com/@rakibul.h.rabbi'
export const MEDIUM_FEED = 'https://medium.com/feed/@rakibul.h.rabbi'

const CDN = 'https://cdn-images-1.medium.com/max/1024/'

export const POSTS: MediumPost[] = [
  {
    title: 'LLM Temperature Explained: How It Controls AI Responses',
    url: 'https://medium.com/@rakibul.h.rabbi/llm-temperature-explained-how-it-controls-ai-responses-ed6621ec2d8d',
    date: '2026-11-02',
    excerpt: 'Have you ever noticed that an AI model can give different answers to the same question? Sometimes the response is direct and predictable.',
    cover: CDN + '1*6lcQPUeqfU6iKajUzrzlOg.png',
    readTime: '2 min read',
    topic: 'AI',
  },
  {
    title: 'Launching Calcifer 2.0',
    url: 'https://medium.com/@rakibul.h.rabbi/launching-calcifer-2-0-5d2fb7af9923',
    date: '2026-10-08',
    excerpt: 'A .NET 8 Microservice Template for Teams That Want Enterprise Basics Without Enterprise Complexity.',
    cover: CDN + '1*xCBPoDbfO12aZe-NRsSCUQ.jpeg',
    readTime: '3 min read',
    topic: 'Product',
    related: { label: 'Calcifer Shop', url: 'https://calcifershop.vercel.app/' },
  },
  {
    title: 'Boosting ASP.NET Core Performance: A Guide to Read-Only EF Core Queries',
    url: 'https://medium.com/@rakibul.h.rabbi/boosting-asp-net-core-performance-a-guide-to-read-only-ef-core-queries-9ba8dfd8e8a5',
    date: '2026-09-28',
    excerpt: 'When building ASP.NET Core applications, it’s common to have multiple database contexts.',
    cover: CDN + '1*L6orqEa19t2Ea3fLO5OHYQ.jpeg',
    readTime: '4 min read',
    topic: '.NET',
  },
  {
    title: 'Docker, Explained Like You’re a Developer Who Just Wants It to Work',
    url: 'https://medium.com/@rakibul.h.rabbi/docker-explained-like-youre-a-developer-who-just-wants-it-to-work-d9bfa8090f57',
    date: '2026-09-16',
    excerpt: 'Containers, images, Dockerfiles — without the 45-minute YouTube video.',
    cover: CDN + '1*Wb6cZm5j6MtlmsObbwpcZw.jpeg',
    readTime: '3 min read',
    topic: 'DevOps',
  },
  {
    title: 'Can’t Restore a .bak File? Here’s the Trick That Actually Works.',
    url: 'https://medium.com/@rakibul.h.rabbi/cant-restore-a-bak-file-here-s-the-trick-that-actually-works-1ce5f0ecc8da',
    date: '2026-09-16',
    excerpt: 'SQL Server 2022 backup. SQL Server 2017 target. Version mismatch. Let’s fix it.',
    cover: CDN + '1*f18GAfj4H5pe9Cs6lZvD1w.jpeg',
    readTime: '3 min read',
    topic: 'Databases',
  },
  {
    title: 'MIT, Apache 2.0, or GPL? Stop Guessing — Pick the Right Open-Source License in 5 Minutes',
    url: 'https://medium.com/@rakibul.h.rabbi/mit-apache-2-0-or-gpl-stop-guessing-pick-the-right-open-source-license-in-5-minutes-20675f513ebe',
    date: '2026-09-07',
    excerpt: 'A no-nonsense breakdown of the legal jargon to help you protect your code the way you actually want to.',
    cover: CDN + '1*weIQZKEdFwbK7d-jIeiljA.png',
    readTime: '4 min read',
    topic: 'Open source',
  },
  {
    title: 'Logarithmic Time Complexity Explained Simply: Understanding O(log n) as a Beginner',
    url: 'https://medium.com/@rakibul.h.rabbi/logarithmic-time-complexity-explained-simply-understanding-o-log-n-as-a-beginner-ffadedfd50c9',
    date: '2026-09-05',
    excerpt: 'When I first started learning Data Structures and Algorithms, Big O notation felt much more complicated than it actually is.',
    cover: CDN + '1*-T47O4WgEgP_0Hh-3EznRA.png',
    readTime: '6 min read',
    topic: 'Algorithms',
  },
  {
    title: 'Stop Organizing by Controllers. Start Screaming Your Business Domain.',
    url: 'https://medium.com/@rakibul.h.rabbi/stop-organizing-by-controllers-start-screaming-your-business-domain-2ff823c36df0',
    date: '2026-09-03',
    excerpt: 'Why your folder structure should tell a story about apartments, bookings, and payments — not about ASP.NET or Spring Boot.',
    cover: CDN + '1*RP9xyBrDS_AJiTbL9mTXSQ.jpeg',
    readTime: '4 min read',
    topic: 'Architecture',
  },
  {
    title: '6 Essential Cryptography Tools You Should Know in 2026',
    url: 'https://medium.com/@rakibul.h.rabbi/6-essential-cryptography-tools-you-should-know-in-2026-9825dfd4c244',
    date: '2026-08-30',
    excerpt: 'The Backbone of Modern Cybersecurity.',
    cover: CDN + '1*x9s6H1mFyskYFNm6cYWQ5g.jpeg',
    readTime: '4 min read',
    topic: 'Security',
  },
  {
    title: 'Finding Similarity in the Age of AI',
    url: 'https://medium.com/@rakibul.h.rabbi/finding-similarity-in-the-age-of-ai-1e770e5bc6a1',
    date: '2026-08-06',
    excerpt: 'What I Learned About Vector Databases.',
    cover: CDN + '1*ilQN-OTu8yUdUppxU0ITcw.png',
    readTime: '4 min read',
    topic: 'AI',
  },
]
