import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { Router, RouterLink, RouterOutlet } from '@angular/router'
import { RoleId } from '../../../core/models/types'
import { AppStateService } from '../../../core/services/app-state.service'
import { routeAnimations } from '../../../core/animations/route.animations'
import { PersonaBadgeComponent } from '../persona-badge/persona-badge.component'
import { SidebarComponent } from '../sidebar/sidebar.component'

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    PersonaBadgeComponent,
    SidebarComponent,
  ],
  animations: [routeAnimations],
  template: `
    <div class="min-h-screen bg-surface text-on-surface">
      <header class="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between bg-surface/95 px-4 shadow-[0_8px_18px_rgba(45,49,52,0.06)] backdrop-blur">
        <a routerLink="/" class="font-display text-headline-sm font-bold text-primary" style="view-transition-name: wordmark">CareerOS</a>
        <div class="flex items-center gap-3">
          @if (showPersona) {
            <app-persona-badge [role]="role" />
          }
          <div class="nm-inset hidden rounded-full p-1 md:flex">
            <button type="button" class="rounded-full px-3 py-1.5 font-label text-label-md" [class.bg-primary-container]="role === 'candidate'" [class.text-primary]="role === 'candidate'" (click)="goCandidate()">
              Candidate view
            </button>
            <button type="button" class="rounded-full px-3 py-1.5 font-label text-label-md" [class.bg-primary-container]="role === 'employer'" [class.text-primary]="role === 'employer'" (click)="goEmployer()">
              Employer view
            </button>
            <button type="button" class="rounded-full px-3 py-1.5 font-label text-label-md" [class.bg-primary-container]="role === 'university'" [class.text-primary]="role === 'university'" (click)="goUniversity()">
              University view
            </button>
          </div>
        </div>
      </header>

      @if (!hideSidebar) {
        <app-sidebar [role]="role" />
      }

      <main class="pt-16" [class.lg:pl-16]="!hideSidebar">
        <div [@routeAnimations]="getRouteAnimationState(outlet)" class="page-enter">
          <router-outlet #outlet="outlet" />
        </div>
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent {
  private readonly router = inject(Router)
  private readonly state = inject(AppStateService)

  get url() {
    return this.router.url.split('?')[0]
  }

  get role(): RoleId {
    if (this.url.startsWith('/employer')) return 'employer'
    if (this.url.startsWith('/university')) return 'university'
    return 'candidate'
  }

  get hideSidebar() {
    return this.url === '/' || this.url === '/register' || this.url === '/onboarding' || this.url === '/program/join'
  }

  get showPersona() {
    return this.url !== '/' && this.url !== '/register' && this.url !== '/program/join'
  }

  getRouteAnimationState(outlet: RouterOutlet) {
    return outlet.activatedRouteData['animation']
  }

  goCandidate() {
    this.state.setPersona('candidate')
    void this.router.navigateByUrl('/candidate/profile')
  }

  goEmployer() {
    this.state.setPersona('employer')
    void this.router.navigateByUrl('/employer/dashboard')
  }

  goUniversity() {
    this.state.setPersona('university')
    void this.router.navigateByUrl('/university/dashboard')
  }
}
