import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core'
import { LucideAngularModule, Building2, GraduationCap, User } from 'lucide-angular'
import { RoleId } from '../../../core/models/types'
import { AppStateService } from '../../../core/services/app-state.service'

@Component({
  selector: 'app-persona-badge',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <div class="nm-inset inline-flex items-center gap-2 rounded-full px-3 py-2">
      <lucide-icon [img]="icon" [size]="15" class="text-primary" />
      <span class="font-label text-label-md text-on-surface">{{ label }}</span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonaBadgeComponent {
  @Input() role: RoleId = 'candidate'
  private readonly state = inject(AppStateService)
  protected readonly UserIcon = User
  protected readonly BuildingIcon = Building2
  protected readonly UniversityIcon = GraduationCap

  get icon() {
    if (this.role === 'employer') return this.BuildingIcon
    if (this.role === 'university') return this.UniversityIcon
    return this.UserIcon
  }

  get label() {
    if (this.role === 'university') return 'Dr. Lim Choon Keat · APU'
    return this.role === 'employer' ? 'Farah Iskandar · Employer' : this.state.candidate().name
  }
}
