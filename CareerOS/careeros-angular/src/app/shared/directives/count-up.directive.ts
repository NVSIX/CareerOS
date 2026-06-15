import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core'

@Directive({ selector: '[countUp]', standalone: true })
export class CountUpDirective implements AfterViewInit {
  @Input() countUp = 0
  @Input() duration = 900
  @Input() countUpPrefix = ''
  @Input() countUpSuffix = ''
  @Input() countUpDivisor = 1
  @Input() countUpDecimals = 0

  constructor(private readonly el: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
    if (document.documentElement.classList.contains('route-forward') || document.documentElement.classList.contains('route-backward')) {
      this.el.nativeElement.textContent = this.format(this.countUp)
      return
    }

    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / this.duration, 1)
      this.el.nativeElement.textContent = this.format(progress * this.countUp)
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }

  private format(value: number) {
    const display = value / this.countUpDivisor
    return `${this.countUpPrefix}${display.toFixed(this.countUpDecimals)}${this.countUpSuffix}`
  }
}
