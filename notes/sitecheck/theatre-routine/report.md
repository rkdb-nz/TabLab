# Theatre routine sitecheck — 24 October 2026

**Routine check complete with findings.** No Theatre product files changed and no publishing performed.

Source: rkdb-nz/TabLab main at 877e2541e0976e6302615d4a23a25f10a1035ec7.
Live URL: https://tablab.rkdb.nz/boardroom/springboard/demos/theatre/
Branch: qa/sitecheck-theatre. Draft PR: https://github.com/rkdb-nz/TabLab/pull/79

## Fixes I can make
- **TH-01 — High:** Venue Hire retains a wide desktop grid on phones; the form is clipped and the centre copy collapses into a 64px column. Proposed: Use a genuine single-column mobile venue layout and preserve reachable controls at neighbouring sizes. Evidence: venue-hire-phone.png; main scrollWidth 640 at a 382px frame; centre width 64 and page height 9,376px.
- **TH-02 — High:** Hire confirmation falsely promises a response within two working days; no enquiry is sent. Fictional email links also open a real mail client. Proposed: Keep the enquiry/email process realistic, ending with an explicit demo-only/no-send confirmation. Evidence: hire-result.png; live dummy submission observed; venue-form.js prevents default and makes no request; README confirms fictional contacts.
- **TH-03 — Medium:** Venue Hire accepts 999 attendees despite max=200; errors leave focus on Send and are not associated with their fields. Proposed: Respect range/type validity, associate error text, focus the first invalid field and announce errors. Evidence: Live and hosted submission with 999 succeeded; hire invalid focus remained submit button; novalidate custom code only tests required/email.
- **TH-04 — High:** Coming Soon button on Now Playing is almost invisible; Coming Soon footer text also fails contrast. Proposed: Use palette-consistent foreground/background contrast of at least 4.5:1 for normal text. Evidence: Axe: button 1.07:1; footer 4.13:1; now-playing-details.png and coming-soon.png.
- **TH-05 — Medium:** Poster lightbox allows Tab into background content; landscape menu content extends below its unscrollable overlay. Proposed: Contain/restore overlay focus, make background inert where appropriate, and allow menu scrolling in short viewports. Evidence: poster tab focus contained=false; rotated-menu.png; short-landscape menu clientHeight190 versus scrollHeight283, overflow visible.
- **TH-06 — Medium:** Venue scroll region is not keyboard-focusable; seating buttons use unsupported aria-selected and booking summary skips heading level. Proposed: Make internal venue scrolling keyboard-accessible and correct seating state/heading semantics. Evidence: Axe scrollable-region-focusable, aria-allowed-attr on three zone cards, and heading-order on Booking Summary.
- **TH-07 — Medium:** Narrow-phone heading splits Clementine mid-word, footer links break into fragments, and the ticket column overflows internally. Proposed: Tune narrow breakpoints and footer wrapping without reducing readable text unnecessarily. Evidence: 320x568-home.png; phone booking/result captures; book-left scrollWidth332 versus clientWidth312.
- **TH-08 — Medium:** Homepage imagery cycles automatically for longer than five seconds with no pause control; reduced-motion fallback alone does not provide a general pause. Proposed: Add an accessible pause/resume control while preserving the existing sequence and reduced-motion static image. Evidence: main.js repeating hold/fade timers; normal motion controls contain only Menu; reduced sequence correctly selects hero-exterior2.
- **TH-09 — Low:** Location alternates between Wāperiki and Wāpereki; a venue image labelled theatre interior actually shows the exterior sign. Proposed: Use consistent location spelling and accurate image alternatives. Evidence: now-playing-details.png versus venue-find.png; venue-theatre.png and theatre1.webp alt.
- **TH-10 — Low:** The Family Group Chat poster is 2,554,815 bytes, much larger than the other posters. Proposed: Optimise the existing asset with a visually checked re-encode; preserve the artwork and lettering. Evidence: Pinned source asset tree; poster3.webp Git blob d0908a7ceb5a0b0515c75ee72e9ac5d5373cd7f5.

## Items needing your attention or input
- **D-01 — Season/artwork dates:** The Quiet Hours image says12 September–5 October2025, but the page says Coming February. Ashes of Summer artwork says10 April–3 May2026; Family Group Chat page says12 June–4 July2026. These are past dates as of this check. The booking day/date list has no year and does not match the2026 calendar. Recommended: preserve the artwork, present these as illustrative sample seasons/productions, and align accompanying copy to the printed poster dates. No artwork regeneration or masking is authorised.

## Coverage
- All five content pages reviewed: Home, Now Playing, Coming Soon, Book Tickets and Clementine Street.
- All Now Playing tabs, all three poster enlargements, all venue section tabs/hash routes, venue hire required/email errors, success/reset, ticket selection/quantity floor/mixed pricing/checkout/demo completion/reset checked.
- Nine default engine/outer-viewport combinations completed using the pinned Playwright runner and hosted fallback. Actual inner iframe sizes recorded separately; no claim that an outer390px viewport means a390px iframe.
- Three engines completed desktop/portrait navigation and booking smoke checks. Desktop and phone fullscreen/return passed with measured viewport sizes. Gallery return/open additionally verified on the live site.
- Five distinct-page Axe scans completed; raw violations are retained in machine-reports.json. These cover default page templates, not every dynamic panel.
- Reduced-motion mode correctly stops the homepage sequence on its night exterior image. Normal-motion mode has no pause.
- Ticket totals: one adult42 + one concession36 + one under25 28 =106; zero quantity remains zero; reset returns0. Demo ticket final message is truthful. No actual booking, payment or message was delivered. Supplied payment details are readonly samples.
- Venue hire: empty fields and malformed email rejected; attendance999 incorrectly accepted; completion falsely promises a response. Source sends no form data.
- Local core assets loaded in the completed sample. Shared PostHog config/config.js returned404, as already known from Restaurant; analytics left unchanged. Titles and descriptions exist. Indexing, analytics and metadata policy were not changed.
- Source images were inventoried; the largest was the2.55MB Family Group Chat poster. All three poster source images were separately opened, visually inspected and matched by Git blob hash to the pinned source.
- Normal-load asset/error review only; no repeated cold-load benchmarks or external-site audit.

## Evidence and limitations
- Native zoom Ctrl-plus attempt left viewport1440x900 and DPR1 unchanged; native 200% zoom is unverified.
- Linux WebKit is not native Safari/iOS. All phone sizes are emulated.
- Original Chrome job stalled on a lazy image in a hidden venue tab and was later cancelled. Its provisional captures/report were unavailable. They are not marked inspected or treated as evidence. Six missing desktop captures were recovered without repeating the whole audit.
- The first capture-recovery script missed helpers and failed before any captures; corrected with the same authorised scope.
- At most eight captures could have preceded the original lazy-image stall; with 30 retained machine captures and two manual live inspections, the routine capture ceiling of40 was respected conservatively.
- No independent agent review used.
-30 retained machine screenshots were actually opened and visually inspected. review-ledger.json maps filenames, states, engines, inner/outer dimensions and observations.
- Original run: https://github.com/rkdb-nz/TabLab/actions/runs/40073858141 — retained Firefox/WebKit ZIPs; Chrome stalled and was not counted as a complete initial run.
- Chrome continuation: https://github.com/rkdb-nz/TabLab/actions/runs/40074255781 — finished the missing Chrome scope after correcting the lazy-image wait helper.
- Six desktop capture recovery: https://github.com/rkdb-nz/TabLab/actions/runs/40074600756 — no duplicate full audit.
- Actions screenshots are retained for90 days; source-control report, machine reports and ledger persist in this branch.
- Existing fixed desktop composition requires internal scrolling for long venue content; the scroll region must become keyboard-accessible. Phone content must reflow instead of being clipped.
- Shared workflow restored to its main-branch version before review. QA/evidence changes only.

## Approved repairs — complete, awaiting publication

Product source: `4d111c4895352b95998e8423b01befa7b83448c4`.
[Reviewed preview](https://9aa5a4ca.foundry-a3k.pages.dev/boardroom/springboard/demos/theatre/).

**Fixes I can make**
- TH-01–TH-10 resolved: phone hire reflow; truthful local enquiry and email composer; range validation, associated errors and first-invalid focus; contrast; menu/poster focus containment and scrolling; keyboard scroll access, seating states and headings; narrow headings/tickets/footer; slideshow pause/resume; location/alt copy; existing poster optimisation.
- D-01 applied: preserve artwork and label productions/seasons as illustrative samples. Quiet Hours and Ashes copy matches printed dates; booking dates omit conflicting weekdays.
- Related findings from repair scans/screenshots resolved: nested complementary landmark, missing heading in hire state, enquiry reset contrast, homepage footer tagline clipping.

**Items needing your attention or input**
- None. Publication awaits the user's next instruction.

Nine engine/viewport landing/navigation combinations passed, reusing Firefox/WebKit checks on unchanged behaviour after small scoped corrections. Chromium checked the five default outer sizes; Firefox/WebKit desktop and portrait. Final form scans at narrow-phone size also passed in all three engines. Four default page scans and the final form/success scans have zero reported violations. All 29 retained repair screenshots were inspected; one additional live preview screenshot was inspected. Three representative originals are retained in `repair-evidence/`; complete captures are in the linked 90-day Actions artifacts.

Hire rejects 999 attendees and focuses the attendance field; 200 proceeds to an explicit no-send/no-reservation result. Required-field focus and reset focus pass. Email composition ends in an explicit no-send result. Poster focus remains contained, landscape menu reaches its last link, narrow tickets fit, reduced motion stays static, and pause/resume was tested through an advancing frame. Existing Family Group Chat artwork re-encoded from 2,554,815 to 269,004 bytes (89.5% smaller) and visually inspected.

Runs:
- [Initial repair sample](https://github.com/rkdb-nz/TabLab/actions/runs/40076484001): Firefox/WebKit passed. Chrome's immediate reduced-motion assertion raced the media event; retained valid results reused.
- [Focused Chrome completion](https://github.com/rkdb-nz/TabLab/actions/runs/40076633827): passed.
- [Phone visual polish](https://github.com/rkdb-nz/TabLab/actions/runs/40076713312): all three engines passed.
- [Final form semantics](https://github.com/rkdb-nz/TabLab/actions/runs/40076848402): all three engines passed, zero form/success scan violations. No duplicate screenshots needed for an invisible heading.

Limits: native 200% browser zoom remains unverified; WebKit on Linux is not native Safari/iOS and phone viewports are emulated. Unchanged wrapper fullscreen/return/gallery evidence is reused from the audit. No independent agent review used. Background, indexing and analytics are unchanged. No real messages, payments or reservations were sent. Production has not been changed.
