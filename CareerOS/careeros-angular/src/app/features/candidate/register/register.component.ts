import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core'
import { Router } from '@angular/router'
import { Building2, GraduationCap, LucideAngularModule, LucideIconData, User } from 'lucide-angular'
import { RoleId } from '../../../core/models/types'
import { AppStateService } from '../../../core/services/app-state.service'
import { MockDataService } from '../../../core/services/mock-data.service'

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <main class="mx-auto max-w-5xl px-6 py-10">
      <section class="nm-raised rounded-xl p-6 lg:p-7">
        <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">CareerOS profile</p>
        <h1 class="mt-3 font-display text-headline-md text-on-surface">{{ copy.heading }}</h1>
        <p class="mt-2 font-body text-body-md text-secondary">{{ copy.subline }}</p>
        @if (state.registered()) {
          <p class="mt-4 font-label text-label-md text-primary">Welcome back, {{ state.candidate().name }}</p>
        }

        <div class="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div>
            <div class="grid gap-4 sm:grid-cols-3">
              @for (role of copy.roles; track role.id) {
                <button
                  type="button"
                  class="nm-raised rounded-xl p-6 text-left transition-all duration-200"
                  [class.nm-pressed]="selectedRole() === role.id"
                  [class.ring-2]="selectedRole() === role.id"
                  [class.ring-primary]="selectedRole() === role.id"
                  (click)="selectedRole.set(role.id)"
                >
                  <span class="nm-inset mb-4 inline-flex rounded-xl p-3 text-primary">
                    <lucide-icon [img]="iconFor(role.icon)" [size]="24" />
                  </span>
                  <span class="block font-display text-body-lg font-bold text-on-surface">{{ role.title }}</span>
                  <span class="mt-2 block font-label text-label-md text-secondary">{{ role.desc }}</span>
                </button>
              }
            </div>

            <div class="mt-6 grid gap-4 md:grid-cols-2">
              <label class="block">
                <span class="font-label text-label-md text-secondary">Full name</span>
                <input class="nm-inset mt-2 w-full rounded-lg bg-transparent px-4 py-3 font-body text-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary/30" [value]="name()" (input)="name.set(inputValue($event))" />
              </label>
              <label class="block">
                <span class="font-label text-label-md text-secondary">Work email</span>
                <input class="nm-inset mt-2 w-full rounded-lg bg-transparent px-4 py-3 font-body text-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary/30" [value]="email()" (input)="email.set(inputValue($event))" />
              </label>
            </div>

            <button
              type="button"
              class="nm-button mt-6 rounded-lg bg-primary-container px-5 py-2.5 font-display text-label-lg font-semibold text-on-primary hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
              [disabled]="!selectedRole()"
              (click)="submit()"
            >
              {{ copy.button }}
            </button>
            <p class="mt-4 font-label text-label-md text-secondary">{{ copy.footnote }}</p>
          </div>

          <aside class="rounded-xl p-5 nm-inset">
            <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">What happens next</p>
            <div class="mt-4 space-y-4">
              <div class="rounded-lg p-3 nm-raised-sm">
                <p class="font-body text-body-sm font-semibold text-on-surface">Candidate</p>
                <p class="mt-1 font-label text-label-md text-secondary">Builds a living portfolio and role trajectory.</p>
              </div>
              <div class="rounded-lg p-3 nm-raised-sm">
                <p class="font-body text-body-sm font-semibold text-on-surface">Employer</p>
                <p class="mt-1 font-label text-label-md text-secondary">Opens the pipeline command center.</p>
              </div>
              <div class="rounded-lg p-3 nm-raised-sm">
                <p class="font-body text-body-sm font-semibold text-on-surface">University</p>
                <p class="mt-1 font-label text-label-md text-secondary">Starts at the outcome intelligence hub.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  protected readonly state = inject(AppStateService)
  private readonly mock = inject(MockDataService)
  private readonly router = inject(Router)
  protected readonly copy = this.mock.registration
  protected readonly selectedRole = signal<RoleId>('candidate')
  protected readonly name = signal(this.state.candidate().name)
  protected readonly email = signal(this.state.candidate().email ?? 'amira.hashim@careeros.my')
  private readonly icons: Record<string, LucideIconData> = { User, Building2, GraduationCap }
  protected readonly canSubmit = computed(() => !!this.selectedRole())

  iconFor(name: string) {
    return this.icons[name] ?? User
  }

  inputValue(event: Event) {
    return (event.target as HTMLInputElement).value
  }

  submit() {
    const role = this.selectedRole()
    this.state.setPersona(role)
    if (role === 'candidate') this.state.register(this.name(), this.email())
    const route = this.copy.roles.find((item) => item.id === role)?.route ?? '/onboarding'
    void this.router.navigateByUrl(route)
  }
}
