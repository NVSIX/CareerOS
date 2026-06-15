# UPGRADE_SCREEN_SPECS — New Screens & Amendments

Additive to SCREEN_SPECS.md. V1 screen specs remain valid except where
amended here. All visuals per DESIGN_SYSTEM_V2.md. All data per
MOCK_DATA_V2.md (and V1 MOCK_DATA.md for existing entities).

## Updated routing table (final — F3 amended)
```
/                              Landing                    (no sidebar)
/register                      Register          NEW      (no sidebar)
/onboarding                    OnboardingDiagnostic       (no sidebar)
/candidate/profile             CandidateProfile  AMENDED
/candidate/skills              SkillTree         NEW ★
/jobs                          JobListings
/jobs/:id                      JobDetail         AMENDED
/employer/dashboard            EmployerDashboard AMENDED
/employer/candidate/:id        EmployerCandidateView AMENDED
/employer/retention            RetentionDetail   NEW
/employer/salesforce           SalesforceConnector
*                              → /
```
Sidebar (AppShell V2) appears on all routes EXCEPT /, /register, /onboarding.

---

## §U1 `/register` — NEW
Purpose: compulsory core feature #1, currently bypassed.
Layout: single centered column, max-w-2xl. Heading + subline (MOCK_DATA_V2 §1)
→ two large role tiles side by side (stack on mobile): each `layer-raised
rounded-2xl p-6`, lucide icon in a `layer-inset rounded-full` circle (navy),
title (display bold secondary), desc (caption). Click selects: selected tile
gets `layer-pressed` + 2px primary ring; the other returns to raised. Default:
none selected → form below is disabled/dimmed until a role is chosen.
Below tiles: Full name + Work email inputs (`layer-inset rounded-full px-4
py-2`, no validation) → primary pill "Get started" → routes per role.
Footnote caption at bottom.
Aha: even sign-up feels considered — tactile tiles, no generic form page.

## §U2 `/candidate/skills` — SKILL TREE — NEW ★ HIGH COMPLEXITY
Purpose: Career Path Navigator made visual. The screen judges remember.
Layout: BentoGrid. Page title "Skill map" + intro line (MOCK_DATA_V2 §2).
LEFT (lg:col-span-8): the canvas — a `layer-inset rounded-2xl p-4` well
containing ONE `<svg viewBox="0 0 800 620" className="w-full h-auto">`.
RIGHT (lg:col-span-4): node detail card + legend card.

SVG construction (pure SVG + React state, NO libraries):
1. Render edges first (so nodes sit on top): `<line>` per edge from
   MOCK_DATA_V2 §2 with the three styling rules (solid navy / dashed primary
   / dashed #c9c4b8).
2. Render nodes as `<g onClick={...} className="cursor-pointer">`:
   - unlocked: `<circle r="18" fill="#112250">` + first letter of label in
     8px JetBrains Mono fill #faf9f4 centered.
   - available: `<circle r="18" fill="#faf9f4" stroke="#d8113a"
     strokeWidth="2">` + an outer pulse ring `<circle r="24" stroke="#d8113a"
     fill="none">` with a CSS keyframe animating opacity 0.35→0 and r via
     transform scale (2s infinite).
   - locked: `<circle r="16" fill="#e9e8e3" stroke="#c9c4b8">` + lucide Lock
     rendered as a tiny foreignObject OR a simple padlock path — use a 8px
     mono "×"-free fallback: a 6px rect+arc padlock path in #6B6557.
   - milestone (core): `<rect width="30" height="30" rx="4"
     transform="rotate(45)">` navy diamond, centered on its x,y.
   - selected node (any state): additional ring `<circle r="26"
     stroke="#112250" strokeWidth="1.5" strokeDasharray="2 3">`.
3. Labels: `<text>` 11px Inter fill #1b1c19 below each node (y+34),
   textAnchor middle. Two-word labels may wrap via two tspans.
State: `selectedNodeId` (default "a1" so the detail panel is never empty) and
`plannedNodeIds` (Set). Clicking a node selects it.
Detail card (right, `layer-raised`): node label (section header), state Badge
(unlocked→accent "Verified/Evidenced", available→primary "Available next",
locked→neutral "Locked", milestone→secondary-container "Core"), then rows:
Requires / Unlocks / Cohort / Time to reach (values mono). Available nodes:
primary pill "Add to career plan" → on click swaps to Badge "Planned" and
adds a small primary dot ring on the node in the SVG.
Legend card below detail: the four node states with mini-visuals + labels.
Footer caption under canvas: engine caption from MOCK_DATA_V2 §2.
Entry points: sidebar "Skill map"; plus a secondary pill "View skill map" in
the candidate profile header block.
Aha: a career rendered as a game tech-tree, grounded in cohort numbers.

## §U3 `/candidate/profile` — AMENDED (scenario cards)
The right column becomes: Trajectory chart well (top) → scenario cards row →
CoachingCard (unchanged, below).
Scenario cards: three compact cards in a row (stack <lg). Each `layer-raised
rounded-xl p-4 cursor-pointer`: tag eyebrow (mono 9px) + label (semibold
secondary, sm). Selected: `layer-pressed` + `border-l-4 border-l-primary`.
Default selected: "current".
Behavior: selecting a card swaps ONLY the projection dataset fed to
TrajectoryChart (actual + cohort static) — Recharts animates the morph
(default animation, ~300ms). Below the cards: an insight line that swaps with
the scenario — `font-body text-sm` + basis caption (mono data values inside
kept mono). No new chart component; TrajectoryChart takes projection as prop.
Also: add secondary pill "View skill map" → /candidate/skills in the header
block (right-aligned).
Aha: the projection line physically morphing between futures.

## §U4 `/jobs/:id` — AMENDED (pay benchmark tab)
Right panel gains a two-tab control above its content: "Match analysis"
(existing EngineCard content, default) | "Pay benchmark" (new). Tabs are
pills; active `layer-pressed text-secondary font-semibold`, inactive
`text-txt-dim`. Tab state local.
Pay benchmark tab (MOCK_DATA_V2 §4):
1. Band scale: a `layer-inset rounded-2xl p-5` well containing a horizontal
   0–9,000 scale built from divs — a 6px full-width track (`bg-elevated
   rounded-full`), P25/P50/P75 tick markers (2px navy bars + mono labels
   below), the offer bracket rendered as a primary-red translucent band
   (`bg-primary/15 border-x-2 border-primary`) spanning 5,800–7,200, and the
   anchor as an accent dot + mono "RM 6,600" label above the track.
   Percent positions: left = value/9000*100%.
2. Position note (body text) + anchor basis (caption).
3. Statutory DataCard: 5 mono key-value rows, take-home row emphasised
   (`text-secondary font-semibold`), employerLine as a final caption.
Aha: exact RM take-home with EPF/SOCSO/EIS/PCB — localisation no other
team will have.

## §U5 `/employer/dashboard` — AMENDED
1. Pipeline table gains "Flight risk" column (after Onboarding risk): dot +
   mono label per MOCK_DATA_V2 §5a. Kevin Raj's row becomes clickable →
   /employer/retention (hover state like Amira's). Amira's row unchanged.
2. Right panel order becomes: 84% MetricBlock → health Badge → "Needs
   attention" card (Kevin's line now reads "3 flight-risk signals — view
   retention detail", clickable → /employer/retention) → NEW Silver
   medalists card (§5b; "Re-engage" → Badge "Invited", local state) →
   Connect Salesforce card → NEW Workforce signals card (§5c) at the bottom.

## §U6 `/employer/retention` — NEW
Purpose: Talent Retention Signals as a full module.
Layout: BentoGrid. Header (MOCK_DATA_V2 §6) + back link "← Dashboard".
LEFT (lg:col-span-7): "Signal timeline" DataCard — 4 signal rows (lucide icon
in a `layer-inset rounded-full` 36px circle, label semibold, date mono
caption, severity Badge right). Newest first. Vertical hairline connecting
the icon circles (a 2px `bg-separator` absolute line).
RIGHT (lg:col-span-5): EngineCard "Retention outlook" — "67%" big mono in
danger + "90-day churn probability" eyebrow, reasoning body, basis caption.
Below: "Recommended actions" DataCard — 2 numbered rows with captions, row 2
carries secondary pill "View pay benchmark" → /jobs/job-001.
Privacy footnote caption at the very bottom of the right column.
Aha: 67% churn probability with the pattern explained — post-hire
intelligence employers don't have today.

## §U7 `/employer/candidate/cand-001` — AMENDED
Below the existing "Onboarding outlook" chart in the right column: the
"First 60 days outlook" section (MOCK_DATA_V2 §7) — eyebrow + 3 milestone
cards in a row (stack <lg): each `layer-raised rounded-xl p-4`, status dot +
period label (semibold, sm) + note (caption).

## §U8 `/` Landing — AMENDED
1. CTA row: primary pill "Create your profile" → /register, secondary pill
   "See how it works" → /onboarding.
2. "Scoped for Stage 2" strip per MOCK_DATA_V2 §8 above the footer.
3. Full V2 restyle (warm system) like every other screen.
```
