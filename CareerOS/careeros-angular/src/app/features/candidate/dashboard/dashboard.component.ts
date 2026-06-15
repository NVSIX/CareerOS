import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { AlertCircle, Briefcase, LucideAngularModule } from 'lucide-angular'
import { listStagger } from '../../../core/animations/entrance.animations'
import { AppStateService } from '../../../core/services/app-state.service'
import { MockDataService } from '../../../core/services/mock-data.service'
import { BadgeComponent } from '../../../shared/components/badge/badge.component'
import { CoachingCardComponent } from '../../../shared/components/coaching-card/coaching-card.component'

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, LucideAngularModule, BadgeComponent, CoachingCardComponent],
  animations: [listStagger],
  template: `
    <main class="mx-auto max-w-content px-6 py-8 lg:px-8">
      <section class="rounded-xl p-6 nm-raised">
        <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">{{ state.candidate().name.toUpperCase() }}'S CAREER ACTIVITY</p>
        <h1 class="mt-2 font-display text-headline-md text-on-surface">Candidate dashboard</h1>
        <p class="mt-2 max-w-3xl font-body text-body-md text-secondary">
          Applications, trajectory matches, and evidence gaps stay connected to the same living profile.
        </p>
      </section>

      <section class="mt-6 grid gap-6 lg:grid-cols-12">
        <div class="space-y-6 lg:col-span-7">
          <section class="rounded-xl p-5 nm-raised">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Applications</p>
                <h2 class="mt-2 font-display text-headline-sm text-on-surface">Roles in motion</h2>
              </div>
              <span class="font-mono text-body-md text-primary">{{ state.appliedJobs().length }}</span>
            </div>
            <div class="mt-5 space-y-3" [@listStagger]="state.appliedJobs().length">
              @for (job of state.appliedJobs(); track job.jobId) {
                <a [routerLink]="['/jobs', job.jobId]" class="grid gap-3 rounded-lg p-4 nm-inset md:grid-cols-[1fr_auto] md:items-center">
                  <span>
                    <span class="block font-body text-body-md font-semibold text-on-surface">{{ job.title }}</span>
                    <span class="mt-1 block font-label text-label-md text-secondary">{{ job.company }} - <span class="font-mono">{{ job.appliedDate }}</span></span>
                  </span>
                  <app-badge variant="primary">{{ job.status }}</app-badge>
                </a>
              } @empty {
                <div class="rounded-lg p-6 text-center nm-inset">
                  <p class="font-label text-label-md text-secondary">No applications yet - apply to a role to see it here.</p>
                </div>
              }
            </div>
          </section>

          <section class="rounded-xl p-5 nm-raised">
            <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">TRAJECTORY ENGINE - 2 NEW MATCHES</p>
            <div class="mt-5 space-y-3" [@listStagger]="newMatches.length">
              @for (job of newMatches; track job.id) {
                <a [routerLink]="['/jobs', job.id]" class="grid gap-3 rounded-lg p-4 nm-inset md:grid-cols-[1fr_auto_auto] md:items-center">
                  <span>
                    <span class="block font-body text-body-md font-semibold text-on-surface">{{ job.title }}</span>
                    <span class="mt-1 block font-label text-label-md text-secondary">{{ job.company }} - {{ job.location }}</span>
                  </span>
                  <span class="font-mono text-headline-sm text-primary">{{ job.match }}</span>
                  <span class="font-display text-label-lg font-semibold text-primary">View role</span>
                </a>
              }
            </div>
          </section>
        </div>

        <aside class="space-y-6 lg:col-span-5">
          <section class="rounded-xl p-5 nm-raised">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Evidence gaps</p>
                <h2 class="mt-2 font-display text-headline-sm text-on-surface">Claims still needing artifacts</h2>
              </div>
              <lucide-icon [img]="AlertIcon" [size]="20" class="pulse-dot text-primary" />
            </div>
            <div class="mt-5 space-y-3" [@listStagger]="assertedSkills().length">
              @for (skill of assertedSkills(); track skill.id) {
                <div class="flex items-center justify-between gap-3 rounded-lg p-3 nm-inset">
                  <div class="min-w-0">
                    <p class="font-body text-body-sm font-semibold text-on-surface">{{ skill.name }}</p>
                    <p class="truncate font-label text-label-md text-secondary">{{ skill.source }}</p>
                  </div>
                  <app-badge variant="warning">Artifact needed</app-badge>
                </div>
              } @empty {
                <p class="rounded-lg p-4 font-body text-body-md text-primary nm-inset">All claims evidenced - profile fully verified.</p>
              }
            </div>
            <a
              routerLink="/candidate/profile"
              [queryParams]="{ tab: 'edit' }"
              class="nm-button mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container px-5 py-2.5 font-display text-label-lg font-semibold text-on-primary"
            >
              <lucide-icon [img]="BriefcaseIcon" [size]="18" />
              Edit profile
            </a>
          </section>

          <app-coaching-card [body]="mock.coaching.body" [dataBasis]="mock.coaching.dataBasis" />
        </aside>
      </section>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  protected readonly state = inject(AppStateService)
  protected readonly mock = inject(MockDataService)
  protected readonly AlertIcon = AlertCircle
  protected readonly BriefcaseIcon = Briefcase
  protected readonly newMatches = this.mock.jobs.filter((job) => job.id === 'job-002' || job.id === 'job-003')
  protected readonly assertedSkills = computed(() => this.state.skills().filter((skill) => skill.state === 'asserted'))
}
