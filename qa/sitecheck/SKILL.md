---
name: sitecheck
description: Run an evidence-based website audit for Tab Lab demos and future client sites. Trigger on '##sitecheck <name or URL>', '$sitecheck', or a request to use the Tab Lab site checking protocol. Combine Playwright tests across Chromium, Firefox and WebKit, desktop and phone portrait/landscape, direct visual inspection, an independent review, a conditional feature checklist, and one report with explicit gaps.
---

# Sitecheck

Read [the checklist](references/checklist.md) and [the execution guide](references/execution.md) before running. Use free tools; never subscribe, purchase, publish, merge, or send real orders/messages as part of an audit.

## Resolve and inventory

1. Resolve the requested site from available project context, repository and URL. For Tab Lab use `rkdb-nz/TabLab`; discover the current branch and demo path rather than assuming a previous preview is current. Audit one named site per invocation. Ask only if the target cannot be resolved.
2. Record source commit, tested URL, timestamp, scope boundaries and browser versions. Inspect source and rendered navigation to inventory every in-scope route, section, interactive control and state. Include routes accessible only through buttons. Identify external services and links. Do not claim to verify an entire external site.
3. Create a checklist record for every row in references/checklist.md. Assign one of **Passed**, **Needs fixing**, **Not present**, **Couldn't test**. Initially assign Couldn't test/pending. For Not present cite inventory evidence. Add site-specific checks for every discovered feature and expected state.
4. Preserve existing work. Use the existing QA runner when suitable; adapt its target and adapter to the inventory. A Donut adapter does not test another site automatically. For new projects use the runner setup in references/execution.md; never replace an existing suite blindly.

## Execute and inspect

5. Run Playwright on Chromium, Firefox and WebKit across the standard sizes in the execution guide. Test all routes and states in the inventory. Cover initial load and resizing/rotation, scrolled content, keyboard, zoom, reduced motion, and conditional features. Use test data only. Avoid arbitrary live form submission and side-effecting links; request a test environment only if necessary, otherwise record Couldn't test with its exact boundary.
6. Retain machine results and screenshots with route, state, browser, viewport, version and capture identifiers. Collect JavaScript exceptions, failed assets, and blocked requests separately. Test links by destination and resulting page; HTTP 200 alone does not prove the intended destination. Check every distinct link, including footer, email, phone, anchors, downloads and buttons. Record mail/phone syntax separately from actual delivery, which is outside this audit.
7. Personally open and inspect every screenshot covering the scoped matrix. Read all visible words, including image lettering, and inspect full-page content plus each scrollable panel to its end. Use close-ups where text cannot be read. Mark each capture in a review ledger only after viewing it. Screenshots saved is not screenshots reviewed. Compare source to rendered copy for missing content. Judge balance, whitespace, spacing, hierarchy and image cropping visually; geometry tests cannot settle these.
8. Delegate an independent pass when agent tools are available: provide the inventory, checklist and raw evidence, not the lead's desired conclusions. Have the reviewer inspect route/state completeness, visual evidence and core interactions. Reconcile differences by inspecting evidence. Record reviewer coverage and identity. If unavailable, mark independent review Couldn't test; do not quietly omit it.

## Report and fix

9. Run `scripts/coverage_gate.py manifest.json`. Use its schema in the execution guide. Resolve missing browsers, routes, states, screenshot reviews and checklist rows before calling the audit complete. A runner exit code of zero is not site approval. Distinguish **audit complete with findings** from **site passes**. Known defects can be fully audited; unexplained gaps cannot.
10. Return one plain-language report: overall verdict; version/URL; actual browser/size coverage; prioritized findings with reproduction and evidence; checklist statuses; exact untested boundaries. Group repeated failures. Avoid jargon and claims such as flawless, all possible checks, real-device tested, or Safari-tested when only Linux WebKit ran. Observe any current user output restrictions while preserving the full internal report.
11. Audit-only requests authorize recommendations, not product changes. If fixes are authorized, work on a preview branch, rerun affected states on all three engines and both phone orientations, and test shared-component impact on other sites. Inspect the new screenshots and obtain independent review of affected views. Do not ask the user to repeat the entire audit. Do not publish without their explicit authorization.

## Tab Lab conventions

- Prefer British/NZ spelling, including **flavours**.
- Verify visible product identity and return destinations are **Tab Lab**, not Foundry. Internal legacy filenames are not user-facing branding defects.
- Intended public addresses end in `.rkdb.nz`; distinguish actual hosting/preview URLs from intended public destinations. Report mismatches; never invent or silently replace addresses.
- For each demo verify a clear **demo purposes only** notice and honest success confirmation: no real order/payment/message sent where this is a demo.
- Test the Tab Lab return tab in full screen at every size and browser; verify it actually restores the frame, and gallery navigation returns to Tab Lab.
- Do not generate new images or hide baked image lettering with CSS unless specifically authorized.
