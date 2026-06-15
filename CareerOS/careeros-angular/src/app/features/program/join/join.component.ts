import { AfterViewInit, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { ArrowRight, BadgeCheck, Check, FileCheck, LucideAngularModule, ShieldCheck, X } from 'lucide-angular'
import gsap from 'gsap'
import { MockDataService } from '../../../core/services/mock-data.service'

@Component({
  selector: 'app-join-program',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  template: `
    <main class="bg-surface text-on-surface">
      <section class="mx-auto grid min-h-[620px] max-w-content items-start gap-8 px-6 pb-8 pt-24 lg:min-h-[640px] lg:grid-cols-[minmax(0,1fr)_460px] lg:px-8 lg:pt-28">
        <div class="join-reveal">
          <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">TalentBank Program</p>
          <h1 class="mt-4 max-w-3xl font-display text-headline-lg text-on-surface">{{ program.hero }}</h1>
          <p class="mt-5 max-w-2xl font-body text-body-lg text-secondary">{{ program.sub }}</p>
          <div class="mt-8 flex flex-wrap gap-3">
            <button type="button" class="nm-button inline-flex items-center gap-2 rounded-lg bg-primary-container px-5 py-2.5 font-display text-label-lg font-semibold text-on-primary hover:bg-primary" (click)="openModal()">
              Apply to verify your organisation
              <lucide-icon [img]="ArrowRightIcon" [size]="18" />
            </button>
            <a routerLink="/university/program" class="nm-raised inline-flex items-center rounded-lg px-5 py-2.5 font-display text-label-lg font-semibold text-primary hover:bg-surface-container-low">
              View university coverage
            </a>
          </div>
        </div>

        <aside class="join-reveal rounded-xl p-6 nm-raised">
          <div class="rounded-xl p-6 nm-inset">
            <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div class="rounded-xl p-4 text-center nm-raised-sm">
                <lucide-icon [img]="FileCheckIcon" [size]="24" class="mx-auto text-primary" />
                <p class="mt-3 font-label text-label-md text-secondary">Issued records</p>
              </div>
              <lucide-icon [img]="ArrowRightIcon" [size]="20" class="text-primary" />
              <div class="rounded-xl p-4 text-center nm-raised-sm">
                <lucide-icon [img]="ShieldIcon" [size]="24" class="mx-auto text-primary" />
                <p class="mt-3 font-label text-label-md text-secondary">Trusted signal</p>
              </div>
            </div>
            <div class="mt-5 rounded-xl bg-primary-container p-5 text-on-primary">
              <p class="font-mono text-headline-md">47</p>
              <p class="font-display text-headline-sm">verified organisations</p>
            </div>
          </div>
        </aside>
      </section>

      <section class="mx-auto max-w-content px-6 py-8 lg:px-8">
        <div class="grid gap-4 md:grid-cols-3">
          @for (stat of stats; track stat.label) {
            <article class="stats-card rounded-xl p-5 nm-raised">
              <p class="font-mono text-headline-sm text-primary">{{ stat.value }}</p>
              <p class="mt-2 font-label text-label-md text-secondary">{{ stat.label }}</p>
            </article>
          }
        </div>
      </section>

      <section class="mx-auto max-w-content px-6 py-10 lg:px-8">
        <div class="mb-6 max-w-3xl">
          <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">How it works</p>
          <h2 class="mt-2 font-display text-headline-sm text-on-surface">One review, then source-verified achievement records</h2>
        </div>
        <div class="grid gap-5 lg:grid-cols-3">
          @for (step of steps; track step.title; let index = $index) {
            <article class="process-card rounded-xl p-5 nm-raised">
              <div class="flex items-center justify-between gap-3">
                <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-container text-on-primary">
                  <lucide-icon [img]="step.icon" [size]="22" />
                </span>
                <span class="font-mono text-label-lg text-primary">0{{ index + 1 }}</span>
              </div>
              <h3 class="mt-5 font-display text-headline-sm text-on-surface">{{ step.title }}</h3>
              <p class="mt-3 font-body text-body-sm text-secondary">{{ step.body }}</p>
            </article>
          }
        </div>
      </section>

      <section class="mx-auto max-w-content px-6 py-10 lg:px-8">
        <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <article class="rounded-xl p-6 nm-inset">
            <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Verification flow</p>
            <div class="mt-6 grid gap-4 md:grid-cols-4">
              @for (item of verificationFlow; track item.label; let last = $last) {
                <div class="flow-step relative rounded-xl p-4 nm-raised">
                  <p class="font-mono text-label-md text-primary">{{ item.kicker }}</p>
                  <h3 class="mt-2 font-body text-body-md font-semibold text-on-surface">{{ item.label }}</h3>
                  <p class="mt-2 font-label text-label-md text-secondary">{{ item.body }}</p>
                  @if (!last) {
                    <span class="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-primary-container text-on-primary shadow-[0_4px_10px_rgba(173,0,42,0.20)] md:flex">
                      <lucide-icon [img]="ArrowRightIcon" [size]="14" />
                    </span>
                  }
                </div>
              }
            </div>
          </article>

          <aside class="rounded-xl p-6 nm-raised">
            <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Issuer examples</p>
            <div class="mt-5 grid gap-3">
              @for (issuer of program.issuers; track issuer) {
                <div class="issuer-chip flex items-center gap-3 rounded-xl p-3 nm-inset">
                  <span class="h-2.5 w-2.5 rounded-full bg-primary"></span>
                  <span class="font-body text-body-sm text-on-surface">{{ issuer }}</span>
                </div>
              }
            </div>
          </aside>
        </div>
      </section>

      <section class="mx-auto max-w-content px-6 py-10 lg:px-8">
        <div class="mb-6 max-w-3xl">
          <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Why it matters</p>
          <h2 class="mt-2 font-display text-headline-sm text-on-surface">The achievement layer gets stronger as more issuers join</h2>
        </div>
        <div class="grid gap-5 lg:grid-cols-3">
          @for (item of program.whyItMatters; track item.audience) {
            <article class="value-card rounded-xl p-5 nm-raised">
              <div class="mb-5 inline-flex rounded-xl bg-secondary-container p-3 text-on-secondary-container">
                <lucide-icon [img]="BadgeIcon" [size]="22" />
              </div>
              <h3 class="font-display text-headline-sm text-on-surface">{{ item.audience }}</h3>
              <p class="mt-3 font-body text-body-sm text-secondary">{{ item.body }}</p>
            </article>
          }
        </div>
      </section>

      @if (modalOpen()) {
        <div class="fixed inset-0 z-50 grid place-items-center bg-inverse-surface/40 px-4 backdrop-blur-sm" (click)="closeModal()">
          <section class="modal-panel w-full max-w-xl rounded-xl p-6 nm-raised" role="dialog" aria-modal="true" aria-label="Apply to verify organisation" (click)="$event.stopPropagation()">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Application request</p>
                <h2 class="mt-2 font-display text-headline-sm text-on-surface">Verification review queued</h2>
              </div>
              <button type="button" class="rounded-lg p-2 text-secondary nm-raised-sm" aria-label="Close modal" (click)="closeModal()">
                <lucide-icon [img]="CloseIcon" [size]="18" />
              </button>
            </div>
            <p class="mt-4 font-body text-body-md text-secondary">
              In the live product this opens the issuer verification workflow. This prototype keeps the path visible: confirm the organisation, submit an event sample, then publish verified achievement records.
            </p>
            <div class="mt-5 grid gap-3">
              @for (item of modalChecklist; track item) {
                <div class="flex items-center gap-3 rounded-xl p-3 nm-inset">
                  <lucide-icon [img]="CheckIcon" [size]="16" class="text-primary" />
                  <span class="font-body text-body-sm text-on-surface">{{ item }}</span>
                </div>
              }
            </div>
            <button type="button" class="nm-button mt-6 inline-flex rounded-lg bg-primary-container px-5 py-2.5 font-display text-label-lg font-semibold text-on-primary hover:bg-primary" (click)="closeModal()">
              Got it
            </button>
          </section>
        </div>
      }
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JoinProgramComponent implements AfterViewInit {
  protected readonly mock = inject(MockDataService)
  protected readonly program = this.mock.talentBankProgram
  protected readonly modalOpen = signal(false)
  protected readonly ArrowRightIcon = ArrowRight
  protected readonly BadgeIcon = BadgeCheck
  protected readonly CheckIcon = Check
  protected readonly CloseIcon = X
  protected readonly FileCheckIcon = FileCheck
  protected readonly ShieldIcon = ShieldCheck
  protected readonly stats = this.program.stats.split(' · ').map((item) => {
    const [value, ...label] = item.split(' ')
    return { value, label: label.join(' ') }
  })
  protected readonly steps = this.program.howItWorks.map((body: string, index: number) => ({
    title: ['Verify the issuer', 'Submit event records', 'Publish calibrated evidence'][index],
    body,
    icon: [ShieldCheck, FileCheck, BadgeCheck][index],
  }))
  protected readonly verificationFlow = [
    { kicker: 'Raw claim', label: 'Achievement submitted', body: 'Issuer sends participant, placement, field size, and rubric metadata.' },
    { kicker: 'Verified at source', label: 'Organisation confirmed', body: 'CareerOS checks the issuing body and event record consistency.' },
    { kicker: 'Calibrated cohort', label: 'Signal weighted', body: 'Placement is compared against field size and comparable outcomes.' },
    { kicker: 'Trusted signal', label: 'Profile updated', body: 'Candidates carry verified evidence employers and universities can trust.' },
  ]
  protected readonly modalChecklist = ['Organisation identity review', 'Event sample and rubric check', 'Verified achievement publishing path']

  ngAfterViewInit() {
    gsap.from('.join-reveal', { opacity: 0, y: 18, stagger: 0.08, duration: 0.36, ease: 'power2.out' })
    gsap.from('.stats-card, .process-card, .flow-step, .issuer-chip, .value-card', { opacity: 0, y: 12, stagger: 0.025, duration: 0.24, ease: 'power2.out', delay: 0.12 })
  }

  protected openModal() {
    this.modalOpen.set(true)
    queueMicrotask(() => {
      gsap.from('.modal-panel', { opacity: 0, y: 18, scale: 0.98, duration: 0.18, ease: 'power2.out' })
    })
  }

  protected closeModal() {
    this.modalOpen.set(false)
  }
}
