# Engineering portfolio handoff

## Current architecture
Static HTML/CSS/JavaScript hosted on the existing Vercel project `engineering-portfolio`, connected to `devancal/engineering-portfolio`, production branch `main`. No database, upload server, authentication, or runtime secrets are required. This GitHub version supersedes the old Sites export; its old storage-binding problem does not apply to this application.

## Run and update
Requires Node 22 or later. `npm run build` generates the homepage, five standalone project pages and sitemap, then packages public files into `dist/`. Vercel explicitly builds with `npm run build` and publishes `dist/`. `npm test` checks local links/assets, anchors, metadata, JavaScript syntax, actual filter behavior and legacy project routing. For local preview use any static server from the repository root (for example `python -m http.server 8000`). Generated project `.html` files work locally; Vercel clean URLs also support paths without `.html`.

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

## Integrated V8 analysis (October 2026)
The separate Python card and page are folded into `/projects/project-v8#kinematics`; old Python URLs redirect there. `content/v8-analysis.html` owns the story, `kinematics-math.js` owns the analytic equations and SVG generation, and `kinematics-view.js` owns RPM/angle controls and slowed playback. Build renders the 3,000 RPM state as static SVG; JavaScript enhances it with zero external dependencies. The SolidWorks page links to the same analysis.

Verified against the actual `v8_kinematics.py` at source commit `8424f27b058f3213513e921fa1c24d8373887156`. Running the original script reproduced 12.73 m/s and 4,579.50 m/s² at 3,000 RPM. All 3,601 samples were compared with the web implementation to absolute tolerance 1e-8. The regression fixture retains every degree plus the 81.1° / 278.9° velocity extrema (363 samples), directly extracted from that run. Tests also check rod length, 80 mm stroke, numerical derivatives and linear/quadratic RPM scaling. `npm test` includes these checks. The original repository includes animation source but no exported GIF/video; the website recreates its geometry using the same equations.

Playback is 1/100 of physical speed and starts paused; RPM updates the underlying physical values. It pauses render work offscreen/background and supports angle scrubbing. No combustion, forces, stresses or full-engine dynamics are implied. Original source and both original PNG outputs are linked to the pinned source commit.

### Final verification status
Live desktop browser checks passed for RPM changes (1,000 and 6,000 RPM), crank-angle inspection, Play/Pause, keyboard Home controls, synchronized plots and displayed peaks. The 6,000 RPM state displayed 25.45 m/s and 18,317.99 m/s². Application numerical checks, build and links pass. The browser console showed extension-origin metadata errors, not an observed application exception. Mobile device emulation / viewport resizing is not exposed by the supported browser interface; actual phone-browser verification remains outstanding. Narrow-layout styles explicitly permit SVG containers to shrink, wrap control labels and numeric readouts, and enlarge SVG chart text at mobile breakpoints.
