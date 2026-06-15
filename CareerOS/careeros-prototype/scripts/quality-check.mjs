import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];

function read(rel) {
  return readFileSync(path.join(root, rel), "utf8");
}

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return full;
  });
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

const srcFiles = walk(path.join(root, "src")).filter((file) =>
  [".js", ".jsx", ".css"].includes(path.extname(file))
);

const srcText = srcFiles.map((file) => readFileSync(file, "utf8")).join("\n");
const packageJson = JSON.parse(read("package.json"));
const readme = read("README.md");
const index = read("index.html");
const mockData = read("src/data/mockData.js");

const forbiddenSrcPatterns = [
  ["console.", "console statements"],
  ["debugger", "debugger statements"],
  ["TODO", "TODO markers"],
  ["FIXME", "FIXME markers"],
  ["#0E0F11", "old dark base color"],
  ["#161820", "old dark surface color"],
  ["#1E2028", "old dark elevated color"],
  ["#2A2D35", "old dark separator color"],
  ["#2ECC8F", "old bright accent color"],
  ["#E8A838", "old warning color"],
  ["#F0F2F5", "old light text color"],
  ["#8B91A0", "old dim text color"],
  ["IBM Plex", "old font family"],
];

for (const [needle, label] of forbiddenSrcPatterns) {
  assert(!srcText.includes(needle), `Found ${label} in src/`);
}

assert(packageJson.scripts.lint === "node scripts/quality-check.mjs", "lint script must run the local quality gate");
assert(packageJson.scripts.smoke === "node scripts/smoke-routes.mjs", "smoke script must run the route/data smoke gate");
assert(!readme.includes("React + Vite"), "README still contains Vite starter copy");
assert(index.includes('rel="icon"') && index.includes('name="description"'), "index.html missing favicon or description metadata");
assert(!mockData.includes("onboardingScript"), "mockData still exposes the retired onboardingScript");
assert(!mockData.includes("secondaryCandidate"), "mockData still exposes the retired secondaryCandidate object");

for (const rel of ["src/assets/hero.png", "src/assets/vite.svg", "public/icons.svg"]) {
  assert(!existsSync(path.join(root, rel)), `${rel} should not exist`);
}

if (failures.length) {
  console.error("Quality check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Quality check passed (${srcFiles.length} source files scanned).`);
