<template>
  <div class="pt-20 pb-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <NuxtLink to="/blog" class="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 transition-colors">
        <ArrowLeft class="w-4 h-4 mr-2" />
        Back to Blog
      </NuxtLink>

      <article v-if="post" class="prose prose-invert prose-lg max-w-none">
        <header class="mb-12">
          <h1
            class="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            {{ post.title }}
          </h1>
          <div class="flex items-center justify-between text-gray-400 mb-6">
            <div class="flex items-center space-x-4">
              <span>{{ formatDate(post.date) }}</span>
              <span>{{ post.readTime }}</span>
            </div>
          </div>
          <div class="flex flex-wrap gap-2 mb-8">
            <span v-for="tag in post.tags" :key="tag"
              class="px-3 py-1 bg-blue-600/20 text-blue-400 text-sm rounded-full">
              {{ tag }}
            </span>
          </div>
        </header>

        <div class="prose-content text-gray-300 leading-relaxed space-y-6">
          <div v-html="post.content"></div>
        </div>
      </article>

      <div v-else class="text-center py-16">
        <h1 class="text-2xl font-bold text-white mb-4">Post Not Found</h1>
        <p class="text-gray-400 mb-8">The blog post you're looking for doesn't exist.</p>
        <NuxtLink to="/blog"
          class="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
          <ArrowLeft class="w-4 h-4 mr-2" />
          Back to Blog
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useHead } from '#app'
import { ArrowLeft } from 'lucide-vue-next'

const route = useRoute()
const slug = route.params.slug

// Demo blog posts data
const posts = {
  'building-scalable-enterprise-applications': {
    title: 'Building Scalable Enterprise Applications with .NET Core',
    date: '2024-01-15',
    readTime: '8 min read',
    tags: ['.NET', 'Enterprise', 'Architecture'],
    content: `
      <p>Enterprise applications require careful planning, robust architecture, and scalable design patterns. In this comprehensive guide, we'll explore how to build enterprise-grade applications using .NET Core that can handle high traffic, complex business logic, and evolving requirements.</p>

      <h2>Understanding Enterprise Requirements</h2>
      <p>Before diving into code, it's crucial to understand what makes an application "enterprise-ready". Enterprise applications typically need to handle:</p>
      <ul>
        <li>High concurrent user loads</li>
        <li>Complex business workflows</li>
        <li>Integration with multiple systems</li>
        <li>Strict security requirements</li>
        <li>Comprehensive logging and monitoring</li>
      </ul>

      <h2>Architecture Patterns</h2>
      <p>When building enterprise applications with .NET Core, several architectural patterns prove invaluable:</p>

      <h3>Clean Architecture</h3>
      <p>Clean Architecture promotes separation of concerns by organizing code into layers with clear dependencies. The core business logic remains independent of external concerns like databases, web frameworks, or third-party services.</p>

      <h3>CQRS (Command Query Responsibility Segregation)</h3>
      <p>CQRS separates read and write operations, allowing you to optimize each for their specific use cases. This pattern is particularly useful in enterprise scenarios where read and write workloads have different scaling requirements.</p>

      <h2>Performance Optimization</h2>
      <p>Performance is critical in enterprise applications. Here are key strategies:</p>
      <ul>
        <li>Implement proper caching strategies using Redis or in-memory caching</li>
        <li>Use async/await patterns for I/O operations</li>
        <li>Optimize database queries and implement proper indexing</li>
        <li>Consider using background services for heavy processing</li>
      </ul>

      <h2>Security Considerations</h2>
      <p>Security should be built into the application from the ground up:</p>
      <ul>
        <li>Implement proper authentication and authorization</li>
        <li>Use HTTPS everywhere</li>
        <li>Validate and sanitize all inputs</li>
        <li>Implement proper error handling without exposing sensitive information</li>
      </ul>

      <h2>Conclusion</h2>
      <p>Building scalable enterprise applications with .NET Core requires careful consideration of architecture, performance, security, and maintainability. By following these patterns and best practices, you can create robust applications that serve your organization's needs both today and in the future.</p>
    `
  },
  'modern-frontend-development-with-vue': {
    title: 'Modern Frontend Development with Vue.js and Nuxt',
    date: '2024-01-10',
    readTime: '6 min read',
    tags: ['Vue.js', 'Nuxt', 'Frontend'],
    content: `
      <p>Vue.js has evolved significantly over the years, and with the introduction of Vue 3 and the Composition API, along with the powerful Nuxt framework, frontend development has become more efficient and enjoyable than ever.</p>

      <h2>Vue 3 and the Composition API</h2>
      <p>The Composition API introduced in Vue 3 provides a more flexible way to organize component logic. Unlike the Options API, the Composition API allows you to group related logic together, making components more maintainable as they grow in complexity.</p>

      <h3>Benefits of the Composition API</h3>
      <ul>
        <li>Better TypeScript support</li>
        <li>More flexible code organization</li>
        <li>Easier logic reuse between components</li>
        <li>Better tree-shaking for smaller bundle sizes</li>
      </ul>

      <h2>Nuxt: The Vue.js Framework</h2>
      <p>Nuxt.js builds on top of Vue.js to provide a complete framework for building modern web applications. It offers several key advantages:</p>

      <h3>Server-Side Rendering (SSR)</h3>
      <p>Nuxt provides built-in SSR capabilities, which improve SEO and initial page load times. This is particularly important for content-heavy websites and applications that need to be discoverable by search engines.</p>

      <h3>Static Site Generation (SSG)</h3>
      <p>With Nuxt's static generation capabilities, you can pre-render your entire application at build time, resulting in incredibly fast websites that can be deployed to any static hosting service.</p>

      <h2>Modern Development Workflow</h2>
      <p>Nuxt 3 introduces several improvements to the development experience:</p>
      <ul>
        <li>Auto-imports for components, composables, and utilities</li>
        <li>File-based routing with dynamic routes</li>
        <li>Built-in TypeScript support</li>
        <li>Hybrid rendering modes</li>
      </ul>

      <h2>Performance Optimization</h2>
      <p>Modern Vue.js applications can achieve excellent performance through:</p>
      <ul>
        <li>Code splitting and lazy loading</li>
        <li>Image optimization</li>
        <li>Proper caching strategies</li>
        <li>Bundle analysis and optimization</li>
      </ul>

      <h2>Conclusion</h2>
      <p>Vue.js and Nuxt provide a powerful combination for building modern web applications. Whether you're building a simple website or a complex application, these tools offer the flexibility and performance you need to create exceptional user experiences.</p>
    `
  },
  'database-optimization-strategies': {
    title: 'Database Optimization Strategies for High-Performance Applications',
    date: '2024-01-05',
    readTime: '10 min read',
    tags: ['SQL Server', 'Performance', 'Database'],
    content: `
      <p>Database performance is often the bottleneck in enterprise applications. Understanding how to optimize your database queries, indexes, and overall database design is crucial for building high-performance applications that can scale with your business needs.</p>

      <h2>Understanding Query Performance</h2>
      <p>Before optimizing, you need to understand how your queries are performing. SQL Server provides several tools for this:</p>
      <ul>
        <li>SQL Server Management Studio (SSMS) execution plans</li>
        <li>Dynamic Management Views (DMVs)</li>
        <li>SQL Server Profiler and Extended Events</li>
        <li>Query Store for historical performance data</li>
      </ul>

      <h2>Indexing Strategies</h2>
      <p>Proper indexing is fundamental to database performance:</p>

      <h3>Clustered Indexes</h3>
      <p>Every table should have a clustered index, typically on the primary key. The clustered index determines the physical order of data in the table.</p>

      <h3>Non-Clustered Indexes</h3>
      <p>Create non-clustered indexes on columns frequently used in WHERE clauses, JOIN conditions, and ORDER BY clauses. However, be mindful that too many indexes can slow down INSERT, UPDATE, and DELETE operations.</p>

      <h3>Covering Indexes</h3>
      <p>Covering indexes include all columns needed for a query, allowing the database engine to satisfy the query entirely from the index without accessing the base table.</p>

      <h2>Query Optimization Techniques</h2>
      <p>Several techniques can dramatically improve query performance:</p>

      <h3>Avoid SELECT *</h3>
      <p>Only select the columns you actually need. This reduces network traffic and memory usage.</p>

      <h3>Use Appropriate JOIN Types</h3>
      <p>Understand the difference between INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN, and use the most restrictive join that meets your requirements.</p>

      <h3>Optimize WHERE Clauses</h3>
      <p>Place the most selective conditions first in your WHERE clause, and avoid functions on columns in WHERE clauses as they prevent index usage.</p>

      <h2>Database Design Best Practices</h2>
      <p>Good database design is the foundation of performance:</p>
      <ul>
        <li>Normalize your data to eliminate redundancy</li>
        <li>Use appropriate data types</li>
        <li>Implement proper constraints</li>
        <li>Consider partitioning for very large tables</li>
      </ul>

      <h2>Monitoring and Maintenance</h2>
      <p>Regular maintenance is essential for sustained performance:</p>
      <ul>
        <li>Update statistics regularly</li>
        <li>Rebuild or reorganize fragmented indexes</li>
        <li>Monitor for blocking and deadlocks</li>
        <li>Review and optimize the most expensive queries</li>
      </ul>

      <h2>Conclusion</h2>
      <p>Database optimization is an ongoing process that requires understanding your application's data access patterns, proper indexing strategies, and regular monitoring. By implementing these strategies, you can ensure your applications perform well even as your data grows.</p>
    `
  }
}

const post = posts[slug]

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

useHead({
  title: post ? `${post.title} - Rakibul H. Rabbi` : 'Post Not Found - Rakibul H. Rabbi',
  meta: [
    { name: 'description', content: post ? `${post.title} - Read more on the blog of Rakibul H. Rabbi` : 'Blog post not found' }
  ]
})
</script>

<style scoped>

</style>