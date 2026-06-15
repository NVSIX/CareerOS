# U5_SCREENS — New & Amended Screens

Additive to U4_SCREENS.md. Angular standalone components, lazy-loaded, all
data from MockDataService, all visuals from U4_DESIGN.md + U5_DESIGN_UNIVERSITY.md,
animations from U4_ANIMATION.md grammar.

## Updated routing additions
```
/university/dashboard      UniversityDashboardComponent   NEW
/university/outcomes       UniversityOutcomesComponent    NEW ★ (Sankey)
/university/curriculum     UniversityCurriculumComponent  NEW ★ (heatmap)
/university/students       UniversityStudentsComponent    NEW
/university/program        TalentBankProgramComponent     NEW
/program/join              JoinProgramComponent           NEW (public explainer)
```
RoleSwitcher: now 3-way — Candidate / Employer / University.
University sidebar: Dashboard · Outcomes · Curriculum · Students · Program · (Reset demo).
University persona badge: "Dr. Lim Choon Keat · APU".

---

## §1 `/university/dashboard` — UniversityDashboardComponent
Per U5_DESIGN_UNIVERSITY hub layout. Header + connector strip (Moodle/APSpace/
TalentBank Program chips). Four radial-ring metric cards. Four large 2×2 entry
cards routing to outcomes/curriculum/students/program, each with a mini-visual.
Bottom: "How APU contributes to the exchange" three-column flywheel explainer.
Animations: rings fill on mount (GSAP stroke-dashoffset), entry cards listStagger.

## §2 `/university/outcomes` — UniversityOutcomesComponent ★
Edge C view 1 — Lifelong Outcome Loop.
TOP: page title "Graduate outcomes" + caption "Where our graduates go, tracked
for years — not just the first six months."
MAIN (large): D3 Sankey diagram — programs (left, navy nodes) → outcomes
(right, primary nodes), flow widths from U5_MOCK_DATA §5b. Hover highlights a
flow and shows its value (mono). Flows draw in on mount (GSAP).
BELOW: longitudinal employment timeline — horizontal line/area chart, x = years
since graduation (0–5), y = % in relevant employment, showing the cohort staying
tracked over time (the "we don't stop watching at 6 months" point). Distinct
from the employer trajectory chart in shape and intent.
SIDE/below caption: engine note "Outcome data flows back from employer
connectors — this is the loop that tells us which programs actually paid off."

## §3 `/university/curriculum` — UniversityCurriculumComponent ★
Edge C view 2 — Future-State Curriculum Engine.
TOP: title "Curriculum efficacy" + caption "Which modules actually predict
workplace success — measured against real graduate outcomes."
MAIN: efficacy HEATMAP — module rows, colour-scaled cells by efficacy
(U5_MOCK_DATA §5c). Each cell: module code + mono efficacy. Hover reveals the
note ("Strong predictor — emphasise" / "Weak downstream correlation — review").
Cells stagger-in on mount.
BELOW: rising vs declining skill demand — horizontal diverging bar chart
(U5_MOCK_DATA §5d). Rising primary, declining secondary.
CALLOUT: the gapAlert in a CoachingCard-style box ("Graduates strong in WMS but
under-prepared in data analysis — DAT2001 carries 3 credits; market suggests 6.")
This is the actionable curriculum recommendation — the module's whole point.

## §4 `/university/students` — UniversityStudentsComponent
Edge B view — Adaptive Readiness Profile, university-side.
TOP: title "Student readiness" + caption "A live signal of who's ready, built
from academics, verified achievements, and demonstrated competencies."
MAIN: a readiness BOARD (card/tile per student — NOT a dense table; see design
checklist). Each student card: avatar, name, program, readiness RING (not a
risk dot), signal summary ("3 verified achievements · CGPA 3.68"), status chip
(Graduated–hired / Final year). Amira's card is first and links to her full
profile (cross-side: the same person the candidate surface centres on).
Caption: "Readiness is a signal, not a verdict — students keep agency over what
they pursue." (echoes the Starter Kit's agency principle)

## §5 `/university/program` — TalentBankProgramComponent
The management/read view of verified organisations (passive records).
TOP: title "TalentBank Program" + coverage stats (47 verified orgs · 8,200
verified achievements · 64% student coverage) as radial/mono.
MAIN: list of verified organisations (CFA Society Malaysia, Nestlé Malaysia,
APU Tech Society, etc.) — each nm-raised-sm row with org name, verified
checkmark, achievement count, last-submitted date (mono). Read-only.
SIDE: "What this gives APU" explainer — verified achievement coverage improves
student signal and feeds curriculum efficacy. Link/button "Learn about the
Program" → /program/join.

## §6 `/program/join` — JoinProgramComponent (public explainer) ★
The detailed "Join the TalentBank Program" page so judges fully understand the
primitive. Accessible from: university program page, candidate profile
achievements section ("How are these verified?"), and a landing-page footer link.
Content verbatim from U5_MOCK_DATA §6:
- Hero + sub.
- "How it works" — 3 numbered steps with icons (verify org → submit records →
  achievements become calibrated verified evidence).
- "Why it matters" — 3 value-prop cards (organisations / students / ecosystem).
- Stats strip (47 orgs / 8,200 achievements / 64% coverage).
- Verified issuer examples (text/initial logos).
- A visual: small diagram showing "Raw claim → Verified at source → Calibrated
  against cohort → Trusted signal" as a 4-step horizontal flow.
- CTA "Apply to verify your organisation" → opens an explainer modal (prototype
  note: in production this starts a one-time verification review).
This page is marketing-grade — it's how judges grasp the concept, so make it
visually rich and self-explanatory. No sidebar (public page), but keep nav +
wordmark.

## §7 AMEND `/candidate/profile` — provenance + verified achievements
Two additions to the existing profile:
A. Each skill row now shows PROVENANCE — small source chips beneath the skill
   (e.g. "Moodle: LOG2104 (A)" · "Employer: Juara ✓" · "Achievement: APU
   Hackathon"). Skills with 3 sources get a "Triangulated" badge (strongest
   evidence state — primary). Data from U5_MOCK_DATA §4.
B. A new "Verified achievements" card (replaces or augments Recent Evidence
   Tokens): Amira's 3 TalentBank-Program achievements (U5_MOCK_DATA §3), each
   with: event name, placement + field size (mono), "Verified by {org}" with
   checkmark, and the cohortNote as the calibration line. A small "How are
   these verified?" link → /program/join.
This makes the candidate trajectory explicitly grounded in university +
achievement + employer data — closing the framing gap.

## §8 AMEND `/` landing — flywheel + program
A. Add the three-node flywheel diagram (U5_MOCK_DATA §7) as a dedicated section
   after the hero: Candidates/Employers/Universities triangle with labelled
   directional arrows and center "Career OS — the layer that connects them."
   Animate arrows drawing in on scroll (GSAP ScrollTrigger).
B. The three audience cards now route live: Candidates → /register,
   Employers → /employer/dashboard, Universities → /university/dashboard.
   Remove the "Stage 2" badge from the university card.
C. Footer link "TalentBank Program" → /program/join.

## §9 AMEND RoleSwitcher + AppShell
3-way RoleSwitcher (Candidate/Employer/University). University routes show the
university sidebar (§ routing) and the Dr. Lim persona badge. View-transition
names: add "university-wordmark" continuity is covered by existing "wordmark".
