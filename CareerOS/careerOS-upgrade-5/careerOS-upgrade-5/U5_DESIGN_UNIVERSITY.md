# U5_DESIGN_UNIVERSITY — University Surface Visual Language

The university surface must feel DISTINCT from the employer Salesforce
dashboard. Same design system tokens (U4_DESIGN.md — neumorphic, red/navy/
cream), but a different spatial and chart rhythm so a judge never feels they're
looking at a recoloured employer screen.

---

## Contrast principles

EMPLOYER surface (existing): operational, dense, real-time. Tables, risk dots,
pipeline rows, metric cards in a tight grid, a "command center" feel.

UNIVERSITY surface (new): analytical, longitudinal, exploratory. Flows over
tables. Heatmaps over rows. Timelines over snapshots. More white space, larger
visualisations, fewer simultaneous numbers. A "research instrument" feel.

Concretely, the university surface MUST use these chart types (the employer
surface does NOT use them, preventing overlap):
- A Sankey-style program→outcome flow (D3) — the signature university viz.
- A curriculum efficacy HEATMAP (grid of modules × efficacy, colour-scaled).
- A horizontal diverging bar for rising vs declining skill demand.
- A longitudinal outcome timeline (not the employer's trajectory line).

The employer surface keeps: pipeline table, risk dots, metric cards with
sparklines, the Salesforce connector state machine.

---

## Layout strategy — USE SUB-PAGES

Do not squeeze all university content onto one dashboard. Structure as a hub +
sub-pages, each a distinct route:

```
/university/dashboard   Overview hub — 4 headline metrics + entry cards to
                        each sub-page + the data-source connector strip
/university/outcomes    Edge C view 1 — Sankey program→outcome flow +
                        longitudinal employment timeline (Lifelong Outcome Loop)
/university/curriculum  Edge C view 2 — efficacy heatmap + rising/declining
                        skill demand (Future-State Curriculum Engine)
/university/students    Edge B view — live student readiness board
                        (Adaptive Readiness Profile, university-side)
/university/program     The TalentBank Program management view — verified orgs
                        list + coverage stats (read-only, passive records)
```

The dashboard hub uses large tappable entry cards (not a cramped grid) that
route to each sub-page. This is the "use sub-pages liberally" mandate.

---

## University dashboard hub layout

Top: persona-framed header "Asia Pacific University" + Dr. Lim sub-line +
connector strip (Moodle · APSpace SIS · TalentBank Program — each a small
nm-raised-sm chip with a connected dot + record count).

Four headline metric cards (distinct from employer's — use ring/radial
progress indicators here, NOT the employer's horizontal bars):
- Graduate employment rate 87% (radial ring)
- Median time to hire 2.4 months (radial ring)
- Verified achievement coverage 64% (radial ring)
- Curriculum alignment score 78 (radial ring)

Below: four large entry cards (2×2), each routing to a sub-page, each with a
representative mini-visual (a tiny sankey hint, a heatmap swatch grid, a
readiness sparkline, a verified-org count). Generous padding, large titles.

Bottom: a "How APU contributes to the exchange" explainer strip — three short
columns showing what APU's data gives to Candidates, to Employers, and back to
itself. Reinforces the flywheel.

---

## Chart styling (within the token system)

- Sankey: nodes navy (#112250) and primary (#d8113a) by side; flows in
  translucent secondary with hover-highlight. Labels JetBrains Mono for values.
- Heatmap: efficacy 0–40 = surface-container-high (cool/empty), 41–70 =
  primary-fixed (mid), 71–100 = primary (hot). Each cell shows module code +
  mono efficacy number. Hover reveals the note.
- Diverging skill bars: rising = primary, declining = secondary, centered axis.
- Radial rings: primary stroke, surface-container-high track, mono % center.
- Outcome timeline: horizontal, year markers, employment-rate area under line.

GSAP: rings animate fill on mount (stroke-dashoffset), heatmap cells stagger-in,
sankey flows draw on mount. Same animation grammar as the rest of the app.

---

## What MUST differ from the Salesforce screen — explicit checklist
- [ ] No pipeline-style table as the primary element (students board is a
      card/tile board, not a dense row table)
- [ ] No risk dots (university uses readiness rings/scores instead)
- [ ] Uses Sankey + heatmap (employer surface has neither)
- [ ] Sub-page architecture (employer dashboard is single-page)
- [ ] Radial metrics (employer uses horizontal bar metrics)
- [ ] Analytical/longitudinal tone, more whitespace, larger visualisations
