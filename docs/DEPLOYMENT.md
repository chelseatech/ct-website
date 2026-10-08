# Astro / Cloudflare proof of stack

Local prototype only. No pushes, integrations, credentials, public deployment, DNS or live-site changes were performed.

## Checkout and source evidence

- Repository `/workspace/ct-website`, clean initial checkout, initial commit `63ed1ff`, original README preserved.
- Origin fetch/push: `https://github.com/chelseatech/ct-website.git`.
- User-provided stable repository ID: `1404819440`. GitHub API verification returned HTTP 403 in this environment; ID remains independently unverified. Verify the ID and owner in the authorized account before connecting Cloudflare after the transfer.
- Local branch: `feat/astro-cloudflare-prototype`. No AGENTS.md or repository skills found.
- Website QA skill applied; WordPress workflow inspected and excluded because this is an Astro project.
- Public source: https://chelseatech.ca/ fetched 2026-10-08 through web tools. An initial cached response contained older service text and Computera/template remnants. A fresh fetch returned the current Canadian team, websites, useful tools and prototypes positioning and `ryan@chelseatech.ca`. Final copy follows that fresh response. No testimonials, client logos, prices or exploratory retainers are included.
- Typography, colors, abstract SVG and favicon are original prototype design choices. No third-party images/fonts, analytics, forms or backend. The contact action opens an email draft; no email was sent.

## Selected configuration

Astro 7.3.8 produces four HTML pages into `dist/`; Wrangler 4.149.0 serves static assets with a real 404, trailing-slash routing and `_headers`. No Cloudflare adapter needed for static output. Dependencies are pinned in the lockfile. Node 24 used locally; `.nvmrc` records it. The scripts disable Astro telemetry and direct Wrangler config to writable `/tmp` for this environment.

Use **Workers Static Assets** for a new project: current Astro guidance recommends Workers. No Worker script or paid resource bindings are required here. **Pages** can also serve this same `dist/` output with build `npm run build`, output directory `dist`, native Git previews and Pages rollback; it is a viable static alternative, but would mean selecting another hosting workflow. Workers is the forward-facing choice with optional runtime expansion later. This prototype proves static rendering, not Astro SSR or Cloudflare bindings.

Official sources checked 2026-10-08:
- https://docs.astro.build/en/guides/deploy/cloudflare/ — static Wrangler config and adapter only for on-demand rendering.
- https://developers.cloudflare.com/workers/static-assets/ — Workers static assets.
- https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/ — Pages alternative.
- https://developers.cloudflare.com/workers/ci-cd/builds/configuration/ — GitHub builds, production deploy and preview commands.
- https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/ — version rollback.

## Exact local commands

```sh
cd /workspace/ct-website
npm ci
npm run check
npm run build
npm run cf:dev
```

In another terminal, while Wrangler is ready on `http://127.0.0.1:8790`:

```sh
cd /workspace/ct-website
npm run test
# Stop Wrangler with Ctrl-C before a rebuild.
node scripts/content-update.mjs
npm run cf:dev
# In another terminal after it is ready:
npm run test
```

`npm run dev -- --host 127.0.0.1` provides the Astro authoring server. `npm run preview -- --host 127.0.0.1` previews the static build. The browser test needs a local Chromium executable (`/usr/bin/chromium` here); set `CHROMIUM_PATH` elsewhere. It emits local screenshots and JSON under ignored `artifacts/`. Wrangler hot reload lost its asset map while Astro replaced `dist/` during the edit test; stopping it before rebuild and restarting fixed this local issue. The content test changes a website service description, asserts the rebuilt text on Home and Services, then restores source and rebuilds in `finally`.

The default canonical origin is deliberately `https://ct-astro-prototype.example`. For an approved isolated deployment, set build variable `SITE_URL` to its actual workers.dev URL and rebuild. Keep noindex meta, robots exclusion and X-Robots-Tag for the prototype; these discourage indexing, they do not make a public preview private.

## Smallest next approval/access step

Ryan must authorize pushing this branch and a separate prototype deployment, and use an authorized Cloudflare account with GitHub access scoped to the transferred `chelseatech/ct-website` repository. If an existing integration already has the necessary access, verify and reuse it; otherwise owner approval is needed for the new integration. Workers Builds may create a build token automatically, so that setup is explicitly pending approval. Confirm free-plan availability/limits in that account before any build; do not enable billing or paid resources. No custom domain required.

## Deployment validation plan (not executed)

1. Reverify repository owner/ID and chosen branch after transfer. Review local changes, approve push, then push `feat/astro-cloudflare-prototype`. Create a separate Worker named `ct-astro-prototype`; no routes or custom domains. Use the approved feature branch as the initial prototype deploy branch (do not alter the live site).
2. Git root `/`; Node 24; build command `npm ci && npm run check && npm run build`; deploy command `npx wrangler deploy`. Worker name in dashboard must match `wrangler.jsonc`. Review generated permissions/token scope before saving. Record commit SHA, build logs, version ID and isolated workers.dev URL.
3. Set `SITE_URL` to the assigned prototype origin and rebuild. Check `/`, `/services/`, `/about/`, unknown URL 404, both SVGs, robots, headers, canonical metadata, navigation and email link on that URL. Repeat local/browser checks against it with `TEST_URL=https://<actual-host> npm run test` only after deployment authorization. Verify HTTPS and desktop/mobile rendering.
4. Enable non-production branch preview builds; current documented preview command is `npx wrangler preview`. Use a second content-review branch, edit `src/data/services.json`, push after approval, and record the generated preview URL. Confirm the edit reaches Home and Services while the main prototype URL retains its approved version. Do not guess preview URL format. No resources need branch isolation in this static project.
5. Review that preview, then approve merge into the prototype deploy branch to trigger a GitHub-driven update. Confirm the new commit/version and changed content. Failed checks must stop deployment. This is isolated prototype promotion, not approval to replace chelseatech.ca.
6. After at least two prototype versions exist, record the known-good version, then test rollback via the Worker's Deployments > previous version > Rollback, or `npx wrangler rollback <VERSION_ID>`. Confirm previous copy/assets, routes and 404 return. Also revert the corresponding Git commit before the next build so automatic deployment does not reintroduce rejected copy. Resource rollback is irrelevant here because there are no databases/bindings. Record the actual result; rollback is currently untested.

## Verification limits

Local Cloudflare runtime emits a warning that Request.cf could not be fetched through the proxy, using a placeholder. Static serving succeeds; no application uses Request.cf. Browser scans do not establish WCAG conformance. Screen reader review, Safari/Firefox, public TLS/CDN behavior, actual GitHub build authorization, preview publication, pricing eligibility and rollback remain untested. No live contact action was submitted.
