import { bootstrapApplication } from '@angular/platform-browser'
import { ActivatedRouteSnapshot, provideRouter, withViewTransitions } from '@angular/router'
import { provideAnimations } from '@angular/platform-browser/animations'
import { provideLottieOptions } from 'ngx-lottie'
import player from 'lottie-web'
import { AppComponent } from './app/app.component'
import { routes } from './app/app.routes'

const routeOrder = [
  '/',
  '/register',
  '/onboarding',
  '/program/join',
  '/candidate/dashboard',
  '/candidate/profile',
  '/candidate/skills',
  '/jobs',
  '/jobs/:id',
  '/employer/dashboard',
  '/employer/retention',
  '/employer/salesforce',
  '/university/dashboard',
  '/university/outcomes',
  '/university/curriculum',
  '/university/students',
  '/university/program',
]

function snapshotPath(snapshot: ActivatedRouteSnapshot): string {
  const path = snapshot.pathFromRoot
    .flatMap((route) => route.url.map((segment) => segment.path))
    .filter(Boolean)
    .join('/')
  return path ? `/${path}` : '/'
}

function normalizePath(path: string): string {
  const cleanPath = path.split(/[?#]/)[0] || '/'
  return cleanPath.length > 1 ? cleanPath.replace(/\/+$/, '') : cleanPath
}

function routeRank(path: string): number {
  const normalizedPath = normalizePath(path)
  if (normalizedPath.startsWith('/jobs/')) return routeOrder.indexOf('/jobs/:id')
  if (normalizedPath.startsWith('/employer/candidate/')) return routeOrder.indexOf('/employer/dashboard') + 0.5
  const index = routeOrder.indexOf(normalizedPath)
  return index === -1 ? routeOrder.length : index
}

let activeRoutePath = normalizePath(window.location.pathname || '/')
let pendingRoutePath: string | null = null

document.addEventListener(
  'click',
  (event) => {
    const target = event.target
    if (!(target instanceof Element)) return

    const link = target.closest('a[href]')
    if (!(link instanceof HTMLAnchorElement)) return

    const url = new URL(link.href, window.location.href)
    if (url.origin === window.location.origin) {
      pendingRoutePath = normalizePath(url.pathname)
    }
  },
  true,
)

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(
      routes,
      withViewTransitions({
        skipInitialTransition: true,
        onViewTransitionCreated: ({ transition, to }) => {
          const fromPath = activeRoutePath
          const browserPath = normalizePath(window.location.pathname || '/')
          const snapshotTargetPath = normalizePath(snapshotPath(to))
          const toPath = pendingRoutePath ?? (browserPath !== fromPath ? browserPath : snapshotTargetPath)
          pendingRoutePath = null
          const direction = routeRank(toPath) >= routeRank(fromPath) ? 'forward' : 'backward'
          document.documentElement.classList.remove('route-forward', 'route-backward')
          document.documentElement.classList.add(`route-${direction}`)
          transition.types.add(direction)
          void transition.finished.finally(() => {
            activeRoutePath = toPath
            document.documentElement.classList.remove('route-forward', 'route-backward')
          })
        },
      }),
    ),
    provideAnimations(),
    provideLottieOptions({ player: () => player }),
  ],
})
