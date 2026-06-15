import { ChangeDetectionStrategy, Component, OnDestroy, inject, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { AnimationOptions, LottieComponent } from 'ngx-lottie'
import { Check, LucideAngularModule } from 'lucide-angular'
import { fadeIn, listStagger, stepFill, stepTransition } from '../../../core/animations/entrance.animations'
import { Skill, SkillState } from '../../../core/models/types'
import { AppStateService } from '../../../core/services/app-state.service'
import { MockDataService } from '../../../core/services/mock-data.service'
import { BadgeComponent } from '../../../shared/components/badge/badge.component'
import { DataCardComponent } from '../../../shared/components/data-card/data-card.component'
import { EngineCardComponent } from '../../../shared/components/engine-card/engine-card.component'
import { EvidenceIndicatorComponent } from '../../../shared/components/evidence-indicator/evidence-indicator.component'

interface LogEntry {
  id: number
  time: string
  text: string
}

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [
    RouterLink,
    LucideAngularModule,
    LottieComponent,
    BadgeComponent,
    DataCardComponent,
    EngineCardComponent,
    EvidenceIndicatorComponent,
  ],
  animations: [stepTransition, listStagger, fadeIn, stepFill],
  template: `
    <main class="mx-auto grid max-w-content gap-6 px-6 py-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
      <section class="space-y-5">
        <div class="nm-raised flex flex-wrap gap-2 rounded-xl p-3">
          @for (step of steps; track step.label; let i = $index) {
            <div class="flex items-center gap-2 rounded-full px-3 py-2 font-label text-label-md" [@stepFill]="stepState(i)" [class.bg-primary-container]="stepIndex() === i" [class.text-primary]="stepIndex() === i" [class.bg-primary]="stepIndex() > i" [class.text-on-primary]="stepIndex() > i">
              @if (stepIndex() > i) {
                <lucide-icon [img]="CheckIcon" [size]="14" />
              } @else {
                <span class="font-mono">{{ i + 1 }}</span>
              }
              <span>{{ step.label }}</span>
            </div>
          }
        </div>

        <div @stepTransition>
          @switch (stepIndex()) {
            @case (0) {
              <app-engine-card eyebrow="TRAJECTORY ENGINE — COGNITION" title="Load my profile" body="We'll verify your existing profile claims.">
                <button type="button" class="nm-button mt-5 rounded-lg bg-primary-container px-5 py-2.5 font-display text-label-lg font-semibold text-on-primary" (click)="go(1)">Load my profile</button>
              </app-engine-card>
            }
            @case (1) {
              <app-engine-card eyebrow="TRAJECTORY ENGINE — PROFILE PARSED" title="Profile parsed" [body]="script.step1Intro">
                <button type="button" class="nm-button mt-5 rounded-lg bg-primary-container px-5 py-2.5 font-display text-label-lg font-semibold text-on-primary" (click)="go(2)">Continue</button>
              </app-engine-card>
            }
            @case (2) {
              <app-engine-card eyebrow="TRAJECTORY ENGINE — EVIDENCE PROBE" title="SQL evidence probe" [body]="script.probes[0].question">
                <button type="button" class="nm-raised mt-5 rounded-lg px-4 py-3 text-left font-body text-body-sm text-on-surface" (click)="captureProbe(0)">{{ script.probes[0].replyChip }}</button>
                @if (capturedSql()) {
                  <div class="mt-4 flex items-center gap-3" @fadeIn>
                    <ng-lottie [options]="checkmarkOptions" width="36px" height="36px" />
                    <app-badge variant="primary">Evidence captured</app-badge>
                  </div>
                }
              </app-engine-card>
            }
            @case (3) {
              <app-engine-card eyebrow="TRAJECTORY ENGINE — VERIFICATION" title="Cross-functional probe" [body]="script.probes[1].question">
                <button type="button" class="nm-raised mt-5 rounded-lg px-4 py-3 text-left font-body text-body-sm text-on-surface" (click)="captureProbe(1)">{{ script.probes[1].replyChip }}</button>
                @if (capturedLeadership()) {
                  <div class="mt-4 flex items-center gap-3" @fadeIn>
                    <ng-lottie [options]="checkmarkOptions" width="36px" height="36px" />
                    <app-badge variant="primary">Evidence captured</app-badge>
                  </div>
                }
              </app-engine-card>
            }
            @case (4) {
              <app-data-card [title]="script.completionHeader" [caption]="script.completionSub">
                <a routerLink="/candidate/profile" class="nm-button mt-5 inline-flex rounded-lg bg-primary-container px-5 py-2.5 font-display text-label-lg font-semibold text-on-primary">
                  {{ script.completionCta }}
                </a>
              </app-data-card>
            }
          }
        </div>
      </section>

      <aside class="space-y-5">
        <section class="nm-raised rounded-xl p-5">
          <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Profile — building live</p>
          <div class="mt-4 space-y-3" [@listStagger]="skills().length">
            @for (skill of skills(); track skill.id) {
              <div class="nm-raised-sm flex items-center justify-between rounded-lg p-3">
                <div>
                  <p class="font-body text-body-sm font-semibold text-on-surface">{{ skill.name }}</p>
                  <p class="font-label text-label-md text-secondary">{{ skill.source }}</p>
                </div>
                <app-evidence-indicator [state]="skill.state" />
              </div>
            }
          </div>
        </section>

        <section class="nm-inset rounded-xl p-3">
          <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Probe log</p>
          <div class="mt-3 h-40 overflow-y-auto">
            @for (entry of probeLogEntries(); track entry.id) {
              <div class="probe-log-entry mb-2 rounded-lg bg-surface-container-low p-2">
                <p class="font-mono text-label-sm text-primary">{{ entry.time }}</p>
                <p class="font-label text-label-md text-secondary">{{ entry.text }}</p>
              </div>
            } @empty {
              <p class="font-label text-label-md text-secondary">Engine waiting for profile input.</p>
            }
          </div>
        </section>
      </aside>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnboardingComponent implements OnDestroy {
  protected readonly state = inject(AppStateService)
  private readonly mock = inject(MockDataService)
  protected readonly script = this.mock.diagnosticScript
  protected readonly stepIndex = signal(0)
  protected readonly skills = signal<Skill[]>(this.state.skills().map((skill) => ({ ...skill })))
  protected readonly probeLogEntries = signal<LogEntry[]>([])
  protected readonly capturedSql = signal(false)
  protected readonly capturedLeadership = signal(false)
  protected readonly steps = [
    { label: 'Cognition' },
    { label: 'Logic Flow' },
    { label: 'Verification' },
    { label: 'Finalization' },
  ]
  protected readonly CheckIcon = Check
  protected readonly checkmarkOptions: AnimationOptions = {
    path: '/assets/lottie/checkmark.json',
    loop: false,
    autoplay: true,
  }
  private readonly timers: number[] = []
  private finalized = false

  go(step: number) {
    this.stepIndex.set(step)
    if (step === 1) this.streamLog(['PARSE_INIT — Profile document received', 'CLAIM_EXTRACT — 6 skill claims identified', 'EVIDENCE_SCAN — Checking artifact linkage...'])
    if (step === 4) this.finalize()
  }

  captureProbe(index: number) {
    const probe = this.script.probes[index]
    this.upgradeSkill(probe.effect.skillId, probe.effect.newState as SkillState, probe.effect.evidenceSource)
    if (index === 0) {
      this.capturedSql.set(true)
      this.streamLog(['PROBE_GEN — Targeting: SQL (asserted)', 'RESPONSE_PARSE — Analysing probe response', 'EVIDENCE_UPGRADE — SQL → evidence-linked'])
      this.queue(() => this.go(3), 1200)
    } else {
      this.capturedLeadership.set(true)
      this.streamLog(['PROBE_GEN — Targeting: Cross-functional leadership', 'PATTERN_MATCH — Response matched 847 comparable profiles', 'EVIDENCE_UPGRADE — Cross-functional → evidence-linked'])
      this.queue(() => this.go(4), 1200)
    }
  }

  stepState(index: number) {
    if (this.stepIndex() > index) return 'complete'
    if (this.stepIndex() === index) return 'active'
    return 'inactive'
  }

  ngOnDestroy() {
    this.timers.forEach((timer) => clearTimeout(timer))
  }

  private upgradeSkill(skillId: string, state: SkillState, source: string) {
    this.skills.update((skills) =>
      skills.map((skill) => (skill.id === skillId ? { ...skill, state, source } : skill)),
    )
  }

  private finalize() {
    if (this.finalized) return
    this.finalized = true
    this.state.completeDiagnostic(this.skills())
  }

  private streamLog(messages: string[]) {
    messages.forEach((text, index) => {
      this.queue(() => {
        const id = Date.now() + index
        this.probeLogEntries.update((entries) => [{ id, time: this.now(), text }, ...entries])
      }, index * 800)
    })
  }

  private queue(fn: () => void, delay: number) {
    const timer = window.setTimeout(fn, delay)
    this.timers.push(timer)
  }

  private now() {
    return new Date().toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' })
  }
}
