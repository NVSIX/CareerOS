# UPGRADE_DIRECTIONS — CareerOS V2 Upgrade Build

You are upgrading the COMPLETED V1 prototype in `careeros-prototype/` (see
HANDOFF.md and CODEX_LOG.md for its state). This is one autonomous run:
full visual redesign to DESIGN_SYSTEM_V2 + new features per
UPGRADE_SCREEN_SPECS. Zero supervision. Never stop to ask.

ALL V1 protocols remain in force exactly as written in DIRECTIONS.md:
SESSION START PROTOCOL, SESSION END PROTOCOL, AMBIGUITY PROTOCOL,
SELF-HEALING RULES, and the LOG GATE as a hard stop after every phase
(update CODEX_LOG.md + HANDOFF.md + RENDER CHECK). Log this run's phases as
U0–U7 in CODEX_LOG.md (add a second phase-status table titled "Upgrade
phases"). Append a new session entry in AGENT_CONTEXT.md.

## Reading order (before any code)
FROZEN_DECISIONS.md → the amendments below → DESIGN_SYSTEM_V2.md →
MOCK_DATA.md → MOCK_DATA_V2.md → SCREEN_SPECS.md → UPGRADE_SCREEN_SPECS.md →
DEMO_FLOW_V2.md → this file in full. (DESIGN_SYSTEM.md and DEMO_FLOW.md are
superseded — do not follow them.)

## FROZEN_DECISIONS amendments (project-owner authorised; all other F-rules stand)
- F3 AMENDED: routes are now the Updated routing table in
  UPGRADE_SCREEN_SPECS.md (+/register, +/candidate/skills,
  +/employer/retention). Still no other screens.
- F6 AMENDED: Tailwind remains the only styling system, PLUS the three
  `.layer-*` utility classes and the skill-tree pulse keyframes defined in
  DESIGN_SYSTEM_V2 — these live in src/index.css and nowhere else. No other
  custom CSS.
- F8 UNCHANGED and emphasised: NO new dependencies. The skill tree is pure
  SVG + React state. The pay-benchmark scale is divs. No graph/animation
  libraries.
- F10/F11 REPLACED by DESIGN_SYSTEM_V2 §1–§3 (warm palette, Hanken
  Grotesk/Inter/JetBrains Mono).
- F13 AMENDED: BentoGrid is the layout standard; SplitPanel persists as a
  7/5 BentoGrid wrapper for existing screens.
- F19 SUSPENDED FOR THE RESTYLE ONLY: phases U0–U2 may rewrite V1 code as
  needed for the redesign. From U3 onward F19 applies again in full.
- DESIGN DISCIPLINE RULE now points at DESIGN_SYSTEM_V2.md — re-read it at
  the start of every phase.

## RENDER CHECK (every phase, as in V1)
`npm run dev` serves; touched routes render with zero console errors;
navigation into/out of changed screens works; for U0–U2 additionally: the
screen contains no dark-system remnants visible on inspection.

---

# UPGRADE PHASES

## Phase U0 — Design system V2 foundation
0.1 index.html: swap Google Fonts to Hanken Grotesk / Inter / JetBrains Mono;
    keep title.
0.2 tailwind.config.js: replace colors + fontFamily blocks exactly per
    DESIGN_SYSTEM_V2 §1/§3.
0.3 src/index.css: body → `bg-base text-txt font-body`; add the three
    `.layer-*` classes and the `pulse-ring` keyframes verbatim.
0.4 Restyle every component in src/components/ per the V2 restyle map
    (DESIGN_SYSTEM_V2 §7): DataCard, MetricBlock, Badge (add `primary`
    variant), RiskDot, CoachingCard, EngineCard, Button (pill + pressed),
    EvidenceIndicator (hex updates only), TrajectoryChart (navy/teal/warm
    grid, inset well handled by callers), tables, ScreenStub.
0.5 AppShell V2: restyled top bar; NEW sidebar per DESIGN_SYSTEM_V2 §6 with
    role-contextual links (Retention + Skill map links may 404 to wildcard
    until their phases — acceptable, routes land in U3/U5); sidebar hidden on
    /, /register, /onboarding; RoleSwitcher restyled as inset/pressed pills.
    Content area offsets for the sidebar on routes that show it.
⛔ RENDER CHECK on / and /candidate/profile (they will look half-styled —
   expected until U1) + LOG GATE.

## Phase U1 — Restyle candidate-side screens to V2
Landing (incl. §U8 amendments: CTA pair + Stage 2 strip), OnboardingDiagnostic,
CandidateProfile (restyle only — scenarios come in U4), JobListings, JobDetail
(restyle only — tab comes in U4). Charts move into `layer-inset` wells.
⛔ RENDER CHECK (walk / → register-less path → onboarding → profile → jobs →
   job-001) + LOG GATE.

## Phase U2 — Restyle employer-side screens + dark-system purge
EmployerDashboard, EmployerCandidateView, SalesforceConnector to V2.
Then the PURGE GATE: `grep -ri` the src/ tree for every forbidden value in
DESIGN_SYSTEM_V2 §10 (#0E0F11, #161820, #1E2028, #2A2D35, #2ECC8F, #E8A838,
#F0F2F5, #8B91A0, "IBM Plex"). Zero hits required. Log the grep output.
⛔ RENDER CHECK (all 8 V1 routes) + LOG GATE.

## Phase U3 — /register + landing CTA wiring
Build §U1 of UPGRADE_SCREEN_SPECS (mockData §1 first). Add the route
(no sidebar). Verify both role paths route correctly.
⛔ RENDER CHECK + LOG GATE.

## Phase U4 — Scenario cards + pay benchmark tab
4.1 mockData: add trajectory scenarios (§3) and pay benchmark (§4).
4.2 CandidateProfile per §U3: TrajectoryChart takes projection as a prop;
    scenario card row; insight swap; "View skill map" pill (route lands U5;
    temporarily wildcard-redirects — acceptable, log it).
4.3 JobDetail per §U4: tab control + Pay benchmark tab with the div-built
    band scale + statutory card.
Verify in browser: scenario switching morphs the line (all three), tab
switching preserves apply-button state behavior.
⛔ RENDER CHECK + LOG GATE.

## Phase U5 — Skill tree ★ (the flagship — take the time to get it right)
5.1 mockData: nodes, edges, detail data (§2) — verbatim, coordinates included.
5.2 Build §U2 of UPGRADE_SCREEN_SPECS exactly: edges-then-nodes SVG, four
    node visuals, pulse ring keyframes, selection ring, labels, detail panel
    (default selection "a1"), planned state, legend card, sidebar + profile
    entry points now live.
5.3 Verify by clicking: select ≥6 different nodes across all four states and
    confirm the panel updates; plan a node; confirm the Planned badge + node
    ring; resize check (viewBox scales).
⛔ RENDER CHECK + LOG GATE.

## Phase U6 — Employer depth: dashboard amendments + retention screen
6.1 mockData: flight-risk rows, silver medalists, workforce signals,
    retention case, onboarding milestones (§5–§7).
6.2 EmployerDashboard per §U5 (column, Kevin row → retention, right-panel
    order, Re-engage local state).
6.3 RetentionDetail per §U6 (route + sidebar link live).
6.4 EmployerCandidateView per §U7 (milestone cards).
⛔ RENDER CHECK (dashboard → Kevin → retention → back → Amira → milestones)
   + LOG GATE.

## Phase U7 — Integration, purge re-check, build, deploy prep
7.1 Walk DEMO_FLOW_V2 steps 1–10 end to end; fix breaks (DEMO path wins all
    trade-offs).
7.2 Consistency audit: Amira's skills identical on profile/employer view AND
    consistent with skill-tree unlocked nodes; 87 unchanged; every new data
    value (67%, RM 5,445, cohort counts, +14%...) is font-mono; re-run the U2
    purge grep (zero hits).
7.3 `npm run build` — 0 errors.
7.4 Deploy per V1 Phase 9.4 rules (CLI if available, else document steps —
    not a failure).
7.5 FINAL LOG GATE: both phase tables current in CODEX_LOG.md; HANDOFF.md
    rewritten for the V2 state; UPGRADE DONE CRITERIA below pasted and
    checked; AGENT_CONTEXT.md session entry completed.

---

# UPGRADE DONE CRITERIA
- [ ] All 11 routes render with zero console errors
- [ ] DEMO_FLOW_V2 steps 1–10 work end to end by clicking only
- [ ] Purge grep: zero dark-system remnants in src/
- [ ] Skill tree: all 14 nodes selectable, 4 states visually distinct,
      planning works, default selection populated
- [ ] Scenario cards morph the projection line across all three scenarios
- [ ] Pay benchmark tab: band scale + bracket + anchor + statutory rows
- [ ] Flight-risk column present; Kevin Raj → retention screen works
- [ ] Silver medalists Re-engage and milestone cards render
- [ ] Sidebar appears on app routes only; active states correct
- [ ] Every data value font-mono; mock data single-sourced in mockData.js
- [ ] `npm run build` 0 errors; deployment done or steps documented
- [ ] CODEX_LOG.md, HANDOFF.md, AGENT_CONTEXT.md fully current
