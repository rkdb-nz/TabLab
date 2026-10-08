# Mobile test matrix — 2026-10-08

**Full mobile sign-off blocked.** This document separates executed responsive iframe checks from planned device/browser tests. No physical device was tested. Dimensions below are CSS pixels, not physical screen pixels. Phone-family profiles are candidate test dimensions; model/OS/browser/DPR mapping is unverified and must be confirmed on real devices, particularly Galaxy A16. They are not a claim that a particular phone was emulated or works.

## Method and execution limits

- Audited source: `cf5fcbc24a14a2c85d140abc493d99e4036e86cb`; live DOM/browser observations are not a deployed-SHA attestation.
- Available browser: cloud Chrome/Chromium, exact version unavailable; top-level viewport 1363×936. Existing `/boardroom/mobile-preview.html` interface supplies 360×740 portrait and 740×360 landscape iframes. No viewport/DPR/touch/reduced-motion emulation API is exposed.
- Inner demo dimensions are measured after wrapper header/borders; scrollbar takes another 15px on some demos. Portrait content height659; landscape308. These nested views exercise CSS layout, not mobile browser bars, device safe areas or physical orientation sensors.
- Local Playwright resolves, but Chromium, Firefox and WebKit executable files are absent. Official Chromium installation failed with invalid archive/zero download. No indefinite retry or engine workaround used.
- Initial route text, frame geometry and horizontal scroll width checked. Selected stable screenshots inspected; not every section was scrolled or every state exercised. Zero measured overflow is only a bounded geometry result, not an accessibility/mobile pass.
- Screenshot loading/transition states were distinguished from stable defects. Mini-golf initially empty content was revisited; settled portrait text and dimensions verified.

## Candidate device/browser profiles — all unverified

| ID | Representative family | Portrait | Landscape | Intended engine | Result |
|---|---|---|---|---|---|
| IP-SE | iPhone SE class | 375×667 | 667×375 | Safari/WebKit for iPhone; Chrome/Chromium for Android | U: execution unavailable; physical device absent |
| IP-STD | iPhone standard class | 390×844 | 844×390 | Safari/WebKit for iPhone; Chrome/Chromium for Android | U: execution unavailable; physical device absent |
| IP-LARGE | iPhone large class | 430×932 | 932×430 | Safari/WebKit for iPhone; Chrome/Chromium for Android | U: execution unavailable; physical device absent |
| GA16 | Samsung Galaxy A16 candidate | 384×832 | 832×384 | Safari/WebKit for iPhone; Chrome/Chromium for Android | U: execution unavailable; physical device absent |
| GS | Samsung Galaxy standard class | 360×780 | 780×360 | Safari/WebKit for iPhone; Chrome/Chromium for Android | U: execution unavailable; physical device absent |
| GS-LARGE | Samsung Galaxy large class | 412×915 | 915×412 | Safari/WebKit for iPhone; Chrome/Chromium for Android | U: execution unavailable; physical device absent |
| PIX | Google Pixel class | 393×873 | 873×393 | Safari/WebKit for iPhone; Chrome/Chromium for Android | U: execution unavailable; physical device absent |

Every profile needs actual device/browser chrome heights, visual viewport changes and DPR confirmed. Android should also be checked in Samsung Internet where relevant; none available here. Additional short landscape candidates: 667×320, 740×320, 844×320 and 915×320, all U. Test with address bar expanded/collapsed and keyboard open/closed; all U.

## Executed example layouts

Outer iframe:360×740 portrait /740×360 landscape. All rows use cloud Chromium and the pre-existing review page selector plus Portrait/Landscape buttons. Wrapper horizontal overflow measured0 in both orientations. Results apply to initial nested `site.html`, not all of its child pages/states.

| Exact demo wrapper directory under `public/boardroom/` | Portrait inner viewport | Portrait horizontal overflow | Landscape inner viewport | Landscape horizontal overflow | Additional evidence / limits |
|---|---|---:|---|---:|---|
| `billboard/demos/donut/` | 352×659 | 0px | 732×308 | 0px | Initial DOM geometry only; full scroll/state/touch tests U. |
| `billboard/demos/mini-golf/` | 352×659 | 0px | 732×308 | 0px | Settled portrait recheck and screenshot; full scroll/state tests U. |
| `billboard/demos/drilling/` | 352×659 | 0px | 732×308 | 0px | Initial DOM geometry only; full scroll/state/touch tests U. |
| `noticeboard/demos/diner/` | 352×659 | 0px | 732×308 | 0px | Initial DOM geometry only; full scroll/state/touch tests U. |
| `noticeboard/demos/produce/` | 352×659 | 0px | 732×308 | 0px | Initial DOM geometry only; full scroll/state/touch tests U. |
| `noticeboard/demos/charity-walk/` | 352×659 | 0px | 732×308 | 0px | Initial DOM geometry only; full scroll/state/touch tests U. |
| `skateboard/demos/florist/` | 337×659 | 0px | 717×308 | 0px | Settled landscape screenshot; form invalid email reproduced separately on desktop. |
| `skateboard/demos/pottery/` | 337×659 | 168px | 717×308 | 0px | FAIL P02/S25: third philosophy card beyond viewport; source corroborated. Landscape geometry0, full content U. |
| `skateboard/demos/tailor/` | 352×659 | 0px | 732×308 | 0px | Initial DOM geometry only; full scroll/state/touch tests U. |
| `springboard/demos/dining/` | 337×659 | 0px | 717×308 | 0px | FAIL S16: Menu click leaves nav hidden in both modes; child pages U. |
| `springboard/demos/retreat/` | 337×659 | 0px | 717×308 | 0px | Initial DOM geometry only; full scroll/state/touch tests U. |
| `springboard/demos/theatre/` | 337×659 | 0px | 717×308 | 0px | Initial DOM geometry only; full scroll/state/touch tests U. |

Changing iframe dimensions via the existing controls exercises responsive orientation conditions and resizes. It is not a physical orientation test. No touch gestures, on-screen keyboard, real safe-area inset or browser toolbar change was simulated.

## Every-route device matrix

`U/U` means **portrait unverified / landscape unverified** for that profile. No profile column is a pass. Each original route is listed once; iframe execution above is additional evidence for the12 demo wrapper/site pairs, not a replacement for these phone cells. For every row, short-landscape, breakpoint-neighbor, keyboard, zoom, motion, safe-area and physical-device cases also remain U.

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

Principal independently extracts only actual `@media` preludes (CSS/HTML/JS), plus stylesheet-link media. Ordinary element `min-width`/`max-height` declarations are excluded. Range syntax, imports, dynamic stylesheet injection and combined orientation/aspect-ratio requirements need manual review. For each applicable route and each breakpoint B, test **B−1, B, B+1**. Test width neighbors at portrait height900 and landscape height360, and height neighbors at landscape width844 and portrait width390, then apply the full original media condition. These are planned test cases, not results.

| Axis | B | Planned neighbor values | Source example |
|---|---:|---|---|
| width | 350px | 349, 350, 351px — U | `public/boardroom/mobile-boardroom-light-grid.css:428` |
| width | 360px | 359, 360, 361px — U | `public/css/landing-experience.css:2687` |
| width | 380px | 379, 380, 381px — U | `public/boardroom/mobile-boardroom.css:427` |
| width | 390px | 389, 390, 391px — U | `public/css/whywebsite-mobile-fit.css:98` |
| width | 420px | 419, 420, 421px — U | `public/boardroom/demo-browser.css:42` |
| width | 430px | 429, 430, 431px — U | `public/css/foundrycare-mobile-c.css:290` |
| width | 480px | 479, 480, 481px — U | `public/boardroom/boardroom.css:696` |
| width | 519px | 518, 519, 520px — U | `public/css/tablab-landing.css:1560` |
| width | 520px | 519, 520, 521px — U | `public/boardroom/skateboard/demos/pottery/css/style.css:241` |
| width | 540px | 539, 540, 541px — U | `public/boardroom/demo-browser.css:23` |
| width | 541px | 540, 541, 542px — U | `public/boardroom/demo-browser.css:38` |
| width | 560px | 559, 560, 561px — U | `public/boardroom/board-page.css:392` |
| width | 561px | 560, 561, 562px — U | `public/styles.css:1645` |
| width | 580px | 579, 580, 581px — U | `public/styles.css:1354` |
| width | 600px | 599, 600, 601px — U | `public/boardroom/demo-browser.css:75` |
| width | 620px | 619, 620, 621px — U | `public/boardroom/billboard/demos/drilling/css/style.css:70` |
| width | 640px | 639, 640, 641px — U | `public/boardroom/skateboard/demos/tailor/shop/index.html:13` |
| width | 650px | 649, 650, 651px — U | `public/boardroom/billboard/css/style.css:242` |
| width | 660px | 659, 660, 661px — U | `public/css/foundry-info.css:35` |
| width | 700px | 699, 700, 701px — U | `public/boardroom/demo-browser.css:38` |
| width | 701px | 700, 701, 702px — U | `public/boardroom/mobile-boardroom-portrait-fit.css:3` |
| width | 760px | 759, 760, 761px — U | `public/boardroom/billboard/demos/donut/css/mobile-fluid.css:10` |
| width | 800px | 799, 800, 801px — U | `public/css/explore-phone-fit.css:71` |
| width | 820px | 819, 820, 821px — U | `public/boardroom/boardroom.css:579` |
| width | 821px | 820, 821, 822px — U | `public/css/tablab-landing.css:23` |
| width | 860px | 859, 860, 861px — U | `public/boardroom/skateboard/demos/pottery/css/style.css:44` |
| width | 900px | 899, 900, 901px — U | `public/boardroom/billboard/demos/drilling/css/mobile-fluid.css:2` |
| width | 901px | 900, 901, 902px — U | `public/boardroom/boardroom.css:850` |
| width | 960px | 959, 960, 961px — U | `public/boardroom/billboard/demos/donut/css/mobile-fluid.css:410` |
| width | 980px | 979, 980, 981px — U | `public/boardroom/board-page.css:375` |
| width | 981px | 980, 981, 982px — U | `public/boardroom/board-page.css:349` |
| width | 1000px | 999, 1000, 1001px — U | `public/boardroom/billboard/demos/donut/css/landscape-authoritative.css:3` |
| width | 1024px | 1023, 1024, 1025px — U | `public/styles.css:936` |
| width | 1050px | 1049, 1050, 1051px — U | `public/boardroom/billboard/css/style.css:232` |
| width | 1051px | 1050, 1051, 1052px — U | `public/css/foundrycare.css:34` |
| width | 1080px | 1079, 1080, 1081px — U | `public/css/foundry-info.css:34` |
| width | 1081px | 1080, 1081, 1082px — U | `public/css/foundry-info.css:66` |
| width | 1100px | 1099, 1100, 1101px — U | `public/boardroom/skateboard/demos/pottery/css/style.css:225` |
| width | 1101px | 1100, 1101, 1102px — U | `public/css/explore-premium.css:397` |
| width | 1180px | 1179, 1180, 1181px — U | `public/boardroom/noticeboard/demos/charity-walk/styles.css:11` |
| width | 1250px | 1249, 1250, 1251px — U | `public/boardroom/boardroom.css:540` |
| width | 1251px | 1250, 1251, 1252px — U | `public/boardroom/boardroom.css:828` |
| width | 1260px | 1259, 1260, 1261px — U | `public/boardroom/board-page.css:364` |
| width | 1500px | 1499, 1500, 1501px — U | `public/css/landing-experience.css:2208` |
| height | 330px | 329, 330, 331px — U | `public/boardroom/noticeboard/demos/diner/css/style.css:1168` |
| height | 350px | 349, 350, 351px — U | `public/boardroom/billboard/demos/mini-golf/css/mobile-composition.css:373` |
| height | 365px | 364, 365, 366px — U | `public/boardroom/billboard/demos/drilling/css/mobile-fluid.css:44` |
| height | 420px | 419, 420, 421px — U | `public/css/landing-experience.css:3968` |
| height | 500px | 499, 500, 501px — U | `public/boardroom/billboard/demos/donut/css/mobile-fluid.css:410` |
| height | 520px | 519, 520, 521px — U | `public/boardroom/billboard/demos/donut/css/landscape-authoritative.css:3` |
| height | 560px | 559, 560, 561px — U | `public/boardroom/board-page.css:1380` |
| height | 600px | 599, 600, 601px — U | `public/boardroom/springboard/demos/dining/assets/css/main.css:1026` |
| height | 620px | 619, 620, 621px — U | `public/css/tablab-landing.css:492` |
| height | 640px | 639, 640, 641px — U | `public/boardroom/mobile-boardroom-light-grid.css:428` |
| height | 650px | 649, 650, 651px — U | `public/boardroom/board-page.css:1086` |
| height | 680px | 679, 680, 681px — U | `public/boardroom/billboard/demos/donut/css/mobile-fluid.css:389` |
| height | 700px | 699, 700, 701px — U | `public/boardroom/billboard/demos/drilling/css/mobile-fluid.css:11` |
| height | 701px | 700, 701, 702px — U | `public/css/explore-premium.css:397` |
| height | 720px | 719, 720, 721px — U | `public/boardroom/billboard/demos/donut/css/portrait-polish.css:213` |
| height | 735px | 734, 735, 736px — U | `public/boardroom/billboard/demos/mini-golf/css/mobile-fluid.css:114` |
| height | 740px | 739, 740, 741px — U | `public/css/landing-experience.css:2643` |
| height | 760px | 759, 760, 761px — U | `public/boardroom/billboard/demos/donut/css/mobile-fluid.css:366` |
| height | 768px | 767, 768, 769px — U | `public/boardroom/springboard/demos/theatre/assets/css/styles.css:233` |
| height | 780px | 779, 780, 781px — U | `public/boardroom/billboard/demos/mini-golf/css/mobile-fluid.css:100` |
| height | 790px | 789, 790, 791px — U | `public/boardroom/board-page.css:349` |
| height | 800px | 799, 800, 801px — U | `public/css/foundrycare.css:291` |
| height | 820px | 819, 820, 821px — U | `public/css/foundrycare.css:26` |
| height | 900px | 899, 900, 901px — U | `public/boardroom/billboard/demos/donut/css/landscape-fix.css:2` |

## Per-route breakpoint applicability

Direct HTML/linked CSS only. Shared JavaScript-injected CSS and imports may add conditions; absence here does not mean no breakpoint. Preserve each original media prelude when executing the tests; a number alone omits orientation and conjunctions.

| Exact route source | Direct source pixel conditions (not test results) |
|---|---|
| `public/boardroom/billboard/demos/donut/index.html` | max-height:500px, max-height:600px, max-height:700px, max-width:420px, max-width:540px, min-width:541px, max-width:600px, max-width:700px, max-width:900px, min-width:901px, max-width:1000px |
| `public/boardroom/billboard/demos/donut/site.html` | max-height:500px, max-height:520px, max-height:680px, max-height:720px, max-height:760px, max-height:900px, max-width:760px, max-width:960px, max-width:1000px |
| `public/boardroom/billboard/demos/drilling/index.html` | max-height:500px, max-height:600px, max-height:700px, max-width:420px, max-width:540px, min-width:541px, max-width:600px, max-width:700px, max-width:900px, min-width:901px, max-width:1000px |
| `public/boardroom/billboard/demos/drilling/site.html` | max-height:365px, max-height:500px, max-height:520px, max-height:700px, max-width:620px, max-width:900px, max-width:1000px |
| `public/boardroom/billboard/demos/mini-golf/index.html` | max-height:500px, max-height:600px, max-height:700px, max-width:420px, max-width:540px, min-width:541px, max-width:600px, max-width:700px, max-width:900px, min-width:901px, max-width:1000px |
| `public/boardroom/billboard/demos/mini-golf/site.html` | max-height:350px, max-height:500px, max-height:520px, max-width:900px, max-width:1000px |
| `public/boardroom/billboard/index.html` | max-height:500px, max-height:560px, max-height:600px, max-height:650px, max-height:700px, max-height:720px, max-height:790px, max-width:560px, max-width:700px, max-width:900px, min-width:901px, max-width:980px, min-width:981px, max-width:1100px, max-width:1260px |
| `public/boardroom/index.html` | max-height:500px, max-height:600px, max-height:640px, max-height:700px, max-width:350px, max-width:480px, max-width:700px, max-width:820px, max-width:900px, min-width:901px, max-width:1100px, max-width:1250px, min-width:1251px |
| `public/boardroom/mobile-preview.html` | No direct pixel condition extracted; inspect indirect dependencies. |
| `public/boardroom/noticeboard/demos/charity-walk/index.html` | max-height:500px, max-height:600px, max-height:700px, max-width:420px, max-width:540px, min-width:541px, max-width:600px, max-width:700px, max-width:900px, min-width:901px, max-width:1000px |
| `public/boardroom/noticeboard/demos/charity-walk/site.html` | max-width:760px, max-width:900px, max-width:1180px |
| `public/boardroom/noticeboard/demos/diner/index.html` | max-height:500px, max-height:600px, max-height:700px, max-width:420px, max-width:540px, min-width:541px, max-width:600px, max-width:700px, max-width:900px, min-width:901px, max-width:1000px |
| `public/boardroom/noticeboard/demos/diner/site.html` | max-height:330px, max-width:700px, max-width:900px, max-width:1050px |
| `public/boardroom/noticeboard/demos/produce/index.html` | max-height:500px, max-height:600px, max-height:700px, max-width:420px, max-width:540px, min-width:541px, max-width:600px, max-width:700px, max-width:900px, min-width:901px, max-width:1000px |
| `public/boardroom/noticeboard/demos/produce/site.html` | max-width:760px, max-width:900px, max-width:1050px |
| `public/boardroom/noticeboard/index.html` | max-height:500px, max-height:560px, max-height:600px, max-height:650px, max-height:700px, max-height:720px, max-height:790px, max-width:560px, max-width:700px, max-width:900px, min-width:901px, max-width:980px, min-width:981px, max-width:1100px, max-width:1260px |
| `public/boardroom/skateboard/demos/florist/index.html` | max-height:500px, max-height:600px, max-height:700px, max-width:420px, max-width:540px, min-width:541px, max-width:600px, max-width:700px, max-width:900px, min-width:901px, max-width:1000px |
| `public/boardroom/skateboard/demos/florist/site.html` | max-width:600px, max-width:900px |
| `public/boardroom/skateboard/demos/florist/success.html` | max-width:600px, max-width:900px |
| `public/boardroom/skateboard/demos/pottery/index.html` | max-height:500px, max-height:600px, max-height:700px, max-width:420px, max-width:540px, min-width:541px, max-width:600px, max-width:700px, max-width:900px, min-width:901px, max-width:1000px |
| `public/boardroom/skateboard/demos/pottery/site.html` | max-width:520px, max-width:860px, max-width:1100px |
| `public/boardroom/skateboard/demos/tailor/index.html` | max-height:500px, max-height:600px, max-height:700px, max-width:420px, max-width:540px, min-width:541px, max-width:600px, max-width:700px, max-width:900px, min-width:901px, max-width:1000px |
| `public/boardroom/skateboard/demos/tailor/shop/index.html` | max-height:500px, max-width:600px, max-width:640px, max-width:900px, min-width:901px, max-width:1100px |
| `public/boardroom/skateboard/demos/tailor/site.html` | max-height:500px, max-width:600px, max-width:900px, min-width:901px |
| `public/boardroom/skateboard/index.html` | max-height:500px, max-height:560px, max-height:600px, max-height:650px, max-height:700px, max-height:720px, max-height:790px, max-width:560px, max-width:700px, max-width:900px, min-width:901px, max-width:980px, min-width:981px, max-width:1100px, max-width:1260px |
| `public/boardroom/springboard/demos/dining/dine.html` | max-height:600px, max-width:600px, max-width:700px, max-width:900px, max-width:1000px, max-width:1100px |
| `public/boardroom/springboard/demos/dining/index.html` | max-height:500px, max-height:600px, max-height:700px, max-width:420px, max-width:540px, min-width:541px, max-width:600px, max-width:700px, max-width:900px, min-width:901px, max-width:1000px |
| `public/boardroom/springboard/demos/dining/reviews.html` | max-height:600px, max-width:600px, max-width:700px, max-width:900px, max-width:1000px, max-width:1100px |
| `public/boardroom/springboard/demos/dining/sign.html` | max-height:600px, max-width:600px, max-width:700px, max-width:900px, max-width:1000px, max-width:1100px |
| `public/boardroom/springboard/demos/dining/site.html` | max-height:600px, max-width:600px, max-width:700px, max-width:900px, max-width:1000px, max-width:1100px |
| `public/boardroom/springboard/demos/dining/wine.html` | max-height:600px, max-width:600px, max-width:700px, max-width:900px, max-width:1000px, max-width:1100px |
| `public/boardroom/springboard/demos/retreat/book.html` | max-height:600px, max-width:700px, max-width:900px |
| `public/boardroom/springboard/demos/retreat/discover.html` | max-height:600px, max-width:700px, max-width:900px |
| `public/boardroom/springboard/demos/retreat/index.html` | max-height:500px, max-height:600px, max-height:700px, max-width:420px, max-width:540px, min-width:541px, max-width:600px, max-width:700px, max-width:900px, min-width:901px, max-width:1000px |
| `public/boardroom/springboard/demos/retreat/retreats.html` | max-height:600px, max-width:700px, max-width:900px |
| `public/boardroom/springboard/demos/retreat/reviews.html` | max-height:600px, max-width:700px, max-width:900px |
| `public/boardroom/springboard/demos/retreat/site.html` | max-height:600px, max-width:700px, max-width:900px |
| `public/boardroom/springboard/demos/theatre/book-tickets.html` | max-height:600px, max-height:768px, max-height:900px, max-width:700px, max-width:980px, min-width:981px |
| `public/boardroom/springboard/demos/theatre/clementine-street.html` | max-height:600px, max-height:768px, max-height:900px, max-width:700px, max-width:980px, min-width:981px |
| `public/boardroom/springboard/demos/theatre/coming-soon.html` | max-height:600px, max-height:768px, max-height:900px, max-width:700px, max-width:980px, min-width:981px |
| `public/boardroom/springboard/demos/theatre/index.html` | max-height:500px, max-height:600px, max-height:700px, max-width:420px, max-width:540px, min-width:541px, max-width:600px, max-width:700px, max-width:900px, min-width:901px, max-width:1000px |
| `public/boardroom/springboard/demos/theatre/now-playing.html` | max-height:600px, max-height:768px, max-height:900px, max-width:700px, max-width:980px, min-width:981px |
| `public/boardroom/springboard/demos/theatre/site.html` | max-height:600px, max-height:768px, max-height:900px, max-width:700px, max-width:980px, min-width:981px |
| `public/boardroom/springboard/index.html` | max-height:500px, max-height:560px, max-height:600px, max-height:650px, max-height:700px, max-height:720px, max-height:790px, max-width:560px, max-width:700px, max-width:900px, min-width:901px, max-width:980px, min-width:981px, max-width:1100px, max-width:1260px |
| `public/foundrycare/index.html` | max-height:500px, max-height:600px, max-height:700px, max-height:760px, max-height:780px, max-height:800px, max-height:820px, max-width:430px, max-width:560px, min-width:561px, max-width:580px, max-width:650px, max-width:700px, max-width:760px, max-width:820px, max-width:900px, min-width:901px, max-width:980px, max-width:1024px, max-width:1050px, min-width:1051px, max-width:1100px |
| `public/index.html` | max-height:420px, max-height:500px, max-height:520px, max-height:600px, max-height:620px, max-height:650px, max-height:700px, min-height:701px, max-height:740px, max-height:760px, max-width:360px, max-width:519px, max-width:540px, max-width:560px, min-width:561px, max-width:580px, max-width:600px, max-width:700px, max-width:760px, max-width:800px, max-width:820px, min-width:821px, max-width:900px, min-width:901px, max-width:980px, max-width:1024px, max-width:1100px, min-width:1101px, min-width:1500px |
| `public/maintenance/index.html` | max-width:560px |
| `public/start/index.html` | max-height:500px, max-height:600px, max-height:700px, max-width:560px, min-width:561px, max-width:580px, max-width:700px, max-width:760px, max-width:900px, min-width:901px, max-width:980px, max-width:1024px, max-width:1100px |
| `public/the-foundry/index.html` | max-height:500px, max-height:600px, max-height:700px, max-width:560px, min-width:561px, max-width:580px, max-width:660px, max-width:700px, max-width:760px, max-width:820px, max-width:900px, min-width:901px, max-width:980px, max-width:1000px, max-width:1024px, max-width:1080px, min-width:1081px, max-width:1100px, max-width:1500px |
| `public/whywebsite/index.html` | max-height:500px, max-height:600px, max-height:680px, max-height:700px, max-height:760px, max-width:390px, max-width:560px, min-width:561px, max-width:580px, max-width:700px, max-width:760px, max-width:820px, min-width:821px, max-width:900px, min-width:901px, max-width:980px, max-width:1024px, max-width:1100px |

## Required state checklist — all routes, remaining unverified unless explicitly recorded

- Header/nav/menu closed/open and long content; Back/Home; nested iframe scrolling and full-screen return.
- Fixed/sticky elements at top/middle/bottom, no clipping/overlap, readable text and target spacing.
- Orientation during open menu, form entry, image/dialog display and scrolling.
- Input focus and on-screen keyboard, validation errors, confirmation/reset; no real send or payment without appropriate authorization.
- Tab/Shift-Tab/Enter/Space/Escape; focus visibility and order; screen reader semantics.
- Browser zoom200%/400%, text enlargement, reduced motion, safe areas and browser viewport changes.
- Chromium Android, Safari/WebKit iOS, Firefox if supported, plus physical iPhone/Galaxy A16/Galaxy/Pixel.

Completion requires actual executed results and evidence replacing U cells. This matrix does not authorize implementation, deployment or automatic legacy deletion.
