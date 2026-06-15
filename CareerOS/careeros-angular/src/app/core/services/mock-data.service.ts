import { Injectable } from '@angular/core'
import {
  Candidate,
  Job,
  MatchAnalysis,
  PayBenchmark,
  PipelineRow,
  RegistrationContent,
  RetentionSignal,
  ScenarioData,
  Skill,
  SkillTree,
} from '../models/types'

const primaryCandidate: Candidate = {
  id: 'cand-001',
  name: 'Amira Hashim',
  initials: 'AH',
  headline: 'Logistics Operations Coordinator',
  location: 'Petaling Jaya, Selangor',
  experienceYears: 2.5,
  currentRole: 'Operations Coordinator, Juara Logistics Group',
  tenureMonths: 22,
  skills: [
    { id: 'route-opt', name: 'Route optimisation', state: 'verified', source: 'Q1 2026 performance review — Juara Logistics' },
    { id: 'wms', name: 'Warehouse management systems', state: 'verified', source: 'WMS migration project outcome — Juara Logistics' },
    { id: 'python', name: 'Python (data analysis)', state: 'evidence', source: 'Uploaded artifact: delivery-delay analysis notebook' },
    { id: 'stakeholder', name: 'Stakeholder coordination', state: 'evidence', source: 'Uploaded artifact: vendor onboarding playbook' },
    { id: 'sql', name: 'SQL', state: 'asserted', source: 'Claimed on resume, no artifact yet' },
    { id: 'cross-functional', name: 'Cross-functional project leadership', state: 'asserted', source: 'Claimed, no artifact yet' },
  ],
}

const secondaryCandidate: Candidate = {
  id: 'cand-002',
  name: 'Daniel Lim Wei Jian',
  initials: 'DL',
  headline: 'Junior Data Analyst',
  location: 'Kuala Lumpur',
  experienceYears: 1,
  skills: [
    { id: 'daniel-sql', name: 'SQL', state: 'evidence', source: 'Diagnostic seed profile' },
    { id: 'daniel-excel', name: 'Excel/Power BI', state: 'evidence', source: 'Diagnostic seed profile' },
    { id: 'daniel-python', name: 'Python', state: 'asserted', source: 'Claimed on resume, no artifact yet' },
    { id: 'daniel-stats', name: 'Statistical modelling', state: 'asserted', source: 'Claimed on resume, no artifact yet' },
  ],
}

const trajectory = {
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
}

const coaching = {
  body: 'Candidates with your profile in logistics operations who reached senior level typically demonstrated independent cross-functional project ownership by month 24. You are at month 22 with no project artifact logged in the last 4 months. Your strongest near-term move: document the WMS migration as a portfolio artifact — it converts an employer-verified outcome into visible evidence.',
  dataBasis: 'Based on 1,240 comparable logistics-operations trajectories',
}

const employer = {
  id: 'emp-001',
  company: 'Juara Logistics Group',
  descriptor: 'Mid-size 3PL & last-mile logistics, 1,800 employees',
  location: 'Shah Alam, Selangor',
  user: 'Farah Iskandar — Head of Talent Acquisition',
  salesforceStatus: 'disconnected',
}

const jobs: Job[] = [
  {
    id: 'job-001',
    title: 'Senior Logistics Coordinator',
    company: 'Juara Logistics Group',
    location: 'Shah Alam, Selangor',
    salary: 'RM 5,800 – RM 7,200 / month',
    posted: '3 days ago',
    match: 87,
    industry: 'Logistics',
    performanceFingerprint: [
      'Ownership orientation by month 12',
      'WMS fluency',
      'Cross-functional collaboration',
      'Sustained vendor relationship management',
    ],
    about: 'Own last-mile coordination across the Klang Valley network, working with depot teams and delivery partners to keep service levels stable. The role carries day-to-day vendor management and full ownership of the warehouse management system workflows.',
  },
  { id: 'job-002', title: 'Supply Chain Analyst', company: 'Nusantara Retail Berhad', location: 'Bukit Jalil', salary: 'RM 5,200 – RM 6,500 / month', posted: '1 week ago', match: 74, industry: 'Retail' },
  { id: 'job-003', title: 'Operations Executive', company: 'PortLink Marine Services', location: 'Port Klang', salary: 'RM 4,800 – RM 5,900 / month', posted: '5 days ago', match: 68, industry: 'Logistics' },
  { id: 'job-004', title: 'Data Analyst, Fleet Intelligence', company: 'Velocita Mobility', location: 'Bangsar South', salary: 'RM 5,500 – RM 7,000 / month', posted: '2 days ago', match: 61, industry: 'Mobility' },
  { id: 'job-005', title: 'Procurement Coordinator', company: 'Tenaga Mas Industries', location: 'Subang Jaya', salary: 'RM 4,500 – RM 5,600 / month', posted: '1 week ago', match: 55, industry: 'Industrial' },
]

const matchAnalysis: MatchAnalysis = {
  trajectoryMatch: '3 of 4 signals',
  signals: [
    { name: 'Ownership orientation', met: true, state: 'verified', caption: 'Verified — Q1 2026 review' },
    { name: 'WMS fluency', met: true, state: 'verified', caption: 'Verified — migration project' },
    { name: 'Vendor relationship mgmt', met: true, state: 'evidence', caption: 'Evidence — onboarding playbook' },
    { name: 'Cross-functional leadership', met: false, state: 'asserted', caption: 'Asserted only, no artifact' },
  ],
  gapNote: "This candidate's trajectory matches your Senior Logistics Coordinator role on ownership orientation, technical progression, and vendor management. The one gap — cross-functional project leadership — was present in 60% of your previous successful hires in this role at the point of hiring. It is a development signal, not a disqualifying one.",
  gapNoteBasis: 'Based on 214 hires into comparable roles, APAC logistics',
  matchNote: 'Your trajectory aligns with this role on 3 of 4 signals. The gap: demonstrated cross-functional project leadership. Candidates who moved into this role successfully typically showed this signal by month 24 — you have an employer-verified project (WMS migration) that likely qualifies but is not yet documented as an artifact.',
  matchNoteResolved: 'Your trajectory now aligns with this role on all 4 signals. Cross-functional project leadership is now evidence-linked from your diagnostic, removing the one development signal that was flagged at match time.',
}

const pipeline: PipelineRow[] = [
  { candidateId: 'cand-001', name: 'Amira Hashim', headline: 'Logistics Operations Coordinator', role: 'Senior Log. Coord.', match: 87, stage: 'Interviewing', risk: 'low', days: 4, flightRisk: { level: 'low', label: 'Stable' }, link: '/employer/candidate/cand-001' },
  { candidateId: 'cand-002', name: 'Daniel Lim Wei Jian', headline: 'Junior Data Analyst', role: 'Fleet Data Analyst', match: 72, stage: 'Technical Test', risk: 'moderate', days: 9, flightRisk: { level: 'low', label: 'Stable' }, link: '/employer/candidate/cand-002' },
  { candidateId: 'cand-priya', name: 'Priya Renganathan', headline: 'Senior Operations Associate', role: 'Senior Log. Coord.', match: 81, stage: 'Screening', risk: 'low', days: 6, flightRisk: { level: 'low', label: 'Stable' }, link: '/employer/candidate/cand-priya' },
  { candidateId: 'cand-marcus', name: 'Marcus Tan Jia Hao', headline: 'Operations Executive', role: 'Operations Exec', match: 64, stage: 'Reviewing', risk: 'moderate', days: 14, flightRisk: { level: 'moderate', label: '2 signals' }, link: '/employer/candidate/cand-marcus' },
  { candidateId: 'cand-nurul', name: 'Nurul Ain Bakar', headline: 'Warehouse Systems Analyst', role: 'Senior Log. Coord.', match: 77, stage: 'On-Site', risk: 'low', days: 2, flightRisk: { level: 'low', label: 'Stable' }, link: '/employer/candidate/cand-nurul' },
  { candidateId: 'cand-kevin', name: 'Kevin Raj Selvam', headline: 'Procurement Coordinator', role: 'Procurement Coord.', match: 58, stage: 'Offer Pending', risk: 'high', days: 21, flightRisk: { level: 'high', label: '3 signals' }, link: '/employer/retention' },
  { candidateId: 'cand-003', name: 'Aisha Tan Mei Xuan', headline: 'Route Planning Analyst', role: 'Senior Log. Coord.', match: 79, stage: 'Screening', risk: 'low', days: 5, flightRisk: { level: 'low', label: 'Stable' }, link: '/employer/candidate/cand-003' },
  { candidateId: 'cand-004', name: 'Harith Zulkifli', headline: 'Fleet Operations Executive', role: 'Fleet Data Analyst', match: 70, stage: 'Reviewing', risk: 'moderate', days: 11, flightRisk: { level: 'moderate', label: '1 signal' }, link: '/employer/candidate/cand-004' },
  { candidateId: 'cand-005', name: 'Mei Ling Chua', headline: 'Warehouse Automation Associate', role: 'Operations Exec', match: 73, stage: 'Technical Test', risk: 'low', days: 8, flightRisk: { level: 'low', label: 'Stable' }, link: '/employer/candidate/cand-005' },
  { candidateId: 'cand-006', name: 'Arif Hakimi Rahman', headline: 'Inventory Control Lead', role: 'Procurement Coord.', match: 66, stage: 'Interviewing', risk: 'moderate', days: 13, flightRisk: { level: 'moderate', label: '2 signals' }, link: '/employer/candidate/cand-006' },
  { candidateId: 'cand-007', name: 'Siti Nabilah Osman', headline: 'Customer Fulfilment Supervisor', role: 'Senior Log. Coord.', match: 75, stage: 'On-Site', risk: 'low', days: 3, flightRisk: { level: 'low', label: 'Stable' }, link: '/employer/candidate/cand-007' },
  { candidateId: 'cand-008', name: 'Ravi Menon', headline: 'Transport Scheduler', role: 'Operations Exec', match: 62, stage: 'Screening', risk: 'moderate', days: 17, flightRisk: { level: 'moderate', label: '2 signals' }, link: '/employer/candidate/cand-008' },
  { candidateId: 'cand-009', name: 'Liyana Mokhtar', headline: 'Demand Planning Analyst', role: 'Supply Chain Analyst', match: 69, stage: 'Reviewing', risk: 'low', days: 7, flightRisk: { level: 'low', label: 'Stable' }, link: '/employer/candidate/cand-009' },
]

const employerCandidateSkills: Record<string, Skill[]> = {
  'cand-001': primaryCandidate.skills ?? [],
  'cand-002': secondaryCandidate.skills ?? [],
  'cand-priya': [
    { id: 'priya-ops', name: 'Shift operations planning', state: 'verified', source: 'APU practicum + Juara screening exercise' },
    { id: 'priya-wms', name: 'WMS coordination', state: 'evidence', source: 'Moodle LOG2104 project artifact' },
    { id: 'priya-stakeholder', name: 'Stakeholder coordination', state: 'verified', source: 'TalentBank case review' },
  ],
  'cand-marcus': [
    { id: 'marcus-fleet', name: 'Fleet scheduling', state: 'evidence', source: 'Employer screening simulation' },
    { id: 'marcus-analytics', name: 'Operations analytics', state: 'asserted', source: 'Resume claim pending artifact' },
    { id: 'marcus-comms', name: 'Depot communication', state: 'verified', source: 'APU internship supervisor record' },
  ],
  'cand-nurul': [
    { id: 'nurul-wms', name: 'Warehouse systems', state: 'verified', source: 'Moodle LOG2104 + employer project sample' },
    { id: 'nurul-inventory', name: 'Inventory control', state: 'verified', source: 'TalentBank warehouse challenge' },
    { id: 'nurul-data', name: 'Data analysis', state: 'evidence', source: 'DAT2001 capstone' },
  ],
}

const employerCandidateProfiles: Candidate[] = pipeline
  .filter((row) => row.candidateId)
  .map((row) => ({
    id: row.candidateId,
    name: row.name,
    initials: row.name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase(),
    headline: row.headline ?? row.role,
    location: 'Malaysia',
    role: row.role,
    experienceYears: row.days > 12 ? 3 : 2,
    skills: employerCandidateSkills[row.candidateId ?? ''] ?? [
      { id: `${row.candidateId}-core`, name: row.role, state: row.risk === 'low' ? 'verified' : 'evidence', source: 'CareerOS trajectory screen' },
      { id: `${row.candidateId}-readiness`, name: 'Role readiness', state: row.risk === 'high' ? 'asserted' : 'evidence', source: 'University readiness + employer screening signal' },
      { id: `${row.candidateId}-coordination`, name: 'Cross-functional coordination', state: 'evidence', source: 'TalentBank achievement calibration' },
    ],
  }))

const dashboardMetrics = {
  onboardingSuccess: '84%',
  pipelineHealth: 'Strong',
  flagged: [
    { name: 'Kevin Raj Selvam', note: '3 flight-risk signals', link: '/employer/retention' },
    { name: 'Marcus Tan', note: 'competitor activity detected', link: '/employer/candidate/cand-marcus' },
    { name: 'Ravi Menon', note: 'stalled 17 days in screening', link: '/employer/candidate/cand-008' },
  ],
}

const employerSourceCoverage = {
  title: 'Verified source coverage',
  caption: 'University and TalentBank signals now explain why matched candidates are trusted before interview.',
  rows: [
    { source: 'APU Moodle', value: '13,042 records', signal: 'module-level competency evidence' },
    { source: 'APSpace SIS', value: '13,042 records', signal: 'program, intake, and graduation context' },
    { source: 'TalentBank Program', value: '47 issuers', signal: 'verified achievements and cohort calibration' },
  ],
  impact: 'Amira is supported by Moodle coursework, TalentBank achievements, and Juara employer outcomes.',
}

const salesforce = {
  employee: {
    name: 'Hafiz Rahman',
    initials: 'HR',
    role: 'Logistics Coordinator, hired via CareerOS — 14 Mar 2026 (3 months ago)',
  },
  record: {
    source: 'Salesforce — Juara Logistics Group (sandbox)',
    fields: [
      { key: 'performance_quartile', value: 'Top 25%' },
      { key: 'milestones_hit', value: '4 of 4 (first 90 days)' },
      { key: 'role_classification', value: 'Logistics Coordination' },
      { key: 'tenure_months', value: '3' },
      { key: 'attrition_flag', value: 'false' },
    ],
  },
  tier1Fields: ['Names', 'Compensation', 'Manager notes', 'Individual notes', 'Manager comments'],
  tier2Fields: ['Performance quartile', 'Role classification', 'Tenure', 'Milestones', 'Attrition flag'],
  effectLine: "Onboarding risk score updated: 72 → 61. Hafiz Rahman's verified outcomes now strengthen the performance fingerprint for Senior Logistics Coordinator hires.",
  privacyNote: "Individual names, compensation, and manager notes never leave the employer's Salesforce. Only anonymised Tier-2 signals cross this boundary.",
  updatedSkills: [
    { name: 'Route optimisation', state: 'verified' },
    { name: 'Milestone delivery', state: 'verified' },
  ],
}

const registration: RegistrationContent = {
  heading: 'Create your CareerOS profile',
  subline: 'One profile. Verified by real outcomes. Built for the next 40 years.',
  roles: [
    { id: 'candidate', icon: 'User', title: "I'm a candidate", desc: 'Build a living portfolio and see where your trajectory leads.', route: '/onboarding' },
    { id: 'employer', icon: 'Building2', title: "I'm an employer", desc: 'Match on trajectory, predict onboarding success, retain your people.', route: '/employer/dashboard' },
    { id: 'university', icon: 'GraduationCap', title: "I'm a university", desc: 'Track graduate outcomes, curriculum efficacy, and verified achievement coverage.', route: '/university/dashboard' },
  ],
  fields: ['Full name', 'Work email'],
  button: 'Get started',
  footnote: 'Universities can explore the institutional hub in this demo.',
}

const trajectoryScenarios: ScenarioData[] = [
  {
    id: 'current',
    label: 'Current path',
    tag: 'Baseline',
    projection: [{ m: 30, v: 63 }, { m: 36, v: 70 }, { m: 42, v: 76 }, { m: 48, v: 81 }],
    insight: 'Steady trajectory. You reach senior-level competency density around month 46 at the current evidence rate.',
    basis: 'Based on 1,240 comparable trajectories',
  },
  {
    id: 'promotion',
    label: 'Promotion — Senior Coordinator',
    tag: 'If you take job-001',
    projection: [{ m: 30, v: 63 }, { m: 36, v: 74 }, { m: 42, v: 82 }, { m: 48, v: 88 }],
    insight: 'Candidates who made this move at month 22–26 reached senior level 8 months faster than cohort average. Your one gap signal is development-stage, not blocking.',
    basis: 'Based on 214 hires into comparable roles',
  },
  {
    id: 'break',
    label: 'Career break — 6 months',
    tag: 'Life chapter',
    projection: [{ m: 30, v: 63 }, { m: 34, v: 59 }, { m: 38, v: 62 }, { m: 42, v: 70 }, { m: 48, v: 79 }],
    insight: 'A 6-month break at this stage typically delays trajectory peak by 4–6 months but does not change the destination. Re-entry is strongest when the WMS project is documented before the break.',
    basis: 'Based on 167 re-entry trajectories, APAC logistics',
  },
]

const payBenchmark: PayBenchmark = {
  role: 'Senior Logistics Coordinator — Malaysia',
  scaleMax: 9000,
  bands: [{ key: 'P25', value: 5200 }, { key: 'P50', value: 6400 }, { key: 'P75', value: 8100 }],
  offer: { min: 5800, max: 7200 },
  anchor: { value: 6600, mono: 'RM 6,600', label: 'Your negotiation anchor — projected by month 30' },
  anchorBasis: 'Based on 847 comparable verified-skill transitions',
  positionNote: 'This offer sits at market median. Verified-skill holders in your cohort negotiated to P65 within 18 months.',
  statutory: [
    { label: 'EPF — employee (11%)', value: 'RM 726' },
    { label: 'SOCSO — employee', value: 'RM 29.75' },
    { label: 'EIS — employee', value: 'RM 11.90' },
    { label: 'PCB — estimated', value: 'RM 387' },
  ],
  takeHome: { label: 'Estimated take-home', value: 'RM 5,445 / month' },
  employerLine: 'Employer EPF contribution (12%): RM 792 — visible to employer view',
}

const skillTree: SkillTree = {
  intro: 'Where your verified skills can take you — 1,240 comparable trajectories mapped.',
  engineCaption: 'Paths are generated from real outcome data, not job-title taxonomies.',
  viewBox: '0 0 800 620',
  nodes: [
    { id: 'core', label: 'Logistics Operations', state: 'milestone', x: 400, y: 310 },
    { id: 'u1', label: 'Route optimisation', state: 'unlocked', x: 485, y: 205, skill: 'Route optimisation' },
    { id: 'u2', label: 'WMS systems', state: 'unlocked', x: 500, y: 415, skill: 'Warehouse management systems' },
    { id: 'u3', label: 'Python (data)', state: 'unlocked', x: 305, y: 215, skill: 'Python (data analysis)' },
    { id: 'u4', label: 'Stakeholder coordination', state: 'unlocked', x: 295, y: 410, skill: 'Stakeholder coordination' },
    { id: 'a1', label: 'Senior coordination', state: 'available', x: 615, y: 270 },
    { id: 'a2', label: 'Operations management', state: 'locked', x: 710, y: 185 },
    { id: 'a3', label: 'Head of logistics', state: 'locked', x: 745, y: 80 },
    { id: 'b1', label: 'Logistics analytics', state: 'available', x: 215, y: 130 },
    { id: 'b2', label: 'Fleet intelligence', state: 'locked', x: 115, y: 75 },
    { id: 'b3', label: 'Analytics management', state: 'locked', x: 60, y: 175 },
    { id: 'c1', label: 'Team leadership', state: 'available', x: 200, y: 480 },
    { id: 'c2', label: 'Training & enablement', state: 'locked', x: 115, y: 555 },
    { id: 'c3', label: 'L&D management', state: 'locked', x: 55, y: 455 },
  ],
  edges: [
    ['core', 'u1'], ['core', 'u2'], ['core', 'u3'], ['core', 'u4'],
    ['u1', 'a1'], ['u2', 'a1'], ['a1', 'a2'], ['a2', 'a3'],
    ['u3', 'b1'], ['b1', 'b2'], ['b2', 'b3'],
    ['u4', 'c1'], ['u2', 'c1'], ['c1', 'c2'], ['c2', 'c3'],
  ],
  detail: {
    core: { source: 'Operations Coordinator, Juara Logistics Group', strengthens: 'Route optimisation, WMS systems, Python (data), Stakeholder coordination' },
    u1: { strengthens: 'Senior coordination' },
    u2: { strengthens: 'Senior coordination, Team leadership' },
    u3: { strengthens: 'Logistics analytics' },
    u4: { strengthens: 'Team leadership' },
    a1: { requires: 'Cross-functional project artifact (1 needed — your WMS migration qualifies, not yet documented)', gatedBySkillId: 'cross-functional', requiresMet: 'Cross-functional project artifact met through diagnostic evidence', unlocks: 'Operations management track', cohort: '612 candidates with your profile reached this node', timeToReach: '4–7 months' },
    b1: { requires: 'Python evidence met + SQL artifact (1 needed)', gatedBySkillId: 'sql', requiresMet: 'Python evidence + SQL evidence captured via your diagnostic', unlocks: 'Fleet intelligence', cohort: '388 made this pivot from operations roles', timeToReach: '6–9 months' },
    c1: { requires: 'Ownership signal met + direct mentoring evidence (1 needed)', unlocks: 'Training & enablement', cohort: '271 moved into people-track roles', timeToReach: '8–12 months' },
    a2: { requires: 'Senior coordination + 12 months tenure', cohort: '204', timeToReach: '18–24 months' },
    a3: { requires: 'Operations management + P&L exposure', cohort: '57', timeToReach: '3–5 years' },
    b2: { requires: 'Logistics analytics + fleet telemetry project', cohort: '121', timeToReach: '12–18 months' },
    b3: { requires: 'Fleet intelligence + team scope', cohort: '44', timeToReach: '3–4 years' },
    c2: { requires: 'Team leadership + enablement artifact', cohort: '96', timeToReach: '12–18 months' },
    c3: { requires: 'Training & enablement + program ownership', cohort: '31', timeToReach: '3–5 years' },
  },
  actionLabel: 'Add to career plan',
}

const silverMedalists = {
  title: 'Silver medalists',
  caption: 'Strong past candidates worth re-engaging',
  rows: [
    { name: 'Priya Renganathan', interviewed: 'Senior Log. Coord., Feb 2026', trajectory: '81', delta: '+4 since' },
    { name: 'Hafizuddin Nor', interviewed: 'Operations Exec, Jan 2026', trajectory: '76', delta: '+9 since' },
  ],
}

const workforceSignals = {
  title: 'Workforce signals',
  eyebrow: 'RESILIENCE OUTLOOK - ROADMAP SIGNAL',
  rows: [
    { value: '+14%', caption: 'APAC logistics talent shortage projected by 2028' },
    { value: '23%', caption: 'Of your workforce roles carry moderate automation exposure' },
    { value: '2 / 0', caption: 'Senior roles nearing succession vs. internal ready-now candidates' },
  ],
}

const retentionCase = {
  header: 'Retention signals — Kevin Raj Selvam',
  sub: 'Procurement Coordinator · 14 months tenure · Juara Logistics Group',
  signals: [
    { icon: 'TrendingDown', label: 'Platform engagement −18% over 30 days', date: 'trend', severity: 'warning' },
    { icon: 'Users', label: 'Peer departure — close collaborator resigned', date: '9 days ago', severity: 'warning' },
    { icon: 'Activity', label: 'Platform activity drop began', date: '14 days ago', severity: 'warning' },
    { icon: 'Clock', label: 'Pipeline stall — no internal movement in 21 days', date: '21 days ago', severity: 'neutral' },
  ] satisfies RetentionSignal[],
  outlook: {
    churnRisk: '67%',
    label: '90-day churn probability',
    reasoning: 'Three concurrent signals match the pattern that preceded 71% of voluntary departures in comparable roles. The strongest single predictor in this pattern — peer departure — occurred 9 days ago.',
    basis: 'Based on 1,083 retention outcomes, APAC mid-size logistics',
  },
  actions: [
    { title: 'Schedule a 1:1 within 7 days', caption: 'Acting inside 14 days of a peer departure halves the churn probability in this pattern.' },
    { title: 'Benchmark his compensation', caption: 'Offer sits at P38 for role and tenure — below the retention-safe band.', button: 'View pay benchmark', buttonLink: '/jobs/job-001' },
  ],
  privacyFootnote: 'Signals are derived from anonymised Tier-2 platform data. No message content, no manager notes.',
}

const onboardingMilestones = {
  title: 'First 60 days outlook',
  eyebrow: 'ONBOARDING SUCCESS PREDICTOR',
  cards: [
    { period: 'Week 1–2 — Role clarity', level: 'low', note: 'Verified WMS background removes the typical ramp-up risk.' },
    { period: 'Week 3–4 — Stakeholder integration', level: 'moderate', note: 'Maps to her one gap signal. Pair with a cross-functional buddy.' },
    { period: 'Month 2 — Independent ownership', level: 'low', note: 'Ownership orientation is her strongest verified signal.' },
  ],
}

const landing = {
  headline: 'Every platform optimises for the hire. CareerOS tracks what happens after.',
  subline: 'The Trajectory Engine connects candidates, employers, and universities through verified workplace outcomes — matching demonstrated trajectory to role trajectory, not claims to requirements.',
  panels: [
    { audience: 'For candidates', body: 'A living portfolio verified by real outcomes' },
    { audience: 'For employers', body: 'Onboarding risk and trajectory match, grounded in your own performance data' },
    { audience: 'For universities', body: 'Outcome loops that reach beyond graduation', badge: 'Live' },
  ],
  cta: 'See how it works',
  ctaPrimary: 'Create your profile',
  stage2Strip: {
    eyebrow: 'ROADMAP AFTER THE LIVE EXCHANGE',
    items: ['Life Chapter Designer', 'Workforce Resilience Planner', 'Expanded University Suite', 'Live Internship Marketplace', 'Lifelong Learning Wallet'],
    caption: 'The exchange is live in this prototype; these modules extend the same data loop.',
  },
  footer: 'CareerOS - Talentbank Tech Hackathon 2026 prototype',
}

const diagnosticScript = {
  step1Intro: "Your existing profile has been parsed. 2 skills are still unverified — let's strengthen them before you apply to new roles.",
  probes: [
    {
      id: 'probe-sql',
      targetSkillId: 'sql',
      question: "You listed SQL as a working skill. What's the most complex query you've written — what was it for and what did the output drive?",
      replyChip: 'I built queries to pull delivery performance data from our WMS — used it to identify our top 3 delay routes for a process review.',
      effect: { skillId: 'sql', newState: 'evidence', evidenceSource: 'Diagnostic response — WMS delay-route analysis', badgeText: 'Evidence captured' },
    },
    {
      id: 'probe-crossfunctional',
      targetSkillId: 'cross-functional',
      question: 'Cross-functional project leadership is still asserted. Walk me through a time you coordinated across teams without formal authority.',
      replyChip: 'During the WMS migration I coordinated between IT, warehouse ops, and the vendor - no one reported to me but I ran the weekly status calls.',
      effect: { skillId: 'cross-functional', newState: 'evidence', evidenceSource: 'Diagnostic response — WMS migration coordination', badgeText: 'Evidence captured' },
    },
  ],
  completionHeader: 'Profile strengthened',
  completionSub: '2 asserted claims upgraded to evidence-linked.',
  completionCta: 'View your living portfolio',
}

const salesforceIntro = {
  headline: 'Juara Logistics Group hired Hafiz Rahman through CareerOS in March 2026.',
  sub: 'His 3-month post-hire performance data is now available for connection.',
}

const university = {
  universityId: 'uni-apu',
  name: 'Asia Pacific University (APU)',
  descriptor: 'Private university · 13,000 students · Technology & Business',
  user: 'Dr. Lim Choon Keat — Dean of Employability',
  location: 'Technology Park Malaysia, Kuala Lumpur',
  connectors: {
    moodle: { name: 'Moodle LMS', status: 'connected', records: 13042 },
    sis: { name: 'APSpace SIS', status: 'connected', records: 13042 },
    tbProgram: { name: 'TalentBank Program', status: 'connected', verifiedOrgs: 47 },
  },
}

const moodleAcademicRecord = {
  studentId: 'stu-amira',
  program: 'BSc (Hons) Logistics & Supply Chain Management',
  intake: 'Sept 2021',
  cgpa: 3.68,
  creditsCompleted: 120,
  modules: [
    { code: 'LOG2104', name: 'Warehouse & Inventory Systems', grade: 'A', breakdown: { exam: 88, assignment: 91, project: 94, participation: 85 }, competencyTags: ['WMS', 'inventory optimisation'] },
    { code: 'LOG3201', name: 'Route & Network Optimisation', grade: 'A-', breakdown: { exam: 82, assignment: 86, project: 90, participation: 80 }, competencyTags: ['route optimisation', 'operations research'] },
    { code: 'DAT2001', name: 'Data Analysis for Business', grade: 'B+', breakdown: { exam: 78, assignment: 84, project: 80, participation: 88 }, competencyTags: ['Python', 'SQL', 'data analysis'] },
    { code: 'MGT2101', name: 'Cross-Functional Team Management', grade: 'A-', breakdown: { exam: 80, assignment: 88, project: 87, participation: 92 }, competencyTags: ['stakeholder coordination', 'leadership'] },
    { code: 'BUS1003', name: 'Business Communication', grade: 'A', breakdown: { exam: 85, assignment: 90, project: 88, participation: 90 }, competencyTags: ['communication'] },
  ],
  engineInsight: "Modules map to Amira's competency profile — LOG2104 -> WMS (verified), DAT2001 -> Python/SQL, MGT2101 -> cross-functional.",
  provenanceLine: "Competency 'WMS systems' is supported by 3 sources: Moodle (LOG2104, A), employer outcome (Juara, verified), and self-asserted resume claim.",
}

const talentBankAchievements = [
  {
    eventName: 'CFA Institute Research Challenge (Malaysia)',
    eventType: 'case',
    placement: 'Top 1%',
    fieldSize: 6000,
    rubricTags: ['financial analysis', 'valuation', 'presentation'],
    date: 'Nov 2024',
    verifiedBy: 'CFA Society Malaysia',
    verified: true,
    cohortNote: 'Of verified Top-1% finishers, 73% entered analyst/strategy roles within 12 months.',
  },
  {
    eventName: 'Nescafé Empowerpreneur Challenge',
    eventType: 'competition',
    placement: 'Top 8',
    fieldSize: 1400,
    rubricTags: ['business strategy', 'pitching', 'go-to-market'],
    date: 'Mar 2025',
    verifiedBy: 'Nestlé Malaysia',
    verified: true,
    cohortNote: 'Top-8 finishers show 2.1x the cross-functional ownership signal of the median graduate.',
  },
  {
    eventName: 'APU Logistics Hackathon',
    eventType: 'hackathon',
    placement: '1st',
    fieldSize: 120,
    rubricTags: ['route optimisation', 'Python', 'systems design'],
    date: 'Jan 2025',
    verifiedBy: 'APU Tech Society',
    verified: true,
    cohortNote: 'Winners of applied-logistics builds map strongly to operations-coordination success.',
  },
]

const skillProvenance = {
  wms: ['Moodle: LOG2104 (A)', 'Employer: Juara (verified)', 'Resume claim'],
  'route-opt': ['Moodle: LOG3201 (A-)', 'Achievement: APU Hackathon 1st', 'Employer: Juara'],
  python: ['Moodle: DAT2001 (B+)', 'Achievement: APU Hackathon'],
  sql: ['Moodle: DAT2001 (B+)', 'Diagnostic response'],
  stakeholder: ['Moodle: MGT2101 (A-)', 'Achievement: Nescafé Top 8'],
  'cross-functional': ['Moodle: MGT2101 (A-)', 'Diagnostic response', 'Achievement: Nescafé'],
}

const universityDashboard = {
  graduateEmploymentRate: 87,
  medianTimeToHire: 2.4,
  verifiedAchievementCoverage: 64,
  curriculumAlignmentScore: 78,
  flows: [
    { program: 'Logistics & SCM', outcome: 'Operations/Logistics', value: 142 },
    { program: 'Logistics & SCM', outcome: 'Data/Analytics', value: 38 },
    { program: 'Logistics & SCM', outcome: 'Further study', value: 12 },
    { program: 'Computer Science', outcome: 'Software/Data', value: 210 },
    { program: 'Computer Science', outcome: 'Operations/Logistics', value: 24 },
    { program: 'Business Admin', outcome: 'Strategy/Consulting', value: 66 },
    { program: 'Business Admin', outcome: 'Operations/Logistics', value: 41 },
  ],
  modules: [
    { code: 'LOG2104', name: 'Warehouse & Inventory Systems', efficacy: 91, trend: 'up', note: 'Strong predictor of operations-role success. Emphasise.' },
    { code: 'DAT2001', name: 'Data Analysis for Business', efficacy: 88, trend: 'up', note: 'Rising market demand. Under-weighted in current credits.' },
    { code: 'LOG3201', name: 'Route & Network Optimisation', efficacy: 84, trend: 'flat' },
    { code: 'MGT2101', name: 'Cross-Functional Team Mgmt', efficacy: 79, trend: 'up', note: 'Cross-functional signal increasingly demanded by employers.' },
    { code: 'HUM1002', name: 'Ethics & Society', efficacy: 41, trend: 'down', note: 'Weak downstream correlation. Review weighting.' },
    { code: 'MKT2003', name: 'Principles of Marketing', efficacy: 38, trend: 'down', note: 'Low relevance to graduate destinations in this program.' },
  ],
  risingSkills: [
    { skill: 'Data analysis', demand: 92, change: '+18%' },
    { skill: 'WMS / automation', demand: 85, change: '+12%' },
    { skill: 'Cross-functional leadership', demand: 81, change: '+15%' },
  ],
  decliningSkills: [
    { skill: 'Manual scheduling', demand: 34, change: '-22%' },
    { skill: 'Paper-based compliance', demand: 21, change: '-31%' },
  ],
  gapAlert: 'Graduates strong in WMS but under-prepared in data analysis — DAT2001 carries 3 credits; market demand suggests 6.',
  students: [
    { name: 'Amira Hashim', program: 'Logistics & SCM', readiness: 88, signal: '3 verified achievements · CGPA 3.68', status: 'Graduated — hired' },
    { name: 'Wong Jia Hui', program: 'Computer Science', readiness: 84, signal: '2 verified achievements · CGPA 3.81', status: 'Final year' },
    { name: 'Arjun Nair', program: 'Logistics & SCM', readiness: 79, signal: '1 verified achievement · CGPA 3.55', status: 'Final year' },
    { name: 'Siti Nurhaliza', program: 'Business Admin', readiness: 76, signal: '2 verified achievements · CGPA 3.62', status: 'Final year' },
  ],
  outcomeTimeline: [
    { year: 0, employment: 58 },
    { year: 1, employment: 73 },
    { year: 2, employment: 81 },
    { year: 3, employment: 86 },
    { year: 4, employment: 89 },
    { year: 5, employment: 91 },
  ],
}

const talentBankProgram = {
  hero: 'Verify your members. Amplify their signal.',
  sub: 'TalentBank Program turns your competitions, cases, and projects into verified credentials that employers trust and universities count.',
  howItWorks: [
    "Your organisation is verified once — clubs, societies, competition bodies, training providers. A one-time review confirms you're a real issuer.",
    'Submit achievement records — who participated, who placed, the field size, the rubric. Once, after each event. No ongoing admin.',
    "Members' achievements become verified evidence on their CareerOS profile, calibrated against everyone else in the field — so a Top 1% finish means exactly what it should.",
  ],
  whyItMatters: [
    { audience: 'For organisations', body: 'Your events become a credential members seek out. Verified issuers attract more participants.' },
    { audience: 'For students', body: "Stop self-reporting. Your real achievements, verified at source, differentiate you where grades can't." },
    { audience: 'For the ecosystem', body: 'Every verified achievement sharpens the signal for the next cohort — and tells universities which experiences actually build employable graduates.' },
  ],
  stats: '47 verified organisations · 8,200 verified achievements · 64% of APU students covered',
  issuers: ['CFA Society Malaysia', 'Nestlé Malaysia', 'APU Tech Society', 'Google Developer Groups', 'AWS User Group KL', 'Malaysia FinTech Association'],
  orgs: [
    { name: 'CFA Society Malaysia', count: 1240, lastSubmitted: '11 Jun 2026' },
    { name: 'Nestlé Malaysia', count: 486, lastSubmitted: '09 Jun 2026' },
    { name: 'APU Tech Society', count: 920, lastSubmitted: '07 Jun 2026' },
    { name: 'Google Developer Groups', count: 1610, lastSubmitted: '04 Jun 2026' },
    { name: 'AWS User Group KL', count: 740, lastSubmitted: '31 May 2026' },
    { name: 'Malaysia FinTech Association', count: 552, lastSubmitted: '28 May 2026' },
  ],
}

const landingFlywheel = {
  center: 'Career OS — the layer that connects them.',
  caption: 'Every side contributes data. Every side gets sharper because of it.',
  nodes: ['Candidates', 'Employers', 'Universities'],
  arrows: [
    { from: 'Universities', to: 'Candidates', label: 'academic + outcome signal' },
    { from: 'Employers', to: 'Universities', label: 'what graduates became' },
    { from: 'Candidates', to: 'Employers', label: 'verified trajectory' },
    { from: 'Candidates', to: 'Universities', label: 'readiness evidence' },
    { from: 'Employers', to: 'Candidates', label: 'post-hire outcomes' },
    { from: 'Universities', to: 'Employers', label: 'verified student performance' },
  ],
}

@Injectable({ providedIn: 'root' })
export class MockDataService {
  get primaryCandidate() { return { ...primaryCandidate, trajectory, coaching } }
  get secondaryCandidate() { return secondaryCandidate }
  get employer() { return employer }
  get jobs() { return jobs }
  get matchAnalysis() { return matchAnalysis }
  get pipeline() { return pipeline }
  get dashboardMetrics() { return dashboardMetrics }
  get employerSourceCoverage() { return employerSourceCoverage }
  get employerCandidateProfiles() { return employerCandidateProfiles }
  get salesforce() { return salesforce }
  get registration() { return registration }
  get trajectoryScenarios() { return trajectoryScenarios }
  get trajectory() { return trajectory }
  get coaching() { return coaching }
  get payBenchmark() { return payBenchmark }
  get skillTree() { return skillTree }
  get silverMedalists() { return silverMedalists }
  get workforceSignals() { return workforceSignals }
  get retentionCase() { return retentionCase }
  get onboardingMilestones() { return onboardingMilestones }
  get landing() { return landing }
  get diagnosticScript() { return diagnosticScript }
  get salesforceIntro() { return salesforceIntro }
  get university() { return university }
  get moodleAcademicRecord() { return moodleAcademicRecord }
  get talentBankAchievements() { return talentBankAchievements }
  get skillProvenance() { return skillProvenance }
  get universityDashboard() { return universityDashboard }
  get talentBankProgram() { return talentBankProgram }
  get landingFlywheel() { return landingFlywheel }

  employerCandidateById(id: string) {
    return employerCandidateProfiles.find((candidate) => candidate.id === id) ?? null
  }
}
