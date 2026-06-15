import { useState } from "react";
import { useParams } from "react-router-dom";
import { Check, X } from "lucide-react";
import SplitPanel from "../components/SplitPanel";
import DataCard from "../components/DataCard";
import EngineCard from "../components/EngineCard";
import EvidenceIndicator from "../components/EvidenceIndicator";
import Button from "../components/Button";
import MonoText from "../components/MonoText";
import { jobs, matchAnalysis, payBenchmark } from "../data/mockData";
import { useApp } from "../context/AppContext";

const PRIMARY_JOB_ID = "job-001";
const TABS = [
  { id: "match", label: "Match analysis" },
  { id: "pay", label: "Pay benchmark" },
];

const SIGNAL_SKILL_ID = {
  "Cross-functional leadership": "cross-functional",
};
const STATE_WORD = { verified: "Verified", evidence: "Evidence" };

function PayBenchmarkTab() {
  const {
    role, scaleMax, bands, offer, anchor, anchorBasis, positionNote,
    statutory, takeHome, employerLine,
  } = payBenchmark;
  const pct = (v) => `${(v / scaleMax) * 100}%`;

  return (
    <>
      <DataCard eyebrow="Pay benchmark" title={role}>
        <div className="layer-inset rounded-2xl p-5">
          <div className="relative mb-2 h-5">
            <div
              className="absolute -translate-x-1/2 whitespace-nowrap"
              style={{ left: pct(anchor.value) }}
            >
              <span className="font-mono text-xs text-accent">{anchor.mono}</span>
            </div>
          </div>
          <div className="relative h-1.5">
            <div className="absolute inset-x-0 top-0 h-1.5 rounded-full bg-elevated" />
            <div
              className="absolute top-1/2 h-5 -translate-y-1/2 border-x-2 border-primary bg-primary/15"
              style={{
                left: pct(offer.min),
                width: `${((offer.max - offer.min) / scaleMax) * 100}%`,
              }}
            />
            {bands.map((b) => (
              <div
                key={b.key}
                className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 bg-secondary"
                style={{ left: pct(b.value) }}
              />
            ))}
            <div
              className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
              style={{ left: pct(anchor.value) }}
            />
          </div>
          <div className="relative mt-2 h-9">
            {bands.map((b) => (
              <div
                key={b.key}
                className="absolute -translate-x-1/2 text-center"
                style={{ left: pct(b.value) }}
              >
                <p className="font-mono text-[10px] text-secondary">{b.key}</p>
                <p className="font-mono text-[10px] text-txt-dim">
                  {b.value.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-4 font-body text-sm text-txt">{positionNote}</p>
        <p className="mt-1 font-body text-xs text-txt-dim">
          <MonoText>{`${anchor.label} - ${anchorBasis}`}</MonoText>
        </p>
      </DataCard>

      <DataCard title="Statutory & take-home">
        <p className="-mt-2 mb-3 font-body text-xs text-txt-dim">
          <MonoText>At RM 6,600 - indicative 2026 rates</MonoText>
        </p>
        <div className="flex flex-col">
          {statutory.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between border-b border-separator py-2"
            >
              <span className="font-body text-sm text-txt">{row.label}</span>
              <span className="font-mono text-sm text-txt">{row.value}</span>
            </div>
          ))}
          <div className="flex items-center justify-between py-2">
            <span className="font-body text-sm font-semibold text-secondary">
              {takeHome.label}
            </span>
            <span className="font-mono text-sm font-semibold text-secondary">
              {takeHome.value}
            </span>
          </div>
        </div>
        <p className="mt-3 font-body text-xs text-txt-dim">{employerLine}</p>
      </DataCard>
    </>
  );
}

export default function JobDetail() {
  const { id } = useParams();
  const { state, dispatch } = useApp();
  const [tab, setTab] = useState("match");
  const job = jobs.find((j) => j.id === id) || jobs.find((j) => j.id === PRIMARY_JOB_ID);
  const isPrimaryJob = job.id === PRIMARY_JOB_ID;
  const tabs = isPrimaryJob ? TABS : TABS.filter((t) => t.id !== "pay");
  const activeTab = isPrimaryJob ? tab : "match";

  const appliedJob = state.appliedJobs.find((j) => j.jobId === job.id);
  const applied = !!appliedJob;
  const apply = () =>
    dispatch({
      type: "APPLY_JOB",
      payload: {
        jobId: job.id,
        title: job.title,
        company: job.company,
      },
    });

  const skillById = Object.fromEntries(state.skills.map((s) => [s.id, s]));
  const signals = matchAnalysis.signals.map((sig) => {
    const skill = skillById[SIGNAL_SKILL_ID[sig.name]];
    if (!skill) return sig;
    const met = skill.state !== "asserted";
    const caption = met ? `${STATE_WORD[skill.state]} - ${skill.source}` : sig.caption;
    return { ...sig, met, state: skill.state, caption };
  });
  const metCount = signals.filter((s) => s.met).length;
  const gapClosed = metCount === signals.length;

  const left = (
    <>
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-secondary">
          {job.title}
        </h1>
        <p className="mt-1 font-body text-sm text-txt">{job.company}</p>
        <p className="mt-1 font-body text-xs text-txt-dim">
          {job.location} - <span className="font-mono">{job.salary}</span> - posted{" "}
          {job.posted}
        </p>
      </div>

      <DataCard title="About this role">
        <p className="font-body text-sm text-txt">{job.about}</p>
      </DataCard>

      <DataCard title="Performance fingerprint of successful hires">
        <div className="flex flex-col gap-3">
          {job.performanceFingerprint.map((item) => (
            <div key={item} className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <p className="font-body text-sm text-txt">{item}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 font-body text-xs text-txt-dim">
          Derived from outcome data of top performers in this role at {job.company}.
        </p>
      </DataCard>
    </>
  );

  const right = (
    <>
      <div className="layer-inset inline-flex rounded-full p-0.5">
        {tabs.map((t) => (
          <button
            type="button"
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-1.5 font-body text-sm transition ${
              activeTab === t.id ? "layer-pressed font-semibold text-secondary" : "text-txt-dim"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "match" ? (
        <>
          {isPrimaryJob ? (
            <EngineCard eyebrow="Trajectory engine" title="Your match analysis">
              <p className="font-mono text-3xl font-medium text-secondary">
                {metCount} of {signals.length} signals
              </p>
              <div className="mt-4 flex flex-col gap-3">
                {signals.map((s) => (
                  <div key={s.name} className="flex items-start gap-2.5">
                    {s.met ? (
                      <Check size={14} className="mt-0.5 shrink-0 text-accent" />
                    ) : (
                      <X size={14} className="mt-0.5 shrink-0 text-warning" />
                    )}
                    <div>
                      <p className="font-body text-sm text-txt">{s.name}</p>
                      <p className="flex items-center gap-1.5 font-body text-xs text-txt-dim">
                        <EvidenceIndicator state={s.state} /> {s.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 border-t border-separator pt-4 font-body text-sm text-txt">
                {gapClosed ? matchAnalysis.matchNoteResolved : matchAnalysis.matchNote}
              </p>
            </EngineCard>
          ) : (
            <EngineCard eyebrow="Trajectory engine" title="Trajectory preview">
              <p className="font-mono text-3xl font-medium text-secondary">
                {job.match}
              </p>
              <p className="mt-3 font-body text-sm text-txt">
                This role is part of the live search surface. The full signal-by-signal
                reasoning view is available on the Senior Logistics Coordinator demo role.
              </p>
              <p className="mt-3 font-body text-xs text-txt-dim">
                <MonoText>{job.company} - {job.industry} - {job.salary}</MonoText>
              </p>
            </EngineCard>
          )}

          {applied ? (
            <DataCard>
              <p className="font-body text-sm text-txt">
                Application submitted - <span className="font-mono">{appliedJob.appliedDate}</span>
              </p>
              <p className="mt-2 font-body text-xs text-txt-dim">
                {job.company} will see your evidence profile, not just your resume.
              </p>
            </DataCard>
          ) : (
            <Button variant="primary" className="self-start" onClick={apply}>
              Apply to this role
            </Button>
          )}
        </>
      ) : (
        <PayBenchmarkTab />
      )}
    </>
  );

  return (
    <div className="mx-auto max-w-7xl p-6">
      <SplitPanel left={left} right={right} />
    </div>
  );
}
