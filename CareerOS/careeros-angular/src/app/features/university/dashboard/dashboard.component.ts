import { AfterViewInit, ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import gsap from 'gsap'
import { MockDataService } from '../../../core/services/mock-data.service'
import { listStagger } from '../../../core/animations/entrance.animations'

@Component({
  selector: 'app-university-dashboard',
  standalone: true,
  imports: [RouterLink],
  animations: [listStagger],
  template: `
    <main class="mx-auto max-w-content px-6 py-8 lg:px-8">
      <section class="rounded-xl p-6 nm-raised">
        <div class="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">University intelligence hub</p>
            <h1 class="mt-2 font-display text-headline-md text-on-surface">{{ mock.university.name }}</h1>
            <p class="mt-2 font-body text-body-md text-secondary">{{ mock.university.user }}</p>
            <p class="mt-1 font-label text-label-md text-secondary">{{ mock.university.descriptor }} · {{ mock.university.location }}</p>
          </div>

          <div class="grid gap-2 sm:grid-cols-3">
            @for (connector of connectors; track connector.name) {
              <div class="rounded-xl px-3 py-2 nm-raised-sm">
                <div class="flex items-center gap-2">
                  <span class="h-2 w-2 rounded-full bg-primary"></span>
                  <span class="font-label text-label-md text-on-surface">{{ connector.name }}</span>
                </div>
                <p class="mt-1 font-mono text-label-sm text-secondary">{{ connector.count }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <section class="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        @for (metric of metrics; track metric.label) {
          <article class="rounded-xl p-6 nm-raised">
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">{{ metric.label }}</p>
                <p class="mt-3 font-mono text-headline-md text-primary">{{ metric.value }}</p>
              </div>
              <div class="shrink-0 text-center">
                <svg class="h-28 w-28" viewBox="0 0 96 96" aria-hidden="true">
                  <circle cx="48" cy="48" r="35" fill="none" stroke="#e6e8ec" stroke-width="10" />
                  <circle
                    class="university-ring-progress"
                    cx="48"
                    cy="48"
                    r="35"
                    fill="none"
                    stroke="#d8113a"
                    stroke-width="10"
                    stroke-linecap="round"
                    [attr.stroke-dasharray]="ringDash"
                    [attr.stroke-dashoffset]="ringOffset(metric.percent)"
                    transform="rotate(-90 48 48)"
                  />
                  <text x="48" y="52" text-anchor="middle" class="fill-on-surface font-mono text-body-md font-semibold">{{ metric.center }}</text>
                </svg>
                <p class="font-label text-label-sm text-secondary">{{ metric.ringLabel }}</p>
              </div>
            </div>
            <p class="mt-3 font-body text-body-sm text-secondary">{{ metric.caption }}</p>
          </article>
        }
      </section>

      <section class="mt-8 grid gap-6 lg:grid-cols-2" [@listStagger]="entryCards.length">
        @for (card of entryCards; track card.title) {
          <a [routerLink]="card.path" class="group rounded-xl p-6 transition-transform duration-200 hover:-translate-y-1 nm-raised">
            <div class="flex min-h-44 flex-col justify-between gap-6">
              <div>
                <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">{{ card.eyebrow }}</p>
                <h2 class="mt-2 font-display text-headline-sm text-on-surface">{{ card.title }}</h2>
                <p class="mt-2 font-body text-body-md text-secondary">{{ card.body }}</p>
              </div>
              @if (card.kind === 'sankey') {
                <svg class="h-20 w-full" viewBox="0 0 320 80" aria-hidden="true">
                  <rect x="8" y="10" width="56" height="14" rx="7" fill="#121c2a" />
                  <rect x="8" y="34" width="56" height="14" rx="7" fill="#121c2a" />
                  <rect x="250" y="16" width="58" height="14" rx="7" fill="#d8113a" />
                  <rect x="250" y="48" width="58" height="14" rx="7" fill="#d8113a" />
                  <path d="M64 17 C130 12, 180 20, 250 23" stroke="#916f6e" stroke-width="12" stroke-opacity=".35" fill="none" />
                  <path d="M64 41 C130 58, 180 50, 250 55" stroke="#916f6e" stroke-width="10" stroke-opacity=".28" fill="none" />
                </svg>
              } @else if (card.kind === 'heatmap') {
                <div class="grid grid-cols-6 gap-2">
                  @for (cell of heatmapPreview; track $index) {
                    <span class="h-8 rounded-md" [class]="cell"></span>
                  }
                </div>
              } @else if (card.kind === 'readiness') {
                <svg class="h-20 w-full" viewBox="0 0 320 80" aria-hidden="true">
                  <polyline points="10,58 60,44 110,50 160,28 210,36 260,20 310,24" fill="none" stroke="#d8113a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
                  <line x1="10" y1="64" x2="310" y2="64" stroke="#d8dade" stroke-width="2" />
                </svg>
              } @else {
                <div class="flex flex-wrap gap-2">
                  @for (issuer of issuerPreview; track issuer) {
                    <span class="rounded-full px-3 py-1 font-mono text-label-sm text-secondary nm-inset">{{ issuer }}</span>
                  }
                </div>
              }
            </div>
          </a>
        }
      </section>

      <section class="mt-8 rounded-xl p-6 nm-inset">
        <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">How APU contributes to the exchange</p>
        <div class="mt-5 grid gap-5 md:grid-cols-3">
          @for (item of exchangeColumns; track item.title) {
            <article class="rounded-xl p-5 nm-raised">
              <h2 class="font-display text-headline-sm text-on-surface">{{ item.title }}</h2>
              <p class="mt-3 font-body text-body-sm text-secondary">{{ item.body }}</p>
            </article>
          }
        </div>
      </section>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UniversityDashboardComponent implements AfterViewInit {
  protected readonly mock = inject(MockDataService)
  protected readonly ringDash = 220
  protected readonly connectors = [
    { name: this.mock.university.connectors.moodle.name, count: `${this.mock.university.connectors.moodle.records.toLocaleString()} records` },
    { name: this.mock.university.connectors.sis.name, count: `${this.mock.university.connectors.sis.records.toLocaleString()} records` },
    { name: this.mock.university.connectors.tbProgram.name, count: `${this.mock.university.connectors.tbProgram.verifiedOrgs} verified orgs` },
  ]
  protected readonly metrics = [
    { label: 'Graduate employment rate', value: `${this.mock.universityDashboard.graduateEmploymentRate}%`, center: '87%', percent: 87, ringLabel: 'employment', caption: 'Employed within six months.' },
    { label: 'Median time to hire', value: `${this.mock.universityDashboard.medianTimeToHire} mo`, center: '2.4', percent: 72, ringLabel: 'speed index', caption: 'Median months from graduation to first role.' },
    { label: 'Verified achievement coverage', value: `${this.mock.universityDashboard.verifiedAchievementCoverage}%`, center: '64%', percent: 64, ringLabel: 'coverage', caption: 'Students with at least one verified achievement.' },
    { label: 'Curriculum alignment score', value: `${this.mock.universityDashboard.curriculumAlignmentScore}`, center: '78', percent: 78, ringLabel: 'alignment', caption: 'Engine score against market demand.' },
  ]
  protected readonly entryCards = [
    { path: '/university/outcomes', eyebrow: 'Lifelong outcome loop', title: 'Graduate outcomes', body: 'Program-to-outcome flows show where graduates actually land over time.', kind: 'sankey' },
    { path: '/university/curriculum', eyebrow: 'Future-state engine', title: 'Curriculum efficacy', body: 'Module heatmaps reveal which academic signals predict workplace success.', kind: 'heatmap' },
    { path: '/university/students', eyebrow: 'Adaptive readiness', title: 'Student readiness', body: 'Academic, achievement, and competency signals form a live readiness board.', kind: 'readiness' },
    { path: '/university/program', eyebrow: 'Verified issuers', title: 'TalentBank Program', body: 'Passive organisation records turn extracurricular achievement into trusted evidence.', kind: 'program' },
  ]
  protected readonly heatmapPreview = ['bg-primary', 'bg-primary', 'bg-primary-fixed', 'bg-surface-container-high', 'bg-primary', 'bg-primary-fixed', 'bg-primary-fixed', 'bg-primary', 'bg-surface-container-high', 'bg-primary', 'bg-primary-fixed', 'bg-surface-container-high']
  protected readonly issuerPreview = ['CFA', 'Nestlé', 'APU', 'GDG', 'AWS']
  protected readonly exchangeColumns = [
    { title: 'To Candidates', body: 'Moodle, SIS, and verified achievements help students see trajectories grounded in real academic and outcome signal.' },
    { title: 'To Employers', body: 'Curriculum and readiness evidence make pre-hire trajectory signals more trustworthy than self-reported claims.' },
    { title: 'Back to APU', body: 'Employer outcomes close the loop, showing which modules and experiences actually create graduate success.' },
  ]

  ngAfterViewInit() {
    gsap.from('.university-ring-progress', {
      strokeDashoffset: this.ringDash,
      duration: 0.9,
      stagger: 0.08,
      ease: 'power2.out',
    })
  }

  protected ringOffset(percent: number) {
    return this.ringDash - (this.ringDash * percent) / 100
  }
}
