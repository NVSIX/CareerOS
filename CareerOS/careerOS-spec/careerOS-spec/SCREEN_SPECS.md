# SCREEN SPECS — All Routes

Routes are final (FROZEN_DECISIONS F3). Each spec lists: purpose, layout,
content (referencing MOCK_DATA.md sections), and its aha moment from
DEMO_FLOW.md. Two screens are marked ★ HIGH COMPLEXITY and carry exact state
machines — build those states precisely.

Global: every screen renders inside `AppShell` (nav + RoleSwitcher), on
`bg-base`, content in `max-w-7xl mx-auto p-6`.

---

## §1 `/` — Landing page
Purpose: the thesis in ten seconds.
Layout: single column. Headline + subline (MOCK_DATA §7) → three DataCards in
a row (stack on mobile) → EvidenceLegend in a bordered card → primary CTA
"See how it works" → footer caption.
No hero image. No gradient. The typography IS the hero.
Aha: the headline itself.

## §2 `/onboarding` — Candidate adaptive diagnostic ★ HIGH COMPLEXITY
Purpose: show the engine probing claims instead of accepting a form. The most
concept-dense screen in the prototype.
Layout: SplitPanel. LEFT = diagnostic conversation. RIGHT = "Profile —
building live" panel showing Daniel Lim's profile assembling.

State machine (single `step` state, 0→4; all content from MOCK_DATA §6):
- step 0: Left: DataCard with "Upload resume" primary button and caption
  "PDF parsing simulated in prototype". Right: empty-state caption
  "Profile populates as the diagnostic runs."
- step 1 (after clicking Upload): Left: a "resume parsed" confirmation row
  (file name `daniel_lim_resume.pdf`, mono). Right: 4 skills appear with
  their EvidenceIndicators (2 evidence, 2 asserted) under header "Parsed
  claims". Auto-advance to step 2 after 600ms OR a "Continue" button —
  choose the button (judges control pace).
- step 2: Left: probe 1 appears as an engine message (DataCard, eyebrow
  "TRAJECTORY ENGINE"), with ONE reply chip below it. Clicking the chip
  renders the reply right-aligned and advances. Right: Python row gains the
  "artifact requested" Badge + sub-line.
- step 3: probe 2 + chip, same pattern. Right: "Behavioural signals" section
  appears with "Ownership orientation — emerging" badge.
- step 4: Left: completion DataCard — "Profile evidence density: 2
  verified-ready artifacts identified" + primary button "View your living
  portfolio" → `/candidate/profile`. Right panel remains fully populated.
Transitions: chips/buttons only. No timers except the optional 600ms noted.
No free-text input anywhere.
Aha: the right panel visibly reacting to each answer — claims being tested,
not collected.

## §3 `/candidate/profile` — Living portfolio (Amira)
Purpose: the evidence model + trajectory in one view.
Layout: SplitPanel.
LEFT: header block (initials circle, name, headline, location, tenure — data
from MOCK_DATA §1) → DataCard "Competency evidence profile": all 6 skills,
each row = EvidenceIndicator + skill name + evidence source caption (txt-dim).
Order: verified first, then evidence, then asserted. → EvidenceLegend (small).
RIGHT: DataCard "Trajectory" with Recharts line chart (actual, cohort dashed,
projection dashed-accent; MOCK_DATA §1 trajectory data) → CoachingCard with
the exact coaching observation + data basis.
Aha: hollow vs solid dots — a judge instantly sees which claims are proven.

## §4 `/jobs` — Job listings
Purpose: compulsory core feature, polished and fast.
Layout: single column. Search input (non-functional is fine; filters by title
client-side if trivial) + industry filter chips (All / Logistics / Retail /
Mobility / Industrial). Below: 5 job rows (MOCK_DATA §3 table) as DataCards —
left: title (display font), company + location + posted (caption); right:
salary (mono) + "Trajectory match" MetricBlock (mono, accent if ≥80, txt if
60–79, txt-dim below 60). Row click → `/jobs/job-001` (all rows may route to
job-001 in the prototype; log it).
Aha: match scores that are explained one click deeper, not black-box.

## §5 `/jobs/job-001` — Job detail + apply
Purpose: explainable matching, candidate side.
Layout: SplitPanel.
LEFT: job header (title, company, location, salary, posted) → DataCard
"About this role" (2–3 sentences you may write: last-mile coordination,
vendor management, WMS ownership — conservative, plain) → DataCard
"Performance fingerprint of successful hires" listing the 4 fingerprint items
(MOCK_DATA §3).
RIGHT: EngineCard variant for candidates — header "Your match analysis",
"3 of 4 signals" as big mono metric, the 4 signals as rows (✓ in accent,
✗ in warning, each with its evidence-state caption), then the matchNote copy
→ primary button "Apply to this role" → on click swaps to a confirmation
DataCard: "Application submitted — 11 Jun 2026" (mono date) + caption
"Juara Logistics will see your evidence profile, not just your resume."
Aha: the ✗ gap explained constructively with the month-24 cohort line.

## §6 `/employer/dashboard` — Employer overview
Purpose: the recruiter's working view; sets up Salesforce.
Layout: SplitPanel (left wider — table needs room).
LEFT: header "Talent pipeline — Juara Logistics Group" + caption (Farah
Iskandar context) → pipeline table (MOCK_DATA §4): columns Candidate, Role,
Trajectory match (mono), Onboarding risk (RiskDot), Days (mono). Amira's row
click → `/employer/candidate/cand-001`. Table rows `border-b border-separator`,
hover `bg-elevated`.
RIGHT: MetricBlock "Projected 90-day onboarding success — 84%" → Badge row
"Pipeline trajectory health: Strong" → DataCard "Needs attention" (Kevin Raj,
Marcus Tan flags) → persistent DataCard "Connect Salesforce" with one line
("Ground these scores in your own performance data") + secondary button
"Connect Salesforce" → `/employer/salesforce`.
Aha: risk scores sitting next to match scores — pre-hire and post-hire in one
table.

## §7 `/employer/candidate/cand-001` — Candidate view, employer lens ★ core value screen
Purpose: the engine's reasoning output. Same human as §3, different lens.
Layout: SplitPanel.
LEFT: Amira header block → "Verified competency profile" — the same 6 skill
rows as §3 (same component, same data — consistency IS the demo) → caption:
"Evidence states are shared between candidate and employer views."
RIGHT: EngineCard with the gapNote copy + data basis → DataCard "Onboarding
outlook": Recharts small line chart — expected performance curve vs cohort
average (reuse trajectory arrays, relabel axes "Months in role" /
"Performance index"; conservative reuse, log it) → RiskDot "Low" + mono "87"
trajectory match MetricBlock.
Aha: natural-language reasoning with a data basis line — no black box.

## §8 `/employer/salesforce` — Salesforce connector ★ HIGH COMPLEXITY
Purpose: the engine's data source made tangible; the loop closing.
Layout: single column, max-w-4xl.

State machine (single `connState`: "disconnected" → "connecting" → "connected"):
- disconnected: DataCard "Connect your Salesforce" — field-mapping diagram
  built from simple bordered rows (NOT an image): two columns,
  "Stays in your Salesforce (Tier 1)" [names, compensation, manager notes —
  each row with a lock icon, txt-dim] | "Crosses to CareerOS (Tier 2,
  anonymised)" [performance quartile, role classification, tenure,
  milestones, attrition flag — each with arrow icon, accent]. Privacy note
  copy from MOCK_DATA §5 below the diagram. Primary button
  "Connect Salesforce (sandbox)".
- connecting: button replaced by a 3-row progress list that fills
  sequentially (~700ms apart, simple setTimeout chain):
  "Authenticating with Salesforce sandbox…" → "Mapping fields…" →
  "Applying privacy boundary…" — each gains an accent check when done.
- connected: (1) DataCard "First record received" showing Hafiz Rahman's
  Tier-2 fields as mono key-value rows, source caption. (2) The effect line
  (exact copy, MOCK_DATA §5) in an EngineCard — risk score "72 → 61" with the
  72 struck-through txt-dim and 61 in accent mono. (3) Small DataCard
  "Living portfolio updated" — Hafiz's two skills flipping to `verified`
  indicators. (4) Secondary button "Back to dashboard" → `/employer/dashboard`.
No real network calls. The setTimeout sequence is the only async in the app.
Aha: "72 → 61" — the entire engine thesis in five characters.

---

## Routing summary (React Router v6)
```
/                                → Landing
/onboarding                      → OnboardingDiagnostic
/candidate/profile               → CandidateProfile
/jobs                            → JobListings
/jobs/job-001                    → JobDetail   (param route /jobs/:id is fine;
                                                render job-001 regardless)
/employer/dashboard              → EmployerDashboard
/employer/candidate/cand-001     → EmployerCandidateView (param route fine)
/employer/salesforce             → SalesforceConnector
*                                → redirect to /
```
RoleSwitcher: "Candidate view" → /candidate/profile, "Employer view" →
/employer/dashboard, from any screen.
