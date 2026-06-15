export default function DataCard({ eyebrow, title, children, className = "", ...rest }) {
  return (
    <div className={`layer-raised rounded-2xl p-5 ${className}`} {...rest}>
      {eyebrow && (
        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-txt-dim">
          {eyebrow}
        </p>
      )}
      {title && (
        <h3 className={`font-display text-lg font-bold text-secondary ${eyebrow ? "mt-1" : ""}`}>
          {title}
        </h3>
      )}
      {children && <div className={eyebrow || title ? "mt-3" : ""}>{children}</div>}
    </div>
  );
}
