# Produce Stand routine sitecheck — 23 October 2026
Status: Routine check complete with findings, subject to limitations below.
Product source: main c56705ca90949d4bcf5bcad7973af91747270864; QA head 9f8e37beb4874ae9e9a3f39f281e83bf70d4ede7.
Live UI inspected: https://tablab.rkdb.nz/boardroom/noticeboard/demos/produce/
Hosted run: https://github.com/rkdb-nz/TabLab/actions/runs/39896865800
No product files changed. No merge or production publication.

## Fixes I can make
- PS-01 High: About Us thank-you paragraph is absolutely positioned over other content. Observed over the second card at 390x844, body at 320x568 and heading at 780x300. Put it in normal document flow and preserve internal panel scrolling.
- PS-02 High: panels do not manage keyboard focus. Across all engines, opening About Us then pressing Tab leaves focus on background Find Us. Hidden panels retain focusable close buttons. Add named dialog semantics, focus entry/containment/restoration, inert hidden panels and background isolation; preserve Escape and scrim close.
- PS-03 Medium: 200% CSS magnification overlaps brand and board and clips the page. Add reflow/height-aware layout with accessible overflow when needed. This is demonstrated with CSS zoom only, not a claim of verified native zoom failure.
- PS-04 Medium: short landscape content becomes exceptionally small: board list 11px, edit message approximately 6.82px at outer 780x300 (inner 772x248). Improve short-screen composition/readability, allowing appropriate internal scrolling rather than shrinking essential content. This is usability, not a minimum-font WCAG claim.
- PS-05 Medium: reduced-motion setting stops footer ticker but leaves side-panel transition at 0.42s and board animation at 0.25s. Respect reduced motion for panel, scrim, board and tooltip transitions.
- PS-06 Medium: Find Us presents fictitious directions/phone/email without an explicit in-panel demo explanation; phone and email are plain text. Add a clear demo notice and usable demo contact flow that cannot send to placeholder recipients. Existing map is already described as illustrative. Do not replace imagery.
 
## Items needing attention
- Confirm whether the noticeboard should offer working editing or only demonstrate an editable area. Current click/Enter/Space toggles a tooltip; no editor exists, and mobile hides the tooltip. Do not invent storage or credentials.
- Indexing/analytics remain pending. Shared wrapper PostHog requests returned config/config.js 404 and flags 401. Do not alter analytics or metadata without approval.

## Coverage and limitations
Chromium: outer 1440x900,390x844,844x390,320x568,780x300.
Firefox and WebKit: outer 1440x900 and390x844.
All nine combinations executed; home, board click, About/Find opening, close, Escape and keyboard focus sampled. Primary engine screenshots cover all panels at all five sizes. Rotation with Find open inspected.
27 hosted screenshots visually reviewed on contact sheets, with full-size follow-up of problematic About states, short landscape and CSS200. 2 additional live Chrome screenshots inspected (first was still transitioning; second verified settled panel). No unseen images claimed as reviewed.
Home accessibility scan: zero automated violations; this does not clear manually identified keyboard defects.
No page exceptions or first-party HTTP asset failures recorded. Forms/orders/payment do not exist in this demo.
Desktop fullscreen inner viewport 1440x900, return1426x845; phone fullscreen390x844, return382x763; gallery navigation passed.
Native zoom attempt Control++ left width1440 and DPR1 unchanged, so native200% remains unverified. CSS200 is a surrogate.
Panel internal scrolling exists in source on mobile; bottom-of-panel scroll interaction not separately exercised. Desktop short-height panel overflow remains hidden in source. Closed-panel semantics and focus reviewed in source.
Contrast on scenic/photo background not quantitatively certified; no formal contrast failure asserted. No slowed-load benchmark, native Safari/iOS, physical-device or independent review performed.
Original PNGs and machine reports: hosted artifacts produce-chromium,produce-firefox,produce-webkit retained90 days. Locally downloaded ZIPs and readable WebP exports are in produce-evidence; do not claim those binaries are committed to GitHub.

## Compact review ledger
chromium: 19 captures reviewed (5 home,10 panel,1 rotation,2 fullscreen,1 CSS200).
firefox:4 reviewed (desktop/portrait home and Find).
webkit:4 reviewed (desktop/portrait home and Find).
Inspection observations: desktop composition intact; portrait home board fits; About overlaps as PS-01; Find opens consistently with below-fold content on phones; short home text tiny; CSS200 overlaps; fullscreen return functions.


# Approved repairs and publication — 23 October 2026
Robert authorised all necessary repairs and publication, specifying that the board is demo-only.
PS-01–06 implemented. No editor, data storage, real call or email delivery added. Sample-board wording replaces the misleading editing invitation. Imagery, analytics and indexing remain unchanged.

## Resolved
PS-01: thank-you text in document flow; all panel bottoms reachable through internal scrolling. Chromium five sizes and Firefox/WebKit desktop+portrait measurements confirm no text overlap.
PS-02: named modal dialogs, inert closed panels/background, focus entry and containment, Escape and focus restoration. Keyboard checks passed in all three engines (with provenance below).
PS-03: visible-height fitting plus container queries repair CSS200 overlap. Chromium measured canvas1440x900, brand right529.58, board left720.81/right1412/bottom788. Native200% remains unverified.
PS-04: short landscape list18px with internal scrolling; scroll hint and keyboard-focusable list added. Fixed outer composition retained; internal list/panel scrolling is intentional.
PS-05: reduced-motion panel transition0s in Chromium; all transitions/animations disabled by media query.
PS-06: fictional address/map/stall explicitly labelled. Call/Email buttons show truthful no-action confirmations. No placeholder-recipient links.

## Rerun provenance and limits
- Run39897527183 / QA4f98eb3: Chromium5 and Firefox2 combinations,19+4 captures reviewed. All panel overlap/focus and bottom-reachability measurements pass; demo confirmations, reduced motion and fullscreen/return pass. CSS200 still failed at this stage and was corrected subsequently.
- Run39897781983 / QAdca8c79: Chromium5 and Firefox2 combinations after height correction.8 Chromium captures reviewed; magnification geometry above verified. Reuse valid earlier panel evidence. Subsequent product diff only adds list tabindex/label, small short-screen hint and cache version.
- Run39897887509 / QA958dd72: final WebKit desktop/portrait interaction, scroll, focus restoration and demo-contact checks passed; machine report inspected. Final Chromium/Firefox install --with-deps timed out with exit124 before browser launch; no fresh tests claimed for those jobs. Earlier successful Chromium/Firefox evidence is reused with its exact source version, not represented as final-commit execution.
- Preview live Chrome desktop inspected; keyboard About action focused Close. One initial cloud click timed out before dispatch; keyboard action subsequently succeeded.
- 31 repair screenshots inspected (23 initial+8 height correction); original audit evidence remains separate. No independent reviewer. Linux WebKit is not native Safari/iOS; phones emulated. Native browser200% and quantitative photo-background contrast remain unverified.
- Shared workflow restored to its original main content before publication; no unrelated CI configuration change retained.
- Original machine reports/PNGs in Actions artifacts retained90 days. Downloaded local evidence under repair-evidence. Only this text report/runner, not binary screenshots, is committed.
Remaining product findings: none identified within available targeted scope. No new product finding. Testing limits above remain.
