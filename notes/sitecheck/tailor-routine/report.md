# Tailor — approved repair verification, 24 October 2026

**Routine targeted rerun passed within the sampled scope, with the recorded testing limits and decorative contrast exception. TA-01–08 resolved. No remaining approved repairs or new product findings. Preview only; production is unchanged.**

PR: https://github.com/rkdb-nz/TabLab/pull/77 . Branch: `qa/tailor-routine`.
Product revision: `9697225c768c284b735a93ee662609f6af0bf3c9`.
Verified preview: https://c4786cca.foundry-a3k.pages.dev/boardroom/skateboard/demos/tailor/ .
Original audit: [pinned report before repairs](https://github.com/rkdb-nz/TabLab/blob/9e238f52e5492c3d9c845c0faed9035d34dc2930/notes/sitecheck/tailor-routine/report.md). Its findings and limitations are historical and superseded below where resolved.

## Fixes I can make

All eight approved repair groups are resolved.

| ID | Resolution and verification |
|---|---|
| TA-01 | Landing copy and Enter the Atelier action can scroll internally on short screens. Chrome measured the action inside its reading area at portrait 390x844, narrow 320x568 and landscape 844x390/780x300. The fixed chapter arrows remain available. The Atelier reading panel can also scroll when necessary. |
| TA-02 | First two magazine spreads now have separate copy/photo columns. All six spread geometries checked; retained settled captures show the corrected first, second and final spreads. Collection label was moved clear of the fixed navigation. |
| TA-03 | Inactive chapters/slides are inert and excluded from screen-reader state; Tab no longer reaches inactive chapters or scrolls the desktop parent. Chapter state is synchronised after resizing and native scrolling. Desktop-to-phone and return measurements retain the selected chapter; subsequent Next works. Collection arrow keys turn looks rather than changing chapters. Rotation preserves the open craft disclosure. |
| TA-04 | Supporting text and navigation are larger and higher contrast. A light navigation surface and readable chapter chips avoid photograph-dependent contrast. Photograph caption now has a dark text surface. The intentionally faint, duplicated background numeral is explicitly decorative and hidden from assistive technology; its remaining raw Axe contrast warning is manually classified as decorative, rather than reported as readable copy. |
| TA-05 | Added a persistent main page heading, coherent chapter/subheadings, main/section landmarks, meaningful image alternatives, valid current/selected states and live chapter/look status. Removed the invalid group role on article. Collection, responsive Visit and dialog-result Axe checks have no actionable violations. See the documented decorative exception above; no claim of an entirely warning-free raw scan. |
| TA-06 | JS honours reduced motion in chapter and boutique movement; CSS disables transitions, animations and smooth scroll. Desktop transition and mobile scroll checks passed. |
| TA-07 | Book a visit opens a local enquiry dialog with boutique, date/time, name, email and notes. Required-field and invalid-email validation, valid completion, Escape/close and restored trigger focus passed across Chrome, Firefox and WebKit. Final status explicitly says no visit was booked and no message/enquiry sent. No real delivery occurs. Sticky dialog heading and reset result scrolling keep Close visible at short heights. |
| TA-08 | Existing 13 images resized/compressed to 1,684,332 bytes in total (from 11,097,787). Initial normal desktop resource transfer measured 660,744 bytes, versus the original 11,163,019 (about 94% lower), with offscreen images deferred. All files decode locally. One empty intermediate Walnut image was discovered before handoff, restored from the original asset and explicitly retested with every collection spread. No new imagery or changes to baked lettering. |

## Items needing your attention or input

None for the approved repairs. Indexing/metadata and shared analytics remain unchanged. The previously recorded shared PostHog configuration 404 is outside this repair scope.

## Checks and limits

- Initial targeted repair run `40060225561`, product `55c5131`: Chrome 83 recorded checks, Firefox 20 and WebKit 20. All functional/layout checks passed. Chrome's first collection scan found two semantic issues; these were corrected and separately retested. Firefox and WebKit desktop/portrait navigation, collection control, craft disclosures, boutique selection and full enquiry validation/completion passed.
- Final nine-combination landing/navigation smoke run `40060462095`, product `99e7ba8`: Chrome five sizes; Firefox and WebKit desktop/portrait. All heading/navigation/control checks passed. Collection Axe passed; Arrival identified the decorative numeral plus caption contrast. Caption was fixed; decorative numeral reviewed separately. Valid earlier form/rotation/fullscreen evidence reused.
- Focused label/dialog result run `40060601899`, product `a96d9f8`: Chrome desktop, portrait and short landscape. Close fully visible, truthful result and label clear of navigation passed. Collection and final-dialog Axe scans passed.
- Caption/decorative completion run `40060690351`, product `cc8eec5`: caption no longer fails; raw scan retains only the purely decorative numeral. QA `f983a51` records a narrow, explicit exception while preserving the raw warning. This is a manual classification, not a hidden zero-warning claim.
- Final collection-asset/Arrival completion run `40060971633`, product `9697225`: all six spreads decoded their images and the actionable Arrival scan passed. The raw decorative watermark warning and its explicit review exception remain in the report. This supplements unchanged nine-combination smoke results.
- Browser engines on Linux: Chrome 155, Firefox 153, WebKit 26.5. Actual embedded viewport examples: desktop 1426x845, portrait 382x763, narrow 312x487, short landscape 772x248. These are emulated dimensions, not physical phones or actual Safari/iOS certification.
- Desktop and phone fullscreen/return retained Visit chapter; gallery return passed. Native 200% browser zoom remains unverified from the original audit. No independent duplicate audit (optional routine mode).
- Source-hosted tests use the existing HTTP fixture. The deployed preview was separately opened in the cloud browser; Collection navigation and explicit no-send enquiry completion were inspected. The final deployed Walnut spread was opened and its image decoded at 1067px native width. Product console errors were not observed in executed tests. No production merge/publish.

## Evidence

`repair-evidence.zip` contains original machine reports and original-dimension WebP exports of inspected screenshots, with a review ledger and media measurements. Original PNG artifacts remain available for 90 days; committed exports persist beyond that expiry. Superseded captures (pre-final label, partially scrolled old dialog header, old contrast caption) remain labelled by product revision and are not claimed as final-state passes. The short-landscape reading capture can include an unsettled horizontal edge; action reachability is supported by measured reading-area geometry, not by treating that transitional edge as a product defect.

All 29 retained repair screenshots were opened and inspected. Machine reports record the Actions merge SHA; the product head revisions above identify the corresponding source. The archive also preserves earlier failing scans, so historical workflow failures are not rewritten as passes.
