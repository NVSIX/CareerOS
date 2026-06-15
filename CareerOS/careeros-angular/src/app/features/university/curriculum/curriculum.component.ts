import { AfterViewInit, ChangeDetectionStrategy, Component, inject } from '@angular/core'
import gsap from 'gsap'
import { MockDataService } from '../../../core/services/mock-data.service'

@Component({
  selector: 'app-university-curriculum',
  standalone: true,
  template: `
    <main class="mx-auto max-w-content px-6 py-8 lg:px-8">
      <section class="rounded-xl p-6 nm-raised">
        <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Future-state curriculum engine</p>
        <h1 class="mt-2 font-display text-headline-md text-on-surface">Curriculum efficacy</h1>
        <p class="mt-2 max-w-3xl font-body text-body-md text-secondary">Which modules actually predict workplace success - measured against real graduate outcomes.</p>
      </section>

      <section class="mt-6 rounded-xl p-6 nm-inset">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Module efficacy heatmap</p>
            <h2 class="mt-2 font-display text-headline-sm text-on-surface">Downstream employer-outcome correlation</h2>
          </div>
          <div class="flex flex-wrap gap-2 font-label text-label-md text-secondary">
            <span class="inline-flex items-center gap-2"><span class="h-4 w-4 rounded bg-surface-container-high"></span>0-40</span>
            <span class="inline-flex items-center gap-2"><span class="h-4 w-4 rounded bg-secondary-container"></span>41-70</span>
            <span class="inline-flex items-center gap-2"><span class="h-4 w-4 rounded bg-primary-fixed"></span>71-84</span>
            <span class="inline-flex items-center gap-2"><span class="h-4 w-4 rounded bg-primary"></span>85-100</span>
          </div>
        </div>

        <div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          @for (module of modules; track module.code) {
            <article class="heatmap-cell group min-h-[150px] rounded-xl p-4 transition-transform duration-200 hover:-translate-y-1" [class]="heatClass(module.efficacy)" [title]="module.note || 'Tracked against graduate outcome data'">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="font-mono text-body-md font-semibold">{{ module.code }}</p>
                  <h3 class="mt-1 font-body text-body-sm font-semibold">{{ module.name }}</h3>
                </div>
                <span class="font-mono text-headline-sm">{{ module.efficacy }}</span>
              </div>
              <p class="mt-3 font-label text-label-md opacity-80">{{ module.trend }} trend</p>
              @if (module.note) {
                <p class="mt-3 font-body text-body-sm opacity-0 transition-opacity duration-150 group-hover:opacity-100">{{ module.note }}</p>
              }
            </article>
          }
        </div>
      </section>

      <section class="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <article class="rounded-xl p-6 nm-raised">
          <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Future-state skill demand</p>
          <h2 class="mt-2 font-display text-headline-sm text-on-surface">Rising and declining market signals</h2>
          <div class="mt-6 grid gap-5 lg:grid-cols-2">
            <div class="space-y-4">
              @for (skill of mock.universityDashboard.risingSkills; track skill.skill) {
                <div>
                  <div class="flex items-center justify-between gap-3">
                    <span class="font-body text-body-sm font-semibold text-on-surface">{{ skill.skill }}</span>
                    <span class="font-mono text-label-md text-primary">{{ skill.change }}</span>
                  </div>
                  <div class="mt-2 flex h-4 items-center rounded-full bg-surface-container-high nm-inset">
                    <div class="h-4 rounded-full bg-primary skill-demand-bar" [style.width.%]="skill.demand"></div>
                  </div>
                </div>
              }
            </div>
            <div class="space-y-4">
              @for (skill of mock.universityDashboard.decliningSkills; track skill.skill) {
                <div>
                  <div class="flex items-center justify-between gap-3">
                    <span class="font-body text-body-sm font-semibold text-on-surface">{{ skill.skill }}</span>
                    <span class="font-mono text-label-md text-secondary">{{ skill.change }}</span>
                  </div>
                  <div class="mt-2 flex h-4 items-center justify-end rounded-full bg-surface-container-high nm-inset">
                    <div class="h-4 rounded-full bg-secondary skill-demand-bar" [style.width.%]="skill.demand"></div>
                  </div>
                </div>
              }
            </div>
          </div>
        </article>

        <aside class="rounded-xl p-6 nm-inset">
          <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Actionable recommendation</p>
          <h2 class="mt-2 font-display text-headline-sm text-on-surface">Credit-weight gap alert</h2>
          <p class="mt-4 font-body text-body-md text-on-surface">{{ mock.universityDashboard.gapAlert }}</p>
          <div class="mt-6 rounded-xl p-4 nm-raised">
            <p class="font-mono text-headline-sm text-primary">DAT2001</p>
            <p class="mt-2 font-label text-label-md text-secondary">Market demand suggests moving from <span class="font-mono">3</span> credits to <span class="font-mono">6</span>.</p>
          </div>
        </aside>
      </section>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UniversityCurriculumComponent implements AfterViewInit {
  protected readonly mock = inject(MockDataService)
  protected readonly modules = this.mock.universityDashboard.modules

  ngAfterViewInit() {
    gsap.from('.heatmap-cell', {
      opacity: 0,
      y: 12,
      stagger: 0.05,
      duration: 0.28,
      ease: 'power2.out',
    })
    gsap.from('.skill-demand-bar', {
      width: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: 'power2.out',
      delay: 0.15,
    })
  }

  protected heatClass(efficacy: number) {
    if (efficacy <= 40) return 'bg-surface-container-high text-on-surface'
    if (efficacy <= 70) return 'bg-secondary-container text-on-secondary-container'
    if (efficacy <= 84) return 'bg-primary-fixed text-on-primary-fixed'
    return 'bg-primary text-on-primary'
  }
}
