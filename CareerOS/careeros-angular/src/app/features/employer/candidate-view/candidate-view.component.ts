import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild, computed, inject, signal } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import * as d3 from 'd3'
import gsap from 'gsap'
import { ArrowLeft, Download, LucideAngularModule } from 'lucide-angular'
import { listStagger } from '../../../core/animations/entrance.animations'
import { TrajectoryPoint } from '../../../core/models/types'
import { AppStateService } from '../../../core/services/app-state.service'
import { MockDataService } from '../../../core/services/mock-data.service'
import { EngineCardComponent } from '../../../shared/components/engine-card/engine-card.component'
import { EvidenceIndicatorComponent } from '../../../shared/components/evidence-indicator/evidence-indicator.component'
import { MetricBlockComponent } from '../../../shared/components/metric-block/metric-block.component'
import { RiskDotComponent } from '../../../shared/components/risk-dot/risk-dot.component'
import { SkillSegmentBarsComponent } from '../../../shared/components/skill-segment-bars/skill-segment-bars.component'

@Component({
  selector: 'app-candidate-view',
  standalone: true,
  imports: [
    RouterLink,
    LucideAngularModule,
    EngineCardComponent,
    EvidenceIndicatorComponent,
    MetricBlockComponent,
    RiskDotComponent,
    SkillSegmentBarsComponent,
  ],
  animations: [listStagger],
  template: `
    <main class="mx-auto max-w-content px-6 py-8 lg:px-8">
      <a routerLink="/employer/dashboard" class="inline-flex items-center gap-2 font-label text-label-lg font-semibold text-primary">
        <lucide-icon [img]="BackIcon" [size]="18" />
        Pipeline
      </a>

      @if (candidate(); as profile) {
      <section class="mt-5 rounded-xl p-6 nm-raised">
        <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex items-center gap-4">
            <div
              class="flex h-14 w-14 items-center justify-center rounded-full font-mono text-body-md font-semibold text-on-surface nm-raised-sm"
              style="background:#d6e0f3"
              [style.view-transition-name]="profile.id === 'cand-001' ? 'candidate-avatar' : null"
            >
              {{ initials() }}
            </div>
            <div>
              <h1 class="font-display text-headline-md text-on-surface">{{ profile.name }}</h1>
              <p class="font-body text-body-md text-primary">{{ profile.headline }}</p>
              <p class="font-label text-label-md text-secondary">{{ profile.location }}</p>
            </div>
          </div>
          <button
            type="button"
            class="nm-raised inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 font-display text-label-lg font-semibold text-primary"
            (click)="cvPrepared.set(true)"
          >
            <lucide-icon [img]="DownloadIcon" [size]="18" />
            {{ cvPrepared() ? 'CV prepared' : 'Download CV' }}
          </button>
        </div>
      </section>

      <section class="mt-6 grid gap-6 lg:grid-cols-12">
        <aside class="space-y-5 lg:col-span-5">
          <section class="rounded-xl p-5 nm-raised">
            <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Verified competency profile</p>
            <h2 class="mt-2 font-display text-headline-sm text-on-surface">Shared evidence profile</h2>
            <p class="mt-2 font-label text-label-md text-secondary">Evidence states are shared between candidate and employer views.</p>
            <div class="mt-5 space-y-3" [@listStagger]="candidateSkills().length">
              @for (skill of candidateSkills(); track skill.id) {
                <div class="flex items-center gap-3 rounded-lg p-3 nm-inset">
                  <app-evidence-indicator [state]="skill.state" />
                  <div class="min-w-0 flex-1">
                    <p class="font-body text-body-sm font-semibold text-on-surface">{{ skill.name }}</p>
                    <p class="truncate font-label text-label-md text-secondary">{{ skill.source }}</p>
                  </div>
                  <app-skill-segment-bars [state]="skill.state" />
                </div>
              }
            </div>
          </section>

          <section class="rounded-xl p-5 nm-raised">
            <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Evidence legend</p>
            <div class="mt-4 grid gap-3">
              @for (item of legend; track item.label) {
                <div class="flex items-center gap-3">
                  <app-evidence-indicator [state]="item.state" />
                  <span class="font-label text-label-md text-secondary">{{ item.label }}</span>
                </div>
              }
            </div>
          </section>
        </aside>

        <div class="space-y-6 lg:col-span-7">
          <app-engine-card
            title="Match analysis"
            [body]="matchAnalysisBody()"
            [basis]="matchAnalysisBasis()"
          />

          <section class="rounded-xl p-5 nm-inset">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Growth trajectory</p>
                <h2 class="mt-2 font-display text-headline-sm text-on-surface">Months in role vs performance index</h2>
              </div>
              <span class="nm-raised-sm rounded-full px-2.5 py-0.5 font-label text-label-sm text-secondary">Employer relabel</span>
            </div>
            <svg #chartEl class="mt-4 h-72 w-full"></svg>
          </section>

          <div class="grid gap-5 md:grid-cols-2">
            <app-metric-block label="Trajectory match" transitionName="candidate-match">
              <span class="font-mono text-headline-lg text-primary">{{ matchScore() }}</span>
            </app-metric-block>
            <section class="rounded-xl p-5 nm-raised">
              <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Onboarding risk</p>
              <div class="mt-3">
                <app-risk-dot level="low" label="Low" />
              </div>
              <p class="mt-3 font-body text-body-sm text-secondary">Verified WMS and ownership signals reduce first-60-day ramp risk.</p>
            </section>
          </div>

          <section class="rounded-xl p-5 nm-raised">
            <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">{{ mock.onboardingMilestones.eyebrow }}</p>
            <h2 class="mt-2 font-display text-headline-sm text-on-surface">{{ mock.onboardingMilestones.title }}</h2>
            <div class="mt-5 grid gap-4 md:grid-cols-3" [@listStagger]="mock.onboardingMilestones.cards.length">
              @for (card of mock.onboardingMilestones.cards; track card.period) {
                <article class="milestone-card rounded-xl p-4 nm-raised">
                  <div class="mb-3 flex items-center gap-2">
                    <span class="h-2 w-2 rounded-full" [class]="milestoneDotClass(card.level)"></span>
                    <span class="font-label text-label-sm text-secondary">{{ card.level }}</span>
                  </div>
                  <p class="font-body text-body-sm font-semibold text-on-surface">{{ card.period }}</p>
                  <p class="mt-2 font-body text-body-sm text-secondary">{{ card.note }}</p>
                </article>
              }
            </div>
          </section>
        </div>
      </section>
      } @else {
        <section class="mt-5 rounded-xl p-6 nm-raised">
          <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Candidate record</p>
          <h1 class="mt-2 font-display text-headline-md text-on-surface">Candidate not found</h1>
          <p class="mt-2 max-w-xl font-body text-body-md text-secondary">This pipeline record is no longer available in the demo dataset.</p>
          <a routerLink="/employer/dashboard" class="nm-button mt-5 inline-flex rounded-lg bg-primary-container px-5 py-2.5 font-display text-label-lg font-semibold text-on-primary">
            Return to dashboard
          </a>
        </section>
      }
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidateViewComponent implements AfterViewInit {
  @ViewChild('chartEl') private readonly chartEl?: ElementRef<SVGSVGElement>
  protected readonly state = inject(AppStateService)
  protected readonly mock = inject(MockDataService)
  private readonly route = inject(ActivatedRoute)
  protected readonly BackIcon = ArrowLeft
  protected readonly DownloadIcon = Download
  protected readonly cvPrepared = signal(false)
  protected readonly candidate = computed(() => {
    const id = this.route.snapshot.paramMap.get('id') ?? 'cand-001'
    return this.mock.employerCandidateById(id)
  })
  protected readonly candidateSkills = computed(() => {
    const profile = this.candidate()
    if (!profile) return []
    return profile.id === 'cand-001' ? this.state.skills() : (profile.skills ?? [])
  })
  protected readonly matchScore = computed(() => {
    const id = this.candidate()?.id
    return this.mock.pipeline.find((row) => row.candidateId === id)?.match ?? this.mock.jobs.find((job) => job.id === 'job-001')?.match ?? 0
  })
  protected readonly selectedPipelineRow = computed(() => {
    const id = this.candidate()?.id
    return this.mock.pipeline.find((row) => row.candidateId === id)
  })
  protected readonly matchAnalysisBody = computed(() => {
    const profile = this.candidate()
    if (!profile || profile.id === 'cand-001') return this.mock.matchAnalysis.gapNote
    const row = this.selectedPipelineRow()
    return `${profile.name} is being evaluated for ${row?.role ?? profile.headline}. This view uses the selected pipeline record's stage, role path, and verified skill evidence instead of the primary candidate's portfolio narrative.`
  })
  protected readonly matchAnalysisBasis = computed(() => {
    const profile = this.candidate()
    if (!profile || profile.id === 'cand-001') return this.mock.matchAnalysis.gapNoteBasis
    const row = this.selectedPipelineRow()
    return `${row?.stage ?? 'Pipeline'} stage - ${row?.flightRisk.label ?? 'stable'} flight-risk band - ${this.matchScore()} trajectory match`
  })
  protected readonly legend = [
    { label: 'Asserted claim', state: 'asserted' as const },
    { label: 'Evidence-linked', state: 'evidence' as const },
    { label: 'Employer verified', state: 'verified' as const },
  ]

  ngAfterViewInit() {
    Promise.resolve().then(() => {
      this.drawChart()
      gsap.from('.milestone-card', { opacity: 0, y: 10, duration: 0.25, stagger: 0.05, ease: 'power1.out', delay: 0.15 })
    })
  }

  protected initials(): string {
    return (this.candidate()?.name ?? '')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
  }

  protected milestoneDotClass(level: string): string {
    return level === 'moderate' ? 'bg-primary/60' : 'bg-green-500'
  }

  private drawChart() {
    if (!this.chartEl) return
    const width = this.chartEl.nativeElement.clientWidth || 640
    const height = 280
    const margin = { top: 16, right: 24, bottom: 42, left: 44 }
    const svg = d3.select(this.chartEl.nativeElement)
    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${width} ${height}`)

    const x = d3.scaleLinear().domain([0, 48]).range([margin.left, width - margin.right])
    const y = d3.scaleLinear().domain([20, 90]).range([height - margin.bottom, margin.top])
    const line = d3.line<TrajectoryPoint>().x((point) => x(point.m)).y((point) => y(point.v)).curve(d3.curveMonotoneX)

    svg.append('g').attr('transform', `translate(0,${height - margin.bottom})`).call(d3.axisBottom(x).ticks(6)).attr('color', '#555f6f')
    svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y).ticks(5)).attr('color', '#555f6f')
    svg.append('text').attr('x', width / 2).attr('y', height - 6).attr('text-anchor', 'middle').attr('class', 'font-label text-label-sm').attr('fill', '#555f6f').text('Months in role')
    svg.append('text').attr('transform', 'rotate(-90)').attr('x', -height / 2).attr('y', 13).attr('text-anchor', 'middle').attr('class', 'font-label text-label-sm').attr('fill', '#555f6f').text('Performance index')
    this.addPath(svg, this.mock.trajectory.actual, line, '#121c2a', '4 0')
    this.addPath(svg, this.mock.trajectory.cohortAverage, line, '#916f6e', '4 4')
    this.addPath(svg, this.mock.trajectoryScenarios[1].projection, line, '#d8113a', '6 5')
  }

  private addPath(
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    data: TrajectoryPoint[],
    line: d3.Line<TrajectoryPoint>,
    color: string,
    dash: string,
  ) {
    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', dash)
      .attr('d', line)
  }
}
