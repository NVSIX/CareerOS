# UPGRADE_3_SPEC — AppContext + Persona Coherence

This upgrade threads a single React Context through the entire prototype,
backed by localStorage, so that (a) the judge's actions have real
consequences that persist, (b) the candidate identity is coherent from
registration through every screen, and (c) the prototype responds to a
user rather than displaying information at one.

All V1/V2 protocols remain in force (LOG GATE, AMBIGUITY PROTOCOL,
SELF-HEALING, SESSION START/END). No new dependencies (F8 holds — React
Context and localStorage are built-in). Append a session entry in
AGENT_CONTEXT.md before writing any code.

One LOG GATE at the end of all changes. Build steps must be done in the
exact order in §3.

---

## §1 — AppContext shape (create src/context/AppContext.jsx)

```jsx
import { createContext, useContext, useReducer, useEffect } from 'react'
import { mockData } from '../data/mockData'

const STORAGE_KEY = 'careeros_v2_state'

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
        appliedDate: new Date().toLocaleDateString('en-MY',
          { day: 'numeric', month: 'short', year: 'numeric' }),
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

const AppContext = createContext(null)

export function AppContextProvider({ children }) {
  const saved = load()
  const [state, dispatch] = useReducer(reducer,
    saved ?? { ...defaultState,
      skills: defaultState.skills })  // always deep-copy skills on init

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
```

Wrap the app: in src/main.jsx wrap `<App />` with `<AppContextProvider>`.

---

## §2 — Diagnostic rewrite (update mockData.js)

Replace the Daniel Lim diagnostic script with Amira's evidence-verification
flow. Add the following export to mockData.js:

```js
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
```

Also add a `hasSalesforceIntro` field and the Hafiz intro copy:
```js
export const salesforceIntro = {
  headline: 'Juara Logistics Group hired Hafiz Rahman through CareerOS ' +
    'in March 2026.',
  sub: 'His 3-month post-hire performance data is now available for ' +
    'connection.',
}
```

Ensure each skill in primaryCandidate.skills has a stable `id` field
matching the probe targetSkillIds above:
- Route optimisation → id: 'route-opt'
- WMS systems → id: 'wms'
- Python → id: 'python'
- Stakeholder coordination → id: 'stakeholder'
- SQL → id: 'sql'
- Cross-functional leadership → id: 'cross-functional'

If IDs don't already exist in mockData, add them now. The context
skills array copies these objects, so IDs propagate automatically.

---

## §3 — Screen changes (build in this exact order)

### 3.1 src/screens/Register.jsx
- Import useApp. On mount: if state.registered is true, pre-fill the
  name/email inputs AND show a small caption under the form:
  "Welcome back, {state.candidate.name}." Otherwise pre-fill with
  Amira's defaults (from defaultState in AppContext, not hardcoded).
- Candidate tile pre-selected by default (roleSelected = 'candidate').
- On "Get started": dispatch REGISTER with { name, email } → then
  route per role. This means a judge who registers as "Ahmad Faiz"
  will see "Ahmad Faiz" everywhere downstream.

### 3.2 src/screens/OnboardingDiagnostic.jsx
Full rewrite of the mock content to use diagnosticScript from mockData:
- Step 0: same upload UI. Caption: "We'll verify your existing profile
  claims." Upload button label: "Load my profile."
- Step 1 (after upload): RIGHT panel shows context.skills with their
  current EvidenceIndicators. LEFT: show diagnosticScript.step1Intro
  as an EngineCard. A "Continue" button advances to step 2.
- Step 2: LEFT shows probe[0].question as an EngineCard (eyebrow
  "TRAJECTORY ENGINE — EVIDENCE PROBE"). One reply chip with
  probe[0].replyChip text. On click: RIGHT panel updates the SQL
  skill's EvidenceIndicator from asserted → evidence + shows
  probe[0].effect.badgeText as an accent Badge next to the skill row.
  Advances to step 3.
- Step 3: same pattern with probe[1] for cross-functional leadership.
- Step 4 completion: LEFT — completion DataCard with
  diagnosticScript.completionHeader (section header) +
  completionSub (body) + primary pill diagnosticScript.completionCta
  → /candidate/profile. RIGHT panel shows all 6 skills now with 0
  asserted (SQL and cross-functional both showing evidence).
  On render of step 4: dispatch COMPLETE_DIAGNOSTIC with the updated
  skills array (SQL and cross-functional mutated to evidence state).
  This persists to localStorage.

### 3.3 src/components/AppShell.jsx
Add persona badge to top bar, right side, next to RoleSwitcher:
- On candidate routes (/candidate/*, /jobs/*, /onboarding): small
  `layer-inset rounded-full px-3 py-1` pill: lucide User icon (14px)
  + " " + state.candidate.name (font-mono text-xs text-secondary).
- On employer routes (/employer/*): same pill with Building2 icon +
  "Farah Iskandar · Employer".
- On /, /register: no badge.
- Detect route with useLocation(). Route prefix matching is sufficient.

### 3.4 src/screens/CandidateProfile.jsx
- Header block: reads name/headline/location from state.candidate
  (not hardcoded from mockData).
- Portfolio tab skill rows: reads from state.skills (not
  mockData.primaryCandidate.skills directly). EvidenceIndicators
  reflect context state — so after the diagnostic, SQL and
  cross-functional show 'evidence' dots here.
- Edit profile tab: on mount, local editState initialised from
  state.candidate + state.skills (deep copy — do not mutate context
  directly). On "Save profile": dispatch UPDATE_PROFILE with edited
  name/headline/location, dispatch UPDATE_SKILLS with edited skills
  array, then switch to Portfolio tab. Adding a skill via "Add skill"
  appends to local editState.skills only — Save commits it.
- Scenario switcher: reads selectedScenario from context, on card
  click dispatches SET_SCENARIO. This means scenario choice persists
  across navigation.

### 3.5 src/screens/CandidateDashboard.jsx
- Greeting: "Good morning, {state.candidate.name}" as the page title
  (or just use the name in the eyebrow — e.g. eyebrow "AMIRA'S
  CAREER ACTIVITY" → dynamically "{state.candidate.name.toUpperCase()}'S
  CAREER ACTIVITY").
- Applications card: if state.appliedJobs.length > 0, render each
  applied job from context. If empty, show an empty-state caption:
  "No applications yet — apply to a role to see it here." The empty
  state is important: a judge who hasn't applied yet should see
  something graceful, not a broken card.
- Profile completeness: reads state.skills to compute the gap list
  dynamically (skills where state === 'asserted'). If no asserted
  skills remain (after diagnostic), show a congratulations line:
  "All claims evidenced. Your profile is fully verified." in accent.

### 3.6 src/screens/SkillTree.jsx
- plannedNodes: source from context (state.plannedNodes as a Set
  via new Set(state.plannedNodes)).
- "Add to career plan" click: dispatch PLAN_NODE with the nodeId.
  The Planned Badge and node ring derive from context.plannedNodes,
  not local state. Persists across navigation and page refresh.

### 3.7 src/screens/JobDetail.jsx
- Apply button state: on mount check if state.appliedJobs.find(j =>
  j.jobId === 'job-001'). If found, render the confirmation card
  immediately (already applied — no duplicate apply). If not found,
  render the apply button.
- On apply click: dispatch APPLY_JOB with { jobId: 'job-001',
  title: 'Senior Logistics Coordinator', company: 'Juara Logistics
  Group' }, then swap to confirmation card. The appliedDate is set
  by the reducer using today's actual date.

### 3.8 src/screens/SalesforceConnector.jsx
- Before the disconnected state content, add a small intro card
  (DataCard, layer-raised) showing salesforceIntro.headline (body
  semibold) + salesforceIntro.sub (caption). A small RiskDot 'low'
  dot + mono "3 months · Top 25%" summary line. This card is always
  visible (all three connector states). It introduces Hafiz before
  the judge asks "who is this?"
  
---

## §4 — Reset mechanism (quality of life for judge demos)

Add a discreet "Reset demo" link in the AppShell sidebar at the very
bottom, below all nav links. Style: caption size, txt-dim, no icon.
On click: dispatch RESET, then navigate to /. This lets a judge (or
you in a demo) wipe localStorage and start fresh as Amira without
clearing the browser manually. Do not make this prominent — it should
be small and quiet.

---

## §5 — Done criteria for this upgrade

- [ ] Register writes name to context; name shows in nav badge and
      profile header after registering as a different name
- [ ] Diagnostic runs Amira's probes; SQL and cross-functional flip to
      evidence in the right panel; COMPLETE_DIAGNOSTIC dispatched on
      step 4 render; skills persisted in localStorage
- [ ] Profile edit tab saves to context; Portfolio tab reflects the
      saved skills immediately
- [ ] Apply on JobDetail writes to context.appliedJobs; revisiting
      JobDetail shows confirmation card; Dashboard shows the application
- [ ] Skill tree planned nodes persist after navigating away and back
- [ ] Dashboard shows candidate name in eyebrow; empty state if no
      applications; congratulations line if all skills evidenced
- [ ] SalesforceConnector shows Hafiz intro card before connector UI
- [ ] Persona badge in nav: candidate name on candidate routes, Farah
      on employer routes, none on /, /register
- [ ] Reset button visible and functional
- [ ] npm run build 0 errors; no new dependencies; LOG GATE complete
