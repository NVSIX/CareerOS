# U4_DIRECTIONS — Angular Build Master Instructions

You are building CareerOS in Angular 17+ from scratch in a NEW project folder
`careeros-angular/`. The React prototype in `careeros-prototype/` is UNTOUCHED.
Build start-to-finish in one autonomous run. Never stop to ask.

## READING ORDER (before any code)
U4_FROZEN.md → U4_STACK.md → U4_DESIGN.md → U4_ANIMATION.md → U4_SCREENS.md →
MOCK_DATA.md (careerOS-spec/) → MOCK_DATA_V2.md (careerOS-upgrade-spec/) →
DEMO_FLOW_V2.md (careerOS-upgrade-spec/) → this file in full.

## ALL V1 PROTOCOLS IN FORCE
SESSION START PROTOCOL, SESSION END PROTOCOL, AMBIGUITY PROTOCOL,
SELF-HEALING (ScreenStub Angular equivalent), LOG GATE (CODEX_LOG.md phase
table "Angular phases" + HANDOFF.md + build check). AGENT_CONTEXT.md: append
new session entry.

## BUILD CHECK (replaces `npm run build` / `npm run dev`)
After Phase A2 onward: `ng build` must complete with 0 errors.
`ng serve` console must show no compile errors (TypeScript, template, or import).
These replace `npm run build` and `npm run dev` in all LOG GATE render checks.

## AMBIGUITY PROTOCOL (unchanged)
Check U4_FROZEN → U4_DESIGN → most conservative choice → log → continue.

## SELF-HEALING
Max 3 attempts per error. Unresolved: `ScreenStubComponent` at the route,
log in HANDOFF.md Known Issues, continue.

## DESIGN DISCIPLINE RULE
Re-read U4_DESIGN.md at the start of every screen phase (A4 onward).

---

# PHASES

## Phase A0 — Scaffold + design system

A0.1 `ng new careeros-angular --standalone --routing --style=scss`
     + install ALL dependencies from U4_STACK §1.
A0.2 Replace `tailwind.config.js` verbatim from U4_DESIGN §1.
A0.3 Replace `src/styles.scss` verbatim from U4_DESIGN §2.
A0.4 Replace `src/index.html`: add Google Fonts links (U4_FROZEN F17),
     title "CareerOS", theme-color `#f7f9fd`, favicon placeholder.
A0.5 Update `src/main.ts` verbatim from U4_STACK §2.
A0.6 Add `src/app/app.routes.ts` verbatim from U4_STACK §3 (all routes as
     lazy-loaded ScreenStub initially — real components come in later phases).
A0.7 Download Lottie JSON files (checkmark + score-drop) from LottieFiles.com
     OR create minimal valid JSON stubs at `src/assets/lottie/checkmark.json`
     and `src/assets/lottie/score-drop.json` so imports don't break.
     If network access is unavailable for LottieFiles: generate a minimal valid
     Lottie JSON stub (version: 5.5, layers: [], w: 48, h: 48).
⛔ LOG GATE: `ng build` 0 errors; `ng serve` compiles cleanly.

## Phase A1 — Core services + types + animations

A1.1 `src/app/core/models/types.ts` — interfaces: Candidate, Skill, AppliedJob,
     Job, PipelineRow, ScenarioData, SkillNode, RetentionSignal.
     Copy field shapes from MOCK_DATA.md entities.
A1.2 `src/app/core/services/mock-data.service.ts` — every entity from
     MOCK_DATA.md + MOCK_DATA_V2.md verbatim. Readonly constants.
A1.3 `src/app/core/services/app-state.service.ts` verbatim from U4_STACK §5.
A1.4 `src/app/core/services/count-up.service.ts` from U4_ANIMATION §countUp.
A1.5 `src/app/core/animations/route.animations.ts` — export `routeAnimations`.
A1.6 `src/app/core/animations/entrance.animations.ts` — export all triggers from
     U4_ANIMATION §GLOBAL TRIGGERS.
A1.7 `src/app/shared/directives/count-up.directive.ts` from U4_ANIMATION.
⛔ LOG GATE: `ng build` 0 errors.

## Phase A2 — Shared components

Build ALL components listed at the bottom of U4_SCREENS.md as standalone Angular
components. Each in `src/app/shared/components/<name>/`.
- Every component: `standalone: true`, `changeDetection: ChangeDetectionStrategy.OnPush`.
- Use Angular Signals (not RxJS) for any local state.
- Inject AppStateService and MockDataService where needed.
- Include `animations: [...]` arrays referencing entrance.animations.ts triggers.
- EvidenceIndicatorComponent: includes `[@evidenceFlip]` trigger.
- ButtonComponent: includes `nm-button` class + onMouseDown/Up handlers.
- AppShellComponent: full top bar + sidebar + `<router-outlet>` + persona badge +
  route animation wrapper. Sidebar role-contextual per route prefix.
  `getRouteAnimationState()` method for `[@routeAnimations]`.
  "Reset demo" link at sidebar bottom.
⛔ LOG GATE: `ng build` 0 errors. Verify AppShell renders at / with sidebar hidden.

## Phase A3 — Routing + AppShell smoke check

A3.1 Replace all ScreenStub routes with their real lazy-loaded components
     (import exists but components are just shells — they'll be filled in
     later phases). Every route must serve a non-error page.
A3.2 RoleSwitcher in AppShell: "Candidate view" → /candidate/profile,
     "Employer view" → /employer/dashboard. From any route.
A3.3 Verify route animations fire on navigation between any two routes.
A3.4 View transition names on persistent elements: wordmark, (others come
     per screen in later phases).
⛔ LOG GATE: all 12 routes serve ScreenStub or shell component with no compile
errors. Route transition animation visible in ng serve output.

## Phase A4 — Landing page (U4_SCREENS §1)

Full LandingComponent per spec. GSAP hero stagger + ScrollTrigger for stat
strip. Horizontal snap shelf with arrow buttons. Stat countUp with CountUpDirective.
[@listStagger] on shelf cards.
⛔ LOG GATE: / renders full landing, hero animations fire on load, stat strip
counts up on scroll, shelf arrows scroll.

## Phase A5 — Register + Onboarding (U4_SCREENS §2, §3) ★

A5.1 RegisterComponent: role tiles, signal-driven selection, pre-fill from state,
     REGISTER dispatch on submit.
A5.2 OnboardingComponent: 5-step machine, [@stepTransition] on probe cards,
     [@evidenceFlip] on skill state changes, probe log stream (setTimeout chain),
     stepper with [@stepFill], [@listStagger] on right-panel skills,
     COMPLETE_DIAGNOSTIC on step 4 init.
⛔ LOG GATE: full click-through /register → /onboarding → complete →
/candidate/profile routes. Skills in AppStateService updated after diagnostic.

## Phase A6 — Candidate profile (U4_SCREENS §5)

D3 trajectory chart with `ngAfterViewInit` + `Promise.resolve()` pattern.
Three scenario cards with `[@tabCrossfade]` equivalent (ngIf swap).
Segment bars with GSAP stagger.
Coaching card `[@fadeSlideUp]` 400ms delay.
Recent Evidence Tokens `[@listStagger]`.
Edit profile tab reads/writes AppStateService.
?tab=edit query param handling via `ActivatedRoute.queryParams`.
`view-transition-name` on candidate avatar.
⛔ LOG GATE: chart renders, scenario switching morphs projection line, edit saves
to state and reflects in Portfolio tab.

## Phase A7 — Skill tree (U4_SCREENS §6) ★

Dot-grid background via CSS class (styles.scss).
14 node divs absolutely positioned from node coordinate data.
SVG edge overlay with GSAP stroke-dashoffset draw-in.
Angular CDK Overlay OR fixed right panel with `[@slideInRight]` for detail panel.
Node entrance GSAP burst (scale from 0.6, staged by ring).
Pulse ring on available nodes (CSS class pulse-ring).
Plan button: state.planNode() + GSAP particle burst.
Zoom controls: signal + GSAP scale on inner container.
Default selected: 'a1'.
⛔ LOG GATE: all 14 nodes visible, selectable, detail panel slides in, edge lines
draw in, plan button works and persists on refresh.

## Phase A8 — Jobs + Job detail (U4_SCREENS §7, §8)

ListingComponent: search filter + snap chips + 5 rows + Marketplace Insight sidebar
+ Trending skills bars (GSAP fill).
DetailComponent: read :id param. Job-001 gets full match + pay benchmark. Others
get trajectory preview. Pay benchmark GSAP band animation. [@tabCrossfade] on tab
switch. Apply → AppStateService → confirmation. Signal row GSAP stagger.
⛔ LOG GATE: /jobs search works, /jobs/job-001 match analysis and pay benchmark tabs
both render and animate, apply persists in localStorage.

## Phase A9 — Employer dashboard + candidate view (U4_SCREENS §9, §10)

EmployerDashboardComponent: 3 metric cards with CountUpDirective + GSAP stagger,
pipeline table with stage chips + risk dots, Amira row → /employer/candidate/cand-001,
Kevin row → /employer/retention, right panel with silver medalists Re-engage state,
workforce signals.
CandidateViewComponent: reads context skills (same as profile), gapNote EngineCard,
D3 chart (reuse same component with different label inputs), milestone cards GSAP stagger.
view-transition-name on candidate avatar in both screens.
⛔ LOG GATE: dashboard → Amira → employer candidate view → back → Kevin → retention.
All pipeline rows render with correct stage chips and risk dots.

## Phase A10 — Retention + Salesforce (U4_SCREENS §11, §12) ★

RetentionComponent: countUp 67%, GSAP risk bar fill, pulse-dot on Real-time Feed badge,
[@listStagger] signal timeline, [@slideInRight] action cards delayed 400ms,
view-transition-name on churn-score, Lottie score-drop ambient play.
SalesforceComponent: Hafiz intro card [@fadeIn], 3-state machine, [@checkmarkPop]
on checkmarks, GSAP 72→61 timeline (strikethrough width + countDown + color flip),
Lottie score-drop play synced to count, [@fadeSlideUp] on living portfolio card 300ms
after sequence completes.
⛔ LOG GATE: full Salesforce connection simulation runs cleanly, 72→61 GSAP sequence
plays, retention 67% counts up, all animations visible in ng serve.

## Phase A11 — Integration + deploy

A11.1 Walk DEMO_FLOW_V2.md steps 1–10 end to end in the browser (ng serve).
      Fix any broken navigation or missing data. DEMO path wins all trade-offs.
A11.2 Consistency audit: candidate name flows from register → badge → profile header
      → employer candidate view header; skills identical on candidate profile + skill
      tree unlocked nodes + employer view; 87 appears only from mockData, no hardcodes.
A11.3 View transition names audit: wordmark, candidate-avatar, job-score-job001,
      churn-score — all present on correct elements.
A11.4 Purge check: `grep -ri "0E0F11\|#2ECC8F\|#E8A838\|#F0F2F5\|faf9f4\|IBM Plex"
      src/` → 0 hits. Log result verbatim.
A11.5 `ng build --configuration production` → 0 errors.
A11.6 Deploy: if `vercel --prod` is available, run it. Otherwise document:
      1. Push careeros-angular/ to GitHub (root = package.json location).
      2. Vercel → New Project → import repo.
      3. Framework preset: Angular.
      4. Build command: `ng build --configuration production`.
      5. Output directory: `dist/careeros-angular/browser`.
      6. Deploy. `vercel.json` (create if absent): `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`.
A11.7 FINAL LOG GATE: CODEX_LOG.md Angular phase table all complete; HANDOFF.md
      rewritten for Angular state; AGENT_CONTEXT.md session entry completed;
      UPGRADE DONE CRITERIA below pasted with each item checked.

---

# UPGRADE 4 DONE CRITERIA

- [ ] `ng build --configuration production` completes with 0 errors
- [ ] All 12 routes render with no TypeScript or template errors
- [ ] DEMO_FLOW_V2 steps 1–10 work end to end by clicking only
- [ ] AppStateService: register flows to nav badge + profile header; diagnostic
      updates skills; apply writes to appliedJobs; plan persists; reset clears
- [ ] Landing: GSAP hero stagger + stat countUp ScrollTrigger fire on load
- [ ] Onboarding: probe log streams, evidence indicator flips, stepper progresses
- [ ] Profile: D3 chart renders + scenario cards morph projection line
- [ ] Skill tree: all 14 nodes selectable, edges draw in, plan persists, detail panel slides
- [ ] Jobs: pay benchmark GSAP band fills, tab crossfade, apply persists
- [ ] Employer dashboard: 3 metric countUp, stage chips correct, Kevin → retention
- [ ] Retention: 67% countUp + bar fill, signal stagger, action slide
- [ ] Salesforce: 72→61 GSAP sequence plays, Lottie fires, state machine clean
- [ ] View transition names present: wordmark, candidate-avatar, job-score-job001, churn-score
- [ ] Purge grep: 0 V2 dark-system tokens in src/
- [ ] Deployment done or manual steps documented in HANDOFF.md
- [ ] CODEX_LOG.md, HANDOFF.md, AGENT_CONTEXT.md fully current

---

# KICKOFF PROMPT (paste into Claude Code or Codex verbatim)

```
Read every file in careerOS-upgrade-4/ in this exact order:
U4_FROZEN.md → U4_STACK.md → U4_DESIGN.md → U4_ANIMATION.md →
U4_SCREENS.md → U4_DIRECTIONS.md.
Then read careerOS-spec/MOCK_DATA.md and careerOS-upgrade-spec/MOCK_DATA_V2.md
and careerOS-upgrade-spec/DEMO_FLOW_V2.md.

Then:
1. Append a new session entry to careerOS-spec/AGENT_CONTEXT.md
2. Build Phase A0 through A11 sequentially without stopping
3. Hit every LOG GATE — update careerOS-spec/CODEX_LOG.md (new "Angular phases"
   table) and overwrite careerOS-spec/HANDOFF.md at every gate
4. Follow the AMBIGUITY PROTOCOL for anything unspecified — never ask
5. Follow SELF-HEALING rules for any error
6. The build is complete when every UPGRADE 4 DONE CRITERIA item is met

OPERATING RULES:
Act, don't deliberate — every design, data, animation, and architecture decision
is in the spec files. Don't re-derive, don't survey alternatives.
Audit before claiming — before marking any LOG GATE complete, verify each claim
against an actual tool result (build output, compile log, route check).
Never end a turn on intent — issue the tool call in the same turn.
Nothing in this build is destructive. No pauses. No questions.

Begin.
```
