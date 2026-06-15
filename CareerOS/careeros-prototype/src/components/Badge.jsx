const VARIANTS = {
  accent: "bg-accent-dim text-accent",
  warning: "bg-[#F3E5C8] text-warning",
  neutral: "layer-inset text-txt-dim",
  primary: "bg-primary-container text-primary",
  secondary: "bg-secondary-container text-secondary",
};

export default function Badge({ variant = "neutral", children, className = "" }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 font-mono text-xs ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
