# U4_ANIMATION — Full Animation Specification

Every animation in the build. Angular Animations DSL is the primary system.
GSAP handles complex timelines and scroll-triggered sequences. D3 handles
chart morphing. Lottie handles two cinematic moments.

All reusable triggers are defined in:
- `src/app/core/animations/route.animations.ts`
- `src/app/core/animations/entrance.animations.ts`

Import them in component `animations: [...]` arrays. Never redefine a
trigger that already exists — import and reuse.

---

## GLOBAL TRIGGERS (define once, import everywhere)

### route.animations.ts
```typescript
import { trigger, transition, style, animate, query, group } from '@angular/animations'

export const routeAnimations = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter', style({ opacity: 0, transform: 'translateY(8px)' }),
      { optional: true }),
    group([
      query(':leave',
        animate('150ms ease-in', style({ opacity: 0 })),
        { optional: true }),
      query(':enter',
        animate('200ms 80ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })),
        { optional: true })
    ])
  ])
])
```

Use in AppShell template:
```html
<div [@routeAnimations]="getRouteAnimationState(outlet)"
     class="page-enter">
  <router-outlet #outlet="outlet" />
</div>
```
`getRouteAnimationState(outlet)` returns `outlet.activatedRouteData['animation']`.

### entrance.animations.ts
```typescript
export const fadeSlideUp = trigger('fadeSlideUp', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(12px)' }),
    animate('250ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ])
])

export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('200ms ease-out', style({ opacity: 1 }))
  ])
])

export const listStagger = trigger('listStagger', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(8px)' }),
      stagger(50, animate('200ms ease-out',
        style({ opacity: 1, transform: 'translateY(0)' })))
    ], { optional: true })
  ])
])

export const slideInRight = trigger('slideInRight', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(100%)' }),
    animate('250ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(100%)' }))
  ])
])

export const evidenceFlip = trigger('evidenceFlip', [
  transition('asserted => evidence', [
    animate('300ms', keyframes([
      style({ transform: 'scale(1)',   offset: 0 }),
      style({ transform: 'scale(1.5)', offset: 0.5 }),
      style({ transform: 'scale(1)',   offset: 1 })
    ]))
  ]),
  transition('evidence => verified', [
    animate('250ms', keyframes([
      style({ transform: 'scale(1)',   offset: 0 }),
      style({ transform: 'scale(1.4)', offset: 0.5 }),
      style({ transform: 'scale(1)',   offset: 1 })
    ]))
  ])
])

export const stepTransition = trigger('stepTransition', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(24px)' }),
    animate('200ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
  ]),
  transition(':leave', [
    animate('150ms ease-in',
      style({ opacity: 0, transform: 'translateX(-24px)' }))
  ])
])

export const tabCrossfade = trigger('tabCrossfade', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('150ms 50ms ease-out', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    animate('100ms ease-in', style({ opacity: 0 }))
  ])
])
```

---

## PER-SCREEN ANIMATIONS

### `/` Landing
GSAP ScrollTrigger in `ngAfterViewInit()`:

```typescript
// Hero text stagger
gsap.from(['.hero-headline', '.hero-sub', '.hero-ctas'], {
  y: 20, opacity: 0, duration: 0.6,
  stagger: 0.12, ease: 'power2.out'
})

// Stat strip count-up on scroll-into-view
gsap.from('.stat-strip', {
  scrollTrigger: { trigger: '.stat-strip', start: 'top 85%' },
  opacity: 0, y: 16, duration: 0.5
})
// After the stat-strip fade, trigger countUp on each stat number
// (see countUp util below)

// Audience cards shelf — no GSAP needed; CSS snap-scroll handles it
// Arrow buttons: shelf.scrollBy({ left: ±400, behavior: 'smooth' })
```

Angular Animation on the three audience cards:
```typescript
// Apply [@listStagger] on the shelf container, items keyed by id
```

### `/register`
Role tile press: `(click)` sets `selectedRole` signal.
Selected tile: `:host-context(.selected) { @apply nm-pressed ring-2 ring-primary }` via Angular class binding `[class.nm-pressed]="selectedRole() === 'candidate'"`.
Tile transition: `transition-all duration-200` (Tailwind) on both tiles.
Form field focus: no Angular animation needed — CSS `:focus` with Tailwind `focus:ring-2 focus:ring-primary/30`.

### `/onboarding` ★ most animations
```typescript
// In component: stepIndex = signal(0), probeLogEntries = signal<string[]>([])

// Step transition: *ngIf with [@stepTransition] on probe card
// Right panel skills: [@listStagger] on the skills container

// Evidence indicator flip: [@evidenceFlip]="skill.state" on each
//   EvidenceIndicatorComponent. State change fires on chip click.

// Probe log (NEW from Stitch — right panel lower section):
// A scrolling log of timestamped engine messages that stream in via
// setTimeout chain as the diagnostic runs.
// Implementation:
private streamLog(messages: string[]) {
  messages.forEach((msg, i) => {
    setTimeout(() => {
      this.probeLogEntries.update(e => [{ id: i, time: this.now(), text: msg }, ...e])
    }, i * 800)
  })
}
// Log messages per probe step:
// Step 1 (upload): ['PARSE_INIT — Profile document received',
//   'CLAIM_EXTRACT — 6 skill claims identified',
//   'EVIDENCE_SCAN — Checking artifact linkage…']
// Step 2 (probe 1): ['PROBE_GEN — Targeting: SQL (asserted)',
//   'RESPONSE_PARSE — Analysing probe response',
//   'EVIDENCE_UPGRADE — SQL → evidence-linked']
// Step 3 (probe 2): ['PROBE_GEN — Targeting: Cross-functional leadership',
//   'PATTERN_MATCH — Response matched 847 comparable profiles',
//   'EVIDENCE_UPGRADE — Cross-functional → evidence-linked']
// Each log entry renders with class="probe-log-entry" (CSS animation in styles.scss)

// Stepper (Cognition → Logic Flow → Verification → Finalization):
// stepIndex drives active step highlight via [class.active]="stepIndex() >= n"
// Active step: bg-primary-container text-primary rounded-full
// Completed step: bg-primary text-on-primary with lucide Check
// Angular Animation on the step fill:
export const stepFill = trigger('stepFill', [
  transition('inactive => active', [
    style({ backgroundColor: '#eceef2' }),
    animate('300ms ease-out', style({ backgroundColor: '#ffeceb' }))
  ]),
  transition('active => complete', [
    animate('200ms ease-out', style({ backgroundColor: '#d8113a' }))
  ])
])
```

### `/candidate/profile`
Trajectory chart (D3):
```typescript
// Data: actualData, cohortData, projectionData derived from selectedScenario signal
// On scenario change: effect(() => { this.updateChart(this.state.selectedScenario()) })

updateChart(scenario: string) {
  const newProjection = this.mock.trajectoryScenarios[scenario].projection
  // D3 transition on the path:
  this.projectionLine
    .datum(newProjection)
    .transition()
    .duration(600)
    .ease(d3.easeCubicInOut)
    .attr('d', this.lineGenerator)
}
```

Skill segment bars (GSAP on ngAfterViewInit):
```typescript
// Each skill has 4 segment divs with class="segment"
// They all start at width 0 (override) and fill to their target
gsap.to('.skill-segments .segment.filled', {
  opacity: 1, stagger: 0.06, duration: 0.3,
  ease: 'power1.out', delay: 0.2
})
// (segments are hidden with opacity-0 in template, GSAP reveals them)
```

Scenario card: `[class.nm-pressed]="state.selectedScenario() === s.id"` via
Angular class binding. Transition: Tailwind `transition-all duration-200`.

Coaching card entrance: `[@fadeSlideUp]` with 400ms delay via inline style
`[style.animation-delay]="'400ms'"`.

Recent Evidence Tokens (NEW from Stitch): `[@listStagger]` on the tokens
container. Each token is a `nm-raised-sm` card with timestamp + category badge.

### `/candidate/skills` ★
Node graph: 14 absolutely-positioned divs on a `relative` container with
`skill-tree-canvas` class (dot-grid background via styles.scss).

Node entrance (GSAP, ngAfterViewInit):
```typescript
// Core node first, then rings at 150ms, 300ms
gsap.from('.skill-node.core',      { scale: 0.6, opacity: 0, duration: 0.4 })
gsap.from('.skill-node.inner-ring',{ scale: 0.6, opacity: 0, duration: 0.4,
  stagger: 0.07, delay: 0.15 })
gsap.from('.skill-node.outer-ring',{ scale: 0.6, opacity: 0, duration: 0.4,
  stagger: 0.07, delay: 0.30 })
```

SVG edge draw-in (GSAP):
```typescript
// After nodes appear
const lines = this.el.nativeElement.querySelectorAll('.edge-line')
lines.forEach((line: SVGLineElement, i: number) => {
  const len = (line as any).getTotalLength?.() ?? 80
  gsap.fromTo(line,
    { strokeDasharray: len, strokeDashoffset: len },
    { strokeDashoffset: 0, duration: 0.5, delay: 0.35 + i * 0.04,
      ease: 'power2.out' })
})
```

Detail panel: `[@slideInRight]` on `*ngIf="selectedNode()"`. Angular CDK
Overlay is overkill here — a fixed right panel with `slideInRight` trigger is
sufficient.

Plan button click: GSAP burst (12 particles emitted from node position,
fade in 50ms then fade out over 400ms). Simple enough with absolutely
positioned spans spawned and removed after animation.
```typescript
planNode(nodeId: string, event: MouseEvent) {
  this.stateService.planNode(nodeId)
  this.emitBurst(event.clientX, event.clientY)
}
emitBurst(x: number, y: number) {
  for (let i = 0; i < 8; i++) {
    const p = document.createElement('span')
    p.className = 'fixed w-1.5 h-1.5 rounded-full bg-primary pointer-events-none z-50'
    p.style.left = x + 'px'; p.style.top = y + 'px'
    document.body.appendChild(p)
    const angle = (i / 8) * Math.PI * 2
    gsap.to(p, {
      x: Math.cos(angle) * 40, y: Math.sin(angle) * 40,
      opacity: 0, duration: 0.4, ease: 'power2.out',
      onComplete: () => p.remove()
    })
  }
}
```

Zoom controls: `zoomLevel = signal(1)`. Apply `[style.transform]="'scale(' + zoomLevel() + ')'"` on the inner node container. GSAP smooth:
```typescript
zoomIn()  { gsap.to('.node-container', { scale: this.zoomLevel.update(z => Math.min(z + 0.2, 2)),  duration: 0.3 }) }
zoomOut() { gsap.to('.node-container', { scale: this.zoomLevel.update(z => Math.max(z - 0.2, 0.5)), duration: 0.3 }) }
```

### `/jobs` (listing)
Job row hover: Tailwind `hover:translate-x-1 transition-transform duration-150`
on each row. Plus `hover:nm-raised-sm` (class toggle — this won't work with
Tailwind; use inline style or Angular class binding instead).
Actually: `[class.translate-x-1]` on hover via Angular `(mouseenter)/(mouseleave)` if Tailwind hover is insufficient with neumorphic shadows.

Trending skills bars (NEW from Stitch): `[@listStagger]` on the bars list.
Each bar's width animates via GSAP on ngAfterViewInit:
```typescript
this.trendingSkills.forEach((skill, i) => {
  gsap.from(`#skill-bar-${i}`, {
    width: 0, duration: 0.6, delay: 0.1 + i * 0.1, ease: 'power2.out'
  })
})
```

Job row entrance: `[@listStagger]` on the rows container.

Filter chip press: `[class.nm-pressed]="activeFilter() === chip.id"` +
`[class.bg-primary-container]` binding. Transition: Tailwind `transition-all duration-150`.

### `/jobs/:id`
Tab crossfade: `[@tabCrossfade]` on each tab content panel with `*ngIf`.

Match signal rows entrance (GSAP):
```typescript
ngAfterViewInit() {
  gsap.from('.signal-row', {
    x: -8, opacity: 0, stagger: 0.08, duration: 0.3,
    delay: 0.15, ease: 'power2.out'
  })
}
```

Pay benchmark band scale (GSAP):
```typescript
const bars = [
  { el: '#p25-bar', width: '57.8%' },  // 5200/9000
  { el: '#p50-bar', width: '71.1%' },  // 6400/9000
  { el: '#p75-bar', width: '90.0%' },  // 8100/9000
]
bars.forEach((b, i) => {
  gsap.from(b.el, { width: 0, duration: 0.5, delay: 0.1 + i * 0.1, ease: 'power2.out' })
})
// Offer bracket slides in after bars
gsap.from('#offer-bracket', { opacity: 0, x: -10, duration: 0.3, delay: 0.55 })
```

Apply → confirmation: `[@tabCrossfade]` on the button/confirmation swap.
Confirmation card also fires `applyJob()` on AppStateService.

### `/candidate/dashboard`
`[@listStagger]` on appliedJobs list and newMatches list independently.
Gap badge pulse: `class="pulse-dot"` CSS animation on the warning icon.

### `/employer/dashboard`
Three metric cards entrance (GSAP):
```typescript
gsap.from('.metric-card', {
  y: 20, opacity: 0, stagger: 0.12, duration: 0.4, ease: 'power2.out'
})
```

Pipeline rows: `[@listStagger]` on the tbody equivalent.
Stage chips: statically rendered with correct colors per FROZEN_DECISIONS §
design guide. No animation — they just appear with the row.
Silver medalists: `[@slideInRight]` on the silver medalists card, delayed
300ms after main content renders (`animateOnDelay` via a signal toggled in ngAfterViewInit setTimeout).

Needs-attention icon: `class="pulse-dot"` on the warning icon.

### `/employer/candidate/:id`
Signal rows: same GSAP `x: -8, stagger: 0.08` as job detail.
Milestone cards: GSAP stagger left→right:
```typescript
gsap.from('.milestone-card', {
  y: 16, opacity: 0, stagger: 0.12, duration: 0.35, ease: 'power2.out'
})
```
Shared element transition: candidate avatar has
`style="view-transition-name: candidate-avatar"`.

### `/employer/retention`
Count-up service (reusable, no library):
```typescript
// src/app/core/services/count-up.service.ts
countUp(el: ElementRef, target: number, duration = 900) {
  const start = performance.now()
  const tick = (now: number) => {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    el.nativeElement.textContent = Math.round(progress * target).toString()
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}
```

In Retention component:
```typescript
@ViewChild('churnScore') churnScore!: ElementRef
ngAfterViewInit() {
  this.countUpService.countUp(this.churnScore, 67, 900)
  // Simultaneous risk bar fill:
  gsap.from('#risk-bar', { width: 0, duration: 0.9, ease: 'power2.out' })
}
```

Signal timeline entries: `[@listStagger]` but top-first (newest = first item).
"Real-time Feed" badge: `class="pulse-dot"` on the dot before the badge text.
Action cards: `[@slideInRight]` with 400ms delay.

Churn score has `style="view-transition-name: churn-score"` for the
employer-dashboard → retention shared element transition.

### `/employer/salesforce`
Connection progress checkmarks (Angular Animations state machine):
```typescript
export const checkmarkPop = trigger('checkmarkPop', [
  transition('* => done', [
    style({ transform: 'scale(0)' }),
    animate('200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      style({ transform: 'scale(1)' }))
  ])
])
// [checkState]="step.done ? 'done' : 'idle'" on each checkmark
```

72 → 61 SEQUENCE (the cinematic moment — GSAP Timeline):
```typescript
triggerScoreUpdate() {
  const tl = gsap.timeline()

  // 1. Strike through the "72"
  tl.to('#strike-line', { width: '100%', duration: 0.3, ease: 'power2.out' })

  // 2. Pause for impact
  tl.to({}, { duration: 0.2 })

  // 3. Count from 72 down to 61 (900ms) — use countUpService but reversed
  tl.add(() => {
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 900, 1)
      const val = Math.round(72 - (progress * 11))  // 72 → 61
      this.newScore.set(val)
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })

  // 4. Color flip: score transitions to accent (primary red) when it lands
  tl.to('#new-score', {
    color: '#d8113a', duration: 0.2
  }, '+=0.9')

  // 5. Lottie score-drop plays simultaneously with step 3
  tl.add(() => this.lottieScoredrop?.play(), '-=0.9')
}
```

Living portfolio card: `[@fadeSlideUp]` on `*ngIf="showUpdate()"`, delayed
300ms after score animation via signal toggled in the GSAP timeline callback.

Hafiz intro card: `[@fadeIn]` on mount, no delay.

---

## View Transitions API summary

`withViewTransitions()` in main.ts handles automatic crossfade between routes.
Named transitions via `view-transition-name` CSS property:

| Element              | Name                         | Screens |
|----------------------|------------------------------|---------|
| Candidate avatar     | `candidate-avatar`           | employer-dashboard → candidate-view |
| Job match score (job-001) | `job-score-job001`      | jobs → jobs/job-001 |
| Churn % value        | `churn-score`                | employer-dashboard → retention |
| WordMark             | `wordmark`                   | all (in AppShell) |

These are applied as `[style]` bindings in templates:
```html
<div [style.view-transition-name]="'candidate-avatar'">AH</div>
```

---

## countUp directive (reusable, apply as attribute)

```typescript
@Directive({ selector: '[countUp]', standalone: true })
export class CountUpDirective implements AfterViewInit {
  @Input() countUp = 0
  @Input() duration = 900
  constructor(private el: ElementRef) {}
  ngAfterViewInit() {
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / this.duration, 1)
      this.el.nativeElement.textContent = Math.round(p * this.countUp).toString()
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }
}
// Usage: <span [countUp]="84" [duration]="600">84</span>
```
