import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataCard from "../components/DataCard";
import MetricBlock from "../components/MetricBlock";
import { jobs } from "../data/mockData";

const INDUSTRIES = ["All", "Logistics", "Retail", "Mobility", "Industrial"];

function matchClass(score) {
  if (score >= 80) return "text-accent";
  if (score >= 60) return "text-txt";
  return "text-txt-dim";
}

export default function JobListings() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState("All");

  const visible = jobs.filter(
    (j) =>
      (industry === "All" || j.industry === industry) &&
      j.title.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl p-6">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-secondary">Jobs</h1>
      <p className="mt-1 font-body text-sm text-txt-dim">
        Match scores reflect your demonstrated trajectory, not keyword overlap.
      </p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search roles"
          className="layer-inset w-full max-w-xs rounded-full px-4 py-2 font-body text-sm text-txt placeholder:text-txt-dim focus:outline-none"
        />
        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndustry(i)}
              className={`rounded-full px-3 py-1 font-body text-xs transition ${
                industry === i
                  ? "layer-pressed font-semibold text-secondary"
                  : "layer-raised text-txt-dim hover:text-secondary"
              }`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {visible.map((job) => (
          <button
            key={job.id}
            type="button"
            className="block w-full text-left"
            onClick={() => navigate(`/jobs/${job.id}`)}
          >
            <DataCard className="transition hover:bg-elevated">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-display text-lg font-bold text-secondary">{job.title}</h3>
                  <p className="mt-1 font-body text-xs text-txt-dim">
                    {job.company} - {job.location} - posted {job.posted}
                  </p>
                </div>
                <div className="flex items-center gap-8">
                  <p className="font-mono text-sm text-txt">{job.salary}</p>
                  <MetricBlock
                    label="Trajectory match"
                    value={job.match}
                    valueClassName={matchClass(job.match)}
                  />
                </div>
              </div>
            </DataCard>
          </button>
        ))}
        {visible.length === 0 && (
          <p className="py-8 text-center font-body text-sm text-txt-dim">
            No roles match - try a broader search.
          </p>
        )}
      </div>
    </div>
  );
}
