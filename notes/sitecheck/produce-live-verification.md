# Produce live verification — 23 October 2026
Published product: main9c71de33a6be0fef3e62398e79c4d79ecb41c86f.
Target: https://tablab.rkdb.nz/boardroom/noticeboard/demos/produce/
No product files changed or new deployment made.

## Result
Previously outstanding Chrome/Firefox checks and genuine native200% Chrome zoom are now verified. Reuse previous WebKit evidence from run39897887509; do not claim a new WebKit run or physical-device test.

Run39903948543: installed Google Chrome155.0.8059.39 sampled1440x900,390x844,844x390,320x568,780x300; Firefox153 sampled1440x900 and390x844. Both launch successfully. Fresh panel focus, Escape, focus return, bottom-of-panel reachability, no About overlap and safe demo confirmations pass. No page exceptions. Existing analytics404/401 remain pending and unchanged.
Chrome gallery wait asserted the old /index.html URL and timed out after navigation because production redirects to clean /noticeboard/. This QA expectation was corrected; not a product failure. These two errors skipped the initial zoom stage and are not counted as zoom passes.

Run39904224028: focused Chrome desktop/gallery/native zoom continuation passed after correcting the URL assertion. Genuine browser zoom applied through X11 Control+ keyboard input in headed Chrome.
Before: inner1440x900, outerWidth1448, DPR1.
After: inner720x450, outerWidth1448, DPR2, root CSS zoom1.
This establishes browser zoom200%, not CSS magnification.
At200%: brand right264.98; board left360.41/right706/bottom394, viewport720x450. No brand-board overlap; board within viewport. Find panel scrolled to bottom and contact controls visibly reachable. Escape closes it.

## Screenshot review ledger
Run39903948543:9 Chrome PNGs inspected on two readable contact sheets (five home sizes; portrait About; portrait demo-contact bottom; short board; short About).
Run39904224028:3 PNGs inspected at full size (desktop home, native200% home, native200% Find bottom).
Firefox fresh machine measurements inspected; reuse prior visual evidence for unchanged layout. Total12 new screenshots reviewed.
Original ZIP/PNG artifacts retained90 days in those Actions runs. Compact machine measurements preserved alongside this note. Local original downloads under verification/.

## Remaining limits
Linux emulation is not physical phone or native Safari certification. Quantitative contrast over scenic images and real email/phone delivery are outside this completion; contacts are explicitly demo-only. Existing analytics/indexing decisions remain pending. No independent reviewer used.
No new product repair identified in this focused continuation. The previous native200% and failed-setup limitations are closed.
