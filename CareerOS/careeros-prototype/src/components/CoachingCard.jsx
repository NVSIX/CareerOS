import DataCard from "./DataCard";

export default function CoachingCard({ children, dataBasis, className = "" }) {
  return (
    <DataCard
      eyebrow="TRAJECTORY ENGINE — COACHING OBSERVATION"
      className={`border-l-4 border-l-warning ${className}`}
    >
      <div className="font-body text-sm text-txt">{children}</div>
      {dataBasis && <p className="mt-3 font-body text-xs text-txt-dim">{dataBasis}</p>}
    </DataCard>
  );
}
