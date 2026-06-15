# U4_STACK — Angular Architecture & Setup

## 1. Scaffold & install

```bash
ng new careeros-angular --standalone --routing --style=scss --skip-git
cd careeros-angular

# Animation + CDK
ng add @angular/animations   # usually included; confirm in app.config.ts
npm install @angular/cdk

# Icons
npm install lucide-angular

# Animations
npm install gsap
npm install @types/gsap --save-dev
npm install d3 @types/d3
npm install ngx-lottie lottie-web

# Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

angular.json → `projects.careeros-angular.architect.build.options`:
```json
"styles": ["src/styles.scss"],
"scripts": []
```

tailwind.config.js → content: `["./src/**/*.{html,ts,scss}"]`

## 2. App bootstrap (src/main.ts)

```typescript
import { bootstrapApplication } from '@angular/platform-browser'
import { provideRouter, withViewTransitions } from '@angular/router'
import { provideAnimations } from '@angular/platform-browser/animations'
import { provideLottieOptions } from 'ngx-lottie'
import player from 'lottie-web'
import { AppComponent } from './app/app.component'
import { routes } from './app/app.routes'

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withViewTransitions()),  // View Transitions API
    provideAnimations(),
    provideLottieOptions({ player: () => player }),
  ]
})
```

`withViewTransitions()` enables the View Transitions API on every route
change automatically — zero additional code needed on individual routes.

## 3. Routing (src/app/app.routes.ts)

```typescript
import { Routes } from '@angular/router'

export const routes: Routes = [
  { path: '',         loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent),    data: { animation: 'landing' } },
  { path: 'register', loadComponent: () => import('./features/candidate/register/register.component').then(m => m.RegisterComponent), data: { animation: 'register' } },
  { path: 'onboarding', loadComponent: () => import('./features/candidate/onboarding/onboarding.component').then(m => m.OnboardingComponent), data: { animation: 'onboarding' } },
  { path: 'candidate', children: [
    { path: 'dashboard', loadComponent: () => import('./features/candidate/dashboard/dashboard.component').then(m => m.DashboardComponent), data: { animation: 'candidate' } },
    { path: 'profile',   loadComponent: () => import('./features/candidate/profile/profile.component').then(m => m.ProfileComponent),   data: { animation: 'candidate' } },
    { path: 'skills',    loadComponent: () => import('./features/candidate/skills/skills.component').then(m => m.SkillsComponent),       data: { animation: 'candidate' } },
  ]},
  { path: 'jobs', children: [
    { path: '',        loadComponent: () => import('./features/jobs/listing/listing.component').then(m => m.ListingComponent),   data: { animation: 'jobs' } },
    { path: ':id',     loadComponent: () => import('./features/jobs/detail/detail.component').then(m => m.DetailComponent),     data: { animation: 'jobs' } },
  ]},
  { path: 'employer', children: [
    { path: 'dashboard',         loadComponent: () => import('./features/employer/dashboard/dashboard.component').then(m => m.EmployerDashboardComponent),     data: { animation: 'employer' } },
    { path: 'candidate/:id',     loadComponent: () => import('./features/employer/candidate-view/candidate-view.component').then(m => m.CandidateViewComponent), data: { animation: 'employer' } },
    { path: 'retention',         loadComponent: () => import('./features/employer/retention/retention.component').then(m => m.RetentionComponent),             data: { animation: 'employer' } },
    { path: 'salesforce',        loadComponent: () => import('./features/employer/salesforce/salesforce.component').then(m => m.SalesforceComponent),           data: { animation: 'employer' } },
  ]},
  { path: '**', redirectTo: '' }
]
```

All routes lazy-loaded. Angular's `loadComponent` handles code splitting
automatically — no manual `ng-lazy-load` setup needed.

## 4. Folder structure

```
src/app/
  core/
    services/
      app-state.service.ts    ← global signal state + localStorage
      mock-data.service.ts    ← all mock entities
    models/
      types.ts                ← Candidate, Skill, Job, etc.
    animations/
      route.animations.ts     ← routeAnimations trigger
      entrance.animations.ts  ← reusable fadeSlideUp, listStagger, etc.
  shared/
    components/
      app-shell/              ← top bar + sidebar + RouterOutlet
      data-card/
      metric-block/
      badge/
      evidence-indicator/
      coaching-card/
      engine-card/
      risk-dot/
      button/
      mono-text/
      screen-stub/
  features/
    landing/
    candidate/
      register/
      onboarding/
      dashboard/
      profile/
      skills/
    jobs/
      listing/
      detail/
    employer/
      dashboard/
      candidate-view/
      retention/
      salesforce/
```

## 5. AppStateService (src/app/core/services/app-state.service.ts)

```typescript
import { Injectable, signal, effect } from '@angular/core'
import { MockDataService } from './mock-data.service'

@Injectable({ providedIn: 'root' })
export class AppStateService {
  private readonly KEY = 'careeros_v2_state'

  candidate = signal<Candidate>({
    name: 'Amira Hashim', email: 'amira.hashim@careeros.my',
    headline: 'Logistics Operations Coordinator',
    location: 'Petaling Jaya, Selangor'
  })
  skills        = signal<Skill[]>([...this.mock.primaryCandidate.skills.map(s => ({ ...s }))])
  plannedNodes  = signal<string[]>([])
  appliedJobs   = signal<AppliedJob[]>([])
  diagnosticCompleted = signal(false)
  selectedScenario    = signal<'current' | 'promotion' | 'break'>('current')
  registered    = signal(false)

  constructor(private mock: MockDataService) {
    this.hydrate()
    effect(() => {
      const state = {
        candidate: this.candidate(), skills: this.skills(),
        plannedNodes: this.plannedNodes(), appliedJobs: this.appliedJobs(),
        diagnosticCompleted: this.diagnosticCompleted(),
        selectedScenario: this.selectedScenario(), registered: this.registered()
      }
      try { localStorage.setItem(this.KEY, JSON.stringify(state)) } catch {}
    })
  }

  private hydrate() {
    try {
      const saved = JSON.parse(localStorage.getItem(this.KEY) ?? 'null')
      if (!saved) return
      if (saved.candidate)          this.candidate.set(saved.candidate)
      if (saved.skills?.length)     this.skills.set(saved.skills)
      if (saved.plannedNodes)       this.plannedNodes.set(saved.plannedNodes)
      if (saved.appliedJobs)        this.appliedJobs.set(saved.appliedJobs)
      if (saved.diagnosticCompleted !== undefined) this.diagnosticCompleted.set(saved.diagnosticCompleted)
      if (saved.selectedScenario)   this.selectedScenario.set(saved.selectedScenario)
      if (saved.registered !== undefined) this.registered.set(saved.registered)
    } catch {}
  }

  register(name: string, email: string)  { this.candidate.update(c => ({ ...c, name, email })); this.registered.set(true) }
  updateProfile(p: Partial<Candidate>)   { this.candidate.update(c => ({ ...c, ...p })) }
  updateSkills(skills: Skill[])          { this.skills.set(skills) }
  planNode(id: string)                   { if (!this.plannedNodes().includes(id)) this.plannedNodes.update(n => [...n, id]) }
  completeDiagnostic(skills: Skill[])    { this.diagnosticCompleted.set(true); this.skills.set(skills) }
  setScenario(s: typeof this.selectedScenario extends () => infer T ? T : never) { this.selectedScenario.set(s as any) }

  applyJob(job: { jobId: string, title: string, company: string }) {
    if (this.appliedJobs().find(j => j.jobId === job.jobId)) return
    this.appliedJobs.update(list => [...list, {
      ...job, appliedDate: '11 Jun 2026', status: 'Under review'
    }])
  }

  reset() {
    localStorage.removeItem(this.KEY)
    this.candidate.set({ name: 'Amira Hashim', email: 'amira.hashim@careeros.my',
      headline: 'Logistics Operations Coordinator', location: 'Petaling Jaya, Selangor' })
    this.skills.set([...this.mock.primaryCandidate.skills.map(s => ({ ...s }))])
    this.plannedNodes.set([]); this.appliedJobs.set([])
    this.diagnosticCompleted.set(false); this.selectedScenario.set('current')
    this.registered.set(false)
  }
}
```

## 6. MockDataService (src/app/core/services/mock-data.service.ts)

Injectable service that returns the IDENTICAL entities from MOCK_DATA.md
and MOCK_DATA_V2.md. All data is readonly constants defined at the top of
the file. The service exposes them as getter properties (not signals —
mock data never changes). Re-implement every object verbatim from the V3
MOCK_DATA exports: `primaryCandidate`, `secondaryCandidate` (removed in S5
but skills are still the seed data), `jobs`, `pipeline`, `trajectoryScenarios`,
`payBenchmark`, `skillTree`, `silverMedalists`, `workforceSignals`,
`retentionCase`, `onboardingMilestones`, `diagnosticScript`,
`salesforceIntro`, `registration`.

## 7. View transition names (add to shared elements)

In Angular templates, add `style="view-transition-name: <name>"` to
elements that should share transitions across routes. Key pairs:

| Element                  | view-transition-name     | Routes sharing it              |
|--------------------------|--------------------------|--------------------------------|
| Candidate avatar circle  | `candidate-avatar`       | dashboard ↔ profile ↔ employer-candidate |
| Job match score          | `job-score-{{ job.id }}` | listing ↔ detail               |
| "CareerOS" wordmark      | `wordmark`               | all routes (persists in nav)   |
| Churn % number           | `churn-score`            | employer-dashboard ↔ retention |

`withViewTransitions()` in main.ts activates this automatically.

## 8. GSAP registration (in any component that uses ScrollTrigger)

```typescript
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
```

Call once at the top of the component file. Don't register globally in
main.ts (tree-shaking).

## 9. D3 pattern for Angular

```typescript
@ViewChild('chartEl') chartEl!: ElementRef<SVGSVGElement>

ngAfterViewInit() {
  // Use Promise.resolve to ensure Angular CD has completed
  Promise.resolve().then(() => this.drawChart())
}

drawChart() {
  const svg = d3.select(this.chartEl.nativeElement)
  // ... D3 setup
}
```

## 10. Lottie pattern

```typescript
import { LottieComponent, AnimationOptions } from 'ngx-lottie'

// In template:
// <ng-lottie [options]="lottieOptions" width="48px" height="48px" />

lottieOptions: AnimationOptions = {
  path: '/assets/lottie/checkmark.json',
  loop: false, autoplay: false
}
// Trigger play via AnimationItem reference from (animationCreated) event.
```

Download free checkmark Lottie from LottieFiles.com in red (#d8113a).
Save to `src/assets/lottie/checkmark.json` and `score-drop.json`.
