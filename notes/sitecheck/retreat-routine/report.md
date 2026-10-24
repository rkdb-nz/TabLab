# Retreat routine check

Routine check complete with findings. Source: `5ed744e399c0af9c68e2ed7119fa017f087344a0`. [Live site](https://tablab.rkdb.nz/boardroom/springboard/demos/retreat/). QA branch `qa/sitecheck-retreat`, draft PR#81. No product files changed.

## Fixes I can make

- **RT-01 (High)** The enquiry falsely says it was sent; the contact link is a malformed mailto address, and the journal claims real guests without sample wording. **Proposed correction:** Keep realistic enquiry/contact flows, finish with an explicit demo-only/no-send result, and use truthful sample-content wording. **Evidence:** All three engines show 'Your enquiry has been sent — we’ll be in touch soon'; book.html only prevents submission and opens a local overlay. mailto:Clementines.rkdb.nz has no @. Reviews says 'Real guests. Real memories.'

- **RT-02 (Medium)** Property-specific Enquire buttons lose the chosen retreat. **Proposed correction:** Carry the selected retreat into the booking form. **Evidence:** Clicking Enquire — Coastal arrives with Woodland Retreat selected; all four source links share the same unqualified booking URL.

- **RT-03 (High)** Booking fields have unassociated labels, and native validation can scroll the invalid field behind the fixed header. **Proposed correction:** Associate all labels, give useful accessible errors and keep invalid/focused fields visible below the header. **Evidence:** Axe label on guests/name/email and select-name on Retreat. Firefox/WebKit phone invalid-guest screenshots show 999 behind the header. Native required/email/max=6 validation does work.

- **RT-04 (High)** Menu and gallery focus can reach background content; closed gallery controls remain tabbable; enquiry dialog does not contain/restore focus or close with Escape. **Proposed correction:** Use correct dialog semantics, hide/inert inactive content, contain and restore focus, and support Escape without losing existing gallery controls. **Evidence:** Axe aria-hidden-focus. Menu Tab reaches a home card. Gallery Tab 1 reaches Back to top. Enquiry focus contained=false and Escape closes=false in all three engines.

- **RT-05 (Medium)** Discover ignores reduced-motion preference and can stop responding to keyboard navigation after the menu is used. **Proposed correction:** Respect reduced motion, provide accessible scene navigation and reliable keyboard focus; retain the working return-to-top flow. **Evidence:** Reduced-motion context records transform transition 1.5s. PageDown on the menu button after closing leaves the Discover track unchanged; follow-up remains on hero. Source key handler excludes every button/link.

- **RT-06 (High)** Several small labels, non-home header links and the enquiry OK button fail contrast. **Proposed correction:** Use palette-consistent foreground/background colours that meet contrast requirements, including header states and confirmation controls. **Evidence:** Axe: white header on warm white approximately 1.01–1.02:1; labels/card metadata3.91:1; eyebrow4.35:1; OK white on #91a68f2.60:1. Four default pages report contrast findings.

- **RT-07 (Medium)** Several pages lack a main landmark, and current-page navigation indicators never activate. **Proposed correction:** Add semantic main regions and reliable current-page state/aria-current without changing the composition. **Evidence:** Axe landmark-one-main/region on collection/booking and uncontained Home content. Inline nav checks compare bare filenames with query-bearing hrefs; activeNav inventory empty.

- **RT-08 (Medium)** Four existing images are 2.3–2.9MB each, including the Discover hero and three guest portraits. **Proposed correction:** Optimise the existing assets with visual checking, lazy-load suitable below-fold imagery and version repaired assets. **Evidence:** Pinned blobs: discover-hero2622752B, review-guest-01 2916599B,04 2408668B,07 2315265B. Entire WebP asset set18,223,312B. All four originals inspected and hashes matched.

- **RT-09 (Medium)** Some descriptions/alternatives conflict with the imagery, and the booking Location copy is entirely clipped. **Proposed correction:** Align copy and alternatives with existing artwork, correct name/NZ spelling inconsistencies, and expose the Location information. **Evidence:** Town described as a limestone cottage but shown as a modern multi-storey building. Home alt describes a woodland cabin while image shows a scenic sign. Booking photo labelled map; Location copy begins at card bottom1590.45 and ends1785.89 with overflow hidden. Hannah & Will alt versus Hannah & Jewel caption; favorite instead of favourite.

## Items needing your attention or input

- **D-01 — Sign artwork:** the Discover sign says **Wāpereki**, whereas the site says **Wāperiki**. Correcting its baked lettering requires approval for revised artwork. Recommendation: preserve the design and correct the sign; do not mask lettering with CSS.

## Coverage and evidence

Nine browser/outer-viewport combinations completed: Chromium five default sizes, Firefox/WebKit desktop and portrait. All five pages, four galleries, twelve enlarged images, eight reviews and nine Discover scenes checked. Guest range/email/required validation works; false send confirmation does not indicate transmission. Fullscreen/return/gallery passed at desktop and phone. Current-page navigation, headings/landmarks, labels, contrast, motion and focus were inspected.

31 retained machine screenshots were opened and inspected, plus one live readiness screenshot. Four large source images were individually inspected and Git hashes matched. Actual iframe viewports include1426×845 at1440×900,382×763 at390×844,836×338 at844×390,312×487 at320×568 and772×248 at780×300. The focused screenshot named `short-discover-closing.png` actually shows the hero: PageDown remained blocked by menu-button focus. It is not claimed as a closing-scene capture.

Machine reports and ledger are retained alongside this report. Two original representative captures are retained in `evidence/`; all original screenshots are in Actions artifacts with90-day retention:
- [Routine run](https://github.com/rkdb-nz/TabLab/actions/runs/40093632753): Chromium/Firefox passed. WebKit setup exited124 at240seconds on Ubuntu26.04 before a browser test ran.
- [Focused follow-up](https://github.com/rkdb-nz/TabLab/actions/runs/40093956956): overlay/menu focus, Location clipping and reduced-motion/keyboard evidence; one screenshot.
- [WebKit recovery](https://github.com/rkdb-nz/TabLab/actions/runs/40094020893): only the two missing WebKit sizes on pinned Ubuntu24.04, passed.

Native200% zoom remains unverified: Ctrl-plus did not change1440×900/DPR1. WebKit is Linux emulation, not native Safari/iOS; no physical devices were certified. No independent agent review used. No real messages or reservations sent.

Page titles/branding checked; descriptions are absent on the five inner pages. Indexing intent is not changed. Shared wrapper PostHog config404s were observed and left outside this product audit. No product metadata, analytics, background or imagery changes have been made.
