# HANDOFF - Current State Snapshot

Post-U5 UI/UX visual polish is complete. The active build target is the Angular
app in `careeros-angular/`. The React prototype in `careeros-prototype/`
remained out of scope and was not modified.

## Current State
- Current phase: Post-U5 UI/UX polish complete.
- Active app root: `careeros-angular/`.
- Mobile navigation/support remains excluded by prior user request.
- The running local URL is expected to be `http://127.0.0.1:4207/`, served from
  the production artifact by `careeros-angular/static-4207-server.cjs`.
- Salesforce connector state persists through `AppStateService` and is
  reflected on the employer dashboard.
- Employer dashboard now surfaces university/TalentBank source coverage as a
  full-width analytics band before the pipeline.
- University surfaces now have stronger hero analytics: larger radial metrics,
  a larger Sankey, clearer heatmap semantics, and a denser readiness board.

## Completed In This Pass
- Rebalanced Landing and Program Join heroes so content starts higher and the
  next section is visible in the first viewport.
- Enlarged the candidate skill-map canvas nodes, labels, icons, and edge
  weights.
- Rebuilt candidate profile edit into identity and evidence-model work zones.
- Widened registration into role selection plus a next-step rail.
- Improved the shared coaching card hierarchy.
- Moved employer university/TalentBank source coverage out of the crowded right
  rail and into a primary analytics band.
- Strengthened Salesforce connected-state risk visuals and mini charts.
- Replaced retention empty animation space with intervention-impact chips.
- Made employer candidate match analysis adapt to the selected candidate route.
- Enlarged university dashboard and TalentBank Program radial metrics.
- Enlarged the university outcomes Sankey and labels.
- Reworked curriculum heatmap scale into distinct 4-band semantics.
- Added university student readiness summary, larger rings, and signal-driver
  panels.
- Cleared GSAP target warnings by moving Program Join animation to
  `AfterViewInit` and guarding absent profile segment animations.

## Verification Evidence
- Final production build: `npm.cmd run build -- --configuration production`
  completed with 0 errors.
- Build warnings only:
  generated main bundle uses `eval`; initial bundle exceeds the 500 kB warning
  budget by 238.40 kB; `lottie-web` CommonJS optimization bailout.
- Headless Chrome CDP against `http://127.0.0.1:4207/` captured screenshots for
  landing, register, program join, candidate dashboard/profile/skills, employer
  Salesforce/dashboard/retention/candidate detail, and all university pages.
- Route metrics from the screenshot pass found no horizontal overflow, no
  `undefined`, and no `NaN`.
- Final reshoot captured landing, program join, candidate skills, and candidate
  profile edit after the last tweaks; GSAP warnings were cleared. Remaining
  console noise was sandbox `ERR_NETWORK_ACCESS_DENIED` resource fetches only.
- Screenshot artifacts:
  `careeros-angular/ui-polish-20260615/`
  and `careeros-angular/ui-polish-20260615-reshoot/`.

## Useful Commands
- Production build: from `careeros-angular/`, run
  `npm.cmd run build -- --configuration production`.
- Serve production artifact on the expected URL:
  `node static-4207-server.cjs dist/careeros-angular/browser 4207`.
- Stale launch-copy scan:
  `rg -n "Stage 2|STAGE 2|Stage 1 prototype|Beta" src/app`.

## Notes For Next Agent
- Known warnings are inherited and non-blocking: generated eval, initial bundle
  warning budget, and `lottie-web` CommonJS bailout.
- `ng serve` previously failed in this sandbox with an access-denied watcher
  error; production artifact checks on `4207` are the reliable verification path.
- No npm install was run, and no new dependencies were added.
