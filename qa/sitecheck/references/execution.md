# Execution and evidence

## Reuse the proven foundation

For Tab Lab inspect the repository's current `qa/README.md`, `qa/audit.mjs`, `qa/screens.json`, `qa/targets.json`, `qa/demos/` and `.github/workflows/browser-audit.yml`. The initial setup lives on `preview/donut-readability` / PR62 until merged. Never assume it reached main. Resolve source and report commit before reusing results.

For another site copy the generic foundation into its own repository only when authorized to set up checks. Retain existing tooling. Add its own target and feature adapter; the shared runner alone is a geometry/screenshot foundation, not a full audit. Pin Playwright and browser binaries together. Configure an appropriate static root or start the site's own development server and set QA_BASE_URL. Do not navigate an embedded map/video as if it were the main site; only enter an explicitly configured demo frame.

Run each browser separately with QA_BROWSER=chromium/firefox/webkit and QA_TARGET=<key>. Install the matching browser using `npx playwright install --with-deps <browser>`. CI is a fallback when local browser downloads are blocked. Keep standard free Linux runners and short artifact retention; do not enable paid runners or services. Check repository Actions availability rather than promise unlimited free usage. Retrieve results before expiry and retain audit evidence in the project's authorized durable location.

## Standard matrix

Use each engine on desktop 1366x768,1440x900,1920x1080; phone 320x568/568x320,360x780/780x360,390x844/844x390,412x915/915x412; short landscape780x300. Add tablet768x1024/1024x768 and any breakpoints discovered in source. Include full-page captures and panel scroll positions as separate states where needed.

Use viewport and touch emulation where supported. Firefox does not support isMobile; omit it and explicitly record viewport/touch coverage rather than Firefox phone emulation. Record engine version and host OS. Linux WebKit is an additional engine check, not actual Safari/iOS. Real phone hardware, browser chrome, on-screen keyboard, screen readers and browser/OS-specific behavior remain explicit limitations unless actually tested.

Supplement the runner with site-specific interaction tests for the full inventory and manual keyboard/focus/zoom/motion/accessibility checks. Use an accessibility engine such as axe when available; inspect actual contrast, labels and reading order too. Add slow-network runs where supported; record unsupported engine features. Avoid arbitrary live POSTs and side-effecting GETs. Blocking POST alone is not proof a site cannot send data. Prefer disconnected local copies or approved test backends.

## Coverage manifest

Produce a JSON manifest, separate from the runner's machine report. A screenshot review ledger can use the captures array. Populate facts from actual evidence, never from assumed success. Required matrix entries come from the reconciled inventory before execution, not from whichever screenshots happened to be generated.

```json
{
  "target":"Example", "version":"commit or deployment ID", "url":"https://example.rkdb.nz", "timestamp":"ISO timestamp",
  "browsers":["chromium","firefox","webkit"],
  "leadReviewer":"",
  "inventoryReconciled":false,
  "inventory":[{"route":"/","states":["landing-top"]}],
  "required":[{"route":"/","state":"landing-top","browser":"chromium","viewport":"390x844"}],
  "captures":[{"route":"/","state":"landing-top","browser":"chromium","viewport":"390x844","file":"capture.png","leadReviewed":false,"reviewEvidence":""}],
  "checklist":[{"id":"scope","status":"Couldn't test","evidence":"Inventory pending"}],
  "independentReview":{"reviewer":"","coverage":["/"],"evidence":""},
  "unresolvedRuntimeFailures":[]
}
```

Expand required entries for every route/state, browser and viewport. Include all checklist IDs from checklist.md, even absent features. Add existing screenshot file paths relative to the manifest, evidence references and reviewer notes. Record distinct lead and independent reviewer identities; independent coverage lists the routes actually checked. `acceptedBoundary:true`, a concrete `boundaryReason`, and `coreChecksComplete:true` are allowed together only for an explicitly explained scope boundary such as physical-device behavior, after exhausting available free methods; list it in the final report. Never use it for missing screenshots, unavailable browsers, unreviewed states, failed tests, or unfinished core checks. It records a limitation, not a Passed status. Do not suppress known defects to obtain a passing CI badge.

Run `python scripts/coverage_gate.py manifest.json`. Exit0 means the manifest asserts completed coverage, not that screenshots were automatically verified or every defect was found. Review evidence honesty yourself. An incomplete manifest exits1. A completed audit with defects may exit0 while the verdict remains Audit complete with findings. The machine runner may correctly exit1 because it detected product defects; classify them as findings rather than hiding them.

## Durable report

Keep the manifest, machine reports, browser versions, source version, review notes and cited images together in an authorized project location. Do not commit client secrets, test credentials or private user data. For a git-backed project use its branch/PR; for standalone deliverables use Library. A short-lived CI artifact alone is not durable retention.
