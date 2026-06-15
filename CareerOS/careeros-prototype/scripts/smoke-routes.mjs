import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { jobs } from "../src/data/mockData.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];

function read(rel) {
  return readFileSync(path.join(root, rel), "utf8");
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

const app = read("src/App.jsx");
const appShell = read("src/components/AppShell.jsx");
const jobListings = read("src/screens/JobListings.jsx");
const dashboard = read("src/screens/CandidateDashboard.jsx");
const jobDetail = read("src/screens/JobDetail.jsx");
const vercel = JSON.parse(read("vercel.json"));

const expectedRoutes = [
  "/",
  "/register",
  "/onboarding",
  "/candidate/dashboard",
  "/candidate/profile",
  "/candidate/skills",
  "/jobs",
  "/jobs/:id",
  "/employer/dashboard",
  "/employer/candidate/:id",
  "/employer/retention",
  "/employer/salesforce",
];

for (const route of expectedRoutes) {
  assert(app.includes(`path="${route}"`), `App route missing: ${route}`);
}

for (const target of [
  "/candidate/dashboard",
  "/candidate/profile",
  "/candidate/skills",
  "/jobs",
  "/employer/dashboard",
  "/employer/retention",
  "/employer/salesforce",
]) {
  assert(appShell.includes(target), `AppShell navigation missing: ${target}`);
}

for (const job of jobs) {
  assert(job.about && job.about.length > 40, `${job.id} missing detail copy`);
  assert(Array.isArray(job.performanceFingerprint) && job.performanceFingerprint.length === 4, `${job.id} missing fingerprint data`);
}

assert(jobListings.includes("navigate(`/jobs/${job.id}`)"), "Job listings do not route to each job id");
assert(dashboard.includes("navigate(`/jobs/${job.id}`)"), "Dashboard new matches do not route to each job id");
assert(jobDetail.includes("useParams"), "Job detail does not read the route param");
assert(jobDetail.includes("PRIMARY_JOB_ID"), "Job detail no longer identifies the flagship role");
assert(vercel.rewrites?.[0]?.destination === "/index.html", "Vercel SPA rewrite missing");

if (failures.length) {
  console.error("Smoke route check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Smoke route check passed (${expectedRoutes.length} routes, ${jobs.length} jobs).`);
