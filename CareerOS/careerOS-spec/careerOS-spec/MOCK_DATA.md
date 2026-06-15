# MOCK DATA — Single Source of Truth

Every name, number, company, score, and sentence of engine copy in the
prototype comes from this file. Implement it as `src/data/mockData.js`
exporting these objects verbatim. No screen hardcodes its own data.
If a screen needs something not defined here: reuse the nearest entity and
log the decision. NEVER invent new people or companies.

All dates are relative to "today" = 11 June 2026. Currency = RM.

---

## 1. PRIMARY CANDIDATE — the demo protagonist (appears on every candidate screen)

```
id: "cand-001"
name: "Amira Hashim"
initials: "AH"
headline: "Logistics Operations Coordinator"
location: "Petaling Jaya, Selangor"
experienceYears: 2.5
currentRole: "Operations Coordinator, Juara Logistics Group"
tenureMonths: 22
```

### Skills (evidence states drive the EvidenceIndicator everywhere)
| Skill                        | State     | Evidence source                                  |
|------------------------------|-----------|--------------------------------------------------|
| Route optimisation           | verified  | Q1 2026 performance review — Juara Logistics     |
| Warehouse management systems | verified  | WMS migration project outcome — Juara Logistics  |
| Python (data analysis)       | evidence  | Uploaded artifact: delivery-delay analysis notebook |
| Stakeholder coordination     | evidence  | Uploaded artifact: vendor onboarding playbook    |
| SQL                          | asserted  | — (claimed on resume, no artifact yet)           |
| Cross-functional project leadership | asserted | — (claimed, no artifact yet)              |

### Trajectory data (for the trajectory line chart, candidate profile)
Months since career start vs. composite competency index (0–100):
```
[ {m: 0, v: 22}, {m: 6, v: 31}, {m: 12, v: 38}, {m: 18, v: 52},
  {m: 24, v: 58}, {m: 30, v: 63} ]
cohortAverage: [ {m: 0, v: 22}, {m: 6, v: 28}, {m: 12, v: 34},
  {m: 18, v: 41}, {m: 24, v: 47}, {m: 30, v: 52} ]
projection (dashed, months 30→48): [ {m: 30, v: 63}, {m: 36, v: 70},
  {m: 42, v: 76}, {m: 48, v: 81} ]
```

### Coaching observation (CoachingCard, candidate profile — exact copy)
> "Candidates with your profile in logistics operations who reached senior
> level typically demonstrated independent cross-functional project ownership
> by month 24. You are at month 22 with no project artifact logged in the
> last 4 months. Your strongest near-term move: document the WMS migration
> as a portfolio artifact — it converts an employer-verified outcome into
> visible evidence."
> Data basis: "Based on 1,240 comparable logistics-operations trajectories"

---

## 2. SECONDARY CANDIDATE — appears in employer pipeline + onboarding demo

```
id: "cand-002"
name: "Daniel Lim Wei Jian"
initials: "DL"
headline: "Junior Data Analyst"
location: "Kuala Lumpur"
experienceYears: 1
```
Skills: SQL (evidence), Excel/Power BI (evidence), Python (asserted),
Statistical modelling (asserted).
Used as the "fresh profile" in the onboarding diagnostic screen (§4 of
SCREEN_SPECS.md) — his diagnostic builds the profile live.

---

## 3. EMPLOYER ACCOUNT

```
id: "emp-001"
company: "Juara Logistics Group"
descriptor: "Mid-size 3PL & last-mile logistics, 1,800 employees"
location: "Shah Alam, Selangor"
user: "Farah Iskandar — Head of Talent Acquisition"
salesforceStatus: starts "disconnected" (Salesforce screen flips it)
```

### Open role (the demo job)
```
id: "job-001"
title: "Senior Logistics Coordinator"
company: "Juara Logistics Group"
location: "Shah Alam, Selangor"
salary: "RM 5,800 – RM 7,200 / month"
posted: "3 days ago"
performanceFingerprint (shown on employer side): top performers in this role
  showed — ownership orientation by month 12, WMS fluency, cross-functional
  collaboration, sustained vendor relationship management
```

### Amira → job-001 match analysis (job detail page + employer candidate view)
```
trajectoryMatch: "3 of 4 signals"
signals:
  ✓ Ownership orientation        — verified (Q1 2026 review)
  ✓ WMS fluency                  — verified (migration project)
  ✓ Vendor relationship mgmt     — evidence (onboarding playbook)
  ✗ Cross-functional leadership  — asserted only, no artifact
gapNote (exact copy, employer view, EngineCard):
  "This candidate's trajectory matches your Senior Logistics Coordinator role
   on ownership orientation, technical progression, and vendor management.
   The one gap — cross-functional project leadership — was present in 60% of
   your previous successful hires in this role at the point of hiring. It is
   a development signal, not a disqualifying one."
  Data basis: "Based on 214 hires into comparable roles, APAC logistics"
matchNote (exact copy, candidate-facing, job detail page):
  "Your trajectory aligns with this role on 3 of 4 signals. The gap:
   demonstrated cross-functional project leadership. Candidates who moved into
   this role successfully typically showed this signal by month 24 — you have
   an employer-verified project (WMS migration) that likely qualifies but is
   not yet documented as an artifact."
```

### Other job listings (job listings page — 5 rows total incl. job-001)
| id      | Title                          | Company                  | Location      | Salary (RM/mo)   | Match |
|---------|--------------------------------|--------------------------|---------------|------------------|-------|
| job-001 | Senior Logistics Coordinator   | Juara Logistics Group    | Shah Alam     | 5,800 – 7,200    | 87    |
| job-002 | Supply Chain Analyst           | Nusantara Retail Berhad  | Bukit Jalil   | 5,200 – 6,500    | 74    |
| job-003 | Operations Executive           | PortLink Marine Services | Port Klang    | 4,800 – 5,900    | 68    |
| job-004 | Data Analyst, Fleet Intelligence | Velocita Mobility      | Bangsar South | 5,500 – 7,000    | 61    |
| job-005 | Procurement Coordinator        | Tenaga Mas Industries    | Subang Jaya   | 4,500 – 5,600    | 55    |

(Match scores are Amira's — shown in candidate view as mono values.)

---

## 4. EMPLOYER PIPELINE (employer dashboard table — 6 rows)

| Candidate            | Role applied        | Trajectory match | Onboarding risk | Days in pipeline |
|----------------------|---------------------|------------------|-----------------|------------------|
| Amira Hashim         | Senior Log. Coord.  | 87               | Low (green)     | 4                |
| Daniel Lim Wei Jian  | Fleet Data Analyst  | 72               | Moderate (amber)| 9                |
| Priya Renganathan    | Senior Log. Coord.  | 81               | Low (green)     | 6                |
| Marcus Tan Jia Hao   | Operations Exec     | 64               | Moderate (amber)| 14               |
| Nurul Ain Bakar      | Senior Log. Coord.  | 77               | Low (green)     | 2                |
| Kevin Raj Selvam     | Procurement Coord.  | 58               | High (red)      | 21               |

Aggregate metrics (right panel, employer dashboard):
- "Projected 90-day onboarding success" → 84% (mono, accent)
- "Pipeline trajectory health" → "Strong" badge
- Flagged: Kevin Raj Selvam ("risk signals: 3"), Marcus Tan ("stalled 14 days")

---

## 5. SALESFORCE PERFORMANCE RECORD (the Salesforce connector screen)

The previously-hired employee whose data demonstrates the engine:
```
name: "Hafiz Rahman" (initials HR)
role: "Logistics Coordinator, hired via CareerOS — 14 Mar 2026 (3 months ago)"
```
Incoming synthetic record shown after "connection":
```
source: "Salesforce — Juara Logistics Group (sandbox)"
fields received (Tier-2, anonymised at boundary):
  performance_quartile: "Top 25%"
  milestones_hit: "4 of 4 (first 90 days)"
  role_classification: "Logistics Coordination"
  tenure_months: 3
  attrition_flag: false
```
Effect line (exact copy, accent):
> "Onboarding risk score updated: 72 → 61. Hafiz Rahman's verified outcomes
> now strengthen the performance fingerprint for Senior Logistics Coordinator
> hires."
Privacy note shown in the field-mapping diagram (exact copy):
> "Individual names, compensation, and manager notes never leave the
> employer's Salesforce. Only anonymised Tier-2 signals cross this boundary."

After connection, Hafiz's "Route optimisation" and "Milestone delivery" skills
appear with `verified` indicators in a small "Living portfolio updated" card —
this is the loop closing visually.

---

## 6. ONBOARDING DIAGNOSTIC SCRIPT (candidate onboarding screen — exact Q&A)

The diagnostic runs on Daniel Lim (cand-002). Pre-scripted exchange, advanced
by clicking the suggested reply chips (no free text input needed):

Step 1 — after simulated resume upload (a click on "Upload resume" advances):
  Parsed claims appear in right panel: SQL (evidence), Excel/Power BI
  (evidence), Python (asserted), Statistical modelling (asserted).

Step 2 — Engine probe 1 (left panel, chat-style):
  "You listed Python as a working skill. Walk me through the most complex
   data task you've handled with it end to end."
  Reply chip: "I built a churn analysis script — pulled data with SQL,
   cleaned it in pandas, ran a logistic regression."
  Effect: Python state stays `asserted`, but a sub-line appears —
  "Probe response logged. Suggested artifact: upload the churn analysis
   notebook to convert this claim to evidence." + Badge "artifact requested"

Step 3 — Engine probe 2:
  "Your resume mentions a dashboard used by your team weekly. Who owns
   decisions made from it — you or your manager?"
  Reply chip: "I built it and present it; my manager makes the final calls."
  Effect: New profile attribute appears in right panel under "Behavioural
  signals": "Ownership orientation — emerging" (Badge, neutral)

Step 4 — Completion state:
  Right panel header: "Profile evidence density: 2 verified-ready artifacts
  identified". Primary button: "View your living portfolio" → /candidate/profile
  (note: routes to Amira's profile — acceptable prototype seam, the flow
  narration in DEMO_FLOW.md handles it).

---

## 7. LANDING PAGE COPY (exact)

Headline (font-display, large):
  "Every platform optimises for the hire. CareerOS tracks what happens after."
Subline (txt-dim):
  "The Trajectory Engine connects candidates, employers, and universities
   through verified workplace outcomes — matching demonstrated trajectory to
   role trajectory, not claims to requirements."
Three panels (DataCards): "For candidates — a living portfolio verified by
real outcomes" / "For employers — onboarding risk and trajectory match,
grounded in your own performance data" / "For universities — outcome loops
that reach beyond graduation" (third panel carries a neutral Badge: "Stage 2").
Below: EvidenceLegend with its three labelled states.
CTA: Primary button "See how it works" → /onboarding.
Footer caption: "CareerOS — Talentbank Tech Hackathon 2026 · Stage 1 prototype".
