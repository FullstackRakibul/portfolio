<template>
  <div class="pt-20 pb-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h1 class="text-4xl sm:text-5xl font-bold mb-6">
          <span class="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Blog</span>
        </h1>
        <p class="text-xl text-gray-300">Thoughts on development, technology, and building great software</p>
      </div>

      <div class="grid gap-8">
        <BlogCard v-for="post in posts" :key="post.slug" :title="post.title" :excerpt="post.excerpt" :date="post.date"
          :readTime="post.readTime" :tags="post.tags" :slug="post.slug" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useHead } from '#app';

const posts = [
  {
    slug: 'building-scalable-enterprise-applications',
    title: 'Building Scalable Enterprise Applications with .NET Core',
    excerpt: 'Learn how to architect and build enterprise-grade applications using .NET Core, focusing on scalability, maintainability, and performance optimization.',
    date: '2024-01-15',
    readTime: '8 min read',
    tags: ['.NET', 'Enterprise', 'Architecture']
  },
  {
    slug: 'modern-frontend-development-with-vue',
    title: 'Modern Frontend Development with Vue.js and Nuxt',
    excerpt: 'Exploring the latest features in Vue.js ecosystem and how Nuxt.js can accelerate your development workflow with server-side rendering and static generation.',
    date: '2024-01-10',
    readTime: '6 min read',
    tags: ['Vue.js', 'Nuxt', 'Frontend']
  },
  {
    slug: 'database-optimization-strategies',
    title: 'Database Optimization Strategies for High-Performance Applications',
    excerpt: 'Deep dive into SQL Server optimization techniques, indexing strategies, and query performance tuning for enterprise applications.',
    date: '2024-01-05',
    readTime: '10 min read',
    tags: ['SQL Server', 'Performance', 'Database']
  },
  {
    slug: 'cloud-migration-azure-aws',
    title: 'Cloud Migration: From On-Premise to Azure and AWS',
    excerpt: 'A comprehensive guide to migrating enterprise applications to the cloud, comparing Azure and AWS services and best practices.',
    date: '2023-12-28',
    readTime: '12 min read',
    tags: ['Azure', 'AWS', 'Cloud Migration']
  },
  {
    slug: 'react-state-management-patterns',
    title: 'React State Management: From Redux to Zustand',
    excerpt: 'Comparing different state management solutions in React applications and when to use each approach for optimal performance.',
    date: '2023-12-20',
    readTime: '7 min read',
    tags: ['React', 'State Management', 'Redux']
  }
]

useHead({
  title: 'Blog - Rakibul H. Rabbi',
  meta: [
    { name: 'description', content: 'Read about software development, technology insights, and programming tutorials by Rakibul H. Rabbi.' }
  ]
})
</script>