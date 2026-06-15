# CareerOS Prototype — Spec Package

Talentbank Tech Hackathon 2026 · Stage 1 clickable prototype.
9 spec files, designed for a ONE-PROMPT autonomous build by Claude Code or
Codex, with seamless mid-build agent switching via AGENT_CONTEXT.md +
HANDOFF.md + CODEX_LOG.md.

## File map
| File                 | Job                                                    |
|----------------------|--------------------------------------------------------|
| DIRECTIONS.md        | Master build instructions, phases 0–9, all protocols   |
| FROZEN_DECISIONS.md  | Locked decisions — read first, never revisit           |
| DESIGN_SYSTEM.md     | Tokens, components, usage rules — re-read every screen |
| MOCK_DATA.md         | Every entity and line of copy — single source of truth |
| SCREEN_SPECS.md      | All 8 screens + routing; state machines for the 2 ★    |
| DEMO_FLOW.md         | The judge click path the build must protect            |
| AGENT_CONTEXT.md     | Session log — agents append on start, complete on end  |
| CODEX_LOG.md         | Running build log + phase table + autonomous decisions |
| HANDOFF.md           | Current-state snapshot, overwritten at every LOG GATE  |

## THE KICKOFF PROMPT (paste into Claude Code or Codex, verbatim)

```
Read every file in careerOS-spec/ in this exact order:
FROZEN_DECISIONS.md → DESIGN_SYSTEM.md → MOCK_DATA.md → SCREEN_SPECS.md →
DEMO_FLOW.md → DIRECTIONS.md.

Then:
1. Complete the SESSION START PROTOCOL in DIRECTIONS.md
2. Build Phase 0 through Phase 9 sequentially without stopping
3. Hit every LOG GATE — no phase begins until the previous gate is complete
4. Follow the AMBIGUITY PROTOCOL for anything unspecified — never ask me
5. Follow the SELF-HEALING rules for any error
6. The build is complete only when every DONE CRITERIA item is checked

Begin.
```

## Switching agents mid-build
Stop the current agent (it runs the SESSION END PROTOCOL — if it was killed
abruptly, the last LOG GATE is still current). Open the other agent and paste:

```
Resume the build in careerOS-prototype/. Read, in order:
careerOS-spec/AGENT_CONTEXT.md → HANDOFF.md → CODEX_LOG.md →
FROZEN_DECISIONS.md → DIRECTIONS.md.
Complete the SESSION START PROTOCOL, then continue from the phase and step
HANDOFF.md names. Same rules: LOG GATEs, AMBIGUITY PROTOCOL, SELF-HEALING,
never ask me. Begin.
```

That's the entire handoff. No verbal briefing needed in either direction.
