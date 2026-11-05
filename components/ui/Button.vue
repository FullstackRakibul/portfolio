<template>
  <component
    :is="tag"
    v-bind="linkAttrs"
    class="ui-btn"
    :class="[`ui-btn--${variant}`, `ui-btn--${size}`, `ui-btn--${shape}`, { 'ui-btn--block': block, 'is-loading': loading, 'is-disabled': disabled }]"
    :aria-busy="loading || undefined"
    @click="onClick"
  >
    <span v-if="$slots.leading" class="ui-btn__icon">
      <span v-if="loading" class="ui-btn__spin" aria-hidden="true" />
      <slot v-else name="leading" />
    </span>
    <span v-if="$slots.default" class="ui-btn__label" :class="{ 'is-hidden': loading && !$slots.leading && !$slots.icon }"><slot /></span>
    <span v-if="$slots.icon" class="ui-btn__icon ui-btn__trail">
      <span v-if="loading && !$slots.leading" class="ui-btn__spin" aria-hidden="true" />
      <slot v-else name="icon" />
    </span>
    <!-- No icon to stand in for: the spinner sits over the label, which keeps its width. -->
    <span v-if="loading && !$slots.leading && !$slots.icon" class="ui-btn__spin ui-btn__spin--over" aria-hidden="true" />
  </component>
</template>

<script setup lang="ts">
// One button for the whole site, after shadcn/ui: variants, sizes, focus ring, pressed, disabled and
// loading states. Renders a NuxtLink for `to`, an <a> for `href`, a <button> otherwise.
import type { RouteLocationRaw } from 'vue-router'

const props = withDefaults(defineProps<{
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link'
  size?: 'sm' | 'default' | 'lg' | 'icon' | 'icon-lg'
  /** default: 8px corners; pill: fully round sides; circle: round (icon sizes). */
  shape?: 'default' | 'pill' | 'circle'
  to?: RouteLocationRaw
  href?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  /** Fill the width of the container. */
  block?: boolean
}>(), { variant: 'default', size: 'default', shape: 'default', type: 'button' })

const NuxtLink = resolveComponent('NuxtLink')
const tag = computed(() => (props.to ? NuxtLink : props.href ? 'a' : 'button'))

const linkAttrs = computed(() => {
  if (props.to) return { to: props.to, 'aria-disabled': props.disabled || undefined }
  if (props.href) return { href: props.disabled ? undefined : props.href, 'aria-disabled': props.disabled || undefined, role: props.disabled ? 'link' : undefined }
  return { type: props.type, disabled: props.disabled || props.loading }
})

// A disabled link must not navigate (a <button> handles this itself).
const onClick = (e: MouseEvent) => {
  if ((props.disabled || props.loading) && (props.to || props.href)) {
    e.preventDefault()
    e.stopImmediatePropagation()
  }
}
</script>

<style scoped>
.ui-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-shrink: 0;
  box-sizing: border-box;
  border: 1px solid transparent;
  border-radius: var(--radius);
  font-family: var(--font-text);
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0;
  text-transform: none;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition:
    background-color var(--dur-hover) ease,
    color var(--dur-hover) ease,
    border-color var(--dur-hover) ease,
    transform var(--dur-press) ease;
}

/* Focus: a 2px --ring, 2px clear of the button. An outline rather than a box-shadow, so a floating
   button keeps its float and still shows the ring; forced-colors modes draw it in system colours. */
.ui-btn:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}

/* Pressed */
.ui-btn:not(.is-disabled):not(.is-loading):active { transform: scale(0.98); }

/* Sizes */
.ui-btn--sm { height: 32px; padding: 0 12px; font-size: 13px; }
.ui-btn--default { height: 40px; padding: 0 16px; font-size: 14px; }
.ui-btn--lg { height: 44px; padding: 0 24px; font-size: 15px; }
.ui-btn--icon { width: 36px; height: 36px; padding: 0; }
.ui-btn--icon-lg { width: 44px; height: 44px; padding: 0; }
.ui-btn--block { display: flex; width: 100%; }

/* Shapes */
.ui-btn--pill { border-radius: 999px; }
.ui-btn--circle { border-radius: 50%; }

/* Variants */
.ui-btn--default { background: var(--primary); color: var(--primary-foreground); }
.ui-btn--default:hover { background: var(--primary-hover); }

.ui-btn--secondary { background: var(--secondary); color: var(--secondary-foreground); }
.ui-btn--secondary:hover { background: var(--border); }

.ui-btn--outline {
  background: transparent;
  border-color: var(--border); /* taste-skill-ignore: shadcn outline button (the brief's design system) */
  color: var(--foreground);
}
.ui-btn--outline:hover { background: var(--muted); }

.ui-btn--ghost { background: transparent; color: var(--foreground); }
.ui-btn--ghost:hover { background: var(--muted); }

.ui-btn--link {
  height: auto;
  min-height: 44px;
  padding: 0;
  background: transparent;
  color: var(--foreground);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.3em;
  text-decoration-color: transparent;
}
.ui-btn--link:hover { text-decoration-color: var(--primary); }
.ui-btn--link:focus-visible { border-radius: 4px; }

/* Disabled: muted text, no hover, the not-allowed cursor. */
.ui-btn.is-disabled,
.ui-btn:disabled:not(.is-loading) {
  color: var(--disabled);
  cursor: not-allowed;
  transform: none;
}
.ui-btn--default.is-disabled,
.ui-btn--default:disabled:not(.is-loading),
.ui-btn--secondary.is-disabled,
.ui-btn--secondary:disabled:not(.is-loading) { background: var(--muted); }
.ui-btn--outline.is-disabled,
.ui-btn--outline:disabled:not(.is-loading),
.ui-btn--ghost.is-disabled,
.ui-btn--ghost:disabled:not(.is-loading) { background: transparent; }
.ui-btn--link.is-disabled { text-decoration-color: transparent; }

.ui-btn.is-loading { cursor: progress; }

/* Icons: 16px; a trailing icon nudges 2px right on hover. */
.ui-btn__icon { display: inline-grid; place-items: center; width: 16px; height: 16px; flex: none; }
.ui-btn__icon :deep(svg) { width: 16px; height: 16px; }
.ui-btn--icon .ui-btn__icon :deep(svg),
.ui-btn--icon-lg .ui-btn__icon :deep(svg) { width: 18px; height: 18px; }
.ui-btn__trail :deep(svg) { transition: transform var(--dur-hover) var(--ease-out); }
.ui-btn:not(.is-disabled):hover .ui-btn__trail :deep(svg) { transform: translateX(2px); }
.ui-btn__label { display: inline-flex; align-items: center; gap: 8px; }
.ui-btn__label.is-hidden { visibility: hidden; }

/* Loading: an inline spinner in place of the icon, so the width never jumps. */
.ui-btn__spin {
  width: 14px;
  height: 14px;
  box-sizing: border-box;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: ui-btn-spin 700ms linear infinite;
}
.ui-btn__spin--over { position: absolute; top: 50%; left: 50%; margin: -7px 0 0 -7px; }
@keyframes ui-btn-spin { to { transform: rotate(360deg); } }

@media (prefers-reduced-motion: reduce) {
  .ui-btn { transition: background-color var(--dur-hover) ease, color var(--dur-hover) ease, border-color var(--dur-hover) ease; }
  .ui-btn:not(.is-disabled):not(.is-loading):active { transform: none; }
  .ui-btn:not(.is-disabled):hover .ui-btn__trail :deep(svg) { transform: none; }
  .ui-btn__spin { animation-duration: 1.6s; }
}
</style>
