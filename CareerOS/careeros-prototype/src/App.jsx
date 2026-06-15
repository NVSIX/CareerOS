import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";

const Landing = lazy(() => import("./screens/Landing"));
const Register = lazy(() => import("./screens/Register"));
const OnboardingDiagnostic = lazy(() => import("./screens/OnboardingDiagnostic"));
const CandidateDashboard = lazy(() => import("./screens/CandidateDashboard"));
const CandidateProfile = lazy(() => import("./screens/CandidateProfile"));
const SkillTree = lazy(() => import("./screens/SkillTree"));
const JobListings = lazy(() => import("./screens/JobListings"));
const JobDetail = lazy(() => import("./screens/JobDetail"));
const EmployerDashboard = lazy(() => import("./screens/EmployerDashboard"));
const EmployerCandidateView = lazy(() => import("./screens/EmployerCandidateView"));
const RetentionDetail = lazy(() => import("./screens/RetentionDetail"));
const SalesforceConnector = lazy(() => import("./screens/SalesforceConnector"));

function RouteFallback() {
  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="layer-inset rounded-2xl p-5 font-body text-sm text-txt-dim">
        Loading CareerOS...
      </div>
    </div>
  );
}

function App() {
  return (
    <AppShell>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/onboarding" element={<OnboardingDiagnostic />} />
          <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
          <Route path="/candidate/profile" element={<CandidateProfile />} />
          <Route path="/candidate/skills" element={<SkillTree />} />
          <Route path="/jobs" element={<JobListings />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/employer/dashboard" element={<EmployerDashboard />} />
          <Route path="/employer/candidate/:id" element={<EmployerCandidateView />} />
          <Route path="/employer/retention" element={<RetentionDetail />} />
          <Route path="/employer/salesforce" element={<SalesforceConnector />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
}

export default App;
