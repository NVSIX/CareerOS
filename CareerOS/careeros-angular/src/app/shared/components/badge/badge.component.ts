import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

export type BadgeVariant = 'primary' | 'warning' | 'neutral' | 'success'

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `
    <span class="inline-flex items-center rounded-full px-2.5 py-0.5 font-label text-label-sm" [class]="variantClass">
      <ng-content />
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'neutral'

  get variantClass() {
    const variants: Record<BadgeVariant, string> = {
      primary: 'bg-on-primary-container text-primary-container',
      warning: 'bg-error-container/30 text-error',
      neutral: 'nm-raised-sm text-secondary',
      success: 'bg-secondary-container text-on-secondary-container',
    }
    return variants[this.variant]
  }
}
