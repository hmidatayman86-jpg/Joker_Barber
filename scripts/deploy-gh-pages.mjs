// Builds the site as a static SPA and publishes it to the `gh-pages` branch.
import { execSync } from "node:child_process";
import { existsSync, writeFileSync, copyFileSync, rmSync } from "node:fs";
import ghpages from "gh-pages";

const run = (cmd) => execSync(cmd, { stdio: "inherit" });
const out = "dist/client";

// URL base path. The site is served from the root of its custom domain (see public/CNAME),
// so the default is "/". Only set BASE_PATH=/<repo>/ if you publish to <user>.github.io/<repo>
// WITHOUT a custom domain.
const base = process.env.BASE_PATH ?? "/";
console.log(`Building for GitHub Pages with base path: ${base}`);

rmSync("dist", { recursive: true, force: true });
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
