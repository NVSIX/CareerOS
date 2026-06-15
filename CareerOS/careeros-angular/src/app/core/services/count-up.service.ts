import { ElementRef, Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class CountUpService {
  countUp(el: ElementRef<HTMLElement>, target: number, duration = 900) {
    if (document.documentElement.classList.contains('route-forward') || document.documentElement.classList.contains('route-backward')) {
      el.nativeElement.textContent = Math.round(target).toString()
      return
    }

    const start = performance.now()
    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      el.nativeElement.textContent = Math.round(progress * target).toString()
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }
}
