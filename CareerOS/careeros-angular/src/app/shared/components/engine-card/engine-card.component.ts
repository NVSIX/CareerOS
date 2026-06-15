import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

@Component({
  selector: 'app-engine-card',
  standalone: true,
  template: `
    <section class="nm-inset rounded-xl p-5" [class]="className">
      @if (eyebrow) {
        <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">{{ eyebrow }}</p>
      }
      @if (title) {
        <h2 class="mt-2 font-display text-headline-sm font-semibold text-on-surface">{{ title }}</h2>
      }
      @if (body) {
        <p class="mt-3 font-body text-body-md text-on-surface">{{ body }}</p>
      }
      <ng-content />
      @if (basis) {
        <p class="mt-4 font-mono text-label-md text-secondary">{{ basis }}</p>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EngineCardComponent {
  @Input() eyebrow = 'TRAJECTORY ENGINE'
  @Input() title = ''
  @Input() body = ''
  @Input() basis = ''
  @Input() className = ''
}
