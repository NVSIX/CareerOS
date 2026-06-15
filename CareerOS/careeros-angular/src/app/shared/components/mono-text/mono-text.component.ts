import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

@Component({
  selector: 'app-mono-text',
  standalone: true,
  template: `<span class="font-mono text-on-surface" [class]="className"><ng-content /></span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonoTextComponent {
  @Input() className = ''
}
