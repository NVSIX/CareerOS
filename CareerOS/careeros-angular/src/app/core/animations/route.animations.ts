import { transition, trigger } from '@angular/animations'

export const routeAnimations = trigger('routeAnimations', [
  transition('* <=> *', []),
])
