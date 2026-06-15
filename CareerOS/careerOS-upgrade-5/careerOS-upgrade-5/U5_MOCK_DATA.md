# U5_MOCK_DATA — Three-Sided Exchange Data

Additive to all prior mock data. Implement in MockDataService (Angular) as new
readonly properties. Every value below is verbatim. All currency RM, all dates
relative to June 2026, all institutions Malaysian.

The protagonist Amira Hashim is now also a university graduate with academic +
achievement provenance, tying the three sides together through one person.

---

## 1. UNIVERSITY ACCOUNT (the university persona's org)

```
universityId: "uni-apu"
name: "Asia Pacific University (APU)"
descriptor: "Private university · 13,000 students · Technology & Business"
user: "Dr. Lim Choon Keat — Dean of Employability"
location: "Technology Park Malaysia, Kuala Lumpur"
connectors:
  moodle:   { name: "Moodle LMS",        status: "connected", records: 13042 }
  sis:      { name: "APSpace SIS",        status: "connected", records: 13042 }
  tbProgram:{ name: "TalentBank Program", status: "connected", verifiedOrgs: 47 }
```

## 2. MOODLE ACADEMIC DATA (Amira's record — the cross-side link)

```
studentId: "stu-amira"
program: "BSc (Hons) Logistics & Supply Chain Management"
intake: "Sept 2021"
cgpa: 3.68
creditsCompleted: 120
modules: [
  { code: "LOG2104", name: "Warehouse & Inventory Systems", grade: "A",
    breakdown: { exam: 88, assignment: 91, project: 94, participation: 85 },
    competencyTags: ["WMS", "inventory optimisation"] },
  { code: "LOG3201", name: "Route & Network Optimisation", grade: "A-",
    breakdown: { exam: 82, assignment: 86, project: 90, participation: 80 },
    competencyTags: ["route optimisation", "operations research"] },
  { code: "DAT2001", name: "Data Analysis for Business", grade: "B+",
    breakdown: { exam: 78, assignment: 84, project: 80, participation: 88 },
    competencyTags: ["Python", "SQL", "data analysis"] },
  { code: "MGT2101", name: "Cross-Functional Team Management", grade: "A-",
    breakdown: { exam: 80, assignment: 88, project: 87, participation: 92 },
    competencyTags: ["stakeholder coordination", "leadership"] },
  { code: "BUS1003", name: "Business Communication", grade: "A",
    breakdown: { exam: 85, assignment: 90, project: 88, participation: 90 },
    competencyTags: ["communication"] },
]
```
Engine insight to display: modules map to Amira's competency profile —
LOG2104 → WMS (verified), DAT2001 → Python/SQL, MGT2101 → cross-functional.
The academic signal CORROBORATES the workplace evidence. Provenance line:
"Competency 'WMS systems' is supported by 3 sources: Moodle (LOG2104, A),
employer outcome (Juara, verified), and self-asserted resume claim."

## 3. TALENTBANK PROGRAM — VERIFIED ACHIEVEMENTS (Amira)

The novel layer. Amira's extracurricular signal, verified by the organisers:
```
achievements: [
  { eventName: "CFA Institute Research Challenge (Malaysia)",
    eventType: "case", placement: "Top 1%", fieldSize: 6000,
    rubricTags: ["financial analysis", "valuation", "presentation"],
    date: "Nov 2024", verifiedBy: "CFA Society Malaysia", verified: true,
    cohortNote: "Of verified Top-1% finishers, 73% entered analyst/strategy
      roles within 12 months." },
  { eventName: "Nescafé Empowerpreneur Challenge",
    eventType: "competition", placement: "Top 8", fieldSize: 1400,
    rubricTags: ["business strategy", "pitching", "go-to-market"],
    date: "Mar 2025", verifiedBy: "Nestlé Malaysia", verified: true,
    cohortNote: "Top-8 finishers show 2.1x the cross-functional ownership
      signal of the median graduate." },
  { eventName: "APU Logistics Hackathon",
    eventType: "hackathon", placement: "1st", fieldSize: 120,
    rubricTags: ["route optimisation", "Python", "systems design"],
    date: "Jan 2025", verifiedBy: "APU Tech Society", verified: true,
    cohortNote: "Winners of applied-logistics builds map strongly to
      operations-coordination success." },
]
```
Display logic: each achievement is a VERIFIED evidence token (checkmark,
"Verified by {org}"). The cohortNote is the CALIBRATION — what the signal
means relative to the field. This is what removes false precision.

## 4. THE PROVENANCE MODEL (candidate profile upgrade)

Each skill now shows WHERE its evidence comes from — up to 3 sources:
```
skillProvenance: {
  "wms":            ["Moodle: LOG2104 (A)", "Employer: Juara (verified)", "Resume claim"],
  "route-opt":      ["Moodle: LOG3201 (A-)", "Achievement: APU Hackathon 1st", "Employer: Juara"],
  "python":         ["Moodle: DAT2001 (B+)", "Achievement: APU Hackathon"],
  "sql":            ["Moodle: DAT2001 (B+)", "Diagnostic response"],
  "stakeholder":    ["Moodle: MGT2101 (A-)", "Achievement: Nescafé Top 8"],
  "cross-functional":["Moodle: MGT2101 (A-)", "Diagnostic response", "Achievement: Nescafé"],
}
```
The more sources, the higher the evidence confidence. A skill with 3
corroborating sources is "triangulated" — the strongest state.

## 5. UNIVERSITY DASHBOARD — COHORT DATA

### 5a. Employability overview (top metrics)
```
graduateEmploymentRate: 87        // % employed within 6 months
medianTimeToHire: 2.4             // months
verifiedAchievementCoverage: 64   // % of students with ≥1 verified achievement
curriculumAlignmentScore: 78      // engine: how well curriculum maps to market demand
```

### 5b. Program → outcome flow (Sankey-style mapping, Edge C)
Programs on the left, employment outcomes on the right, flow width = volume:
```
flows: [
  { program: "Logistics & SCM",     outcome: "Operations/Logistics", value: 142 },
  { program: "Logistics & SCM",     outcome: "Data/Analytics",        value: 38 },
  { program: "Logistics & SCM",     outcome: "Further study",          value: 12 },
  { program: "Computer Science",    outcome: "Software/Data",          value: 210 },
  { program: "Computer Science",    outcome: "Operations/Logistics",   value: 24 },
  { program: "Business Admin",      outcome: "Strategy/Consulting",    value: 66 },
  { program: "Business Admin",      outcome: "Operations/Logistics",   value: 41 },
]
```

### 5c. Curriculum efficacy heatmap (Edge C — which modules predict success)
Modules scored on downstream employer-outcome correlation (0–100):
```
modules: [
  { code: "LOG2104", name: "Warehouse & Inventory Systems", efficacy: 91, trend: "up",
    note: "Strong predictor of operations-role success. Emphasise." },
  { code: "DAT2001", name: "Data Analysis for Business",    efficacy: 88, trend: "up",
    note: "Rising market demand. Under-weighted in current credits." },
  { code: "LOG3201", name: "Route & Network Optimisation",  efficacy: 84, trend: "flat" },
  { code: "MGT2101", name: "Cross-Functional Team Mgmt",    efficacy: 79, trend: "up",
    note: "Cross-functional signal increasingly demanded by employers." },
  { code: "HUM1002", name: "Ethics & Society",              efficacy: 41, trend: "down",
    note: "Weak downstream correlation. Review weighting." },
  { code: "MKT2003", name: "Principles of Marketing",       efficacy: 38, trend: "down",
    note: "Low relevance to graduate destinations in this program." },
]
```

### 5d. Future-state skill demand (Edge C — what market will need)
From aggregated employer data, projected 24 months out:
```
risingSkills:  [{ skill: "Data analysis", demand: 92, change: "+18%" },
                { skill: "WMS / automation", demand: 85, change: "+12%" },
                { skill: "Cross-functional leadership", demand: 81, change: "+15%" }]
decliningSkills:[{ skill: "Manual scheduling", demand: 34, change: "-22%" },
                { skill: "Paper-based compliance", demand: 21, change: "-31%" }]
gapAlert: "Graduates strong in WMS but under-prepared in data analysis —
  DAT2001 carries 3 credits; market demand suggests 6."
```

### 5e. Live student readiness (Edge B preview — students as future hires)
Top students by readiness signal (academic + achievement + competency):
```
students: [
  { name: "Amira Hashim", program: "Logistics & SCM", readiness: 88,
    signal: "3 verified achievements · CGPA 3.68", status: "Graduated — hired" },
  { name: "Wong Jia Hui", program: "Computer Science", readiness: 84,
    signal: "2 verified achievements · CGPA 3.81", status: "Final year" },
  { name: "Arjun Nair", program: "Logistics & SCM", readiness: 79,
    signal: "1 verified achievement · CGPA 3.55", status: "Final year" },
  { name: "Siti Nurhaliza", program: "Business Admin", readiness: 76,
    signal: "2 verified achievements · CGPA 3.62", status: "Final year" },
]
```

## 6. JOIN THE TALENTBANK PROGRAM — explainer page content

Hero: "Verify your members. Amplify their signal."
Sub: "TalentBank Program turns your competitions, cases, and projects into
verified credentials that employers trust and universities count."

How it works (3 steps):
1. "Your organisation is verified once — clubs, societies, competition bodies,
   training providers. A one-time review confirms you're a real issuer."
2. "Submit achievement records — who participated, who placed, the field size,
   the rubric. Once, after each event. No ongoing admin."
3. "Members' achievements become verified evidence on their CareerOS profile,
   calibrated against everyone else in the field — so a Top 1% finish means
   exactly what it should."

Why it matters (3 value props):
- For organisations: "Your events become a credential members seek out.
  Verified issuers attract more participants."
- For students: "Stop self-reporting. Your real achievements, verified at
  source, differentiate you where grades can't."
- For the ecosystem: "Every verified achievement sharpens the signal for the
  next cohort — and tells universities which experiences actually build
  employable graduates."

Stats strip (mock): "47 verified organisations · 8,200 verified achievements ·
64% of APU students covered"

Verified issuer examples (logos as text/initials): CFA Society Malaysia,
Nestlé Malaysia, APU Tech Society, Google Developer Groups, AWS User Group KL,
Malaysia FinTech Association.

CTA: "Apply to verify your organisation" (button → opens a short explainer
modal: "In production, this begins a one-time verification review. For this
prototype, it illustrates the onboarding entry point.")

## 7. LANDING PAGE — data flow visual

A three-node diagram (Candidates / Employers / Universities) arranged in a
triangle, with directional arrows showing the flywheel (each node feeds the
other two). Center label: "Career OS — the layer that connects them."
Caption: "Every side contributes data. Every side gets sharper because of it."
Each arrow labelled with what flows (e.g. Universities→Candidates:
"academic + outcome signal"; Employers→Universities: "what graduates became";
Candidates→Employers: "verified trajectory").
