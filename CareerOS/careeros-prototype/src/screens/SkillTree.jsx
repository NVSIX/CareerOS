import { useState } from "react";
import BentoGrid from "../components/BentoGrid";
import DataCard from "../components/DataCard";
import Badge from "../components/Badge";
import Button from "../components/Button";
import MonoText from "../components/MonoText";
import { skillTree, primaryCandidate } from "../data/mockData";
import { useApp } from "../context/AppContext";

const NODE_BY_ID = Object.fromEntries(skillTree.nodes.map((n) => [n.id, n]));

// Edge styling keyed on the target node's state (DESIGN_SYSTEM_V2 / MOCK_DATA_V2 §2).
function edgeStyle(targetState) {
  if (targetState === "available")
    return { stroke: "#d8113a", strokeWidth: 2, strokeDasharray: "5 5" };
  if (targetState === "locked")
    return { stroke: "#c9c4b8", strokeWidth: 1.5, strokeDasharray: "5 5" };
  return { stroke: "#112250", strokeWidth: 2 }; // both ends demonstrated → solid navy
}

const STATE_BADGE = {
  available: { variant: "primary", label: "Available next" },
  locked: { variant: "neutral", label: "Locked" },
  milestone: { variant: "secondary", label: "Core" },
};

function Padlock({ cx, cy }) {
  return (
    <g>
      <path
        d={`M ${cx - 2} ${cy - 1} v -2 a 2 2 0 0 1 4 0 v 2`}
        fill="none"
        stroke="#6B6557"
        strokeWidth="1"
      />
      <rect x={cx - 3} y={cy - 1} width="6" height="5" rx="1" fill="#6B6557" />
    </g>
  );
}

function NodeLabel({ node }) {
  const words = node.label.split(" ");
  const line1 = words[0];
  const line2 = words.slice(1).join(" ");
  return (
    <text
      x={node.x}
      y={node.y + 34}
      textAnchor="middle"
      fontFamily="Inter"
      fontSize="11"
      fill="#1b1c19"
    >
      <tspan x={node.x}>{line1}</tspan>
      {line2 && (
        <tspan x={node.x} dy="13">
          {line2}
        </tspan>
      )}
    </text>
  );
}

const LEGEND_ITEMS = [
  { kind: "unlocked", label: "Verified / evidenced — demonstrated" },
  { kind: "available", label: "Available next — within reach" },
  { kind: "locked", label: "Locked — further out" },
  { kind: "milestone", label: "Core — your current foundation" },
];

function MiniNode({ kind }) {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" className="shrink-0">
      {kind === "unlocked" && <circle cx="13" cy="13" r="9" fill="#112250" />}
      {kind === "available" && (
        <circle cx="13" cy="13" r="9" fill="#faf9f4" stroke="#d8113a" strokeWidth="2" />
      )}
      {kind === "locked" && (
        <>
          <circle cx="13" cy="13" r="8" fill="#e9e8e3" stroke="#c9c4b8" />
          <Padlock cx={13} cy={13} />
        </>
      )}
      {kind === "milestone" && (
        <rect
          x="4"
          y="4"
          width="18"
          height="18"
          rx="3"
          fill="#112250"
          transform="rotate(45 13 13)"
        />
      )}
    </svg>
  );
}

export default function SkillTree() {
  const { state, dispatch } = useApp();
  const [selectedId, setSelectedId] = useState("a1");
  // Planned nodes persist in context (and localStorage) across navigation (§3.6).
  const planned = new Set(state.plannedNodes);
  const selected = NODE_BY_ID[selectedId];
  const detail = skillTree.detail[selected.id] || {};

  const isUnlocked = selected.state === "unlocked";
  const isMilestone = selected.state === "milestone";
  const skill = isUnlocked
    ? primaryCandidate.skills.find((s) => s.name === selected.skill)
    : null;

  const addToPlan = (id) => dispatch({ type: "PLAN_NODE", payload: id });
  const selectNode = (id) => setSelectedId(id);

  let badge;
  if (isUnlocked) {
    badge = (
      <Badge variant="accent">{skill.state === "verified" ? "Verified" : "Evidenced"}</Badge>
    );
  } else {
    const b = STATE_BADGE[selected.state];
    badge = <Badge variant={b.variant}>{b.label}</Badge>;
  }

  const rows = [];
  if (isUnlocked || isMilestone) {
    rows.push({ label: "Evidence", value: isUnlocked ? skill.source : detail.source });
    if (detail.strengthens)
      rows.push({ label: "Strengthens", value: <MonoText>{detail.strengthens}</MonoText> });
  } else {
    if (detail.requires) {
      // If a gating skill has been evidenced (via the diagnostic or an edit),
      // show the "requirement met" copy instead of the "artifact needed" copy.
      const gating = detail.gatedBySkillId
        ? state.skills.find((s) => s.id === detail.gatedBySkillId)
        : null;
      const requirementMet = gating && gating.state !== "asserted";
      const requiresText =
        requirementMet && detail.requiresMet ? detail.requiresMet : detail.requires;
      rows.push({ label: "Requires", value: <MonoText>{requiresText}</MonoText> });
    }
    if (detail.unlocks) rows.push({ label: "Unlocks", value: detail.unlocks });
    if (detail.cohort)
      rows.push({ label: "Cohort", value: <MonoText>{detail.cohort}</MonoText> });
    if (detail.timeToReach)
      rows.push({ label: "Time to reach", value: <MonoText>{detail.timeToReach}</MonoText> });
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-secondary">
        Skill map
      </h1>
      <p className="mt-1 font-body text-sm text-txt-dim">
        <MonoText>{skillTree.intro}</MonoText>
      </p>

      <div className="mt-6">
        <BentoGrid>
          <div className="lg:col-span-8">
            <div className="layer-inset rounded-2xl p-4">
              <svg viewBox={skillTree.viewBox} className="h-auto w-full">
                {/* edges first so nodes paint on top */}
                {skillTree.edges.map(([from, to]) => {
                  const a = NODE_BY_ID[from];
                  const b = NODE_BY_ID[to];
                  return (
                    <line
                      key={`${from}-${to}`}
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      {...edgeStyle(b.state)}
                    />
                  );
                })}

                {/* nodes */}
                {skillTree.nodes.map((node) => {
                  const isSelected = node.id === selectedId;
                  const isNodePlanned = planned.has(node.id);
                  return (
                    <g
                      key={node.id}
                      onClick={() => selectNode(node.id)}
                      onFocus={() => selectNode(node.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          selectNode(node.id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Select ${node.label}`}
                      aria-pressed={isSelected}
                      className="cursor-pointer focus:outline-none"
                    >
                      {node.state === "available" && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="24"
                          fill="none"
                          stroke="#d8113a"
                          strokeWidth="2"
                          className="pulse-ring"
                        />
                      )}
                      {isNodePlanned && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="22"
                          fill="none"
                          stroke="#d8113a"
                          strokeWidth="1.5"
                          strokeDasharray="1 4"
                        />
                      )}
                      {isSelected && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="26"
                          fill="none"
                          stroke="#112250"
                          strokeWidth="1.5"
                          strokeDasharray="2 3"
                        />
                      )}

                      {node.state === "milestone" && (
                        <rect
                          x={node.x - 15}
                          y={node.y - 15}
                          width="30"
                          height="30"
                          rx="4"
                          fill="#112250"
                          transform={`rotate(45 ${node.x} ${node.y})`}
                        />
                      )}
                      {node.state === "unlocked" && (
                        <>
                          <circle cx={node.x} cy={node.y} r="18" fill="#112250" />
                          <text
                            x={node.x}
                            y={node.y}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontFamily='"JetBrains Mono"'
                            fontSize="8"
                            fill="#faf9f4"
                          >
                            {node.label[0]}
                          </text>
                        </>
                      )}
                      {node.state === "available" && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="18"
                          fill="#faf9f4"
                          stroke="#d8113a"
                          strokeWidth="2"
                        />
                      )}
                      {node.state === "locked" && (
                        <>
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r="16"
                            fill="#e9e8e3"
                            stroke="#c9c4b8"
                          />
                          <Padlock cx={node.x} cy={node.y} />
                        </>
                      )}

                      <NodeLabel node={node} />
                    </g>
                  );
                })}
              </svg>
            </div>
            <p className="mt-3 font-body text-xs text-txt-dim">{skillTree.engineCaption}</p>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-4">
            <DataCard>
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-lg font-bold text-secondary">
                  {selected.label}
                </h3>
                {badge}
              </div>

              <div className="mt-4 flex flex-col gap-3">
                {rows.map((r, i) => (
                  <div
                    key={r.label}
                    className={i > 0 ? "border-t border-separator/70 pt-3" : ""}
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-txt-dim">
                      {r.label}
                    </p>
                    <p className="mt-1 font-body text-sm text-txt">{r.value}</p>
                  </div>
                ))}
              </div>

              {selected.state === "available" && (
                <div className="mt-4">
                  {planned.has(selected.id) ? (
                    <Badge variant="primary">Planned</Badge>
                  ) : (
                    <Button variant="primary" onClick={() => addToPlan(selected.id)}>
                      {skillTree.actionLabel}
                    </Button>
                  )}
                </div>
              )}
            </DataCard>

            <DataCard eyebrow="Node states" title="Legend">
              <div className="flex flex-col gap-3">
                {LEGEND_ITEMS.map((item) => (
                  <div key={item.kind} className="flex items-center gap-3">
                    <MiniNode kind={item.kind} />
                    <span className="font-body text-sm text-txt">{item.label}</span>
                  </div>
                ))}
              </div>
            </DataCard>
          </div>
        </BentoGrid>
      </div>
    </div>
  );
}
