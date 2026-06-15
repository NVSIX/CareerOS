import { AfterViewInit, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { GitBranch, LocateFixed, Lock, LucideAngularModule, Plus, Star, ZoomIn, ZoomOut } from 'lucide-angular'
import { gsap } from 'gsap'
import { slideInRight } from '../../../core/animations/entrance.animations'
import { SkillNode } from '../../../core/models/types'
import { AppStateService } from '../../../core/services/app-state.service'
import { MockDataService } from '../../../core/services/mock-data.service'
import { BadgeComponent } from '../../../shared/components/badge/badge.component'

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [LucideAngularModule, BadgeComponent],
  animations: [slideInRight],
  template: `
    <main class="mx-auto max-w-content px-6 py-10">
      <div class="mb-5">
        <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Trajectory Engine</p>
        <h1 class="mt-2 font-display text-headline-md text-on-surface">Skill map</h1>
        <p class="font-body text-body-md text-secondary">{{ tree.intro }}</p>
      </div>

      <div class="mb-4 flex flex-wrap gap-3">
        @for (item of legend; track item.label) {
          <span class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 nm-raised-sm">
            <span class="h-3 w-3 rounded-full" [class]="item.className"></span>
            <span class="font-label text-label-md text-secondary">{{ item.label }}</span>
          </span>
        }
      </div>

      <section class="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <div class="relative h-[680px] overflow-hidden rounded-xl skill-tree-canvas nm-inset">
            <div class="node-container relative h-full w-full origin-center" [style.transform]="'scale(' + zoomLevel() + ')'">
              <svg class="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 800 620" preserveAspectRatio="none">
                @for (edge of tree.edges; track edge[0] + edge[1]) {
                  <line
                    class="edge-line"
                    [attr.x1]="nodeX(edge[0])"
                    [attr.y1]="nodeY(edge[0])"
                    [attr.x2]="nodeX(edge[1])"
                    [attr.y2]="nodeY(edge[1])"
                    [attr.stroke]="edgeStroke(edge[1])"
                    [attr.stroke-width]="edgeWidth(edge[1])"
                    [attr.stroke-dasharray]="edgeDash(edge[1])"
                  />
                }
              </svg>

              @for (node of tree.nodes; track node.id) {
                <button
                  type="button"
                  class="skill-node absolute min-w-[132px] -translate-x-1/2 -translate-y-1/2 rounded-xl p-4 text-center transition-transform"
                  [class.core]="node.state === 'milestone'"
                  [class.inner-ring]="node.state === 'unlocked'"
                  [class.outer-ring]="node.state !== 'unlocked' && node.state !== 'milestone'"
                  [class.nm-raised]="node.state !== 'milestone'"
                  [class.bg-primary]="node.state === 'milestone'"
                  [class.text-on-primary]="node.state === 'milestone'"
                  [class.opacity-60]="node.state === 'locked'"
                  [class.ring-2]="node.state === 'available'"
                  [class.ring-primary]="node.state === 'available'"
                  [class.scale-105]="selectedNode()?.id === node.id"
                  [style.left.%]="node.x / 8"
                  [style.top.%]="node.y / 6.2"
                  (click)="selectNode(node)"
                >
                  @if (node.state === 'available') {
                    <span class="pulse-ring absolute inset-0 rounded-xl bg-primary"></span>
                  }
                  @if (isPlanned(node.id)) {
                    <span class="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary"></span>
                  }
                  <lucide-icon [img]="iconFor(node)" [size]="24" class="mx-auto mb-2" />
                  <span class="block font-label text-body-sm font-semibold leading-5">{{ node.label }}</span>
                </button>
              }
            </div>

            <div class="absolute bottom-4 left-4 grid gap-2">
              <button type="button" class="rounded-lg p-2 nm-raised-sm" aria-label="Zoom in" (click)="zoomIn()"><lucide-icon [img]="ZoomInIcon" [size]="18" /></button>
              <button type="button" class="rounded-lg p-2 nm-raised-sm" aria-label="Zoom out" (click)="zoomOut()"><lucide-icon [img]="ZoomOutIcon" [size]="18" /></button>
              <button type="button" class="rounded-lg p-2 nm-raised-sm" aria-label="Focus" (click)="focus()"><lucide-icon [img]="FocusIcon" [size]="18" /></button>
            </div>
          </div>
          <p class="mt-4 font-mono text-label-md text-secondary">{{ tree.engineCaption }}</p>
        </div>

        <aside>
          @if (selectedNode(); as node) {
            <section class="rounded-xl p-5 nm-raised" @slideInRight>
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="font-mono text-[10px] uppercase tracking-[0.08em] text-secondary">Node detail</p>
                  <h2 class="mt-2 font-display text-headline-sm font-semibold text-on-surface">{{ node.label }}</h2>
                </div>
                <app-badge [variant]="node.state === 'available' ? 'primary' : 'neutral'">{{ node.state }}</app-badge>
              </div>

              <div class="mt-5 space-y-4">
                <div>
                  <p class="font-label text-label-md text-secondary">Requirements</p>
                  <p class="font-body text-body-sm text-on-surface">{{ requirements(node) }}</p>
                </div>
                <div>
                  <p class="font-label text-label-md text-secondary">Unlocks</p>
                  <p class="font-body text-body-sm text-on-surface">{{ detailValue(node.id, 'unlocks') || detailValue(node.id, 'strengthens') || 'Evidence density' }}</p>
                </div>
                <div>
                  <p class="font-label text-label-md text-secondary">Cohort</p>
                  <p class="font-mono text-body-sm text-on-surface">{{ detailValue(node.id, 'cohort') || '1,240 comparable trajectories' }}</p>
                </div>
                <div>
                  <p class="font-label text-label-md text-secondary">Time to reach</p>
                  <p class="font-mono text-body-sm text-on-surface">{{ detailValue(node.id, 'timeToReach') || 'Active now' }}</p>
                </div>
              </div>

              @if (node.state === 'available' && !isPlanned(node.id)) {
                <button type="button" class="nm-button mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-container px-5 py-2.5 font-display text-label-lg font-semibold text-on-primary" (click)="planNode(node.id, $event)">
                  <lucide-icon [img]="PlusIcon" [size]="18" />
                  {{ tree.actionLabel }}
                </button>
              } @else if (isPlanned(node.id)) {
                <div class="mt-6"><app-badge variant="primary">Planned</app-badge></div>
              }
            </section>
          }
        </aside>
      </section>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsComponent implements AfterViewInit {
  protected readonly state = inject(AppStateService)
  private readonly mock = inject(MockDataService)
  protected readonly tree = this.mock.skillTree
  protected readonly selectedNode = signal<SkillNode | null>(this.tree.nodes.find((node) => node.id === 'a1') ?? null)
  protected readonly zoomLevel = signal(1)
  protected readonly StarIcon = Star
  protected readonly LockIcon = Lock
  protected readonly GitBranchIcon = GitBranch
  protected readonly PlusIcon = Plus
  protected readonly ZoomInIcon = ZoomIn
  protected readonly ZoomOutIcon = ZoomOut
  protected readonly FocusIcon = LocateFixed
  protected readonly legend = [
    { label: 'Core', className: 'bg-primary' },
    { label: 'Unlocked', className: 'bg-secondary' },
    { label: 'Available', className: 'bg-primary-container' },
    { label: 'Locked', className: 'bg-surface-dim' },
  ]

  ngAfterViewInit() {
    gsap.from('.skill-node.core', { scale: 0.6, opacity: 0, duration: 0.4 })
    gsap.from('.skill-node.inner-ring', { scale: 0.6, opacity: 0, duration: 0.4, stagger: 0.07, delay: 0.15 })
    gsap.from('.skill-node.outer-ring', { scale: 0.6, opacity: 0, duration: 0.4, stagger: 0.07, delay: 0.3 })
    const lines = document.querySelectorAll('.edge-line')
    lines.forEach((line, index) => {
      const svgLine = line as SVGLineElement
      const length = svgLine.getTotalLength?.() ?? 80
      gsap.fromTo(svgLine, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 0.5, delay: 0.35 + index * 0.04, ease: 'power2.out' })
    })
  }

  selectNode(node: SkillNode) {
    this.selectedNode.set(node)
  }

  nodeX(id: string) {
    return this.tree.nodes.find((node) => node.id === id)?.x ?? 0
  }

  nodeY(id: string) {
    return this.tree.nodes.find((node) => node.id === id)?.y ?? 0
  }

  edgeStroke(targetId: string) {
    const target = this.tree.nodes.find((node) => node.id === targetId)
    if (target?.state === 'available') return '#d8113a'
    if (target?.state === 'locked') return '#c9c4b8'
    return '#555f6f'
  }

  edgeWidth(targetId: string) {
    const state = this.tree.nodes.find((node) => node.id === targetId)?.state
    if (state === 'locked') return 2
    if (state === 'available') return 3.25
    return 2.75
  }

  edgeDash(targetId: string) {
    const target = this.tree.nodes.find((node) => node.id === targetId)
    return target?.state === 'available' || target?.state === 'locked' ? '8 6' : ''
  }

  iconFor(node: SkillNode) {
    if (node.state === 'milestone') return this.StarIcon
    if (node.state === 'locked') return this.LockIcon
    return this.GitBranchIcon
  }

  isPlanned(id: string) {
    return this.state.plannedNodes().includes(id)
  }

  detailValue(id: string, key: 'unlocks' | 'strengthens' | 'cohort' | 'timeToReach') {
    return this.tree.detail[id]?.[key] ?? ''
  }

  requirements(node: SkillNode) {
    const detail = this.tree.detail[node.id]
    if (!detail) {
      const source = this.state.skills().find((skill) => skill.name === node.skill)?.source
      return source ?? 'This node is already active in your portfolio.'
    }
    if (detail.gatedBySkillId) {
      const skill = this.state.skills().find((item) => item.id === detail.gatedBySkillId)
      if (skill && skill.state !== 'asserted' && detail.requiresMet) return detail.requiresMet
    }
    return detail.requires ?? detail.source ?? 'This node is already active in your portfolio.'
  }

  planNode(id: string, event: MouseEvent) {
    this.state.planNode(id)
    this.emitBurst(event.clientX, event.clientY)
  }

  zoomIn() {
    const next = Math.min(this.zoomLevel() + 0.2, 2)
    this.zoomLevel.set(next)
    gsap.to('.node-container', { scale: next, duration: 0.3 })
  }

  zoomOut() {
    const next = Math.max(this.zoomLevel() - 0.2, 0.5)
    this.zoomLevel.set(next)
    gsap.to('.node-container', { scale: next, duration: 0.3 })
  }

  focus() {
    this.zoomLevel.set(1)
    gsap.to('.node-container', { scale: 1, duration: 0.3 })
  }

  private emitBurst(x: number, y: number) {
    for (let index = 0; index < 8; index += 1) {
      const particle = document.createElement('span')
      particle.className = 'fixed z-50 h-1.5 w-1.5 rounded-full bg-primary pointer-events-none'
      particle.style.left = `${x}px`
      particle.style.top = `${y}px`
      document.body.appendChild(particle)
      const angle = (index / 8) * Math.PI * 2
      gsap.to(particle, {
        x: Math.cos(angle) * 40,
        y: Math.sin(angle) * 40,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out',
        onComplete: () => particle.remove(),
      })
    }
  }
}
