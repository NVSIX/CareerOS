import { AfterViewInit, ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import gsap from 'gsap'
import { MockDataService } from '../../../core/services/mock-data.service'

@Component({
  selector: 'app-talentbank-program',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="mx-auto max-w-content px-6 py-8 lg:px-8">
      <section class="rounded-xl p-6 nm-raised">
        <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Verified organisations</p>
        <div class="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 class="mt-2 font-display text-headline-md text-on-surface">TalentBank Program</h1>
            <p class="mt-2 max-w-3xl font-body text-body-md text-secondary">Passive verified records from clubs, societies, competition bodies, and training providers.</p>
          </div>
          <a routerLink="/program/join" class="rounded-lg px-5 py-2.5 font-display text-label-lg font-semibold text-primary nm-raised">Learn about the Program</a>
        </div>
      </section>

      <section class="mt-6 grid gap-5 md:grid-cols-3">
        @for (stat of stats; track stat.label) {
          <article class="grid grid-cols-[auto_1fr] items-center gap-5 rounded-xl p-6 nm-inset">
            <svg class="h-28 w-28" viewBox="0 0 96 96" aria-hidden="true">
              <circle cx="48" cy="48" r="35" fill="none" stroke="#e6e8ec" stroke-width="10" />
              <circle class="program-ring" cx="48" cy="48" r="35" fill="none" stroke="#d8113a" stroke-width="10" stroke-linecap="round" [attr.stroke-dasharray]="ringDash" [attr.stroke-dashoffset]="ringOffset(stat.percent)" transform="rotate(-90 48 48)" />
              <text x="48" y="52" text-anchor="middle" class="fill-on-surface font-mono text-body-md font-semibold">{{ stat.center }}</text>
            </svg>
            <div class="min-w-0">
              <p class="font-mono text-headline-md text-primary">{{ stat.value }}</p>
              <p class="mt-1 font-label text-label-lg text-on-surface">{{ stat.label }}</p>
              <p class="mt-2 font-body text-body-sm text-secondary">verified issuer signal</p>
            </div>
          </article>
        }
      </section>

      <section class="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <article class="rounded-xl p-6 nm-raised">
          <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Verified issuer records</p>
          <div class="mt-5 grid gap-3">
            @for (org of mock.talentBankProgram.orgs; track org.name) {
              <div class="verified-org-row grid gap-3 rounded-xl p-4 nm-inset md:grid-cols-[1fr_auto_auto] md:items-center">
                <div>
                  <p class="font-body text-body-md font-semibold text-on-surface">{{ org.name }}</p>
                  <p class="font-label text-label-md text-secondary">verified issuer</p>
                </div>
                <span class="font-mono text-body-sm text-primary">{{ org.count.toLocaleString() }} achievements</span>
                <span class="font-mono text-label-md text-secondary">{{ org.lastSubmitted }}</span>
              </div>
            }
          </div>
        </article>

        <aside class="rounded-xl p-6 nm-inset">
          <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">What this gives APU</p>
          <h2 class="mt-2 font-display text-headline-sm text-on-surface">Verified achievement coverage compounds</h2>
          <p class="mt-4 font-body text-body-md text-secondary">
            Verified achievement coverage improves student signal, strengthens employer trust, and feeds curriculum efficacy with richer evidence than grades alone.
          </p>
          <div class="mt-6 rounded-xl p-4 nm-raised">
            <p class="font-mono text-headline-sm text-primary">64%</p>
            <p class="font-label text-label-md text-secondary">of APU students covered by at least one verified achievement.</p>
          </div>
        </aside>
      </section>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TalentBankProgramComponent implements AfterViewInit {
  protected readonly mock = inject(MockDataService)
  protected readonly ringDash = 220
  protected readonly stats = [
    { value: '47', center: '47', label: 'verified orgs', percent: 80 },
    { value: '8,200', center: '8.2k', label: 'verified achievements', percent: 88 },
    { value: '64%', center: '64%', label: 'student coverage', percent: 64 },
  ]

  ngAfterViewInit() {
    gsap.from('.program-ring', { strokeDashoffset: this.ringDash, duration: 0.8, stagger: 0.08, ease: 'power2.out' })
    gsap.from('.verified-org-row', { opacity: 0, y: 10, stagger: 0.05, duration: 0.25, ease: 'power2.out', delay: 0.15 })
  }

  protected ringOffset(percent: number) {
    return this.ringDash - (this.ringDash * percent) / 100
  }
}
