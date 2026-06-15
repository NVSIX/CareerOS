# DESIGN_SYSTEM_V2 — CareerOS "Vanguard" Redesign

This file REPLACES DESIGN_SYSTEM.md as the design authority for the upgrade
build. Where the two conflict, V2 wins. Re-read this file at the start of
EVERY phase — the restyle's #1 failure mode is screens drifting between the
old dark system and this one. After phase U2, ZERO traces of the dark system
may remain anywhere.

The aesthetic target: warm, tactile, neumorphic professional platform.
Parchment surfaces, soft clay elevation, confident red + deep navy. It should
feel like a beautifully made physical tool — closer to a premium banking app
than a developer dashboard. NOT dark mode. NOT flat SaaS. NOT glassmorphism.

---

## 1. Color tokens

Same Tailwind token NAMES as V1 where semantics carry over (this auto-restyles
most existing classes), with new tokens added. Replace the entire `colors`
block in tailwind.config.js with:

```js
colors: {
  // Remapped V1 names (existing className usage restyles automatically)
  base: "#faf9f4",          // page background (was near-black)
  surface: "#efece3",       // cards / containers (parchment)
  elevated: "#e9e8e3",      // hover / active container
  pressed: "#e5e2d8",       // pressed state fill
  separator: "#ddd8cc",     // hairlines where a visible rule is still needed
  accent: "#1F7A5C",        // verified / positive / growth (deep teal-green)
  "accent-dim": "#DDEBE4",  // accent badge fill on cream
  warning: "#B07818",       // gaps, moderate risk, coaching flags
  danger: "#d8113a",        // high risk (same hue as primary — red is both
                            // brand and alarm in this system; acceptable)
  txt: "#1b1c19",           // primary text (near-black on cream)
  "txt-dim": "#6B6557",     // secondary text, warm grey

  // New tokens
  primary: "#d8113a",            // CTAs, active states, brand moments
  "on-primary": "#ffffff",
  "primary-container": "#ffeceb",
  "on-primary-container": "#40000a",
  secondary: "#112250",          // deep navy — headers, nav, data ink,
                                 // unlocked skill nodes, chart primary line
  "secondary-container": "#E7EAF3",
}
```

Usage rules:
- `primary` red is for ACTION and BRAND: primary buttons, active nav,
  selected states, high-risk alarms. Never for body text. Max ~8% of any
  screen.
- `secondary` navy is the INK of the system: section headers, nav labels,
  data emphasis, chart lines, skill-tree unlocked nodes. The dependable color.
- `accent` teal-green keeps its V1 job: evidence/verified/positive trajectory.
  The EvidenceIndicator semantics are unchanged — only the hex moved.
- No gradients EXCEPT the soft neumorphic shadows below. No pure white
  surfaces (#faf9f4 is the lightest).

## 2. The elevation system (the signature of V2)

Three CSS utility classes in `src/index.css` (cannot be expressed as Tailwind
tokens — this is the sanctioned exception to "Tailwind only"; F6 is amended
accordingly in UPGRADE_DIRECTIONS):

```css
.layer-raised {
  background: #efece3;
  box-shadow: 4px 4px 8px rgba(0,0,0,0.06), -4px -4px 8px rgba(255,255,255,0.7);
  border: 1px solid rgba(255,255,255,0.4);
}
.layer-inset {
  background: #efece3;
  box-shadow: inset 2px 2px 5px rgba(0,0,0,0.06), inset -2px -2px 5px rgba(255,255,255,0.7);
  border: 1px solid rgba(0,0,0,0.02);
}
.layer-pressed {
  background: #e5e2d8;
  box-shadow: inset 3px 3px 6px rgba(0,0,0,0.08), inset -3px -3px 6px rgba(255,255,255,0.5);
}
```

Grammar (apply consistently everywhere):
- `layer-raised` — anything clickable or content-bearing: cards, rows, chips,
  buttons at rest, nav containers, badges that matter.
- `layer-inset` — anything that CONTAINS: section wells, chart containers,
  the skill-tree canvas, search inputs, table wells.
- `layer-pressed` — selected/active states: the selected scenario card, the
  active nav item, a button while pressed, the active tab.
- Cards NO LONGER use `border border-separator` as their edge — the shadow IS
  the edge. `separator` survives only as table row hairlines (`border-b`) and
  thin dividers inside cards.
- Page background `base` is flat; everything sits ON it via layers.

## 3. Typography

Replace Google Fonts in index.html with: Hanken Grotesk (400,600,700,800),
Inter (400,500), JetBrains Mono (500). Same Tailwind fontFamily NAMES remap:

```js
fontFamily: {
  display: ['"Hanken Grotesk"', "sans-serif"],
  body: ["Inter", "sans-serif"],
  mono: ['"JetBrains Mono"', "monospace"],
}
```

| Role               | Recipe                                                          |
|--------------------|-----------------------------------------------------------------|
| Page title         | `font-display text-3xl font-extrabold text-secondary tracking-tight` |
| Section header     | `font-display text-lg font-bold text-secondary`                 |
| Eyebrow label      | `font-mono text-[10px] uppercase tracking-[0.08em] text-txt-dim` (mono eyebrows are a V2 signature — JetBrains Mono at small caps) |
| Body               | `font-body text-sm text-txt`                                    |
| Caption            | `font-body text-xs text-txt-dim`                                |
| Data values        | `font-mono` — UNCHANGED hard rule: every score, salary, count, percentage, date-as-data is mono. |
| Big metric         | `font-mono text-3xl font-medium text-secondary`                 |

## 4. Shape & spacing
- Card radius: `rounded-2xl` (16px). Inner items/rows: `rounded-xl` (12px).
- Buttons and chips: `rounded-full` pills.
- Section padding `p-6`, card padding `p-5`, grid gap `gap-4`.
- Page wrapper: `max-w-7xl mx-auto p-6`.

## 5. Layout: bento grid replaces strict SplitPanel
New `BentoGrid` primitive: `grid grid-cols-1 lg:grid-cols-12 gap-4`.
Children declare spans (`lg:col-span-8`, `lg:col-span-4`, etc.).
SplitPanel remains as a thin wrapper over BentoGrid (7/5 spans) so existing
screens restyle without structural rewrites — but new screens compose
BentoGrid directly with varied spans. Intelligence/engine output still sits
right or below; data still leads.

## 6. AppShell V2
- Fixed top bar: `bg-base/90 backdrop-blur border-b border-separator/60`
  (the ONE sanctioned blur — it's a nav treatment, not glassmorphism).
  Left: wordmark "Career**OS**" — `font-display font-extrabold text-secondary`,
  the "OS" in `text-primary`. Right: RoleSwitcher.
- New left sidebar (desktop only, `hidden lg:flex`, w-52, `bg-surface
  layer-raised` full-height under the top bar): role-contextual links with
  lucide icons + mono eyebrow labels —
  Candidate: Profile (`/candidate/profile`), Skill map (`/candidate/skills`),
  Jobs (`/jobs`). Employer: Dashboard, Retention (`/employer/retention`),
  Salesforce. Landing/onboarding/register routes render WITHOUT the sidebar.
  Active link: `layer-pressed text-primary`; inactive: `text-txt-dim`.
- Mobile: top bar only; sidebar hidden (no bottom nav — out of scope).
- RoleSwitcher: pill segmented control, active segment `layer-pressed
  text-secondary font-semibold`, container `layer-inset rounded-full`.

## 7. Component restyle map (Phase U0 touches every one)
| Component          | V2 treatment                                                  |
|--------------------|---------------------------------------------------------------|
| DataCard           | `layer-raised rounded-2xl p-5`, no border classes             |
| MetricBlock        | value `text-secondary font-mono`; eyebrow per §3              |
| Badge              | pills: accent → `bg-accent-dim text-accent`; warning → `bg-[#F3E5C8] text-warning`; neutral → `layer-inset text-txt-dim`; new primary → `bg-primary-container text-primary` |
| RiskDot            | low `accent` / moderate `warning` / high `danger`             |
| CoachingCard       | `layer-raised border-l-4 border-l-warning rounded-2xl`        |
| EngineCard         | `layer-raised border-l-4 border-l-secondary rounded-2xl` (navy, no longer green) |
| Button primary     | `bg-primary text-on-primary rounded-full px-5 py-2 font-semibold` + `active: layer-pressed scale-[0.98]` |
| Button secondary   | `layer-raised rounded-full px-5 py-2 text-secondary font-semibold` + pressed state |
| EvidenceIndicator  | UNCHANGED structure/semantics. Hollow border `txt-dim`; evidence fill `accent`; verified fill `accent` + check in `base`. Dot size 10px as before. |
| TrajectoryChart    | actual line `#112250` (navy) solid; cohort `#9A937F` dashed; projection `#1F7A5C` dashed; grid `#ddd8cc`; tooltip `layer-raised` cream, mono values; axis ticks 11px Inter `#6B6557`. Chart sits inside a `layer-inset rounded-2xl p-4` well. |
| Tables             | wrapper `layer-inset rounded-2xl`; rows `border-b border-separator/70`, hover `bg-elevated`, clickable rows get cursor-pointer |
| ScreenStub         | restyled to V2, same purpose                                  |

## 8. Motion
- Allowed: 150–250ms ease transitions on background/shadow/transform;
  `active:scale-[0.98]` on buttons; the skill-tree available-node pulse
  (CSS keyframes, 2s, ring opacity 0.35→0); Recharts' built-in line morph
  between scenario datasets.
- Forbidden: skeleton shimmer, confetti, parallax, page-level fades,
  spring/bounce physics.

## 9. Copy rules — unchanged from V1
Sentence case, mono uppercase eyebrows, evidence-grounded engine copy with a
data-basis line, no exclamation marks, no emoji, buttons say what they do.

## 10. Forbidden in V2
- Any leftover dark-system value: #0E0F11, #161820, #1E2028, #2A2D35, #2ECC8F,
  #E8A838, #F0F2F5, #8B91A0, IBM Plex anywhere. Phase U2's gate includes a
  grep for ALL of these.
- Purple. Gradients. Glassmorphism beyond the top-bar blur. Emoji. Skill
  progress bars. Star ratings. Stock photos / avatar images (people remain
  mono initials in a `layer-inset rounded-full` circle, navy text).
