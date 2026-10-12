# Stage 4 demo rendered verification

2026-10-13. Repair deployment https://71b54b2e.foundry-a3k.pages.dev/ associated by Principal with source 50c1a32. Chrome cloud browser, exact engine version unavailable. Existing mobile-preview UI supplies outer 360×740 portrait and 740×360 landscape; actual nested content viewport 337×659 and 717×308 where scrollbars apply. These are iframe responsive checks, not physical-device tests. No DOM mutations or injected state used.

| Finding | Reproducible repaired result | Status |
|---|---|---|
| P02/S25 | Select Pottery, portrait. Root client/scroll widths both337; philosophy grid293px, all three cards left22/right315. Landscape root client/scroll widths both717; grid673px. Prior portrait505px overflow absent. | Rendered geometry verified for both supported sizes. |
| S28 Pottery | Open menu naturally; aria-expanded true. Press Escape on actual control; expanded false. | Verified supported opening/closing state. |
| S04 Florist | Select Florist landscape. Name Audit test; invalid email not-an-email; click Send Enquiry. Remains site route; email validity.valid false, typeMismatch true. Replace email with audit@example.invalid and click: settled iframe reaches /florist/success, Thank you heading. | Invalid rejection and safe local completion verified. No external request or mail submission performed. |
| S11 | Settled Florist success AX displays Flowers for every moment. | Verified. |
| S3-K01 Diner | Open Menu: Close focused, active panel not inert, other panel inert. Shift+Tab on Close reaches last Kids tab. Escape returns Menu, both closed panels inert. Five subsequent natural tabs reach Find us, address, phone then leave document; no closed panel entered. | Verified sampled boundary, close return and natural closed exclusion. |
| S3-K01 Produce | Open Find us: Close focused, only selected panel not inert. Shift+Tab remains Close (sole focusable). Escape returns Find us, both closed panels inert. Next natural Tab reaches board section, outside closed panels. | Verified sampled boundary, close return and natural exclusion. |
| S3-K01 Drilling | Open MENU then Escape on Close: focus returns menu-toggle; drawer inert. Next natural Tab leaves demo document, never drawer. | Verified sampled close and closed exclusion. |
| S3-K05 Donut | Portrait mobile hamburger → The Menu → settled .is-open → Escape → settled hidden. Focus is visible #mobile-menu-toggle; mobile nav and overlay hidden. Five next natural Tabs never enter hidden mobile nav or overlays. | Repaired return mechanism verified, preserving historical suspected classification of pre-repair observation. |
| S3-L01 Charity | Direct desktop /charity-walk/site. Editing strip clientWidth/scrollWidth228/228, clientHeight/scrollHeight44/44, computed white-space normal. Prior228/238 horizontal clipping absent. | Verified original strip width geometry. Mobile uses different hub and hidden desktop strip, not tested as the same element. |

Florist label for values match explicit control IDs; getByLabel successfully locates Name and Email. Browser DOM projection returned false for native label.control references, so that unsupported property is not evidence of missing associations.

Initial async iframe observations before route settlement were discarded. Success navigation only recorded after subsequent settled AX state. Inert is read through the actual attribute; the projected inert property is unavailable. Motion preference emulation, broad breakpoint/device coverage, zoom, painted-background contrast and physical phones remain unverified. Principal independently reproduces material results before final sign-off.
