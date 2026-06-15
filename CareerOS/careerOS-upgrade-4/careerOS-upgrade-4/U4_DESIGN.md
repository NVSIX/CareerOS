# U4_DESIGN — Stitch "Neumorphic Corporate Red" Design System

Re-read this file at the start of every screen phase. The #1 build
failure mode is surface colors and shadow values drifting between screens.

---

## 1. Tailwind config (tailwind.config.js — replace entirely)

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts,scss}'],
  theme: {
    extend: {
      colors: {
        // Surface hierarchy
        'surface':                   '#f7f9fd',
        'surface-dim':               '#d8dade',
        'surface-bright':            '#f7f9fd',
        'surface-container-lowest':  '#ffffff',
        'surface-container-low':     '#f2f4f8',
        'surface-container':         '#eceef2',
        'surface-container-high':    '#e6e8ec',
        'surface-container-highest': '#e0e2e6',
        // Text
        'on-surface':         '#191c1f',
        'on-surface-variant': '#5c3f3f',
        // Primary (TalentBank red)
        'primary':            '#ad002a',
        'on-primary':         '#ffffff',
        'primary-container':  '#d8113a',
        'on-primary-container': '#ffeceb',
        'inverse-primary':    '#ffb3b3',
        'primary-fixed':      '#ffdad9',
        'primary-fixed-dim':  '#ffb3b3',
        'on-primary-fixed':   '#40000a',
        'on-primary-fixed-variant': '#920022',
        // Secondary (slate blue-grey)
        'secondary':          '#555f6f',
        'on-secondary':       '#ffffff',
        'secondary-container':'#d6e0f3',
        'on-secondary-container': '#596373',
        'secondary-fixed':    '#d9e3f6',
        'secondary-fixed-dim':'#bdc7d9',
        'on-secondary-fixed': '#121c2a',
        'on-secondary-fixed-variant': '#3d4756',
        // Tertiary
        'tertiary':           '#525556',
        'on-tertiary':        '#ffffff',
        'tertiary-container': '#6b6d6e',
        'on-tertiary-container': '#eff0f1',
        'tertiary-fixed':     '#e1e3e4',
        'tertiary-fixed-dim': '#c5c7c8',
        'on-tertiary-fixed':  '#191c1d',
        'on-tertiary-fixed-variant': '#454748',
        // Error
        'error':              '#ba1a1a',
        'on-error':           '#ffffff',
        'error-container':    '#ffdad6',
        'on-error-container': '#93000a',
        // Surface tint / outline
        'surface-tint':       '#bf0030',
        'outline':            '#916f6e',
        'outline-variant':    '#e6bdbc',
        // Inverse
        'inverse-surface':    '#2d3134',
        'inverse-on-surface': '#eff1f5',
        // Background
        'background':         '#f7f9fd',
        'on-background':      '#191c1f',
        'surface-variant':    '#e0e2e6',
      },
      fontFamily: {
        'display':  ['"Hanken Grotesk"', 'sans-serif'],
        'body':     ['Manrope', 'sans-serif'],
        'label':    ['Inter', 'sans-serif'],
        'mono':     ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'headline-lg':  ['40px', { lineHeight: '48px', fontWeight: '700', letterSpacing: '-0.02em' }],
        'headline-md':  ['28px', { lineHeight: '36px', fontWeight: '600' }],
        'headline-sm':  ['22px', { lineHeight: '28px', fontWeight: '600' }],
        'body-lg':      ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md':      ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-sm':      ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'label-lg':     ['14px', { lineHeight: '20px', fontWeight: '600' }],
        'label-md':     ['12px', { lineHeight: '16px', fontWeight: '600' }],
        'label-sm':     ['11px', { lineHeight: '16px', fontWeight: '600' }],
      },
      borderRadius: {
        'sm':  '0.25rem',
        DEFAULT: '0.5rem',
        'md':  '0.75rem',
        'lg':  '1rem',
        'xl':  '1.5rem',
        'full':'9999px',
      },
      spacing: {
        'base': '8px', 'sm': '8px', 'md': '16px', 'lg': '32px',
        'xl': '48px', 'gutter': '24px',
        'margin-mobile': '16px', 'margin-desktop': '64px',
        'max-width': '1280px',
      },
      maxWidth: { 'content': '1280px' },
    },
  },
  plugins: [],
}
```

---

## 2. Global styles (src/styles.scss — replace entirely)

```scss
@import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@600;700;800&family=Manrope:wght@400;500;700&family=Inter:wght@400;600&family=JetBrains+Mono:wght@500&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

// Base
body {
  @apply bg-surface text-on-surface font-body;
  -webkit-font-smoothing: antialiased;
}

// ===== NEUMORPHIC ELEVATION SYSTEM =====

.nm-raised {
  background: #f7f9fd;
  box-shadow:
     8px  8px 16px rgba(209, 201, 183, 0.40),
    -8px -8px 16px rgba(255, 255, 255, 1.00);
}

.nm-pressed {
  background: #f7f9fd;
  box-shadow:
    inset  6px  6px 12px rgba(209, 201, 183, 0.40),
    inset -6px -6px 12px rgba(255, 255, 255, 1.00);
}

.nm-button {
  transition: all 0.2s ease-in-out;
  box-shadow:
     4px  4px 10px rgba(173,  0, 42, 0.20),
    -2px -2px  6px rgba(255, 255, 255, 0.50);
  &:active {
    transform: scale(0.97);
    box-shadow: inset 4px 4px 8px rgba(0,0,0,0.20);
  }
}

.nm-raised-sm {
  background: #f7f9fd;
  box-shadow:
     4px  4px  8px rgba(209, 201, 183, 0.35),
    -4px -4px  8px rgba(255, 255, 255, 0.90);
}

.nm-inset {
  background: #eceef2;
  box-shadow:
    inset  3px  3px  6px rgba(209, 201, 183, 0.30),
    inset -3px -3px  6px rgba(255, 255, 255, 0.70);
}

// ===== SKILL TREE CANVAS =====
.skill-tree-canvas {
  background-image: radial-gradient(circle, #d8dade 1px, transparent 1px);
  background-size: 24px 24px;
}

// ===== SCROLLBAR HIDE =====
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
}

// ===== ROUTE TRANSITIONS =====
// Applied to the router-outlet wrapper div
.page-enter {
  animation: pageEnter 0.2s ease-out forwards;
}
@keyframes pageEnter {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

// ===== PROBE LOG STREAM =====
.probe-log-entry {
  animation: logEntryIn 0.2s ease-out forwards;
}
@keyframes logEntryIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

// ===== PULSE (real-time feed badge) =====
.pulse-dot {
  animation: pulseDot 1.5s ease-in-out infinite;
}
@keyframes pulseDot {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}

// ===== SKILL NODE PULSE RING (available nodes) =====
.pulse-ring {
  animation: pulseRing 2s ease-out infinite;
}
@keyframes pulseRing {
  0%   { transform: scale(1);    opacity: 0.35; }
  100% { transform: scale(1.5);  opacity: 0; }
}
```

---

## 3. Typography grammar

| Role             | Template class recipe                                                              |
|------------------|------------------------------------------------------------------------------------|
| Hero headline    | `class="font-display text-headline-lg text-on-surface tracking-tight"`             |
| Section header   | `class="font-display text-headline-sm font-semibold text-on-surface"`              |
| Eyebrow label    | `class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary"`         |
| Body             | `class="font-body text-body-md text-on-surface"`                                   |
| Caption          | `class="font-label text-label-md text-secondary"`                                  |
| Data value       | `class="font-mono text-body-md text-on-surface"` (ALL numbers, scores, RM values) |
| Big metric       | `class="font-mono text-headline-lg font-medium text-primary"`                      |

Hard rule: every number that is data (score, RM value, %, date, count)
renders in `font-mono`. Zero exceptions.

---

## 4. Component design guide

### Cards
```html
<div class="nm-raised rounded-xl p-5">...</div>       <!-- standard card -->
<div class="nm-inset  rounded-xl p-4">...</div>       <!-- data wells, chart containers -->
```
No `border` classes on cards — the shadow IS the edge.

### Primary button
```html
<button class="nm-button bg-primary-container text-on-primary font-display
               font-semibold rounded-lg px-5 py-2.5 text-label-lg
               hover:bg-primary transition-colors">
  Label
</button>
```
`nm-button` handles the pressed shadow via `:active`.

### Secondary button (neumorphic outline)
```html
<button class="nm-raised rounded-lg px-5 py-2.5 text-primary
               font-display font-semibold text-label-lg
               hover:bg-surface-container-low transition-all">
  Label
</button>
```

### Badges
```html
<!-- primary (action/active) -->
<span class="bg-on-primary-container text-primary-container rounded-full
             px-2.5 py-0.5 text-label-sm font-label">Active</span>
<!-- warning -->
<span class="bg-error-container/30 text-error rounded-full
             px-2.5 py-0.5 text-label-sm font-label">3 signals</span>
<!-- neutral -->
<span class="nm-raised-sm rounded-full px-2.5 py-0.5
             text-label-sm font-label text-secondary">Stage 2</span>
```

### Stage chips (employer pipeline)
- Interviewing:     `bg-secondary-container text-on-secondary-container`
- Screening:        `bg-tertiary-fixed      text-on-tertiary-fixed`
- Reviewing:        `bg-primary-fixed       text-on-primary-fixed`
- On-Site:          `bg-primary-container   text-on-primary`
- Technical Test:   `bg-secondary-container text-on-secondary-container`
- Offer Pending:    `bg-primary             text-on-primary`
All chips: `rounded-full px-3 py-0.5 text-label-sm font-label font-semibold`

### Evidence indicator (EvidenceIndicatorComponent)
Build as standalone Angular component with @Input() state: 'asserted'|'evidence'|'verified'.
- asserted: 10px hollow circle, border `outline` color
- evidence: 10px solid `primary` fill
- verified: 10px solid `primary` fill + 6px lucide Check inside in `on-primary`
Angular Animations: `@trigger evidenceFlip` on state change (see U4_ANIMATION.md).

### Skill segment bars (4-segment, replaces dots on profile screen)
4 divs in a row, each 10px × 4px, gap 2px, rounded-sm.
Filled segments: `bg-primary`. Unfilled: `bg-surface-container-high`.
- verified: 4/4 filled
- evidence: 3/4 filled
- asserted: 1/4 filled
Animated via GSAP `stagger` on mount (see U4_ANIMATION.md).

### Risk dot
- low:      `bg-green-500` (exception — no token for green; hardcode #22c55e)
- moderate: `bg-primary/60`
- high:     `bg-primary`  (full red)
8px circle, displayed inline before the label.

### Avatar initials circle
`class="w-9 h-9 rounded-full nm-raised-sm flex items-center justify-center
        font-mono text-label-lg font-semibold"`
Background per person (consistent hash): Amira=#d6e0f3, Daniel=#e1e3e4,
Priya=#ffdad9, Marcus=#e0e2e6, Nurul=#d9e3f6, Kevin=#ffdad6.
Text: `text-on-surface`.

### Sidebar
Width: `w-16` icon-only on desktop (icons + tooltips on hover).
Expand to `w-52` with labels on hover/focus (CSS `group-hover`).
Background: `bg-surface-container-low` + right-side shadow.
Active link: `bg-primary-container text-primary` rounded-lg.
Inactive: `text-secondary hover:bg-surface-container-high`.

---

## 5. Forbidden
- Any V2 token (parchment #faf9f4, #0E0F11, #2ECC8F, IBM Plex)
- Purple, blue gradients, glassmorphism
- Star ratings, percentage progress bars, stock photos
- Emoji in UI
- `border border-*` on cards (shadow = edge)
