import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

@Component({
  selector: 'app-data-card',
  standalone: true,
  template: `
    <section class="nm-raised rounded-xl p-5" [class]="className">
      @if (eyebrow) {
        <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">{{ eyebrow }}</p>
      }
      @if (title) {
        <h2 class="mt-2 font-display text-headline-sm font-semibold text-on-surface">{{ title }}</h2>
      }
      @if (caption) {
        <p class="mt-1 font-label text-label-md text-secondary">{{ caption }}</p>
      }
      <div [class.mt-4]="eyebrow || title || caption">
        <ng-content />
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataCardComponent {
  @Input() eyebrow = ''
  @Input() title = ''
  @Input() caption = ''
  @Input() className = ''
}
