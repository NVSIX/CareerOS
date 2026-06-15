export type SkillState = 'asserted' | 'evidence' | 'verified'
export type ScenarioId = 'current' | 'promotion' | 'break'
export type RoleId = 'candidate' | 'employer' | 'university'
export type RiskLevel = 'low' | 'moderate' | 'high' | 'warning' | 'neutral'
export type SkillNodeState = 'unlocked' | 'available' | 'locked' | 'milestone'
export type ConnectorStatus = 'disconnected' | 'connecting' | 'connected'

export interface TrajectoryPoint {
  m: number
  v: number
}

export interface Skill {
  id: string
  name: string
  state: SkillState
  source: string
}

export interface Candidate {
  id?: string
  name: string
  initials?: string
  email?: string
  headline: string
  location: string
  experienceYears?: number
  currentRole?: string
  tenureMonths?: number
  skills?: Skill[]
  role?: string
}

export interface AppliedJob {
  jobId: string
  title: string
  company: string
  appliedDate: string
  status: string
}

export interface Job {
  id: string
  title: string
  company: string
  location: string
  salary: string
  posted: string
  match: number
  industry?: string
  about?: string
  performanceFingerprint?: string[]
}

export interface MatchSignal {
  name: string
  met: boolean
  state: SkillState
  caption: string
}

export interface MatchAnalysis {
  trajectoryMatch: string
  signals: MatchSignal[]
  gapNote: string
  gapNoteBasis: string
  matchNote: string
  matchNoteResolved: string
}

export interface PipelineRow {
  candidateId?: string
  name: string
  headline?: string
  role: string
  match: number
  stage?: string
  risk: 'low' | 'moderate' | 'high'
  days: number
  flightRisk: {
    level: RiskLevel
    label: string
  }
  link?: string
}

export interface ScenarioData {
  id: ScenarioId
  label: string
  tag: string
  projection: TrajectoryPoint[]
  insight: string
  basis: string
}

export interface SkillNode {
  id: string
  label: string
  state: SkillNodeState
  x: number
  y: number
  skill?: string
}

export interface SkillNodeDetail {
  source?: string
  strengthens?: string
  requires?: string
  requiresMet?: string
  gatedBySkillId?: string
  unlocks?: string
  cohort?: string
  timeToReach?: string
}

export interface SkillTree {
  intro: string
  engineCaption: string
  viewBox: string
  nodes: SkillNode[]
  edges: Array<[string, string]>
  detail: Record<string, SkillNodeDetail>
  actionLabel: string
}

export interface RetentionSignal {
  icon: string
  label: string
  date: string
  severity: RiskLevel
}

export interface RegistrationRole {
  id: RoleId
  title: string
  desc: string
  icon: string
  route: string
}

export interface RegistrationContent {
  heading: string
  subline: string
  roles: RegistrationRole[]
  fields: string[]
  button: string
  footnote: string
}

export interface PayBenchmark {
  role: string
  scaleMax: number
  bands: Array<{ key: string; value: number }>
  offer: { min: number; max: number }
  anchor: { value: number; mono: string; label: string }
  anchorBasis: string
  positionNote: string
  statutory: Array<{ label: string; value: string }>
  takeHome: { label: string; value: string }
  employerLine: string
}
