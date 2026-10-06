# Engineering portfolio handoff

## Current architecture
Static HTML/CSS/JavaScript hosted on the existing Vercel project `engineering-portfolio`, connected to `devancal/engineering-portfolio`, production branch `main`. No database, upload server, authentication, or runtime secrets are required. This GitHub version supersedes the old Sites export; its old storage-binding problem does not apply to this application.

## Run and update
Requires Node 22 or later. `npm run build` generates the homepage, six standalone project pages and sitemap, then packages public files into `dist/`. Vercel explicitly builds with `npm run build` and publishes `dist/`. `npm test` checks local links/assets, anchors, metadata, JavaScript syntax, actual filter behavior and legacy project routing. For local preview use any static server from the repository root (for example `python -m http.server 8000`). Generated project `.html` files work locally; Vercel clean URLs also support paths without `.html`.

- Homepage and cards: `content/home.html`.
- Onshape, SolidWorks, pump, kinematics and Pine Script case studies: `content/projects.json`. Fields containing HTML are trusted author content, not an upload interface.
- RL case study: `content/rl-detail.html`.
- Styles: existing `styles.css`, `header-fix.css`, `rl-portfolio.css`, and consolidated additions in `portfolio.css`.
- Interactions: `app.js`; CAD rendering: `viewer-live.js`.
- Run build and test after edits; commit generated HTML and sitemap together with source. Pushing main triggers the existing Vercel integration.

## What changed
Preserved the original paper/scarlet visual identity, CAD models and detailed factual project records. Added static case-study URLs and sharing metadata, visible recruiter résumé/contact paths, a racing experiment narrative, and honest asset placeholders. InternAI is omitted from the public portfolio; its old URL redirects to selected work. Removed the dependency between portfolio content and the external 3D library. Fixed RL filter initialization and legacy deep links. Models load automatically within 450 px of the viewport, without a click. CAD auto-rotation is off; render work pauses when viewers are offscreen or the tab is hidden. Added loading failure states, keyboard-capable canvas controls, responsive additions and reduced-motion rules.

## Evidence and limits
The current repository explicitly describes the pump as an unbuilt CAD concept with a nonfunctional belt; preserve that limitation unless Devan provides an updated project record. Formula Buckeye remains membership only. Existing numeric kinematics and RL results are preserved, not newly reproduced. Racing behavior is described qualitatively; complete evaluation logs are needed before publishing a success rate. AI-assisted development disclosures are preserved.

## Assets to add
1. V8 assembly screenshots, actual motion recording, exploded view, and a before/after dimensional correction.
2. Racing clips labeled with model version and training/held-out track, plus complete evaluation logs and the code version used.
3. Pump drawing close-ups and any confirmed physical-build evidence if it exists.
4. Specific Formula Buckeye contributions after they have been completed.
5. Updated résumé whenever GPA, experience, or contact details change.

Put images/videos in `assets/` and reference them with root-relative URLs. Use descriptive filenames, width/height, meaningful alt text, lazy loading below the fold, and captions describing evidence and limitations. Replace the relevant `.asset-slot` when actual material exists. For major project case studies the slot markup is in `scripts/build.mjs`; racing has its own slot in `content/rl-detail.html`. No public upload/admin UI is supplied; updates are reviewed source changes in GitHub.

## Verification and remaining work
Automated static and interaction checks pass. Browser layout, external CDN behavior and live WebGL playback have not been exercised in this environment; the available Sites workflow prohibits improvising browser QA without its supported browser skill. Perform a manual desktop/tablet/phone pass before relying on visual QA. Test both engine models, motion playback, exploded views, pump load failures, keyboard focus and reduced motion. Large CAD assets remain intentionally unchanged to avoid corrupting animation/geometry. A future optimization is a validated smaller GLB plus real poster screenshots.

## Dependencies and deployment
Three.js 0.180.0 via jsDelivr; model-viewer 4.1.0 via Google CDN, both loaded as their viewer approaches the viewport. These services require network access. Main portfolio content remains accessible when JavaScript/CDNs fail. Vercel serves static files with clean URLs and the existing résumé redirect. No new paid services or backend were introduced.
