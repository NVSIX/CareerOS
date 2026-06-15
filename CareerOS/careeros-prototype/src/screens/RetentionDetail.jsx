import { useNavigate } from "react-router-dom";
import { Activity, ArrowLeft, Clock, TrendingDown, Users } from "lucide-react";
import BentoGrid from "../components/BentoGrid";
import DataCard from "../components/DataCard";
import EngineCard from "../components/EngineCard";
import Badge from "../components/Badge";
import Button from "../components/Button";
import MonoText from "../components/MonoText";
import { retentionCase } from "../data/mockData";

const ICONS = { TrendingDown, Users, Activity, Clock };
const SEVERITY_LABEL = { warning: "Warning", neutral: "Neutral" };

export default function RetentionDetail() {
  const navigate = useNavigate();
  const { header, sub, signals, outlook, actions, privacyFootnote } = retentionCase;

  const left = (
    <DataCard eyebrow="Trajectory engine" title="Signal timeline">
      <div className="relative mt-2 flex flex-col gap-5">
        {/* vertical hairline connecting the icon circles */}
        <div className="absolute bottom-5 left-[18px] top-5 w-0.5 bg-separator" />
        {signals.map((s) => {
          const Icon = ICONS[s.icon];
          return (
            <div key={s.label} className="relative flex items-start gap-3">
              <span className="layer-inset z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-secondary">
                <Icon size={16} />
              </span>
              <div className="flex flex-1 items-start justify-between gap-3 pt-1">
                <div>
                  <p className="font-body text-sm font-semibold text-txt">
                    <MonoText>{s.label}</MonoText>
                  </p>
                  <p className="font-mono text-xs text-txt-dim">{s.date}</p>
                </div>
                <Badge variant={s.severity}>{SEVERITY_LABEL[s.severity]}</Badge>
              </div>
            </div>
          );
        })}
      </div>
    </DataCard>
  );

  const right = (
    <>
      <EngineCard eyebrow="Trajectory engine" title="Retention outlook">
        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-txt-dim">
          {outlook.label}
        </p>
        <p className="font-mono text-3xl font-medium text-danger">{outlook.churnRisk}</p>
        <p className="mt-3 font-body text-sm text-txt">{outlook.reasoning}</p>
        <p className="mt-3 font-body text-xs text-txt-dim">
          <MonoText>{outlook.basis}</MonoText>
        </p>
      </EngineCard>

      <DataCard title="Recommended actions">
        <div className="flex flex-col gap-3">
          {actions.map((a, i) => (
            <div
              key={a.title}
              className={i > 0 ? "border-t border-separator/70 pt-3" : ""}
            >
              <p className="font-body text-sm text-txt">
                <span className="font-mono text-secondary">{i + 1}.</span> {a.title}
              </p>
              <p className="mt-1 font-body text-xs text-txt-dim">
                <MonoText>{a.caption}</MonoText>
              </p>
              {a.button && (
                <Button
                  variant="secondary"
                  className="mt-3"
                  onClick={() => navigate(a.buttonLink)}
                >
                  {a.button}
                </Button>
              )}
            </div>
          ))}
        </div>
      </DataCard>

      <p className="px-1 font-body text-xs text-txt-dim">{privacyFootnote}</p>
    </>
  );

  return (
    <div className="mx-auto max-w-7xl p-6">
      <button
        onClick={() => navigate("/employer/dashboard")}
        className="flex items-center gap-1.5 font-body text-sm text-txt-dim transition hover:text-secondary"
      >
        <ArrowLeft size={15} /> Dashboard
      </button>
      <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-secondary">
        {header}
      </h1>
      <p className="mt-1 font-body text-sm text-txt-dim">
        <MonoText>{sub}</MonoText>
      </p>

      <div className="mt-6">
        <BentoGrid>
          <div className="flex flex-col gap-4 lg:col-span-7">{left}</div>
          <div className="flex flex-col gap-4 lg:col-span-5">{right}</div>
        </BentoGrid>
      </div>
    </div>
  );
}
