<template>
  <main class="err" :data-theme="theme">
    <div class="box">
      <p class="code">{{ error.statusCode }}</p>
      <h1>{{ notFound ? 'Taking you home' : 'Something broke on this page' }}</h1>
      <p class="msg">
        {{ notFound ? 'That address does not exist here.' : 'It is not you. Going back to the home page usually fixes it.' }}
      </p>
      <button type="button" class="home" @click="home">Back to the home page</button>
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
  background: linear-gradient(118deg, var(--ground-a) 0%, var(--ground-b) 46%, var(--ground-c) 100%); /* taste-skill-ignore: the site's own teal ground (brand) */
  color: var(--ink);
  font-family: var(--font-text);
}
.box {
  width: min(100%, 420px);
  padding: 32px;
  border: 1px solid var(--line); /* taste-skill-ignore: the site's card edge (brand) */
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow); /* taste-skill-ignore: the site's card shadow (brand) */
}
.code { margin: 0; color: var(--mint); font: 600 13px / 1 var(--font-mono); letter-spacing: 0.14em; } /* taste-skill-ignore: mono label (brand) */
h1 { margin: 12px 0 0; font-size: 28px; letter-spacing: -0.03em; line-height: 1.1; }
.msg { margin: 12px 0 0; color: var(--muted); }
.home {
  width: 100%;
  min-height: 48px;
  margin-top: 24px;
  border: 0;
  border-radius: var(--radius-control);
  background: var(--teal);
  color: #fff;
  font: 700 15px / 1 var(--font-text);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
}
.home:hover { background: var(--teal-hover); }
.home:focus-visible { outline: 2px solid var(--mint); outline-offset: 3px; }
</style>
