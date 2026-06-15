import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild, inject } from '@angular/core'
import * as d3 from 'd3'
import gsap from 'gsap'
import { MockDataService } from '../../../core/services/mock-data.service'

@Component({
  selector: 'app-university-outcomes',
  standalone: true,
  template: `
    <main class="mx-auto max-w-content px-6 py-8 lg:px-8">
      <section class="rounded-xl p-6 nm-raised">
        <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Lifelong outcome loop</p>
        <h1 class="mt-2 font-display text-headline-md text-on-surface">Graduate outcomes</h1>
        <p class="mt-2 max-w-3xl font-body text-body-md text-secondary">Where our graduates go, tracked for years — not just the first six months.</p>
      </section>

      <section class="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1.4fr)_340px]">
        <article class="rounded-xl p-6 nm-inset">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Program to outcome flow</p>
              <h2 class="mt-2 font-display text-headline-sm text-on-surface">Which programs feed which destinations</h2>
            </div>
            <span class="rounded-full px-3 py-1 font-mono text-label-sm text-secondary nm-raised-sm">{{ totalFlow }} graduates mapped</span>
          </div>
          <svg #sankeyEl class="mt-5 h-[520px] w-full" aria-label="Program to outcome Sankey flow"></svg>
        </article>

        <aside class="rounded-xl p-6 nm-raised">
          <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Engine note</p>
          <h2 class="mt-2 font-display text-headline-sm text-on-surface">Outcome signal returns to APU</h2>
          <p class="mt-4 font-body text-body-md text-secondary">
            Outcome data flows back from employer connectors — this is the loop that tells us which programs actually paid off.
          </p>
          <div class="mt-6 space-y-3">
            @for (item of flowSummary; track item.label) {
              <div class="rounded-lg p-3 nm-inset">
                <p class="font-mono text-body-md text-primary">{{ item.value }}</p>
                <p class="font-label text-label-md text-secondary">{{ item.label }}</p>
              </div>
            }
          </div>
        </aside>
      </section>

      <section class="mt-6 rounded-xl p-6 nm-raised">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Longitudinal employment timeline</p>
            <h2 class="mt-2 font-display text-headline-sm text-on-surface">Relevant employment continues rising after graduation</h2>
          </div>
          <span class="rounded-full px-3 py-1 font-mono text-label-sm text-secondary nm-inset">0–5 years tracked</span>
        </div>
        <svg #timelineEl class="mt-5 h-80 w-full" aria-label="Employment timeline"></svg>
      </section>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UniversityOutcomesComponent implements AfterViewInit {
  @ViewChild('sankeyEl') private readonly sankeyEl?: ElementRef<SVGSVGElement>
  @ViewChild('timelineEl') private readonly timelineEl?: ElementRef<SVGSVGElement>

  protected readonly mock = inject(MockDataService)
  protected readonly totalFlow = this.mock.universityDashboard.flows.reduce((sum, flow) => sum + flow.value, 0)
  protected readonly flowSummary = [
    { value: '3', label: 'program families linked to employer outcomes' },
    { value: '5', label: 'destination clusters tracked beyond graduation' },
    { value: `${this.totalFlow}`, label: 'graduates in the current mapped cohort' },
  ]

  ngAfterViewInit() {
    Promise.resolve().then(() => {
      this.drawSankey()
      this.drawTimeline()
    })
  }

  private drawSankey(attempt = 0) {
    const chart = this.sankeyEl?.nativeElement
    if (!chart || chart.clientWidth === 0) {
      if (attempt < 6) setTimeout(() => this.drawSankey(attempt + 1), 50)
      return
    }

    const flows = this.mock.universityDashboard.flows
    const width = chart.clientWidth || 760
    const height = 520
    const margin = { top: 34, right: 178, bottom: 34, left: 176 }
    const programs = Array.from(new Set(flows.map((flow) => flow.program)))
    const outcomes = Array.from(new Set(flows.map((flow) => flow.outcome)))
    const programTotals = new Map(programs.map((program) => [program, flows.filter((flow) => flow.program === program).reduce((sum, flow) => sum + flow.value, 0)]))
    const outcomeTotals = new Map(outcomes.map((outcome) => [outcome, flows.filter((flow) => flow.outcome === outcome).reduce((sum, flow) => sum + flow.value, 0)]))
    const yProgram = d3.scalePoint<string>().domain(programs).range([88, height - 88]).padding(0.55)
    const yOutcome = d3.scalePoint<string>().domain(outcomes).range([68, height - 68]).padding(0.55)
    const stroke = d3.scaleLinear().domain([0, d3.max(flows, (flow) => flow.value) ?? 1]).range([8, 42])
    const svg = d3.select(chart)

    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${width} ${height}`).attr('preserveAspectRatio', 'xMidYMid meet')

    const xLeft = margin.left
    const xRight = width - margin.right
    const flowLayer = svg.append('g').attr('fill', 'none')

    const paths = flowLayer
      .selectAll('path')
      .data(flows)
      .join('path')
      .attr('class', 'sankey-flow')
      .attr('d', (flow) => {
        const y1 = yProgram(flow.program) ?? 0
        const y2 = yOutcome(flow.outcome) ?? 0
        const mid = (xLeft + xRight) / 2
        return `M${xLeft + 26},${y1} C${mid},${y1} ${mid},${y2} ${xRight - 26},${y2}`
      })
      .attr('stroke', '#916f6e')
      .attr('stroke-opacity', 0.28)
      .attr('stroke-width', (flow) => stroke(flow.value))
      .attr('stroke-linecap', 'round')
      .style('transition', 'stroke-opacity 160ms ease')
      .on('mouseenter', function () {
        d3.select(this).attr('stroke-opacity', 0.62)
      })
      .on('mouseleave', function () {
        d3.select(this).attr('stroke-opacity', 0.28)
      })

    paths.append('title').text((flow) => `${flow.program} -> ${flow.outcome}: ${flow.value}`)

    const leftNodes = svg.append('g').selectAll('g').data(programs).join('g').attr('transform', (program) => `translate(${xLeft - 140},${(yProgram(program) ?? 0) - 22})`)
    leftNodes.append('rect').attr('width', 136).attr('height', 44).attr('rx', 12).attr('fill', '#121c2a')
    leftNodes.append('text').attr('x', 12).attr('y', 18).attr('fill', '#ffffff').attr('font-family', 'Manrope').attr('font-size', 13).attr('font-weight', 700).text((program) => program)
    leftNodes.append('text').attr('x', 12).attr('y', 34).attr('fill', '#d9e3f6').attr('font-family', 'JetBrains Mono').attr('font-size', 11).text((program) => `${programTotals.get(program)} grads`)

    const rightNodes = svg.append('g').selectAll('g').data(outcomes).join('g').attr('transform', (outcome) => `translate(${xRight + 4},${(yOutcome(outcome) ?? 0) - 22})`)
    rightNodes.append('rect').attr('width', 148).attr('height', 44).attr('rx', 12).attr('fill', '#d8113a')
    rightNodes.append('text').attr('x', 12).attr('y', 18).attr('fill', '#ffffff').attr('font-family', 'Manrope').attr('font-size', 13).attr('font-weight', 700).text((outcome) => outcome)
    rightNodes.append('text').attr('x', 12).attr('y', 34).attr('fill', '#ffeceb').attr('font-family', 'JetBrains Mono').attr('font-size', 11).text((outcome) => `${outcomeTotals.get(outcome)} grads`)

    paths.each(function (_, index) {
      const path = this as SVGPathElement
      const length = path.getTotalLength()
      gsap.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 0.75, delay: 0.06 * index, ease: 'power2.out' })
    })
  }

  private drawTimeline(attempt = 0) {
    const chart = this.timelineEl?.nativeElement
    if (!chart || chart.clientWidth === 0) {
      if (attempt < 6) setTimeout(() => this.drawTimeline(attempt + 1), 50)
      return
    }

    const data = this.mock.universityDashboard.outcomeTimeline
    const width = chart.clientWidth || 960
    const height = 320
    const margin = { top: 22, right: 28, bottom: 42, left: 48 }
    const svg = d3.select(chart)
    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${width} ${height}`).attr('preserveAspectRatio', 'xMidYMid meet')

    const x = d3.scaleLinear().domain([0, 5]).range([margin.left, width - margin.right])
    const y = d3.scaleLinear().domain([50, 95]).range([height - margin.bottom, margin.top])
    const line = d3.line<{ year: number; employment: number }>().x((point) => x(point.year)).y((point) => y(point.employment)).curve(d3.curveMonotoneX)
    const area = d3.area<{ year: number; employment: number }>().x((point) => x(point.year)).y0(height - margin.bottom).y1((point) => y(point.employment)).curve(d3.curveMonotoneX)

    svg.append('g').attr('transform', `translate(0,${height - margin.bottom})`).call(d3.axisBottom(x).ticks(5).tickFormat((value) => `Y${value}`)).attr('color', '#555f6f')
    svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y).ticks(5).tickFormat((value) => `${value}%`)).attr('color', '#555f6f')
    svg.append('path').datum(data).attr('fill', '#d6e0f3').attr('opacity', 0.65).attr('d', area)
    const path = svg.append('path').datum(data).attr('fill', 'none').attr('stroke', '#d8113a').attr('stroke-width', 4).attr('stroke-linecap', 'round').attr('d', line)
    svg.selectAll('circle').data(data).join('circle').attr('cx', (point) => x(point.year)).attr('cy', (point) => y(point.employment)).attr('r', 4).attr('fill', '#ad002a')
    svg.selectAll('.timeline-label').data(data).join('text').attr('class', 'timeline-label').attr('x', (point) => x(point.year)).attr('y', (point) => y(point.employment) - 12).attr('text-anchor', 'middle').attr('font-family', 'JetBrains Mono').attr('font-size', 11).attr('fill', '#555f6f').text((point) => `${point.employment}%`)

    const node = path.node()
    if (!node) return
    const length = node.getTotalLength()
    gsap.fromTo(node, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.out' })
  }
}
