# Stage 4 — Billboard, Noticeboard and Skateboard demo repairs

Repair source: audit baseline cf5fcbc, Stage 3 documentation checkpoint 2210235. This subordinate repair record requires Principal rendered verification before a finding is marked verified. No assets deleted or moved; legacy review remains 11 April 2027.

| Finding | Implementation | Disposition and validation |
|---|---|---|
| P02 / S25 | Pottery philosophy grid becomes one column at <=900 CSS px, matching the established mobile layout threshold. | Fixed in source; principal must measure overflow in portrait/landscape and around threshold. Desktop grid remains three columns. |
| S04 | Florist removes novalidate, associates six labels with unique control IDs, checks reportValidity before local-storage success navigation and rejects whitespace-only required text. | Fixed; native email validation must be tested rendered. No external submission added. |
| S11 | Florist success sentence becomes “Flowers for every moment.” | Fixed; exact source correction. |
| P04, Florist subset | Existing stone text variable darkens from #9A958D to #706B64 for labels, eyebrow and metadata. | Fixed; opaque pair ratios approximately 4.9 against #FAF6F0 and 5.1 against #FDFBF7. Approved hue family retained; image-backed contrast remains unverified. |
| C04 | Removes malformed failed-replacement selectors and their ineffective blur/dimming rules. Keeps the formerly discarded palette inactive in a comment. | Fixed source corruption without activating previously discarded colours or effects. Rendered comparison required. No asset deletion. |
| S3-K01 | Drilling closed drawer is inert; Diner and Produce closed panels are inert, focus starts on Close, cycles within the opened panel, and returns to opener after Close, backdrop or Escape. | Fixed source; principal should exercise keyboard boundaries and reopen/category states. Escape while no panel is open does not steal focus. |
| S3-K05, Donut context | Overlay opened from the mobile navigation records the visible hamburger as return target, rather than a trigger in the now-hidden navigation. | Mechanism corrected. Historical nested runtime observation remained suspected rather than Principal-confirmed; do not relabel the historical claim verified. Confirm actual nested return in repaired preview. |
| S28, Pottery subset | Adds aria-controls/expanded, synchronised Open/Close menu naming, and Escape close with return. | Fixed source; navigation links close/reset state. |
| S19, Pottery and Diner subsets | Pottery gates parallax by live reduced-motion preference and resets transform on preference changes; Diner final reduced-motion rule overrides later important ticker animation. | Fixed source; actual browser preference emulation unverified until supported. |
| S3-L01 | Charity Walk editing strip allows wrapping rather than nowrap clipping. | Fixed source; preserve strip styling and card layout; principal must inspect at original narrow card geometry. |

S3-K02's verified lightbox defect concerns Retreat and is outside this repair ownership; no verified lightbox defect was found in these demo directories.

P07, P03, S12 and S03 image/name/contact/context decisions deferred to Principal/user; no identity changes, asset replacement or demo redesign performed. Historical Foundry engineering comments retained where contextual.

Validation performed: Node syntax checks pass for Donut, Drilling, Diner, Produce, Florist and Pottery JavaScript. `git diff --check` passes. Source label associations and malformed-selector absence checked. These are source checks, not physical-phone certification or complete rendered regression results. All commits and final verification are owned by Principal.
