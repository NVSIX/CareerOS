const COLORS = {
  low: "bg-accent",
  moderate: "bg-warning",
  high: "bg-danger",
};

const LABELS = {
  low: "Low",
  moderate: "Moderate",
  high: "High",
};

export default function RiskDot({ level = "low", label }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${COLORS[level]}`} />
      <span className="font-mono text-sm text-txt">{label || LABELS[level]}</span>
    </span>
  );
}
