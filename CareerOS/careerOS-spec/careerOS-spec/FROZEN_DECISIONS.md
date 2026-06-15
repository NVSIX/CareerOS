# FROZEN DECISIONS — DO NOT REVISIT, DO NOT "IMPROVE"

Every decision in this file is closed. It was made deliberately by the project
owner after extended deliberation. If you believe a frozen decision is wrong,
log your objection in CODEX_LOG.md under AUTONOMOUS DECISIONS and build it as
specified anyway. Do not refactor, substitute, or "upgrade" anything below.

## Product scope (Stage 1)
- F1. This is a CLICKABLE PROTOTYPE, not a product. No backend. No database.
      No API calls. No auth. All data is hardcoded mock data from MOCK_DATA.md.
- F2. The prototype exists to be judged via DEMO_FLOW.md. Build to that flow.
- F3. Exactly the routes listed in SCREEN_SPECS.md. No extra screens, no
      settings pages, no 404 art, no login screens.

## Stack
- F4. Vite + React 18 + JavaScript (NOT TypeScript — speed over rigor for a
      5-day prototype).
- F5. React Router v6 (`react-router-dom`) for navigation.
- F6. Tailwind CSS with the custom token config from DESIGN_SYSTEM.md.
      No other styling system. No styled-components, no CSS modules, no MUI,
      no shadcn, no component libraries of any kind.
- F7. Recharts for the two charts (trajectory line, performance-vs-cohort).
      No D3, no Chart.js.
- F8. Allowed npm dependencies — COMPLETE LIST:
      react, react-dom, react-router-dom, recharts, lucide-react (icons only).
      Plus dev deps: vite, @vitejs/plugin-react, tailwindcss, postcss,
      autoprefixer. NOTHING ELSE. If a phase seems to need another package,
      it doesn't — solve it with these.
- F9. Deployment target is Vercel (static build). `npm run build` must succeed.

## Design (full detail in DESIGN_SYSTEM.md — these are the unchangeable anchors)
- F10. Dark enterprise-intelligence aesthetic. Base #0E0F11. Accent #2ECC8F.
       Warning #E8A838. No purple. No blue gradients. No glassmorphism.
- F11. Fonts: IBM Plex Sans (display/headings), Inter (body),
       IBM Plex Mono (all numbers, scores, data values). Loaded via Google Fonts.
- F12. The Evidence Indicator (3 states: asserted / evidence-linked /
       employer-verified) is the signature UI element. It appears exactly as
       specified in DESIGN_SYSTEM.md on every skill, everywhere skills appear.
- F13. Split-panel layout (data left, intelligence right) is the standard
       screen pattern. Not card grids.

## Data
- F14. Every entity (people, companies, jobs, scores, dates) comes from
       MOCK_DATA.md. Never invent a name, number, or company. If a screen needs
       data that MOCK_DATA.md doesn't define, reuse the closest existing entity
       and log the decision.
- F15. All currency in RM. All locations Malaysian. Dates relative to June 2026.

## Process
- F16. Phases run 0 → 9 in order. No skipping, no merging, no reordering.
- F17. Every phase ends with its LOG GATE (CODEX_LOG.md + HANDOFF.md + render
       check). The LOG GATE is a hard stop, not a suggestion.
- F18. Never stop to ask the user a question. Use the AMBIGUITY PROTOCOL in
       DIRECTIONS.md.
- F19. Code built in earlier phases (by any agent) is not refactored in later
       phases unless it is actually broken. Style preferences are not breakage.

## Naming
- F20. Product name everywhere in UI: "CareerOS". Engine name where referenced:
       "the Trajectory Engine". Repo/project folder: `careeros-prototype`.
