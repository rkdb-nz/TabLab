# Tab Lab sitewide check: continuation record

Authorised by Robert on 28 October 2026: start the whole Tab Lab and twelve-demo check now; save evidence so a fresh session can continue. This is an audit only. Do not repair public files or publish product changes without approval.

Repository: rkdb-nz/TabLab. Audit branch: audit/sitewide-2026-10-28.
Website source pinned to 7410e040214f7369013a41d47aa3422e4c4bd6e0. The workflow verifies that public/ is unchanged against this commit. Live target: https://tablab.rkdb.nz/.

## Where the running work is

Workflow: `.github/workflows/sitecheck-sitewide.yml`, display name **Tab Lab sitewide evidence sweep**. Find its latest run on this audit branch, not the older targeted repair workflow. Four jobs run independently: census, features, secondary, lighthouse. Each checkpoints `report.json` throughout collection, writes SUMMARY.md, and uploads an artifact even on failure. Artifact names are `sitewide-census`, `sitewide-features`, `sitewide-secondary`, `sitewide-lighthouse`; retention 90 days. GitHub Actions continues independently of this chat.

Starting a workflow is not completion. Do not claim captures have been inspected merely because they exist. Do not repeat all jobs if only one task needs recovery.

## Declared scope

- Inventory all 56 HTML source files and meaningful controls. Classify shared fragments and internal mobile review/preview pages separately; do not call those public journeys audited. Public content pages, including maintenance/start and demo success pages, are included.
- Census: all distinct public content documents at desktop 1440x900 and portrait 390x844, with a primary-size axe scan per document/template; all twelve wrapper pages visited. Home, Boardroom and Theatre booking also measured at 844x390, 320x568 and 780x300.
- Features: source-derived safe local controls, tabs, overlays, enquiries, finite scene/chapter controls, form states and demo completion honesty; Tab Lab menu rotation; shared fullscreen/return at desktop and phone. Special Retreat checks reuse the successful lab helpers for four galleries, nine scenes, reduced motion, invalid variants/preselection, keyboard and eight rendered contrast targets.
- Secondary: Firefox and WebKit, desktop and portrait, main landing plus all twelve demo landings; a main navigation interaction and representative local Retreat form.
- Lighthouse: main landing, Boardroom, Donut, Pottery and Retreat Book. Local snapshot scores, not production field metrics.
- Deployment GET comparisons: HTML/CSS/JS text resources; inspect mismatches and timestamps before attributing a fault. Browser asset observations cover images; no image-byte parity claim.
- Links: unique internal destinations inspected for response/title as well as status. External/mail/tel destinations inventoried; no external-site audits or real communications.

This sitewide scope intentionally exceeds a one-demo routine capture budget. Planned evidence is roughly 60–70 captures across tasks, with an 80-per-task hard guard; retain useful distinct states, not a full Cartesian screenshot matrix. Each retained required image must be actually reviewed. Report additional uncovered states honestly.

## Safety and interpretation

A read-only local static server rejects all non-GET/HEAD requests. Browser routes block mutations and external origins except Google Fonts, service workers and WebSockets are blocked, CSP disables form actions/workers. Form data is synthetic (`audit@example.invalid`). No real submissions or payments are authorised.

A generic control click or form submission is an observation, not an automatic pass. Review the before/after content and validation. Controls not reachable in the prepared state are explicitly marked pending for targeted follow-up. Local screenshot instability is not automatically a website defect. Decorative Retreat arrow phase holds and retries are recorded by the capture helper. Normal finite transitions are allowed to finish; reduced motion is tested separately.

## What the next session must do

1. Read this record and the latest run/jobs. Download all four artifacts. Preserve their source/runner commits and capture hashes. If collection is still running, do not start a duplicate.
2. Check errors, missing visits/scans, unstable captures, pending controls and form coverage against source inventory. Finish only the missing/ambiguous checks with targeted runs. The first sweep may require these follow-ups; it must not be reported as complete early.
3. Open and inspect every retained required screenshot at a readable scale. Write a visual-review ledger naming file, task/run, engine, viewport, state, hash and observation. Read the extracted visible copy and source where necessary for spelling/branding and truthful demo outcomes.
4. Resolve image-backed/incomplete axe contrast where important; generic axe incomplete results are not passes. Attempt keyboard/reflow/zoom and reduced-motion coverage that generic collection leaves unresolved. State platform limits.
5. Deduplicate confirmed findings across pages, sizes and engines. Return one concise report with the sitecheck protocol's two lists: fixes available for approval; actual user decisions. Separate testing limitations from decisions. No repairs or publishing in this phase.

Physical phones, actual Safari/iOS and screen readers, real delivery/backend semantics and universal pixel-perfect certification remain outside this audit. Earlier sitecheck reports can be reused only with unchanged-source provenance and must not be called fresh checks.

## Launch checkpoint

Run launched successfully: https://github.com/rkdb-nz/TabLab/actions/runs/40614967756 . Runner commit: 96ee0232fe0a9f9849bfa4abd537fe8a1f9a1f28. It was observed **in progress**, not merely configured, in the launching session. Inspect the run for current status.

Readiness in the launching session: source access passed (83 HTML/JS files read, 56 HTML files classified as 38 pages, 12 wrappers, two internal previews and four fragments). Hosted Chrome opened the live landing page, clicked “Let me choose”, waited for “The Boardroom” link to become visible, and the settled Explore panel screenshot was actually inspected at https://tablab.rkdb.nz/#explore. No live form submitted. Syntax checks passed for the new scripts; lab reference-contrast and retry/stability guards passed locally. Firefox/WebKit launch and collection proof is to be obtained from the secondary job, not assumed from availability.

Resume instruction for the user: **Continue the Tab Lab sitewide audit from run 40614967756. Read the HANDOFF.md on audit/sitewide-2026-10-28 in rkdb-nz/TabLab.**
