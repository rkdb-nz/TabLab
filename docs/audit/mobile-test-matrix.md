# Mobile test matrix — 2026-10-08; continuation 2026-10-09 NZ

**Full mobile sign-off blocked.** This document separates executed responsive iframe checks from planned device/browser tests. No physical device was tested. Dimensions below are CSS pixels, not physical screen pixels. Phone-family profiles are candidate test dimensions; model/OS/browser/DPR mapping is unverified and must be confirmed on real devices, particularly Galaxy A16. They are not a claim that a particular phone was emulated or works.

## Method and execution limits

- Audited source: `cf5fcbc24a14a2c85d140abc493d99e4036e86cb`; live DOM/browser observations are not a deployed-SHA attestation.
- Available browser: cloud Chrome/Chromium, exact version unavailable; top-level viewport 1363×936. Existing `/boardroom/mobile-preview.html` interface supplies 360×740 portrait and 740×360 landscape iframes. No viewport/DPR/touch/reduced-motion emulation API is exposed.
- Inner demo dimensions are measured after wrapper header/borders; scrollbar takes another 15 px on some demos. Portrait content height 659; landscape 308. These nested views exercise CSS layout, not mobile browser bars, device safe areas or physical orientation sensors.
- Local Playwright resolves, but Chromium, Firefox and WebKit executable files are absent. Official Chromium installation failed with invalid archive/zero download. No indefinite retry or engine workaround used.
- Initial route text, frame geometry and horizontal scroll width checked. Selected stable screenshots inspected; not every section was scrolled or every state exercised. Zero measured overflow is only a bounded geometry result, not an accessibility/mobile pass.
- Screenshot loading/transition states were distinguished from stable defects. Mini-golf initially empty content was revisited; settled portrait text and dimensions verified.

## Candidate device/browser profiles — all unverified

| ID | Representative family | Portrait | Landscape | Intended engine | Result |
|---|---|---|---|---|---|
| IP-SE | iPhone SE class | 375×667 | 667×375 | Safari/WebKit | U: execution unavailable; physical device absent |
| IP-STD | iPhone standard class | 390×844 | 844×390 | Safari/WebKit | U: execution unavailable; physical device absent |
| IP-LARGE | iPhone large class | 430×932 | 932×430 | Safari/WebKit | U: execution unavailable; physical device absent |
| GA16 | Samsung Galaxy A16 candidate | 384×832 | 832×384 | Chrome/Chromium; Samsung Internet where relevant | U: execution unavailable; physical device absent |
| GS | Samsung Galaxy standard class | 360×780 | 780×360 | Chrome/Chromium; Samsung Internet where relevant | U: execution unavailable; physical device absent |
| GS-LARGE | Samsung Galaxy large class | 412×915 | 915×412 | Chrome/Chromium; Samsung Internet where relevant | U: execution unavailable; physical device absent |
| PIX | Google Pixel class | 393×873 | 873×393 | Chrome/Chromium; Samsung Internet where relevant | U: execution unavailable; physical device absent |

Every profile needs actual device/browser chrome heights, visual viewport changes and DPR confirmed. Android should also be checked in Samsung Internet where relevant; none available here. Additional short landscape candidates: 667×320, 740×320, 844×320 and 915×320, all U. Test with address bar expanded/collapsed and keyboard open/closed; all U.

## Executed example layouts

Outer iframe:360×740 portrait /740×360 landscape. All rows use cloud Chromium and the pre-existing review page selector plus Portrait/Landscape buttons. Wrapper horizontal overflow measured 0 in both orientations. Results apply to initial nested `site.html`, initial cases; continuation child/core cases are below. It is not every state.

| Exact demo wrapper directory under `public/boardroom/` | Portrait document client area | Portrait horizontal overflow | Landscape document client area | Landscape horizontal overflow | Additional evidence / limits |
|---|---|---:|---|---:|---|
| `billboard/demos/donut/` | 352×659 | 0 px | 732×308 | 0 px | Initial DOM geometry; executed interaction families listed in verification record. Full scroll/state/touch combinations U. |
| `billboard/demos/mini-golf/` | 352×659 | 0 px | 732×308 | 0 px | Settled portrait recheck and screenshot; full scroll/state tests U. |
| `billboard/demos/drilling/` | 352×659 | 0 px | 732×308 | 0 px | Initial DOM geometry; executed interaction families listed in verification record. Full scroll/state/touch combinations U. |
| `noticeboard/demos/diner/` | 352×659 | 0 px | 732×308 | 0 px | Initial DOM geometry; executed interaction families listed in verification record. Full scroll/state/touch combinations U. |
| `noticeboard/demos/produce/` | 352×659 | 0 px | 732×308 | 0 px | Initial DOM geometry; executed interaction families listed in verification record. Full scroll/state/touch combinations U. |
| `noticeboard/demos/charity-walk/` | 352×659 | 0 px | 732×308 | 0 px | Initial DOM geometry; executed interaction families listed in verification record. Full scroll/state/touch combinations U. |
| `skateboard/demos/florist/` | 337×659 | 0 px | 717×308 | 0 px | Settled landscape screenshot; form invalid email reproduced separately on desktop. |
| `skateboard/demos/pottery/` | 337×659 | 168 px | 717×308 | 0 px | FAIL P02/S25: third philosophy card beyond viewport; source corroborated. Landscape geometry 0, full content U. |
| `skateboard/demos/tailor/` | 352×659 | 0 px | 732×308 | 0 px | Initial DOM geometry; executed interaction families listed in verification record. Full scroll/state/touch combinations U. |
| `springboard/demos/dining/` | 337×659 | 0 px | 717×308 | 0 px | FAIL S16: Menu click leaves nav hidden in both modes; Dine/Wine/Sign child Menu failure also reproduced in both modes; Reviews mobile U. |
| `springboard/demos/retreat/` | 337×659 | 0 px | 717×308 | 0 px | Initial DOM geometry; executed interaction families listed in verification record. Full scroll/state/touch combinations U. |
| `springboard/demos/theatre/` | 337×659 | 0 px | 717×308 | 0 px | Initial DOM geometry; executed interaction families listed in verification record. Full scroll/state/touch combinations U. |

Changing iframe dimensions via the existing controls exercises responsive orientation conditions and resizes. It is not a physical orientation test. No touch gestures, on-screen keyboard, real safe-area inset or browser toolbar change was simulated.

## Continuation executed child/core layouts

All rows below use cloud Chromium (version unavailable), DPR 1, existing preview controls, normal links/buttons/keyboard and read-only DOM geometry. No physical phones or complete device emulation. Nested child CSS window 352×659 /732×308; document client 337×659 /717×308 when scrollbar present. Core direct-frame CSS window 360×740 /740×360. Listed sizes are **document client area**, not device resolution. Root overflow 0 is not a full layout pass.

| Exact route source | Portrait client area | Landscape client area | Root horizontal overflow P/L | Result / limitations |
|---|---|---|---|---|
| `public/boardroom/springboard/demos/theatre/now-playing.html` |337×659|717×308|0 px /0 px|Tabs/poster source and desktop controls verified; mobile initial geometry.|
| `public/boardroom/springboard/demos/theatre/coming-soon.html` |337×659|717×308|0 px /0 px|Body width 346/735 exceeds root 337/717, but actual cards remained inside and no root overflow. Do not infer clipping solely from body width.|
| `public/boardroom/springboard/demos/theatre/book-tickets.html` |337×659|717×308|0 px /0 px|P06 menu last link clipped at landscape 308 px height. Portrait destination works.|
| `public/boardroom/springboard/demos/theatre/clementine-street.html` |337×659|717×308|0 px /0 px|Venue reached through portrait menu then resized; initial geometry.|
| `public/boardroom/springboard/demos/retreat/retreats.html` |337×659|717×308|0 px /0 px|Initial geometry; four lightbox groups exercised desktop.|
| `public/boardroom/springboard/demos/retreat/discover.html` |337×659|717×308|0 px /0 px|S01 hero naturalWidth 0 in both modes.|
| `public/boardroom/springboard/demos/retreat/reviews.html` |337×659|717×308|0 px /0 px|Initial geometry; content source reviewed.|
| `public/boardroom/springboard/demos/retreat/book.html` |337×659|717×308|0 px /0 px|Initial geometry; desktop confirmation/focus failure P05.|
| `public/boardroom/springboard/demos/dining/dine.html` |337×659|717×308|0 px /0 px|S16 inert Menu both modes; reached through home card.|
| `public/boardroom/springboard/demos/dining/wine.html` |337×659|717×308|0 px /0 px|S16 inert Menu both modes; reached through home card.|
| `public/boardroom/springboard/demos/dining/sign.html` |337×659|717×308|0 px /0 px|S16 both modes; fourFAQ toggles, native empty validation and local modal P05 landscape.|
| `public/boardroom/skateboard/demos/florist/success.html` |337×659|717×308|0 px /0 px|Reached by fake local form submission; Back link settled to site.|
| `public/index.html` |360×740|740×360|0 px /0 px|Intro, make-site and explore each measured in both modes; header/state controls exercised.|
| `public/the-foundry/index.html` |345×740|725×360|0 px /0 px|About landscape lower CTA keyboard Tab caused scrollY 351; shared drawer focus escape reproduced.|
| `public/foundrycare/index.html` |345×740|725×360|0 px /0 px|About CTA reached care; approved distinct desktop header preserved.|
| `public/whywebsite/index.html` |360×740|740×360|0 px /0 px|Portrait settled screenshot readable; landscape geometry, no settled screenshot claim.|
| `public/start/index.html` |345×740|725×360|0 px /0 px|Reached shared Menu; both geometries; active older header S08.|
| `public/boardroom/index.html` |360×740|740×360|0 px /0 px|Four board destinations navigated; both geometries.|
| `public/boardroom/billboard/index.html` |360×740|725×360|0 px /0 px|Reached Boardroom card; both geometries. Wide desktop short-height C07 is outside these sizes.|
| `public/boardroom/noticeboard/index.html` |360×740|725×360|0 px /0 px|Reached Boardroom card; both geometries. Wide desktop short-height C07 is outside these sizes.|
| `public/boardroom/skateboard/index.html` |360×740|725×360|0 px /0 px|Reached Boardroom card; both geometries. Wide desktop short-height C07 is outside these sizes.|
| `public/boardroom/springboard/index.html` |360×740|725×360|0 px /0 px|Reached Boardroom card; both geometries. Wide desktop short-height C07 is outside these sizes.|

Unique responsive route count 46/50:24 wrapper/main routes in original table +12 child +10 core/gallery. Home three states produce six cases for that one route. Additional interaction: Charity four mobile panels and diary forward/reverse wrap; Tailor all five mobile chapters, six desktop lookbook spreads and boutique selection; Pottery Menu opens/closes but exposes no expanded state; Retreat/Theatre menus opened across orientation. These do not establish every popup/layout state at both dimensions.

Four route gaps: `public/maintenance/index.html` (unlinked), `public/boardroom/mobile-preview.html` (harness itself), `public/boardroom/skateboard/demos/tailor/shop/index.html` (unlinked), `public/boardroom/springboard/demos/dining/reviews.html` (mobile Menu does not expose destination). Desktop/source reviewed; mobile P/L U. No arbitrary iframe URL injection, viewport resize capability or site edit was used.

Shared drawer landscape measured clientHeight 296/scrollHeight 337 with overflow:auto; keyboard could leave drawer to body (S07). Theatre menu landscape measured 250/293 with overflow:visible and last link bottom 351 beyond 308 (P06). Neither observation proves physical-phone behavior. OS keyboard/browser bars/safe areas/touch/zoom/reduced-motion remainU. One browser-zoom shortcut action timed out, with no zoom change verified.

## Every-route device matrix

`U/U` means **portrait unverified / landscape unverified** for that profile. No profile column is a pass. Each original route is listed once; iframe execution above is additional evidence for the 12 demo wrapper/site pairs, not a replacement for these phone cells. Continuation expands frame coverage to 46 routes but all named-phone cells stayU. For every row, named-phone short-landscape/breakpoint/zoom/motion/safe-area/physical-device cases remainU; specific iframe keyboard and 308 px-height tests are separately recorded below.

| Exact route source | IP-SE | IP-STD | IP-LARGE | GA16 | GS | GS-LARGE | PIX |
|---|---|---|---|---|---|---|---|
| `public/boardroom/billboard/demos/donut/index.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/billboard/demos/donut/site.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/billboard/demos/drilling/index.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/billboard/demos/drilling/site.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/billboard/demos/mini-golf/index.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/billboard/demos/mini-golf/site.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/billboard/index.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/index.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/mobile-preview.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/noticeboard/demos/charity-walk/index.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/noticeboard/demos/charity-walk/site.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/noticeboard/demos/diner/index.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/noticeboard/demos/diner/site.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/noticeboard/demos/produce/index.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/noticeboard/demos/produce/site.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/noticeboard/index.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/skateboard/demos/florist/index.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/skateboard/demos/florist/site.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/skateboard/demos/florist/success.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/skateboard/demos/pottery/index.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/skateboard/demos/pottery/site.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/skateboard/demos/tailor/index.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/skateboard/demos/tailor/shop/index.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/skateboard/demos/tailor/site.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/skateboard/index.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/springboard/demos/dining/dine.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/springboard/demos/dining/index.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/springboard/demos/dining/reviews.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/springboard/demos/dining/sign.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/springboard/demos/dining/site.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/springboard/demos/dining/wine.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/springboard/demos/retreat/book.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/springboard/demos/retreat/discover.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/springboard/demos/retreat/index.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/springboard/demos/retreat/retreats.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/springboard/demos/retreat/reviews.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/springboard/demos/retreat/site.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/springboard/demos/theatre/book-tickets.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/springboard/demos/theatre/clementine-street.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/springboard/demos/theatre/coming-soon.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/springboard/demos/theatre/index.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/springboard/demos/theatre/now-playing.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/springboard/demos/theatre/site.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/boardroom/springboard/index.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/foundrycare/index.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/index.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/maintenance/index.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/start/index.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/the-foundry/index.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |
| `public/whywebsite/index.html` | U/U | U/U | U/U | U/U | U/U | U/U | U/U |

## Breakpoint-neighbor plan — all U

Principal independently extracts only actual `@media` preludes (CSS/HTML/JS), plus stylesheet-link media. Ordinary element `min-width`/`max-height` declarations are excluded. Range syntax, imports, dynamic stylesheet injection and combined orientation/aspect-ratio requirements need manual review. For each applicable route and each breakpoint B, test **B−1, B, B+1**. Test width neighbors at portrait height 900 and landscape height 360, and height neighbors at landscape width 844 and portrait width 390, then apply the full original media condition. These are planned test cases, not results.

| Axis | B | Planned neighbor values | Source example |
|---|---:|---|---|
| width | 350 px | 349, 350, 351 px — U | `public/boardroom/mobile-boardroom-light-grid.css:428` |
| width | 360 px | 359, 360, 361 px — U | `public/css/landing-experience.css:2687` |
| width | 380 px | 379, 380, 381 px — U | `public/boardroom/mobile-boardroom.css:427` |
| width | 390 px | 389, 390, 391 px — U | `public/css/whywebsite-mobile-fit.css:98` |
| width | 420 px | 419, 420, 421 px — U | `public/boardroom/demo-browser.css:42` |
| width | 430 px | 429, 430, 431 px — U | `public/css/foundrycare-mobile-c.css:290` |
| width | 480 px | 479, 480, 481 px — U | `public/boardroom/boardroom.css:696` |
| width | 519 px | 518, 519, 520 px — U | `public/css/tablab-landing.css:1560` |
| width | 520 px | 519, 520, 521 px — U | `public/boardroom/skateboard/demos/pottery/css/style.css:241` |
| width | 540 px | 539, 540, 541 px — U | `public/boardroom/demo-browser.css:23` |
| width | 541 px | 540, 541, 542 px — U | `public/boardroom/demo-browser.css:38` |
| width | 560 px | 559, 560, 561 px — U | `public/boardroom/board-page.css:392` |
| width | 561 px | 560, 561, 562 px — U | `public/styles.css:1645` |
| width | 580 px | 579, 580, 581 px — U | `public/styles.css:1354` |
| width | 600 px | 599, 600, 601 px — U | `public/boardroom/demo-browser.css:75` |
| width | 620 px | 619, 620, 621 px — U | `public/boardroom/billboard/demos/drilling/css/style.css:70` |
| width | 640 px | 639, 640, 641 px — U | `public/boardroom/skateboard/demos/tailor/shop/index.html:13` |
| width | 650 px | 649, 650, 651 px — U | `public/boardroom/billboard/css/style.css:242` |
| width | 660 px | 659, 660, 661 px — U | `public/css/foundry-info.css:35` |
| width | 700 px | 699, 700, 701 px — U | `public/boardroom/demo-browser.css:38` |
| width | 701 px | 700, 701, 702 px — U | `public/boardroom/mobile-boardroom-portrait-fit.css:3` |
| width | 760 px | 759, 760, 761 px — U | `public/boardroom/billboard/demos/donut/css/mobile-fluid.css:10` |
| width | 800 px | 799, 800, 801 px — U | `public/css/explore-phone-fit.css:71` |
| width | 820 px | 819, 820, 821 px — U | `public/boardroom/boardroom.css:579` |
| width | 821 px | 820, 821, 822 px — U | `public/css/tablab-landing.css:23` |
| width | 860 px | 859, 860, 861 px — U | `public/boardroom/skateboard/demos/pottery/css/style.css:44` |
| width | 900 px | 899, 900, 901 px — U | `public/boardroom/billboard/demos/drilling/css/mobile-fluid.css:2` |
| width | 901 px | 900, 901, 902 px — U | `public/boardroom/boardroom.css:850` |
| width | 960 px | 959, 960, 961 px — U | `public/boardroom/billboard/demos/donut/css/mobile-fluid.css:410` |
| width | 980 px | 979, 980, 981 px — U | `public/boardroom/board-page.css:375` |
| width | 981 px | 980, 981, 982 px — U | `public/boardroom/board-page.css:349` |
| width | 1000 px | 999, 1000, 1001 px — U | `public/boardroom/billboard/demos/donut/css/landscape-authoritative.css:3` |
| width | 1024 px | 1023, 1024, 1025 px — U | `public/styles.css:936` |
| width | 1050 px | 1049, 1050, 1051 px — U | `public/boardroom/billboard/css/style.css:232` |
| width | 1051 px | 1050, 1051, 1052 px — U | `public/css/foundrycare.css:34` |
| width | 1080 px | 1079, 1080, 1081 px — U | `public/css/foundry-info.css:34` |
| width | 1081 px | 1080, 1081, 1082 px — U | `public/css/foundry-info.css:66` |
| width | 1100 px | 1099, 1100, 1101 px — U | `public/boardroom/skateboard/demos/pottery/css/style.css:225` |
| width | 1101 px | 1100, 1101, 1102 px — U | `public/css/explore-premium.css:397` |
| width | 1180 px | 1179, 1180, 1181 px — U | `public/boardroom/noticeboard/demos/charity-walk/styles.css:11` |
| width | 1250 px | 1249, 1250, 1251 px — U | `public/boardroom/boardroom.css:540` |
| width | 1251 px | 1250, 1251, 1252 px — U | `public/boardroom/boardroom.css:828` |
| width | 1260 px | 1259, 1260, 1261 px — U | `public/boardroom/board-page.css:364` |
| width | 1500 px | 1499, 1500, 1501 px — U | `public/css/landing-experience.css:2208` |
| height | 330 px | 329, 330, 331 px — U | `public/boardroom/noticeboard/demos/diner/css/style.css:1168` |
| height | 350 px | 349, 350, 351 px — U | `public/boardroom/billboard/demos/mini-golf/css/mobile-composition.css:373` |
| height | 365 px | 364, 365, 366 px — U | `public/boardroom/billboard/demos/drilling/css/mobile-fluid.css:44` |
| height | 420 px | 419, 420, 421 px — U | `public/css/landing-experience.css:3968` |
| height | 500 px | 499, 500, 501 px — U | `public/boardroom/billboard/demos/donut/css/mobile-fluid.css:410` |
| height | 520 px | 519, 520, 521 px — U | `public/boardroom/billboard/demos/donut/css/landscape-authoritative.css:3` |
| height | 560 px | 559, 560, 561 px — U | `public/boardroom/board-page.css:1380` |
| height | 600 px | 599, 600, 601 px — U | `public/boardroom/springboard/demos/dining/assets/css/main.css:1026` |
| height | 620 px | 619, 620, 621 px — U | `public/css/tablab-landing.css:492` |
| height | 640 px | 639, 640, 641 px — U | `public/boardroom/mobile-boardroom-light-grid.css:428` |
| height | 650 px | 649, 650, 651 px — U | `public/boardroom/board-page.css:1086` |
| height | 680 px | 679, 680, 681 px — U | `public/boardroom/billboard/demos/donut/css/mobile-fluid.css:389` |
| height | 700 px | 699, 700, 701 px — U | `public/boardroom/billboard/demos/drilling/css/mobile-fluid.css:11` |
| height | 701 px | 700, 701, 702 px — U | `public/css/explore-premium.css:397` |
| height | 720 px | 719, 720, 721 px — U | `public/boardroom/billboard/demos/donut/css/portrait-polish.css:213` |
| height | 735 px | 734, 735, 736 px — U | `public/boardroom/billboard/demos/mini-golf/css/mobile-fluid.css:114` |
| height | 740 px | 739, 740, 741 px — U | `public/css/landing-experience.css:2643` |
| height | 760 px | 759, 760, 761 px — U | `public/boardroom/billboard/demos/donut/css/mobile-fluid.css:366` |
| height | 768 px | 767, 768, 769 px — U | `public/boardroom/springboard/demos/theatre/assets/css/styles.css:233` |
| height | 780 px | 779, 780, 781 px — U | `public/boardroom/billboard/demos/mini-golf/css/mobile-fluid.css:100` |
| height | 790 px | 789, 790, 791 px — U | `public/boardroom/board-page.css:349` |
| height | 800 px | 799, 800, 801 px — U | `public/css/foundrycare.css:291` |
| height | 820 px | 819, 820, 821 px — U | `public/css/foundrycare.css:26` |
| height | 900 px | 899, 900, 901 px — U | `public/boardroom/billboard/demos/donut/css/landscape-fix.css:2` |

## Per-route breakpoint applicability

Direct HTML/linked CSS only. Shared JavaScript-injected CSS and imports may add conditions; absence here does not mean no breakpoint. Preserve each original media prelude when executing the tests; a number alone omits orientation and conjunctions.

| Exact route source | Direct source pixel conditions (not test results) |
|---|---|
| `public/boardroom/billboard/demos/donut/index.html` | max-height:500 px, max-height:600 px, max-height:700 px, max-width:420 px, max-width:540 px, min-width:541 px, max-width:600 px, max-width:700 px, max-width:900 px, min-width:901 px, max-width:1000 px |
| `public/boardroom/billboard/demos/donut/site.html` | max-height:500 px, max-height:520 px, max-height:680 px, max-height:720 px, max-height:760 px, max-height:900 px, max-width:760 px, max-width:960 px, max-width:1000 px |
| `public/boardroom/billboard/demos/drilling/index.html` | max-height:500 px, max-height:600 px, max-height:700 px, max-width:420 px, max-width:540 px, min-width:541 px, max-width:600 px, max-width:700 px, max-width:900 px, min-width:901 px, max-width:1000 px |
| `public/boardroom/billboard/demos/drilling/site.html` | max-height:365 px, max-height:500 px, max-height:520 px, max-height:700 px, max-width:620 px, max-width:900 px, max-width:1000 px |
| `public/boardroom/billboard/demos/mini-golf/index.html` | max-height:500 px, max-height:600 px, max-height:700 px, max-width:420 px, max-width:540 px, min-width:541 px, max-width:600 px, max-width:700 px, max-width:900 px, min-width:901 px, max-width:1000 px |
| `public/boardroom/billboard/demos/mini-golf/site.html` | max-height:350 px, max-height:500 px, max-height:520 px, max-width:900 px, max-width:1000 px |
| `public/boardroom/billboard/index.html` | max-height:500 px, max-height:560 px, max-height:600 px, max-height:650 px, max-height:700 px, max-height:720 px, max-height:790 px, max-width:560 px, max-width:700 px, max-width:900 px, min-width:901 px, max-width:980 px, min-width:981 px, max-width:1100 px, max-width:1260 px |
| `public/boardroom/index.html` | max-height:500 px, max-height:600 px, max-height:640 px, max-height:700 px, max-width:350 px, max-width:480 px, max-width:700 px, max-width:820 px, max-width:900 px, min-width:901 px, max-width:1100 px, max-width:1250 px, min-width:1251 px |
| `public/boardroom/mobile-preview.html` | No direct pixel condition extracted; inspect indirect dependencies. |
| `public/boardroom/noticeboard/demos/charity-walk/index.html` | max-height:500 px, max-height:600 px, max-height:700 px, max-width:420 px, max-width:540 px, min-width:541 px, max-width:600 px, max-width:700 px, max-width:900 px, min-width:901 px, max-width:1000 px |
| `public/boardroom/noticeboard/demos/charity-walk/site.html` | max-width:760 px, max-width:900 px, max-width:1180 px |
| `public/boardroom/noticeboard/demos/diner/index.html` | max-height:500 px, max-height:600 px, max-height:700 px, max-width:420 px, max-width:540 px, min-width:541 px, max-width:600 px, max-width:700 px, max-width:900 px, min-width:901 px, max-width:1000 px |
| `public/boardroom/noticeboard/demos/diner/site.html` | max-height:330 px, max-width:700 px, max-width:900 px, max-width:1050 px |
| `public/boardroom/noticeboard/demos/produce/index.html` | max-height:500 px, max-height:600 px, max-height:700 px, max-width:420 px, max-width:540 px, min-width:541 px, max-width:600 px, max-width:700 px, max-width:900 px, min-width:901 px, max-width:1000 px |
| `public/boardroom/noticeboard/demos/produce/site.html` | max-width:760 px, max-width:900 px, max-width:1050 px |
| `public/boardroom/noticeboard/index.html` | max-height:500 px, max-height:560 px, max-height:600 px, max-height:650 px, max-height:700 px, max-height:720 px, max-height:790 px, max-width:560 px, max-width:700 px, max-width:900 px, min-width:901 px, max-width:980 px, min-width:981 px, max-width:1100 px, max-width:1260 px |
| `public/boardroom/skateboard/demos/florist/index.html` | max-height:500 px, max-height:600 px, max-height:700 px, max-width:420 px, max-width:540 px, min-width:541 px, max-width:600 px, max-width:700 px, max-width:900 px, min-width:901 px, max-width:1000 px |
| `public/boardroom/skateboard/demos/florist/site.html` | max-width:600 px, max-width:900 px |
| `public/boardroom/skateboard/demos/florist/success.html` | max-width:600 px, max-width:900 px |
| `public/boardroom/skateboard/demos/pottery/index.html` | max-height:500 px, max-height:600 px, max-height:700 px, max-width:420 px, max-width:540 px, min-width:541 px, max-width:600 px, max-width:700 px, max-width:900 px, min-width:901 px, max-width:1000 px |
| `public/boardroom/skateboard/demos/pottery/site.html` | max-width:520 px, max-width:860 px, max-width:1100 px |
| `public/boardroom/skateboard/demos/tailor/index.html` | max-height:500 px, max-height:600 px, max-height:700 px, max-width:420 px, max-width:540 px, min-width:541 px, max-width:600 px, max-width:700 px, max-width:900 px, min-width:901 px, max-width:1000 px |
| `public/boardroom/skateboard/demos/tailor/shop/index.html` | max-height:500 px, max-width:600 px, max-width:640 px, max-width:900 px, min-width:901 px, max-width:1100 px |
| `public/boardroom/skateboard/demos/tailor/site.html` | max-height:500 px, max-width:600 px, max-width:900 px, min-width:901 px |
| `public/boardroom/skateboard/index.html` | max-height:500 px, max-height:560 px, max-height:600 px, max-height:650 px, max-height:700 px, max-height:720 px, max-height:790 px, max-width:560 px, max-width:700 px, max-width:900 px, min-width:901 px, max-width:980 px, min-width:981 px, max-width:1100 px, max-width:1260 px |
| `public/boardroom/springboard/demos/dining/dine.html` | max-height:600 px, max-width:600 px, max-width:700 px, max-width:900 px, max-width:1000 px, max-width:1100 px |
| `public/boardroom/springboard/demos/dining/index.html` | max-height:500 px, max-height:600 px, max-height:700 px, max-width:420 px, max-width:540 px, min-width:541 px, max-width:600 px, max-width:700 px, max-width:900 px, min-width:901 px, max-width:1000 px |
| `public/boardroom/springboard/demos/dining/reviews.html` | max-height:600 px, max-width:600 px, max-width:700 px, max-width:900 px, max-width:1000 px, max-width:1100 px |
| `public/boardroom/springboard/demos/dining/sign.html` | max-height:600 px, max-width:600 px, max-width:700 px, max-width:900 px, max-width:1000 px, max-width:1100 px |
| `public/boardroom/springboard/demos/dining/site.html` | max-height:600 px, max-width:600 px, max-width:700 px, max-width:900 px, max-width:1000 px, max-width:1100 px |
| `public/boardroom/springboard/demos/dining/wine.html` | max-height:600 px, max-width:600 px, max-width:700 px, max-width:900 px, max-width:1000 px, max-width:1100 px |
| `public/boardroom/springboard/demos/retreat/book.html` | max-height:600 px, max-width:700 px, max-width:900 px |
| `public/boardroom/springboard/demos/retreat/discover.html` | max-height:600 px, max-width:700 px, max-width:900 px |
| `public/boardroom/springboard/demos/retreat/index.html` | max-height:500 px, max-height:600 px, max-height:700 px, max-width:420 px, max-width:540 px, min-width:541 px, max-width:600 px, max-width:700 px, max-width:900 px, min-width:901 px, max-width:1000 px |
| `public/boardroom/springboard/demos/retreat/retreats.html` | max-height:600 px, max-width:700 px, max-width:900 px |
| `public/boardroom/springboard/demos/retreat/reviews.html` | max-height:600 px, max-width:700 px, max-width:900 px |
| `public/boardroom/springboard/demos/retreat/site.html` | max-height:600 px, max-width:700 px, max-width:900 px |
| `public/boardroom/springboard/demos/theatre/book-tickets.html` | max-height:600 px, max-height:768 px, max-height:900 px, max-width:700 px, max-width:980 px, min-width:981 px |
| `public/boardroom/springboard/demos/theatre/clementine-street.html` | max-height:600 px, max-height:768 px, max-height:900 px, max-width:700 px, max-width:980 px, min-width:981 px |
| `public/boardroom/springboard/demos/theatre/coming-soon.html` | max-height:600 px, max-height:768 px, max-height:900 px, max-width:700 px, max-width:980 px, min-width:981 px |
| `public/boardroom/springboard/demos/theatre/index.html` | max-height:500 px, max-height:600 px, max-height:700 px, max-width:420 px, max-width:540 px, min-width:541 px, max-width:600 px, max-width:700 px, max-width:900 px, min-width:901 px, max-width:1000 px |
| `public/boardroom/springboard/demos/theatre/now-playing.html` | max-height:600 px, max-height:768 px, max-height:900 px, max-width:700 px, max-width:980 px, min-width:981 px |
| `public/boardroom/springboard/demos/theatre/site.html` | max-height:600 px, max-height:768 px, max-height:900 px, max-width:700 px, max-width:980 px, min-width:981 px |
| `public/boardroom/springboard/index.html` | max-height:500 px, max-height:560 px, max-height:600 px, max-height:650 px, max-height:700 px, max-height:720 px, max-height:790 px, max-width:560 px, max-width:700 px, max-width:900 px, min-width:901 px, max-width:980 px, min-width:981 px, max-width:1100 px, max-width:1260 px |
| `public/foundrycare/index.html` | max-height:500 px, max-height:600 px, max-height:700 px, max-height:760 px, max-height:780 px, max-height:800 px, max-height:820 px, max-width:430 px, max-width:560 px, min-width:561 px, max-width:580 px, max-width:650 px, max-width:700 px, max-width:760 px, max-width:820 px, max-width:900 px, min-width:901 px, max-width:980 px, max-width:1024 px, max-width:1050 px, min-width:1051 px, max-width:1100 px |
| `public/index.html` | max-height:420 px, max-height:500 px, max-height:520 px, max-height:600 px, max-height:620 px, max-height:650 px, max-height:700 px, min-height:701 px, max-height:740 px, max-height:760 px, max-width:360 px, max-width:519 px, max-width:540 px, max-width:560 px, min-width:561 px, max-width:580 px, max-width:600 px, max-width:700 px, max-width:760 px, max-width:800 px, max-width:820 px, min-width:821 px, max-width:900 px, min-width:901 px, max-width:980 px, max-width:1024 px, max-width:1100 px, min-width:1101 px, min-width:1500 px |
| `public/maintenance/index.html` | max-width:560 px |
| `public/start/index.html` | max-height:500 px, max-height:600 px, max-height:700 px, max-width:560 px, min-width:561 px, max-width:580 px, max-width:700 px, max-width:760 px, max-width:900 px, min-width:901 px, max-width:980 px, max-width:1024 px, max-width:1100 px |
| `public/the-foundry/index.html` | max-height:500 px, max-height:600 px, max-height:700 px, max-width:560 px, min-width:561 px, max-width:580 px, max-width:660 px, max-width:700 px, max-width:760 px, max-width:820 px, max-width:900 px, min-width:901 px, max-width:980 px, max-width:1000 px, max-width:1024 px, max-width:1080 px, min-width:1081 px, max-width:1100 px, max-width:1500 px |
| `public/whywebsite/index.html` | max-height:500 px, max-height:600 px, max-height:680 px, max-height:700 px, max-height:760 px, max-width:390 px, max-width:560 px, min-width:561 px, max-width:580 px, max-width:700 px, max-width:760 px, max-width:820 px, min-width:821 px, max-width:900 px, min-width:901 px, max-width:980 px, max-width:1024 px, max-width:1100 px |

## Required state checklist — all routes, remaining unverified unless explicitly recorded

- Header/nav/menu closed/open and long content; Back/Home; nested iframe scrolling and full-screen return.
- Fixed/sticky elements at top/middle/bottom, no clipping/overlap, readable text and target spacing.
- Orientation during open menu, form entry, image/dialog display and scrolling.
- Input focus and on-screen keyboard, validation errors, confirmation/reset; no real send or payment without appropriate authorization.
- Tab/Shift-Tab/Enter/Space/Escape; focus visibility and order; screen reader semantics.
- Browser zoom 200%/400%, text enlargement, reduced motion, safe areas and browser viewport changes.
- Chromium Android, Safari/WebKit iOS, Firefox if supported, plus physical iPhone/Galaxy A16/Galaxy/Pixel.

Completion requires actual executed results and evidence replacing U cells. This matrix does not authorize implementation, deployment or automatic legacy deletion.
