# Stage 3 resource DOM diagnostic scope

Observed 2026-10-11/12 UTC through Chrome/CDP on https://b94ffb34.foundry-a3k.pages.dev/. Exact version unavailable. Viewport 1363×936 CSS pixels throughout. This is a resource diagnostic, not an exhaustive rendered or interactive pass. Deployment association and byte hashing were not independently established here.

All 50 route documents from uploaded stage-3-route-state-register(1)(1).md were navigated and had DOM measurements collected. Twelve core routes were measured before the user pause; 38 demo/content documents after pause. Paths below are post-redirect URLs. Wrappers' image counts exclude nested iframe images; direct site routes were separately measured. CSS backgrounds, dynamically activated assets and network status were not exhaustively captured.

Each settled observation had documentElement.scrollWidth equal to clientWidth (1363 or 1348 with scrollbar). This only excludes root horizontal overflow in the captured default state, not clipping inside children or overlays. All fonts.status values were `loaded`; computed body family declarations were recorded during browser execution. Neither establishes actual font file download, glyph face use or absence of fallback.

| Route | client/scroll width | img count |
|---|---:|---:|
| / |1363|0|
| /boardroom/ |1348|0|
| /boardroom/billboard/ |1363|3|
| /boardroom/noticeboard/ |1363|3|
| /boardroom/skateboard/ |1363|3|
| /boardroom/springboard/ |1363|3|
| /boardroom/mobile-preview |1363|0|
| /foundrycare/ |1363|0|
| /maintenance/ |1363|1|
| /start/ |1348|0|
| /the-foundry/ |1363|0|
| /whywebsite/ |1363|1|
| /boardroom/billboard/demos/donut/ |1363|0|
| /boardroom/billboard/demos/donut/site |1363|6|
| /boardroom/billboard/demos/drilling/ |1363|0|
| /boardroom/billboard/demos/drilling/site |1363|1|
| /boardroom/billboard/demos/mini-golf/ |1363|0|
| /boardroom/billboard/demos/mini-golf/site |1363|1|
| /boardroom/noticeboard/demos/charity-walk/ |1363|0|
| /boardroom/noticeboard/demos/charity-walk/site |1363|7|
| /boardroom/noticeboard/demos/diner/ |1363|0|
| /boardroom/noticeboard/demos/diner/site |1363|8|
| /boardroom/noticeboard/demos/produce/ |1363|0|
| /boardroom/noticeboard/demos/produce/site |1363|0|
| /boardroom/skateboard/demos/florist/ |1363|0|
| /boardroom/skateboard/demos/florist/site |1348|7|
| /boardroom/skateboard/demos/florist/success |1363|0|
| /boardroom/skateboard/demos/pottery/ |1363|0|
| /boardroom/skateboard/demos/pottery/site |1348|16|
| /boardroom/skateboard/demos/tailor/ |1363|0|
| /boardroom/skateboard/demos/tailor/site |1363|16|
| /boardroom/skateboard/demos/tailor/shop/ |1348|9|
| /boardroom/springboard/demos/dining/ |1363|0|
| /boardroom/springboard/demos/dining/site |1348|7|
| /boardroom/springboard/demos/dining/dine |1348|1|
| /boardroom/springboard/demos/dining/reviews |1348|0|
| /boardroom/springboard/demos/dining/sign |1348|2|
| /boardroom/springboard/demos/dining/wine |1348|1|
| /boardroom/springboard/demos/retreat/ |1363|0|
| /boardroom/springboard/demos/retreat/site |1348|5|
| /boardroom/springboard/demos/retreat/book |1348|1|
| /boardroom/springboard/demos/retreat/discover |1348|9|
| /boardroom/springboard/demos/retreat/retreats |1348|17|
| /boardroom/springboard/demos/retreat/reviews |1348|8|
| /boardroom/springboard/demos/theatre/ |1363|0|
| /boardroom/springboard/demos/theatre/site |1363|5|
| /boardroom/springboard/demos/theatre/book-tickets |1363|1|
| /boardroom/springboard/demos/theatre/clementine-street |1363|3|
| /boardroom/springboard/demos/theatre/coming-soon |1363|4|
| /boardroom/springboard/demos/theatre/now-playing |1363|2|

## Failed and pending image classification

S01 reproduced: Retreat Discover `assets/images/discover-hero.webp`, alt `Discover Wāperiki`, complete=true, naturalWidth=0. Its visible image box measured 1454.705×1212.097 pixels; the box extent is not proof of root overflow or visible content extent. Other eight Discover img elements had positive naturalWidth.

Retreat Retreats and Theatre Coming Soon/Now Playing each contained one complete=true/naturalWidth=0 empty `src=""` lightbox placeholder, 0×0 rect. Theatre ID `csLightboxImage`. These are not classified as broken displayed assets in the closed state.

Theatre venue `map.webp` remained pending at the initial default-state measurement, likely lazy/offscreen; no failed asset claim. All other settled observations had no pending img elements.

Florist and Pottery initial fast navigation snapshots captured unloaded styles/images (Times New Roman, all images pending, scrollWidth1976/1544). Rechecked using documented waitForLoadState(load), settled snapshot and measurements: correct computed family, positive image widths, root widths1348. Initial transition is not a site defect. Tailor wrapper first evaluation encountered null documentElement during transition; fresh AX then load-state collection succeeded.

## Logs and limits

One initial Home `tab.dev.logs({levels:['error','warn'],limit:100})` returned only `Error sending browser metadata to extension: Object`, timestamp2026-10-11T23:23:51.922Z, chrome-extension://kcdongibgcplmaagnmgpjhpjgmmaaaaa/content-script.bundle.js. This is extension scope, not a Tab Lab defect. Complete site console/network capture remains unverified. No repeated unsupported diagnostics, actual font-file loading proof, alternate viewport, zoom, reduced motion or native fullscreen tests performed.

No source edits, external submissions or delivery actions. Method: exact inventory-derived routes → tab.goto → fresh DOM snapshot → read-only evaluate of DOM image completion/natural dimensions, root viewport/scroll dimensions, document.fonts.status and computed body family; later routes used load-state waiting. Child overflow, dynamic states and resource causality remain outside this collection.
