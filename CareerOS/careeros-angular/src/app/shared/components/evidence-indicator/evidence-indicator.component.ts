import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { LucideAngularModule, Check } from 'lucide-angular'
import { evidenceFlip } from '../../../core/animations/entrance.animations'
import { SkillState } from '../../../core/models/types'

@Component({
  selector: 'app-evidence-indicator',
  standalone: true,
  imports: [LucideAngularModule],
  animations: [evidenceFlip],
  template: `
    <span
      class="inline-flex h-3 w-3 items-center justify-center rounded-full"
      [@evidenceFlip]="state"
      [class.border]="state === 'asserted'"
      [class.border-outline]="state === 'asserted'"
      [class.bg-primary]="state !== 'asserted'"
      [attr.aria-label]="state"
    >
      @if (state === 'verified') {
        <lucide-icon [img]="CheckIcon" [size]="8" class="text-on-primary" />
      }
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvidenceIndicatorComponent {
  @Input() state: SkillState = 'asserted'
  protected readonly CheckIcon = Check
}
