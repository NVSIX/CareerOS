# U4_SCREENS — Angular Screen Component Specs

Every screen maps to a lazy-loaded standalone Angular component.
All data from MockDataService. All state from AppStateService.
All animations from U4_ANIMATION.md triggers.
All visuals from U4_DESIGN.md.

---

## §1 `/` — LandingComponent
Selector: `app-landing`
File: `features/landing/landing.component.ts`
No sidebar. No persona badge.

Template structure:
- `<nav>` fixed top: CareerOS wordmark (primary, `view-transition-name: wordmark`) +
  top nav links (Dashboard/Jobs hidden until registered) + avatar/settings icons
- Hero section: headline + subline + dual CTA ("Create your profile" primary → /register,
  "See how it works" secondary → /onboarding) + right-side device mockup
  (a `nm-raised rounded-3xl` card containing a screenshot of the CareerOS jobs screen
  as an `<img>` — use a self-referential screenshot placeholder or a thin grid-pattern
  placeholder div)
- "Platform Ecosystems" section: `<h2>` + arrow scroll buttons + horizontal snap shelf
  (3 cards: Candidates, Employers, Universities; each `nm-raised rounded-3xl p-6 hover:scale-[1.02]`
  with lucide icon in `bg-primary/10 rounded-xl`, title in primary, bullet list, ghost CTA button)
- Stat strip: `nm-inset rounded-2xl` containing 4 stats:
  "2.4M Active Candidates", "10,000+ Employers", "100+ Universities", "98% Match Quality"
  All values in `font-mono text-headline-lg` with `[countUp]` directive,
  labels in `font-label text-label-md uppercase tracking-widest text-secondary`
- Stage 2 strip: eyebrow + badge row for scoped modules
- Footer

Animations: GSAP hero stagger, stat countUp ScrollTrigger, [@listStagger] on shelf.
Stitch reference: `enterpriseflow_platform_hub_compact_horizontal/screen.png`

---

## §2 `/register` — RegisterComponent
No sidebar. No persona badge.
Pre-fill: if `state.registered()` is true, show "Welcome back, {name}" caption +
pre-filled inputs; "candidate" tile pre-selected by default.

Layout: centered `max-w-2xl`, heading + subline, two role tiles side by side,
name + email inputs, "Get started" button, footnote.

Role tiles: `nm-raised rounded-2xl p-6 cursor-pointer transition-all duration-200`
with lucide icon in `nm-inset rounded-xl`, title in `font-display font-bold`,
desc in caption. Selected: `nm-pressed ring-2 ring-primary`. `(click)` sets
`selectedRole` signal. Button is disabled (`opacity-50 cursor-not-allowed`) until
a role is selected.

On "Get started": `state.register(name, email)` then Router.navigate per role.

---

## §3 `/onboarding` — OnboardingComponent ★
No sidebar. Candidate persona badge in top bar.

Layout: two-column grid (60/40 split, stacks on mobile).
LEFT: diagnostic conversation.
RIGHT: "Profile — building live" with real-time skill rows + probe log stream.

Step machine: `stepIndex = signal(0)`. Template uses `@switch (stepIndex())`.

Horizontal stepper above left column: 4 steps (Cognition/Logic Flow/Verification/
Finalization). Step labels + numbers. Active: `bg-primary-container text-primary`.
Complete: `bg-primary text-on-primary` + lucide Check. `[@stepFill]` on each.

Step content (all `[@stepTransition]` on `:enter`/`:leave`):
- 0: "Load my profile" primary button (simulates upload). Caption: "We'll verify
     your existing profile claims." Right: empty state with engine caption.
- 1: `nm-raised` EngineCard eyebrow "TRAJECTORY ENGINE — PROFILE PARSED" +
     step1Intro text. "Continue" button advances. Right: 6 skill rows slide in
     `[@listStagger]` with EvidenceIndicators per current state.
- 2: Probe 1 EngineCard (SQL) + reply chip. On chip click: SQL flips to evidence
     `[@evidenceFlip]`, "Evidence captured" badge appears `[@fadeIn]`, probe log
     streams messages. Auto-advances to step 3 after 1200ms OR on chip click.
- 3: Probe 2 EngineCard (cross-functional) + chip. Same pattern.
- 4: Completion DataCard with `completionHeader` (section header) + `completionSub`
     (body) + CTA → /candidate/profile. `state.completeDiagnostic(updatedSkills)` fires
     on this step's `ngOnInit`.

Right panel lower: scrolling probe log `<div class="nm-inset rounded-xl p-3 h-40 overflow-y-auto">`,
entries with `class="probe-log-entry"` added via `[@listStagger]` array binding.

Stitch reference: `enterpriseflow_adaptive_diagnostic_compact_grid/screen.png`

---

## §4 `/candidate/dashboard` — DashboardComponent
Sidebar: Dashboard (active), Profile, Skill map, Jobs, Reset demo.
Persona badge: candidate.

Layout: BentoGrid `grid-cols-12`.
TOP ROW (col-span-12): greeting eyebrow `"{{ state.candidate().name.toUpperCase() }}'S CAREER ACTIVITY"`.

LEFT (col-span-7):
- "Applications" `nm-raised` card: `@for (job of state.appliedJobs())` rows;
  empty: centered caption "No applications yet — apply to a role to see it here."
- "New matches" `nm-raised` card with eyebrow "TRAJECTORY ENGINE — 2 NEW MATCHES":
  job-002 + job-003 from MockDataService, each with mono match score + "View role" → /jobs/:id

RIGHT (col-span-5):
- "Evidence gaps" `nm-raised` card: `@for (skill of assertedSkills())` (computed from
  `state.skills()` filtering state === 'asserted') with warning badge "Artifact needed".
  If zero asserted: accent text "All claims evidenced — profile fully verified."
  "Edit profile" → /candidate/profile?tab=edit
- CoachingCard (same coaching copy from MockDataService)

---

## §5 `/candidate/profile` — ProfileComponent
Sidebar: Dashboard, Profile (active), Skill map, Jobs.

HEADER CARD (`nm-raised rounded-2xl`): avatar initials circle (Amira=#d6e0f3,
`view-transition-name: candidate-avatar`) + name (`font-display text-headline-md`,
reads `state.candidate().name`) + headline (primary) + location + email.
Right side: "Connect" primary + "Download CV" secondary buttons.
Also: secondary pill "View skill map" → /candidate/skills.

TWO TABS: "Portfolio" (default) | "Edit profile". Active: `nm-pressed text-primary`.
Tab content wrapped in `[@tabCrossfade]`.

PORTFOLIO TAB — layout: BentoGrid.
LEFT (col-span-5):
- "Living Portfolio" `nm-raised` card eyebrow + "HIGH-DENSITY VIEW" label link:
  `@for (skill of state.skills())` — each row: icon (lucide) in `nm-inset rounded-lg w-9 h-9`,
  skill name (body-md semibold), evidence source caption, 4 segment bars on the right.
  Segment bars animate on mount via GSAP. `[@evidenceFlip]` on state changes.
- "Verification Map" card: small thumbnail showing a scaled preview of the skill tree
  (static SVG thumbnail is fine — or a `routerLink` card to /candidate/skills).

RIGHT (col-span-7):
- "Growth Trajectory" `nm-inset` chart well (D3 trajectory chart, navy actual line,
  grey dashed cohort, primary dashed projection per selectedScenario).
- Three scenario cards in a row (stack on mobile). Each `nm-raised rounded-xl p-4`:
  tag eyebrow, label semibold, status chip (ACTIVE/EXPECTED/PLANNED).
  Selected: `nm-pressed ring-1 ring-primary border-l-4 border-primary`.
  `(click)="state.setScenario(s.id)"`.
- CoachingCard (`[@fadeSlideUp]` with 400ms delay).
- "Recent Evidence Tokens" `nm-raised` card: 3 timestamped entries from MockDataService
  with `[@listStagger]`. Each entry: primary left border 2px, mono timestamp, body text,
  category badge.

EDIT PROFILE TAB — same as V3: name/headline/location inputs + skill editor + "Add skill" +
"Save profile" → commits to AppStateService + switches to Portfolio tab.
Reads `?tab=edit` query param via `ActivatedRoute.queryParams`.

Stitch reference: `enterpriseflow_user_profile_compact/screen.png`

---

## §6 `/candidate/skills` — SkillsComponent ★
Sidebar: Dashboard, Profile, Skill map (active), Jobs.
Page: full-width canvas.

LAYOUT: `grid-cols-12`.
LEFT canvas (col-span-8): `relative overflow-hidden skill-tree-canvas rounded-2xl`
containing:
  (a) SVG edge overlay (position absolute, inset 0, pointer-events-none):
      `<line>` per edge with GSAP stroke-dashoffset animation.
  (b) Node divs (position absolute, `[style.left]` + `[style.top]` from node coordinates):
      - unlocked: `nm-raised rounded-xl w-24 p-3 text-center cursor-pointer`
        + lucide icon + label. Navy bg on hover.
      - available: same + `ring-2 ring-primary` + outer `pulse-ring` div
      - locked: `nm-raised rounded-xl w-20 p-3 opacity-60 cursor-default`
        + lucide Lock icon
      - milestone (core): `nm-raised rounded-2xl w-28 p-4 bg-primary text-on-primary`
        + lucide Star
  (c) `[class.scale-105]="selectedNode()?.id === node.id"` for selected highlight.
  (d) Zoom controls (bottom left, stacked): `+` / `−` / `⊡` (focus) buttons `nm-raised-sm rounded-lg`.
Legend strip above canvas: 4 states with mini-visual + label.

RIGHT detail panel (col-span-4): `[@slideInRight]` on `@if (selectedNode())`.
- Node title (section header) + state badge
- "Requirements" / "Unlocks" / "Cohort" / "Time to reach" rows (label: body-sm secondary; value: mono)
- "Add to career plan" primary button (only if available node) — triggers GSAP burst +
  `state.planNode(id)`. After plan: badge "Planned" replaces button.
- Planned nodes get a small primary-red dot on their top-right corner via `@if (isPlanned(node.id))`.

Engine caption below canvas. Entry from sidebar "Skill map" + profile "View skill map" button.
Default selected: the 'a1' node (Senior coordination available).

Stitch reference: `enterpriseflow_skill_map_compact_canvas/screen.png`

---

## §7 `/jobs` — ListingComponent
Sidebar: Dashboard, Profile, Skill map, Jobs (active).
LAYOUT: grid-cols-12.

LEFT (col-span-8):
- Page title "Jobs" + caption "1,240 comparable trajectories mapped across your network."
- Search input (`nm-inset rounded-full`) + filter chips (All/Logistics/Retail/Mobility/Industrial)
- `@for` job rows — each `nm-raised rounded-xl p-4 cursor-pointer hover:translate-x-1 transition-transform`:
  left icon `nm-inset rounded-lg w-10 h-10` + title (body-md semibold) + details caption;
  right: "TRAJECTORY MATCH" eyebrow + mono % in primary (≥80), on-surface (60-79), secondary (<60).
  `(click)="router.navigate(['/jobs', job.id])"`.
  `[@listStagger]` on the list container.

RIGHT (col-span-4):
- "Marketplace Insight" `nm-raised` card: context copy + "Optimize Profile" primary
  button → /candidate/profile?tab=edit.
- "Trending Skills" `nm-raised` card: 3 rows (Route Optimisation 92%, SAP Inventory 85%,
  Lean Management 76%). Each row: label + right-aligned mono demand % + `nm-inset`
  progress track with filled bar (`bg-primary`). GSAP fills bars on mount.

Stitch reference: `enterpriseflow_jobs_compact/screen.png`

---

## §8 `/jobs/:id` — DetailComponent
Sidebar: same as listing, Jobs active.
LAYOUT: BentoGrid.

LEFT (col-span-5): Job header (`nm-raised`) — icon, title, company/location/salary,
posted. "About this role" `nm-raised` card — 2-3 sentences. "Performance fingerprint"
`nm-raised` card — 4 bullet rows with lucide icons.

RIGHT (col-span-7):
Two tabs: "Match analysis" | "Pay benchmark". `[@tabCrossfade]`.

Match analysis tab:
- EngineCard "YOUR MATCH ANALYSIS": big mono match score (87 for job-001) + sub "of 4 signals".
  `view-transition-name: "job-score-{{ job.id }}"` on the score element.
- 4 signal rows `[@listStagger]`: ✓ (lucide CheckCircle primary) / ✗ (lucide XCircle warning) +
  skill name + evidence caption.
- Gap note (EngineCard, employer framing on /jobs/:id renders as candidate framing — `matchNote` copy).
- `@if (!applied())`: "Apply to this role" primary. `@else`: confirmation DataCard.

Pay benchmark tab (job-001 only; other jobs: "Detailed benchmark available after application"):
- Salary band scale (`nm-inset rounded-xl p-5`): horizontal div track, P25/P50/P75 ticks +
  offer bracket overlay + anchor marker. All GSAP-animated (see U4_ANIMATION).
- Position note + basis caption.
- Statutory `nm-raised` card: 5 mono key-value rows, take-home in `text-primary font-semibold`.

---

## §9 `/employer/dashboard` — EmployerDashboardComponent
Sidebar: employer section: Dashboard (active), Retention, Salesforce, Reset demo.
Persona badge: "Farah Iskandar · Employer".

THREE METRIC CARDS (full-width top row, `[@listStagger]`):
- "ONBOARDING SUCCESS" → 84% `[countUp]="84"` + "+2.4% vs LY" caption + primary progress bar
- "ACTIVE PIPELINE" → "124 Candidates" (6 in prototype, caption: "prototype shows 6 demo candidates")
- "AVG. FLIGHT RISK" → "Low" text-body-md semibold + green stable badge + mini bar

CANDIDATE PIPELINE table (`nm-inset rounded-2xl` wrapper):
Column headers: CANDIDATE / ROLE PATH / STAGE / FLIGHT RISK / ACTIONS (three-dot menu icon)
Each row: avatar circle + name + headline | role | stage chip | risk dot + label | ⋮
Amira's row → /employer/candidate/cand-001 (cursor-pointer, hover bg-surface-container-low)
Kevin's row → /employer/retention
Others: non-clickable (cursor-default)
`view-transition-name: "candidate-avatar"` on Amira's avatar.

RIGHT PANEL (`nm-raised` sidebar-within-page, col-span-3 on 12-col grid or `w-72 flex-shrink-0`):
- "NEEDS ATTENTION" eyebrow + 2 rows (Kevin: "3 flight-risk signals", Marcus: "competitor activity detected")
  + "Address All" primary button (no action)
- "SILVER MEDALISTS" eyebrow + 2 rows (Priya, Hafizuddin) with match scores + "Re-engage" ghost button
  → `state` local signal flips to "Invited" badge on click
- "Connect Salesforce" `nm-raised` card + primary button → /employer/salesforce
- "STAGE 2 PREVIEW" eyebrow + "Resilience Outlook" beta badge (neutral)

FOOTER: "INTEGRATIONS" + "Connect Salesforce" chip + Stage 2 preview chips.

Stitch reference: `enterpriseflow_talent_pipeline_compact/screen.png`

---

## §10 `/employer/candidate/:id` — CandidateViewComponent
Sidebar: employer, Dashboard active (not a top-level sidebar item).
Back link "← Pipeline" → /employer/dashboard.
Persona badge: employer.

HEADER: same avatar (`view-transition-name: "candidate-avatar"`), name/headline/location
from AppStateService (consistent with candidate view). "Download CV" secondary button.

LAYOUT: BentoGrid.
LEFT (col-span-5): "Verified competency profile" — same skill rows as candidate profile,
reads `state.skills()`. Caption: "Evidence states are shared between candidate and
employer views." + small EvidenceLegend.

RIGHT (col-span-7):
- EngineCard "gapNote" copy + data basis
- "Growth trajectory" D3 chart (`nm-inset` well) — employer relabels:
  axis X "Months in role", Y "Performance index". Reuse same component with different
  `[labels]` input.
- MetricBlock: 87 accent mono + "Trajectory match" eyebrow.
- RiskDot Low + label.
- "ONBOARDING SUCCESS PREDICTOR" eyebrow + 3 milestone cards (left to right, `[@listStagger]`):
  Week 1-2 (low, accent), Week 3-4 (moderate, warning), Month 2 (low, accent).
  Each card `nm-raised rounded-xl p-4`: status dot + period label + note caption.

---

## §11 `/employer/retention` — RetentionComponent
Sidebar: employer, Retention (active).
Breadcrumb: "Talent Pool › Engineering ›" + "Kevin Raj Selvam" in primary.
Persona badge: employer.
"Export PDF" secondary button top-right (no action).

LAYOUT: BentoGrid.
LEFT (col-span-7): "Signal Timeline" `nm-raised` card + "Real-time Feed" badge (pulse-dot).
4 signal rows (newest first), each `nm-raised-sm rounded-xl p-4`:
  colored dot (high=danger, warning=warning, neutral=surface-dim) + label (semibold) +
  date (mono caption right-aligned) + description (body-sm secondary below label).
  Vertical hairline connecting dots: `absolute left-5` line between rows.
  `[@listStagger]` on rows.

RIGHT (col-span-5):
- "90-DAY CHURN PROBABILITY" eyebrow.
  Big `#churnScore` span: `[countUp]="67"` + "+12% VS LAST MONTH" caption.
  Risk bar (GSAP fills 67% width on mount).
  Reasoning body text + data basis mono caption.
- "RECOMMENDED ACTIONS" `nm-raised` card: 2 rows (Schedule 1:1 / Benchmark compensation)
  each `nm-raised-sm rounded-xl p-4 flex items-center justify-between`:
  icon in `bg-primary-container rounded-lg` + title semibold + subtitle caption + chevron.
  Row 2 links → /jobs/job-001 (opens pay benchmark tab — query param `?tab=pay`).
- Lottie "score-drop" plays once on mount (ambient — subtle, not intrusive).
- Privacy footnote caption at bottom.

Stitch reference: `enterpriseflow_retention_signals_compact/screen.png`

---

## §12 `/employer/salesforce` — SalesforceComponent
Sidebar: employer, Salesforce (active).
Persona badge: employer.

LAYOUT: single column `max-w-3xl mx-auto`.

ALWAYS-VISIBLE intro card (`nm-raised`): Hafiz avatar (HR, bg=#d9e3f6) + name + role +
"3 months · Top 25%" mono chip. `[@fadeIn]` on mount.

THREE-STATE machine: `connState = signal<'disconnected' | 'connecting' | 'connected'>('disconnected')`.

DISCONNECTED state (`[@fadeSlideUp]`):
- "Connect your Salesforce" heading.
- Field-mapping diagram `nm-inset rounded-2xl p-5`:
  Two columns separated by a dashed center line.
  Left "Stays in Salesforce (Tier 1)": 5 rows, each `nm-raised-sm rounded-lg p-2 flex items-center gap-2`:
    lucide Lock icon `text-secondary` + label `text-on-surface text-body-sm`.
  Right "Crosses to CareerOS (Tier 2, anonymised)": 5 rows, each with lucide ArrowRight `text-primary` + label.
  Privacy note caption below.
- "Connect Salesforce (sandbox)" primary button.

CONNECTING state (`[@stepTransition]`):
3-row progress list `nm-raised rounded-xl p-5`:
  Each row: circle (filled when done `bg-primary text-on-primary`, empty `nm-inset` otherwise) +
  label text. `[@checkmarkPop]` on the checkmark icon inside the circle.
  setTimeout chain: 700ms between steps, then 500ms delay to connected.

CONNECTED state (`[@fadeSlideUp]`):
1. "First record received" `nm-raised` card: Hafiz name + role + source caption.
   5 mono key-value rows (tier-2 fields).
2. EngineCard: "72" with strike-through line (GSAP), "→", "61" (GSAP countDown).
   Lottie `score-drop` plays. Effect line copy. Data basis.
3. "Living portfolio updated" `nm-raised` card: 2 Hafiz skills with verified indicators
   `[@evidenceFlip]`. Slides up `[@fadeSlideUp]` 300ms after score animation.
4. "Back to dashboard" secondary → /employer/dashboard.

---

## Shared components to build in Phase A2

All standalone, accept @Input(), emit @Output() where needed:
`AppShellComponent`, `DataCardComponent`, `MetricBlockComponent`,
`BadgeComponent`, `EvidenceIndicatorComponent` (with `[@evidenceFlip]`),
`CoachingCardComponent`, `EngineCardComponent`, `RiskDotComponent`,
`ButtonComponent` (primary/secondary variants, `nm-button` built in),
`MonoTextComponent`, `SkillSegmentBarsComponent` (4-segment),
`SidebarComponent`, `PersonaBadgeComponent`, `ScreenStubComponent`,
`CountUpDirective`, `CountUpService`.
