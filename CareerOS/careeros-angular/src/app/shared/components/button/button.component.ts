import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button
      [attr.type]="type"
      [disabled]="disabled"
      class="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 font-display text-label-lg font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50"
      [class]="variantClass"
      (mousedown)="pressed = true"
      (mouseup)="pressed = false"
      (mouseleave)="pressed = false"
      (click)="action.emit()"
    >
      <ng-content />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary'
  @Input() disabled = false
  @Input() type: 'button' | 'submit' | 'reset' = 'button'
  @Output() action = new EventEmitter<void>()
  protected pressed = false

  get variantClass() {
    if (this.variant === 'secondary') return 'nm-raised text-primary hover:bg-surface-container-low'
    if (this.variant === 'ghost') return 'text-primary hover:bg-surface-container-high'
    return 'nm-button bg-primary-container text-on-primary hover:bg-primary'
  }
}
