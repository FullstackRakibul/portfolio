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
            <UiButton
              variant="ghost" size="sm" class="copy" :aria-label="`Copy credential ID ${c.credentialId}`"
              @click="copy(c.credentialId)"
            >
              <template #leading>
                <Check v-if="copied === c.credentialId" aria-hidden="true" />
                <Copy v-else aria-hidden="true" />
              </template>
              <span aria-hidden="true">{{ copied === c.credentialId ? 'Copied' : 'Copy' }}</span>
            </UiButton>
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
}

.top { display: flex; align-items: center; gap: var(--s-3); }
/* Issuer mark: Anthropic's "A\" set in type on a neutral tile. */
.mark {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  flex: none;
  border-radius: var(--radius);
  background: var(--muted);
  color: var(--foreground);
  font: 700 14px / 1 var(--font-text);
  letter-spacing: -0.02em;
}
.issuer { font-size: 12px; } /* a mono label: --muted-foreground from .lab-mono */
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
  font: 500 13px / 1 var(--font-mono); /* taste-skill-ignore: mono labels (the brief keeps them) */
  letter-spacing: 0.06em;
  color: var(--muted-foreground);
  user-select: all;
}
.foot .copy { margin-left: auto; margin-right: -8px; }
.show { font-size: 14px; }

@media (max-width: 1099px) {
  .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 639px) {
  .grid { grid-template-columns: 1fr; }
}
</style>
