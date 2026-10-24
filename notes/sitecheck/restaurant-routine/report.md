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
