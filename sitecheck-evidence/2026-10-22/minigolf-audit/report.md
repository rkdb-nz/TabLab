# Minigolf sitecheck — final audit

**Audit complete with findings.** All available software audit work is complete. The coverage gate has no gaps. No Minigolf product files were changed, and no repairs, merge or publication were performed.

## 1. Repairs ready for approval

| ID | Priority | Finding and proposed repair | Reproduction/evidence |
|---|---|---|---|
| MG-01 | High | Give dialogs a bounded height and internal scrolling, keeping Close reachable. Content currently clips without a usable scroll path. |320×568 framed Course loses its lower note;901×600 full Story/Events extend above the viewport and lose controls/content. See base and completion PNGs with these size/state names and measured DOM rectangles. |
| MG-02 | High | Repair responsive composition, nav spacing and heading wrapping. |900×600 has large gaps and missing photos;901×600 has nav collisions;568×320 and780×300 overlap logo/hero or cut the badge. Verified Chromium native200% zoom produces683×384 CSS pixels and clips the final E of ADVENTURE. All four dialogs fit at this zoom. |
| MG-03 | High | Enlarge small copy and improve text/control contrast. |Phone footer6–7px; landscape body/form9–10px. White close on lime is weak. Axe4.11.1 found contrast violations in24 of112 states per engine; orange highlight/white2.21:1, kicker4.4:1 and tagline4.09:1. |
| MG-04 | High | Add a clear demo notice and truthful no-send confirmation. |Submitting locally promises “We’ll be in touch shortly” although app.js prevents submission and sends no booking. Do not invent a delivery backend as part of this repair. |
| MG-05 | Medium | Restore focus to a visible opener and add explicit visible keyboard focus styles. |Chromium/Firefox return focus to hidden hotspot5 on portrait/tablet320/360/390/412/768 widths. Independent review found Firefox Close buttons without visible focus rings, including Story1366 and Course. Forward/reverse Tab remains inside dialogs;64 dialog traces per engine checked. Chromium date selection has a visible blue native segment and is not classified as missing focus. |
| MG-06 | Medium | Reject dates before today with a clear validation message. |2000-01-01 passes validity in all16 Chromium/Firefox sizes. Required fields and invalid email are already rejected; existing labels/autocomplete are present. |
| MG-07 | Medium | Optimise existing media delivery and dimensions. |5,429,133 initial media bytes; three cold simulations per engine took about14.8–15seconds to first usable booking interaction. Simulation adds150ms and body-bytes/200KB delay per request; this is not a shared200KB/s bandwidth or real-user benchmark. |
| MG-08 | Medium | Provide equivalent semantic desktop text for the business details embedded in artwork. |Desktop info is raster with generic alt text; equivalent mobile text is hidden on desktop. Include location, opening hours and feature information in accessible DOM text. No artwork redesign is required. |

## 2. Decisions and unavoidable boundaries

- **Background decision:** baked desktop wording appears behind the mobile layout. Choose a clean existing background or explicitly approve editing the artwork. No masking or new image is presumed approved.
- **Scrolling decision:** endorse internal dialog scrolling on short screens so readable type, all content and Close remain reachable.
- **Public metadata/privacy decision:** confirm demo/noindex intent, intended public URL and analytics intent before changing canonical/social/favicon or privacy material. Title and description exist; canonical/social/favicon basics are absent. The live preview sends `x-robots-tag: noindex`. `/robots.txt` and `/sitemap.xml` return200HTML landing fallback, not valid robots/XML files.
- **Platform limits:** physical phones, actual Safari/iOS, browser chrome, virtual keyboards, safe areas, real screen-reader output and native OS fullscreen could not be certified in the available Linux automation. Firefox/WebKit native200% zoom attempts did not change viewport/DPR and no supported zoom API was available. Chromium native200% was verified (1366→683 CSS width; DPR1→2), captured correctly and inspected.
- **Service boundary:** external analytics/non-GET requests were blocked for this read-only audit. Source/network inventory and controlled storage were inspected; preview cookies were empty. Real collector delivery, email delivery and production consent behavior are not certified. No booking backend, availability/capacity or cancellation service exists to exercise.
- **Unfinished available audit work:** none. These boundaries are not unreviewed screenshots, pending matrix runs or an excuse to defer accessible checks.

## Scope and coverage

Target: `/boardroom/billboard/demos/mini-golf/` including the Tab Lab wrapper, direct embedded page, all four dialogs, booking validation/confirmation, menus, navigation and transitions. Product source: `2767653f5208cd3b4a5dcbae4a1f28a0068d6be3`. Final QA branch: `qa/sitecheck-readiness`; final recovery commit `1cb5b7c9ea746d86f64239f91b945db69474dd35`.

Live preview: https://e0d06aac.foundry-a3k.pages.dev/boardroom/billboard/demos/mini-golf/

Playwright1.62.1 on Linux: Chromium151.0.7922.34, Firefox153.0, WebKit26.5. WebKit is not certification of Safari/iOS. Firefox phone tests use viewport/touch emulation; its unsupported `isMobile` flag was not claimed.

All three engines exercised16 sizes:1366×768,1440×900,1920×1080,320×568,568×320,360×780,780×360,390×844,844×390,412×915,915×412,780×300,768×1024,1024×768,900×600 and901×600. Core framed/full/direct states have required matrix coverage. Mobile menu is conditional on its rendered portrait layouts, not an absent desktop control. Completion adds all four framed dialogs/confirmation, keyboard screenshots and settled wrapper menus at every size. Required unique capture rows:1169. All original PNGs and pre-review machine results are retained; raw `leadReviewed:false` flags describe collection time and are superseded by explicit review ledgers.

Lead personally inspected the base Chromium/Firefox matrix before the environment reset. Recovered unchanged originals preserve that evidence; this historical review is labelled honestly in the ledger. This continuation personally opened all244 recovered base WebKit captures, completion/probe/live/zoom images and final26 settled/zoom captures in native-pixel atlases. The independent reviewer inspected171 earlier captures,15 recovery images and5 primary native-zoom images; reconciliation records are included. Review atlas images are reproducible derivatives; original PNGs and their hashes are preserved.

All112 accessibility scans and80 keyboard records per engine were reconciled. Dialogs have64 keyboard traces per engine. Tests include open/close/Escape, forward/reverse Tab, focus restoration, Event→Book, empty/invalid/past-date form data, reopen persistence, repeat-submit disabling, rotations, reduced motion, text enlargement, wrapper fallback fullscreen/return, six internal drawer destinations and browser Back/Forward. Contact mailto syntax is valid. No in-product commerce, accounts, search/filter, carousel/gallery, interactive map or media player is present.

Live responses and screenshots were inspected in all three engines. Hashes for index.html, site.html, style.css, mobile-final.css and app.js matched checked-out target source. Live HTTP headers, metadata, cookie observations and body responses for robots/sitemap are in recovery reports.

## Checklist disposition

| Check | Result |
|---|---|
| Scope, links, branding, wrapper, reliability, review | Passed |
| Copy, layout, media, demo honesty, accessibility, responsive behavior, forms, booking, menus, performance, metadata | Needs fixing / decisions above |
| Commerce, discovery, galleries, accounts, interactive services | Not present |
| Real analytics delivery/production consent; native platform capabilities and Firefox/WebKit browser zoom | Couldn't test — accepted, explicit boundaries above |

## Tool failures resolved and evidence provenance

The original failed coverage gate and incomplete report are retained as historical evidence. Their gaps were completed, not silently relabelled. Global Home assertions were corrected to match rendered Tab Lab text and passed all16 sizes in all engines. Live frame lookup and APIResponse header-method exceptions were recovered in later jobs. Premature1920×1080 WebKit landing capture was superseded after explicit image decoding and settling, and the recovered page displays normally. Early Chromium zoom images were cropped by screenshot tooling; full CDP surface captures supersede them. Cropped diagnostics remain labelled and are not product-defect evidence. CSS zoom/text-root enlargement remains diagnostic and is not misrepresented as native browser zoom.

Workflow runs in `rkdb-nz/TabLab`: base39667227344; completion39670526124; probe39671338834; live39702143126; zoom39702857695; final settled39703322826. The final report, gate, manifest, reviews and source references are packaged in audit records. Browser archives contain original PNG/JSON only, excluding browser profiles, caches and signed download URLs. Each archive includes a SHA-256 index.

Evidence files accompany this report: `Minigolf-chromium-evidence.zip`, `Minigolf-firefox-evidence.zip`, `Minigolf-webkit-evidence.zip`, `Minigolf-audit-records.zip`. `coverage-gate-result.json` reports **Audit complete with findings**, zero gaps, privacy/native-platform boundaries only.
