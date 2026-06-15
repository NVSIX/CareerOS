import EvidenceIndicator from "./EvidenceIndicator";

// Shared between /candidate/profile (§3) and /employer/candidate (§7) —
// same component, same data, by spec.
export default function SkillEvidenceList({ skills }) {
  return (
    <div className="flex flex-col gap-4">
      {skills.map((s) => (
        <div key={s.name} className="flex items-start gap-2.5">
          <span className="mt-1"><EvidenceIndicator state={s.state} /></span>
          <div>
            <p className="font-body text-sm text-txt">{s.name}</p>
            {s.source && <p className="font-body text-xs text-txt-dim">{s.source}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
