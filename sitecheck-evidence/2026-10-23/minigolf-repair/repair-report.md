# Minigolf approved repairs — targeted routine rerun

23 October 2026. Preview only; no merge or production publishing.

Preview: https://d4ce4c4d.foundry-a3k.pages.dev/boardroom/billboard/demos/mini-golf/
Draft PR: https://github.com/rkdb-nz/TabLab/pull/65
Branch: repair/minigolf-routine-20261023.
Product revision: ea14fb18d910d0c1b7a853c99064996c4b8fde40. Subsequent recovery changes are QA-only.

## Fixes I can make — repair disposition

| ID | Status | Change and targeted evidence |
|---|---|---|
| MG-01 | Resolved in tested conditions | Dialog panels bounded to the viewport and internally scrollable; Close sticky. At 320×568, Course scrolls 630px through 1097px content in a 467px client area, with Close at y=10. At 901×600, Course/Story/Events scroll 33/25/79px respectively; Close remains at y=10. Form controls are reached during submission tests on all tested small screens. |
| MG-02 | Layout repairs verified; native zoom retest limited | Narrow labels wrap, full Adventure heading fits, shallow-landscape header no longer overlaps copy, photos render at 900/901×600. Portrait-to-landscape Course remains open and scrollable. Former 200% native zoom condition could not be re-executed, as detailed below; do not claim a fresh native zoom pass. |
| MG-03 | Resolved for corrected text and controls | Dialog/body/form text now 16px; mobile details 12px and highlights 14px. Party-card dark text on orange 6.81:1, white on teal 5.16:1, kicker on cream 6.72:1, white tagline on green 7.48:1, white on lightest Story gradient endpoint 7.25:1. Close is white on dark green. Explicit two-colour keyboard focus style implemented. Live Chrome input inspection showed white 3px outline and dark 6px surrounding shadow. No fresh broad axe matrix. |
| MG-04 | Resolved | Visible demo notice. Form says nothing is sent or booked; successful local confirmation explicitly repeats that. All nine core browser/viewport combinations reject empty/invalid fields and produce truthful valid demo confirmation. No backend added or delivery attempted. |
| MG-05 | Resolved in tested states | After closing menu-opened Booking, focus returns to visible menu toggle at mobile sizes in Chrome, Firefox and WebKit; desktop returns to Book now. Visible focus style added across controls. Live keyboard Tab and Escape checked on deployed preview. |
| MG-06 | Resolved | Local-calendar minimum refreshed on date input/focus and window focus; custom error for past date. 2000-01-01 fails validity in every rerun combination; future date succeeds. Live min observed as 2026-10-23. |
| MG-07 | Resolved for initial artwork delivery | Same artwork, same pixel dimensions, smaller encodings: desktop 2,458,782→324,776 bytes; existing background 2,761,984→376,980 bytes. Combined 5,220,766→701,756 bytes, 86.6% reduction. Originals retained. Not a fresh real-user performance benchmark. |
| MG-08 | Resolved for semantic venue information | Named venue region supplies course/features, hours and address as text, including explicit fictional-demo context. Deployed accessibility snapshot exposes it. No real screen-reader certification claimed. |

Remaining repair findings: no newly reproduced functional failure in the completed sample. MG-02 native browser zoom remains an unverified testing condition, not a passed check.
New findings: none retained after the breakpoint corrections. Earlier diagnostic captures are preserved and labelled, not counted as final passes.

## Items needing your attention or input

- Background choice/artwork editing remains pending. Existing imagery was compressed without redesign or selection of a replacement background; baked wording behind mobile content remains a known pending decision.
- Public URL, indexing/metadata and analytics intent remain pending. No related product settings changed.

## Slim rerun scope and provenance

No exhaustive matrix or gate. No repeat broad audit, scans or synthetic timing suite. Only the named Minigolf product files changed; shared wrapper assets were unchanged. Previous unchanged wrapper/gallery links, analytics/service-boundary inventory and other unaffected source observations retain their earlier provenance in PR #63 and sitecheck-evidence/2026-10-23/minigolf-routine.

Core smoke sample: primary Chrome at 1440×900, 390×844, 844×390, 320×568, 780×300; Firefox and WebKit at 1440×900 and 390×844. Added 900/901×600 only for prior breakpoint failures. Dialog details tested at desktop, narrow Course and 901px Story/Events. Open-dialog rotation checked once. Native fullscreen return checked at desktop and portrait after waiting for the return control. All raw focus, validity, status, geometry, assets and errors are preserved.

Final primary browser: installed runner Chrome 155.0.8059.39, controlled by pinned Playwright 1.62.1. Firefox 153.0 and Linux WebKit 26.5. Firefox/WebKit final run 39841306520; installed-Chrome recovery 39843152637. Product files are unchanged between these two QA revisions. Reports carry tested merge revisions; source-and-media.json records local file hashes.

30 repair-phase screenshots captured and personally opened: 14 diagnostic Chromium captures from initial run 39840677468; four final Firefox/WebKit landing captures; 12 final Chrome targeted captures. Every retained PNG is marked in review-ledger.json. Earlier pre-repair 35 captures are reused evidence, not re-executed and not new repair-phase captures. No independent agent review used.

The initial interaction test queried an accessibility region after opening a modal had correctly made the background inactive; this stopped its tests and was corrected in QA. The initial Firefox/WebKit dependency installs and later pinned Chromium dependency install were cancelled after job limits; they produced no additional images. Current successful Firefox/WebKit tests supersede those setup failures. The recovery used Chrome already installed on the GitHub runner, with no repeated dependency download.

Exact remaining native zoom limitation: the extension-based zoom helper in installed Chrome timed out after 30,000ms waiting for the serviceworker event. No 200% zoom measurement or screenshot was produced. This is reported in the raw Chrome errors list; its other targeted checks completed. Do not substitute CSS magnification or count this as a native zoom pass.

Other limits: Linux viewports are not physical Samsung/iPhone/Safari tests; browser bars, keyboards, safe areas and actual screen readers remain unverified. No real booking/email/analytics delivery, production consent certification or live-user timing benchmark. Product changed; prior native zoom and contrast failures are historical and cannot serve as fresh repair passes.

The deployed product preview was opened in hosted Chrome. Its venue region, notice, Booking copy, current date bound, Tab focus style and Escape focus restoration were inspected. Cloudflare check associates the pinned preview with ea14fb1. No production branch update, merge or publish occurred.

## Durable evidence

This report, review-ledger.json, source-and-media.json, raw machine reports, original PNGs and SHA-256 hashes are preserved with the project in this folder and the four original browser archives. No dependence on three-day Actions artifact retention remains.

Archive mapping: chromium-diagnostic.zip contains first/chromium; chromium-final.zip contains recovery/chromium; firefox-final.zip contains final/firefox; webkit-final.zip contains final/webkit. Review ledger paths use those extraction prefixes.
