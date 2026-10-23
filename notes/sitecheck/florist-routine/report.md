# Florist — approved repairs verified, 23 October 2026

**Routine targeted rerun passed within the sampled scope. FL-01–08 resolved. No remaining approved repairs or new product findings.**

Product commit: `5150d37056f7064520ed3c428dd9330c550da499`.
Verified preview: https://3ad54262.foundry-a3k.pages.dev/boardroom/skateboard/demos/florist/
PR: https://github.com/rkdb-nz/TabLab/pull/75 . Preview only; no production publish or merge.

## Fixes I can make
- FL-01–08: resolved. Mobile navigation fits at 320px; collection subtitle stacks; mobile success card and button reflow; name/email validation rejects whitespace and malformed addresses; six labels connect; keyboard logo works; both Axe page scans return zero violations; final enquiry/email actions truthfully identify the demo; no enquiry details persist; reduced-motion settings remove smooth scroll/transitions; fullscreen return button has a reserved strip above content.
- Remaining approved findings: none. New findings: none.

## Items needing your attention or input
- Production publishing awaits approval.
- Indexing and analytics remain pending/unchanged, including the original shared tracking configuration errors. No new imagery or visual redesign was introduced.

## Targeted verification and retained limits
Hosted run 39924944712 passed all three jobs: Chrome 155.0.8059.39, Firefox 153.0 and Linux WebKit 26.5. It checked the nine-combination sample: Chrome 1440x900,390x844,844x390,320x568,780x300; Firefox/WebKit desktop and portrait. All engines exercised landing/navigation, label connections, valid demo submission and return. Chrome added empty/whitespace/invalid email checks and error focus, desktop/phone fullscreen/return and gallery, rotation with entered message preserved, keyboard activation, reduced motion and both accessibility scans. Reports have 85 check records and zero recorded failures or page JavaScript errors. Actual iframe dimensions are included in machine reports.

Sixteen new screenshots were individually opened and inspected. The 320px invalid-state capture occurred during focus-scroll travel; invalid-email rejection and focused field are independently verified in the machine report, and deployed preview validation was checked directly through its accessible error state. Short landscape success remains scrollable, and its return link was reached and clicked successfully.

Live deployed preview was opened directly. Invalid email stayed on the form with a specific accessible error; a corrected reserved test address reached “This is a demonstration. Your enquiry has not been sent, and no response will follow.” No message was delivered.

Unchanged imagery, six-item inventory and source findings reuse the original evidence pinned to main 9c71de33a6be0fef3e62398e79c4d79ecb41c86f. The return-strip repair is local to the florist shell; shared demo-browser files are unchanged, so unrelated demo reruns were not warranted.

Native 200% zoom remains unverified: the original attempt and CSS-only surrogate are retained below; it was not repeated. Emulated phones are not physical-device tests; Linux WebKit is not Safari/iOS. Independent review was not used (optional routine mode).

The `repair/florist-repair-evidence.zip` archive contains 16 inspected WebP exports at original dimensions (quality 85), full reports for all three engines and review-ledger.json, preserved in the repository beyond Actions expiry. PNG originals remain in the 90-day Actions artifacts and downloaded working copies. The historical initial evidence remains alongside it.

The workflow now triggers on relevant pushes to this QA branch, preventing evidence-only commits from launching redundant tests. Its browser/test execution is otherwise unchanged.

---

## Initial inspection — historical record, superseded by repairs above

# Florist — routine sitecheck, 23 October 2026

Initial check completed with findings before the repairs documented above.

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

## Original findings — subsequently approved and resolved
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
