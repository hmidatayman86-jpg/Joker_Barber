// Builds the site as a static SPA and publishes it to the `gh-pages` branch.
import { execSync } from "node:child_process";
import { existsSync, writeFileSync, copyFileSync } from "node:fs";
import ghpages from "gh-pages";

const run = (cmd) => execSync(cmd, { stdio: "inherit" });
const out = "dist/client";

// Work out the URL base path: "/" for custom domains and <user>.github.io repos, "/<repo>/" otherwise.
let base = process.env.BASE_PATH;
if (!base) {
  base = "/";
  if (!existsSync("public/CNAME")) {
    try {
      const remote = execSync("git remote get-url origin", { encoding: "utf8" }).trim();
      const repo = remote.replace(/\.git$/, "").split(/[/:]/).pop();
      if (repo && !/\.github\.io$/i.test(repo)) base = `/${repo}/`;
    } catch {
      console.warn("No git remote 'origin' found — building for base path '/'.");
    }
  }
}
console.log(`Building for GitHub Pages with base path: ${base}`);

const env = { ...process.env, GITHUB_PAGES: "true", BASE_PATH: base };
execSync("npx vite build", { stdio: "inherit", env });

// SPA fallback + disable Jekyll so files starting with "_" are served.
const shell = [`${out}/_shell.html`, `${out}/index.html`].find(existsSync);
if (!shell) throw new Error(`No HTML entry found in ${out}`);
if (!existsSync(`${out}/index.html`)) copyFileSync(shell, `${out}/index.html`);
copyFileSync(`${out}/index.html`, `${out}/404.html`);
writeFileSync(`${out}/.nojekyll`, "");

await new Promise((resolve, reject) =>
  ghpages.publish(out, { branch: "gh-pages", dotfiles: true, message: "Deploy to GitHub Pages" }, (err) =>
    err ? reject(err) : resolve(),
  ),
);
console.log("Deployed to the gh-pages branch.");
