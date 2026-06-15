import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { fadeSlideUp } from '../../../core/animations/entrance.animations'

@Component({
  selector: 'app-coaching-card',
  standalone: true,
  animations: [fadeSlideUp],
  template: `
    <section class="nm-raised rounded-xl p-5" @fadeSlideUp>
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Trajectory Engine - coaching</p>
          <h2 class="mt-2 font-display text-headline-sm text-on-surface">Next best move</h2>
        </div>
        <span class="rounded-full px-3 py-1 font-mono text-label-sm text-secondary nm-inset">live signal</span>
      </div>
      <p class="mt-4 font-body text-body-md leading-7 text-on-surface">{{ body }}</p>
      @if (dataBasis) {
        <p class="mt-5 rounded-lg p-3 font-mono text-label-md text-secondary nm-inset">{{ dataBasis }}</p>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoachingCardComponent {
  @Input() body = ''
  @Input() dataBasis = ''
}
