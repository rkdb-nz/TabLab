# Florist — routine sitecheck, 23 October 2026

**Routine check complete with findings, within the declared sample.** No product repairs or production publishing performed.

## Source and runs
- Repository: rkdb-nz/TabLab, product main `9c71de33a6be0fef3e62398e79c4d79ecb41c86f`.
- Target: `public/boardroom/skateboard/demos/florist/`; index shell, site.html, success.html, style.css, main.js and shared wrapper reviewed.
- Live URL directly opened and interacted with: https://tablab.rkdb.nz/boardroom/skateboard/demos/florist/
- QA branch and draft PR: https://github.com/rkdb-nz/TabLab/pull/75 . Tests/evidence only; do not merge as a product repair.
- Firefox/WebKit run 39914325719, QA head e79dfe5407022498d5e5ababbcdd6e202ad489d6.
- Chrome completion run 39914904081, QA head 3abf51966be828d8779eded5d11fa68a130a9fdc.
- QA commits only changed the runner and workflow, so the tested product content is the pinned main version above.

## Coverage
Chrome 155.0.8059.39: outer CSS viewports 1440x900, 390x844, 844x390, 320x568, 780x300. Firefox and Linux WebKit: 1440x900 and 390x844 each. Machine reports contain actual iframe dimensions; for example framed desktop 1426x845 and portrait 382x763. All nine combinations opened landing, followed navigation, reached enquiry, submitted safe reserved test data, and displayed success. Firefox/WebKit portrait scripts stopped during return navigation after their success captures (execution context destroyed), not during initial navigation or enquiry. This harness race was corrected for Chrome completion; no product bug is inferred from it.

Source/feature inventory: hero; six collection articles and image descriptions; navy reveal; enquiry contact details; name, email, phone, date, six enquiry-type choices, message; empty and invalid email states; success page and return; shell home, menu, fullscreen/return and gallery. Six arrangements and hero image were checked for loading in live Chrome. Shared menu opened/closed; route destinations reviewed, without auditing other sites. No emails/orders delivered.

Desktop/phone fullscreen and return measured in Chrome: fullscreen 1440x900 / 390x844; returning restored iframe 1426x845 / 382x763. Gallery return succeeded. A focused enquiry portrait-to-landscape rotation preserved the form and exposed submit/footer. Normal loads produced no page JavaScript errors in machine reports; image references loaded. Seven JPEGs total about 3.29 MB; no slow-load expansion or benchmark was warranted.

Axe scanned the two distinct inner pages once: site has color-contrast, label, select-name and region findings; success has a decorative landmark-region warning. Visible labels exist, but all six form controls have zero associated label elements. Placeholder text provides some incidental accessible names; it is not an adequate replacement for persistent connected labels.

## Fixes I can make — awaiting approval
| ID | Impact / evidence | Proposed repair |
|---|---|---|
| FL-01 | At 320px Enquire runs off the right edge; brand wraps to three lines. Collection subtitle is squeezed beside its heading at 320/390px. | Reflow mobile navigation and stack the collection heading/subtitle; preserve brand, rail, palette and scroll design. |
| FL-02 | Portrait success card loses most of its width to fixed outer/inner padding; return label wraps to three lines at 390px and branding is excessively broken at 320px. Text says “each and every moments”. | Responsive card padding, readable return button and corrected “each and every moment”. Keep scrolling available in short landscapes. |
| FL-03 | “invalid-email” reports typeMismatch=true but submission reaches Thank you and is saved. Empty form uses a generic alert; whitespace is not trimmed. | Validate trimmed required name and email, show accessible field-specific errors, focus the first error; preserve entered values. |
| FL-04 | All six controls have labels.length=0; event date/select lack reliable persistent names. Clickable logo is a div, absent from keyboard order. Decorative watermark produces region warning. | Connect labels and IDs; use a genuine logo link; visible keyboard focus; hide decorative duplicate watermark from assistive technology. |
| FL-05 | Axe confirms text contrast below 4.5:1: stone labels 2.76–2.87, card descriptions 3.46, navigation 4.04, intro copy 4.09. Tiny tracking-heavy supporting text compounds readability. | Darken supporting text within the existing palette and improve small-screen supporting text size/spacing. Decorative watermark stays decorative. |
| FL-06 | Success falsely says the enquiry was received and a response will follow, while main.js only writes full personal details to persistent localStorage. A direct email action also exposes an unverified demo contact address. | Keep a realistic enquiry process, reveal an explicit demo/no-message-sent result at the final action, and remove unnecessary persistent enquiry storage. Make demo contact action truthful too; no real delivery is authorised. |
| FL-07 | With prefers-reduced-motion:reduce, scroll remains smooth and card transition remains 1.2s. | Honour reduced motion for scripted scrolling, CSS scrolling and decorative transitions. |
| FL-08 | In phone fullscreen at 390px the Tab Lab return tab overlays the left part of the hero heading. Return works, but it obscures content. | Reserve space or reposition the return control for this demo, keeping it visible and usable. Prefer florist-local shell styling; retest shared consumers only if shared code changes. |

## Items needing your attention or input
- Indexing/analytics remain unchanged. Shared wrapper analytics config requests returned 404 during gallery navigation; decide separately whether tracking should be repaired or disabled. These errors did not block the florist features. No metadata/indexing change is included in FL-01–08.
- No imagery replacement or redesign is proposed. Existing composition and supplied imagery can remain.

## Limits and evidence
Native 200% zoom was attempted once: Control++ left viewport 1440 and DPR 1 unchanged in headless Chrome. A CSS zoom=2 capture is labelled as a surrogate; native zoom remains unverified. Linux WebKit is not Safari/iOS, emulated phone dimensions are not physical-device tests. Independent review was not used (optional routine mode).

All 39 file-backed captures were individually opened and visually inspected; review-ledger.json records filename, engine, outer dimensions and observation. One additional live cloud Chrome fullscreen capture was inspected inline (no exported original), making 40 captures total; routine capture budget is exhausted. A few enquiry screenshots were captured during long smooth-scroll travel; form submission/reachability is separately demonstrated by the resulting success captures. No incomplete scroll frame is treated as a layout failure.

Local Playwright launches failed because executables did not exist. The existing hosted fallback succeeded for Firefox/WebKit; its Chromium dependency install timed out at 240 seconds, exit 124, during Ubuntu font downloads. Completion used already-installed Chrome, without repeating that install. The initial Firefox/WebKit post-success return harness race remains explicitly recorded above.

`florist-evidence.zip` beside this report contains 39 inspected WebP exports at original dimensions (quality 85), three full machine reports and the ledger, preserved with the project beyond Actions expiry. Original PNG ZIP artifacts remain in the Actions runs for 90 days (21 January 2027). Original ZIPs are also downloaded in the working evidence folder; no claim those larger PNG originals were committed remotely.
