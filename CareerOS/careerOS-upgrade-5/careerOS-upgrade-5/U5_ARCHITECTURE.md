# U5_ARCHITECTURE — The Three-Sided Data Exchange

This upgrade re-frames CareerOS from an employer-intelligence tool into what
Talentbank actually intends: a centralised three-sided data exchange where
each audience's data improves outcomes for the other two. It adds the entire
University surface, a verified-achievement layer (the TalentBank Program),
and re-architects the data model so the flywheel is visible end to end.

Built in the Angular app (`careeros-angular/`). All V1–V4 protocols in force.
All new data is simulated (mock) but the ARCHITECTURE must express real flow.

---

## 1. THE FLYWHEEL (the thesis this upgrade makes visible)

Three edges, each consuming two sources to serve the third audience:

EDGE A — Universities + Employers → CANDIDATES
  Moodle academic data + employer hiring/performance outcomes let a candidate
  see a trajectory grounded in what people with their actual academic AND
  extracurricular signal went on to do. Ground truth, not a guess.

EDGE B — Universities + Candidates → EMPLOYERS
  Curriculum data + verified student performance let an employer plan a
  workforce, hire against trajectory pre-emptively, and trust the academic
  signal because the university verified it.

EDGE C — Students + Employers → UNIVERSITIES
  In-program performance + downstream employer outcomes let a university see
  which modules predicted workplace success, which are redundant, which are
  under-emphasised. (Lifelong Outcome Loop + Future-State Curriculum Engine,
  powered by real downstream data instead of surveys.)

Each side both contributes and consumes. The data recycles. This is the
"centralised system that recycles data, connects each other, helps everybody"
that Career OS is meant to be.

The existing Salesforce engine = the employer's CONTRIBUTION to the flywheel
(post-hire performance data). This upgrade adds the university's contribution
(Moodle + curriculum) and the verified-achievement contribution (TalentBank
Program), then shows all three feeding each other.

---

## 2. THE DATA MODEL (mock, but architecturally real)

Three source systems feed the exchange. All simulated in MockDataService but
each modelled as a distinct connector with a distinct schema, exactly as the
Salesforce connector is.

### Source 1 — Moodle (university LMS)
Per-student academic signal:
```
{ studentId, modules: [{ code, name, grade, assessmentBreakdown:
  { exam, assignment, project, participation }, competencyTags: [] }],
  cgpa, creditsCompleted, programCode }
```

### Source 2 — University SIS (APSpace-style — APU's student system)
Enrolment, program structure, club membership:
```
{ studentId, program, intake, clubMemberships: [], status }
```

### Source 3 — TalentBank Program (verified clubs/organisations)
The novel layer. Verified organisations submit achievement records:
```
{ orgId, orgName, verified: true, achievements: [{ studentId, eventName,
  eventType (competition|case|project|hackathon), placement, fieldSize,
  rubricTags: [], date, verifiedBy }] }
```

### Source 4 — Employer CRM (Salesforce — ALREADY BUILT)
Post-hire performance. Unchanged.

The ENGINE consumes all four and produces calibrated signals. The key
intellectual move: a raw achievement ("Top 1% CFA case competition") becomes
a CALIBRATED signal by mapping it against the cohort distribution (everyone
else in that competition) AND against downstream employer outcomes (what
people who placed similarly went on to do). Verification removes the
self-report problem; cohort calibration removes the false-precision problem.

---

## 3. THE TALENTBANK PROGRAM (the original primitive)

The problem it solves: academic data is a weak, lossy signal. A high GPA with
many modules doesn't signal readiness for a specific path. What actually
differentiates candidates is extracurricular achievement — competitions,
cases, hackathons, projects hosted by clubs and organisations. But that data
lives nowhere verifiable; a resume bullet is an unverifiable claim.

The mechanism:
1. Talentbank verifies and onboards clubs/organisations.
2. When a student claims an achievement, the system cross-checks it against
   the organiser's verified record. Asserted claim → verified evidence.
3. The achievement is mapped against the full competition cohort (the
   distribution) and against downstream employer outcomes — so the signal is
   calibrated, not just confirmed. "Top 1% of 6,000" means something specific
   because the system knows what that cohort went on to do.

Network effect: verified clubs grow the talent pool → larger pool attracts
employers → employer demand makes verification valuable to students → clubs
gain a credential that attracts members. Self-reinforcing.

For the prototype: the club is a PASSIVE verified record (like Salesforce).
We do NOT build a club login. We DO build a detailed "Join the TalentBank
Program" page so judges fully understand the concept — see U5_SCREENS §6.

---

## 4. WHAT THIS UPGRADE ADDS (scope)

A. A full UNIVERSITY audience surface (third RoleSwitcher option + sidebar +
   dashboard + sub-pages). Equal priority to candidate and employer.
B. The TalentBank Program: a verified-achievement layer that appears on the
   candidate profile (achievements now carry verified provenance) AND a
   standalone "Join the TalentBank Program" marketing/explainer page.
C. Re-framed candidate trajectory: now explicitly grounded in university +
   employer + verified-achievement data, with provenance shown.
D. A "data flow" visual on the landing page showing the three-sided exchange
   so the thesis is legible before a judge clicks anything.
E. Connector framing: Moodle + SIS + TalentBank Program connectors shown in
   the university surface, mirroring how Salesforce is shown employer-side.

All four source systems are simulated. The architecture, schemas, and flow
are real and documented; the data is mock.

---

## 5. DESIGN MANDATE — UNIVERSITY SURFACE MUST NOT CLONE SALESFORCE

The university dashboard and its sub-pages must look and feel DISTINCT from
the employer Salesforce dashboard. Different layout, different chart types,
different information rhythm. Specifics in U5_DESIGN_UNIVERSITY.md. The
employer surface is dense/operational (tables, risk dots, pipelines). The
university surface is analytical/longitudinal (cohort flows, curriculum
heatmaps, outcome timelines, Sankey-style program→outcome mapping). Use
sub-pages liberally rather than squeezing everything onto one screen.

---

## 6. PERSONA ADDITIONS

New persona: "Dr. Lim Choon Keat · Dean of Employability, APU" for the
university surface (badge in nav). RoleSwitcher becomes a 3-way control:
Candidate / Employer / University.

New mock university: "Asia Pacific University (APU)" — chosen because it is
Nasif's real institution and the APSpace reference is authentic.
