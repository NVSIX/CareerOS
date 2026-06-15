import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { BadgeCheck, Check, FileCheck, LucideAngularModule, Plus } from 'lucide-angular'
import * as d3 from 'd3'
import { gsap } from 'gsap'
import { fadeSlideUp, listStagger, tabCrossfade } from '../../../core/animations/entrance.animations'
import { ScenarioId, Skill, SkillState, TrajectoryPoint } from '../../../core/models/types'
import { AppStateService } from '../../../core/services/app-state.service'
import { MockDataService } from '../../../core/services/mock-data.service'
import { BadgeComponent } from '../../../shared/components/badge/badge.component'
import { CoachingCardComponent } from '../../../shared/components/coaching-card/coaching-card.component'
import { DataCardComponent } from '../../../shared/components/data-card/data-card.component'
import { SkillSegmentBarsComponent } from '../../../shared/components/skill-segment-bars/skill-segment-bars.component'

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    RouterLink,
    LucideAngularModule,
    BadgeComponent,
    CoachingCardComponent,
    DataCardComponent,
    SkillSegmentBarsComponent,
  ],
  animations: [tabCrossfade, fadeSlideUp, listStagger],
  template: `
    <main class="mx-auto max-w-content px-6 py-10">
      <section class="nm-raised rounded-xl p-6">
        <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex items-center gap-4">
            <div class="flex h-14 w-14 items-center justify-center rounded-full font-mono text-body-md font-semibold text-on-surface nm-raised-sm" style="background:#d6e0f3; view-transition-name: candidate-avatar">
              {{ initials() }}
            </div>
            <div>
              <h1 class="font-display text-headline-md text-on-surface">{{ state.candidate().name }}</h1>
              <p class="font-body text-body-md text-primary">{{ state.candidate().headline }}</p>
              <p class="font-label text-label-md text-secondary">{{ state.candidate().location }} · {{ state.candidate().email }}</p>
            </div>
          </div>
          <div class="flex flex-wrap gap-3">
            <button type="button" class="nm-button rounded-lg bg-primary-container px-5 py-2.5 font-display text-label-lg font-semibold text-on-primary" (click)="showConnectDialog.set(true)">Connect</button>
            <button type="button" class="nm-raised rounded-lg px-5 py-2.5 font-display text-label-lg font-semibold text-primary" (click)="cvPrepared.set(true)">
              {{ cvPrepared() ? 'CV prepared' : 'Download CV' }}
            </button>
            <a routerLink="/candidate/skills" class="nm-raised rounded-lg px-5 py-2.5 font-display text-label-lg font-semibold text-primary">View skill map</a>
          </div>
        </div>
        @if (cvPrepared()) {
          <p class="mt-4 font-label text-label-md text-secondary">A shareable CV export has been prepared from the living portfolio.</p>
        }
      </section>

      <div class="mt-6 flex gap-2">
        <button type="button" class="rounded-lg px-5 py-2.5 font-display text-label-lg font-semibold transition-all" [class.nm-pressed]="activeTab() === 'portfolio'" [class.text-primary]="activeTab() === 'portfolio'" (click)="activeTab.set('portfolio')">Portfolio</button>
        <button type="button" class="rounded-lg px-5 py-2.5 font-display text-label-lg font-semibold transition-all" [class.nm-pressed]="activeTab() === 'edit'" [class.text-primary]="activeTab() === 'edit'" (click)="activeTab.set('edit')">Edit profile</button>
      </div>

      @if (activeTab() === 'portfolio') {
        <section class="mt-6 grid gap-6 lg:grid-cols-12" @tabCrossfade>
          <div class="space-y-6 lg:col-span-5">
            <app-data-card eyebrow="Living portfolio" title="High-density view">
              <div class="space-y-3">
                @for (skill of state.skills(); track skill.id) {
                  <div class="rounded-lg p-3 nm-raised-sm">
                    <div class="flex items-center gap-3">
                      <span class="nm-inset flex h-9 w-9 items-center justify-center rounded-lg text-primary">
                        <lucide-icon [img]="skill.state === 'verified' ? BadgeIcon : FileIcon" [size]="18" />
                      </span>
                      <div class="min-w-0 flex-1">
                        <div class="flex flex-wrap items-center gap-2">
                          <p class="font-body text-body-sm font-semibold text-on-surface">{{ skill.name }}</p>
                          @if (isTriangulated(skill.id)) {
                            <span class="triangulated-badge rounded-full bg-primary-container px-2.5 py-0.5 font-label text-label-sm text-on-primary">Triangulated</span>
                          }
                        </div>
                        <p class="truncate font-label text-label-md text-secondary">{{ skill.source }}</p>
                      </div>
                      <app-skill-segment-bars [state]="skill.state" />
                    </div>
                    @if (skillProvenance(skill.id).length) {
                      <div class="mt-3 flex flex-wrap gap-2">
                        @for (source of skillProvenance(skill.id).slice(0, 3); track source) {
                          <span class="provenance-chip rounded-full px-2.5 py-1 font-label text-label-sm text-secondary nm-inset">{{ source }}</span>
                        }
                      </div>
                    }
                  </div>
                }
              </div>
            </app-data-card>

            <a routerLink="/candidate/skills" class="block rounded-xl p-5 nm-raised">
              <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Verification Map</p>
              <div class="mt-4 h-28 rounded-xl skill-tree-canvas nm-inset"></div>
              <p class="mt-3 font-label text-label-md text-primary">Open full skill map</p>
            </a>
          </div>

          <div class="space-y-6 lg:col-span-7">
            <section class="rounded-xl p-5 nm-inset">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Growth Trajectory</p>
                  <h2 class="mt-2 font-display text-headline-sm font-semibold text-on-surface">{{ selectedScenario().label }}</h2>
                </div>
                <app-badge variant="primary">{{ selectedScenario().tag }}</app-badge>
              </div>
              <svg #chartEl class="mt-4 h-72 w-full"></svg>
              <p class="mt-4 font-body text-body-sm text-secondary">{{ selectedScenario().insight }}</p>
              <p class="mt-2 font-mono text-label-md text-secondary">{{ selectedScenario().basis }}</p>
            </section>

            <div class="grid gap-4 md:grid-cols-3">
              @for (scenario of mock.trajectoryScenarios; track scenario.id) {
                <button type="button" class="rounded-xl p-4 text-left transition-all nm-raised" [class.nm-pressed]="state.selectedScenario() === scenario.id" [class.ring-1]="state.selectedScenario() === scenario.id" [class.ring-primary]="state.selectedScenario() === scenario.id" (click)="selectScenario(scenario.id)">
                  <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">{{ scenario.tag }}</p>
                  <p class="mt-2 font-body text-body-sm font-semibold text-on-surface">{{ scenario.label }}</p>
                  <span class="mt-3 inline-flex rounded-full px-2.5 py-0.5 font-label text-label-sm" [class.bg-primary-container]="state.selectedScenario() === scenario.id" [class.text-on-primary]="state.selectedScenario() === scenario.id" [class.nm-raised-sm]="state.selectedScenario() !== scenario.id" [class.text-secondary]="state.selectedScenario() !== scenario.id">{{ state.selectedScenario() === scenario.id ? 'ACTIVE' : 'PLANNED' }}</span>
                </button>
              }
            </div>

            <app-coaching-card [body]="mock.coaching.body" [dataBasis]="mock.coaching.dataBasis" />

            <app-data-card title="Evidence timeline">
              <div class="space-y-3" [@listStagger]="achievements.length">
                @for (achievement of achievements; track achievement.eventName) {
                  <div class="rounded-xl p-4 nm-raised-sm">
                    <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 class="font-body text-body-sm font-semibold text-on-surface">{{ achievement.eventName }}</h3>
                        <p class="mt-1 font-mono text-label-md text-primary">{{ achievement.placement }} of {{ achievement.fieldSize.toLocaleString() }} participants</p>
                      </div>
                      <span class="inline-flex items-center gap-1.5 rounded-full bg-primary-container px-2.5 py-1 font-label text-label-sm text-on-primary">
                        <lucide-icon [img]="CheckIcon" [size]="13" />
                        Verified by {{ achievement.verifiedBy }}
                      </span>
                    </div>
                    <div class="mt-3 flex flex-wrap gap-2">
                      @for (tag of achievement.rubricTags; track tag) {
                        <span class="rounded-full px-2.5 py-1 font-label text-label-sm text-secondary nm-inset">{{ tag }}</span>
                      }
                    </div>
                    <p class="mt-3 font-body text-body-sm text-secondary">{{ achievement.cohortNote }}</p>
                  </div>
                }
              </div>

              <div class="mt-5 border-t border-outline-variant pt-4">
                <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Latest evidence activity</p>
                <div class="mt-3 space-y-3" [@listStagger]="evidenceTokens.length">
                  @for (token of evidenceTokens; track token.time) {
                    <div class="rounded-lg bg-surface-container-low p-3 nm-inset">
                      <p class="font-mono text-label-md text-primary">{{ token.time }}</p>
                      <p class="font-body text-body-sm text-on-surface">{{ token.text }}</p>
                      <app-badge>{{ token.category }}</app-badge>
                    </div>
                  }
                </div>
              </div>
              <a routerLink="/program/join" class="mt-4 inline-flex font-display text-label-lg font-semibold text-primary">How are these verified?</a>
            </app-data-card>
          </div>
        </section>
      } @else {
        <section class="mt-6 grid items-start gap-6 lg:grid-cols-[360px_minmax(0,1fr)]" @tabCrossfade>
          <aside class="rounded-xl p-6 nm-raised">
            <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Profile basics</p>
            <h2 class="mt-2 font-display text-headline-sm text-on-surface">Identity and positioning</h2>
            <p class="mt-2 font-body text-body-sm text-secondary">Keep this compact: the living portfolio does the heavy lifting, while these fields anchor the candidate record.</p>
            <div class="mt-5 space-y-4">
              <label class="block">
                <span class="font-label text-label-md text-secondary">Name</span>
                <input class="mt-2 w-full rounded-lg bg-transparent px-4 py-3 font-body text-body-md text-on-surface outline-none nm-inset" [value]="editName()" (input)="editName.set(inputValue($event))" />
              </label>
              <label class="block">
                <span class="font-label text-label-md text-secondary">Headline</span>
                <input class="mt-2 w-full rounded-lg bg-transparent px-4 py-3 font-body text-body-md text-on-surface outline-none nm-inset" [value]="editHeadline()" (input)="editHeadline.set(inputValue($event))" />
              </label>
              <label class="block">
                <span class="font-label text-label-md text-secondary">Location</span>
                <input class="mt-2 w-full rounded-lg bg-transparent px-4 py-3 font-body text-body-md text-on-surface outline-none nm-inset" [value]="editLocation()" (input)="editLocation.set(inputValue($event))" />
              </label>
            </div>
          </aside>

          <section class="rounded-xl p-6 nm-raised">
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Evidence model</p>
                <h2 class="mt-2 font-display text-headline-sm text-on-surface">Skill claims and verification state</h2>
              </div>
              <span class="rounded-full px-3 py-1 font-mono text-label-sm text-secondary nm-inset">{{ editSkills().length }} skills</span>
            </div>

            <div class="mt-5 max-h-[520px] space-y-3 overflow-y-auto pr-1">
              @for (skill of editSkills(); track skill.id) {
                <div class="grid gap-3 rounded-lg p-3 nm-raised-sm md:grid-cols-[minmax(0,1fr)_190px] md:items-center">
                  <input class="rounded-lg bg-transparent px-3 py-2 font-body text-body-sm text-on-surface outline-none nm-inset" [value]="skill.name" (input)="updateSkillName(skill.id, inputValue($event))" />
                  <select class="rounded-lg bg-transparent px-3 py-2 font-label text-label-md text-on-surface outline-none nm-inset" [value]="skill.state" (change)="updateSkillState(skill.id, inputValue($event))">
                    <option value="asserted">Asserted</option>
                    <option value="evidence">Evidence-linked</option>
                    <option value="verified">Employer-verified</option>
                  </select>
                </div>
              }
            </div>

            <div class="mt-5 grid gap-3 rounded-lg p-3 nm-inset md:grid-cols-[minmax(0,1fr)_190px_auto]">
              <input class="rounded-lg bg-transparent px-3 py-2 font-body text-body-sm text-on-surface outline-none nm-raised-sm" placeholder="Add skill" [value]="draftSkill()" (input)="draftSkill.set(inputValue($event))" />
              <select class="rounded-lg bg-transparent px-3 py-2 font-label text-label-md text-on-surface outline-none nm-raised-sm" [value]="draftState()" (change)="setDraftState(inputValue($event))">
                <option value="asserted">Asserted</option>
                <option value="evidence">Evidence-linked</option>
                <option value="verified">Employer-verified</option>
              </select>
              <button type="button" class="nm-button rounded-lg bg-primary-container px-4 text-on-primary" (click)="addSkill()"><lucide-icon [img]="PlusIcon" [size]="18" /></button>
            </div>

            <div class="sticky bottom-4 mt-6 flex justify-end rounded-xl p-3 nm-inset">
              <button type="button" class="nm-button rounded-lg bg-primary-container px-5 py-2.5 font-display text-label-lg font-semibold text-on-primary" (click)="saveProfile()">Save profile</button>
            </div>
          </section>
        </section>
      }

      @if (showConnectDialog()) {
        <section class="fixed inset-0 z-50 grid place-items-center bg-scrim/25 px-6" @fadeSlideUp>
          <div class="w-full max-w-md rounded-xl p-6 nm-raised">
            <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Connection request</p>
            <h2 class="mt-2 font-display text-headline-sm text-on-surface">Share Amira's living portfolio</h2>
            <p class="mt-2 font-body text-body-md text-secondary">CareerOS would send a permissioned profile link with verified skills, achievements, and trajectory context.</p>
            <div class="mt-5 flex flex-wrap gap-3">
              <button type="button" class="nm-button rounded-lg bg-primary-container px-5 py-2.5 font-display text-label-lg font-semibold text-on-primary" (click)="connectionSent.set(true); showConnectDialog.set(false)">Send link</button>
              <button type="button" class="nm-raised rounded-lg px-5 py-2.5 font-display text-label-lg font-semibold text-primary" (click)="showConnectDialog.set(false)">Cancel</button>
            </div>
          </div>
        </section>
      }

      @if (connectionSent()) {
        <div class="fixed bottom-6 right-6 z-50 rounded-xl px-4 py-3 font-label text-label-md text-primary nm-raised">
          Permissioned portfolio link sent.
        </div>
      }
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements AfterViewInit, OnInit {
  @ViewChild('chartEl') private readonly chartEl?: ElementRef<SVGSVGElement>
  protected readonly state = inject(AppStateService)
  protected readonly mock = inject(MockDataService)
  private readonly route = inject(ActivatedRoute)
  protected readonly BadgeIcon = BadgeCheck
  protected readonly CheckIcon = Check
  protected readonly FileIcon = FileCheck
  protected readonly PlusIcon = Plus
  protected readonly achievements = this.mock.talentBankAchievements
  protected readonly activeTab = signal<'portfolio' | 'edit'>('portfolio')
  protected readonly editName = signal(this.state.candidate().name)
  protected readonly editHeadline = signal(this.state.candidate().headline)
  protected readonly editLocation = signal(this.state.candidate().location)
  protected readonly editSkills = signal<Skill[]>(this.state.skills().map((skill) => ({ ...skill })))
  protected readonly draftSkill = signal('')
  protected readonly draftState = signal<SkillState>('asserted')
  protected readonly showConnectDialog = signal(false)
  protected readonly connectionSent = signal(false)
  protected readonly cvPrepared = signal(false)
  protected readonly evidenceTokens = [
    { time: '11 Jun 2026 · 09:42', text: 'Route optimisation verified from Q1 2026 performance review.', category: 'Verified' },
    { time: '11 Jun 2026 · 09:44', text: 'WMS migration project linked as employer outcome evidence.', category: 'Outcome' },
    { time: '11 Jun 2026 · 09:47', text: 'Vendor onboarding playbook attached to stakeholder coordination.', category: 'Artifact' },
  ]
  private lineGenerator?: d3.Line<TrajectoryPoint>

  ngOnInit() {
    if (this.route.snapshot.queryParamMap.get('tab') === 'edit') this.activeTab.set('edit')
  }

  ngAfterViewInit() {
    Promise.resolve().then(() => {
      this.drawChart()
      const segments = document.querySelectorAll('.skill-segments .segment.bg-primary')
      if (segments.length) {
        gsap.to(segments, {
          opacity: 1,
          stagger: 0.06,
          duration: 0.3,
          ease: 'power1.out',
          delay: 0.2,
        })
      }
    })
  }

  selectScenario(id: ScenarioId) {
    this.state.setScenario(id)
    this.updateChart(id)
  }

  selectedScenario() {
    return this.mock.trajectoryScenarios.find((scenario) => scenario.id === this.state.selectedScenario()) ?? this.mock.trajectoryScenarios[0]
  }

  skillProvenance(skillId: string) {
    const provenance = this.mock.skillProvenance as Record<string, string[]>
    return provenance[skillId] ?? []
  }

  isTriangulated(skillId: string) {
    return this.skillProvenance(skillId).length >= 3
  }

  initials() {
    return this.state
      .candidate()
      .name.split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
  }

  inputValue(event: Event) {
    return (event.target as HTMLInputElement | HTMLSelectElement).value
  }

  asSkillState(value: string): SkillState {
    return value as SkillState
  }

  setDraftState(value: string) {
    this.draftState.set(value as SkillState)
  }

  updateSkillName(id: string, name: string) {
    this.editSkills.update((skills) => skills.map((skill) => (skill.id === id ? { ...skill, name } : skill)))
  }

  updateSkillState(id: string, state: string) {
    this.editSkills.update((skills) => skills.map((skill) => (skill.id === id ? { ...skill, state: state as SkillState } : skill)))
  }

  addSkill() {
    const name = this.draftSkill().trim()
    if (!name) return
    this.editSkills.update((skills) => [
      ...skills,
      { id: `custom-${skills.length + 1}`, name, state: this.draftState(), source: 'Added in profile editor' },
    ])
    this.draftSkill.set('')
    this.draftState.set('asserted')
  }

  saveProfile() {
    this.state.updateProfile({
      name: this.editName(),
      headline: this.editHeadline(),
      location: this.editLocation(),
    })
    this.state.updateSkills(this.editSkills())
    this.activeTab.set('portfolio')
  }

  private drawChart() {
    if (!this.chartEl) return
    const width = this.chartEl.nativeElement.clientWidth || 640
    const height = 280
    const margin = { top: 16, right: 24, bottom: 28, left: 36 }
    const svg = d3.select(this.chartEl.nativeElement)
    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${width} ${height}`)

    const x = d3.scaleLinear().domain([0, 48]).range([margin.left, width - margin.right])
    const y = d3.scaleLinear().domain([20, 90]).range([height - margin.bottom, margin.top])
    this.lineGenerator = d3.line<TrajectoryPoint>().x((point) => x(point.m)).y((point) => y(point.v)).curve(d3.curveMonotoneX)

    svg.append('g').attr('transform', `translate(0,${height - margin.bottom})`).call(d3.axisBottom(x).ticks(6)).attr('color', '#555f6f')
    svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y).ticks(5)).attr('color', '#555f6f')
    this.addPath(svg, this.mock.trajectory.actual, '#121c2a', 'actual-line', '4 0')
    this.addPath(svg, this.mock.trajectory.cohortAverage, '#916f6e', 'cohort-line', '4 4')
    this.addPath(svg, this.selectedScenario().projection, '#d8113a', 'projection-line', '6 5')
  }

  private updateChart(id: ScenarioId) {
    if (!this.chartEl || !this.lineGenerator) return
    const scenario = this.mock.trajectoryScenarios.find((item) => item.id === id)
    if (!scenario) return
    d3.select(this.chartEl.nativeElement)
      .select<SVGPathElement>('.projection-line')
      .datum(scenario.projection)
      .transition()
      .duration(600)
      .ease(d3.easeCubicInOut)
      .attr('d', this.lineGenerator)
  }

  private addPath(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, data: TrajectoryPoint[], color: string, className: string, dash: string) {
    if (!this.lineGenerator) return
    svg
      .append('path')
      .datum(data)
      .attr('class', className)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', dash)
      .attr('d', this.lineGenerator)
  }
}
