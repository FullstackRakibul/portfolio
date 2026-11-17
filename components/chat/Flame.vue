<template>
  <span class="flame" aria-hidden="true">
    <svg viewBox="0 0 24 24" width="24" height="24" focusable="false">
      <!-- Outer flame: a teardrop with a lick to the right at its tip. -->
      <path class="outer" d="M12.4 2.2c.3 2.6 1.9 4.3 3.5 6 1.6 1.7 3.1 3.5 3.1 6.2A7 7 0 0 1 12 21.2a7 7 0 0 1-7-6.8c0-2.4 1.1-4.1 2.5-5.4.3 1.5 1 2.6 2.1 3.1-.4-3.6.6-7.1 2.8-9.9Z" />
      <!-- Inner flame: smaller, sits low, leans the other way. -->
      <path class="inner" d="M11.6 11.4c.2 1.4 1 2.3 1.8 3.2.7.8 1.2 1.5 1.2 2.5a2.7 2.7 0 0 1-5.3.6c-.3-1.6.4-2.6 1.2-3.3 0 .6.3 1 .7 1.2-.3-1.6 0-3 .4-4.2Z" />
    </svg>
  </span>
</template>

<style scoped>
/* 40px circle, a 1px edge, a 12% wash of the accent. */
.flame {
  display: inline-grid;
  place-items: center;
  flex: none;
  width: 40px;
  height: 40px;
  box-sizing: border-box;
  border-radius: 50%;
  border: 1px solid var(--border); /* taste-skill-ignore: the avatar's edge */
  background: color-mix(in srgb, var(--primary) 12%, transparent);
}
svg { overflow: visible; }
.outer, .inner { transform-box: fill-box; transform-origin: 50% 100%; animation: flicker 2.6s ease-in-out infinite; }
.outer { fill: var(--primary); }
.inner { fill: var(--foreground); opacity: 0.85; animation-delay: -1.1s; }
/* Light theme: --foreground and --primary are both black there, so the inner flame takes the paper colour. */
[data-theme="light"] .inner { fill: var(--primary-foreground); }

@keyframes flicker {
  0%, 100% { transform: scale(1, 1) rotate(0deg); }
  30% { transform: scale(0.97, 1.05) rotate(-2.5deg); }
  60% { transform: scale(1.03, 0.97) rotate(1.5deg); }
  80% { transform: scale(0.99, 1.02) rotate(-0.8deg); }
}
@media (prefers-reduced-motion: reduce) {
  .outer, .inner { animation: none; }
}
</style>
