# U5_DIRECTIONS — Three-Sided Exchange Build

Extends the Angular app in `careeros-angular/`. All V1–V4 protocols in force
(SESSION START/END, AMBIGUITY, SELF-HEALING, LOG GATE). Append a session entry
to careerOS-spec/AGENT_CONTEXT.md. Log phases U5-1…U5-7 in CODEX_LOG.md under a
new "Upgrade 5 phases" table.

## READING ORDER
U5_ARCHITECTURE.md → U5_MOCK_DATA.md → U5_DESIGN_UNIVERSITY.md → U5_SCREENS.md →
this file. Then prior context as needed: U4_DESIGN.md, U4_ANIMATION.md,
careerOS-spec/HANDOFF.md.

## NO NEW DEPENDENCIES
D3 (already installed) covers the Sankey and heatmap — build the Sankey with
d3-sankey IF it is already present; if not, build a simple custom SVG Sankey
(rects + bezier paths) by hand rather than adding the package. Heatmap is plain
divs/SVG. Radial rings are SVG circles with stroke-dashoffset. GSAP for all
animation. F8 holds: add nothing.
(If d3-sankey is genuinely required and absent, log under AUTONOMOUS DECISIONS
and build the custom-SVG Sankey instead — do not install.)

## BUILD CHECK
`ng build --configuration production` 0 errors at every LOG GATE.

---

# PHASES

## U5-1 — Data model + RoleSwitcher + routing
- MockDataService: add university account, Moodle data, TalentBank achievements,
  provenance model, all university dashboard data (U5_MOCK_DATA §1–§7).
- AppStateService: add `activePersona` signal including 'university'; university
  data is read-only mock (no localStorage writes needed beyond persona).
- 3-way RoleSwitcher; university sidebar; Dr. Lim persona badge.
- Add all 6 new routes as lazy-loaded shells.
⛔ LOG GATE: ng build 0 errors; all 6 new routes serve shells; RoleSwitcher
3-way works.

## U5-2 — University dashboard hub (U5_SCREENS §1)
Radial-ring metrics, connector strip, 2×2 entry cards, flywheel explainer strip.
⛔ LOG GATE.

## U5-3 — Outcomes sub-page (U5_SCREENS §2) ★
D3 Sankey (program→outcome) + longitudinal employment timeline. Flows draw in.
⛔ LOG GATE: Sankey renders with correct flows; timeline renders.

## U5-4 — Curriculum sub-page (U5_SCREENS §3) ★
Efficacy heatmap (colour-scaled, hover notes) + diverging skill-demand bars +
gapAlert callout.
⛔ LOG GATE: heatmap renders all modules with correct colour scale.

## U5-5 — Students board + Program view (U5_SCREENS §4, §5)
Readiness board (card/tile, rings not risk dots) + verified-orgs read view.
⛔ LOG GATE.

## U5-6 — Join the Program explainer (U5_SCREENS §6) ★
The marketing-grade public explainer page. Rich, self-explanatory, 4-step
"raw claim → verified → calibrated → trusted" flow visual, value-prop cards,
issuer examples, CTA modal.
⛔ LOG GATE.

## U5-7 — Candidate profile provenance + landing flywheel + integration
- Candidate profile: skill provenance chips + "Triangulated" badge + Verified
  Achievements card (U5_SCREENS §7).
- Landing: flywheel diagram + live audience-card routing + remove university
  "Stage 2" badge + program footer link (U5_SCREENS §8).
- Walk the full 3-persona demo: Candidate (with provenance) → Employer
  (Salesforce) → University (all sub-pages) → Join Program. Confirm the
  flywheel reads end to end.
- Consistency audit: Amira appears as candidate (profile), as employer pipeline
  row, AND as university student-readiness card — same person, three lenses.
- ng build production 0 errors. Purge grep for forbidden tokens.
⛔ FINAL LOG GATE: full done-criteria check; HANDOFF.md rewritten; AGENT_CONTEXT
session entry completed.

---

# U5 DONE CRITERIA
- [ ] ng build --configuration production 0 errors
- [ ] 3-way RoleSwitcher (Candidate/Employer/University) works from all surfaces
- [ ] University surface is visibly DISTINCT from employer (Sankey + heatmap +
      radial rings + sub-pages + readiness board, NOT pipeline/risk-dots) —
      verify against the checklist in U5_DESIGN_UNIVERSITY
- [ ] /university/dashboard hub with 4 radial metrics + connector strip + entry cards
- [ ] /university/outcomes Sankey renders with correct program→outcome flows
- [ ] /university/curriculum heatmap renders with correct efficacy colour scale +
      gap alert
- [ ] /university/students readiness board (rings, cards) with Amira first
- [ ] /university/program verified-orgs read view with coverage stats
- [ ] /program/join explainer is rich, self-explanatory, has the 4-step flow
      visual and CTA modal
- [ ] Candidate profile shows skill provenance (up to 3 sources) + Triangulated
      badge + Verified Achievements card with cohort calibration notes
- [ ] Landing flywheel diagram present, arrows labelled, audience cards route live
- [ ] Amira is consistent across candidate / employer / university lenses
- [ ] No new dependencies (F8); D3 Sankey is d3-sankey-if-present-else-custom-SVG
- [ ] CODEX_LOG.md (Upgrade 5 table), HANDOFF.md, AGENT_CONTEXT.md current

---

# KICKOFF PROMPT (paste verbatim into Codex/Claude Code)

```
Read every file in careerOS-upgrade-5/ in this exact order:
U5_ARCHITECTURE.md → U5_MOCK_DATA.md → U5_DESIGN_UNIVERSITY.md →
U5_SCREENS.md → U5_DIRECTIONS.md
Then read careerOS-spec/HANDOFF.md, careerOS-upgrade-4/U4_DESIGN.md,
and careerOS-upgrade-4/U4_ANIMATION.md for the existing system.

Then:
1. Append a new session entry to careerOS-spec/AGENT_CONTEXT.md
2. Build phases U5-1 through U5-7 sequentially without stopping
3. Hit every LOG GATE — update the "Upgrade 5 phases" table in
   careerOS-spec/CODEX_LOG.md and overwrite careerOS-spec/HANDOFF.md
   before each next phase; ng build --configuration production must pass
   0 errors at every gate
4. Use the AMBIGUITY PROTOCOL for anything unspecified — never ask
5. Use SELF-HEALING for errors — max 3 attempts then ScreenStub, continue
6. The run is complete when every U5 DONE CRITERIA item is met and
   evidenced by an actual tool result

HARD RULES:
Act, don't deliberate — every decision is in the spec.
Never end a turn on intent without issuing the tool call in the same turn.
Do not install any new dependency (F8). Build the Sankey with d3-sankey only
if already present, otherwise a custom SVG Sankey.
Do not modify careeros-prototype/ (React). All work is in careeros-angular/.
The university surface must NOT visually clone the employer Salesforce screen —
honour the checklist in U5_DESIGN_UNIVERSITY.md.
Re-read U4_DESIGN.md and U5_DESIGN_UNIVERSITY.md at the start of every screen phase.

Begin.
```
