import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { RiskLevel } from '../../../core/models/types'

@Component({
  selector: 'app-risk-dot',
  standalone: true,
  template: `
    <span class="inline-flex items-center gap-2">
      <span class="h-2 w-2 rounded-full" [class]="dotClass"></span>
      @if (label) {
        <span class="font-label text-label-md text-secondary">{{ label }}</span>
      }
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RiskDotComponent {
  @Input() level: RiskLevel = 'low'
  @Input() label = ''

  get dotClass() {
    if (this.level === 'high' || this.level === 'warning') return 'bg-primary'
    if (this.level === 'moderate') return 'bg-primary/60'
    if (this.level === 'neutral') return 'bg-surface-dim'
    return 'bg-green-500'
  }
}
