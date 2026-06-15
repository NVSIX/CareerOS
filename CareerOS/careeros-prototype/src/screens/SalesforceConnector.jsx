import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, Lock } from "lucide-react";
import DataCard from "../components/DataCard";
import EngineCard from "../components/EngineCard";
import EvidenceIndicator from "../components/EvidenceIndicator";
import RiskDot from "../components/RiskDot";
import Button from "../components/Button";
import { salesforce, salesforceIntro } from "../data/mockData";

const PROGRESS_STEPS = [
  "Authenticating with Salesforce sandbox…",
  "Mapping fields…",
  "Applying privacy boundary…",
];

// The exact effect line, with "72 → 61" styled (72 struck txt-dim, 61 accent).
function EffectLine() {
  const [prefix, suffix] = salesforce.effectLine.split("72 → 61");
  return (
    <p className="font-body text-sm text-txt">
      {prefix}
      <span className="font-mono text-txt-dim line-through">72</span>
      <span className="font-mono"> → </span>
      <span className="font-mono text-accent">61</span>
      {suffix}
    </p>
  );
}

export default function SalesforceConnector() {
  const navigate = useNavigate();
  const [connState, setConnState] = useState("disconnected");
  const [progress, setProgress] = useState(0);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const startConnect = () => {
    setConnState("connecting");
    PROGRESS_STEPS.forEach((_, i) => {
      timers.current.push(
        setTimeout(() => {
          setProgress(i + 1);
          if (i === PROGRESS_STEPS.length - 1) {
            timers.current.push(setTimeout(() => setConnState("connected"), 500));
          }
        }, 700 * (i + 1))
      );
    });
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-secondary">
        Salesforce connector
      </h1>
      <p className="mt-1 font-body text-sm text-txt-dim">
        Post-hire outcome data is what keeps the Trajectory Engine learning.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        {/* Hafiz intro — always visible across all three connector states (§3.8). */}
        <DataCard>
          <p className="font-body text-sm font-semibold text-secondary">
            {salesforceIntro.headline}
          </p>
          <p className="mt-1 font-body text-xs text-txt-dim">{salesforceIntro.sub}</p>
          <div className="mt-3">
            <RiskDot level="low" label="3 months · Top 25%" />
          </div>
        </DataCard>

        {connState !== "connected" && (
          <DataCard title="Connect your Salesforce">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-txt-dim">
                  Stays in your Salesforce (Tier 1)
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  {salesforce.tier1Fields.map((f) => (
                    <div
                      key={f}
                      className="layer-inset flex items-center gap-2.5 rounded-xl px-3 py-2"
                    >
                      <Lock size={13} className="shrink-0 text-txt-dim" />
                      <span className="font-body text-sm text-txt-dim">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-txt-dim">
                  Crosses to CareerOS (Tier 2, anonymised)
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  {salesforce.tier2Fields.map((f) => (
                    <div
                      key={f}
                      className="layer-inset flex items-center gap-2.5 rounded-xl px-3 py-2"
                    >
                      <ArrowRight size={13} className="shrink-0 text-accent" />
                      <span className="font-body text-sm text-txt">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-4 font-body text-xs text-txt-dim">{salesforce.privacyNote}</p>

            <div className="mt-5">
              {connState === "disconnected" ? (
                <Button variant="primary" onClick={startConnect}>
                  Connect Salesforce (sandbox)
                </Button>
              ) : (
                <div className="flex flex-col gap-2">
                  {PROGRESS_STEPS.map((step, i) => {
                    const done = progress >= i + 1;
                    return (
                      <div key={step} className="flex items-center gap-2.5">
                        {done ? (
                          <Check size={14} className="shrink-0 text-accent" />
                        ) : (
                          <span className="h-3.5 w-3.5 shrink-0 rounded-full border border-separator" />
                        )}
                        <span
                          className={`font-body text-sm ${done ? "text-txt" : "text-txt-dim"}`}
                        >
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </DataCard>
        )}

        {connState === "connected" && (
          <>
            <DataCard title="First record received">
              <div className="flex flex-col">
                {salesforce.record.fields.map((f) => (
                  <div
                    key={f.key}
                    className="flex items-center justify-between border-b border-separator py-2 last:border-b-0"
                  >
                    <span className="font-mono text-xs text-txt-dim">{f.key}</span>
                    <span className="font-mono text-sm text-secondary">{f.value}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 font-body text-xs text-txt-dim">
                Source: {salesforce.record.source} · {salesforce.employee.name} —{" "}
                {salesforce.employee.role}
              </p>
            </DataCard>

            <EngineCard>
              <EffectLine />
            </EngineCard>

            <DataCard title="Living portfolio updated">
              <div className="flex flex-col gap-3">
                {salesforce.updatedSkills.map((s) => (
                  <div key={s.name} className="flex items-center gap-2.5">
                    <EvidenceIndicator state={s.state} />
                    <span className="font-body text-sm text-txt">{s.name}</span>
                    <span className="font-body text-xs text-txt-dim">now employer-verified</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 font-body text-xs text-txt-dim">
                {salesforce.employee.name} ({salesforce.employee.initials}) — the loop closes:
                workplace outcomes update the portfolio.
              </p>
            </DataCard>

            <div>
              <Button variant="secondary" onClick={() => navigate("/employer/dashboard")}>
                Back to dashboard
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
