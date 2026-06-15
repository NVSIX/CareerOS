import SplitPanel from "../components/SplitPanel";
import DataCard from "../components/DataCard";
import CandidateHeader from "../components/CandidateHeader";
import SkillEvidenceList from "../components/SkillEvidenceList";
import EngineCard from "../components/EngineCard";
import TrajectoryChart from "../components/TrajectoryChart";
import RiskDot from "../components/RiskDot";
import MetricBlock from "../components/MetricBlock";
import {
  primaryCandidate,
  matchAnalysis,
  pipeline,
  onboardingMilestones,
} from "../data/mockData";
import { useApp } from "../context/AppContext";

const DOT_COLOR = { low: "bg-accent", moderate: "bg-warning", high: "bg-danger" };

function initialsOf(name) {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function EmployerCandidateView() {
  const { state } = useApp();
  const { trajectory } = primaryCandidate;
  const amiraRow = pipeline.find((r) => r.candidateId === "cand-001");
  const headerCandidate = {
    ...primaryCandidate,
    name: state.candidate.name,
    headline: state.candidate.headline,
    location: state.candidate.location,
    initials: initialsOf(state.candidate.name),
  };

  const left = (
    <>
      <CandidateHeader candidate={headerCandidate} />
      <DataCard eyebrow="Employer lens" title="Verified competency profile">
        <SkillEvidenceList skills={state.skills} />
      </DataCard>
      <p className="px-1 font-body text-xs text-txt-dim">
        Evidence states are shared between candidate and employer views.
      </p>
    </>
  );

  const right = (
    <>
      <EngineCard dataBasis={matchAnalysis.gapNoteBasis}>{matchAnalysis.gapNote}</EngineCard>

      <DataCard title="Onboarding outlook">
        <div className="layer-inset rounded-2xl p-4">
          <TrajectoryChart
            actual={trajectory.actual}
            cohort={trajectory.cohortAverage}
            xLabel="Months in role"
            yLabel="Performance index"
            height={180}
          />
        </div>
      </DataCard>

      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-txt-dim">
          {onboardingMilestones.eyebrow}
        </p>
        <h3 className="font-display text-lg font-bold text-secondary">
          {onboardingMilestones.title}
        </h3>
        <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
          {onboardingMilestones.cards.map((c) => (
            <div key={c.period} className="layer-raised rounded-xl p-4">
              <span className={`block h-2 w-2 rounded-full ${DOT_COLOR[c.level]}`} />
              <p className="mt-2 font-body text-sm font-semibold text-secondary">{c.period}</p>
              <p className="mt-1 font-body text-xs text-txt-dim">{c.note}</p>
            </div>
          ))}
        </div>
      </div>

      <DataCard>
        <div className="flex items-start gap-10">
          <MetricBlock
            label="Trajectory match"
            value={amiraRow.match}
            valueClassName="text-accent"
          />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-txt-dim">
              Onboarding risk
            </p>
            <div className="mt-2">
              <RiskDot level={amiraRow.risk} />
            </div>
          </div>
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
