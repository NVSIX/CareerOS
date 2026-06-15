import { Routes } from '@angular/router'

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/landing/landing.component').then((m) => m.LandingComponent), data: { animation: 'landing' } },
  { path: 'program/join', loadComponent: () => import('./features/program/join/join.component').then((m) => m.JoinProgramComponent), data: { animation: 'program' } },
  { path: 'register', loadComponent: () => import('./features/candidate/register/register.component').then((m) => m.RegisterComponent), data: { animation: 'register' } },
  { path: 'onboarding', loadComponent: () => import('./features/candidate/onboarding/onboarding.component').then((m) => m.OnboardingComponent), data: { animation: 'onboarding' } },
  {
    path: 'candidate',
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/candidate/dashboard/dashboard.component').then((m) => m.DashboardComponent), data: { animation: 'candidate' } },
      { path: 'profile', loadComponent: () => import('./features/candidate/profile/profile.component').then((m) => m.ProfileComponent), data: { animation: 'candidate' } },
      { path: 'skills', loadComponent: () => import('./features/candidate/skills/skills.component').then((m) => m.SkillsComponent), data: { animation: 'candidate' } },
    ],
  },
  {
    path: 'jobs',
    children: [
      { path: '', loadComponent: () => import('./features/jobs/listing/listing.component').then((m) => m.ListingComponent), data: { animation: 'jobs' } },
      { path: ':id', loadComponent: () => import('./features/jobs/detail/detail.component').then((m) => m.DetailComponent), data: { animation: 'jobs' } },
    ],
  },
  {
    path: 'employer',
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/employer/dashboard/dashboard.component').then((m) => m.EmployerDashboardComponent), data: { animation: 'employer' } },
      { path: 'candidate/:id', loadComponent: () => import('./features/employer/candidate-view/candidate-view.component').then((m) => m.CandidateViewComponent), data: { animation: 'employer' } },
      { path: 'retention', loadComponent: () => import('./features/employer/retention/retention.component').then((m) => m.RetentionComponent), data: { animation: 'employer' } },
      { path: 'salesforce', loadComponent: () => import('./features/employer/salesforce/salesforce.component').then((m) => m.SalesforceComponent), data: { animation: 'employer' } },
    ],
  },
  {
    path: 'university',
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/university/dashboard/dashboard.component').then((m) => m.UniversityDashboardComponent), data: { animation: 'university' } },
      { path: 'outcomes', loadComponent: () => import('./features/university/outcomes/outcomes.component').then((m) => m.UniversityOutcomesComponent), data: { animation: 'university' } },
      { path: 'curriculum', loadComponent: () => import('./features/university/curriculum/curriculum.component').then((m) => m.UniversityCurriculumComponent), data: { animation: 'university' } },
      { path: 'students', loadComponent: () => import('./features/university/students/students.component').then((m) => m.UniversityStudentsComponent), data: { animation: 'university' } },
      { path: 'program', loadComponent: () => import('./features/university/program/program.component').then((m) => m.TalentBankProgramComponent), data: { animation: 'university' } },
    ],
  },
  { path: '**', redirectTo: '' },
]
