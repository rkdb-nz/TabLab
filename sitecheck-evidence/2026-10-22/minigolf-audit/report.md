# Minigolf sitecheck —22 October2026

**Audit incomplete. Readiness passed; confirmed product findings below.** No Minigolf product files were changed, merged or published. QA-only tooling was added to the existing draft branch.

## Fixes I can make

- **MG-01 —High: clipped dialogs and inaccessible controls.** At320×568 inside the frame, Course content/note is cut with scrolling disabled. At901×600, Above Par and Events extend beyond the screen; close targets and event action are partly outside the viewport even after panel scrolling. Give panels a reliable maximum height, scrollable content and reachable close controls. Evidence: WebKit320x568-framed-course.png;901x600-full-story.png;901x600-full-story-scroll-0-33.png;901x600-full-events-scroll-0-107.png. Chromium/Firefox corresponding states reproduce the issue.
- **MG-02 —High: responsive layout breaks.** At900×600, photos disappear, content is scattered through large empty areas and the navigation overlaps footer details. At901×600 desktop navigation labels collide. At568×320 and780×300 the logo/header overlaps hero copy and the Above Par badge overflows. Reconcile breakpoint rules, spacing and badge size. Evidence:900x600-full-home.png;901x600-full-home.png;568x320-full-story.png;780x300-framed-home.png across engines.
- **MG-03 —High: small text and weak contrast.** Phone footer text falls to about6–7px and several landscape form/body labels are9–10px. White desktop booking close icon is hard to distinguish on lime. Increase readable type and contrast, with scrolling where content needs space. Evidence: WebKit320x568-full-home.png;568x320-full-book.png;1366x768-full-book.png and textMetrics in machine reports.
- **MG-04 —High: misleading demo booking.** The form says a booking was made and promises a reply while its handler only displays text and disables the button. Add a clear demo notice and confirmation stating no booking/message was sent. Evidence: all16 confirmation checks per engine; site.html and js/app.js.
- **MG-05 —Medium: keyboard focus is lost after closing a phone dialog.** The original trigger is a menu hotspot that becomes hidden. Return focus to a visible control, such as the menu toggle. Evidence: expanded Chromium/Firefox reports fail focus restoration at320×568,360×780,390×844,412×915 and768×1024; source closeAll().
- **MG-06 —Medium: booking date accepts the past.**2000-01-01 passes validity in all16 tested sizes in expanded Chromium/Firefox. Add a current-date minimum and an understandable error. This was a local validity check; no real past booking was sent.
- **MG-07 —Medium: oversized initial media.** The slowed resource simulation downloads about5.43MB and takes about14.8–15.0seconds through loading and opening booking. Optimise existing image encoding/delivery without changing artwork. Conditions are150ms latency plus body-size/200,000 seconds delay independently per request; this is not a shared200KB/s network benchmark. Three cold contexts per engine were used where evidence is available.

## Items needing your attention or input

- **MG-I01 —Artwork decision.** Portrait/tablet backgrounds expose baked desktop navigation, map headings and footer slogans behind the mobile layout. Approve use of a clean existing background or a separately agreed artwork edit. No new imagery or CSS masking has been applied. Evidence:768x1024-full-home.png;390x844-full-home.png.
- **MG-I02 —Layout decision.** Comfortable text and complete content can require scrolling on short phones. Allow internal dialog scrolling; recommend preserving the landing composition where feasible, while prioritising access over squeezing everything into one screen.
- **MG-I03 —Audit limits, no technical action requested from you.** Full framed Story/Events/Booking/confirmation capture matrix, settled wrapper-menu visuals, full forward keyboard traversal/focus visibility, native200% browser zoom and automated accessibility scan remain incomplete. The live deployment and production headers were not rendered. Physical phones, actual Safari/iOS, browser chrome, virtual keyboard, safe areas and real delivery were not tested. These gaps prevent a completed-audit verdict. Audit evidence outside selected durable files still exists only locally and in expiring CI artifacts.
- **MG-I04 —Metadata/privacy intent.** Confirm whether demo pages should be indexed and what analytics/consent behavior is intended before any metadata or tracking changes. No legal/security certification is made.

## Version and execution evidence

Repository:rkdb-nz/TabLab. Product source main2767653f5208cd3b4a5dcbae4a1f28a0068d6be3. QA branch:qa/sitecheck-readiness; final tooling2bec875249ed924307fdc96ad7d28c0b6643ea71. Product files are unchanged. The preview discovered from PR63 ishttps://e0d06aac.foundry-a3k.pages.dev/boardroom/billboard/demos/mini-golf/; this URL was not rendered during this audit.

Readiness: Chromium151.0.7922.34 and Firefox153.0 on the existing hosted runner; WebKit26.5 locally. Playwright1.62.1. Open The Course was clicked and its dialog verified; actual1366×768 viewport and PNG dimensions matched; lead opened all three readiness images. Local Chromium install failed because downloaded ZIPs were invalid/truncated; local Firefox page creation hung. Hosted recovery supplied working engines. Source public files are unchanged between main and the QA merge tested by readiness.

Main matrix: all three engines completed16 viewport cases and224 captures each, including standard14 sizes and900×600/901×600 breakpoint probes. Sizes:1366×768,1440×900,1920×1080,320×568,568×320,360×780,780×360,390×844,844×390,412×915,915×412,780×300,768×1024,1024×768,900×600,901×600. Main route, direct entry/refresh, four fullscreen dialogs, local form validation/confirmation, menu/dialog rotation, reduced motion, CSS fullscreen fallback, return and gallery controls were exercised. Native fullscreen is a separate untested boundary.

Main reports have no JavaScript exceptions or first-party HTTP asset failures. Remote analytics asset blocking is intentional and separately recorded. Supplementary Home failure is a harness root-path guard error, not a verified broken site link. Root font-size200% captures are not accepted as browser zoom proof. Later CSS zoom captures are explicitly CSS magnification only.

Runs:https://github.com/rkdb-nz/TabLab/actions/runs/39666870057 andhttps://github.com/rkdb-nz/TabLab/actions/runs/39667227344. Readiness:https://github.com/rkdb-nz/TabLab/actions/runs/39664780881. Independent review:/root/independent_review;130 opened captures, source and reports. Raw reports, manifest and review ledger accompany this report. The coverage gate is expected to fail because the known gaps are honestly retained.

## Conditional checklist

| Check | Status | Evidence/boundary |
|---|---|---|
| scope | Couldn't test | Source inventory reconciled; missing full framed-dialog matrix and global Home render recovery. |
| copy | Needs fixing | Misleading booking promise; missing demo notice. Raster and duplicate background text reviewed in captures. |
| layout | Needs fixing | 320x568 framed Course loses lower content/note; 568x320 badge clips; 900x600 broken composition; 901x600 dialog content and controls cut. |
| media | Needs fixing | Images load; background artwork leaks baked text through portrait layout. Important raster copy lacks equivalent accessible text. |
| links | Couldn't test | Gallery return tested at all sizes. Five drawer page destinations render and contact mailto syntax correct. Home test hit local server root guard; not a site defect. Back/forward and brand anchor not fully exercised. |
| branding | Passed | Minigolf/A Hole in One and Tab Lab wrapper identity present; no user-facing Foundry name observed. |
| wrapper | Passed | Existing CSS fullscreen fallback and return/gallery controls worked in all three engines at16 sizes. Native fullscreen remains a boundary. |
| demo | Needs fixing | No clear demo notice. Booking confirmation promises reply although no booking is sent. |
| accessibility | Needs fixing | Portrait focus return fails; body/form/footer text too small; desktop booking white close icon on lime low contrast. Full forward keyboard and native zoom scan incomplete. |
| responsive | Needs fixing | Viewport sizes measured correctly; portrait/landscape rotation tested. Several layout failures. Physical device, keyboard/safe-area behavior untested. |
| forms | Needs fixing | Empty/invalid email rejected; submit disables; past date valid; misleading confirmation. No backend present or delivery tested. |
| commerce | Not present | No cart, quantity/totals, checkout, payment or commerce code in target inventory. |
| booking | Needs fixing | Booking request form only. Past date2000-01-01 passes browser validity; no availability/capacity service. |
| discovery | Not present | No search/filter/sort/paging controls in target source/rendered inventory. |
| menus | Needs fixing | Four dialogs and menu open/close tested; reverse focus stays inside dialogs. Portrait focus restoration fails. Wrapper menu captures taken before transition settled. |
| galleries | Not present | No carousel or interactive gallery inside Minigolf; Back to gallery is wrapper navigation. |
| accounts | Not present | No account/auth/session controls or service in target inventory. |
| services | Not present | Map is raster artwork; no interactive map, social/embed/download service inside Minigolf. Parent analytics handled under privacy. |
| reliability | Passed | All16 main matrix scenarios completed per engine; no JavaScript exceptions or first-party HTTP asset failures. Intentional external analytics blocking recorded separately. |
| performance | Needs fixing | Slowed resource simulation fetched5,429,133 bytes per cold run; first usable booking interaction about14.8–15.0 seconds in the documented simulation. Optimise oversized media. Not a real-user or global-bandwidth benchmark. |
| metadata | Couldn't test | Target title/description present; wrapper description/canonical/social basics absent. Demo indexing intent and production headers/robots not verified. |
| privacy | Couldn't test | Parent requests PostHog asset; main audit blocks remote traffic. No live analytics/consent/storage behavior certified. |
| review | Couldn't test | Lead opened all672 main captures as contact sheets plus readiness and selected full-size evidence. Some small text in overview sheets was not individually inspected at native resolution. Independent reviewer opened130 captures. Supplementary/final expanded visual matrix not fully reviewed; complete gate cannot pass. |

These are the findings discovered during these checks, not a guarantee that every possible fault has been found. Approve selected MG IDs before product repairs; then repeat sitecheck on the changed preview and report resolved, remaining and new findings. Production publishing requires separate approval.
