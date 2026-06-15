import { Injectable, effect, inject, signal } from '@angular/core'
import { AppliedJob, Candidate, ConnectorStatus, RoleId, ScenarioId, Skill } from '../models/types'
import { MockDataService } from './mock-data.service'

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

@Injectable({ providedIn: 'root' })
export class AppStateService {
  private readonly key = 'careeros_v2_state'
  private readonly mock = inject(MockDataService)

  candidate = signal<Candidate>(this.defaultCandidate())
  skills = signal<Skill[]>(clone(this.mock.primaryCandidate.skills ?? []))
  plannedNodes = signal<string[]>([])
  appliedJobs = signal<AppliedJob[]>([])
  diagnosticCompleted = signal(false)
  selectedScenario = signal<ScenarioId>('current')
  registered = signal(false)
  activePersona = signal<RoleId>('candidate')
  salesforceStatus = signal<ConnectorStatus>('disconnected')

  constructor() {
    this.hydrate()
    effect(() => {
      const state = {
        candidate: this.candidate(),
        skills: this.skills(),
        plannedNodes: this.plannedNodes(),
        appliedJobs: this.appliedJobs(),
        diagnosticCompleted: this.diagnosticCompleted(),
        selectedScenario: this.selectedScenario(),
        registered: this.registered(),
        activePersona: this.activePersona(),
        salesforceStatus: this.salesforceStatus(),
      }
      this.storage()?.setItem(this.key, JSON.stringify(state))
    })
  }

  register(name: string, email: string) {
    this.candidate.update((candidate) => ({
      ...candidate,
      name: name.trim() || candidate.name,
      email: email.trim() || candidate.email,
    }))
    this.registered.set(true)
  }

  updateProfile(profile: Partial<Candidate>) {
    this.candidate.update((candidate) => ({ ...candidate, ...profile }))
  }

  updateSkills(skills: Skill[]) {
    this.skills.set(clone(skills))
  }

  planNode(id: string) {
    if (!this.plannedNodes().includes(id)) {
      this.plannedNodes.update((nodes) => [...nodes, id])
    }
  }

  completeDiagnostic(skills: Skill[]) {
    this.diagnosticCompleted.set(true)
    this.skills.set(clone(skills))
  }

  setScenario(scenario: ScenarioId) {
    this.selectedScenario.set(scenario)
  }

  setPersona(persona: RoleId) {
    this.activePersona.set(persona)
  }

  setSalesforceStatus(status: ConnectorStatus) {
    this.salesforceStatus.set(status)
  }

  applyJob(job: { jobId: string; title: string; company: string }) {
    if (this.appliedJobs().some((applied) => applied.jobId === job.jobId)) return
    this.appliedJobs.update((jobs) => [
      ...jobs,
      { ...job, appliedDate: '11 Jun 2026', status: 'Under review' },
    ])
  }

  reset() {
    this.storage()?.removeItem(this.key)
    this.candidate.set(this.defaultCandidate())
    this.skills.set(clone(this.mock.primaryCandidate.skills ?? []))
    this.plannedNodes.set([])
    this.appliedJobs.set([])
    this.diagnosticCompleted.set(false)
    this.selectedScenario.set('current')
    this.registered.set(false)
    this.activePersona.set('candidate')
    this.salesforceStatus.set('disconnected')
  }

  private hydrate() {
    try {
      const saved = JSON.parse(this.storage()?.getItem(this.key) ?? 'null') as Partial<{
        candidate: Candidate
        skills: Skill[]
        plannedNodes: string[]
        appliedJobs: AppliedJob[]
        diagnosticCompleted: boolean
        selectedScenario: ScenarioId
        registered: boolean
        activePersona: RoleId
        salesforceStatus: ConnectorStatus
      }> | null
      if (!saved) return
      if (saved.candidate) this.candidate.set({ ...this.defaultCandidate(), ...saved.candidate })
      if (saved.skills?.length) this.skills.set(saved.skills)
      if (saved.plannedNodes) this.plannedNodes.set(saved.plannedNodes)
      if (saved.appliedJobs) this.appliedJobs.set(saved.appliedJobs)
      if (saved.diagnosticCompleted !== undefined) this.diagnosticCompleted.set(saved.diagnosticCompleted)
      if (saved.selectedScenario) this.selectedScenario.set(saved.selectedScenario)
      if (saved.registered !== undefined) this.registered.set(saved.registered)
      if (saved.activePersona) this.activePersona.set(saved.activePersona)
      if (saved.salesforceStatus) this.salesforceStatus.set(saved.salesforceStatus)
    } catch {
      this.reset()
    }
  }

  private defaultCandidate(): Candidate {
    return {
      id: 'cand-001',
      name: 'Amira Hashim',
      email: 'amira.hashim@careeros.my',
      headline: 'Logistics Operations Coordinator',
      location: 'Petaling Jaya, Selangor',
      initials: 'AH',
      currentRole: this.mock.primaryCandidate.currentRole,
      tenureMonths: this.mock.primaryCandidate.tenureMonths,
      experienceYears: this.mock.primaryCandidate.experienceYears,
    }
  }

  private storage(): Storage | null {
    try {
      if (typeof localStorage === 'undefined') return null
      return localStorage
    } catch {
      return null
    }
  }
}
