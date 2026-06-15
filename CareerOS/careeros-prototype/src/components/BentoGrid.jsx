// Layout standard for V2 (DESIGN_SYSTEM_V2 §5). Children declare their spans
// via Tailwind col-span classes (e.g. lg:col-span-8 / lg:col-span-4).
export default function BentoGrid({ children, className = "" }) {
  return (
    <div className={`grid grid-cols-1 gap-4 lg:grid-cols-12 ${className}`}>{children}</div>
  );
}
