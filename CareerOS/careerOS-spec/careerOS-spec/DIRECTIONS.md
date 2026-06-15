# DIRECTIONS — CareerOS Prototype Master Build Instructions

You are building a clickable prototype for the Talentbank Tech Hackathon 2026
Stage 1 submission. You will build it START TO FINISH IN ONE RUN with zero
human supervision. You never stop to ask a question. Everything you need is
in this spec package.

## THE ONLY RULE THAT CANNOT BE BROKEN
Every phase ends with a mandatory LOG GATE (update CODEX_LOG.md, update
HANDOFF.md, pass the RENDER CHECK). You cannot write a single line of the
next phase until the LOG GATE is complete. Hard stop. Not a suggestion.

---

## SESSION START PROTOCOL (mandatory, before any code, every session)
1. Append a new entry to AGENT_CONTEXT.md: agent name, model, session number,
   timestamp, starting phase.
2. Read HANDOFF.md — current state, last verified step, next action.
3. Read CODEX_LOG.md — phase status table, autonomous decisions so far,
   known issues.
4. Read FROZEN_DECISIONS.md in full.
5. Resume at the phase HANDOFF.md names. If mid-phase, find the last verified
   step in CODEX_LOG.md and continue from it.
First-ever session: there is no prior state — fill in AGENT_CONTEXT.md
session 1 and CODEX_LOG.md's Environment section (node --version, OS, absolute
working directory), then begin Phase 0.

## SESSION END PROTOCOL (mandatory if a session must stop for any reason)
1. Update CODEX_LOG.md with every step completed this session.
2. Update HANDOFF.md: current state, last verified step, exact next action.
3. Complete your AGENT_CONTEXT.md entry: ending phase, last verified step.
4. Confirm `npm run dev` serves the app without console errors.

## AMBIGUITY PROTOCOL (when the spec doesn't cover something)
1. Check FROZEN_DECISIONS.md — already decided?
2. Check DESIGN_SYSTEM.md — does an existing pattern apply?
3. Make the most conservative choice consistent with existing decisions.
4. Log it in CODEX_LOG.md → AUTONOMOUS DECISIONS (decision + one-line reason).
5. Continue. NEVER stop for clarification (FROZEN_DECISIONS F18).

## SELF-HEALING RULES (when something breaks)
1. Read the actual error. Fix THAT error — do not refactor the component.
2. Maximum 3 fix attempts per error.
3. Still broken after 3: replace the screen with `<ScreenStub />` at the
   correct route, log `UNRESOLVED: [issue] — [what was tried]` in HANDOFF.md
   under Known Issues, move to the next phase.
4. The build always continues. A rendering stub beats a stopped build.

## DESIGN DISCIPLINE RULE
At the start of every screen phase (2–8): RE-READ DESIGN_SYSTEM.md before
writing component code. Never build from memory of the tokens.

## SPEC READING ORDER (first session, before Phase 0)
FROZEN_DECISIONS.md → DESIGN_SYSTEM.md → MOCK_DATA.md → SCREEN_SPECS.md →
DEMO_FLOW.md → this file in full.

---

# PHASES

Each phase below ends with:
**RENDER CHECK** — `npm run dev` serves; the phase's route(s) render with zero
console errors; navigation into and out of the new screen works.
**⛔ LOG GATE** — Step A: update CODEX_LOG.md (mark phase status, list files
created/changed, note any autonomous decisions). Step B: update HANDOFF.md
(current state, last verified step, next action). Then — and only then — the
next phase.

## Phase 0 — Scaffold + design system
0.1 `npm create vite@latest careeros-prototype -- --template react`, install
    deps per FROZEN_DECISIONS F8 only. Tailwind init with the exact config
    from DESIGN_SYSTEM.md §1. Google Fonts links in index.html per §2.
0.2 Global styles: body `bg-base text-txt font-body`, antialiased.
0.3 Create `src/data/mockData.js` — EVERY object from MOCK_DATA.md, verbatim.
0.4 Build all core components from DESIGN_SYSTEM.md §5 in `src/components/`,
    including EvidenceIndicator (all 3 states), EvidenceLegend, ScreenStub.
0.5 Temporary gallery route `/` rendering every component once with sample
    props — this is the Phase 0 render check surface (replaced in Phase 2).
RENDER CHECK + ⛔ LOG GATE.

## Phase 1 — Router + AppShell + RoleSwitcher
1.1 React Router v6 setup with ALL routes from SCREEN_SPECS.md routing
    summary; every screen starts as ScreenStub with its real title.
1.2 AppShell wraps all routes (nav bar, wordmark, RoleSwitcher).
1.3 RoleSwitcher navigates per spec; active state reflects current section.
1.4 Wildcard route redirects to `/`.
RENDER CHECK (click through every stub via nav and direct URL) + ⛔ LOG GATE.

## Phase 2 — Landing page (SCREEN_SPECS §1)
Replace gallery. Build per spec, copy verbatim from MOCK_DATA §7.
RENDER CHECK + ⛔ LOG GATE.

## Phase 3 — Onboarding diagnostic (SCREEN_SPECS §2 ★)
Build the 5-step state machine exactly. All copy from MOCK_DATA §6.
Verify every step transition by clicking through 0→4 in the browser.
RENDER CHECK (full click-through) + ⛔ LOG GATE.

## Phase 4 — Candidate living portfolio (SCREEN_SPECS §3)
Includes the first Recharts chart (trajectory + cohort + projection).
RENDER CHECK + ⛔ LOG GATE.

## Phase 5 — Job listings + job detail (SCREEN_SPECS §4, §5)
Two screens, one phase. Apply-button confirmation state included.
RENDER CHECK (listings → detail → apply) + ⛔ LOG GATE.

## Phase 6 — Employer candidate view (SCREEN_SPECS §7 ★ core value screen)
Reuses the §3 skill-row component with the same data — do not duplicate it.
RENDER CHECK + ⛔ LOG GATE.

## Phase 7 — Employer dashboard (SCREEN_SPECS §6)
Pipeline table with row navigation to Phase 6's screen; Salesforce card.
RENDER CHECK (dashboard → candidate row → back → Salesforce link) + ⛔ LOG GATE.

## Phase 8 — Salesforce connector (SCREEN_SPECS §8 ★)
Build the 3-state machine with the setTimeout progress sequence. Verify the
full disconnected → connecting → connected run twice (remount cleanly).
RENDER CHECK + ⛔ LOG GATE.

## Phase 9 — Integration, build, deploy
9.1 Walk DEMO_FLOW.md steps 1–8 end to end in the browser. Fix any broken
    link or inconsistent data (MOCK_DATA is the arbiter).
9.2 Cross-screen consistency audit: Amira's 6 skills identical on §3 and §7;
    match score 87 identical on §4, §6, §7; all data values font-mono.
9.3 `npm run build` — must succeed with 0 errors. Fix until it does
    (SELF-HEALING rules apply).
9.4 Deploy: if Vercel CLI is available and authenticated, `vercel --prod`.
    If not available/authenticated, this is NOT a failure: write exact deploy
    steps (push to GitHub → import in Vercel dashboard → framework preset
    Vite) into HANDOFF.md under "Deployment", and log the decision.
9.5 FINAL LOG GATE: CODEX_LOG.md — all phases marked complete, file inventory
    (`find src -name "*.jsx" -o -name "*.js" | xargs wc -l`), 3-sentence build
    summary at top. HANDOFF.md — every section filled as if handing to a new
    developer; DONE CRITERIA checklist pasted with each item checked.

---

# DONE CRITERIA (the build is complete when ALL are true)
- [ ] All routes in SCREEN_SPECS.md render without console errors
- [ ] DEMO_FLOW.md steps 1–8 work end to end by clicking only
- [ ] RoleSwitcher works from every screen
- [ ] Mock data consistent across all screens (one Amira, one Juara, one 87)
- [ ] Every data value renders in font-mono
- [ ] `npm run build` succeeds with 0 errors
- [ ] Deployed URL live, OR exact deploy steps documented in HANDOFF.md
- [ ] No console.log statements left in src/
- [ ] CODEX_LOG.md and HANDOFF.md fully current (final LOG GATE complete)

---

# STAGE2_NOTES (reference only — do NOT build any of this now)
The Stage 2 production build (June 16 – July 26) replaces this prototype with:
Angular 17+ frontend · NestJS + Apollo GraphQL API · FastAPI Python AI
microservice (parsing pipelines, RAG, agents) · Supabase (Postgres + pgvector
+ Auth + Storage) · Claude API (Sonnet/Opus split) · sentence-transformers
embeddings · simple_salesforce against a Salesforce Developer sandbox ·
synthetic data generator (Faker + custom schema). The prototype's design
system, mock entities, and screen logic carry forward as the Stage 2 UI spec.
Nothing in this section affects the prototype build.
