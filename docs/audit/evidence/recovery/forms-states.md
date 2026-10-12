# Stage 3 independent form/state residual evidence

Audit observation: 2026-10-12. Separate Sub-Auditor `forms_states`; own cloud Chrome/CDP tab 5. Preview origin https://b94ffb34.foundry-a3k.pages.dev/. Browser exact version unavailable; screenshot 1348×926 observed, not a controlled alternate viewport. Preview commit association retained from handoff; deployed bytes unhashed.

Read current uploaded handoff/register. Local checkout HEAD initially 68f0b9d20d84dc8c7ca56d521aa36c64f8dc9f54. The inspected form sources have no differences against baseline cf5fcbc24a14a2c85d140abc493d99e4036e86cb. Inspected local-only handlers before activating confirmation. No external submission, payment or email activation.

## Theatre ticket summary

Route `/boardroom/springboard/demos/theatre/book-tickets` (redirect from .html).

- Fresh: all quantities zero, no performance/zone, checkout disabled.
- Select Tue 6 Nov, Centre, Adult twice, Concession once, Under25 once. Summary displays 4 tickets A:2 C:1 U25:1 and $148; independent arithmetic 2×42+36+28=$148.
- Activate checkout. Source `public/boardroom/springboard/demos/theatre/assets/js/booking.js:88–117` only constructs local confirmation and focus; no payment. Confirmation shows Adult x2 $84, Concession x1 $36, Under25 x1 $28, total $148.
- Focus starts `bookingConfirm`; Tab reaches Return to Booking; second Tab reaches footer email while confirmation remains expanded. This is observed traversal, not automatically a modal violation: source confirmation is an inline container, without dialog semantics. Principal should judge intended behavior before classifying.
- Escape closes confirmation and focuses checkout. Reset clears selected date/zone and all quantities, total $0, checkout disabled. This tested combination passes arithmetic and reset; not exhaustive combinations.

## Dining local confirmation

Route `/boardroom/springboard/demos/dining/sign`.

Source `public/boardroom/springboard/demos/dining/sign.html:35–42` prevents default and opens CSS confirmation; name is required, date optional, no remote handler. Enter fictitious `Audit test`, leave date blank/default 2 guests/7:00 pm, activate Request Table.

- Visible settled screenshot displays Thank you / table request received / Close. Focus remains Request Table (AX43); no focus transfer into confirmation.
- Tab sequences eventually reach logo, then Dine behind still-visible overlay. Escape does not close dialog. Dialog is explicitly `role=dialog aria-modal=true` (`:48`); missing containment/focus transfer reproduces existing P05 scope, not a new duplicate.
- Close click hides overlay, focus was Close; return to submit not implemented in inline close handler `:53`. No delivery proven. Blank optional date acceptance is not itself a defect.

## Retreat local confirmation

Route `/boardroom/springboard/demos/retreat/book`.

Source `public/boardroom/springboard/demos/retreat/book.html:49–63` prevents default, opens local confirmation, focuses OK. Enter fictitious `Audit test` and `audit@example.invalid`, leave optional fields blank/default guests2, activate Send Enquiry.

- Confirmation opens; focus OK. Tab immediately reaches background footer `mailto:Clementines.rkdb.nz` while dialog remains open. No email link activated.
- Escape leaves dialog open. Click OK then Tab: confirmation disappears after animation; focus reaches footer email instead of returning Send Enquiry.
- Explicit modal `aria-modal=true` at `:30`; containment and focus return fail. Extend existing P05/focus-return findings; Principal must reproduce before adoption. The malformed email remains existing S02.

## Scope and gaps

This completes the above residual sequences only. Prior 50/50 observation and form-cycle claims remain attributed to prior handoff. Full navigation/header consumer sweeps, complete ticket combination set, maximum quantity combinations, date segmented interactions and intermediate Dining menu artwork were not rerun here. They require reconciliation with other current agents/Principal evidence; do not infer closure from this register.

No claims on physical devices, alternate viewport, zoom, reduced motion, actual font loading, complete resource/console capture, native fullscreen or server delivery. These remain stated environment gaps or intentionally excluded external actions.

## Follow-up: ten content-route header journeys and optional inputs

Own tab6, same origin, keyboard Return activating freshly observed AX header links. This is one full cyclic header journey through each family, not an exhaustive all-to-all link permutation.

| Source page | Activated header | Verified destination/content |
|---|---|---|
| Dining site | Natural Tab→logo→Dine, Return | `/dining/dine`, Choose wisely; Entrée/Main/Side/Dessert menu and Meet Clementine |
| Dining dine | Wine, Return | `/dining/wine`, The Cellar and archive Champagne/Pinot/White/Syrah/Rosé/Cocktails/Clementine's Pour |
| Dining wine | Sign, Return | `/dining/sign`, Join us, contact details, FAQ and booking fields |
| Dining sign | Reviews, Return | `/dining/reviews`, Good evenings; five testimonials |
| Dining reviews | logo, Return | `/dining/site`, twilight hero, Dine/Wine/Sign cards; browser Back returned Reviews |
| Retreat site | Retreats, Return | `/retreat/retreats?v=retreat-landscape-header-1`, four houses and inclusions |
| Retreat retreats | Discover, Return | `/retreat/discover?v=retreat-landscape-header-1`, eight scenes; existing missing hero still source-backed, AX image alone not load proof |
| Retreat discover | Reviews, Return | `/retreat/reviews?v=retreat-landscape-header-1`, eight testimonials, Hannah and Will alt/Hannah & Jewel text mismatch retained |
| Retreat reviews | Book, Return | `/retreat/book?v=retreat-landscape-header-1`, book fields and location text |
| Retreat book | Home, Return | `/retreat/site?v=retreat-landscape-header-1`, collection hero/cards; browser Back returned Book preserving optional values |

Dining Dine lower-page settled screenshot inspected Meet Clementine image/text and bottom menu portions. Two one-page scrolls both landed near bottom, so they do not certify every intermediate menu pixel; AX enumerated all menu items and no additional menu controls. Header navigation passed exact journeys, focus ink was not measured here.

Retreat optional form: choose Undecided, dates `Flexible next month`, guests6, fictitious name/email/message. Local confirmation opens and focuses OK. Close→Home→Back preserves those values. This establishes optional populated flow alongside earlier blankoptional flow; no server delivery.

Dining optional form: name `Audit date test`, choose6guests, set date2026-12-04. AX reports all values. With month segment focused, Up changes date to2026-01-04 (month wraps December→January). Submit opens local Thank you. This verifies a native date-segment interaction, populated date/party flow, and acceptance of a past date; date validity policy is not stated, so no new severity assigned without product decision. Earlier blank-date/defaultparty flow retained.

This follow-up closes the assigned cyclic header and safe populatedoptional/date residuals. Comprehensive visual contrast, every focused border and all-to-all history permutations are not inferred from it.
