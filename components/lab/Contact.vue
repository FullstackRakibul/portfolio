<template>
  <section id="contact" v-reveal class="contact" aria-labelledby="contact-h">
    <h2 id="contact-h" class="prompt" data-reveal>Have an interesting problem? Let’s engineer a solution.</h2>
    <form class="field" data-reveal @submit.prevent="send">
      <label for="contact-msg" class="sr-only">Describe the problem</label>
      <input id="contact-msg" v-model="message" type="text" placeholder="Describe the problem in a sentence" aria-describedby="contact-next" autocomplete="off">
      <button type="submit" aria-label="Write the email">
        <ArrowRight :size="20" aria-hidden="true" />
      </button>
    </form>
    <p id="contact-next" class="next" data-reveal>Opens your email app with this as the first line, addressed to me.</p>

    <dl class="rows" data-reveal>
      <div><dt>Email</dt><dd><a class="lab-link" :href="`mailto:${CONTACT.email}`">{{ CONTACT.email }}</a></dd></div>
      <div><dt>GitHub</dt><dd><a class="lab-link" :href="CONTACT.github" target="_blank" rel="noopener">github.com/fullstackrakibul</a></dd></div>
      <div><dt>LinkedIn</dt><dd><a class="lab-link" :href="CONTACT.linkedin" target="_blank" rel="noopener">linkedin.com/in/fullstackrakibul</a></dd></div>
      <div><dt>Portfolio</dt><dd><a class="lab-link" :href="CONTACT.website" target="_blank" rel="noopener">rabbitic.com</a></dd></div>
    </dl>
  </section>
</template>

<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import { CONTACT } from '~/data/portfolio'

const message = ref('')

const send = () => {
  const first = message.value.trim()
  const subject = first ? `A problem worth engineering: ${first.slice(0, 60)}` : 'A problem worth engineering'
  const body = `${first || 'Hello Rakibul,'}\n\n`
  location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
</script>

<style scoped>
.contact {
  margin-top: var(--section-gap);
  padding: clamp(96px, 14vw, 200px) var(--margin) clamp(96px, 12vw, 160px);
  background: var(--surface);
  display: grid;
  justify-items: center;
}
.contact > * { width: min(560px, 100%); }
.prompt {
  font-size: var(--step-lead);
  line-height: 1.15;
  letter-spacing: -0.02em;
  text-wrap: balance;
}
.field {
  position: relative;
  margin-top: 28px;
}
input {
  width: 100%;
  height: 64px;
  box-sizing: border-box;
  padding: 0 72px 0 20px;
  border: 0;
  background: var(--ink);
  color: var(--bg);
  font: 17px var(--font-text);
  outline: none;
}
input::placeholder { color: color-mix(in srgb, var(--bg) 62%, var(--ink)); }
input:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }
button {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border: 0;
  background: var(--accent);
  color: var(--accent-ink);
  cursor: pointer;
  transition: transform var(--dur-press) var(--ease-out), background-color var(--dur-hover) ease;
}
button:hover { background: color-mix(in srgb, var(--accent) 86%, var(--bg)); }
button:active { transform: scale(0.92); }
.next { margin-top: 16px; font-size: var(--step-small); color: var(--muted); }

.rows { margin: 72px 0 0; display: grid; gap: 12px; font-size: 16px; }
.rows div { display: grid; grid-template-columns: 6rem 1fr; gap: 16px; }
.rows dt { color: var(--muted); }
.rows dd { margin: 0; overflow-wrap: anywhere; }

@media (max-width: 640px) {
  .field input { height: 60px; }
  button { top: 8px; }
  .rows div { grid-template-columns: 1fr; gap: 2px; }
  .rows { gap: 20px; }
}
</style>
