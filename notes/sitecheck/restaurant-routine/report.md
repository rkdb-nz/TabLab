# Restaurant routine sitecheck — 24 October 2026

Routine check complete with findings, within the declared available sample.

Repository: rkdb-nz/TabLab. Source: main at 489a557f5e1c139acdeb1f8913724775131b05d1.
Target: public/boardroom/springboard/demos/dining/. Public address: https://tablab.rkdb.nz/boardroom/springboard/demos/dining/
Tested the checked-out source copy using the existing GitHub Actions fallback; this is not a live deployment equivalence certification.
No product changes or production publishing.

## Fixes I can make
- **RT-01 (High)** Desktop booking claims receipt although nothing is sent; name alone opens success with no date or contact. Proposed: Keep a realistic booking flow, validate date/contact details, and end with an explicit demo-only/no-request-sent confirmation. Evidence: initial/chromium/booking-confirmation.png; booking result; sign.html inline submit handler.
- **RT-02 (High)** Guest count, date and time have no accessible labels. Proposed: Add persistent labels to all booking fields. Evidence: Axe select-name and label findings on sign.html.
- **RT-03 (High)** Time field ignores ArrowDown; FAQs are divs with tabIndex -1. Proposed: Provide a keyboard-operable time selector and FAQ buttons with expanded state. Evidence: Chromium time keyboard remained 7:00 pm; FAQ tab -1.
- **RT-04 (High)** Booking modal leaves focus on the submit button and has no accessible name, Escape handling or focus containment. Proposed: Name dialog; move/trap/restore focus; allow Escape and reachable close. Evidence: booking result activeElement is Request Table; source confirmation markup/handlers.
- **RT-05 (Medium)** Booking hints and review labels/initials fail normal-text contrast. Proposed: Darken foregrounds/backgrounds while preserving the palette. Evidence: Axe ratios: time hint 2.99, note 2.75, review meta 4.47, initials 3.01; requirement 4.5.
- **RT-06 (Medium)** Home navigation is visually hidden but its links remain keyboard-focusable. Proposed: Make the hidden navigation inert until shown. Evidence: Remaining Chromium landing first focus is nav-logo while nav opacity 0.
- **RT-07 (Medium)** Reduced-motion preference still runs scrolling animation and a 1.5-second mobile screen transition. Proposed: Disable nonessential animation and screen glides when reduced motion is requested. Evidence: Remaining Chromium: scrollDot; track transition 1.5s; inline transition set by JS.
- **RT-08 (Medium)** Pages omit main landmarks or leave content outside them; reservation portrait is described as a book. Proposed: Correct landmarks and image alternatives without changing artwork. Evidence: Axe region/main findings on five pages; booking screenshots show portrait where alt says Reservation book.
- **RT-09 (Medium)** Reviews explicitly claim Real words from real tables without a demo/sample indication. Proposed: Label fictional testimonial content as sample reviews. Evidence: reviews.html; reviews-desktop.png and reviews-phone.png.

## Items needing your attention or input
- Mobile booking opens a real email to clementinesdining@rkdb.nz. Keep that intended real email action, or use a demo-only final step? No email was opened/sent during this audit.
- Shared wrapper analytics returned 404 for PostHog config.js/config. Leave it unchanged or authorise a separate shared-tracker repair? No analytics settings changed.

## Coverage and limitations
Five content pages inspected through source and browser execution: Home, Dine, Wine, Sign, Reviews. Nine browser/outer viewport combinations completed across Chrome, Firefox and Linux WebKit, using source-copy execution. Actual frame dimensions are smaller than outer viewports and recorded in review-ledger.json.
33 captured screenshots were opened and visually inspected; screenshots are retained in the six Actions artifacts below for 90 days. The source-control report, raw machine reports and ledger persist in this branch.
Desktop and phone fullscreen/return worked, phone navigation worked using pointer wheel scene input, and portrait-to-landscape menu open state persisted. All five pages received one Axe scan. The empty name was rejected; a name-only booking exposed false success and missing date validation. No real submission occurred.
Initial phone PageDown-based navigation failed; the continuation tested normal pointer-wheel navigation and retained prior results instead of restarting desktop tests.
- Linux WebKit is not Safari/iOS; emulation is not a physical phone.
- Native zoom keyboard attempt had no effect: 1440x900 DPR1 before and after. Native 200% zoom remains unverified; narrow viewport checks are not a substitute.
- Initial keyboard-driven phone scene test failed; pointer wheel-based continuation successfully navigated all phone cases. Initial failures retained as runner evidence, not claimed as a touch-navigation site defect.
- Rotation kept open menu state; no rotation screenshot retained.
- Gallery destination reviewed in source, not clicked in this run; real email delivery and mail-app launch were not tested.
- No independent second-agent review used.
Titles exist; descriptions and page-level noindex are absent. No metadata or indexing changes proposed without deciding site-wide intent. Core local assets loaded; the shared external analytics configuration returned 404. Two existing images exceed 2MB; performance optimisation could be separately scoped if desired. No cold-load benchmark or slowed-load repetition was undertaken.

## Evidence
- Initial run: https://github.com/rkdb-nz/TabLab/actions/runs/40070911778 (artifacts restaurant-chromium, restaurant-firefox, restaurant-webkit).
- Missing-phone continuation: https://github.com/rkdb-nz/TabLab/actions/runs/40071063460 (artifacts restaurant-remaining-chromium, restaurant-remaining-firefox, restaurant-remaining-webkit).
- review-ledger.json maps every image, engine, actual viewport, phase and observation.
- machine-reports.json preserves raw results and initial runner errors. Raw screenshot inspected flags are superseded only by the separate human-reviewed ledger.
- Product source is unchanged from 489a557f5e1c139acdeb1f8913724775131b05d1; workflow merge commits are recorded in raw machine reports.


## Approved repair outcome — 24 October 2026

**Routine repair check passed within the sampled scope**, subject to the native-zoom and platform limits above.

### Fixes I can make
- **Resolved RT-01–09:** desktop booking now validates name, phone and a future opening date, uses labelled native time/guest controls, and ends with a truthful no-send confirmation. Mobile email now opens an in-page request draft and never opens a mail client or sends email, as explicitly requested.
- FAQ buttons support keyboard and expanded state; dialog Tab/Shift+Tab containment, Escape and focus return pass inside the demo iframe.
- Contrast, hidden-nav inert handling, reduced motion, main landmarks, portrait alt text and sample-review wording repaired. Six targeted Axe scans (five pages plus mobile email dialog) returned zero violations.
- No remaining or new product findings in the targeted sample.

### Items needing your attention or input
- Publishing approval only. Shared analytics, metadata and indexing remain unchanged.

### Targeted evidence and reuse
Product commit: 5b767160151752f84953520f3d6267fca87148a5. Branch: qa/sitecheck-restaurant. Preview: https://qa-sitecheck-restaurant.foundry-a3k.pages.dev/boardroom/springboard/demos/dining/
- Nine landing/navigation browser/viewport smoke combinations completed, with desktop and phone booking/keyboard checks in all three engines. Reused unchanged fullscreen/return evidence from the initial routine audit; gallery return/open was additionally verified on the deployed preview.
- Focus completion run https://github.com/rkdb-nz/TabLab/actions/runs/40071788439 passed in Chrome, Firefox and Linux WebKit (115 recorded assertions, 16 captures; six clean Axe scans).
- Final button layout run https://github.com/rkdb-nz/TabLab/actions/runs/40071953788 verified button height/reachability and modal layout at desktop, phone, narrow phone and landscape. Its only failures were an overly broad network assertion counting existing wrapper analytics as a booking send; raw results retained.
- Request-attribution continuation https://github.com/rkdb-nz/TabLab/actions/runs/40072122621 passed all three engines. It records and excludes only the known top-frame PostHog flags request; no booking-frame non-GET requests were attempted.
- Narrow completion https://github.com/rkdb-nz/TabLab/actions/runs/40072167553 passed after stacking fields at <=360px, preserving selected guest/time/date values.
- 37 repair-phase screenshots were opened and inspected in total, within the 40-capture routine ceiling. Reused audit images remain separately catalogued.
- repair-review-ledger.json records every repair image and observation, source provenance, superseded failures and limitations. repair-machine-reports.json preserves all raw results. The associated Actions ZIPs retain screenshots for 90 days.
- Original product-repair run https://github.com/rkdb-nz/TabLab/actions/runs/40071633164 exposed iframe modal focus escape; corrected before successful rerun.
- Changes are confined to Restaurant product files and Restaurant QA/evidence files. The shared workflow is restored to its main-branch version before review, so publication does not replace the existing shared checker.
