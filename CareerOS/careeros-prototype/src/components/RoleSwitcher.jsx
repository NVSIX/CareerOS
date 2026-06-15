import { useLocation, useNavigate } from "react-router-dom";

export default function RoleSwitcher() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isEmployer = pathname.startsWith("/employer");
  const seg = "rounded-full px-3 py-1 font-body text-xs transition";

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="layer-inset flex rounded-full p-0.5">
        <button
          type="button"
          onClick={() => navigate("/candidate/profile")}
          className={`${seg} ${!isEmployer ? "layer-pressed font-semibold text-secondary" : "text-txt-dim"}`}
        >
          Candidate view
        </button>
        <button
          type="button"
          onClick={() => navigate("/employer/dashboard")}
          className={`${seg} ${isEmployer ? "layer-pressed font-semibold text-secondary" : "text-txt-dim"}`}
        >
          Employer view
        </button>
      </div>
      <p className="hidden font-body text-[10px] text-txt-dim sm:block">
        Prototype control — switches judged perspective
      </p>
    </div>
  );
}
