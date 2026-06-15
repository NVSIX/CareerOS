# CareerOS Prototype

CareerOS is a Talentbank Tech Hackathon 2026 Stage 1 clickable prototype. It demonstrates a living career profile where claims become evidence, evidence becomes explainable trajectory matching, and post-hire outcomes feed the engine back.

## Run Locally

```bash
npm install
npm run dev
```

Vite serves the app at `http://localhost:5173` by default.

## Verify

```bash
npm run lint
npm run smoke
npm run build
```

`npm run lint` is a local no-dependency quality gate. `npm run smoke` checks the protected route table, job detail data, and Vercel SPA rewrite. `npm run build` must finish with 0 errors.

## Demo Flow

1. `/` - landing thesis and Stage 2 scope strip.
2. `/register` - candidate registration.
3. `/onboarding` - Amira evidence diagnostic.
4. `/candidate/profile` - living portfolio, scenario cards, trajectory chart.
5. `/candidate/skills` - SVG skill map and persistent career plan.
6. `/jobs` then `/jobs/job-001` - explainable match, pay benchmark, apply.
7. `/employer/dashboard` - pipeline, onboarding risk, flight risk, signals.
8. `/employer/retention` - Kevin Raj retention detail.
9. `/employer/candidate/cand-001` - shared evidence profile and 60-day outlook.
10. `/employer/salesforce` - Salesforce privacy boundary and 72 to 61 feedback loop.

## Architecture

- React 18 + Vite + React Router v6.
- Tailwind CSS with the V2 warm tactile token system.
- Recharts for trajectory charts, lazy-loaded by route.
- `src/context/AppContext.jsx` owns demo state and persists to localStorage under `careeros_v2_state`.
- `src/data/mockData.js` is the single source for prototype entities and copy.
- No backend, no auth, no API calls.

## Deployment

Deploy as a static Vite app. Build command: `npm run build`. Output directory: `dist`. `vercel.json` rewrites all paths to `index.html`, so direct route URLs work on Vercel.
