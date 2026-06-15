import EvidenceIndicator, { LEGEND } from "./EvidenceIndicator";

export default function EvidenceLegend({ className = "" }) {
  return (
    <div className={`flex flex-col gap-2 sm:flex-row sm:gap-6 ${className}`}>
      {["asserted", "evidence", "verified"].map((state) => (
        <div key={state} className="flex items-center gap-2">
          <EvidenceIndicator state={state} />
          <span className="font-body text-xs text-txt-dim">{LEGEND[state]}</span>
        </div>
      ))}
    </div>
  );
}
