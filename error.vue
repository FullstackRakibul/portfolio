<template>
  <main class="err" :data-theme="theme">
    <div class="box">
      <p class="code">{{ error.statusCode }}</p>
      <h1>{{ notFound ? 'Taking you home' : 'Something broke on this page' }}</h1>
      <p class="msg">
        {{ notFound ? 'That address does not exist here.' : 'It is not you. Going back to the home page usually fixes it.' }}
      </p>
      <UiButton class="home" size="lg" block @click="home">Back to the home page</UiButton>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

// Unknown addresses go straight back to the home page; any other error gets this small page.
const props = defineProps<{ error: NuxtError }>()
const notFound = computed(() => props.error.statusCode === 404)
const theme = ref('dark')
const home = () => clearError({ redirect: '/' })

onMounted(() => {
  theme.value = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
  if (notFound.value) home()
})
useHead({ title: notFound.value ? 'Taking you home' : 'Something broke' })
</script>

<style scoped>
.err {
  min-height: 100svh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-text);
}
.box {
  width: min(100%, 420px);
  padding: 32px;
  border: 1px solid var(--border); /* taste-skill-ignore: card edge (the brief's design system) */
  border-radius: var(--radius-lg);
  background: var(--card);
  box-shadow: var(--shadow-card); /* taste-skill-ignore: hairline, light mode only */
}
.code { margin: 0; color: var(--muted-foreground); font: 600 13px / 1 var(--font-mono); letter-spacing: 0.14em; } /* taste-skill-ignore: mono label (the brief keeps them) */
h1 { margin: 12px 0 0; font-size: 28px; letter-spacing: -0.03em; line-height: 1.1; }
.msg { margin: 12px 0 0; color: var(--muted-foreground); }
.box .home { margin-top: 24px; }
</style>
