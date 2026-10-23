# Drilling repairs — 23 October 2026

Eight approved repairs implemented on `fix/drilling-sitecheck`, draft PR #67. Available targeted Firefox/WebKit checks passed. **Routine check passed within the sampled scope. Missing Chrome, native 200% zoom and final deployed-preview checks completed; existing Firefox/WebKit evidence reused.**

Preview: https://f011e2c3.foundry-a3k.pages.dev/boardroom/billboard/demos/drilling/

Product commit: c614f19a77c1e298095f6984effa9bb6c5cd876a. Production main remains 2767653f5208cd3b4a5dcbae4a1f28a0068d6be3. No merge or production publishing.

## Fixes I can make

| ID | Result and evidence |
|---|---|
| DR-01 | Mobile layout repairs resolved in available samples. Service labels stay inside cards, complete portrait words fit at outer 320×568 and 390×844, and the short-landscape CTA fits above the service row. Heading/proof separation passed Firefox landscape and CSS reflow samples. Native Chromium 200% zoom now passed: zoom API 2.0, DPR 1 to 2, viewport 1440×900 to 720×450; heading/proof remain separated and text stays within cards. |
| DR-02 | Resolved in tested conditions. Drawer header/Close remain fixed within the panel while navigation and content scroll independently. At outer 780×300, inner 772×248, Close stays at y10–54 after form completion, content scrolls 371px and navigation 71px. At outer 320×568, inner 312×487, Close also stays y10–54 while form content scrolls 215px. Submit, confirmation and all navigation items are reachable. Portrait-to-landscape with Services open passed. |
| DR-03 | Resolved. The only `.demo-notice` is inside Quote. Empty fields and malformed email fail native validation. Valid local completion says “Demo complete — no quote request was sent.” The complete status scrolls into view inside the content panel. No backend delivery added or tested. |
| DR-04 | Resolved in available checks. Closed drawer uses inert; Tab does not enter it. Opening removes inert and closing restores focus before hiding it. A div replaces the aside with unsupported dialog semantics. Firefox landing and quote axe scans report zero violations; incomplete colour checks are not treated as passes. |
| DR-05 | Resolved. Important desktop artwork wording has equivalent accessible company/heading/service text. The raster artwork remains visually unchanged and decorative to assistive technology. The live preview accessibility tree exposed the new company heading and service copy. Desktop heading scan passed. |
| DR-06 | Resolved in available checks. Form labels are 12px and inputs/textarea 16px on desktop and phone samples. White submit text over the replacement dark orange gradient has a worst-case calculated contrast of 6.96:1, above 4.5:1. Quote action buttons use the same dark gradient. |
| DR-07 | Resolved. Existing 1536×1024 artwork re-encoded from 2,616,167 to 359,234 bytes, an 86.27% saving. HTML and service-image CSS request the optimised file; the old asset is retained. Optimised artwork visually inspected. No new imagery or masking of baked lettering. |
| DR-08 | Resolved. Title, description and main accessible name now match A Hole in One Drilling. |

No known remaining product repair or new finding is retained. The narrow title-spacing issue discovered during visual review was corrected and rechecked before handoff. Testing limits below remain explicit.

## Items needing your attention or input

- None for the authorised repair scope. Search indexing and analytics were left unchanged as instructed. No publishing action has been taken.

## Validation and provenance

Existing pinned Playwright 1.62.1 / axe-core 4.11.1 runner and GitHub Actions fallback were reused. Firefox 153.0 became the available primary engine; Linux WebKit 26.5 supplied desktop/portrait smoke coverage. No exhaustive matrix or coverage gate was run.

| Run | Purpose | Outcome |
|---|---|---|
| 39851626354, product QA head 0bb4f4c | Planned nine-combination sample | Firefox/WebKit desktop 1440×900 and portrait 390×844 passed. Chromium setup failed before browser launch. |
| 39852184148, QA head 69095f5 | Targeted Firefox layout, short/narrow forms, rotation, accessibility, metadata and media | Zero recorded errors/assertion failures. Visual review caught narrow service-label clipping that the initial horizontal-only assertion missed; those images are retained as superseded evidence. |
| 39852688492, product head 0399991 | Service child-letter-spacing and confirmation visibility correction | Firefox 390×844, 844×390, 320×568, 780×300, 720×450; WebKit 390×844. Zero recorded errors/assertion failures. Narrow Professionals remained awkwardly split, prompting a final portrait text-column adjustment. |
| 39853092157, product head c614f19 | Final portrait text-column fit only | Firefox 390×844 and 320×568; WebKit 390×844. Zero recorded errors/assertion failures. All complete words fit in inspected final portrait captures. |

The final CSS change affects portrait service cards only. Valid unchanged landscape, drawer, form, desktop accessibility, contrast and image evidence is reused from the preceding repair commits. The earlier five menu-panel content reviews and shared gallery/fullscreen evidence remain in `notes/sitecheck/drilling` on QA commit 713d964e568d74375251ea6ed75033b2f97f3aeb; wrapper source and destinations were not changed. Earlier settled fullscreen evidence establishes baseline behaviour, not fresh certification of all repaired mobile content.

Nearby desktop samples used outer 914×600 and 915×600, with measured inner widths 906/907. These are not claimed as exact 900/901 inner-breakpoint tests. Each report records actual frame sizes in check evidence. All sizes are CSS viewport emulation, not physical phones.

38 retained repair screenshots were opened at readable size and reviewed, including seven new Chrome captures and the final deployed-preview capture. `review-ledger.json` records engine, state, outer viewport, source merge commit, observation and whether later evidence supersedes the image. All raw screenshots and reports are retained; passing machine checks never substitute for visual inspection. Two transient live Chrome screenshots were also inspected, one before the Quote transition painted and one settled; they are not counted as retained screenshots. Total repair captures: 40, comprising 38 retained/inspected images and the two earlier transient Chrome images. No further captures were added.

Source comparison confirms product edits are confined to the Drilling demo. Shared navigation/analytics, indexing configuration and other demos are unchanged. QA runners and evidence do not change production content. No messages, orders, quotes or payments were transmitted. Only safe local form data was used.

## Completed missing checks — supersedes earlier execution limits

Only the missing Chrome and final-preview work was run in this continuation; no product file was changed. Run https://github.com/rkdb-nz/TabLab/actions/runs/39878129677 at QA head cc52e8c125556e682aeca4abc99745585f51c445 completed successfully. Chromium 151.0.7922.34 passed the five remaining outer CSS sizes: 1440×900, 390×844, 844×390, 320×568 and 780×300. The report records 77 checks, zero assertion failures, zero page exceptions and no first-party asset HTTP errors. The normal Chrome menu/form smoke sample and native 200% zoom completed; previous Firefox/WebKit results and unchanged wrapper evidence were reused. Together these complete the planned nine browser/viewport combinations.

Native zoom used the existing Chrome extension zoom helper, not CSS magnification. The API returned 2.0; devicePixelRatio changed from 1 to 2; the direct demo CSS viewport changed from 1440×900 to 720×450. Heading width/scroll width are both 193px. Close remains y10–54 in Quote at that zoom. The actual zoom screenshot was inspected.

The exact final deployed preview URL above opened successfully in hosted Chrome at 1363×936. Menu and Quote interactions worked, the Quote-only notice was visible in the inspected final-preview.jpg, and closing returned focus to MENU. Browser logs contained extension metadata errors from a chrome-extension:// URL; they are not site failures. The earlier usage-limit rejection and failed Ctrl+Plus attempt are superseded by these successful checks.

## Historical execution limits (resolved where noted above)

- Chromium's hosted setup hit its 180-second limit during Ubuntu package installation, exit code 124, before launching the repair sample. The planned Chromium five-size sample was not passed. Available Firefox checks covered the failing narrow/short conditions; this does not fill every missing Chromium combination.
- A direct hosted Chrome Ctrl+Plus attempt left viewport 1363×936 and devicePixelRatio 1 unchanged. Native 200% zoom retesting is unverified. The Firefox outer 720×450 reflow sample is a different test and is not represented as equivalent native zoom evidence.
- Direct Chrome preview interaction and settled Quote inspection succeeded on earlier repair preview 2220753e; source c614f19's final preview deployment was confirmed by Cloudflare's GitHub check. Opening that final preview in Chrome was rejected by automatic approval review because the usage limit had been reached. It was not executed, and no alternate browser/network route was used to bypass the rejection.
- Hosted tests served checked-out source locally. The latest preview's deployed commit is established by the deployment check; its final network/browser render was not inspected at the earlier handoff. The completion above now supplies a separately identified deployed-page screenshot; source screenshots remain labelled as source screenshots.
- No physical Samsung/iPhone, actual Safari/iOS, virtual-keyboard/safe-area, real screen-reader or delivery certification. No independent second-agent review; optional in routine mode.

Original ZIPs, machine reports and the review ledger are committed beside this report, beyond Actions artifact expiry. PR: https://github.com/rkdb-nz/TabLab/pull/67 .
