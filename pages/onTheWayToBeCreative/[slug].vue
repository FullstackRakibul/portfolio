<template>
  <div class="pt-20 pb-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <NuxtLink to="/onTheWayToBeCreative"
        class="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 transition-colors">
        <ArrowLeft class="w-4 h-4 mr-2" />
        Back to Blog
      </NuxtLink>

      <article v-if="post" class="prose prose-invert prose-lg max-w-none">
        <header class="mb-12">
          <!-- Category Badge -->
          <div class="mb-4">
            <span class="px-4 py-2 bg-blue-600/20 text-blue-400 text-sm rounded-full">
              {{ post.category }}
            </span>
          </div>

          <h1
            class="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            {{ post.title }}
          </h1>

          <div class="flex items-center justify-between text-gray-400 mb-6 flex-wrap gap-4">
            <div class="flex items-center space-x-4">
              <span>By {{ post.author }}</span>
              <span>{{ formatDate(post.date) }}</span>
              <span>{{ post.readTime }}</span>
            </div>
            <div v-if="post.featured" class="flex items-center text-yellow-400">
              <Star class="w-4 h-4 mr-1 fill-current" />
              <span class="text-sm">Featured</span>
            </div>
          </div>

          <div class="flex flex-wrap gap-2 mb-8">
            <span v-for="tag in post.tags" :key="tag"
              class="px-3 py-1 bg-gray-700/50 text-gray-300 text-sm rounded-full hover:bg-gray-600/50 transition-colors">
              {{ tag }}
            </span>
          </div>
        </header>

        <div class="prose-content text-gray-300 leading-relaxed space-y-6">
          <div v-html="post.content"></div>
        </div>

        <!-- Share Section -->
        <div class="mt-12 pt-8 border-t border-gray-700">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-white mb-2">Share this article</h3>
              <div class="flex space-x-4">
                <a :href="`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(currentUrl)}`"
                  target="_blank" class="text-gray-400 hover:text-blue-400 transition-colors">
                  <Share class="w-5 h-5" />
                </a>
                <a :href="`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`"
                  target="_blank" class="text-gray-400 hover:text-blue-600 transition-colors">
                  <Share class="w-5 h-5" />
                </a>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-400">Published on</p>
              <p class="text-white">{{ formatDate(post.date) }}</p>
            </div>
          </div>
        </div>
      </article>

      <!-- Related Posts -->
      <div v-if="relatedPosts.length > 0" class="mt-16">
        <h2 class="text-2xl font-bold text-white mb-8">Related Articles</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <BlogCard v-for="relatedPost in relatedPosts" :key="relatedPost.slug" :title="relatedPost.title"
            :excerpt="relatedPost.excerpt" :date="relatedPost.date" :readTime="relatedPost.readTime"
            :tags="relatedPost.tags" :slug="relatedPost.slug" :category="relatedPost.category" />
        </div>
      </div>

      <!-- <div v-else class="text-center py-16">
        <h1 class="text-2xl font-bold text-white mb-4">Post Not Found</h1>
        <p class="text-gray-400 mb-8">The blog post you're looking for doesn't exist.</p>
        <NuxtLink to="/blog"
          class="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
          <ArrowLeft class="w-4 h-4 mr-2" />
          Back to Blog
        </NuxtLink>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useHead } from '#app'
import { ArrowLeft, Star, Share } from 'lucide-vue-next'
import { useBlog } from '~/composables/useBlog'

const route = useRoute()
const slug = route.params.slug

const { getPostBySlug, getPostsByCategory, formatDate } = useBlog()

const post = getPostBySlug(slug)
const currentUrl = computed(() => {
  if (process.client) {
    return window.location.href
  }
  return `https://rabbitic.com/blog/${slug}`
})

const relatedPosts = computed(() => {
  if (!post) return []

  return getPostsByCategory(post.category)
    .filter(p => p.slug !== post.slug)
    .slice(0, 2)
})

useHead({
  title: post ? `${post.title} - Rakibul H. Rabbi` : 'Post Not Found - Rakibul H. Rabbi',
  meta: [
    { name: 'description', content: post ? post.excerpt : 'Blog post not found' },
    { name: 'author', content: post?.author || 'Rakibul H. Rabbi' },
    { property: 'og:title', content: post?.title || 'Post Not Found' },
    { property: 'og:description', content: post?.excerpt || 'Blog post not found' },
    { property: 'og:type', content: 'article' },
    { property: 'article:author', content: post?.author || 'Rakibul H. Rabbi' },
    { property: 'article:published_time', content: post?.date },
    { property: 'article:section', content: post?.category }
  ]
})
</script>

<style scoped>
/* .prose-content h2 {
  @apply text-2xl font-bold text-white mt-8 mb-4;
}

.prose-content h3 {
  @apply text-xl font-semibold text-white mt-6 mb-3;
}

.prose-content ul {
  @apply list-disc list-inside space-y-2 ml-4;
}

.prose-content ol {
  @apply list-decimal list-inside space-y-2 ml-4;
}

.prose-content li {
  @apply text-gray-300;
}

.prose-content p {
  @apply text-gray-300 leading-relaxed mb-4;
}

.prose-content blockquote {
  @apply border-l-4 border-blue-500 pl-4 italic text-gray-400 my-6;
}

.prose-content code {
  @apply bg-gray-800 px-2 py-1 rounded text-sm text-blue-400;
}

.prose-content pre {
  @apply bg-gray-800 p-4 rounded-lg overflow-x-auto my-6;
}

.prose-content strong {
  @apply font-semibold text-white;
} */
</style>