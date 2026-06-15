import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import SplitPanel from "../components/SplitPanel";
import DataCard from "../components/DataCard";
import EngineCard from "../components/EngineCard";
import EvidenceIndicator from "../components/EvidenceIndicator";
import Badge from "../components/Badge";
import Button from "../components/Button";
import { diagnosticScript } from "../data/mockData";
import { useApp } from "../context/AppContext";

function ReplyChip({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="layer-raised self-start rounded-full px-4 py-2 text-left font-body text-sm text-txt transition hover:text-secondary active:scale-[0.98]"
    >
      {children}
    </button>
  );
}

function CandidateReply({ children }) {
  return (
    <div className="layer-pressed max-w-[85%] self-end rounded-2xl p-3 font-body text-sm text-txt">
      {children}
    </div>
  );
}

// Apply a probe effect to a skills array (immutable, idempotent — keyed by id).
const applyEffect = (skills, effect) =>
  skills.map((s) =>
    s.id === effect.skillId
      ? { ...s, state: effect.newState, source: effect.evidenceSource }
      : s
  );

export default function OnboardingDiagnostic() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [step, setStep] = useState(0);
  const [probe1, probe2] = diagnosticScript.probes;

  // Persist the strengthened skills to context once the completion step renders.
  useEffect(() => {
    if (step === 4) {
      const updated = applyEffect(
        applyEffect(state.skills, probe1.effect),
        probe2.effect
      );
      dispatch({ type: "COMPLETE_DIAGNOSTIC", payload: updated });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // Right-panel skills reflect the probes as the candidate advances.
  let displayedSkills = state.skills;
  if (step >= 3) displayedSkills = applyEffect(displayedSkills, probe1.effect);
  if (step >= 4) displayedSkills = applyEffect(displayedSkills, probe2.effect);

  const badgeFor = (skillId) => {
    if (step >= 3 && skillId === probe1.effect.skillId) return probe1.effect.badgeText;
    if (step >= 4 && skillId === probe2.effect.skillId) return probe2.effect.badgeText;
    return null;
  };

  const left = (
    <>
      {step === 0 && (
        <DataCard title="Start your diagnostic">
          <div className="flex flex-col items-start gap-2">
            <Button variant="primary" onClick={() => setStep(1)}>
              Load my profile
            </Button>
            <p className="font-body text-xs text-txt-dim">
              We'll verify your existing profile claims.
            </p>
          </div>
        </DataCard>
      )}

      {step >= 1 && (
        <DataCard>
          <div className="flex items-center gap-3">
            <FileText size={16} className="shrink-0 text-txt-dim" />
            <span className="font-mono text-sm text-txt">{state.candidate.name}</span>
            <span className="font-body text-xs text-txt-dim">Profile loaded — claims parsed</span>
          </div>
        </DataCard>
      )}

      {step >= 1 && (
        <EngineCard eyebrow="TRAJECTORY ENGINE — DIAGNOSTIC">
          <p className="whitespace-pre-line">{diagnosticScript.step1Intro}</p>
        </EngineCard>
      )}

      {step === 1 && (
        <Button variant="primary" className="self-start" onClick={() => setStep(2)}>
          Continue
        </Button>
      )}

      {step >= 2 && (
        <EngineCard eyebrow="TRAJECTORY ENGINE — EVIDENCE PROBE">
          {probe1.question}
        </EngineCard>
      )}
      {step === 2 && <ReplyChip onClick={() => setStep(3)}>{probe1.replyChip}</ReplyChip>}
      {step >= 3 && <CandidateReply>{probe1.replyChip}</CandidateReply>}

      {step >= 3 && (
        <EngineCard eyebrow="TRAJECTORY ENGINE — EVIDENCE PROBE">
          {probe2.question}
        </EngineCard>
      )}
      {step === 3 && <ReplyChip onClick={() => setStep(4)}>{probe2.replyChip}</ReplyChip>}
      {step >= 4 && <CandidateReply>{probe2.replyChip}</CandidateReply>}

      {step >= 4 && (
        <DataCard>
          <h3 className="font-display text-lg font-bold text-secondary">
            {diagnosticScript.completionHeader}
          </h3>
          <p className="mt-2 font-body text-sm text-txt">{diagnosticScript.completionSub}</p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={() => navigate("/candidate/profile")}
          >
            {diagnosticScript.completionCta}
          </Button>
        </DataCard>
      )}
    </>
  );

  const right = (
    <DataCard eyebrow="Profile — building live" title={state.candidate.name}>
      <p className="-mt-2 font-body text-xs text-txt-dim">
        {state.candidate.headline} · {state.candidate.location}
      </p>

      {step === 0 && (
        <p className="mt-4 font-body text-xs text-txt-dim">
          Your profile populates as the diagnostic runs.
        </p>
      )}

      {step >= 1 && (
        <div className="mt-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-txt-dim">
            Profile claims
          </p>
          <div className="mt-3 flex flex-col gap-3">
            {displayedSkills.map((s) => {
              const badge = badgeFor(s.id);
              return (
                <div key={s.id || s.name} className="flex items-center gap-2">
                  <EvidenceIndicator state={s.state} />
                  <span className="font-body text-sm text-txt">{s.name}</span>
                  {badge && <Badge variant="accent">{badge}</Badge>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </DataCard>
  );

  return (
    <div className="mx-auto max-w-7xl p-6">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-secondary">
        Adaptive diagnostic
      </h1>
      <p className="mt-1 font-body text-sm text-txt-dim">
        The Trajectory Engine probes claims instead of collecting a form.
      </p>
      <div className="mt-6">
        <SplitPanel left={left} right={right} />
      </div>
    </div>
  );
}
