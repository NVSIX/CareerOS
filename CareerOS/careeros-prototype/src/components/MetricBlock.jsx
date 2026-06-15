export default function MetricBlock({ label, value, caption, valueClassName = "text-secondary" }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-txt-dim">{label}</p>
      <p className={`mt-1 font-mono text-3xl font-medium ${valueClassName}`}>{value}</p>
      {caption && <p className="mt-1 font-body text-xs text-txt-dim">{caption}</p>}
    </div>
  );
}
