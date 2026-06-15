# DESIGN SYSTEM — CareerOS Prototype

Re-read this entire file at the start of EVERY screen phase. Do not build any
component from memory of this file. Drift in tokens, spacing, or indicator
states is the #1 failure mode of this build.

The aesthetic target: enterprise intelligence platform. Bloomberg-terminal
seriousness with modern polish. This platform informs hiring decisions worth
millions — it must feel authoritative, data-dense but calm, and trustworthy.
It must NOT feel like a generic SaaS landing page, an AI startup dashboard,
or a job board.

---

## 1. Color tokens (Tailwind config names in parentheses)

| Token            | Hex       | Tailwind name   | Use                                              |
|------------------|-----------|-----------------|--------------------------------------------------|
| Base             | #0E0F11   | `base`          | Page background. Nothing else.                   |
| Surface          | #161820   | `surface`       | Cards, panels, table rows                        |
| Elevated         | #1E2028   | `elevated`      | Modals, dropdowns, hover states, active nav      |
| Separator        | #2A2D35   | `separator`     | All borders, dividers, table rules               |
| Accent           | #2ECC8F   | `accent`        | Verified evidence, positive trajectory, primary buttons, links |
| Accent-dim       | #1E5C44   | `accent-dim`    | Accent backgrounds at low emphasis (badge fills) |
| Warning          | #E8A838   | `warning`       | Risk flags, gaps, coaching observations          |
| Danger           | #D9534F   | `danger`        | High onboarding risk only. Use sparingly.        |
| Text primary     | #F0F2F5   | `txt`           | Headings, body                                   |
| Text secondary   | #8B91A0   | `txt-dim`       | Labels, captions, metadata                       |

Rules:
- No other colors anywhere. No white (#FFFFFF) — `txt` is the lightest value.
- No gradients of any kind.
- Accent appears on every screen at least once but never covers more than
  ~10% of the visible area. It must stay rare enough to mean something.

Tailwind config (use exactly this in `tailwind.config.js`):
```js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0E0F11", surface: "#161820", elevated: "#1E2028",
        separator: "#2A2D35", accent: "#2ECC8F", "accent-dim": "#1E5C44",
        warning: "#E8A838", danger: "#D9534F",
        txt: "#F0F2F5", "txt-dim": "#8B91A0",
      },
      fontFamily: {
        display: ['"IBM Plex Sans"', "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ['"IBM Plex Mono"', "monospace"],
      },
    },
  },
  plugins: [],
}
```

## 2. Typography

Google Fonts import (in `index.html` head):
IBM Plex Sans (400, 500, 600), Inter (400, 500), IBM Plex Mono (400, 500).

| Role               | Class recipe                                        |
|--------------------|-----------------------------------------------------|
| Page title         | `font-display text-2xl font-semibold text-txt`      |
| Section header     | `font-display text-lg font-medium text-txt`         |
| Eyebrow label      | `font-body text-xs uppercase tracking-widest text-txt-dim` |
| Body               | `font-body text-sm text-txt`                        |
| Caption / metadata | `font-body text-xs text-txt-dim`                    |
| Data value (ALL numbers, scores, percentages, dates-as-data) | `font-mono` + size as needed |
| Big metric         | `font-mono text-3xl font-medium`                    |

Hard rule: every number that represents data (match scores, risk scores,
salaries, counts, percentages) is `font-mono`. No exceptions. This single
discipline is what makes the UI read as an intelligence tool.

## 3. Spacing & shape
- Spacing scale: Tailwind defaults, but section padding is consistently `p-6`,
  card padding `p-5`, gaps between cards `gap-4`.
- Border radius: `rounded-lg` (8px) on cards and buttons. `rounded-full` only
  on dots/pills. Never `rounded-3xl`, never `rounded-none`.
- Borders: `border border-separator` on every card. Cards do NOT use shadows —
  borders define edges in this system.
- Max content width: `max-w-7xl mx-auto` on every page.

## 4. Signature component — EvidenceIndicator

The one element this prototype is remembered by. A small inline indicator that
sits immediately left of every skill name, everywhere skills appear.

Three states:
1. `asserted` — hollow circle. 10px diameter, 1.5px border `txt-dim`,
   transparent fill. Tooltip/legend text: "Asserted — claimed, not yet evidenced"
2. `evidence` — solid circle, 10px, fill `accent`.
   Legend: "Evidence-linked — backed by an artifact"
3. `verified` — solid circle, 10px, fill `accent`, containing a 6px white-ish
   (#0E0F11) checkmark (use lucide `Check` at 8px, color base, inside the dot).
   Legend: "Employer-verified — confirmed by workplace outcome data"

Build it once as `<EvidenceIndicator state="asserted|evidence|verified" />` in
`src/components/EvidenceIndicator.jsx`. Never re-implement it inline.
A `<EvidenceLegend />` component renders all three states with labels — it
appears on the landing page and the candidate profile.

## 5. Core components (build all in Phase 0, in `src/components/`)

| Component          | Spec                                                                   |
|--------------------|------------------------------------------------------------------------|
| `AppShell`         | Top nav bar: left = "CareerOS" wordmark (font-display, font-semibold, "OS" in accent), right = RoleSwitcher. Below: page content on `bg-base min-h-screen`. |
| `RoleSwitcher`     | Segmented control, 2 options: "Candidate view" / "Employer view". Switching navigates to `/candidate/profile` or `/employer/dashboard`. Active segment `bg-elevated text-txt`, inactive `text-txt-dim`. Small caption under it on hover or always: "Prototype control — switches judged perspective". |
| `SplitPanel`       | Two-column layout: left `w-[58%]`, right `w-[42%]`, `gap-6`. Stacks vertically below `lg`. Left = data, right = intelligence (engine output). |
| `DataCard`         | `bg-surface border border-separator rounded-lg p-5`. Optional eyebrow label + section header. |
| `MetricBlock`      | Eyebrow label on top, big mono value below, optional caption. |
| `Badge`            | Pill, `text-xs font-mono`, variants: accent (`bg-accent-dim text-accent`), warning (`bg-warning/10 text-warning`), neutral (`bg-elevated text-txt-dim`). |
| `RiskDot`          | 8px dot + mono label. Green `accent` (low), amber `warning` (moderate), red `danger` (high). |
| `CoachingCard`     | DataCard variant with `border-l-2 border-l-warning`, eyebrow "TRAJECTORY ENGINE — COACHING OBSERVATION", body text, caption with data basis (e.g. "Based on 1,240 comparable trajectories"). |
| `EngineCard`       | Same as CoachingCard but `border-l-accent`, eyebrow "TRAJECTORY ENGINE — MATCH REASONING". Used for employer-facing reasoning. |
| `Button`           | Primary: `bg-accent text-base font-medium rounded-lg px-4 py-2` (dark text on accent). Secondary: `border border-separator text-txt bg-transparent`. |
| `ScreenStub`       | Fallback screen (self-healing): centered page title + "This view is specified in SCREEN_SPECS.md §X" caption. Must render with zero errors. |

## 6. Charts (Recharts)
- Line/area color: `#2ECC8F`, cohort-average comparison line: `#8B91A0` dashed.
- Grid lines: `#2A2D35`. No chart backgrounds. Axis text: 11px Inter `#8B91A0`.
- Tooltips: `bg-elevated border border-separator`, mono values.

## 7. Copy rules
- Sentence case everywhere except eyebrow labels (UPPERCASE TRACKING-WIDE).
- Engine outputs are written as evidence-grounded statements with a data basis
  line, never vague encouragement. Use the exact copy in MOCK_DATA.md.
- No exclamation marks. No emoji. No "🚀". No "Welcome back!".
- Buttons say what they do: "Connect Salesforce", "Apply to this role",
  "Upload resume" — never "Submit", "Go", "Get started".

## 8. Forbidden (these instantly mark the UI as AI-generated)
- Purple/violet anything. Blue-to-purple gradients. Glassmorphism/backdrop-blur.
- Emoji in UI. Progress bars for skills. Star ratings.
- Centered hero with gradient text and two pill buttons.
- Generic stock-photo-style illustrations or avatar images (use mono initials
  in a `bg-elevated` circle for people).
- Skeleton shimmer effects. Confetti. Toasts that say "Success! 🎉".
