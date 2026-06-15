# MOCK_DATA_V2 — Upgrade Additions

ADDITIVE to MOCK_DATA.md: every V1 entity (Amira, Daniel, Juara, jobs,
pipeline, Hafiz, diagnostic script) remains the single source of truth and
is NOT modified except where this file explicitly amends it. Implement all
of the following as new exports in `src/data/mockData.js`. Never invent
values not listed here.

---

## 1. REGISTRATION (`/register`)
```
heading: "Create your CareerOS profile"
subline: "One profile. Verified by real outcomes. Built for the next 40 years."
roles:
  candidate: { title: "I'm a candidate", desc: "Build a living portfolio and
    see where your trajectory leads." , icon: lucide User }
  employer:  { title: "I'm an employer", desc: "Match on trajectory, predict
    onboarding success, retain your people.", icon: lucide Building2 }
fields: Full name, Work email (text inputs, non-functional, no validation)
button: "Get started"
routing: candidate → /onboarding ; employer → /employer/dashboard
footnote: "Universities join in Stage 2."
```

## 2. SKILL TREE (`/candidate/skills`) — node graph, SVG viewBox 800×620
Center is Amira's core. States: unlocked / available / locked / milestone.
"evidence" V1 skills count as unlocked here (they are demonstrated).

Nodes (id, label, state, x, y):
```
core  "Logistics Operations"        milestone  400 310
u1    "Route optimisation"          unlocked   485 205   (verified)
u2    "WMS systems"                 unlocked   500 415   (verified)
u3    "Python (data)"               unlocked   305 215   (evidence)
u4    "Stakeholder coordination"    unlocked   295 410   (evidence)
a1    "Senior coordination"         available  615 270
a2    "Operations management"       locked     710 185
a3    "Head of logistics"           locked     745 80
b1    "Logistics analytics"         available  215 130
b2    "Fleet intelligence"          locked     115 75
b3    "Analytics management"        locked     60 175
c1    "Team leadership"             available  200 480
c2    "Training & enablement"       locked     115 555
c3    "L&D management"              locked     55 455
```
Edges (from → to):
```
core→u1, core→u2, core→u3, core→u4,
u1→a1, u2→a1, a1→a2, a2→a3,
u3→b1, b1→b2, b2→b3,
u4→c1, u2→c1, c1→c2, c2→c3
```
Edge styling: both ends unlocked → solid secondary 2px; into an available
node → dashed primary 2px; into a locked node → dashed #c9c4b8 1.5px.

Node detail-panel data (selected node → right panel):
```
a1 Senior coordination:
  requires: "Cross-functional project artifact (1 needed — your WMS migration
             qualifies, not yet documented)"
  unlocks: "Operations management track"
  cohort: "612 candidates with your profile reached this node"
  timeToReach: "4–7 months"
  action: "Add to career plan"           (available nodes only)
b1 Logistics analytics:
  requires: "Python evidence ✓ (already met) + SQL artifact (1 needed)"
  unlocks: "Fleet intelligence"
  cohort: "388 made this pivot from operations roles"
  timeToReach: "6–9 months"
  action: "Add to career plan"
c1 Team leadership:
  requires: "Ownership signal ✓ + direct mentoring evidence (1 needed)"
  unlocks: "Training & enablement"
  cohort: "271 moved into people-track roles"
  timeToReach: "8–12 months"
  action: "Add to career plan"
a2: requires "Senior coordination + 12 months tenure" | cohort "204" | time "18–24 months"
a3: requires "Operations management + P&L exposure" | cohort "57" | time "3–5 years"
b2: requires "Logistics analytics + fleet telemetry project" | cohort "121" | time "12–18 months"
b3: requires "Fleet intelligence + team scope" | cohort "44" | time "3–4 years"
c2: requires "Team leadership + enablement artifact" | cohort "96" | time "12–18 months"
c3: requires "Training & enablement + program ownership" | cohort "31" | time "3–5 years"
core/u1–u4 (unlocked): panel shows evidence source from V1 skills data +
  "This node strengthens: <child node labels>"
```
"Add to career plan" click → node gains a small primary Badge "Planned"
(local state only). Header strip above canvas: legend of the four node states.
Page intro line: "Where your verified skills can take you — 1,240 comparable
trajectories mapped." Engine caption under canvas: "Paths are generated from
real outcome data, not job-title taxonomies."

## 3. TRAJECTORY SCENARIOS (`/candidate/profile` upgrade)
Three scenario cards. Selected card drives the chart's projection dataset
(actual + cohort lines never change).
```
scenario "current"  label "Current path"  tag "Baseline"
  projection: [ {m:30,v:63},{m:36,v:70},{m:42,v:76},{m:48,v:81} ]
  insight: "Steady trajectory. You reach senior-level competency density
            around month 46 at the current evidence rate."
  basis: "Based on 1,240 comparable trajectories"

scenario "promotion" label "Promotion — Senior Coordinator" tag "If you take job-001"
  projection: [ {m:30,v:63},{m:36,v:74},{m:42,v:82},{m:48,v:88} ]
  insight: "Candidates who made this move at month 22–26 reached senior level
            8 months faster than cohort average. Your one gap signal is
            development-stage, not blocking."
  basis: "Based on 214 hires into comparable roles"

scenario "break"    label "Career break — 6 months" tag "Life chapter"
  projection: [ {m:30,v:63},{m:34,v:59},{m:38,v:62},{m:42,v:70},{m:48,v:79} ]
  insight: "A 6-month break at this stage typically delays trajectory peak by
            4–6 months but does not change the destination. Re-entry is
            strongest when the WMS project is documented before the break."
  basis: "Based on 167 re-entry trajectories, APAC logistics"
```

## 4. PAY BENCHMARK (second tab on `/jobs/job-001` right panel)
```
role: "Senior Logistics Coordinator — Malaysia"
bands (RM/month): P25 5,200 | P50 6,400 | P75 8,100
offer bracket: 5,800 – 7,200  (overlay on the band scale)
anchor: "RM 6,600" label "Your negotiation anchor — projected by month 30"
anchorBasis: "Based on 847 comparable verified-skill transitions"
positionNote: "This offer sits at market median. Verified-skill holders in
  your cohort negotiated to P65 within 18 months."
statutory rows (at RM 6,600, indicative 2026 rates):
  EPF — employee (11%)        RM 726
  SOCSO — employee            RM 29.75
  EIS — employee              RM 11.90
  PCB — estimated             RM 387
  Estimated take-home         RM 5,445 / month   (emphasised, mono, secondary)
employerLine: "Employer EPF contribution (12%): RM 792 — visible to employer view"
```
Render bands as horizontal div bars on a 0–9,000 scale inside a layer-inset
well (NOT Recharts): P25/P50/P75 tick markers in navy, offer bracket as a
primary-red bracket overlay, anchor as an accent marker with mono label.

## 5. EMPLOYER DASHBOARD DEPTH
### 5a. Flight risk column (new 4th data column in the pipeline table)
```
Amira Hashim        Stable      (accent dot)
Daniel Lim          Stable      (accent dot)
Priya Renganathan   Stable      (accent dot)
Marcus Tan          2 signals   (warning dot)
Nurul Ain Bakar     Stable      (accent dot)
Kevin Raj Selvam    3 signals   (danger dot)   → row click goes to /employer/retention
```
Amendment: Kevin Raj's row click now navigates to /employer/retention
(Amira's row still → /employer/candidate/cand-001; other rows non-clickable).
### 5b. Silver medalists card (below "Needs attention")
```
title: "Silver medalists" caption "Strong past candidates worth re-engaging"
rows:
  Priya Renganathan | interviewed: Senior Log. Coord., Feb 2026 | trajectory now: 81 (+4 since) | "Re-engage" button
  Hafizuddin Nor    | interviewed: Operations Exec, Jan 2026   | trajectory now: 76 (+9 since) | "Re-engage" button
```
"Re-engage" → button swaps to neutral Badge "Invited" (local state).
### 5c. Workforce signals card (bottom of right panel)
```
title: "Workforce signals" eyebrow "RESILIENCE OUTLOOK — STAGE 2 PREVIEW"
rows (mono value + caption):
  +14%  "APAC logistics talent shortage projected by 2028"
  23%   "Of your workforce roles carry moderate automation exposure"
  2 / 0 "Senior roles nearing succession vs. internal ready-now candidates"
```

## 6. RETENTION CASE (`/employer/retention` — Kevin Raj)
```
header: "Retention signals — Kevin Raj Selvam"
sub: "Procurement Coordinator · 14 months tenure · Juara Logistics Group"
signals timeline (newest first; icon, label, date, severity badge):
  TrendingDown  "Platform engagement −18% over 30 days"   "trend"        warning
  Users         "Peer departure — close collaborator resigned" "9 days ago"  warning
  Activity      "Platform activity drop began"            "14 days ago"  warning
  Clock         "Pipeline stall — no internal movement in 21 days" "21 days ago" neutral
outlook (EngineCard):
  churnRisk: "67%" label "90-day churn probability" (mono, danger)
  reasoning: "Three concurrent signals match the pattern that preceded 71% of
    voluntary departures in comparable roles. The strongest single predictor
    in this pattern — peer departure — occurred 9 days ago."
  basis: "Based on 1,083 retention outcomes, APAC mid-size logistics"
actions card "Recommended actions":
  1. "Schedule a 1:1 within 7 days" caption "Acting inside 14 days of a peer
     departure halves the churn probability in this pattern."
  2. "Benchmark his compensation" caption "Offer sits at P38 for role and
     tenure — below the retention-safe band." + secondary button
     "View pay benchmark" → /jobs/job-001 (opens listing context; prototype seam, log it)
privacyFootnote: "Signals are derived from anonymised Tier-2 platform data.
  No message content, no manager notes."
```

## 7. ONBOARDING MILESTONES (addition to `/employer/candidate/cand-001`)
```
title: "First 60 days outlook" eyebrow "ONBOARDING SUCCESS PREDICTOR"
cards (3 in a row; status dot + note):
  "Week 1–2 — Role clarity"            low risk (accent)
     "Verified WMS background removes the typical ramp-up risk."
  "Week 3–4 — Stakeholder integration" moderate (warning)
     "Maps to her one gap signal. Pair with a cross-functional buddy."
  "Month 2 — Independent ownership"    low risk (accent)
     "Ownership orientation is her strongest verified signal."
```

## 8. LANDING PAGE AMENDMENTS
- Second CTA next to "See how it works": primary button "Create your profile"
  → /register ("See how it works" becomes the secondary button).
- New compact strip above the footer — eyebrow "SCOPED FOR STAGE 2", one
  line of neutral Badges: Life Chapter Designer · Workforce Resilience
  Planner · University suite · Live Internship Marketplace · Lifelong
  Learning Wallet. Caption: "Demonstrated in part today; productionised in
  the build phase."
```
