# Stage 4 — Dining and Retreat repairs

Implementation checkpoint: pending Principal batch commit. Dedicated repair branch; source baseline cf5fcbc. No assets deleted/moved, forms transmitted, or production publication.

| Finding ID | Implementation | Verification and disposition |
| --- | --- | --- |
| S01 | Discover hero now references existing `retreat/assets/icons/discover-hero.webp`. | Tracked asset existence verified. Rendered image loading pending Principal. Fixed in source. |
| S16 | Dining mobile navigation opens the existing links below the masthead; short panels scroll. Toggle exposes controls/expanded/open-close label; closed mobile links are inert, Escape closes and returns focus. | JS syntax verified; every Dining page shares this implementation. Rendered responsive verification pending. Fixed in source. |
| S17 | Dining readonly wheel-only time field replaced by a native select; same 21 fifteen-minute choices, 5–10 pm, initial 7 pm. | Choice generation and named form control verified. Native keyboard/touch operation needs runtime confirmation. Fixed in source. |
| S18 | Dining FAQ questions become native buttons with expanded state; existing answers and pointer appearance preserved. Four Dining controls receive explicit accessible names; all six Retreat labels are associated with IDs. | HTML parser verifies 4/4 Dining and 6/6 Retreat named controls and valid label associations. Fixed in source. |
| S19 | Retreat motion updates exit under reduced motion and reset reveal/parallax properties, including preference changes. Both demonstrations receive final-cascade motion suppression. Dining panel navigation reads the current preference. | JS syntax/source pathways verified; OS/browser preference runtime pending. Fixed in source; rendered verification outstanding. |
| S23 | Retreat current-page marking compares URL pathname and supplies `aria-current="page"`, covering query-bearing destinations and actual `site.html` Home. | Previous broken per-page inline equality scripts removed; normalized implementation shared on all five pages. Rendered current-link verification pending. Fixed in source. |
| S28 | Retreat mobile menu exposes controls, expanded state and open/close accessible label; closed links inert; Escape closes/returns. Mobile trigger minimum dimensions 44×44 CSS px, existing text/design preserved. | Syntax/source verified; rendered geometry pending. Fixed in source. |
| P05 | Both local confirmation dialogs gain entry focus, inert background preservation, Tab/Shift+Tab containment, Escape/backdrop/button closing and focus return. Dining also gains labelled title and hidden state. | Source review and syntax verified. Local-only preventDefault submission retained. No external submission attempted. Runtime pending. Fixed in source. |
| P04 (Retreat portion) | Book page only: eyebrow text darkened within its existing brown palette to #796047. Other page-specific eyebrow colors preserved. | Calculated opaque contrast: stone #E8E2D9 4.56:1; warm white #FFFCF8 5.74:1. Rendered computed pair pending. Fixed in source; P04 other demonstrations owned separately. |
| S3-K02 | Retreat lightbox is inert while closed; open lightbox makes body siblings inert, cycles enabled controls on Tab/Shift+Tab, restores prior inert states/focus on close. Existing previous/next/Escape interaction retained. | Source paths and syntax verified. Runtime first/middle/last-image control cycles pending. Fixed in source. |
| S2-CSS02 | Define existing intended `--serif` token as Cormorant Garamond, Georgia, serif for the confirmation heading. | Removes undefined custom-property inheritance; actual downloaded-font usage remains unverified. Fixed in source. |
| S02 / S03 / S22 / P03 / P07 | Contact/content and demonstration disclosure decisions excluded from this implementation. | Deferred to Principal/user decision, not silently rewritten. |

## Checks performed

- `node --check` passed on both demonstration scripts.
- `git diff --check` passed for Dining/Retreat paths.
- HTML parser verified every relevant form control has an accessible name and every `for` references an existing ID.
- Existing Discover hero asset exists at corrected path.
- Opaque Book eyebrow contrast calculation passes 4.5:1 on both documented backgrounds.

No browser executable was available to this repair agent. Source and computed-color checks do not prove rendered behavior, physical-phone operation, actual font loading or touch interaction. Principal independently reviews and verifies material results before final disposition. Significant design/content decisions remain deferred.
