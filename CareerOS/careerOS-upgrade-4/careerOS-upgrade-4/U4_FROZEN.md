# U4_FROZEN — Angular Build Locked Decisions

Every decision here is closed. Log objections in CODEX_LOG.md under
AUTONOMOUS DECISIONS and build as specified. This file SUPERSEDES all V1/V2/V3
frozen decisions for the new careeros-angular project.

## Project
- F1.  New project folder: `careeros-angular/` (sibling of `careeros-prototype/`).
       Do NOT modify the React prototype. Two codebases coexist.
- F2.  Product name in UI: "CareerOS". Engine: "the Trajectory Engine".
- F3.  All 12 routes from UPGRADE_SCREEN_SPECS.md are implemented.
       Sidebar on all routes except /, /register, /onboarding.

## Framework & structure
- F4.  Angular 17+ STANDALONE components only. Zero NgModules.
       `ng new careeros-angular --standalone --routing --style=scss`
- F5.  Angular Signals for ALL state (no RxJS for component state,
       no NgRx). `signal()`, `computed()`, `effect()` only.
- F6.  Angular Router with hash-free routing. Route animations via
       `@angular/animations` on the RouterOutlet in AppShell.
- F7.  One global state service: `AppStateService` (Injectable,
       providedIn: root). Mirrors AppContext from V3 exactly —
       same fields, same actions, same localStorage key
       `careeros_v2_state`. Mock data in `MockDataService`.

## Styling
- F8.  Tailwind CSS v3 + PostCSS integration via `ng add` or manual
       angular.json config. Global styles in `src/styles.scss`.
       Neumorphic utility classes defined in styles.scss ONLY —
       not in component styleUrls. Component styles use Tailwind
       utility classes directly in templates via `class=`.
- F9.  Design token names from U4_DESIGN.md. Tailwind `theme.extend`
       maps them exactly. Token names do NOT match V2 (this is a new
       system). Old V2 token names (#0E0F11 etc.) are fully gone.

## Animation stack — COMPLETE APPROVED LIST
- F10. `@angular/animations` — route transitions + component
       enter/leave + state machines. The primary animation system.
- F11. `gsap@^3` + `gsap/ScrollTrigger` — landing page hero sequence,
       counter animations, complex multi-element timelines,
       skill tree edge draw-in, Salesforce 72→61 sequence.
- F12. `d3@^7` — trajectory chart only. Full D3, not a wrapper.
- F13. `ngx-lottie` + `lottie-web` — two cinematic moments only:
       evidence capture checkmark + 72→61 score update.
- F14. `@angular/cdk/overlay` — skill tree detail panel as an
       overlay (slides from right, not a fixed column).
- F15. Canvas API (browser built-in) — dot-grid background on skill
       tree only (CSS radial-gradient is actually fine — use CSS,
       not Canvas, for the grid). Zero Canvas API usage.
       Skill tree nodes are absolute-positioned HTML divs.
       Edges are SVG lines in an overlay layer.
- F16. View Transitions API — browser-native, zero dependencies.
       `document.startViewTransition()` on route changes.
       `view-transition-name` on shared elements.

## Fonts
- F17. Google Fonts: Hanken Grotesk (600,700,800), Manrope (400,500,700),
       Inter (400,600), JetBrains Mono (500). In index.html.

## Icons
- F18. Lucide Angular (`lucide-angular`) for all icons. Same icon
       set as the React build for visual continuity.
       Import only used icons in each standalone component.

## Data
- F19. All mock entities are IDENTICAL to MOCK_DATA.md + MOCK_DATA_V2.md.
       MockDataService returns the same objects. No new entities.
       Application dates freeze to "11 Jun 2026".

## Process (all V1 protocols apply)
- F20. SESSION START PROTOCOL, SESSION END PROTOCOL, AMBIGUITY PROTOCOL,
       SELF-HEALING (ScreenStub equivalent = Angular component with
       route title + "Specified in U4_SCREENS.md §X" caption),
       LOG GATE (CODEX_LOG.md + HANDOFF.md + build check) — all in force.
- F21. Phases run A0 → A11 in order. No skipping.
- F22. Never stop for clarification. Never ask the user anything.
- F23. `ng build` must produce 0 errors at every LOG GATE from A2 onward.
       `ng serve` smoke-check (no browser automation — check console output
       for compile errors). This replaces `npm run build` / `npm run dev`.
- F24. DEMO_FLOW_V2.md is the protected judge path. All 10 steps must
       work by clicking only before the build is declared complete.
