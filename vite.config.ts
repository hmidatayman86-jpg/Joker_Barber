// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// `npm run deploy` sets GITHUB_PAGES=true (see scripts/deploy-gh-pages.mjs) to build a static SPA
// for GitHub Pages. Every other build keeps the original Lovable/Cloudflare behaviour.
const githubPages = process.env["GITHUB_PAGES"] === "true";
const base = process.env["BASE_PATH"] ?? "/";

export default defineConfig(
  githubPages
    ? {
        nitro: false,
        vite: { base },
        tanstackStart: {
          server: { entry: "server" },
          router: { basepath: base },
          spa: { enabled: true },
        },
      }
    : {
        tanstackStart: {
          // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
          // nitro/vite builds from this
          server: { entry: "server" },
        },
      },
);
