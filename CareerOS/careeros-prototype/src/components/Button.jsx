const VARIANTS = {
  primary: "bg-primary text-on-primary",
  secondary: "layer-raised text-secondary",
};

export default function Button({ variant = "primary", className = "", ...props }) {
  return (
    <button
      type="button"
      className={`rounded-full px-5 py-2 font-body text-sm font-semibold transition active:scale-[0.98] ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}
