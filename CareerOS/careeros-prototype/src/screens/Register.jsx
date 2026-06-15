import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, User } from "lucide-react";
import Button from "../components/Button";
import { registration } from "../data/mockData";
import { useApp } from "../context/AppContext";

const ICONS = { User, Building2 };

export default function Register() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  // Candidate tile pre-selected by default (§3.1).
  const [selectedId, setSelectedId] = useState("candidate");
  // Pre-fill from context: registered name/email if returning, else Amira's
  // defaults (which live in defaultState's candidate object, not hardcoded here).
  const [name, setName] = useState(state.candidate.name);
  const [email, setEmail] = useState(state.candidate.email);
  const selectedRole = registration.roles.find((r) => r.id === selectedId);

  const handleStart = () => {
    if (!selectedRole) return;
    // Only the candidate flow owns the candidate identity — registering as an
    // employer must not rename the candidate persona (the employer identity is
    // fixed as Farah Iskandar across the employer views).
    if (selectedRole.id === "candidate") {
      dispatch({ type: "REGISTER", payload: { name, email } });
    }
    navigate(selectedRole.route);
  };

  return (
    <div className="mx-auto max-w-2xl p-6 pt-12">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-secondary">
        {registration.heading}
      </h1>
      <p className="mt-3 font-body text-base text-txt-dim">{registration.subline}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {registration.roles.map((role) => {
          const Icon = ICONS[role.icon];
          const isSelected = role.id === selectedId;
          return (
            <button
              key={role.id}
              onClick={() => setSelectedId(role.id)}
              className={`rounded-2xl p-6 text-left transition active:scale-[0.99] ${
                isSelected ? "layer-pressed ring-2 ring-primary" : "layer-raised"
              }`}
            >
              <span className="layer-inset flex h-12 w-12 items-center justify-center rounded-full text-secondary">
                <Icon size={22} />
              </span>
              <h2 className="mt-4 font-display text-lg font-bold text-secondary">
                {role.title}
              </h2>
              <p className="mt-1 font-body text-sm text-txt-dim">{role.desc}</p>
            </button>
          );
        })}
      </div>

      <div
        className={`mt-8 transition ${
          selectedRole ? "" : "pointer-events-none select-none opacity-50"
        }`}
      >
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="font-body text-xs text-txt-dim">{registration.fields[0]}</span>
            <input
              type="text"
              disabled={!selectedRole}
              placeholder={registration.fields[0]}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="layer-inset rounded-full px-4 py-2 font-body text-sm text-txt placeholder:text-txt-dim focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="font-body text-xs text-txt-dim">{registration.fields[1]}</span>
            <input
              type="text"
              disabled={!selectedRole}
              placeholder={registration.fields[1]}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="layer-inset rounded-full px-4 py-2 font-body text-sm text-txt placeholder:text-txt-dim focus:outline-none"
            />
          </label>
        </div>

        <Button
          variant="primary"
          className="mt-5"
          disabled={!selectedRole}
          onClick={handleStart}
        >
          {registration.button}
        </Button>

        {state.registered && (
          <p className="mt-3 font-body text-xs text-txt-dim">
            Welcome back, {state.candidate.name}.
          </p>
        )}
      </div>

      <p className="mt-8 font-body text-xs text-txt-dim">{registration.footnote}</p>
    </div>
  );
}
