# Independent responsive-frame checks

2026-10-12 UTC, Chrome/CDP; exact browser version unavailable. Existing https://b94ffb34.foundry-a3k.pages.dev/boardroom/mobile-preview host only. Twelve existing options selected using UI; Portrait/ Landscape UI buttons only. Host wrapper viewports360×740 and740×360; actual nested site viewports352×659 and732×308. These are responsive iframe checks, not physical-device tests, and establish no Samsung A16/iPhone/Pixel assurance.

All24 selection/orientation identities confirmed via nested document URL matching selected path. Fresh AX and repeated read-only nested frame metrics settled after initial transitions. Early stale/blank frames and transient1544/1543 widths were discarded. document link.sheet projections returned false even while screenshots displayed styles; these are not stylesheet load-failure findings. See JSON for default-state client/scroll widths. All outer wrapper widths equalled360 or740. Settled inner root scroll widths equal client except Pottery portrait.

## Pottery portrait overflow independently reproduced

Nested site URL `/boardroom/skateboard/demos/pottery/site?v=pottery-landscape-masthead-1`. clientWidth337, scrollWidth505. `div.philosophy-card.reveal.delay-2` right504.625,width142.15625; contained H3/P right478.625. First-fold screenshot shows loaded hero and correct header; lower philosophy layout extends beyond available width by167.625px. Root overflow metric is verified; full lower screenshot not captured and user-visible horizontal scrolling/reachability not established. Landscape717/717 does not show root overflow in default state. Existing P02 should retain its identity where applicable rather than duplicating.

## Theatre landscape menu clipping independently reproduced

Nested site URL `/boardroom/springboard/demos/theatre/site?v=theatre-venue-photo-pair-1`, viewport732×308. Open actual `Menu` button (case-sensitive first guessed uppercase locator failed; correct label found through observed button text). Settled screenshot shows Home/NowPlaying/ComingSoon/BookTickets and only top edge of last destination.

`#mobilePanel.mobile-panel.open`: rect top58,bottom308; clientHeight250,scrollHeight293,overflowY visible. `Clementine Street` link top300,bottom351, beyond viewport308. Native scroll over menu at host coordinate500,350,down1page left link300..351 and panel.scrollTop0. This establishes clipping and failed captured wheel-scroll recovery. No blanket claim of inaccessible by every alternative input; touch and full keyboard recovery untested.

## Scope limits

Default demo site states only. No new model dimensions, no direct core iframe src injection, no viewport mutations, no external submissions. Portrait and landscape screenshot observations were inspected in browser tool, not saved as screenshot files. Native fullscreen, mobile browser chrome/safeareas, virtualkeyboard, touch, every subordinate route/form, breakpoint sweeps and physical hardware remain unverified. Prior test matrices remain historical; this file adds limited fresh independent observations.
