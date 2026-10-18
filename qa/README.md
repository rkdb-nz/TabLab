# Tab Lab browser audit

Run `npm install` then `npx playwright install chromium` inside `qa`, then `npm run audit`.
By default a temporary local server serves the checked-out `public/` source, without deployment or changes to production.
Set `QA_BASE_URL` to test a deployed preview instead. Set `QA_TARGET` to a target in `targets.json`.

The shared runner and screen matrix can be copied to future sites. Each site gets its own target and small interaction adapter; do not assume Donut's menus/forms apply to another site.
Screens cover desktop, narrow phones, portrait, landscape and a shallow viewport representing browser bars. They emulate viewport and touch, not physical Samsung/iPhone hardware or Safari.

Evidence: `results/report.json`, screenshots and `summary.txt`. A successful script is not design approval: review screenshots for spelling in artwork, spacing, hierarchy, balanced photos and interactions. Test real mobile browser behaviour where emulation does not suffice.

Only GET/HEAD requests are allowed during an audit. It cannot send live forms, payments or bookings. Real submissions need a separately approved test environment. Link destinations such as mailto should be inspected without sending email.

Keep one demo at a time. On GitHub the workflow runs when relevant PR files change; use manual dispatch once the workflow is accepted onto the default branch. No automatic publishing.
