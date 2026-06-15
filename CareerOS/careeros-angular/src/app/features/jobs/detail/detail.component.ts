import { AfterViewInit, ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import gsap from 'gsap'
import { ArrowLeft, BadgeCheck, Check, LucideAngularModule, Send, WalletCards } from 'lucide-angular'
import { listStagger, tabCrossfade } from '../../../core/animations/entrance.animations'
import { Job, MatchSignal } from '../../../core/models/types'
import { AppStateService } from '../../../core/services/app-state.service'
import { MockDataService } from '../../../core/services/mock-data.service'
import { EvidenceIndicatorComponent } from '../../../shared/components/evidence-indicator/evidence-indicator.component'

type DetailTab = 'match' | 'pay'

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [RouterLink, LucideAngularModule, EvidenceIndicatorComponent],
  animations: [listStagger, tabCrossfade],
  template: `
    <main class="mx-auto max-w-content px-6 py-8 lg:px-8">
      <a routerLink="/jobs" class="inline-flex items-center gap-2 font-label text-label-lg font-semibold text-primary">
        <lucide-icon [img]="BackIcon" [size]="18" />
        Back to jobs
      </a>

      <section class="mt-5 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div class="min-w-0">
          <header class="rounded-xl p-6 nm-raised">
            <div class="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div>
                <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">{{ job.industry || 'CareerOS role' }}</p>
                <h1 class="mt-2 font-display text-headline-md text-on-surface">{{ job.title }}</h1>
                <p class="mt-2 font-body text-body-md text-secondary">{{ job.company }} - {{ job.location }}</p>
                <p class="mt-4 font-mono text-body-md text-on-surface">{{ job.salary }}</p>
              </div>
              <div
                class="rounded-xl px-5 py-4 text-right nm-inset"
                [style.view-transition-name]="scoreTransitionName(job.id)"
              >
                <p class="font-mono text-headline-lg text-primary">{{ job.match }}</p>
                <p class="font-label text-label-sm text-secondary">match score</p>
              </div>
            </div>
            <p class="mt-5 max-w-3xl font-body text-body-md text-secondary">{{ aboutText }}</p>
          </header>

          <section class="mt-6 rounded-xl p-5 nm-raised">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Performance fingerprint</p>
                <h2 class="mt-1 font-display text-headline-sm text-on-surface">Role trajectory markers</h2>
              </div>
              <span class="nm-raised-sm rounded-full px-2.5 py-0.5 font-label text-label-sm text-secondary">{{ fingerprint.length }} signals</span>
            </div>
            <div class="mt-4 grid gap-3 md:grid-cols-2" [@listStagger]="fingerprint.length">
              @for (item of fingerprint; track item) {
                <div class="rounded-lg p-4 nm-inset">
                  <p class="font-label text-label-lg font-semibold text-on-surface">{{ item }}</p>
                </div>
              }
            </div>
          </section>

          <section class="mt-6 rounded-xl p-5 nm-raised">
            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                class="rounded-lg px-4 py-2 font-display text-label-lg font-semibold transition-all"
                [class.bg-primary-container]="activeTab === 'match'"
                [class.text-on-primary]="activeTab === 'match'"
                [class.nm-raised-sm]="activeTab !== 'match'"
                [class.text-secondary]="activeTab !== 'match'"
                (click)="setTab('match')"
              >
                Match analysis
              </button>
              <button
                type="button"
                class="rounded-lg px-4 py-2 font-display text-label-lg font-semibold transition-all"
                [class.bg-primary-container]="activeTab === 'pay'"
                [class.text-on-primary]="activeTab === 'pay'"
                [class.nm-raised-sm]="activeTab !== 'pay'"
                [class.text-secondary]="activeTab !== 'pay'"
                (click)="setTab('pay')"
              >
                Pay benchmark
              </button>
            </div>

            @if (activeTab === 'match') {
              <div class="mt-5" @tabCrossfade>
                @if (isPrimaryJob) {
                  <div class="grid gap-5 lg:grid-cols-[260px_1fr]">
                    <div class="rounded-xl p-5 text-center nm-inset">
                      <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Trajectory match</p>
                      <p class="mt-3 font-mono text-headline-lg text-primary">{{ job.match }}</p>
                      <p class="font-label text-label-md text-secondary">{{ match.trajectoryMatch }}</p>
                    </div>
                    <div class="space-y-3" [@listStagger]="match.signals.length">
                      @for (signal of match.signals; track signal.name) {
                        <div class="flex items-start gap-3 rounded-lg p-4 nm-inset">
                          <app-evidence-indicator [state]="signal.state" class="mt-1" />
                          <div class="min-w-0 flex-1">
                            <div class="flex flex-wrap items-center justify-between gap-2">
                              <p class="font-label text-label-lg font-semibold text-on-surface">{{ signal.name }}</p>
                              <span class="font-mono text-label-sm" [class.text-primary]="signal.met" [class.text-secondary]="!signal.met">
                                {{ signal.met ? 'met' : 'gap' }}
                              </span>
                            </div>
                            <p class="mt-1 font-body text-body-sm text-secondary">{{ signal.caption }}</p>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                  <div class="mt-5 rounded-xl p-5 nm-inset">
                    <div class="flex items-start gap-3">
                      <lucide-icon [img]="BadgeIcon" [size]="20" class="mt-1 text-primary" />
                      <div>
                        <p class="font-body text-body-md text-on-surface">{{ resolvedMatchNote }}</p>
                        <p class="mt-3 font-label text-label-md text-secondary">{{ match.gapNoteBasis }}</p>
                      </div>
                    </div>
                  </div>
                } @else {
                  <div class="rounded-xl p-5 nm-inset">
                    <p class="font-display text-headline-sm text-on-surface">Trajectory preview only</p>
                    <p class="mt-2 font-body text-body-md text-secondary">
                      CareerOS can rank this role from listing-level signals, but the complete employer fingerprint has not been connected yet.
                    </p>
                    <p class="mt-4 font-mono text-body-md text-primary">{{ job.match }} listing match</p>
                  </div>
                }
              </div>
            }

            @if (activeTab === 'pay') {
              <div class="mt-5" @tabCrossfade>
                @if (isPrimaryJob) {
                  <div class="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                    <div class="rounded-xl p-5 nm-inset">
                      <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">{{ pay.role }}</p>
                      <h3 class="mt-2 font-display text-headline-sm text-on-surface">Malaysia offer position</h3>
                      <div class="mt-5 space-y-4">
                        @for (band of pay.bands; track band.key) {
                          <div>
                            <div class="mb-2 flex items-center justify-between gap-3">
                              <span class="font-label text-label-md text-secondary">{{ band.key }}</span>
                              <span class="font-mono text-label-lg text-on-surface">{{ rm(band.value) }}</span>
                            </div>
                            <div class="h-2 overflow-hidden rounded-full nm-raised-sm">
                              <div class="pay-band h-full origin-left rounded-full bg-primary" [style.width.%]="bandPercent(band.value)"></div>
                            </div>
                          </div>
                        }
                      </div>
                      <div class="mt-5 rounded-lg p-4 nm-raised-sm">
                        <p class="font-label text-label-md text-secondary">Offer bracket</p>
                        <p class="mt-1 font-mono text-body-md text-primary">{{ rm(pay.offer.min) }} - {{ rm(pay.offer.max) }}</p>
                      </div>
                    </div>
                    <div class="rounded-xl p-5 nm-inset">
                      <lucide-icon [img]="WalletIcon" [size]="22" class="text-primary" />
                      <p class="mt-3 font-label text-label-md text-secondary">{{ pay.anchor.label }}</p>
                      <p class="mt-1 font-mono text-headline-md text-primary">{{ pay.anchor.mono }}</p>
                      <p class="mt-3 font-body text-body-sm text-secondary">{{ pay.anchorBasis }}</p>
                      <p class="mt-4 font-body text-body-sm text-on-surface">{{ pay.positionNote }}</p>
                    </div>
                  </div>
                  <div class="mt-5 grid gap-5 lg:grid-cols-2">
                    <div class="rounded-xl p-5 nm-inset">
                      <p class="font-display text-headline-sm text-on-surface">Statutory estimate</p>
                      <div class="mt-4 space-y-3">
                        @for (row of pay.statutory; track row.label) {
                          <div class="flex items-center justify-between gap-3">
                            <span class="font-body text-body-sm text-secondary">{{ row.label }}</span>
                            <span class="font-mono text-body-sm text-on-surface">{{ row.value }}</span>
                          </div>
                        }
                      </div>
                    </div>
                    <div class="rounded-xl p-5 nm-raised-sm">
                      <p class="font-label text-label-md text-secondary">{{ pay.takeHome.label }}</p>
                      <p class="mt-2 font-mono text-headline-sm text-primary">{{ pay.takeHome.value }}</p>
                      <p class="mt-4 font-body text-body-sm text-secondary">{{ pay.employerLine }}</p>
                    </div>
                  </div>
                } @else {
                  <div class="rounded-xl p-5 nm-inset">
                    <p class="font-display text-headline-sm text-on-surface">Pay benchmark not connected</p>
                    <p class="mt-2 font-body text-body-md text-secondary">
                      This employer has not supplied enough verified role-outcome data for a pay benchmark in the demo dataset.
                    </p>
                  </div>
                }
              </div>
            }
          </section>
        </div>

        <aside class="space-y-5">
          <section class="rounded-xl p-5 nm-raised">
            <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Application</p>
            <h2 class="mt-2 font-display text-headline-sm text-on-surface">{{ applied ? 'Applied' : 'Ready to apply' }}</h2>
            <p class="mt-2 font-body text-body-sm text-secondary">
              {{ applied ? 'This application is stored locally for the demo flow.' : 'CareerOS sends the trajectory context, not just a static resume.' }}
            </p>
            <button
              type="button"
              class="nm-button mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container px-5 py-2.5 font-display text-label-lg font-semibold text-on-primary disabled:opacity-70"
              [disabled]="applied"
              (click)="apply()"
            >
              <lucide-icon [img]="applied ? CheckIcon : SendIcon" [size]="18" />
              {{ applied ? 'Application sent' : 'Apply with CareerOS' }}
            </button>
          </section>

          <section class="rounded-xl p-5 nm-raised">
            <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Next best action</p>
            <p class="mt-2 font-body text-body-md text-on-surface">
              Add the WMS migration artifact before interview. It converts the only gap signal into evidence.
            </p>
            <a routerLink="/candidate/profile" [queryParams]="{ tab: 'edit' }" class="mt-4 inline-flex font-label text-label-lg font-semibold text-primary">
              Update profile
            </a>
          </section>
        </aside>
      </section>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailComponent implements AfterViewInit {
  private readonly route = inject(ActivatedRoute)
  private readonly mock = inject(MockDataService)
  private readonly state = inject(AppStateService)

  protected readonly BackIcon = ArrowLeft
  protected readonly BadgeIcon = BadgeCheck
  protected readonly CheckIcon = Check
  protected readonly SendIcon = Send
  protected readonly WalletIcon = WalletCards

  protected readonly job: Job = this.mock.jobs.find((item) => item.id === this.route.snapshot.paramMap.get('id')) ?? this.mock.jobs[0]
  protected readonly match = this.mock.matchAnalysis
  protected readonly pay = this.mock.payBenchmark
  protected activeTab: DetailTab = this.route.snapshot.queryParamMap.get('tab') === 'pay' ? 'pay' : 'match'

  protected get isPrimaryJob(): boolean {
    return this.job.id === 'job-001'
  }

  protected get applied(): boolean {
    return this.state.appliedJobs().some((item) => item.jobId === this.job.id)
  }

  protected get aboutText(): string {
    return this.job.about ?? `${this.job.company} is screening candidates against verified trajectory signals and role-adjacent evidence.`
  }

  protected get fingerprint(): string[] {
    return this.job.performanceFingerprint ?? [
      'Role-adjacent verified skills',
      'Recent evidence velocity',
      'Salary trajectory fit',
      'Location and availability match',
    ]
  }

  protected get resolvedMatchNote(): string {
    return this.state.diagnosticCompleted() ? this.match.matchNoteResolved : this.match.matchNote
  }

  ngAfterViewInit() {
    this.animatePay()
  }

  protected setTab(tab: DetailTab) {
    this.activeTab = tab
    if (tab === 'pay') this.animatePay()
  }

  protected apply() {
    this.state.applyJob({ jobId: this.job.id, title: this.job.title, company: this.job.company })
  }

  protected bandPercent(value: number): number {
    return Math.round((value / this.pay.scaleMax) * 100)
  }

  protected rm(value: number): string {
    return `RM ${value.toLocaleString('en-MY')}`
  }

  protected scoreTransitionName(id: string): string {
    if (id === 'job-001') return 'job-score-job001'
    return `job-score-${id.replaceAll('-', '')}`
  }

  protected signalStatus(signal: MatchSignal): string {
    return signal.met ? 'met' : 'gap'
  }

  private animatePay() {
    setTimeout(() => {
      gsap.fromTo(
        '.pay-band',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.65, ease: 'power2.out', stagger: 0.08 },
      )
    })
  }
}
