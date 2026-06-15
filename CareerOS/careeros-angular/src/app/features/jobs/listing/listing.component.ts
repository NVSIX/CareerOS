import { AfterViewInit, ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import gsap from 'gsap'
import { Search, SlidersHorizontal, Sparkles, LucideAngularModule } from 'lucide-angular'
import { listStagger } from '../../../core/animations/entrance.animations'
import { Job } from '../../../core/models/types'
import { MockDataService } from '../../../core/services/mock-data.service'

@Component({
  selector: 'app-listing',
  standalone: true,
  imports: [FormsModule, RouterLink, LucideAngularModule],
  animations: [listStagger],
  template: `
    <main class="mx-auto max-w-content px-6 py-8 lg:px-8">
      <section class="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div class="min-w-0">
          <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Trajectory marketplace</p>
              <h1 class="mt-2 font-display text-headline-md text-on-surface">Jobs matched to Amira's verified trajectory</h1>
              <p class="mt-2 max-w-2xl font-body text-body-md text-secondary">
                Five live opportunities ranked by performance fingerprint, verified skill overlap and growth path fit.
              </p>
            </div>
            <a
              routerLink="/candidate/profile"
              [queryParams]="{ tab: 'edit' }"
              class="nm-button inline-flex items-center justify-center gap-2 rounded-lg bg-primary-container px-5 py-2.5 font-display text-label-lg font-semibold text-on-primary"
            >
              <lucide-icon [img]="SparklesIcon" [size]="18" />
              Optimize Profile
            </a>
          </div>

          <div class="mt-6 grid gap-3 rounded-xl p-4 nm-inset md:grid-cols-[1fr_auto]">
            <label class="flex min-w-0 items-center gap-3 rounded-lg bg-surface-container-lowest px-4 py-3 nm-raised-sm">
              <lucide-icon [img]="SearchIcon" [size]="18" class="text-secondary" />
              <input
                [(ngModel)]="query"
                type="search"
                class="w-full bg-transparent font-body text-body-md text-on-surface outline-none placeholder:text-secondary"
                placeholder="Search by title, company, location"
              />
            </label>
            <div class="flex flex-wrap items-center gap-2">
              <span class="inline-flex items-center gap-2 px-2 font-label text-label-sm text-secondary">
                <lucide-icon [img]="FilterIcon" [size]="16" />
                Filter
              </span>
              @for (filter of filters; track filter) {
                <button
                  type="button"
                  class="rounded-full px-3 py-1 font-label text-label-sm font-semibold transition-all"
                  [class.bg-primary-container]="activeFilter === filter"
                  [class.text-on-primary]="activeFilter === filter"
                  [class.nm-raised-sm]="activeFilter !== filter"
                  [class.text-secondary]="activeFilter !== filter"
                  (click)="activeFilter = filter"
                >
                  {{ filter }}
                </button>
              }
            </div>
          </div>

          <div class="mt-6 space-y-4" [@listStagger]="filteredJobs.length">
            @for (job of filteredJobs; track job.id) {
              <a
                [routerLink]="['/jobs', job.id]"
                class="group grid gap-4 rounded-xl p-5 nm-raised transition-transform hover:-translate-y-0.5 md:grid-cols-[1fr_auto]"
              >
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="nm-raised-sm rounded-full px-2.5 py-0.5 font-label text-label-sm text-secondary">{{ job.industry }}</span>
                    <span class="font-mono text-label-sm text-secondary">{{ job.posted }}</span>
                  </div>
                  <h2 class="mt-3 font-display text-headline-sm text-on-surface">{{ job.title }}</h2>
                  <p class="mt-1 font-body text-body-md text-secondary">{{ job.company }} - {{ job.location }}</p>
                  <p class="mt-3 font-mono text-body-md text-on-surface">{{ job.salary }}</p>
                </div>
                <div class="flex items-center justify-between gap-5 md:min-w-40 md:flex-col md:items-end">
                  <div
                    class="rounded-xl px-4 py-3 text-right nm-inset"
                    [style.view-transition-name]="scoreTransitionName(job.id)"
                  >
                    <p class="font-mono text-headline-sm text-primary">{{ job.match }}</p>
                    <p class="font-label text-label-sm text-secondary">match score</p>
                  </div>
                  <span class="font-display text-label-lg font-semibold text-primary group-hover:text-primary-container">Open role</span>
                </div>
              </a>
            } @empty {
              <div class="rounded-xl p-6 text-center nm-raised">
                <p class="font-display text-headline-sm text-on-surface">No roles match these filters.</p>
                <p class="mt-2 font-body text-body-sm text-secondary">Try clearing the search or selecting All.</p>
              </div>
            }
          </div>
        </div>

        <aside class="space-y-5">
          <section class="rounded-xl p-5 nm-raised">
            <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Marketplace insight</p>
            <h2 class="mt-2 font-display text-headline-sm text-on-surface">One profile gap is suppressing the top match.</h2>
            <p class="mt-3 font-body text-body-sm text-secondary">
              Cross-functional leadership is still asserted. Converting the WMS migration into evidence raises Senior Logistics Coordinator fit.
            </p>
            <a
              routerLink="/candidate/profile"
              [queryParams]="{ tab: 'edit' }"
              class="nm-button mt-5 inline-flex w-full items-center justify-center rounded-lg bg-primary-container px-5 py-2.5 font-display text-label-lg font-semibold text-on-primary"
            >
              Optimize Profile
            </a>
          </section>

          <section class="rounded-xl p-5 nm-raised">
            <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Trending skills</p>
            <h2 class="mt-2 font-display text-headline-sm text-on-surface">Signals moving this market</h2>
            <div class="mt-5 space-y-4" [@listStagger]="trendingSkills.length">
              @for (skill of trendingSkills; track skill.name) {
                <div>
                  <div class="mb-2 flex items-center justify-between gap-3">
                    <span class="font-label text-label-lg font-semibold text-on-surface">{{ skill.name }}</span>
                    <span class="font-mono text-label-lg text-primary">{{ skill.value }}%</span>
                  </div>
                  <div class="h-2 overflow-hidden rounded-full nm-inset">
                    <div class="skill-bar-fill h-full origin-left rounded-full bg-primary" [style.width.%]="skill.value"></div>
                  </div>
                </div>
              }
            </div>
          </section>
        </aside>
      </section>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListingComponent implements AfterViewInit {
  private readonly mock = inject(MockDataService)
  protected readonly SearchIcon = Search
  protected readonly FilterIcon = SlidersHorizontal
  protected readonly SparklesIcon = Sparkles

  protected query = ''
  protected activeFilter = 'All'
  protected readonly filters = ['All', 'Logistics', 'Retail', 'Mobility', 'Industrial']
  protected readonly jobs = this.mock.jobs
  protected readonly trendingSkills = [
    { name: 'Route Optimisation', value: 92 },
    { name: 'SAP Inventory', value: 85 },
    { name: 'Lean Management', value: 76 },
  ]

  protected get filteredJobs(): Job[] {
    const query = this.query.trim().toLowerCase()
    return this.jobs.filter((job) => {
      const matchesFilter = this.activeFilter === 'All' || job.industry === this.activeFilter
      const haystack = `${job.title} ${job.company} ${job.location} ${job.industry}`.toLowerCase()
      return matchesFilter && (!query || haystack.includes(query))
    })
  }

  protected scoreTransitionName(id: string): string {
    if (id === 'job-001') return 'job-score-job001'
    return `job-score-${id.replaceAll('-', '')}`
  }

  ngAfterViewInit() {
    gsap.fromTo(
      '.skill-bar-fill',
      { scaleX: 0 },
      { scaleX: 1, duration: 0.7, ease: 'power2.out', stagger: 0.08 },
    )
  }
}
