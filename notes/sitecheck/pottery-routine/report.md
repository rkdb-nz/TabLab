# Pottery — approved repair verification, 24 October 2026

**PT-01–08 and the studio sign are corrected. Routine check incomplete: browser coverage limited.** Chrome and Firefox passed the targeted rerun; WebKit installation timed out before execution. Publishing authorised by the user's “Yes. Then publisher.”

## Fixes I can make
All approved items are resolved in the tested product revision `f82c8862713ab9bc9755a4d802f20a19ef5732b2`; `49e607b32f117ef94a3bfa750ce0082f3473c1ef` changes only the test harness to accommodate deliberately deferred images.

| ID | Resolution and evidence |
|---|---|
| PT-01 | Restored mobile previous/next, scene counter/name, swipe hint and progress. Chrome verifies all five representative sizes, final disabled Next, previous and all scenes. |
| PT-02 | Desktop valid enquiries retain their entries and announce an explicit demonstration/no-send result. Required and malformed-email validation passed. Mobile workshop, contact and visit actions now show honest no-send results. |
| PT-03 | Instagram, Journal and Newsletter no longer have dead fragment links; each presents an honest demonstration status. |
| PT-04 | Resized/compressed 18 existing assets to 2,062,431 bytes total; deferred nonhero imagery. Chrome normal page transfer was 2,087,503 bytes, down from the original 38,316,240-byte measurement (about 94.6%). Small favicon verified. |
| PT-05 | Improved text contrast and supporting labels. Desktop/mobile Axe scans returned no violations in the targeted Chrome sample. Visual inspection confirms readable controls and copy at retained sizes. |
| PT-06 | Added main landmark, corrected heading hierarchy and live result status. Desktop/mobile Axe scans passed. |
| PT-07 | Reduced motion honoured in both layouts; desktop parallax skips it. Maker photos have Pause/Play; pause verified over an interval longer than a rotation. Reduced-motion scene transition verified. |
| PT-08 | Responsive route selection now waits for layout and responds to resizing. Chrome checks 980/1000 boundary, five representative viewport routes and wrapper fullscreen/return/gallery. Firefox desktop/portrait route/navigation smoke passed. |
| Sign | Corrected studio photo reads ASH & OAK / POTTERY STUDIO. Corrected asset retained through compression and visually inspected. |

## Items needing your attention or input
None for the authorised repairs or publication. Previously unapproved indexing/analytics decisions remain unchanged.

## Coverage and evidence
- Chrome 155.0.8059.39: 1440x900, 390x844, 844x390, 320x568, 780x300; repaired states, dialogs, rotation with dialog open, keyboard/native validation, reduced motion, wrapper returns, media transfer and two accessibility scans. No runner failures, unexpected console errors or failed product assets recorded.
- Firefox: desktop 1440x900 and portrait 390x844 landing/navigation and representative interaction passed on identical product code in run39998585163.
- Chrome passed in run39999262795. Earlier Chrome/WebKit jobs were cancelled when an image-decode test wait was found to include intentionally lazy images; the harness was corrected. WebKit rerun hit the240-second installation limit and its browser tests did not execute. No WebKit pass is claimed.
- All12 retained Chrome screenshots and2 Firefox screenshots were visually inspected. Repair archive contains original machine reports plus a review ledger and resized-free WebP copies of captures at original pixel dimensions.
- Deployed preview checked in the signed-in browser: https://467499c2.foundry-a3k.pages.dev/boardroom/skateboard/demos/pottery/ . Harmless form interaction returned the explicit no-send result.
- Native200% browser zoom remains unverified from the original audit; no physical-device or actual Safari certification. No independent duplicate audit. Shared analytics404 remains outside the approved product repairs.
- Publication target: https://tablab.rkdb.nz/boardroom/skateboard/demos/pottery/ . Publication authorised; live verification follows the production deployment.

## Original audit and sign evidence (historical)
The following audit describes the pre-repair source and its findings; its “pending” language is historical and superseded by the resolution table above.

# Pottery — routine sitecheck, 23 October 2026

**Routine check complete with findings within the declared sample. Eight proposed repair groups; product files and production remain unchanged.**

Source: rkdb-nz/TabLab main `8b095bc1a0f6a03754b4cb738ee9d7f03a10c826`.
Target: `public/boardroom/skateboard/demos/pottery/` (index shell, desktop site.html, mobile.html, CSS and JS). mobile-review.html is an unlinked layout-review fixture, reviewed as source rather than a customer journey.
QA branch: qa/pottery-routine; draft PR https://github.com/rkdb-nz/TabLab/pull/76 .

## Fixes I can make
| ID | Impact and evidence | Proposed correction |
|---|---|---|
| PT-01 | Mobile has five scenes but no rendered scene menu, next/back buttons, chapter counter or swipe hint; only brand, gestures and keyboard listeners remain. CSS for the missing controls is present. All four phone-size hero captures confirm the absent guidance. | Restore visible accessible scene controls and a discreet swipe hint, while retaining the cinematic design. |
| PT-02 | Desktop valid test submission resets the form and promises “we will reply within two days”, although its inline handler never sends anything. Mobile workshop/contact/visit links open mailto without explaining the demo. | Keep a realistic flow, then show a truthful demo/no-message-sent result at the final action. Retain user entries long enough to review, and announce the result accessibly. No real delivery. |
| PT-03 | Desktop Instagram, Journal and Newsletter links all use href="#", taking visitors to the top instead of providing the advertised service. | Give each an honest demo outcome or clearly unavailable state; do not invent external profiles. |
| PT-04 | A single normal desktop load transferred 38,316,240 bytes. Sixteen loaded images include multi-megabyte photos and a 2.87 MB favicon; mobile markup also eagerly references gallery images inside closed dialogs. | Resize/compress existing images and favicon and defer off-screen/dialog media. Preserve the pictures and their baked text; no new imagery. |
| PT-05 | Desktop Axe found 23 text contrast failures, including supporting text around 2.8–3.97:1 where 4.5:1 is required. Small tracked supporting labels further reduce readability. | Improve text contrast and small supporting type while preserving the palette and composition. |
| PT-06 | Desktop lacks a main landmark and skips heading levels in process, workshops and footer; Axe reports landmark-one-main, region and heading-order findings. Success message has no live announcement. | Add coherent landmarks/headings and an announced form result without changing visual hierarchy. |
| PT-07 | Mobile prefers-reduced-motion still measures a 1.5s scene-track transition; maker images automatically alternate every 6.5s with no pause control. Desktop parallax JS also runs regardless of reduced-motion preference. | Honour reduced motion in JS and CSS and provide a way to pause/avoid automatic image cycling. |
| PT-08 | Initial WebKit 1440x900 run was redirected to mobile.html despite final iframe width 1426px. Focused retry loaded site.html and desktop navigation correctly. Inline redirect executes before viewport/layout setup and there is no robust reverse route on resizing. | Make initial responsive routing reliable after layout settles and preserve a sensible section/scene when crossing the breakpoint. Treat the observed routing error as intermittent, not universal. |

## Items needing your attention or input
- Sign correction separately approved on 24 October 2026: the photograph now reads “ASH & OAK / POTTERY STUDIO”. Applied to the preview only. The other PT-01–08 repairs still await approval.
- Indexing/metadata and shared analytics are unchanged. Shared PostHog configuration requests returned 404 on gallery navigation; any analytics repair/disable decision remains separate.

## Scope and executed coverage
Primary Chrome 155.0.8059.39: desktop 1440x900, portrait 390x844, landscape 844x390, narrow portrait 320x568, short landscape 780x300. Firefox 153.0 and Linux WebKit 26.5: desktop and portrait smoke checks. Actual iframe dimensions are recorded; examples: desktop 1426x845, phone 382x763, short landscape 772x248.

Readiness proven through source access, hosted browser launch, desktop Studio navigation, captures and actual visual inspection. All nine combinations launched. Initial mobile body-targeted key events did not focus the iframe, leaving scene 0; subsequent clicks on inactive scene controls timed out. This is a harness limitation, not evidence that mobile navigation is broken. Focused tests explicitly focused the brand link: scenes 1–4, all three collections, seven making stages, maker/workshop dialogs and internal scrolling passed in all three engines at portrait. Chrome additionally exercised 320x568 and 780x300 scenes and controls. The focused WebKit desktop run restored desktop layout and clicked Studio.

Desktop inventory reviewed: hero, welcome/statistics, philosophy, studio, artist, seven process stages, three collections, three workshops, six gallery images, visit details, required name/email/message form, invalid email, success and footer. Mobile inventory reviewed: five scenes, maker image cycling source, three collections and controls, seven stages, five dialogs (maker/gallery/workshops/contact/visit), close controls and mailto destinations. All distinct inner link destinations inspected; external messages/booking actions were not sent. Shared wrapper's navigation was reviewed previously and gallery/fullscreen/return were exercised here; no audit of unrelated destinations.

Dialog content may scroll internally: measured workshop scroll reaches its last enquiry link at portrait, narrow portrait and short landscape. A workshop-open portrait-to-landscape rotation preserved the open dialog. Short-landscape supporting text/contact button is deliberately hidden by source styling; primary workshop/visit actions remain available. This is recorded rather than marked as clipping.

One Axe scan per distinct page/template: desktop yielded contrast/heading/landmark findings; mobile scan on its active visit state returned no violations. That mobile scan does not certify photographic contrast in every scene. Normal-load images all decoded; no page JavaScript errors were recorded in the first run. No synthetic slow-load benchmark was added; measured eager media bytes substantiate PT-04.

Fullscreen: desktop opened/returned and gallery return worked. A phone capture during animation showed mixed scenes; one focused settled check disproved a lasting layout fault. Maker scene stayed at top 0 with journey scrollTop=0: before [382,763], fullscreen [390,844], return [382,763]. Settled screenshots independently inspected; gallery return succeeded. Do not repair fullscreen based on the superseded in-transition capture.

## Provenance, evidence and limitations
Runs:
- 39928123358, QA c067db35c801bccca6a41f1c644512c960a14ccc: initial sample/desktop review; mobile harness focus limitation and intermittent WebKit route recorded.
- 39929484905, QA d53fac76a0856bdee62315472a204e0794ddff71: missing mobile features/rotation and WebKit desktop completion only.
- 39930114702, QA f0e7ffa43c0c05ec810834a8fba5db6e1936b94a: phone fullscreen/return after transitions settled only.
All QA commits changed tests/workflow only; the product source remained pinned main above.

37 retained screenshots were individually opened and inspected. Filenames in the initial run labelled scene-1/scene-2 denote attempted states: their actual scene remained 0; the ledger explicitly records this. No unreviewed capture is counted. The archive beside this report contains WebP exports at original dimensions (quality 85), all machine reports and the review ledger, preserved with the project beyond Actions expiry. Original PNG artifacts last 90 days, to 21 January 2027; downloaded originals are retained in working evidence copies, not claimed as committed PNGs.

Native zoom attempted once with Control++; headless viewport remained 1440/DPR 1. CSS zoom=2 is a labelled surrogate only. Native 200% zoom remains unverified. Local Chromium executable was missing; the existing hosted fallback supplied the executed engines. Live cloud navigation timed out (Page.navigate protocol timeout, followed by a 300-second tool timeout); no live-site visual verification is claimed. Browser checks used source served by the existing local HTTP fixture on hosted runners, rather than certifying Cloudflare response headers. Emulated phone dimensions are not physical-device testing; Linux WebKit is not Safari/iOS. Touch gestures were source-reviewed; native touch-device certification is not claimed. Independent review not used (optional routine mode).
