import { useNavigate } from "react-router-dom";
import DataCard from "../components/DataCard";
import EvidenceLegend from "../components/EvidenceLegend";
import Badge from "../components/Badge";
import Button from "../components/Button";
import { landing } from "../data/mockData";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-7xl p-6">
      <section className="max-w-3xl pb-12 pt-16">
        <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-secondary lg:text-5xl">
          {landing.headline}
        </h1>
        <p className="mt-5 font-body text-base leading-relaxed text-txt-dim">
          {landing.subline}
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {landing.panels.map((p) => (
          <DataCard key={p.audience} eyebrow={p.audience}>
            <div className="flex flex-col items-start gap-3">
              <p className="font-body text-sm text-txt">{p.body}</p>
              {p.badge && <Badge variant="neutral">{p.badge}</Badge>}
            </div>
          </DataCard>
        ))}
      </div>

      <DataCard eyebrow="Evidence states" className="mt-8">
        <EvidenceLegend />
      </DataCard>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button variant="primary" onClick={() => navigate("/register")}>
          {landing.ctaPrimary}
        </Button>
        <Button variant="secondary" onClick={() => navigate("/onboarding")}>
          {landing.cta}
        </Button>
      </div>

      <DataCard eyebrow={landing.stage2Strip.eyebrow} className="mt-12">
        <div className="flex flex-wrap gap-2">
          {landing.stage2Strip.items.map((item) => (
            <Badge key={item} variant="neutral">
              {item}
            </Badge>
          ))}
        </div>
        <p className="mt-3 font-body text-xs text-txt-dim">{landing.stage2Strip.caption}</p>
      </DataCard>

      <footer className="mt-12 border-t border-separator pt-6">
        <p className="font-body text-xs text-txt-dim">{landing.footer}</p>
      </footer>
    </div>
  );
}
