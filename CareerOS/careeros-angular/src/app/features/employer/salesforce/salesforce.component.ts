import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, ViewChild, inject, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { AnimationOptions, LottieComponent } from 'ngx-lottie'
import type { AnimationItem } from 'lottie-web'
import * as d3 from 'd3'
import gsap from 'gsap'
import { ArrowRight, Check, Database, Lock, LucideAngularModule, PlugZap, ShieldCheck } from 'lucide-angular'
import { checkmarkPop, fadeIn, fadeSlideUp, stepTransition } from '../../../core/animations/entrance.animations'
import { AppStateService } from '../../../core/services/app-state.service'
import { MockDataService } from '../../../core/services/mock-data.service'
import { EngineCardComponent } from '../../../shared/components/engine-card/engine-card.component'
import { EvidenceIndicatorComponent } from '../../../shared/components/evidence-indicator/evidence-indicator.component'

interface WorkforceTrajectoryPoint {
  month: string
  actual: number
  baseline: number
}

@Component({
  selector: 'app-salesforce',
  standalone: true,
  imports: [RouterLink, LucideAngularModule, LottieComponent, EvidenceIndicatorComponent, EngineCardComponent],
  animations: [fadeIn, fadeSlideUp, stepTransition, checkmarkPop],
  template: `
    <main class="mx-auto max-w-content px-6 py-8 lg:px-8">
      <section class="rounded-xl p-5 nm-raised" @fadeIn>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-full font-mono text-body-md font-semibold text-on-surface nm-raised-sm" style="background:#d9e3f6">
              {{ salesforce.employee.initials }}
            </div>
            <div>
              <h1 class="font-display text-headline-sm text-on-surface">{{ salesforce.employee.name }}</h1>
              <p class="font-body text-body-sm text-secondary">{{ salesforce.employee.role }}</p>
            </div>
          </div>
          <span class="w-max rounded-full bg-secondary-container px-3 py-1 font-mono text-label-md text-on-secondary-container">3 months - Top 25%</span>
        </div>
      </section>

      @if (connState() === 'disconnected') {
        <section class="mx-auto mt-6 max-w-3xl rounded-xl p-6 nm-raised" @fadeSlideUp>
          <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Salesforce connector</p>
          <h2 class="mt-2 font-display text-headline-md text-on-surface">Connect your Salesforce</h2>
          <p class="mt-2 font-body text-body-md text-secondary">
            CareerOS only receives anonymised Tier 2 signals needed to improve onboarding and trajectory matching.
          </p>

          <div class="mt-6 rounded-2xl p-5 nm-inset">
            <div class="grid gap-5 md:grid-cols-[1fr_auto_1fr]">
              <div>
                <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Stays in Salesforce (Tier 1)</p>
                <div class="mt-4 space-y-2">
                  @for (field of salesforce.tier1Fields; track field) {
                    <div class="flex items-center gap-2 rounded-lg p-2 nm-raised-sm">
                      <lucide-icon [img]="LockIcon" [size]="16" class="text-secondary" />
                      <span class="font-body text-body-sm text-on-surface">{{ field }}</span>
                    </div>
                  }
                </div>
              </div>
              <div class="hidden h-full w-px bg-outline-variant md:block"></div>
              <div>
                <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Crosses to CareerOS (Tier 2, anonymised)</p>
                <div class="mt-4 space-y-2">
                  @for (field of salesforce.record.fields; track field.key) {
                    <div class="flex items-center gap-2 rounded-lg p-2 nm-raised-sm">
                      <lucide-icon [img]="ArrowIcon" [size]="16" class="text-primary" />
                      <span class="font-body text-body-sm text-on-surface">{{ fieldLabel(field.key) }}</span>
                    </div>
                  }
                </div>
              </div>
            </div>
            <p class="mt-5 font-label text-label-md text-secondary">{{ salesforce.privacyNote }}</p>
          </div>

          <button
            type="button"
            class="nm-button mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-primary-container px-5 py-2.5 font-display text-label-lg font-semibold text-on-primary"
            (click)="connect()"
          >
            <lucide-icon [img]="PlugIcon" [size]="18" />
            Connect Salesforce (sandbox)
          </button>
        </section>
      }

      @if (connState() === 'connecting') {
        <section class="mx-auto mt-6 max-w-3xl rounded-xl p-5 nm-raised" @stepTransition>
          <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Connection in progress</p>
          <div class="mt-5 space-y-4">
            @for (step of progressSteps; track step; let index = $index) {
              <div class="flex items-center gap-3">
                <span
                  class="flex h-9 w-9 items-center justify-center rounded-full"
                  [class.bg-primary]="progressStep() > index"
                  [class.text-on-primary]="progressStep() > index"
                  [class.nm-inset]="progressStep() <= index"
                >
                  @if (progressStep() > index) {
                    <lucide-icon [@checkmarkPop]="'done'" [img]="CheckIcon" [size]="16" />
                  }
                </span>
                <span class="font-body text-body-md text-on-surface">{{ step }}</span>
              </div>
            }
          </div>
        </section>
      }

      @if (connState() === 'connected') {
        <section class="mt-6 space-y-6" @fadeSlideUp>
          <div class="grid gap-5 lg:grid-cols-3">
            <article class="rounded-xl p-5 nm-raised">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Records synced</p>
                  <p class="mt-2 font-mono text-headline-md text-primary">47</p>
                </div>
                <span class="flex h-10 w-10 items-center justify-center rounded-lg text-primary nm-inset">
                  <lucide-icon [img]="DatabaseIcon" [size]="18" />
                </span>
              </div>
              <div class="mt-4 flex h-14 items-end gap-1 rounded-lg px-3 py-2 nm-inset">
                @for (bar of recordSparkline; track $index) {
                  <span class="flex-1 rounded-sm bg-primary" [style.height.%]="bar"></span>
                }
              </div>
            </article>

            <article class="rounded-xl p-5 nm-raised">
              <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Onboarding success</p>
              <div class="mt-2 flex items-end justify-between gap-4">
                <p class="font-mono text-headline-md text-primary">84%</p>
                <span class="rounded-full bg-secondary-container px-2.5 py-1 font-mono text-label-sm text-on-secondary-container">+2.4% vs last sync</span>
              </div>
              <svg class="mt-4 h-14 w-full text-primary" viewBox="0 0 160 56" aria-hidden="true">
                <polyline
                  [attr.points]="onboardingSparklinePoints"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <line x1="0" y1="46" x2="160" y2="46" class="stroke-surface-dim" stroke-width="2" />
              </svg>
            </article>

            <article class="rounded-xl p-5 nm-raised">
              <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Risk updates</p>
              <div class="mt-2 flex items-end justify-between gap-4">
                <p class="font-mono text-headline-md text-error">3</p>
                <span class="rounded-full bg-error-container px-2.5 py-1 font-mono text-label-sm text-on-error-container">warning</span>
              </div>
              <div class="mt-4 grid grid-cols-3 gap-2 rounded-lg p-2 nm-inset">
                @for (item of riskMiniBars; track item.label) {
                  <div class="flex h-20 flex-col justify-end rounded-md bg-surface-container-low p-2">
                    <div class="min-h-2 rounded-t-sm" [class]="item.className" [style.height.%]="item.height"></div>
                    <p class="mt-2 text-center font-mono text-label-sm text-secondary">{{ item.label }}</p>
                  </div>
                }
              </div>
            </article>
          </div>

          <div class="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)]">
            <article class="rounded-xl p-5 nm-inset">
              <div class="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Synced cohort</p>
                  <h2 class="mt-2 font-display text-headline-sm text-on-surface">Workforce trajectory &mdash; 90 days</h2>
                </div>
                <div class="flex flex-wrap gap-3 font-label text-label-md text-secondary">
                  <span class="inline-flex items-center gap-2"><span class="h-2 w-5 rounded-full bg-on-secondary-fixed"></span>Actual performance</span>
                  <span class="inline-flex items-center gap-2"><span class="h-0.5 w-5 border-t-2 border-dashed border-outline"></span>Projected baseline</span>
                </div>
              </div>
              <svg #trajectoryChart class="mt-4 h-80 w-full" aria-label="Aggregate performance trend for the synced cohort"></svg>
            </article>

            <article class="rounded-xl p-5 nm-raised">
              <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Flight risk distribution</p>
              <h2 class="mt-2 font-display text-headline-sm text-on-surface">47 synced employees</h2>
              <div class="mt-6 space-y-5">
                @for (risk of flightRiskBreakdown; track risk.label) {
                  <div>
                    <div class="flex items-center justify-between gap-3">
                      <div class="inline-flex items-center gap-2">
                        <span class="h-2.5 w-2.5 rounded-full" [class]="risk.dotClass"></span>
                        <span class="font-body text-body-sm font-semibold text-on-surface">{{ risk.label }}</span>
                      </div>
                      <span class="font-mono text-label-md text-secondary">{{ risk.count }} employees</span>
                    </div>
                    <div class="mt-2 h-3 rounded-full bg-surface-container-high nm-inset">
                      <div class="h-3 rounded-full" [class]="risk.barClass" [style.width.%]="risk.percent"></div>
                    </div>
                  </div>
                }
              </div>
              <p class="mt-6 font-body text-body-sm text-secondary">Risk bands are recalculated from onboarding milestone velocity, manager-free performance outcomes, and tenure-adjusted cohort movement.</p>
            </article>
          </div>

          <div class="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
            <app-engine-card
              className="h-full"
              eyebrow="Trajectory engine update"
              title="Onboarding risk recalculated"
              [body]="salesforce.effectLine"
              basis="Based on 214 comparable hires and first-90-day outcomes"
            >
              <div class="mt-4 flex flex-wrap items-center gap-4">
                <span class="relative inline-flex font-mono text-headline-md text-secondary">
                  72
                  <span id="strike-line" class="absolute left-0 top-1/2 h-0.5 w-0 bg-primary"></span>
                </span>
                <span class="font-mono text-headline-sm text-secondary">-&gt;</span>
                <span id="new-score" class="font-mono text-headline-md text-on-surface">{{ newScore() }}</span>
                <ng-lottie
                  [options]="scoreDropOptions"
                  width="72px"
                  height="64px"
                  (animationCreated)="onScoreAnimation($event)"
                />
              </div>
            </app-engine-card>

            <article class="rounded-xl p-5 nm-raised">
              <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Recent updates</p>
              <h2 class="mt-2 font-display text-headline-sm text-on-surface">Synced signal feed</h2>
              <div class="mt-5 space-y-3">
                @for (update of recentUpdates; track update.name) {
                  <div class="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg p-3 nm-inset">
                    <span class="h-2.5 w-2.5 rounded-full" [class]="update.dotClass"></span>
                    <div class="min-w-0">
                      <p class="truncate font-body text-body-sm font-semibold text-on-surface">{{ update.name }}</p>
                      <p class="font-label text-label-md text-secondary">{{ update.detail }}</p>
                    </div>
                    <span class="font-mono text-label-sm text-secondary">{{ update.time }}</span>
                  </div>
                }
              </div>
            </article>
          </div>

          @if (showPortfolio()) {
            <article class="rounded-xl p-5 nm-raised" @fadeSlideUp>
              <div class="flex items-center gap-3">
                <span class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-container text-on-primary">
                  <lucide-icon [img]="ShieldIcon" [size]="20" />
                </span>
                <div>
                  <p class="font-display text-headline-sm text-on-surface">Living portfolio updated</p>
                  <p class="font-label text-label-md text-secondary">Hafiz outcomes now strengthen the Senior Logistics Coordinator fingerprint.</p>
                </div>
              </div>
              <div class="mt-5 space-y-3">
                @for (skill of salesforce.updatedSkills; track skill.name) {
                  <div class="flex items-center gap-3 rounded-lg p-3 nm-inset">
                    <app-evidence-indicator [state]="verifiedState" />
                    <span class="font-body text-body-sm font-semibold text-on-surface">{{ skill.name }}</span>
                    <span class="ml-auto font-label text-label-md text-secondary">verified</span>
                  </div>
                }
              </div>
            </article>
          }

          <a routerLink="/employer/dashboard" class="nm-raised inline-flex rounded-lg px-5 py-2.5 font-display text-label-lg font-semibold text-primary">
            Back to dashboard
          </a>
        </section>
      }
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesforceComponent implements AfterViewInit, OnDestroy {
  @ViewChild('trajectoryChart') private readonly trajectoryChart?: ElementRef<SVGSVGElement>

  protected readonly mock = inject(MockDataService)
  protected readonly state = inject(AppStateService)
  protected readonly salesforce = this.mock.salesforce
  protected readonly ArrowIcon = ArrowRight
  protected readonly CheckIcon = Check
  protected readonly DatabaseIcon = Database
  protected readonly LockIcon = Lock
  protected readonly PlugIcon = PlugZap
  protected readonly ShieldIcon = ShieldCheck
  protected readonly verifiedState = 'verified' as const
  protected readonly connState = this.state.salesforceStatus
  protected readonly progressStep = signal(0)
  protected readonly newScore = signal(72)
  protected readonly showPortfolio = signal(false)
  protected readonly progressSteps = ['Authorize sandbox access', 'Map anonymised Tier 2 fields', 'Receive first outcome record']
  protected readonly recordSparkline = [34, 48, 42, 65, 58, 76, 71, 88, 100]
  protected readonly onboardingSparklinePoints = '0,42 18,37 36,38 54,31 72,28 90,23 108,25 126,18 144,15 160,12'
  protected readonly riskMiniBars = [
    { label: 'L', height: 72, className: 'bg-green-500' },
    { label: 'M', height: 42, className: 'bg-primary/60' },
    { label: 'H', height: 24, className: 'bg-error' },
  ]
  protected readonly flightRiskBreakdown = [
    { label: 'Low', count: 38, percent: 81, dotClass: 'bg-green-500', barClass: 'bg-green-500' },
    { label: 'Moderate', count: 7, percent: 15, dotClass: 'bg-primary/60', barClass: 'bg-primary/60' },
    { label: 'High', count: 2, percent: 4, dotClass: 'bg-error', barClass: 'bg-error' },
  ]
  protected readonly recentUpdates = [
    { name: 'Hafiz Rahman', detail: 'main outcome record recalculated', time: '11:42', dotClass: 'bg-primary' },
    { name: 'Siti Aisyah', detail: 'performance quartile updated', time: '11:43', dotClass: 'bg-primary/60' },
    { name: 'Raj Kumar', detail: 'onboarding milestone 4 of 4 hit', time: '11:44', dotClass: 'bg-green-500' },
  ]
  protected readonly scoreDropOptions: AnimationOptions = {
    path: '/assets/lottie/score-drop.json',
    loop: false,
    autoplay: false,
  }
  private readonly workforceTrajectory: WorkforceTrajectoryPoint[] = [
    { month: 'Apr', actual: 61, baseline: 58 },
    { month: 'May', actual: 64, baseline: 61 },
    { month: 'Jun', actual: 67, baseline: 64 },
    { month: 'Jul', actual: 73, baseline: 66 },
    { month: 'Aug', actual: 76, baseline: 69 },
    { month: 'Sep', actual: 82, baseline: 72 },
  ]
  private readonly timers: ReturnType<typeof setTimeout>[] = []
  private scoreAnimation?: AnimationItem

  connect() {
    this.state.setSalesforceStatus('connecting')
    this.progressStep.set(0)
    this.queue(() => this.progressStep.set(1), 700)
    this.queue(() => this.progressStep.set(2), 1400)
    this.queue(() => this.progressStep.set(3), 2100)
    this.queue(() => {
      this.state.setSalesforceStatus('connected')
      this.newScore.set(72)
      this.showPortfolio.set(false)
      this.queue(() => {
        this.drawTrajectoryChart()
        this.triggerScoreUpdate()
      }, 0)
    }, 2600)
  }

  ngAfterViewInit() {
    if (this.connState() !== 'connected') return
    this.newScore.set(61)
    this.showPortfolio.set(true)
    this.queue(() => this.drawTrajectoryChart(), 0)
  }

  onScoreAnimation(animation: AnimationItem) {
    this.scoreAnimation = animation
    animation.stop()
  }

  ngOnDestroy() {
    this.timers.forEach((timer) => clearTimeout(timer))
  }

  protected fieldLabel(key: string): string {
    return key.replaceAll('_', ' ')
  }

  private queue(callback: () => void, delay: number) {
    this.timers.push(setTimeout(callback, delay))
  }

  private drawTrajectoryChart(attempt = 0) {
    const chart = this.trajectoryChart?.nativeElement
    if (!chart || chart.clientWidth === 0) {
      if (attempt < 6) this.queue(() => this.drawTrajectoryChart(attempt + 1), 50)
      return
    }

    const width = chart.clientWidth || 760
    const height = 320
    const margin = { top: 18, right: 24, bottom: 38, left: 44 }
    const colors = {
      navy: '#121c2a',
      secondary: '#916f6e',
      surfaceDim: '#d8dade',
      surfaceHigh: '#e6e8ec',
      secondaryContainer: '#d6e0f3',
    }

    const svg = d3.select(chart)
    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${width} ${height}`).attr('preserveAspectRatio', 'xMidYMid meet')
    const clipId = 'salesforce-trajectory-reveal'

    const x = d3
      .scalePoint<string>()
      .domain(this.workforceTrajectory.map((point) => point.month))
      .range([margin.left, width - margin.right])
      .padding(0.35)
    const y = d3.scaleLinear().domain([50, 88]).nice().range([height - margin.bottom, margin.top])

    const actualLine = d3
      .line<WorkforceTrajectoryPoint>()
      .x((point) => x(point.month) ?? margin.left)
      .y((point) => y(point.actual))
      .curve(d3.curveMonotoneX)
    const baselineLine = d3
      .line<WorkforceTrajectoryPoint>()
      .x((point) => x(point.month) ?? margin.left)
      .y((point) => y(point.baseline))
      .curve(d3.curveMonotoneX)
    const actualArea = d3
      .area<WorkforceTrajectoryPoint>()
      .x((point) => x(point.month) ?? margin.left)
      .y0(height - margin.bottom)
      .y1((point) => y(point.actual))
      .curve(d3.curveMonotoneX)

    svg
      .append('defs')
      .append('clipPath')
      .attr('id', clipId)
      .append('rect')
      .attr('x', margin.left)
      .attr('y', margin.top)
      .attr('width', 0)
      .attr('height', height - margin.top - margin.bottom)

    const grid = svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(4).tickSize(-(width - margin.left - margin.right)).tickFormat(() => ''))
    grid.select('.domain').remove()
    grid.selectAll('line').attr('stroke', colors.surfaceHigh).attr('stroke-width', 1)

    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSize(0))
      .call((group) => group.select('.domain').attr('stroke', colors.surfaceDim))
      .call((group) => group.selectAll('text').attr('fill', '#555f6f').attr('font-size', 11).attr('font-family', 'JetBrains Mono'))

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(4).tickSize(0))
      .call((group) => group.select('.domain').remove())
      .call((group) => group.selectAll('text').attr('fill', '#555f6f').attr('font-size', 11).attr('font-family', 'JetBrains Mono'))

    const plot = svg.append('g').attr('clip-path', `url(#${clipId})`)

    plot
      .append('path')
      .datum(this.workforceTrajectory)
      .attr('fill', colors.secondaryContainer)
      .attr('opacity', 0)
      .attr('d', actualArea)
      .transition()
      .duration(500)
      .attr('opacity', 0.5)

    plot
      .append('path')
      .datum(this.workforceTrajectory)
      .attr('fill', 'none')
      .attr('stroke', colors.secondary)
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', '7 6')
      .attr('stroke-linecap', 'round')
      .attr('d', baselineLine)

    plot
      .append('path')
      .datum(this.workforceTrajectory)
      .attr('fill', 'none')
      .attr('stroke', colors.navy)
      .attr('stroke-width', 4)
      .attr('stroke-linecap', 'round')
      .attr('d', actualLine)

    svg
      .select<SVGRectElement>(`#${clipId} rect`)
      .transition()
      .duration(900)
      .ease(d3.easeCubicOut)
      .attr('width', width - margin.left - margin.right)
  }

  private triggerScoreUpdate() {
    const score = { value: 72 }
    gsap.set('#strike-line', { width: '0%' })
    gsap.set('#new-score', { color: '#191c1f' })
    gsap
      .timeline()
      .to('#strike-line', { width: '100%', duration: 0.3, ease: 'power2.out' })
      .to({}, { duration: 0.2 })
      .add(() => this.scoreAnimation?.goToAndPlay(0, true))
      .to(score, {
        value: 61,
        duration: 0.9,
        ease: 'none',
        onUpdate: () => this.newScore.set(Math.round(score.value)),
      })
      .to('#new-score', { color: '#d8113a', duration: 0.2 })
      .add(() => this.queue(() => this.showPortfolio.set(true), 300))
  }
}
