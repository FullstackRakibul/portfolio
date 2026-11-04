<template>
  <section id="certifications" v-reveal class="lab-section lab-wrap" aria-labelledby="cert-h">
    <div class="lab-head">
      <h2 id="cert-h" data-reveal>Licenses & certifications</h2>
      <p data-reveal>{{ intro }}</p>
    </div>

    <ul class="grid">
      <li v-for="c in CERTIFICATIONS" :key="c.credentialId" data-reveal>
        <article class="cert lab-card" :data-cursor-label="c.url ? 'Verify' : undefined">
          <div class="top">
            <span class="mark" aria-hidden="true">A\</span>
            <span class="issuer lab-mono">{{ c.issuer }}</span>
            <span class="lab-pill"><time :datetime="c.issued">{{ monthLabel(c.issued) }}</time></span>
          </div>
          <h3>{{ c.title }}</h3>
          <ul class="lab-tags" :aria-label="`Skills, ${c.title}`">
            <li v-for="s in c.skills" :key="s">{{ s }}</li>
          </ul>
          <span class="spacer" aria-hidden="true" />
          <div class="foot lab-card-foot">
            <p class="cid">
              <span class="sr-only">Credential ID </span>
              <code>{{ c.credentialId }}</code>
            </p>
            <button
              type="button" class="copy" :aria-label="`Copy credential ID ${c.credentialId}`"
              @click="copy(c.credentialId)"
            >
              <Check v-if="copied === c.credentialId" :size="16" aria-hidden="true" />
              <Copy v-else :size="16" aria-hidden="true" />
              <span class="copy-t" aria-hidden="true">{{ copied === c.credentialId ? 'Copied' : 'Copy' }}</span>
            </button>
            <a v-if="c.url" class="show lab-link" :href="c.url" target="_blank" rel="noopener">
              Show credential<span class="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </article>
      </li>
    </ul>
    <p class="sr-only" role="status" aria-live="polite">{{ copied ? `Credential ID ${copied} copied` : '' }}</p>
  </section>
</template>

<script setup lang="ts">
import { Check, Copy } from 'lucide-vue-next'
import { CERTIFICATIONS } from '~/data/certifications'
import { monthLabel } from '~/data/experience'

const WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve']
const years = [...new Set(CERTIFICATIONS.map(c => c.issued.slice(0, 4)))].sort()
const issuers = [...new Set(CERTIFICATIONS.map(c => c.issuer))]
const intro = `${WORDS[CERTIFICATIONS.length] ?? CERTIFICATIONS.length} courses from ${issuers.join(' and ')}, completed in ${years.join(' and ')}: the Claude API, the Model Context Protocol, Claude Code and Cowork, and AI fluency.`

const copied = ref('')
let timer = 0
const copy = async (id: string) => {
  try {
    await navigator.clipboard.writeText(id)
  } catch {
    // Older browsers and insecure origins: select the text so it can be copied by hand.
    const code = [...document.querySelectorAll('#certifications code')].find(el => el.textContent === id)
    if (code) getSelection()?.selectAllChildren(code)
    return
  }
  copied.value = id
  clearTimeout(timer)
  timer = window.setTimeout(() => { copied.value = '' }, 2000)
}
onBeforeUnmount(() => clearTimeout(timer))
</script>

<style scoped>
.grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--gap);
}
.grid > li { display: flex; min-width: 0; }
.cert {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: var(--s-5);
  transition: transform var(--dur-move) var(--ease-out), box-shadow var(--dur-move) var(--ease-out), border-color var(--dur-hover) ease;
}
.cert:hover,
.cert:focus-within { transform: translateY(-3px); box-shadow: var(--shadow-lift); border-color: var(--line-strong); } /* taste-skill-ignore: PIPILIKA card lifts on hover (brand) */

.top { display: flex; align-items: center; gap: var(--s-3); }
/* Issuer mark: Anthropic's "A\" set in type on a light tile. */
.mark {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  flex: none;
  border-radius: 8px;
  background: #f0eee6; /* taste-skill-ignore: the issuer’s own tile colour (Anthropic mark) */
  color: #191919;
  font: 700 14px / 1 var(--font-text);
  letter-spacing: -0.02em;
}
.issuer { color: var(--ink); font-size: 12px; }
.top .lab-pill { margin-left: auto; }

.cert h3 {
  margin-top: var(--s-4);
  font: 600 19px / 1.3 var(--font-text);
  letter-spacing: -0.01em;
}
.cert .lab-tags { margin-top: var(--s-3); }
.spacer { flex: 1; min-height: var(--s-4); }

.foot { display: flex; align-items: center; gap: var(--s-3); padding-top: var(--s-3); }
.cid { min-width: 0; }
code {
  font: 500 13px / 1 var(--font-mono); /* taste-skill-ignore: PIPILIKA sets labels, versions and badges in mono (brand) */
  letter-spacing: 0.06em;
  color: var(--muted);
  user-select: all;
}
.copy {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  padding: 0 10px;
  margin-right: -6px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--muted);
  font: 500 12px / 1 var(--font-mono); /* taste-skill-ignore: PIPILIKA sets labels, versions and badges in mono (brand) */
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color var(--dur-hover) ease, color var(--dur-hover) ease;
}
.copy:hover { background: var(--surface-2); color: var(--mint); }
.cid + .copy { margin-left: auto; }
.show { font-size: 14px; }

@media (prefers-reduced-motion: reduce) {
  .cert { transition: none; }
  .cert:hover, .cert:focus-within { transform: none; }
}
@media (max-width: 1099px) {
  .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 639px) {
  .grid { grid-template-columns: 1fr; }
}
</style>
