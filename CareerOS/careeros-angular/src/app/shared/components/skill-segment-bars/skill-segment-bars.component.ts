import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { SkillState } from '../../../core/models/types'

@Component({
  selector: 'app-skill-segment-bars',
  standalone: true,
  template: `
    <div class="skill-segments flex items-center gap-0.5" [attr.aria-label]="state">
      @for (segment of segments; track segment) {
        <span class="segment h-1 w-2.5 rounded-sm" [class.bg-primary]="segment <= filled" [class.bg-surface-container-high]="segment > filled"></span>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillSegmentBarsComponent {
  @Input() state: SkillState = 'asserted'
  protected readonly segments = [1, 2, 3, 4]

  get filled() {
    if (this.state === 'verified') return 4
    if (this.state === 'evidence') return 3
    return 1
  }
}
