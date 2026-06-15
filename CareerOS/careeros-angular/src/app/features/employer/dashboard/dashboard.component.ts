import { AfterViewInit, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'
import { RouterLink } from '@angular/router'
import gsap from 'gsap'
import { MoreVertical, PlugZap, LucideAngularModule } from 'lucide-angular'
import { listStagger } from '../../../core/animations/entrance.animations'
import { AppStateService } from '../../../core/services/app-state.service'
import { MockDataService } from '../../../core/services/mock-data.service'
import { CountUpDirective } from '../../../shared/directives/count-up.directive'
import { BadgeComponent } from '../../../shared/components/badge/badge.component'
import { RiskDotComponent } from '../../../shared/components/risk-dot/risk-dot.component'

@Component({
  selector: 'app-employer-dashboard',
  standalone: true,
  imports: [NgTemplateOutlet, RouterLink, LucideAngularModule, CountUpDirective, BadgeComponent, RiskDotComponent],
  animations: [listStagger],
  template: `
    <main class="mx-auto max-w-content px-6 py-8 lg:px-8">
      <section class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Employer command center</p>
          <h1 class="mt-2 font-display text-headline-md text-on-surface">{{ mock.employer.company }}</h1>
          <p class="mt-2 max-w-3xl font-body text-body-md text-secondary">{{ mock.employer.descriptor }} - {{ mock.employer.location }}</p>
        </div>
        <a
          routerLink="/employer/salesforce"
          class="nm-button inline-flex items-center justify-center gap-2 rounded-lg bg-primary-container px-5 py-2.5 font-display text-label-lg font-semibold text-on-primary"
        >
          <lucide-icon [img]="PlugIcon" [size]="18" />
          {{ state.salesforceStatus() === 'connected' ? 'View sync dashboard' : 'Connect Salesforce' }}
        </a>
      </section>

      <section class="mt-6 grid gap-5 md:grid-cols-3" [@listStagger]="3">
        <article class="metric-card rounded-xl p-5 nm-raised">
          <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">ONBOARDING SUCCESS</p>
          <p class="mt-2 font-mono text-headline-lg text-primary"><span [countUp]="84" countUpSuffix="%">0%</span></p>
          <p class="mt-1 font-label text-label-md text-secondary">+2.4% vs LY</p>
          <div class="mt-4 h-2 overflow-hidden rounded-full nm-inset">
            <div class="metric-fill h-full rounded-full bg-primary" style="width:84%"></div>
          </div>
        </article>
        <article class="metric-card rounded-xl p-5 nm-raised">
          <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">ACTIVE PIPELINE</p>
          <p class="mt-2 font-mono text-headline-lg text-primary"><span [countUp]="124" countUpSuffix=" Candidates">0 Candidates</span></p>
          <p class="mt-1 font-label text-label-md text-secondary">prototype shows <span class="font-mono">{{ pipeline.length }}</span> demo candidates</p>
          <div class="mt-4 flex gap-1">
            @for (row of pipeline; track row.name) {
              <span class="h-2 flex-1 rounded-full bg-primary"></span>
            }
          </div>
        </article>
        <article class="metric-card rounded-xl p-5 nm-raised">
          <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">AVG. FLIGHT RISK</p>
          <p class="mt-2 font-body text-body-md font-semibold text-on-surface">Low</p>
          <div class="mt-2 inline-flex rounded-full bg-secondary-container px-2.5 py-0.5 font-label text-label-sm text-on-secondary-container">
            Stable band <span class="ml-1 font-mono" [countUp]="1" countUpSuffix="/3">0/3</span>
          </div>
          <div class="mt-4 grid grid-cols-3 gap-1">
            <span class="h-2 rounded-full bg-green-500"></span>
            <span class="h-2 rounded-full bg-primary/60"></span>
            <span class="h-2 rounded-full bg-surface-container-high"></span>
          </div>
        </article>
      </section>

      <section class="mt-6 grid gap-4 rounded-xl p-5 nm-raised lg:grid-cols-[minmax(0,0.9fr)_repeat(3,minmax(0,1fr))]">
        <div class="rounded-xl p-4 nm-inset">
          <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">{{ mock.employerSourceCoverage.title }}</p>
          <h2 class="mt-2 font-display text-headline-sm text-on-surface">University signal coverage</h2>
          <p class="mt-2 font-body text-body-sm text-secondary">{{ mock.employerSourceCoverage.caption }}</p>
        </div>
        @for (row of mock.employerSourceCoverage.rows; track row.source) {
          <a routerLink="/university/dashboard" class="rounded-xl p-4 nm-inset transition-colors hover:bg-surface-container-low">
            <div class="flex items-center justify-between gap-3">
              <p class="font-label text-label-lg font-semibold text-on-surface">{{ row.source }}</p>
              <span class="font-mono text-body-sm text-primary">{{ row.value }}</span>
            </div>
            <p class="mt-2 font-body text-body-sm text-secondary">{{ row.signal }}</p>
          </a>
        }
        <p class="rounded-xl p-4 font-label text-label-md text-secondary nm-inset lg:col-span-full">{{ mock.employerSourceCoverage.impact }}</p>
      </section>

      <section class="mt-6 grid items-start gap-6 lg:grid-cols-12">
        <div class="lg:col-span-9">
          <div class="rounded-2xl p-4 nm-inset">
            <div class="hidden grid-cols-[2fr_1.2fr_1fr_1.1fr_auto] gap-4 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.08em] text-secondary md:grid">
              <span>CANDIDATE</span>
              <span>ROLE PATH</span>
              <span>STAGE</span>
              <span>FLIGHT RISK</span>
              <span>ACTIONS</span>
            </div>
            <div class="space-y-3" [@listStagger]="pipeline.length">
              @for (row of pipeline; track row.name) {
                @if (row.link) {
                  <a
                    [routerLink]="row.link"
                    class="grid gap-4 rounded-xl px-4 py-4 transition-colors hover:bg-surface-container-low md:grid-cols-[2fr_1.2fr_1fr_1.1fr_auto] md:items-center"
                  >
                    <ng-container [ngTemplateOutlet]="rowContent" [ngTemplateOutletContext]="{ row: row }" />
                  </a>
                } @else {
                  <div class="grid cursor-default gap-4 rounded-xl px-4 py-4 md:grid-cols-[2fr_1.2fr_1fr_1.1fr_auto] md:items-center">
                    <ng-container [ngTemplateOutlet]="rowContent" [ngTemplateOutletContext]="{ row: row }" />
                  </div>
                }
              }
            </div>
          </div>
        </div>

        <aside class="space-y-5 lg:col-span-3">
          <section class="rounded-xl p-5 nm-raised">
            <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">NEEDS ATTENTION</p>
            <div class="mt-4 space-y-3">
              @for (item of mock.dashboardMetrics.flagged; track item.name) {
                @if (item.link) {
                  <a [routerLink]="item.link" class="block rounded-lg p-3 nm-inset transition-colors hover:bg-surface-container-low">
                    <p class="font-label text-label-lg font-semibold text-on-surface">{{ item.name }}</p>
                    <p class="mt-1 font-body text-body-sm text-secondary">{{ item.note }}</p>
                  </a>
                } @else {
                  <div class="rounded-lg p-3 nm-inset">
                    <p class="font-label text-label-lg font-semibold text-on-surface">{{ item.name }}</p>
                    <p class="mt-1 font-body text-body-sm text-secondary">{{ item.note }}</p>
                  </div>
                }
              }
            </div>
            <button
              type="button"
              class="nm-button mt-4 w-full rounded-lg bg-primary-container px-5 py-2.5 font-display text-label-lg font-semibold text-on-primary"
              (click)="addressAll()"
            >
              {{ attentionAddressed() ? 'All addressed' : 'Address All' }}
            </button>
            @if (attentionAddressed()) {
              <p class="mt-3 font-label text-label-md text-secondary">Attention items queued into candidate and retention workflows.</p>
            }
          </section>

          <section class="rounded-xl p-5 nm-raised">
            <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">SILVER MEDALISTS</p>
            <p class="mt-1 font-label text-label-md text-secondary">{{ mock.silverMedalists.caption }}</p>
            <div class="mt-4 space-y-3">
              @for (row of mock.silverMedalists.rows; track row.name) {
                <div class="rounded-lg p-3 nm-inset">
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <p class="font-label text-label-lg font-semibold text-on-surface">{{ row.name }}</p>
                      <p class="mt-1 font-body text-body-sm text-secondary">{{ row.interviewed }}</p>
                      <p class="mt-2 font-mono text-label-md text-primary">{{ row.trajectory }} <span class="text-secondary">{{ row.delta }}</span></p>
                    </div>
                    @if (isInvited(row.name)) {
                      <app-badge>Invited</app-badge>
                    } @else {
                      <button type="button" class="nm-raised-sm rounded-lg px-3 py-1.5 font-label text-label-sm font-semibold text-primary" (click)="invite(row.name)">
                        Re-engage
                      </button>
                    }
                  </div>
                </div>
              }
            </div>
          </section>

          <a routerLink="/employer/salesforce" class="block rounded-xl p-5 nm-raised">
            <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">{{ state.salesforceStatus() === 'connected' ? 'SALESFORCE CONNECTED' : 'CONNECT SALESFORCE' }}</p>
            <p class="mt-2 font-body text-body-sm text-secondary">
              {{ state.salesforceStatus() === 'connected' ? 'Post-hire outcomes are now feeding trajectory matching.' : 'Close the loop from post-hire performance data to better trajectory matching.' }}
            </p>
            <span class="nm-button mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-container px-4 py-2 font-display text-label-lg font-semibold text-on-primary">
              <lucide-icon [img]="PlugIcon" [size]="18" />
              {{ state.salesforceStatus() === 'connected' ? 'View sync' : 'Connect' }}
            </span>
          </a>

          <section class="rounded-xl p-5 nm-raised">
            <div class="flex items-center justify-between gap-3">
              <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">{{ mock.workforceSignals.eyebrow }}</p>
              <app-badge>Roadmap</app-badge>
            </div>
            <h2 class="mt-2 font-display text-headline-sm text-on-surface">Resilience Outlook</h2>
            <div class="mt-4 space-y-3">
              @for (row of mock.workforceSignals.rows; track row.caption) {
                <div class="rounded-lg p-3 nm-inset">
                  <p class="font-mono text-body-md text-primary">{{ row.value }}</p>
                  <p class="mt-1 font-body text-body-sm text-secondary">{{ row.caption }}</p>
                </div>
              }
            </div>
          </section>
        </aside>
      </section>

      <footer class="mt-6 flex flex-wrap items-center gap-3 rounded-xl p-4 nm-raised">
        <span class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">INTEGRATIONS</span>
        <a routerLink="/employer/salesforce" class="nm-raised-sm rounded-full px-3 py-1 font-label text-label-sm font-semibold text-primary">
          {{ state.salesforceStatus() === 'connected' ? 'Salesforce connected' : 'Connect Salesforce' }}
        </a>
        @for (item of mock.landing.stage2Strip.items; track item) {
          <span class="nm-raised-sm rounded-full px-3 py-1 font-label text-label-sm text-secondary">{{ item }}</span>
        }
      </footer>

      <ng-template #rowContent let-row="row">
        <div class="flex min-w-0 items-center gap-3">
          <span
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-label-lg font-semibold text-on-surface nm-raised-sm"
            [style.background]="avatarColor(row.name)"
            [style.view-transition-name]="row.candidateId === 'cand-001' ? 'candidate-avatar' : null"
          >
            {{ initials(row.name) }}
          </span>
          <span class="min-w-0">
            <span class="block font-label text-label-lg font-semibold text-on-surface">{{ row.name }}</span>
            <span class="block truncate font-body text-body-sm text-secondary">{{ row.headline }}</span>
          </span>
        </div>
        <p class="font-body text-body-sm text-on-surface">{{ row.role }}</p>
        <span class="w-max" [class]="stageClass(row.stage)">{{ row.stage }}</span>
        <app-risk-dot [level]="row.flightRisk.level" [label]="row.flightRisk.label" />
        <span class="text-secondary"><lucide-icon [img]="MenuIcon" [size]="18" /></span>
      </ng-template>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployerDashboardComponent implements AfterViewInit {
  protected readonly mock = inject(MockDataService)
  protected readonly state = inject(AppStateService)
  protected readonly MenuIcon = MoreVertical
  protected readonly PlugIcon = PlugZap
  protected readonly pipeline = this.mock.pipeline
  private readonly invited = signal<string[]>([])
  protected readonly attentionAddressed = signal(false)

  ngAfterViewInit() {
    gsap.from('.metric-card', { opacity: 0, y: 12, duration: 0.3, stagger: 0.06, ease: 'power1.out' })
    gsap.fromTo('.metric-fill', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 0.8, ease: 'power2.out' })
  }

  protected invite(name: string) {
    if (!this.invited().includes(name)) this.invited.update((rows) => [...rows, name])
  }

  protected addressAll() {
    this.attentionAddressed.set(true)
  }

  protected isInvited(name: string): boolean {
    return this.invited().includes(name)
  }

  protected initials(name: string): string {
    return name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase()
  }

  protected avatarColor(name: string): string {
    const colors: Record<string, string> = {
      'Amira Hashim': '#d6e0f3',
      'Daniel Lim Wei Jian': '#e1e3e4',
      'Priya Renganathan': '#ffdad9',
      'Marcus Tan Jia Hao': '#e0e2e6',
      'Nurul Ain Bakar': '#d9e3f6',
      'Kevin Raj Selvam': '#ffdad6',
      'Aisha Tan Mei Xuan': '#d6e0f3',
      'Harith Zulkifli': '#e1e3e4',
      'Mei Ling Chua': '#ffdad9',
      'Arif Hakimi Rahman': '#e0e2e6',
      'Siti Nabilah Osman': '#d9e3f6',
      'Ravi Menon': '#ffdad6',
      'Liyana Mokhtar': '#f2f4f8',
    }
    return colors[name] ?? '#e0e2e6'
  }

  protected stageClass(stage = ''): string {
    const base = 'rounded-full px-3 py-0.5 text-label-sm font-label font-semibold'
    const classes: Record<string, string> = {
      Interviewing: 'bg-secondary-container text-on-secondary-container',
      Screening: 'bg-tertiary-fixed text-on-tertiary-fixed',
      Reviewing: 'bg-primary-fixed text-on-primary-fixed',
      'On-Site': 'bg-primary-container text-on-primary',
      'Technical Test': 'bg-secondary-container text-on-secondary-container',
      'Offer Pending': 'bg-primary text-on-primary',
    }
    return `${base} ${classes[stage] ?? 'nm-raised-sm text-secondary'}`
  }
}
