# Tab Lab browser audit

Run `npm install` then `npx playwright install --with-deps chromium firefox webkit` inside `qa`, then `QA_BROWSER=chromium npm run audit`; repeat with firefox and webkit.
By default a temporary local server serves the checked-out `public/` source, without deployment or changes to production.
Set `QA_ROOT` for another static source directory. Set `QA_BASE_URL` to test a deployed preview instead. Set `QA_TARGET` to a target in `targets.json`.

The shared runner and screen matrix can be copied to future sites. Each site gets its own target and small interaction adapter; do not assume Donut's menus/forms apply to another site.
Set `wrapped: true` for Tab Lab gallery demos: missing iframe/full-screen/return controls are failures. Use `wrapped: false` for a customer's standalone site. Each target can set `textSelector` and `minTextPx`; generic headings/body/form controls and a 12px warning threshold are the defaults. These thresholds are checks, not accessibility certification.
The GitHub workflow runs all three engines independently. Firefox uses viewport/touch coverage without isMobile; Linux WebKit is not actual Safari/iOS. Screens cover tablet, desktop, narrow phones, portrait, landscape and a shallow viewport representing browser bars. They emulate viewport and touch, not physical Samsung/iPhone hardware or Safari.

Evidence: `results/<target>/<run>/<browser>/report.json`, screenshots and `summary.txt`. A successful script is not design approval: review screenshots for spelling in artwork, spacing, hierarchy, balanced photos and interactions. Test real mobile browser behaviour where emulation does not suffice.

Only GET/HEAD HTTP requests are allowed during an audit. This blocks normal POST submissions, but is not a universal guarantee against side effects: future adapters must avoid live bookings, payments, side-effecting GET links, and external mail actions. Real submissions need a separately approved test environment. Inspect mailto destinations without sending email.

Keep one demo at a time. On GitHub the workflow runs when relevant PR files change; use manual dispatch once the workflow is accepted onto the default branch. No automatic publishing.

Use `##sitecheck <name or URL>` for the full protocol. See `qa/sitecheck/SKILL.md` and its references for the conditional checklist and evidence gate. The runner is a foundation: site-specific inventory, additional feature tests, visual review and independent review are required. Each capture starts unreviewed. JavaScript exceptions, asset failures and intentionally blocked requests are reported separately. CI artifacts expire after three days; preserve cited evidence with the project audit report.

Automated checks are separate from the full protocol gate: CI does not assert visual approval. Unexpected blocked requests fail the machine run for review. Console warnings are retained. Standalone pages use full-page captures; scrolled panels and open-state rotation need feature adapters.

A disconnected standalone fixture also runs on all engines. It checks ordinary below-fold content, embedded-frame selection, invalid form input and a local demo confirmation. These are runner regression checks, not a client-site audit.

Open-dialog rotation runs in the frame because Chromium cannot resize a native full-screen window via Playwright. The adapter also tests every dialog independently at each fixed full-screen size. Actual full-screen device rotation remains an explicit boundary.

Every capture asserts actual outer browser dimensions match the requested viewport. Firefox uses full-screen-api.ignore-widgets=true to keep fullscreen inside that emulated window; native OS fullscreen is not claimed. This prevents a desktop fullscreen render being cropped into a phone-sized screenshot.
