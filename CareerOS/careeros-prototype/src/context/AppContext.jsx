import { createContext, useContext, useReducer, useEffect } from 'react'
import { mockData } from '../data/mockData'

const STORAGE_KEY = 'careeros_v2_state'
const DEMO_APPLIED_DATE = '11 Jun 2026'

// DEFAULT STATE — Amira is always the starting persona
const defaultState = {
  candidate: {
    name: 'Amira Hashim',
    email: 'amira.hashim@careeros.my',
    headline: mockData.primaryCandidate.headline,
    location: mockData.primaryCandidate.location,
  },
  // Skills live in context so edit-profile and diagnostic can mutate them.
  // Shape per skill: { id, name, state, evidenceSource }
  // Seed from mockData.primaryCandidate.skills (copy, do not mutate the import).
  skills: mockData.primaryCandidate.skills.map(s => ({ ...s })),
  plannedNodes: [],          // stored as Array; converted to/from Set at usage
  appliedJobs: [],           // [{ jobId, title, company, appliedDate, status }]
  diagnosticCompleted: false,
  selectedScenario: 'current',
  registered: false,
}

// ACTIONS
// 'REGISTER'        payload: { name, email }
// 'UPDATE_PROFILE'  payload: { name?, headline?, location? }
// 'UPDATE_SKILLS'   payload: skills[]  (full replacement)
// 'PLAN_NODE'       payload: nodeId string
// 'APPLY_JOB'       payload: { jobId, title, company }
// 'COMPLETE_DIAGNOSTIC' payload: updatedSkills[] (skills after probe effects)
// 'SET_SCENARIO'    payload: scenarioId string
// 'RESET'           payload: none (clears localStorage + resets to default)

function reducer(state, action) {
  switch (action.type) {
    case 'REGISTER':
      return { ...state, registered: true,
        candidate: { ...state.candidate, ...action.payload } }
    case 'UPDATE_PROFILE':
      return { ...state,
        candidate: { ...state.candidate, ...action.payload } }
    case 'UPDATE_SKILLS':
      return { ...state, skills: action.payload }
    case 'PLAN_NODE':
      return { ...state,
        plannedNodes: state.plannedNodes.includes(action.payload)
          ? state.plannedNodes
          : [...state.plannedNodes, action.payload] }
    case 'APPLY_JOB':
      if (state.appliedJobs.find(j => j.jobId === action.payload.jobId))
        return state
      return { ...state, appliedJobs: [...state.appliedJobs, {
        ...action.payload,
        appliedDate: DEMO_APPLIED_DATE,
        status: 'Under review',
      }] }
    case 'COMPLETE_DIAGNOSTIC':
      return { ...state, diagnosticCompleted: true,
        skills: action.payload }
    case 'SET_SCENARIO':
      return { ...state, selectedScenario: action.payload }
    case 'RESET':
      return { ...defaultState,
        skills: mockData.primaryCandidate.skills.map(s => ({ ...s })) }
    default: return state
  }
}

// localStorage helpers
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch { return null }
}
function save(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) }
  catch { /* quota — silently ignore */ }
}

// Build the initial state: saved values merged OVER the defaults, so a saved
// blob from an older/partial schema still yields a complete state (new or
// missing fields fall back to defaults). Arrays are validated; skills are
// always deep-copied so the mockData import is never mutated.
function getInitialState() {
  const base = { ...defaultState, skills: defaultState.skills.map(s => ({ ...s })) }
  const saved = load()
  if (!saved || typeof saved !== 'object') return base
  return {
    ...base,
    ...saved,
    candidate: { ...base.candidate, ...(saved.candidate || {}) },
    skills: Array.isArray(saved.skills) && saved.skills.length
      ? saved.skills.map(s => ({ ...s }))
      : base.skills,
    plannedNodes: Array.isArray(saved.plannedNodes) ? saved.plannedNodes : base.plannedNodes,
    appliedJobs: Array.isArray(saved.appliedJobs) ? saved.appliedJobs : base.appliedJobs,
  }
}

const AppContext = createContext(null)

export function AppContextProvider({ children }) {
  // Lazy initializer — runs once, reads localStorage off the render path.
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState)

  useEffect(() => { save(state) }, [state])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppContextProvider')
  return ctx
}
