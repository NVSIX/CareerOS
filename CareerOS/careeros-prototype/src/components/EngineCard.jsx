import DataCard from "./DataCard";

export default function EngineCard({
  children,
  dataBasis,
  eyebrow = "TRAJECTORY ENGINE — MATCH REASONING",
  title,
  className = "",
}) {
  return (
    <DataCard
      eyebrow={eyebrow}
      title={title}
      className={`border-l-4 border-l-secondary ${className}`}
    >
      <div className="font-body text-sm text-txt">{children}</div>
      {dataBasis && <p className="mt-3 font-body text-xs text-txt-dim">{dataBasis}</p>}
    </DataCard>
  );
}
