import { AfterViewInit, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'
import { RouterLink } from '@angular/router'
import gsap from 'gsap'
import {
  Activity,
  CalendarDays,
  ChevronRight,
  Clock,
  FileDown,
  LucideAngularModule,
  TrendingDown,
  Users,
  WalletCards,
} from 'lucide-angular'
import { listStagger, slideInRight } from '../../../core/animations/entrance.animations'
import { RetentionSignal, RiskLevel } from '../../../core/models/types'
import { MockDataService } from '../../../core/services/mock-data.service'
import { CountUpDirective } from '../../../shared/directives/count-up.directive'

@Component({
  selector: 'app-retention',
  standalone: true,
  imports: [NgTemplateOutlet, RouterLink, LucideAngularModule, CountUpDirective],
  animations: [listStagger, slideInRight],
  template: `
    <main class="mx-auto max-w-content px-6 py-8 lg:px-8">
      <section class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p class="font-label text-label-md text-secondary">
            Talent Pool <span class="font-mono">&gt;</span> Engineering <span class="font-mono">&gt;</span>
            <span class="text-primary">Kevin Raj Selvam</span>
          </p>
          <h1 class="mt-2 font-display text-headline-md text-on-surface">{{ caseData.header }}</h1>
          <p class="mt-2 font-body text-body-md text-secondary">{{ caseData.sub }}</p>
        </div>
        <button
          type="button"
          class="nm-raised inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 font-display text-label-lg font-semibold text-primary"
          (click)="exportQueued.set(true)"
        >
          <lucide-icon [img]="ExportIcon" [size]="18" />
          {{ exportQueued() ? 'PDF queued' : 'Export PDF' }}
        </button>
      </section>

      <section class="mt-6 grid items-start gap-6 lg:grid-cols-12">
        <section class="rounded-xl p-5 nm-raised lg:col-span-7">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Signal Timeline</p>
              <h2 class="mt-2 font-display text-headline-sm text-on-surface">Newest signals first</h2>
            </div>
            <span class="inline-flex items-center gap-2 rounded-full bg-on-primary-container px-3 py-1 font-label text-label-sm text-primary-container">
              <span class="pulse-dot h-2 w-2 rounded-full bg-primary"></span>
              Real-time Feed
            </span>
          </div>

          <div class="relative mt-5 space-y-4 pl-2" [@listStagger]="caseData.signals.length">
            <span class="absolute left-7 top-6 bottom-6 w-px bg-outline-variant"></span>
            @for (signal of caseData.signals; track signal.label) {
              <article class="relative grid gap-3 rounded-xl p-4 nm-raised-sm md:grid-cols-[auto_1fr_auto] md:items-start">
                <span class="z-10 mt-1 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-container text-on-primary">
                  <lucide-icon [img]="iconFor(signal)" [size]="18" />
                </span>
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="h-2 w-2 rounded-full" [class]="severityDot(signal.severity)"></span>
                    <p class="font-body text-body-sm font-semibold text-on-surface">{{ signal.label }}</p>
                  </div>
                  <p class="mt-2 font-body text-body-sm text-secondary">{{ descriptionFor(signal) }}</p>
                </div>
                <div class="text-left md:text-right">
                  <p class="font-mono text-label-md text-secondary">{{ signal.date }}</p>
                  <span class="mt-2 inline-flex rounded-full px-2.5 py-0.5 font-label text-label-sm" [class]="severityBadge(signal.severity)">
                    {{ signal.severity }}
                  </span>
                </div>
              </article>
            }
          </div>
        </section>

        <aside class="space-y-5 lg:col-span-5">
          <section class="rounded-xl p-5 nm-raised">
            <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">90-DAY CHURN PROBABILITY</p>
            <div class="mt-2 flex items-end gap-2">
              <span
                id="churnScore"
                class="font-mono text-headline-lg text-primary"
                style="view-transition-name: churn-score"
                [countUp]="67"
                countUpSuffix="%"
              >0%</span>
              <span class="pb-2 font-mono text-label-md text-primary">+12% VS LAST MONTH</span>
            </div>
            <div class="mt-4 h-3 overflow-hidden rounded-full nm-inset">
              <div id="risk-bar" class="h-full rounded-full bg-primary" style="width:67%"></div>
            </div>
            <p class="mt-4 font-body text-body-md text-on-surface">{{ caseData.outlook.reasoning }}</p>
            <p class="mt-4 font-mono text-label-md text-secondary">{{ caseData.outlook.basis }}</p>
            <div class="mt-5 grid gap-3 sm:grid-cols-3">
              @for (item of interventionImpact; track item.label) {
                <div class="rounded-lg p-3 nm-inset">
                  <p class="font-mono text-body-sm text-primary">{{ item.value }}</p>
                  <p class="mt-1 font-label text-label-sm text-secondary">{{ item.label }}</p>
                </div>
              }
            </div>
          </section>

          <section class="rounded-xl p-5 nm-raised">
            <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">RECOMMENDED ACTIONS</p>
            <div class="mt-4 space-y-3">
              @if (showActions()) {
                @for (action of caseData.actions; track action.title; let index = $index) {
                  @if (action.buttonLink) {
                    <a
                      [routerLink]="action.buttonLink"
                      [queryParams]="{ tab: 'pay' }"
                      class="flex items-center justify-between gap-4 rounded-xl p-4 nm-raised-sm"
                      @slideInRight
                    >
                      <ng-container [ngTemplateOutlet]="actionContent" [ngTemplateOutletContext]="{ action: action, index: index }" />
                    </a>
                  } @else {
                    <div class="flex items-center justify-between gap-4 rounded-xl p-4 nm-raised-sm" @slideInRight>
                      <ng-container [ngTemplateOutlet]="actionContent" [ngTemplateOutletContext]="{ action: action, index: index }" />
                    </div>
                  }
                }
              }
            </div>
          </section>

          <p class="font-label text-label-md text-secondary">{{ caseData.privacyFootnote }}</p>
        </aside>
      </section>

      <ng-template #actionContent let-action="action" let-index="index">
        <span class="flex items-center gap-3">
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-container text-on-primary">
            <lucide-icon [img]="index === 0 ? CalendarIcon : WalletIcon" [size]="18" />
          </span>
          <span>
            <span class="block font-body text-body-sm font-semibold text-on-surface">{{ action.title }}</span>
            <span class="mt-1 block font-label text-label-md text-secondary">{{ action.caption }}</span>
          </span>
        </span>
        <lucide-icon [img]="ChevronIcon" [size]="18" class="text-primary" />
      </ng-template>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RetentionComponent implements AfterViewInit {
  protected readonly mock = inject(MockDataService)
  protected readonly caseData = this.mock.retentionCase
  protected readonly ActivityIcon = Activity
  protected readonly CalendarIcon = CalendarDays
  protected readonly ChevronIcon = ChevronRight
  protected readonly ClockIcon = Clock
  protected readonly ExportIcon = FileDown
  protected readonly TrendIcon = TrendingDown
  protected readonly UsersIcon = Users
  protected readonly WalletIcon = WalletCards
  protected readonly showActions = signal(false)
  protected readonly exportQueued = signal(false)
  protected readonly interventionImpact = [
    { value: '-18 pts', label: 'Manager 1:1' },
    { value: '-9 pts', label: 'Comp review' },
    { value: 'People Ops', label: 'Owner' },
  ]

  ngAfterViewInit() {
    gsap.from('#risk-bar', { width: 0, duration: 0.9, ease: 'power2.out' })
    window.setTimeout(() => this.showActions.set(true), 400)
  }

  protected iconFor(signal: RetentionSignal) {
    const icons = {
      TrendingDown: this.TrendIcon,
      Users: this.UsersIcon,
      Activity: this.ActivityIcon,
      Clock: this.ClockIcon,
    }
    return icons[signal.icon as keyof typeof icons] ?? this.ActivityIcon
  }

  protected severityDot(level: RiskLevel): string {
    if (level === 'neutral') return 'bg-surface-dim'
    if (level === 'moderate') return 'bg-primary/60'
    return 'bg-primary'
  }

  protected severityBadge(level: RiskLevel): string {
    if (level === 'neutral') return 'nm-raised-sm text-secondary'
    return 'bg-error-container/30 text-error'
  }

  protected descriptionFor(signal: RetentionSignal): string {
    if (signal.icon === 'TrendingDown') return 'Engagement velocity fell against this employee cohort baseline.'
    if (signal.icon === 'Users') return 'A close collaborator departure increases short-term mobility risk.'
    if (signal.icon === 'Activity') return 'Platform activity dropped before any internal movement signal appeared.'
    return 'The internal pipeline has not progressed inside the safe response window.'
  }
}
