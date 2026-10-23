# Donut routine sitecheck — 23 October 2026

Routine check incomplete: WebKit browser coverage remains unavailable. Product files unchanged.

## Fixes I can make

| ID | Impact, evidence and proposed repair |
|---|---|
| DN-01 | High — Order Now claims the message was delivered and promises a reply, although app.js only prevents submission and updates local text. Reproduced in Chromium and Firefox using safe sample data. Add a notice within Order Now and a truthful no-send confirmation. |
| DN-02 | High — Back to site scrolls out of the visible panel. At 320×568, Order scroll-end puts Close at y−317 to −273 within a 312×487 frame; the same problem affects Menu, Story, Locations and Catering. At 780×300, Order Close moves above the panel's clipped top. Keep dismissal reachable independently of content scrolling. |
| DN-03 | Medium — Closing Menu, Story, Locations or Catering leaves focus on BODY. Their stored trigger is a button inside the now-hidden mobile menu. Restore focus to the visible menu toggle. Order focus restoration and open-order Shift+Tab wrapping passed. |
| DN-04 | Medium — The 780×300 landing clips the contents of its compressed feature cards. Recompose the short landscape layout so its meaningful content fits. Preserve the approved artwork; flag any conflict with fixed-screen composition. |
| DN-05 | Medium — Landing feature descriptions compute to 8–10px; landscape form labels are 10px and fields 11px, including desktop because the landscape rule extends to 900px high. Enlarge these for readability. Also darken small gold eyebrow text: live computed rgb(184,123,61), 12px, on rgba(255,250,246,.984), approximately 3.4:1 rather than 4.5:1. Main submit button white/#b41546 is 6.70:1 and passes. Tiny fonts are a usability finding, not a minimum-font-size WCAG rule. |
| DN-06 | Low — Remove malformed regex-like text in style.css and restore the intended :root token rule. The opening junk precedes :root, so intended custom properties fail; desktop main heading/body inherit black instead of the intended ink. Source and computed desktop colour confirm this. Retest affected Donut styles. |
| DN-07 | Medium — The map costs approximately 2.22 MB per normal local transfer, even before Locations is opened. Optimise the existing map and defer hidden-panel image loading where appropriate, preserving its lettering and appearance. Other principal images are roughly 9–197 KB each. |

## Items needing your attention or input

- Portrait hero artwork contains embedded lettering that is cropped and repeated by the live heading. Decide whether to retain it or authorise a different crop/existing artwork treatment. No new imagery or masking is authorised.
- Catering currently opens a real mailto to aholein1@rkdb.nz. Decide whether to retain that email action or make it a local demo interaction.
- Confirm indexing and analytics intent before changing these settings. Donut has no explicit noindex meta in its target documents; shared navigation loads PostHog. Settings unchanged.

## Source and readiness

Repository rkdb-nz/TabLab, product main 56b88b84202fedc549ee2bbb8ab121dfe4146f02.
Target public/boardroom/billboard/demos/donut/.
Live https://foundry-a3k.pages.dev/boardroom/billboard/demos/donut/ opened and interacted with. Mobile menu opens, The Menu opens, settled screenshot inspected, Back to site works, Order opens, and wrapper Back to gallery reaches the gallery. Live deployed commit was not independently established; source-specific findings refer to the pinned product commit.

QA-only branch qa/donut-routine, draft PR https://github.com/rkdb-nz/TabLab/pull/68.
No product modifications, repairs, merge or production publishing.

Local Playwright launches failed because Chromium headless shell revision 1234, Firefox 1538 and WebKit 2336 executables were absent. Used the existing pinned free GitHub Actions fallback, Playwright 1.62.1 and axe-core 4.11.1; no reinstall loop or new audit infrastructure. Original routine run https://github.com/rkdb-nz/TabLab/actions/runs/39879753431, QA head 0069ba0a7e4b84828ebb642a9f3e48c7c4b76fce, synthetic checkout a6dc1b6e5463997a07f0fc07b81468a2ba203b63.
Focused run https://github.com/rkdb-nz/TabLab/actions/runs/39880114152, QA head ad431b41ae7a261261886f4e215039bf4ed36a61, adds scrolling/focus at observed failing sizes and native zoom only. It does not repeat the routine grid.

Creating the QA PR also triggered the existing inherited Drilling completion workflow. That incidental successful run is not counted as Donut evidence. The focused QA commit removed that workflow from this QA branch to prevent further unrelated runs.

## Sample and passes

Chromium 151.0.7922.34 completed outer CSS viewports 1440×900, 390×844, 844×390, 320×568, 780×300. Firefox 153.0 completed 1440×900 and 390×844. WebKit installation did not reach test execution during the bounded check; no WebKit result or screenshot is claimed.

All five panels opened and closed on desktop Chromium. Menu and Order checked in remaining routine combinations. All five panels additionally scrolled to their ends at 320×568 and 780×300. Required-field and malformed-email rejection passed; safe filled form reproduced the false confirmation without network submission. Box selection and Notes worked. Catering's mailto code inspected without launching delivery. Brand home/reset code inspected. Escape closes Story; order focus trap wraps. Portrait-to-landscape rotation with Menu open retains the panel. Reduced-motion CSS transition and animation compute to .00001s. No first-party HTTP asset failures or uncaught script exceptions in completed routine reports. PostHog blocked-request console errors result from the deliberate external-network guard and do not prove an analytics outage.

Two axe scans on Chromium (landing and Order) and a Firefox landing scan reported no violations. This does not override the manual contrast and focus findings. No exhaustive accessibility certification or actual screen-reader session.

Settled native Chromium fullscreen and clickable return passed:
- Desktop: frame 1426×845 → 1440×900 fullscreen → 1426×845 after return.
- Phone: frame 382×763 → 390×844 fullscreen → 382×763 after return.
Fullscreen API state cleared and the Full screen control returned.

Native 200% zoom passed through the existing local QA extension technique: chrome.tabs.getZoom returned 2; outer viewport 1440×900/DPR1 became 720×450/DPR2. Inner frame measured 712×398. Landing and Order screenshots inspected. Earlier live-browser Ctrl+plus attempts did not change viewport or DPR and were not counted as zoom evidence.

Shared menu link destinations inspected once; Home, Boardroom, TabLabCare, About, Why Website and Start returned HTTP 200 live. Contact mailto inspected only. Back to gallery exercised live. Focused wrapper screenshots were taken during the transition and are explicitly not settled-layout passes; shared navigation also opened live with all links present. No mobile wrapper layout certification claimed.

Normal image/resource load only; no synthetic cold-load benchmark or slowed-load repeat. No physical-device, mobile keyboard, safe-area/browser chrome, real delivery, external-site audit, legal or security certification. Independent second-agent review was not used (optional in routine mode).

## Evidence

28 retained screenshots opened and inspected individually at readable size: 19 Chromium routine, 3 Firefox routine, 6 focused Chromium. Two transient live screenshots were inspected (one unsettled and one settled Menu); total captures: 30, below the 40 routine ceiling. Machine reports retain raw reviewed:false flags because review happened afterwards; review-ledger.json is authoritative.

Durable evidence folder: qa/sitecheck/donut/evidence/ on qa/donut-routine. Seven independent ZIPs contain readable JPEG previews of every retained screenshot and complete JSON machine reports. Unzip all into one directory. Original lossless PNGs remain in the original Actions artifacts, with 90-day retention ending 21 January 2027. The persistent JPEG copies preserve reviewed visual evidence beyond that expiry. The ledger maps original names to archived previews and observations.

Do not expand to an exhaustive audit. Product repairs require approval, followed by a targeted routine rerun on a preview branch. Keep design, email, indexing and analytics decisions pending unless separately approved.
