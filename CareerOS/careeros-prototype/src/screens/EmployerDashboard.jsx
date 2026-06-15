import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SplitPanel from "../components/SplitPanel";
import DataCard from "../components/DataCard";
import MetricBlock from "../components/MetricBlock";
import Badge from "../components/Badge";
import RiskDot from "../components/RiskDot";
import Button from "../components/Button";
import MonoText from "../components/MonoText";
import {
  employer,
  pipeline,
  dashboardMetrics,
  silverMedalists,
  workforceSignals,
} from "../data/mockData";

const COLUMNS = ["Candidate", "Role", "Trajectory match", "Onboarding risk", "Flight risk", "Days"];

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const [invited, setInvited] = useState(() => new Set());

  const left = (
    <>
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-secondary">
          Talent pipeline — {employer.company}
        </h1>
        <p className="mt-1 font-body text-sm text-txt-dim">
          {employer.user} · {employer.descriptor}
        </p>
      </div>

      <div className="layer-inset overflow-x-auto rounded-2xl p-4">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-separator/70">
              {COLUMNS.map((h) => (
                <th
                  key={h}
                  className="pb-3 pr-4 font-mono text-[10px] font-normal uppercase tracking-[0.08em] text-txt-dim"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pipeline.map((row) => (
              <tr
                key={row.name}
                onClick={row.link ? () => navigate(row.link) : undefined}
                onKeyDown={(e) => {
                  if (row.link && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    navigate(row.link);
                  }
                }}
                role={row.link ? "button" : undefined}
                tabIndex={row.link ? 0 : undefined}
                aria-label={row.link ? `Open ${row.name}` : undefined}
                className={`border-b border-separator/70 transition last:border-b-0 hover:bg-elevated ${
                  row.link ? "cursor-pointer" : ""
                }`}
              >
                <td className="py-3 pr-4 font-body text-sm text-txt">{row.name}</td>
                <td className="py-3 pr-4 font-body text-sm text-txt-dim">{row.role}</td>
                <td className="py-3 pr-4 font-mono text-sm text-secondary">{row.match}</td>
                <td className="py-3 pr-4">
                  <RiskDot level={row.risk} />
                </td>
                <td className="py-3 pr-4">
                  <RiskDot level={row.flightRisk.level} label={row.flightRisk.label} />
                </td>
                <td className="py-3 font-mono text-sm text-txt">{row.days}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const right = (
    <>
      <DataCard>
        <MetricBlock
          label="Projected 90-day onboarding success"
          value={dashboardMetrics.onboardingSuccess}
          valueClassName="text-accent"
        />
        <div className="mt-4 flex items-center gap-2 border-t border-separator pt-4">
          <span className="font-body text-xs text-txt-dim">Pipeline trajectory health</span>
          <Badge variant="accent">{dashboardMetrics.pipelineHealth}</Badge>
        </div>
      </DataCard>

      <DataCard eyebrow="Trajectory engine" title="Needs attention">
        <div className="flex flex-col gap-2">
          {dashboardMetrics.flagged.map((f) =>
            f.link ? (
              <button
                key={f.name}
                onClick={() => navigate(f.link)}
                className="flex flex-col items-start gap-0.5 rounded-xl py-1 text-left transition hover:opacity-80"
              >
                <span className="font-body text-sm text-txt">{f.name}</span>
                <span className="font-body text-xs text-danger">
                  <MonoText>{f.note}</MonoText> →
                </span>
              </button>
            ) : (
              <div key={f.name} className="flex items-center justify-between gap-4 py-1">
                <p className="font-body text-sm text-txt">{f.name}</p>
                <Badge variant="warning">{f.note}</Badge>
              </div>
            )
          )}
        </div>
      </DataCard>

      <DataCard title={silverMedalists.title}>
        <p className="-mt-2 font-body text-xs text-txt-dim">{silverMedalists.caption}</p>
        <div className="mt-3 flex flex-col">
          {silverMedalists.rows.map((m) => (
            <div
              key={m.name}
              className="flex items-center justify-between gap-3 border-b border-separator/70 py-3 last:border-b-0"
            >
              <div>
                <p className="font-body text-sm text-txt">{m.name}</p>
                <p className="font-body text-xs text-txt-dim">Interviewed: {m.interviewed}</p>
                <p className="mt-0.5 font-body text-xs text-txt-dim">
                  Trajectory now:{" "}
                  <span className="font-mono text-secondary">{m.trajectory}</span>{" "}
                  <span className="font-mono text-accent">({m.delta})</span>
                </p>
              </div>
              {invited.has(m.name) ? (
                <Badge variant="neutral">Invited</Badge>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => setInvited((prev) => new Set(prev).add(m.name))}
                >
                  Re-engage
                </Button>
              )}
            </div>
          ))}
        </div>
      </DataCard>

      <DataCard title="Connect Salesforce">
        <p className="font-body text-sm text-txt">
          Ground these scores in your own performance data
        </p>
        <div className="mt-4">
          <Button variant="secondary" onClick={() => navigate("/employer/salesforce")}>
            Connect Salesforce
          </Button>
        </div>
      </DataCard>

      <DataCard eyebrow={workforceSignals.eyebrow} title={workforceSignals.title}>
        <div className="flex flex-col gap-3">
          {workforceSignals.rows.map((r) => (
            <div key={r.caption} className="flex items-start gap-3">
              <span className="w-14 shrink-0 font-mono text-base font-medium text-secondary">
                {r.value}
              </span>
              <span className="font-body text-xs text-txt-dim">
                <MonoText>{r.caption}</MonoText>
              </span>
            </div>
          ))}
        </div>
      </DataCard>
    </>
  );

  return (
    <div className="mx-auto max-w-7xl p-6">
      <SplitPanel left={left} right={right} />
    </div>
  );
}
