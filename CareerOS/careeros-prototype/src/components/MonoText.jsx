// Renders a caption string with embedded data values (digits, %, commas) in
// font-mono — keeps the "every data value is mono" rule inside prose captions.
export default function MonoText({ children, className = "" }) {
  const parts = String(children).split(/(\d[\d,.]*%?)/g);
  return (
    <span className={className}>
      {parts.map((p, i) =>
        /^\d[\d,.]*%?$/.test(p) ? (
          <span key={i} className="font-mono">
            {p}
          </span>
        ) : (
          p
        )
      )}
    </span>
  );
}
