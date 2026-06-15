import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";
import SplitPanel from "../components/SplitPanel";
import DataCard from "../components/DataCard";
import CandidateHeader from "../components/CandidateHeader";
import SkillEvidenceList from "../components/SkillEvidenceList";
import EvidenceLegend from "../components/EvidenceLegend";
import TrajectoryChart from "../components/TrajectoryChart";
import CoachingCard from "../components/CoachingCard";
import Button from "../components/Button";
import MonoText from "../components/MonoText";
import { primaryCandidate, trajectoryScenarios } from "../data/mockData";
import { useApp } from "../context/AppContext";

// Each skill's evidence state ↔ the editable dropdown label.
const STATE_LABEL = { asserted: "Asserted", evidence: "Evidence-linked", verified: "Employer-verified" };
const LABEL_STATE = { Asserted: "asserted", "Evidence-linked": "evidence", "Employer-verified": "verified" };
const STATE_OPTIONS = ["Asserted", "Evidence-linked", "Employer-verified"];
const FIELD_CLASS =
  "layer-inset w-full rounded-full bg-transparent px-4 py-2 font-body text-sm text-txt focus:outline-none";

// Two-letter initials derived from the (possibly judge-edited) candidate name.
function initialsOf(name) {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function CandidateProfile() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { state, dispatch } = useApp();
  // ?tab=edit (set by the candidate dashboard's "Edit profile" CTA) defaults here.
  const [tab, setTab] = useState(params.get("tab") === "edit" ? "edit" : "portfolio");
  const { trajectory, coaching } = primaryCandidate;

  // Scenario choice lives in context so it persists across navigation (§3.4).
  const scenarioId = state.selectedScenario;
  const scenario = trajectoryScenarios.find((s) => s.id === scenarioId) || trajectoryScenarios[0];

  // Header reads the live persona from context (§3.4), not hardcoded mockData.
  const headerCandidate = {
    ...primaryCandidate,
    name: state.candidate.name,
    headline: state.candidate.headline,
    location: state.candidate.location,
    initials: initialsOf(state.candidate.name),
  };

  // Edit-profile local form state — deep-copied from context on mount; Save commits.
  const [fullName, setFullName] = useState(state.candidate.name);
  const [headline, setHeadline] = useState(state.candidate.headline);
  const [location, setLocation] = useState(state.candidate.location);
  const [skillRows, setSkillRows] = useState(
    state.skills.map((s) => ({ id: s.id, name: s.name, state: STATE_LABEL[s.state], source: s.source }))
  );
  const [draftName, setDraftName] = useState("");
  const [draftState, setDraftState] = useState("Asserted");

  const updateSkill = (i, key, value) =>
    setSkillRows((rows) => rows.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)));
  const addSkill = () => {
    setSkillRows((rows) => [...rows, { id: undefined, name: draftName, state: draftState, source: undefined }]);
    setDraftName("");
    setDraftState("Asserted");
  };

  const handleSave = () => {
    dispatch({ type: "UPDATE_PROFILE", payload: { name: fullName, headline, location } });
    const skills = skillRows.map((r, i) => ({
      id: r.id || `custom-${i}`,
      name: r.name,
      state: LABEL_STATE[r.state] || "asserted",
      source: r.source,
    }));
    dispatch({ type: "UPDATE_SKILLS", payload: skills });
    setTab("portfolio");
  };

  const TabButton = ({ id, label }) => {
    const active = tab === id;
    return (
      <button
        onClick={() => setTab(id)}
        className={`rounded-full px-4 py-1.5 font-body text-sm transition ${
          active ? "layer-pressed font-semibold text-secondary" : "text-txt-dim hover:text-secondary"
        }`}
      >
        {label}
      </button>
    );
  };

  const portfolio = (
    <>
      <CandidateHeader candidate={headerCandidate}>
        <Button variant="secondary" onClick={() => navigate("/candidate/skills")}>
          View skill map
        </Button>
      </CandidateHeader>
      <DataCard eyebrow="Living portfolio" title="Competency evidence profile">
        <SkillEvidenceList skills={state.skills} />
      </DataCard>
      <EvidenceLegend className="px-1" />
    </>
  );

  const editProfile = (
    <div className="layer-inset rounded-2xl p-5">
      <div className="flex flex-col gap-4">
        <div>
          <label className="font-mono text-[10px] uppercase tracking-[0.08em] text-txt-dim">
            Full name
          </label>
          <input
            className={`mt-1 ${FIELD_CLASS}`}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div>
          <label className="font-mono text-[10px] uppercase tracking-[0.08em] text-txt-dim">
            Headline
          </label>
          <input
            className={`mt-1 ${FIELD_CLASS}`}
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
          />
        </div>
        <div>
          <label className="font-mono text-[10px] uppercase tracking-[0.08em] text-txt-dim">
            Location
          </label>
          <input
            className={`mt-1 ${FIELD_CLASS}`}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </div>

      <h4 className="mt-6 font-display text-lg font-bold text-secondary">Skills</h4>
      <div className="mt-3 flex flex-col gap-2">
        {skillRows.map((row, i) => (
          <div key={i} className="flex flex-col gap-2 sm:flex-row">
            <input
              className={FIELD_CLASS}
              value={row.name}
              onChange={(e) => updateSkill(i, "name", e.target.value)}
            />
            <select
              className={`${FIELD_CLASS} appearance-none sm:w-56`}
              value={row.state}
              onChange={(e) => updateSkill(i, "state", e.target.value)}
            >
              {STATE_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        ))}

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            className={FIELD_CLASS}
            placeholder="Add a skill"
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
          />
          <select
            className={`${FIELD_CLASS} appearance-none sm:w-56`}
            value={draftState}
            onChange={(e) => setDraftState(e.target.value)}
          >
            {STATE_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <button
            onClick={addSkill}
            aria-label="Add skill"
            className="layer-raised flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-secondary transition active:scale-[0.98]"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="mt-6">
        <Button onClick={handleSave}>Save profile</Button>
      </div>
    </div>
  );

  const left = (
    <>
      <div className="layer-inset inline-flex w-fit gap-1 rounded-full p-1">
        <TabButton id="portfolio" label="Portfolio" />
        <TabButton id="edit" label="Edit profile" />
      </div>
      {tab === "portfolio" ? portfolio : editProfile}
    </>
  );

  const right = (
    <>
      <DataCard eyebrow="Trajectory engine" title="Trajectory">
        <div className="layer-inset rounded-2xl p-4">
          <TrajectoryChart
            actual={trajectory.actual}
            cohort={trajectory.cohortAverage}
            projection={scenario.projection}
          />
        </div>
      </DataCard>

      <div>
        <div className="grid gap-3 sm:grid-cols-3">
          {trajectoryScenarios.map((s) => {
            const isSelected = s.id === scenarioId;
            return (
              <button
                key={s.id}
                onClick={() => dispatch({ type: "SET_SCENARIO", payload: s.id })}
                className={`rounded-xl p-4 text-left transition active:scale-[0.99] ${
                  isSelected ? "layer-pressed border-l-4 border-l-primary" : "layer-raised"
                }`}
              >
                <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-txt-dim">
                  {s.tag}
                </p>
                <p className="mt-1 font-body text-sm font-semibold text-secondary">
                  {s.label}
                </p>
              </button>
            );
          })}
        </div>
        <div className="mt-3">
          <p className="font-body text-sm text-txt">{scenario.insight}</p>
          <p className="mt-1 font-body text-xs text-txt-dim">
            <MonoText>{scenario.basis}</MonoText>
          </p>
        </div>
      </div>

      <CoachingCard dataBasis={coaching.dataBasis}>{coaching.body}</CoachingCard>
    </>
  );

  return (
    <div className="mx-auto max-w-7xl p-6">
      <SplitPanel left={left} right={right} />
    </div>
  );
}
