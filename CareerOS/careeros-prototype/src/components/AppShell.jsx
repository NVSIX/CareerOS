import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Briefcase, Building2, Cloud, HeartPulse, LayoutDashboard, Menu, Network, User, X } from "lucide-react";
import RoleSwitcher from "./RoleSwitcher";
import { useApp } from "../context/AppContext";

const CANDIDATE_LINKS = [
  { to: "/candidate/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/candidate/profile", label: "Profile", Icon: User },
  { to: "/candidate/skills", label: "Skill map", Icon: Network },
  { to: "/jobs", label: "Jobs", Icon: Briefcase },
];
const EMPLOYER_LINKS = [
  { to: "/employer/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/employer/retention", label: "Retention", Icon: HeartPulse },
  { to: "/employer/salesforce", label: "Salesforce", Icon: Cloud },
];

const NO_SIDEBAR = new Set(["/", "/register", "/onboarding"]);
// No persona badge on the entry routes; everything else gets one.
const NO_BADGE = new Set(["/", "/register"]);

// Persona badge in the top bar — candidate name on candidate routes (incl.
// /onboarding, /jobs/*), Farah on employer routes (UPGRADE_3_SPEC §3.3).
function PersonaBadge({ pathname }) {
  const { state } = useApp();
  if (NO_BADGE.has(pathname)) return null;
  const isEmployer = pathname.startsWith("/employer");
  const Icon = isEmployer ? Building2 : User;
  const label = isEmployer ? "Farah Iskandar · Employer" : state.candidate.name;
  return (
    <span className="layer-inset hidden items-center gap-1.5 rounded-full px-3 py-1 sm:flex">
      <Icon size={14} className="shrink-0 text-secondary" />
      <span className="font-mono text-xs text-secondary">{label}</span>
    </span>
  );
}

function NavItems({ links, onNavigate, resetDemo }) {
  return (
    <>
      {links.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
              isActive
                ? "layer-pressed text-primary"
                : "text-txt-dim hover:text-secondary"
            }`
          }
        >
          <Icon size={16} className="shrink-0" />
          <span className="font-mono text-[11px] uppercase tracking-[0.08em]">{label}</span>
        </NavLink>
      ))}

      <button
        type="button"
        onClick={resetDemo}
        className="mt-auto px-3 py-2 text-left font-body text-xs text-txt-dim transition hover:text-secondary"
      >
        Reset demo
      </button>
    </>
  );
}

export default function AppShell({ children }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isEmployer = pathname.startsWith("/employer");
  const showSidebar = !NO_SIDEBAR.has(pathname);
  const links = isEmployer ? EMPLOYER_LINKS : CANDIDATE_LINKS;

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const resetDemo = () => {
    dispatch({ type: "RESET" });
    setMobileOpen(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-base">
      <header className="fixed inset-x-0 top-0 z-30 border-b border-separator/60 bg-base/90 backdrop-blur">
        <div className="flex h-14 items-center justify-between gap-3 px-4 sm:px-6">
          <Link to="/" className="font-display text-lg font-extrabold tracking-tight text-secondary">
            Career<span className="text-primary">OS</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <PersonaBadge pathname={pathname} />
            <RoleSwitcher />
            {showSidebar && (
              <button
                type="button"
                className="layer-inset flex h-9 w-9 items-center justify-center rounded-full text-secondary lg:hidden"
                aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((open) => !open)}
              >
                {mobileOpen ? <X size={17} /> : <Menu size={17} />}
              </button>
            )}
          </div>
        </div>
      </header>

      {showSidebar && (
        <aside className="layer-raised fixed bottom-0 left-0 top-14 z-20 hidden w-52 flex-col gap-1.5 bg-surface p-4 lg:flex">
          <NavItems links={links} resetDemo={resetDemo} />
        </aside>
      )}

      {showSidebar && mobileOpen && (
        <nav className="layer-raised fixed inset-x-3 top-16 z-20 flex flex-col gap-1.5 bg-surface p-3 lg:hidden">
          <NavItems links={links} onNavigate={() => setMobileOpen(false)} resetDemo={resetDemo} />
        </nav>
      )}

      <main className={`pt-14 ${showSidebar ? "lg:pl-52" : ""}`}>{children}</main>
    </div>
  );
}
