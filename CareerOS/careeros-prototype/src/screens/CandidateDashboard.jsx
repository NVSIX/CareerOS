import { useNavigate } from "react-router-dom";
import BentoGrid from "../components/BentoGrid";
import DataCard from "../components/DataCard";
import Badge from "../components/Badge";
import Button from "../components/Button";
import CoachingCard from "../components/CoachingCard";
import { jobs, primaryCandidate } from "../data/mockData";
import { useApp } from "../context/AppContext";

const NEW_MATCHES = [
  { jobId: "job-002", accent: true },
  { jobId: "job-003", accent: false },
];

export default function CandidateDashboard() {
  const navigate = useNavigate();
  const { state } = useApp();
  const { coaching } = primaryCandidate;

  const applied = state.appliedJobs;
  const gaps = state.skills.filter((s) => s.state === "asserted");

  return (
    <div className="mx-auto max-w-7xl p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-txt-dim">
        {state.candidate.name.toUpperCase()}'S CAREER ACTIVITY
      </p>
      <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-secondary">
        Dashboard
      </h1>

      <BentoGrid className="mt-6">
        <div className="flex flex-col gap-4 lg:col-span-7">
          <DataCard eyebrow="Applications" title="Applications">
            {applied.length > 0 ? (
              <div className="flex flex-col gap-3">
                {applied.map((job) => (
                  <div
                    key={job.jobId}
                    className="flex items-center justify-between gap-4 border-b border-separator/70 pb-3 last:border-b-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="font-display text-sm font-bold text-secondary">{job.title}</p>
                      <p className="mt-0.5 font-body text-xs text-txt-dim">
                        {job.company} - applied <span className="font-mono">{job.appliedDate}</span>
                      </p>
                    </div>
                    <Badge variant="primary">{job.status}</Badge>
                  </div>
                ))}
                <p className="mt-1 font-body text-xs text-txt-dim">
                  Applications update when employers act on your profile.
                </p>
              </div>
            ) : (
              <p className="font-body text-sm text-txt-dim">
                No applications yet - apply to a role to see it here.
              </p>
            )}
          </DataCard>

          <DataCard
            eyebrow="Trajectory engine - 2 new matches"
            title="New matches since last visit"
          >
            <div className="flex flex-col gap-3">
              {NEW_MATCHES.map((m) => {
                const job = jobs.find((j) => j.id === m.jobId);
                return (
                  <div
                    key={m.jobId}
                    className="flex items-center justify-between gap-4 border-b border-separator/70 pb-3 last:border-b-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="font-body text-sm text-txt">
                        {job.title} - {job.company}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-4">
                      <span className={`font-mono text-lg ${m.accent ? "text-accent" : "text-txt"}`}>
                        {job.match}
                      </span>
                      <Button variant="secondary" onClick={() => navigate(`/jobs/${job.id}`)}>
                        View role
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </DataCard>
        </div>

        <div className="flex flex-col gap-4 lg:col-span-5">
          <DataCard eyebrow="Evidence gaps" title="Profile completeness">
            {gaps.length > 0 ? (
              <>
                <div className="flex flex-col gap-3">
                  {gaps.map((skill) => (
                    <div key={skill.id || skill.name} className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-body text-sm text-txt">{skill.name}</p>
                        <p className="font-body text-xs text-txt-dim">asserted only</p>
                      </div>
                      <Badge variant="warning">Artifact needed</Badge>
                    </div>
                  ))}
                </div>
                <p className="mt-4 font-body text-sm text-accent">
                  <span className="font-mono">Add {gaps.length} artifact{gaps.length > 1 ? "s" : ""}</span>{" "}
                  to unlock <span className="font-mono">3 new role matches</span>.
                </p>
              </>
            ) : (
              <p className="font-body text-sm text-accent">
                All claims evidenced. Your profile is fully verified.
              </p>
            )}
            <div className="mt-3">
              <Button onClick={() => navigate("/candidate/profile?tab=edit")}>Edit profile</Button>
            </div>
          </DataCard>

          <CoachingCard dataBasis={coaching.dataBasis}>{coaching.body}</CoachingCard>
        </div>
      </BentoGrid>
    </div>
  );
}
