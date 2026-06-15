import {
  animate,
  keyframes,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations'

export const fadeSlideUp = trigger('fadeSlideUp', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(12px)' }),
    animate('250ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
  ]),
])

export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('200ms ease-out', style({ opacity: 1 })),
  ]),
])

export const listStagger = trigger('listStagger', [
  transition('* => *', [
    query(
      ':enter',
      [
        style({ opacity: 0, transform: 'translateY(8px)' }),
        stagger(50, animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))),
      ],
      { optional: true },
    ),
  ]),
])

export const slideInRight = trigger('slideInRight', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(100%)' }),
    animate('250ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(100%)' })),
  ]),
])

export const evidenceFlip = trigger('evidenceFlip', [
  transition('asserted => evidence', [
    animate(
      '300ms',
      keyframes([
        style({ transform: 'scale(1)', offset: 0 }),
        style({ transform: 'scale(1.5)', offset: 0.5 }),
        style({ transform: 'scale(1)', offset: 1 }),
      ]),
    ),
  ]),
  transition('evidence => verified', [
    animate(
      '250ms',
      keyframes([
        style({ transform: 'scale(1)', offset: 0 }),
        style({ transform: 'scale(1.4)', offset: 0.5 }),
        style({ transform: 'scale(1)', offset: 1 }),
      ]),
    ),
  ]),
])

export const stepTransition = trigger('stepTransition', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(24px)' }),
    animate('200ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
  ]),
  transition(':leave', [
    animate('150ms ease-in', style({ opacity: 0, transform: 'translateX(-24px)' })),
  ]),
])

export const tabCrossfade = trigger('tabCrossfade', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('150ms 50ms ease-out', style({ opacity: 1 })),
  ]),
  transition(':leave', [animate('100ms ease-in', style({ opacity: 0 }))]),
])

export const stepFill = trigger('stepFill', [
  transition('inactive => active', [
    style({ backgroundColor: '#eceef2' }),
    animate('300ms ease-out', style({ backgroundColor: '#ffeceb' })),
  ]),
  transition('active => complete', [
    animate('200ms ease-out', style({ backgroundColor: '#d8113a' })),
  ]),
])

export const checkmarkPop = trigger('checkmarkPop', [
  transition('* => done', [
    style({ transform: 'scale(0)' }),
    animate('200ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ transform: 'scale(1)' })),
  ]),
])
