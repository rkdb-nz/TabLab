# Dining / Retreat rendered repair verification

Date: 13 October 2026 NZ. Browser: supported cloud Chrome/CDP; top-level 1363×936 CSS px. Preview: `https://71b54b2e.foundry-a3k.pages.dev/`, attributed by Principal to source checkpoint `50c1a32`. Direct demonstration routes. Tests used actual browser actions, readonly DOM observations and settled screenshots. Local confirmation handlers only; fictitious name `Audit Test` and reserved `audit@example.invalid`; no transmission/payment.

| ID | Actual result | Disposition |
| --- | --- | --- |
| S01 | Discover hero settled `complete:true`, `naturalWidth:1448`; screenshot shows intended Wāperiki sign photograph. | Verified fixed. |
| P05 — Retreat | Submit moves focus to OK; native Tab and Shift+Tab remain on OK. Escape hides confirmation and returns Send Enquiry. Repeat local submission and OK button also return Send Enquiry. AX snapshot contains only confirmation while open. | Verified fixed for tested desktop workflow. |
| P05 — Dining | First entry left DOM focus on body, despite visible confirmation. After native Tab, subsequent Tab/Shift+Tab remained on Close; Escape hid modal and returned Request Table. | Runtime exposed remaining entry-focus issue. Local source corrected with requestAnimationFrame focus after visibility update. Reverification on next preview pending. |
| S3-K02 | Woodland first image enters Close; Tab skips disabled Previous to Next, wraps to Close, Shift+Tab returns Next. Escape closes and restores exact thumbnail. Middle-image Tab reaches Previous then Next. Next shows final Timber detail and disables Next; Close returns middle-image trigger. Open AX contains only lightbox controls/content. | Verified fixed for first/middle/last desktop controls and both close methods. |
| P04 — Retreat | Both Book and Location computed color `rgb(121,96,71)` (#796047), matching calculated opaque contrast 5.74:1 warm white / 4.56:1 stone. | Verified fixed for these documented opaque pairs. |
| S23 | Actual hosting redirects `.html` to extensionless paths. First implementation still compared `.html` link paths to extensionless location, leaving current links unmarked. | Local source now strips `.html` and terminal slash on both sides; next-preview verification pending. |
| S18 | AX exposes four Dining FAQ buttons as collapsed disclosures and accessible Name/Guests/Date/Time controls; Retreat exposes all six labels. | Accessible-name/disclosure structure verified. Principal owns Dining interaction checks. |
| S19 | Reduced-motion browser emulation/change APIs remain unavailable. | Source repair only; preference runtime unverified. |

Material source corrections after the tested deployment: both demonstration scripts normalize extensionless current paths; Dining confirmation queues entry focus in an animation frame. These require updated-preview verification before being recorded verified. Principal independently reproduces material results; this agent's testing alone does not establish ASSIST verification.

## Second preview follow-up

Preview `https://09b65188.foundry-a3k.pages.dev/`: Retreat Book now correctly marks Book `aria-current="page"` on an extensionless hosted path. S23 normalization verified on this route.

Dining initial focus still failed with rAF: opening computed `visibility:hidden` while transition ran, and settled focus was body. Inspection found a later duplicate CSS rule applying `transition:.25s ease` to all properties. Final CSS now limits transition to opacity, making visibility immediate; entry focus is synchronous. The active dialog's guarded keyboard handler is now on document, protecting containment/Escape even if focus is unexpectedly lost. These last source corrections require a third-preview reproduction and must not yet be counted as verified.

## Final repair preview — verified closure

Preview `https://97f031ed.foundry-a3k.pages.dev/`, source `25b7f94` attributed by Principal and matched to local public tree. Dining direct Sign: current link resolves to Sign `aria-current="page"` on extensionless hosting. Local valid submission immediately focuses `.booking-confirmation-close`, with computed visibility `visible`; natural Tab and Shift+Tab retain Close; Escape sets `hidden`, `aria-hidden="true"`, and returns Request Table. AX confirms only the named confirmation while open. P05 Dining now verified fixed for this desktop workflow. Principal performs separate reproduction.

The final source preserves approved Retreat menu trigger size; the earlier report's 44px enlargement was removed because target-size classification was unverified. S28's supported ARIA/current-label/inert/Escape corrections remain. No physical-device or reduced-motion runtime certification is implied.
