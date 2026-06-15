import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Building2, GraduationCap, LucideAngularModule, User } from 'lucide-angular'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { listStagger } from '../../core/animations/entrance.animations'
import { MockDataService } from '../../core/services/mock-data.service'
import { BadgeComponent } from '../../shared/components/badge/badge.component'
import { CountUpDirective } from '../../shared/directives/count-up.directive'

gsap.registerPlugin(ScrollTrigger)

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, LucideAngularModule, BadgeComponent, CountUpDirective],
  animations: [listStagger],
  template: `
    <main class="bg-surface text-on-surface">
      <section class="mx-auto grid min-h-[620px] max-w-content grid-cols-1 items-start gap-10 px-6 pb-8 pt-24 lg:min-h-[640px] lg:grid-cols-[minmax(0,1fr)_460px] lg:pt-28">
        <div>
          <p class="hero-sub font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">The Trajectory Engine</p>
          <h1 class="hero-headline mt-4 max-w-3xl font-display text-headline-lg text-on-surface">
            {{ landing.headline }}
          </h1>
          <p class="hero-sub mt-5 max-w-2xl font-body text-body-lg text-secondary">
            {{ landing.subline }}
          </p>
          <div class="hero-ctas mt-8 flex flex-wrap gap-3">
            <a routerLink="/register" class="nm-button inline-flex rounded-lg bg-primary-container px-5 py-2.5 font-display text-label-lg font-semibold text-on-primary hover:bg-primary">
              {{ landing.ctaPrimary }}
            </a>
            <a routerLink="/onboarding" class="nm-raised inline-flex rounded-lg px-5 py-2.5 font-display text-label-lg font-semibold text-primary hover:bg-surface-container-low">
              See how it works
            </a>
          </div>
        </div>

        <div class="nm-raised rounded-xl p-6">
          <div class="nm-inset rounded-xl p-4">
            <div class="grid grid-cols-3 gap-2">
              @for (cell of mockCells; track cell) {
                <span class="h-20 rounded-lg bg-surface-container-low"></span>
              }
            </div>
            <div class="mt-4 rounded-xl bg-primary-container p-4 text-on-primary">
              <p class="font-mono text-label-md">{{ heroMatchScore }}</p>
              <p class="font-display text-headline-sm">Trajectory match</p>
            </div>
          </div>
        </div>
      </section>

      <section class="mx-auto max-w-content px-6 py-10">
        <div class="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-center">
          <div>
            <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Three-sided exchange</p>
            <h2 class="mt-2 font-display text-headline-sm font-semibold text-on-surface">{{ flywheel.center }}</h2>
            <p class="mt-3 font-body text-body-md text-secondary">{{ flywheel.caption }}</p>
          </div>
          <div class="flywheel-panel rounded-xl p-5 nm-raised">
            <svg class="h-[360px] w-full" viewBox="0 0 720 420" role="img" aria-label="CareerOS flywheel connecting candidates employers and universities">
              <defs>
                <marker id="flywheel-arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 Z" fill="#ad002a"></path>
                </marker>
              </defs>
              @for (arrow of flywheelArrows; track arrow.label) {
                <path class="flywheel-arrow" [attr.d]="arrow.path" fill="none" stroke="#ad002a" stroke-width="2.5" stroke-linecap="round" marker-end="url(#flywheel-arrowhead)" opacity="0.75"></path>
                <text [attr.x]="arrow.labelX" [attr.y]="arrow.labelY" text-anchor="middle" class="fill-secondary font-label text-[11px]">
                  {{ arrow.label }}
                </text>
              }
              <circle cx="360" cy="214" r="74" fill="#eceef2"></circle>
              <text x="360" y="204" text-anchor="middle" class="fill-primary font-display text-[21px] font-semibold">CareerOS</text>
              <text x="360" y="229" text-anchor="middle" class="fill-secondary font-label text-[12px]">connective layer</text>
              @for (node of flywheelNodes; track node.label) {
                <g class="flywheel-card">
                  <rect [attr.x]="node.x - 78" [attr.y]="node.y - 34" width="156" height="68" rx="16" fill="#f7f9fd"></rect>
                  <text [attr.x]="node.x" [attr.y]="node.y + 5" text-anchor="middle" class="fill-on-surface font-display text-[18px] font-semibold">{{ node.label }}</text>
                </g>
              }
            </svg>
          </div>
        </div>
      </section>

      <section class="mx-auto max-w-content px-6 py-10">
        <div class="mb-5 flex items-end justify-between gap-4">
          <div>
            <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Platform ecosystems</p>
            <h2 class="mt-2 font-display text-headline-sm font-semibold text-on-surface">One outcome loop, three audiences</h2>
          </div>
          <div class="flex gap-2">
            <button type="button" class="nm-raised-sm rounded-lg px-3 py-2 font-mono text-body-md text-primary" aria-label="Scroll left" (click)="scrollShelf(-1)">‹</button>
            <button type="button" class="nm-raised-sm rounded-lg px-3 py-2 font-mono text-body-md text-primary" aria-label="Scroll right" (click)="scrollShelf(1)">›</button>
          </div>
        </div>

        <div #shelf class="hide-scrollbar flex snap-x gap-5 overflow-x-auto pb-3" [@listStagger]="audienceCards.length">
          @for (card of audienceCards; track card.title) {
            <a [routerLink]="card.route" class="nm-raised min-w-[280px] snap-start rounded-xl p-6 transition-transform hover:scale-[1.02] md:min-w-[360px]">
              <div class="mb-5 inline-flex rounded-xl bg-primary/10 p-3 text-primary">
                <lucide-icon [img]="card.icon" [size]="24" />
              </div>
              <h3 class="font-display text-headline-sm font-semibold text-primary">{{ card.title }}</h3>
              <ul class="mt-4 space-y-3">
                @for (item of card.items; track item) {
                  <li class="font-body text-body-sm text-secondary">{{ item }}</li>
                }
              </ul>
              <span class="mt-5 inline-flex font-display text-label-lg font-semibold text-primary">{{ card.cta }}</span>
            </a>
          }
        </div>
      </section>

      <section class="mx-auto max-w-content px-6 py-6">
        <div class="stat-strip nm-inset grid rounded-xl p-5 sm:grid-cols-2 lg:grid-cols-4">
          @for (stat of stats; track stat.label) {
            <div class="p-4">
              <p
                class="font-mono text-headline-lg font-medium text-primary"
                [countUp]="stat.value"
                [countUpDivisor]="stat.divisor"
                [countUpDecimals]="stat.decimals"
                [countUpSuffix]="stat.suffix"
                [duration]="900"
              >{{ stat.fallback }}</p>
              <p class="mt-2 font-label text-label-md uppercase tracking-widest text-secondary">{{ stat.label }}</p>
            </div>
          }
        </div>
      </section>

      <section class="mx-auto max-w-content px-6 py-10">
        <div class="nm-raised rounded-xl p-6">
          <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">{{ landing.stage2Strip.eyebrow }}</p>
          <div class="mt-4 flex flex-wrap gap-2">
            @for (item of landing.stage2Strip.items; track item) {
              <app-badge>{{ item }}</app-badge>
            }
          </div>
          <p class="mt-4 font-label text-label-md text-secondary">{{ landing.stage2Strip.caption }}</p>
        </div>
      </section>

      <footer class="mx-auto max-w-content px-6 pb-10">
        <p class="font-label text-label-md text-secondary">
          {{ landing.footer }}
          <a routerLink="/program/join" class="ml-2 font-display text-label-lg font-semibold text-primary">TalentBank Program</a>
        </p>
      </footer>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent implements AfterViewInit {
  @ViewChild('shelf') private readonly shelf?: ElementRef<HTMLDivElement>
  private readonly mock = inject(MockDataService)
  protected readonly landing = this.mock.landing
  protected readonly flywheel = this.mock.landingFlywheel
  protected readonly heroMatchScore = this.mock.jobs.find((job) => job.id === 'job-001')?.match ?? 0
  protected readonly mockCells = Array.from({ length: 9 }, (_, index) => index)
  protected readonly flywheelNodes = [
    { label: 'Universities', x: 360, y: 72 },
    { label: 'Candidates', x: 146, y: 330 },
    { label: 'Employers', x: 574, y: 330 },
  ]
  protected readonly flywheelArrows = [
    { label: this.flywheel.arrows[0].label, path: 'M328 88 C250 128 180 214 150 290', labelX: 206, labelY: 176 },
    { label: this.flywheel.arrows[1].label, path: 'M552 292 C526 206 456 124 392 88', labelX: 520, labelY: 176 },
    { label: this.flywheel.arrows[2].label, path: 'M210 342 C310 386 430 386 510 342', labelX: 360, labelY: 394 },
    { label: this.flywheel.arrows[3].label, path: 'M136 292 C162 188 244 104 328 72', labelX: 164, labelY: 246 },
    { label: this.flywheel.arrows[4].label, path: 'M512 356 C410 406 284 406 196 356', labelX: 360, labelY: 372 },
    { label: this.flywheel.arrows[5].label, path: 'M392 72 C486 108 558 190 584 292', labelX: 556, labelY: 246 },
  ]
  protected readonly audienceCards = [
    {
      title: 'Candidates',
      icon: User,
      items: ['Living portfolio verified by real outcomes', 'Navigable future paths', 'Fair role and pay signals'],
      cta: 'Build portfolio',
      route: '/register',
    },
    {
      title: 'Employers',
      icon: Building2,
      items: ['Trajectory match grounded in performance data', 'Onboarding risk before the hire', 'Retention signals after the hire'],
      cta: 'Review pipeline',
      route: '/employer/dashboard',
    },
    {
      title: 'Universities',
      icon: GraduationCap,
      items: ['Outcome loops beyond graduation', 'Programme-to-role evidence', 'Institutional readiness suite'],
      cta: 'Explore university hub',
      route: '/university/dashboard',
    },
  ]
  protected readonly stats = [
    { value: 24, divisor: 10, decimals: 1, suffix: 'M', fallback: '2.4M', label: 'Active Candidates' },
    { value: 10000, divisor: 1, decimals: 0, suffix: '+', fallback: '10,000+', label: 'Employers' },
    { value: 100, divisor: 1, decimals: 0, suffix: '+', fallback: '100+', label: 'Universities' },
    { value: 98, divisor: 1, decimals: 0, suffix: '%', fallback: '98%', label: 'Match Quality' },
  ]

  ngAfterViewInit() {
    gsap.from(['.hero-headline', '.hero-sub', '.hero-ctas'], {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.12,
      ease: 'power2.out',
    })
    gsap.from('.stat-strip', {
      scrollTrigger: { trigger: '.stat-strip', start: 'top 85%' },
      opacity: 0,
      y: 16,
      duration: 0.5,
    })
    gsap.from('.flywheel-card', {
      scrollTrigger: { trigger: '.flywheel-panel', start: 'top 80%' },
      opacity: 0,
      scale: 0.96,
      transformOrigin: 'center',
      stagger: 0.08,
      duration: 0.35,
      ease: 'power2.out',
    })
    document.querySelectorAll<SVGPathElement>('.flywheel-arrow').forEach((path, index) => {
      const length = path.getTotalLength()
      gsap.fromTo(
        path,
        { strokeDasharray: length, strokeDashoffset: length },
        {
          scrollTrigger: { trigger: '.flywheel-panel', start: 'top 80%' },
          strokeDashoffset: 0,
          duration: 0.55,
          delay: index * 0.05,
          ease: 'power2.out',
        },
      )
    })
  }

  scrollShelf(direction: number) {
    this.shelf?.nativeElement.scrollBy({ left: direction * 400, behavior: 'smooth' })
  }
}
