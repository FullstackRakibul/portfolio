<template>
  <div class="pt-20 pb-16">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-16">
        <h1 class="text-4xl sm:text-5xl font-bold mb-6">
          <span
            class="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">onTheWayToBeCreative</span>
        </h1>
        <p class="text-xl text-gray-300 mb-8">Thoughts on development, technology, and building great software</p>

        <!-- Search Bar -->
        <div class="max-w-md mx-auto mb-8">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input v-model="searchQuery" type="text" placeholder="Search articles..."
              class="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors" />
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="flex flex-wrap justify-center gap-2 mb-8">
          <button @click="selectedCategory = 'all'" :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          ]">
            All Posts
          </button>
          <button v-for="category in categories" :key="category" @click="selectedCategory = category" :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            selectedCategory === category
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          ]">
            {{ category }}
          </button>
        </div>
      </div>

      <!-- Featured Posts -->
      <div v-if="!searchQuery && selectedCategory === 'all'" class="mb-16">
        <h2 class="text-2xl font-bold text-white mb-8">Featured Articles</h2>
        <div class="grid md:grid-cols-2 gap-8">
          <BlogCard v-for="post in featuredPosts" :key="post.slug" :title="post.title" :excerpt="post.excerpt"
            :date="post.date" :readTime="post.readTime" :tags="post.tags" :slug="post.slug" :featured="true" />
        </div>
      </div>

      <!-- All Posts -->
      <div>
        <h2 class="text-2xl font-bold text-white mb-8">
          {{ searchQuery ? `Search Results (${filteredPosts.length})` : 'All Articles' }}
        </h2>
        <div v-if="filteredPosts.length > 0" class="grid gap-8">
          <BlogCard v-for="post in filteredPosts" :key="post.slug" :title="post.title" :excerpt="post.excerpt"
            :date="post.date" :readTime="post.readTime" :tags="post.tags" :slug="post.slug" :category="post.category" />
        </div>
        <div v-else class="text-center py-16">
          <div class="text-gray-400 mb-4">
            <Search class="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p class="text-xl">No articles found</p>
            <p class="text-sm">Try adjusting your search or filter criteria</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search } from 'lucide-vue-next'
import { useBlog } from '~/composables/useBlog'

const searchQuery = ref('')
const selectedCategory = ref('all')

const {
  getAllPosts,
  getFeaturedPosts,
  getPostsByCategory,
  searchPosts,
  getAllCategories
} = useBlog()

const allPosts = getAllPosts()
const featuredPosts = getFeaturedPosts()
const categories = getAllCategories()

const filteredPosts = computed(() => {
  let posts = allPosts

  // Apply search filter
  if (searchQuery.value.trim()) {
    posts = searchPosts(searchQuery.value.trim())
  }

  // Apply category filter
  if (selectedCategory.value !== 'all') {
    posts = getPostsByCategory(selectedCategory.value)

    // If there's also a search query, filter the category results
    if (searchQuery.value.trim()) {
      const searchResults = searchPosts(searchQuery.value.trim())
      posts = posts.filter(post =>
        searchResults.some(searchPost => searchPost.slug === post.slug)
      )
    }
  }

  return posts
})

useHead({
  title: 'onTheWayToBeCreative - Rakibul H. Rabbi',
  meta: [
    { name: 'description', content: 'Read about software development, technology insights, and programming tutorials by Rakibul H. Rabbi.' }
  ]
})
</script>