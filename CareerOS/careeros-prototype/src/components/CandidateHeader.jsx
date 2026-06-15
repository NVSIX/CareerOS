// Header block shared by /candidate/profile (§3) and /employer/candidate (§7).
export default function CandidateHeader({ candidate, children }) {
  return (
    <div className="flex items-center gap-4">
      <span className="layer-inset flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-mono text-sm text-secondary">
        {candidate.initials}
      </span>
      <div className="min-w-0 flex-1">
        <h1 className="font-display text-2xl font-bold tracking-tight text-secondary">
          {candidate.name}
        </h1>
        <p className="font-body text-sm text-txt">{candidate.headline}</p>
        <p className="font-body text-xs text-txt-dim">
          {candidate.location}
          {candidate.currentRole && <> · {candidate.currentRole}</>}
          {candidate.tenureMonths && (
            <>
              {" "}· month <span className="font-mono">{candidate.tenureMonths}</span> in role
            </>
          )}
        </p>
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
}
