import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'

@Component({
  selector: 'app-screen-stub',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="min-h-screen bg-surface px-6 py-10 text-on-surface">
      <section class="nm-raised mx-auto max-w-3xl rounded-xl p-8">
        <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">
          CareerOS Angular scaffold
        </p>
        <h1 class="mt-3 font-display text-headline-md text-on-surface">
          {{ title }}
        </h1>
        <p class="mt-2 font-body text-body-md text-secondary">
          Specified in U4_SCREENS.md §{{ spec }}
        </p>
        <a
          routerLink="/"
          class="nm-button mt-6 inline-flex rounded-lg bg-primary-container px-5 py-2.5 font-display text-label-lg font-semibold text-on-primary hover:bg-primary"
        >
          Home
        </a>
      </section>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScreenStubComponent {
  private readonly route = inject(ActivatedRoute)
  protected readonly title = this.route.snapshot.data['title'] ?? 'Screen stub'
  protected readonly spec = this.route.snapshot.data['spec'] ?? '?'
}
