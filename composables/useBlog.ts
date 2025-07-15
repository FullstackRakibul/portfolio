import blogData from "~/data/blog-posts.json"

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  readTime: string
  tags: string[]
  author: string
  featured: boolean
  category: string
}

export interface BlogData {
  posts: BlogPost[]
  categories: string[]
  tags: string[]
}

export const useBlog = () => {
  const data: BlogData = blogData

  const getAllPosts = (): BlogPost[] => {
    return data.posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const getFeaturedPosts = (): BlogPost[] => {
    return data.posts
      .filter((post) => post.featured)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const getPostBySlug = (slug: string): BlogPost | undefined => {
    return data.posts.find((post) => post.slug === slug)
  }

  const getPostsByCategory = (category: string): BlogPost[] => {
    return data.posts
      .filter((post) => post.category === category)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const getPostsByTag = (tag: string): BlogPost[] => {
    return data.posts
      .filter((post) => post.tags.includes(tag))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const getRecentPosts = (limit = 5): BlogPost[] => {
    return getAllPosts().slice(0, limit)
  }

  const searchPosts = (query: string): BlogPost[] => {
    const lowercaseQuery = query.toLowerCase()
    return data.posts
      .filter(
        (post) =>
          post.title.toLowerCase().includes(lowercaseQuery) ||
          post.excerpt.toLowerCase().includes(lowercaseQuery) ||
          post.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)) ||
          post.category.toLowerCase().includes(lowercaseQuery),
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const getAllCategories = (): string[] => {
    return data.categories
  }

  const getAllTags = (): string[] => {
    return data.tags
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return {
    getAllPosts,
    getFeaturedPosts,
    getPostBySlug,
    getPostsByCategory,
    getPostsByTag,
    getRecentPosts,
    searchPosts,
    getAllCategories,
    getAllTags,
    formatDate,
  }
}
