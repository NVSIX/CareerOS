import BentoGrid from "./BentoGrid";

// V2: a thin 7/5 BentoGrid wrapper so existing screens restyle without
// structural rewrites (DESIGN_SYSTEM_V2 §5, F13 amended).
export default function SplitPanel({ left, right }) {
  return (
    <BentoGrid className="gap-6">
      <div className="flex flex-col gap-4 lg:col-span-7">{left}</div>
      <div className="flex flex-col gap-4 lg:col-span-5">{right}</div>
    </BentoGrid>
  );
}
