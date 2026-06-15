import { AfterViewInit, ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'
import { RouterLink } from '@angular/router'
import gsap from 'gsap'
import { MockDataService } from '../../../core/services/mock-data.service'

@Component({
  selector: 'app-university-students',
  standalone: true,
  imports: [NgTemplateOutlet, RouterLink],
  template: `
    <main class="mx-auto max-w-content px-6 py-8 lg:px-8">
      <section class="rounded-xl p-6 nm-raised">
        <div class="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Adaptive readiness profile</p>
            <h1 class="mt-2 font-display text-headline-md text-on-surface">Student readiness</h1>
            <p class="mt-2 max-w-3xl font-body text-body-md text-secondary">A live signal of who's ready, built from academics, verified achievements, and demonstrated competencies.</p>
          </div>
          <div class="grid gap-2 sm:grid-cols-3">
            @for (item of readinessSummary; track item.label) {
              <div class="rounded-xl px-3 py-2 nm-inset">
                <p class="font-mono text-body-md text-primary">{{ item.value }}</p>
                <p class="font-label text-label-sm text-secondary">{{ item.label }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <section class="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        @for (student of students; track student.name) {
          @if (student.name === 'Amira Hashim') {
            <a routerLink="/candidate/profile" class="student-card rounded-xl p-6 transition-transform duration-200 hover:-translate-y-1 nm-raised">
              <ng-container [ngTemplateOutlet]="studentCard" [ngTemplateOutletContext]="{ student: student }" />
            </a>
          } @else {
            <article class="student-card rounded-xl p-6 nm-raised">
              <ng-container [ngTemplateOutlet]="studentCard" [ngTemplateOutletContext]="{ student: student }" />
            </article>
          }
        }
      </section>

      <section class="mt-6 grid gap-5 md:grid-cols-3">
        @for (item of readinessDrivers; track item.label) {
          <article class="rounded-xl p-5 nm-inset">
            <p class="font-mono text-headline-sm text-primary">{{ item.value }}</p>
            <h2 class="mt-2 font-display text-body-lg text-on-surface">{{ item.label }}</h2>
            <p class="mt-2 font-body text-body-sm text-secondary">{{ item.body }}</p>
          </article>
        }
      </section>

      <section class="mt-6 rounded-xl p-5 nm-inset">
        <p class="font-body text-body-md text-secondary">Readiness is a signal, not a verdict — students keep agency over what they pursue.</p>
      </section>

      <ng-template #studentCard let-student="student">
        <div class="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
          <div class="flex items-center gap-3">
            <span class="flex h-11 w-11 items-center justify-center rounded-full font-mono text-label-lg font-semibold text-on-surface nm-raised-sm" [style.background]="avatarColor(student.name)">
              {{ initials(student.name) }}
            </span>
            <div>
              <h2 class="font-body text-body-md font-semibold text-on-surface">{{ student.name }}</h2>
              <p class="font-label text-label-md text-secondary">{{ student.program }}</p>
            </div>
          </div>
          <svg class="h-24 w-24 shrink-0" viewBox="0 0 96 96" aria-hidden="true">
            <circle cx="48" cy="48" r="34" fill="none" stroke="#e6e8ec" stroke-width="9" />
            <circle class="readiness-ring" cx="48" cy="48" r="34" fill="none" stroke="#d8113a" stroke-width="9" stroke-linecap="round" [attr.stroke-dasharray]="ringDash" [attr.stroke-dashoffset]="ringOffset(student.readiness)" transform="rotate(-90 48 48)" />
            <text x="48" y="52" text-anchor="middle" class="fill-on-surface font-mono text-body-md font-semibold">{{ student.readiness }}</text>
          </svg>
        </div>
        <p class="mt-5 font-body text-body-sm text-secondary">{{ student.signal }}</p>
        <span class="mt-4 inline-flex rounded-full px-3 py-1 font-label text-label-sm text-secondary nm-inset">{{ student.status }}</span>
      </ng-template>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UniversityStudentsComponent implements AfterViewInit {
  protected readonly mock = inject(MockDataService)
  protected readonly students = this.mock.universityDashboard.students
  protected readonly ringDash = 214
  protected readonly readinessSummary = [
    { value: `${Math.round(this.students.reduce((sum, student) => sum + student.readiness, 0) / this.students.length)}`, label: 'avg readiness' },
    { value: `${this.students.filter((student) => student.readiness >= 80).length}`, label: 'ready now' },
    { value: '3', label: 'signal sources' },
  ]
  protected readonly readinessDrivers = [
    { value: 'Moodle', label: 'Academic velocity', body: 'Assessment progress and module performance keep readiness current.' },
    { value: 'SIS', label: 'Program context', body: 'Program, year, and credit status calibrate each student against peers.' },
    { value: 'TalentBank', label: 'Verified evidence', body: 'Achievements add employer-trusted signal beyond transcript grades.' },
  ]

  ngAfterViewInit() {
    gsap.from('.student-card', { opacity: 0, y: 14, stagger: 0.08, duration: 0.32, ease: 'power2.out' })
    gsap.from('.readiness-ring', { strokeDashoffset: this.ringDash, stagger: 0.08, duration: 0.8, ease: 'power2.out' })
  }

  protected ringOffset(readiness: number) {
    return this.ringDash - (this.ringDash * readiness) / 100
  }

  protected initials(name: string) {
    return name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase()
  }

  protected avatarColor(name: string) {
    if (name === 'Amira Hashim') return '#d6e0f3'
    if (name === 'Wong Jia Hui') return '#e1e3e4'
    if (name === 'Arjun Nair') return '#ffdad9'
    return '#d9e3f6'
  }
}
