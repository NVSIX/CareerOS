// MOCK DATA — single source of truth, implemented verbatim from MOCK_DATA.md.
// All dates relative to "today" = 11 June 2026. Currency = RM.

// §1 PRIMARY CANDIDATE
export const primaryCandidate = {
  id: "cand-001",
  name: "Amira Hashim",
  initials: "AH",
  headline: "Logistics Operations Coordinator",
  location: "Petaling Jaya, Selangor",
  experienceYears: 2.5,
  currentRole: "Operations Coordinator, Juara Logistics Group",
  tenureMonths: 22,
  skills: [
    { id: "route-opt", name: "Route optimisation", state: "verified", source: "Q1 2026 performance review — Juara Logistics" },
    { id: "wms", name: "Warehouse management systems", state: "verified", source: "WMS migration project outcome — Juara Logistics" },
    { id: "python", name: "Python (data analysis)", state: "evidence", source: "Uploaded artifact: delivery-delay analysis notebook" },
    { id: "stakeholder", name: "Stakeholder coordination", state: "evidence", source: "Uploaded artifact: vendor onboarding playbook" },
    { id: "sql", name: "SQL", state: "asserted", source: "Claimed on resume, no artifact yet" },
    { id: "cross-functional", name: "Cross-functional project leadership", state: "asserted", source: "Claimed, no artifact yet" },
  ],
  trajectory: {
    actual: [
      { m: 0, v: 22 }, { m: 6, v: 31 }, { m: 12, v: 38 },
      { m: 18, v: 52 }, { m: 24, v: 58 }, { m: 30, v: 63 },
    ],
    cohortAverage: [
      { m: 0, v: 22 }, { m: 6, v: 28 }, { m: 12, v: 34 },
      { m: 18, v: 41 }, { m: 24, v: 47 }, { m: 30, v: 52 },
    ],
    projection: [
      { m: 30, v: 63 }, { m: 36, v: 70 }, { m: 42, v: 76 }, { m: 48, v: 81 },
    ],
  },
  coaching: {
    body: "Candidates with your profile in logistics operations who reached senior level typically demonstrated independent cross-functional project ownership by month 24. You are at month 22 with no project artifact logged in the last 4 months. Your strongest near-term move: document the WMS migration as a portfolio artifact — it converts an employer-verified outcome into visible evidence.",
    dataBasis: "Based on 1,240 comparable logistics-operations trajectories",
  },
};

// §3 EMPLOYER ACCOUNT
export const employer = {
  id: "emp-001",
  company: "Juara Logistics Group",
  descriptor: "Mid-size 3PL & last-mile logistics, 1,800 employees",
  location: "Shah Alam, Selangor",
  user: "Farah Iskandar — Head of Talent Acquisition",
};

// §3 Job listings (5 rows; match scores are Amira's)
export const jobs = [
  {
    id: "job-001",
    title: "Senior Logistics Coordinator",
    company: "Juara Logistics Group",
    location: "Shah Alam, Selangor",
    salary: "RM 5,800 – RM 7,200 / month",
    posted: "3 days ago",
    match: 87,
    industry: "Logistics",
    performanceFingerprint: [
      "Ownership orientation by month 12",
      "WMS fluency",
      "Cross-functional collaboration",
      "Sustained vendor relationship management",
    ],
    about: "Own last-mile coordination across the Klang Valley network, working with depot teams and delivery partners to keep service levels stable. The role carries day-to-day vendor management and full ownership of the warehouse management system workflows. Reports to the Regional Operations Manager.",
  },
  {
    id: "job-002",
    title: "Supply Chain Analyst",
    company: "Nusantara Retail Berhad",
    location: "Bukit Jalil",
    salary: "RM 5,200 – RM 6,500 / month",
    posted: "1 week ago",
    match: 74,
    industry: "Retail",
    performanceFingerprint: [
      "Demand planning cadence",
      "Inventory variance analysis",
      "Stakeholder reporting",
      "Operational follow-through",
    ],
    about: "Track supply movement across retail distribution nodes, turning inventory and fulfilment data into weekly operating decisions. The role suits candidates who can explain variance clearly and keep cross-functional teams aligned on replenishment actions.",
  },
  {
    id: "job-003",
    title: "Operations Executive",
    company: "PortLink Marine Services",
    location: "Port Klang",
    salary: "RM 4,800 – RM 5,900 / month",
    posted: "5 days ago",
    match: 68,
    industry: "Logistics",
    performanceFingerprint: [
      "Shift-level issue resolution",
      "Vendor coordination",
      "SLA monitoring",
      "Process documentation",
    ],
    about: "Coordinate port-adjacent logistics activity, resolving daily service issues before they affect customer commitments. The role rewards steady operator judgment, vendor follow-up, and clear documentation of handoffs.",
  },
  {
    id: "job-004",
    title: "Data Analyst, Fleet Intelligence",
    company: "Velocita Mobility",
    location: "Bangsar South",
    salary: "RM 5,500 – RM 7,000 / month",
    posted: "2 days ago",
    match: 61,
    industry: "Mobility",
    performanceFingerprint: [
      "Fleet utilisation modelling",
      "SQL-backed reporting",
      "Route-delay analysis",
      "Analyst-to-operator translation",
    ],
    about: "Turn fleet movement data into decision-ready reporting for mobility operations teams. The role leans more analytical than Amira's current path, with a stronger requirement for repeatable SQL and operational storytelling.",
  },
  {
    id: "job-005",
    title: "Procurement Coordinator",
    company: "Tenaga Mas Industries",
    location: "Subang Jaya",
    salary: "RM 4,500 – RM 5,600 / month",
    posted: "1 week ago",
    match: 55,
    industry: "Industrial",
    performanceFingerprint: [
      "Supplier follow-up discipline",
      "Purchase-order accuracy",
      "Cost variance awareness",
      "Cross-team communication",
    ],
    about: "Support procurement operations across industrial supply categories, keeping supplier actions, purchase orders, and internal stakeholders moving in sync. It is a viable adjacent path, but a weaker trajectory match than logistics coordination.",
  },
];

// §3 Amira → job-001 match analysis
export const matchAnalysis = {
  trajectoryMatch: "3 of 4 signals",
  signals: [
    { name: "Ownership orientation", met: true, state: "verified", caption: "Verified — Q1 2026 review" },
    { name: "WMS fluency", met: true, state: "verified", caption: "Verified — migration project" },
    { name: "Vendor relationship mgmt", met: true, state: "evidence", caption: "Evidence — onboarding playbook" },
    { name: "Cross-functional leadership", met: false, state: "asserted", caption: "Asserted only, no artifact" },
  ],
  gapNote: "This candidate's trajectory matches your Senior Logistics Coordinator role on ownership orientation, technical progression, and vendor management. The one gap — cross-functional project leadership — was present in 60% of your previous successful hires in this role at the point of hiring. It is a development signal, not a disqualifying one.",
  gapNoteBasis: "Based on 214 hires into comparable roles, APAC logistics",
  matchNote: "Your trajectory aligns with this role on 3 of 4 signals. The gap: demonstrated cross-functional project leadership. Candidates who moved into this role successfully typically showed this signal by month 24 — you have an employer-verified project (WMS migration) that likely qualifies but is not yet documented as an artifact.",
  // Shown once the diagnostic upgrades cross-functional leadership to evidence
  // (the signal then meets, so the prose no longer describes it as the gap).
  matchNoteResolved: "Your trajectory now aligns with this role on all 4 signals. Cross-functional project leadership — your previous gap — is now evidence-linked from your diagnostic, removing the one development signal that was flagged at match time.",
};

// §4 EMPLOYER PIPELINE (6 rows). flightRisk + row link amended per MOCK_DATA_V2 §5a.
export const pipeline = [
  { candidateId: "cand-001", name: "Amira Hashim", role: "Senior Log. Coord.", match: 87, risk: "low", days: 4, flightRisk: { level: "low", label: "Stable" }, link: "/employer/candidate/cand-001" },
  { candidateId: "cand-002", name: "Daniel Lim Wei Jian", role: "Fleet Data Analyst", match: 72, risk: "moderate", days: 9, flightRisk: { level: "low", label: "Stable" } },
  { name: "Priya Renganathan", role: "Senior Log. Coord.", match: 81, risk: "low", days: 6, flightRisk: { level: "low", label: "Stable" } },
  { name: "Marcus Tan Jia Hao", role: "Operations Exec", match: 64, risk: "moderate", days: 14, flightRisk: { level: "moderate", label: "2 signals" } },
  { name: "Nurul Ain Bakar", role: "Senior Log. Coord.", match: 77, risk: "low", days: 2, flightRisk: { level: "low", label: "Stable" } },
  { name: "Kevin Raj Selvam", role: "Procurement Coord.", match: 58, risk: "high", days: 21, flightRisk: { level: "high", label: "3 signals" }, link: "/employer/retention" },
];

export const dashboardMetrics = {
  onboardingSuccess: "84%",
  pipelineHealth: "Strong",
  // Kevin's line amended per MOCK_DATA_V2 §U5 (clickable → retention detail).
  flagged: [
    {
      name: "Kevin Raj Selvam",
      note: "3 flight-risk signals — view retention detail",
      link: "/employer/retention",
    },
    { name: "Marcus Tan", note: "stalled 14 days" },
  ],
};

// §5 SALESFORCE PERFORMANCE RECORD
export const salesforce = {
  employee: {
    name: "Hafiz Rahman",
    initials: "HR",
    role: "Logistics Coordinator, hired via CareerOS — 14 Mar 2026 (3 months ago)",
  },
  record: {
    source: "Salesforce — Juara Logistics Group (sandbox)",
    fields: [
      { key: "performance_quartile", value: "Top 25%" },
      { key: "milestones_hit", value: "4 of 4 (first 90 days)" },
      { key: "role_classification", value: "Logistics Coordination" },
      { key: "tenure_months", value: "3" },
      { key: "attrition_flag", value: "false" },
    ],
  },
  tier1Fields: ["Names", "Compensation", "Manager notes"],
  tier2Fields: ["Performance quartile", "Role classification", "Tenure", "Milestones", "Attrition flag"],
  effectLine: "Onboarding risk score updated: 72 → 61. Hafiz Rahman's verified outcomes now strengthen the performance fingerprint for Senior Logistics Coordinator hires.",
  privacyNote: "Individual names, compensation, and manager notes never leave the employer's Salesforce. Only anonymised Tier-2 signals cross this boundary.",
  updatedSkills: [
    { name: "Route optimisation", state: "verified" },
    { name: "Milestone delivery", state: "verified" },
  ],
};

// ============================================================================
// V2 UPGRADE ADDITIONS (MOCK_DATA_V2.md) — additive; V1 entities above unchanged
// except the landing object (§U8 amendment) below.
// ============================================================================

// §U1 / MOCK_DATA_V2 §1 — REGISTRATION (/register)
// icon stored as a lucide component name; Register.jsx maps it to the component.
export const registration = {
  heading: "Create your CareerOS profile",
  subline: "One profile. Verified by real outcomes. Built for the next 40 years.",
  roles: [
    {
      id: "candidate",
      icon: "User",
      title: "I'm a candidate",
      desc: "Build a living portfolio and see where your trajectory leads.",
      route: "/onboarding",
    },
    {
      id: "employer",
      icon: "Building2",
      title: "I'm an employer",
      desc: "Match on trajectory, predict onboarding success, retain your people.",
      route: "/employer/dashboard",
    },
  ],
  fields: ["Full name", "Work email"],
  button: "Get started",
  footnote: "Universities join in Stage 2.",
};

// MOCK_DATA_V2 §3 — TRAJECTORY SCENARIOS (/candidate/profile upgrade)
// Selected card drives the chart's projection dataset (actual + cohort static).
// "current" projection equals primaryCandidate.trajectory.projection.
export const trajectoryScenarios = [
  {
    id: "current",
    label: "Current path",
    tag: "Baseline",
    projection: [
      { m: 30, v: 63 }, { m: 36, v: 70 }, { m: 42, v: 76 }, { m: 48, v: 81 },
    ],
    insight:
      "Steady trajectory. You reach senior-level competency density around month 46 at the current evidence rate.",
    basis: "Based on 1,240 comparable trajectories",
  },
  {
    id: "promotion",
    label: "Promotion — Senior Coordinator",
    tag: "If you take job-001",
    projection: [
      { m: 30, v: 63 }, { m: 36, v: 74 }, { m: 42, v: 82 }, { m: 48, v: 88 },
    ],
    insight:
      "Candidates who made this move at month 22–26 reached senior level 8 months faster than cohort average. Your one gap signal is development-stage, not blocking.",
    basis: "Based on 214 hires into comparable roles",
  },
  {
    id: "break",
    label: "Career break — 6 months",
    tag: "Life chapter",
    projection: [
      { m: 30, v: 63 }, { m: 34, v: 59 }, { m: 38, v: 62 }, { m: 42, v: 70 }, { m: 48, v: 79 },
    ],
    insight:
      "A 6-month break at this stage typically delays trajectory peak by 4–6 months but does not change the destination. Re-entry is strongest when the WMS project is documented before the break.",
    basis: "Based on 167 re-entry trajectories, APAC logistics",
  },
];

// MOCK_DATA_V2 §4 — PAY BENCHMARK (second tab on /jobs/job-001)
export const payBenchmark = {
  role: "Senior Logistics Coordinator — Malaysia",
  scaleMax: 9000,
  bands: [
    { key: "P25", value: 5200 },
    { key: "P50", value: 6400 },
    { key: "P75", value: 8100 },
  ],
  offer: { min: 5800, max: 7200 },
  anchor: {
    value: 6600,
    mono: "RM 6,600",
    label: "Your negotiation anchor — projected by month 30",
  },
  anchorBasis: "Based on 847 comparable verified-skill transitions",
  positionNote:
    "This offer sits at market median. Verified-skill holders in your cohort negotiated to P65 within 18 months.",
  statutory: [
    { label: "EPF — employee (11%)", value: "RM 726" },
    { label: "SOCSO — employee", value: "RM 29.75" },
    { label: "EIS — employee", value: "RM 11.90" },
    { label: "PCB — estimated", value: "RM 387" },
  ],
  takeHome: { label: "Estimated take-home", value: "RM 5,445 / month" },
  employerLine: "Employer EPF contribution (12%): RM 792 — visible to employer view",
};

// MOCK_DATA_V2 §2 — SKILL TREE (/candidate/skills). SVG viewBox 800×620.
// Unlocked nodes u1–u4 map to V1 primaryCandidate.skills (source/state pulled
// from there in the screen, so the tree stays consistent with the profile).
export const skillTree = {
  intro:
    "Where your verified skills can take you — 1,240 comparable trajectories mapped.",
  engineCaption: "Paths are generated from real outcome data, not job-title taxonomies.",
  viewBox: "0 0 800 620",
  nodes: [
    { id: "core", label: "Logistics Operations", state: "milestone", x: 400, y: 310 },
    { id: "u1", label: "Route optimisation", state: "unlocked", x: 485, y: 205, skill: "Route optimisation" },
    { id: "u2", label: "WMS systems", state: "unlocked", x: 500, y: 415, skill: "Warehouse management systems" },
    { id: "u3", label: "Python (data)", state: "unlocked", x: 305, y: 215, skill: "Python (data analysis)" },
    { id: "u4", label: "Stakeholder coordination", state: "unlocked", x: 295, y: 410, skill: "Stakeholder coordination" },
    { id: "a1", label: "Senior coordination", state: "available", x: 615, y: 270 },
    { id: "a2", label: "Operations management", state: "locked", x: 710, y: 185 },
    { id: "a3", label: "Head of logistics", state: "locked", x: 745, y: 80 },
    { id: "b1", label: "Logistics analytics", state: "available", x: 215, y: 130 },
    { id: "b2", label: "Fleet intelligence", state: "locked", x: 115, y: 75 },
    { id: "b3", label: "Analytics management", state: "locked", x: 60, y: 175 },
    { id: "c1", label: "Team leadership", state: "available", x: 200, y: 480 },
    { id: "c2", label: "Training & enablement", state: "locked", x: 115, y: 555 },
    { id: "c3", label: "L&D management", state: "locked", x: 55, y: 455 },
  ],
  edges: [
    ["core", "u1"], ["core", "u2"], ["core", "u3"], ["core", "u4"],
    ["u1", "a1"], ["u2", "a1"], ["a1", "a2"], ["a2", "a3"],
    ["u3", "b1"], ["b1", "b2"], ["b2", "b3"],
    ["u4", "c1"], ["u2", "c1"], ["c1", "c2"], ["c2", "c3"],
  ],
  detail: {
    core: {
      source: "Operations Coordinator, Juara Logistics Group — your demonstrated core",
      strengthens: "Route optimisation, WMS systems, Python (data), Stakeholder coordination",
    },
    u1: { strengthens: "Senior coordination" },
    u2: { strengthens: "Senior coordination, Team leadership" },
    u3: { strengthens: "Logistics analytics" },
    u4: { strengthens: "Team leadership" },
    a1: {
      requires:
        "Cross-functional project artifact (1 needed — your WMS migration qualifies, not yet documented)",
      // Shown when the gating skill is no longer asserted (diagnostic/edit).
      gatedBySkillId: "cross-functional",
      requiresMet:
        "Cross-functional project artifact ✓ — evidence-linked via your diagnostic (WMS migration coordination)",
      unlocks: "Operations management track",
      cohort: "612 candidates with your profile reached this node",
      timeToReach: "4–7 months",
    },
    b1: {
      requires: "Python evidence ✓ (already met) + SQL artifact (1 needed)",
      gatedBySkillId: "sql",
      requiresMet: "Python evidence ✓ + SQL evidence ✓ — captured via your diagnostic",
      unlocks: "Fleet intelligence",
      cohort: "388 made this pivot from operations roles",
      timeToReach: "6–9 months",
    },
    c1: {
      requires: "Ownership signal ✓ + direct mentoring evidence (1 needed)",
      unlocks: "Training & enablement",
      cohort: "271 moved into people-track roles",
      timeToReach: "8–12 months",
    },
    a2: { requires: "Senior coordination + 12 months tenure", cohort: "204", timeToReach: "18–24 months" },
    a3: { requires: "Operations management + P&L exposure", cohort: "57", timeToReach: "3–5 years" },
    b2: { requires: "Logistics analytics + fleet telemetry project", cohort: "121", timeToReach: "12–18 months" },
    b3: { requires: "Fleet intelligence + team scope", cohort: "44", timeToReach: "3–4 years" },
    c2: { requires: "Team leadership + enablement artifact", cohort: "96", timeToReach: "12–18 months" },
    c3: { requires: "Training & enablement + program ownership", cohort: "31", timeToReach: "3–5 years" },
  },
  actionLabel: "Add to career plan",
};

// MOCK_DATA_V2 §5b — SILVER MEDALISTS (employer dashboard right panel)
export const silverMedalists = {
  title: "Silver medalists",
  caption: "Strong past candidates worth re-engaging",
  rows: [
    {
      name: "Priya Renganathan",
      interviewed: "Senior Log. Coord., Feb 2026",
      trajectory: "81",
      delta: "+4 since",
    },
    {
      name: "Hafizuddin Nor",
      interviewed: "Operations Exec, Jan 2026",
      trajectory: "76",
      delta: "+9 since",
    },
  ],
};

// MOCK_DATA_V2 §5c — WORKFORCE SIGNALS (bottom of employer dashboard right panel)
export const workforceSignals = {
  title: "Workforce signals",
  eyebrow: "RESILIENCE OUTLOOK — STAGE 2 PREVIEW",
  rows: [
    { value: "+14%", caption: "APAC logistics talent shortage projected by 2028" },
    { value: "23%", caption: "Of your workforce roles carry moderate automation exposure" },
    { value: "2 / 0", caption: "Senior roles nearing succession vs. internal ready-now candidates" },
  ],
};

// MOCK_DATA_V2 §6 — RETENTION CASE (/employer/retention — Kevin Raj)
// timeline icons stored as lucide component-name strings (mapped in screen).
export const retentionCase = {
  header: "Retention signals — Kevin Raj Selvam",
  sub: "Procurement Coordinator · 14 months tenure · Juara Logistics Group",
  signals: [
    { icon: "TrendingDown", label: "Platform engagement −18% over 30 days", date: "trend", severity: "warning" },
    { icon: "Users", label: "Peer departure — close collaborator resigned", date: "9 days ago", severity: "warning" },
    { icon: "Activity", label: "Platform activity drop began", date: "14 days ago", severity: "warning" },
    { icon: "Clock", label: "Pipeline stall — no internal movement in 21 days", date: "21 days ago", severity: "neutral" },
  ],
  outlook: {
    churnRisk: "67%",
    label: "90-day churn probability",
    reasoning:
      "Three concurrent signals match the pattern that preceded 71% of voluntary departures in comparable roles. The strongest single predictor in this pattern — peer departure — occurred 9 days ago.",
    basis: "Based on 1,083 retention outcomes, APAC mid-size logistics",
  },
  actions: [
    {
      title: "Schedule a 1:1 within 7 days",
      caption:
        "Acting inside 14 days of a peer departure halves the churn probability in this pattern.",
    },
    {
      title: "Benchmark his compensation",
      caption:
        "Offer sits at P38 for role and tenure — below the retention-safe band.",
      button: "View pay benchmark",
      buttonLink: "/jobs/job-001",
    },
  ],
  privacyFootnote:
    "Signals are derived from anonymised Tier-2 platform data. No message content, no manager notes.",
};

// MOCK_DATA_V2 §7 — ONBOARDING MILESTONES (addition to /employer/candidate/cand-001)
export const onboardingMilestones = {
  title: "First 60 days outlook",
  eyebrow: "ONBOARDING SUCCESS PREDICTOR",
  cards: [
    {
      period: "Week 1–2 — Role clarity",
      level: "low",
      note: "Verified WMS background removes the typical ramp-up risk.",
    },
    {
      period: "Week 3–4 — Stakeholder integration",
      level: "moderate",
      note: "Maps to her one gap signal. Pair with a cross-functional buddy.",
    },
    {
      period: "Month 2 — Independent ownership",
      level: "low",
      note: "Ownership orientation is her strongest verified signal.",
    },
  ],
};

// §7 LANDING PAGE COPY
export const landing = {
  headline: "Every platform optimises for the hire. CareerOS tracks what happens after.",
  subline: "The Trajectory Engine connects candidates, employers, and universities through verified workplace outcomes — matching demonstrated trajectory to role trajectory, not claims to requirements.",
  panels: [
    { audience: "For candidates", body: "A living portfolio verified by real outcomes" },
    { audience: "For employers", body: "Onboarding risk and trajectory match, grounded in your own performance data" },
    { audience: "For universities", body: "Outcome loops that reach beyond graduation", badge: "Stage 2" },
  ],
  cta: "See how it works",
  // §U8 amendments (MOCK_DATA_V2 §8)
  ctaPrimary: "Create your profile",
  stage2Strip: {
    eyebrow: "SCOPED FOR STAGE 2",
    items: [
      "Life Chapter Designer",
      "Workforce Resilience Planner",
      "University suite",
      "Live Internship Marketplace",
      "Lifelong Learning Wallet",
    ],
    caption: "Demonstrated in part today; productionised in the build phase.",
  },
  footer: "CareerOS — Talentbank Tech Hackathon 2026 · Stage 1 prototype",
};

// ============================================================================
// UPGRADE 3 ADDITIONS (UPGRADE_3_SPEC §2) — AppContext + persona coherence.
// ============================================================================

// §2 — Amira's evidence-verification diagnostic for the live onboarding flow.
export const diagnosticScript = {
  persona: 'amira',  // signals OnboardingDiagnostic to use context skills
  step1Intro: 'Your existing profile has been parsed. 2 skills are still\n' +
    'unverified — let\'s strengthen them before you apply to new roles.',
  probes: [
    {
      id: 'probe-sql',
      targetSkillId: 'sql',           // matches skill id in primaryCandidate.skills
      question: 'You listed SQL as a working skill. What\'s the most ' +
        'complex query you\'ve written — what was it for and what did ' +
        'the output drive?',
      replyChip: 'I built queries to pull delivery performance data from ' +
        'our WMS — used it to identify our top 3 delay routes for a ' +
        'process review.',
      effect: {
        skillId: 'sql',
        newState: 'evidence',
        evidenceSource: 'Diagnostic response — WMS delay-route analysis',
        badgeText: 'Evidence captured',
      },
    },
    {
      id: 'probe-crossfunctional',
      targetSkillId: 'cross-functional',
      question: 'Cross-functional project leadership is still asserted. ' +
        'Walk me through a time you coordinated across teams without ' +
        'formal authority.',
      replyChip: 'During the WMS migration I coordinated between IT, ' +
        'warehouse ops, and the vendor — no one reported to me but I ' +
        'ran the weekly status calls.',
      effect: {
        skillId: 'cross-functional',
        newState: 'evidence',
        evidenceSource: 'Diagnostic response — WMS migration coordination',
        badgeText: 'Evidence captured',
      },
    },
  ],
  completionHeader: 'Profile strengthened',
  completionSub: '2 asserted claims upgraded to evidence-linked.',
  completionCta: 'View your living portfolio',
}

// §2 — Hafiz intro copy for the Salesforce connector (introduces the employee
// before the judge asks "who is this?").
export const salesforceIntro = {
  headline: 'Juara Logistics Group hired Hafiz Rahman through CareerOS ' +
    'in March 2026.',
  sub: 'His 3-month post-hire performance data is now available for ' +
    'connection.',
}

// Aggregate export consumed by AppContext (UPGRADE_3_SPEC §1 imports
// `{ mockData }` and reads mockData.primaryCandidate.skills).
export const mockData = {
  primaryCandidate,
  employer,
  jobs,
  matchAnalysis,
  pipeline,
  dashboardMetrics,
  salesforce,
  registration,
  trajectoryScenarios,
  payBenchmark,
  skillTree,
  silverMedalists,
  workforceSignals,
  retentionCase,
  onboardingMilestones,
  landing,
  diagnosticScript,
  salesforceIntro,
};
