import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

@Component({
  selector: 'app-metric-block',
  standalone: true,
  template: `
    <div class="nm-raised rounded-xl p-5" [class]="className">
      <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">{{ label }}</p>
      <div class="mt-2 font-mono text-headline-lg font-medium text-primary" [style.view-transition-name]="transitionName || null">
        <ng-content>{{ value }}</ng-content>
      </div>
      @if (caption) {
        <p class="mt-1 font-label text-label-md text-secondary">{{ caption }}</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricBlockComponent {
  @Input() label = ''
  @Input() value = ''
  @Input() caption = ''
  @Input() transitionName = ''
  @Input() className = ''
}
