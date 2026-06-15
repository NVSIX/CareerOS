import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core'
import { Router, RouterLink, RouterLinkActive } from '@angular/router'
import {
  Briefcase,
  Building2,
  Database,
  GitBranch,
  GraduationCap,
  LayoutDashboard,
  Network,
  RotateCcw,
  User,
  Users,
  LucideIconData,
  LucideAngularModule,
} from 'lucide-angular'
import { RoleId } from '../../../core/models/types'
import { AppStateService } from '../../../core/services/app-state.service'

interface NavItem {
  label: string
  path: string
  icon: LucideIconData
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    LucideAngularModule,
  ],
  template: `
    <aside class="group fixed left-0 top-16 z-30 hidden h-[calc(100vh-4rem)] w-16 flex-col bg-surface-container-low shadow-[8px_0_18px_rgba(45,49,52,0.08)] transition-all duration-200 hover:w-52 focus-within:w-52 lg:flex">
      <nav class="flex flex-1 flex-col gap-2 p-2">
        @for (item of items; track item.path) {
          <a
            [routerLink]="item.path"
            routerLinkActive="bg-primary-container text-primary"
            class="flex items-center gap-3 rounded-lg px-3 py-3 font-label text-label-md text-secondary transition-colors hover:bg-surface-container-high"
            [title]="item.label"
          >
            <lucide-icon [img]="item.icon" [size]="18" />
            <span class="whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">{{ item.label }}</span>
          </a>
        }
        <button
          type="button"
          class="mt-auto flex items-center gap-3 rounded-lg px-3 py-3 font-label text-label-md text-secondary transition-colors hover:bg-surface-container-high"
          title="Reset demo"
          (click)="resetDemo()"
        >
          <lucide-icon [img]="ResetIcon" [size]="18" />
          <span class="whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">Reset demo</span>
        </button>
      </nav>
    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  @Input() role: RoleId = 'candidate'
  private readonly state = inject(AppStateService)
  private readonly router = inject(Router)
  protected readonly ResetIcon = RotateCcw

  get items(): NavItem[] {
    if (this.role === 'employer') {
      return [
        { label: 'Dashboard', path: '/employer/dashboard', icon: LayoutDashboard },
        { label: 'Retention', path: '/employer/retention', icon: Building2 },
        { label: 'Salesforce', path: '/employer/salesforce', icon: Database },
      ]
    }
    if (this.role === 'university') {
      return [
        { label: 'Dashboard', path: '/university/dashboard', icon: LayoutDashboard },
        { label: 'Outcomes', path: '/university/outcomes', icon: Network },
        { label: 'Curriculum', path: '/university/curriculum', icon: GraduationCap },
        { label: 'Students', path: '/university/students', icon: Users },
        { label: 'Program', path: '/university/program', icon: Building2 },
      ]
    }
    return [
      { label: 'Dashboard', path: '/candidate/dashboard', icon: LayoutDashboard },
      { label: 'Profile', path: '/candidate/profile', icon: User },
      { label: 'Skill map', path: '/candidate/skills', icon: GitBranch },
      { label: 'Jobs', path: '/jobs', icon: Briefcase },
    ]
  }

  resetDemo() {
    this.state.reset()
    void this.router.navigateByUrl('/')
  }
}
