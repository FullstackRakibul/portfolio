<template>
  <div>
    <template v-if="post">
      <LabPageHeader
        size="detail" narrow :eyebrow="post.category" :title="post.title" :intro="post.excerpt"
        :back="{ to: '/onTheWayToBeCreative', label: 'Back to Blog' }"
      >
        <span class="by">By {{ post.author }}</span>
        <span class="lab-pill"><time :datetime="post.date">{{ formatDate(post.date) }}</time></span>
        <span class="by">{{ post.readTime }}</span>
        <span v-if="post.featured" class="lab-badge">Featured</span>
      </LabPageHeader>

      <div v-reveal class="lab-wrap body">
        <article class="article lab-card" data-reveal>
          <ul class="lab-tags" aria-label="Tags">
            <li v-for="tag in post.tags" :key="tag">{{ tag }}</li>
          </ul>
          <!-- Post content comes from data/blog-posts.json in this repository. -->
          <div class="prose" v-html="post.content" />

          <div class="share lab-card-foot">
            <div>
              <h2 class="share-h">Share this article</h2>
              <div class="share-links">
                <a
                  :href="`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(currentUrl)}`"
                  target="_blank" rel="noopener" aria-label="Share on X (Twitter), opens in a new tab" data-cursor-label="Open ↗"
                >
                  <Share :size="18" aria-hidden="true" />
                </a>
                <a
                  :href="`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`"
                  target="_blank" rel="noopener" aria-label="Share on LinkedIn, opens in a new tab" data-cursor-label="Open ↗"
                >
                  <Share :size="18" aria-hidden="true" />
                </a>
              </div>
            </div>
            <div class="published">
              <p class="lab-mono k">Published on</p>
              <p>{{ formatDate(post.date) }}</p>
            </div>
          </div>
        </article>

        <section v-if="relatedPosts.length > 0" class="related" aria-labelledby="related-h">
          <h2 id="related-h" class="related-h" data-reveal>Related Articles</h2>
          <ul class="cards">
            <li v-for="relatedPost in relatedPosts" :key="relatedPost.slug" data-reveal>
              <BlogCard
                :title="relatedPost.title" :excerpt="relatedPost.excerpt" :date="relatedPost.date"
                :read-time="relatedPost.readTime" :tags="relatedPost.tags" :slug="relatedPost.slug"
                :category="relatedPost.category"
              />
            </li>
          </ul>
        </section>
      </div>
    </template>

    <template v-else>
      <LabPageHeader
        size="detail" eyebrow="On the way to be creative" title="Post Not Found"
        :back="{ to: '/onTheWayToBeCreative', label: 'Back to Blog' }"
      />
      <div class="lab-wrap">
        <LabEmpty label="404" title="The blog post you're looking for doesn't exist.">
          <NuxtLink to="/onTheWayToBeCreative" class="lab-button">Back to Blog</NuxtLink>
        </LabEmpty>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Share } from 'lucide-vue-next'

const route = useRoute()
const slug = String(route.params.slug)

const { getPostBySlug, getPostsByCategory, formatDate } = useBlog()

const post = getPostBySlug(slug)
const currentUrl = computed(() => (import.meta.client ? window.location.href : `https://rabbitic.com/#/onTheWayToBeCreative/${slug}`))

const relatedPosts = computed(() => {
  if (!post) return []
  return getPostsByCategory(post.category).filter(p => p.slug !== post.slug).slice(0, 2)
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
    { property: 'article:section', content: post?.category },
  ],
})
</script>

<style scoped>
.by { font-size: 15px; color: var(--muted); }

.article { max-width: 860px; margin-inline: auto; padding: clamp(24px, 4vw, 56px); }

/* The post's own HTML, set in the site's type. */
.prose { margin-top: var(--s-6); font-size: var(--step-body); line-height: 1.7; }
.prose :deep(> * + *) { margin-top: 1.1em; }
.prose :deep(h2) { margin-top: 1.8em; font-size: clamp(1.5rem, 1.2rem + 1vw, 2rem); letter-spacing: -0.02em; line-height: 1.2; }
.prose :deep(h3) { margin-top: 1.5em; font-size: 1.3rem; letter-spacing: -0.01em; line-height: 1.3; }
.prose :deep(p) { margin-bottom: 0; }
.prose :deep(ul), .prose :deep(ol) { padding-left: 1.3em; }
.prose :deep(li + li) { margin-top: 0.4em; }
.prose :deep(li::marker) { color: var(--mint); }
.prose :deep(strong) { color: var(--ink); font-weight: 650; }
.prose :deep(a) { color: var(--mint); text-underline-offset: 0.25em; }
.prose :deep(blockquote) {
  margin-inline: 0;
  padding: var(--s-4) var(--s-5);
  border-radius: var(--radius-control);
  background: var(--surface-2);
  color: var(--muted);
  font-style: italic;
}
.prose :deep(code) {
  padding: 2px 6px;
  border-radius: 6px;
  background: var(--surface-2);
  color: var(--mint);
  font: 0.9em var(--font-mono);
}
.prose :deep(pre) {
  padding: var(--s-4);
  border-radius: var(--radius-control);
  background: var(--surface-solid);
  overflow-x: auto;
}
.prose :deep(pre code) { padding: 0; background: none; color: var(--ink); }
.prose :deep(img) { max-width: 100%; height: auto; border-radius: var(--radius-control); }

.share { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: var(--s-5); margin-top: var(--s-8); padding-top: var(--s-6); }
.share-h { font: 600 18px / 1.3 var(--font-text); letter-spacing: 0; }
.share-links { display: flex; gap: var(--s-2); margin-top: var(--s-3); }
.share-links a {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--surface-2);
  color: var(--muted);
  transition: color var(--dur-hover) ease, background-color var(--dur-hover) ease;
}
.share-links a:hover { color: var(--mint); background: var(--surface-3); }
.published { text-align: right; }
.published .k { color: var(--muted); }
.published p + p { margin-top: 4px; }

.related { margin-top: var(--section-gap); }
.related-h { margin-bottom: var(--s-6); font-size: var(--step-head); }
.cards { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--gap); }
@media (max-width: 639px) {
  .cards { grid-template-columns: 1fr; }
  .published { text-align: left; }
}
</style>
