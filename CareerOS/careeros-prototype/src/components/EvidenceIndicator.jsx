import { Check } from "lucide-react";

const LEGEND = {
  asserted: "Asserted — claimed, not yet evidenced",
  evidence: "Evidence-linked — backed by an artifact",
  verified: "Employer-verified — confirmed by workplace outcome data",
};

export default function EvidenceIndicator({ state = "asserted" }) {
  if (state === "verified") {
    return (
      <span
        title={LEGEND.verified}
        className="inline-flex h-[10px] w-[10px] shrink-0 items-center justify-center rounded-full bg-accent"
      >
        <Check size={8} strokeWidth={3.5} color="#faf9f4" />
      </span>
    );
  }
  if (state === "evidence") {
    return (
      <span
        title={LEGEND.evidence}
        className="inline-block h-[10px] w-[10px] shrink-0 rounded-full bg-accent"
      />
    );
  }
  return (
    <span
      title={LEGEND.asserted}
      className="inline-block h-[10px] w-[10px] shrink-0 rounded-full border-[1.5px] border-txt-dim"
    />
  );
}

export { LEGEND };
