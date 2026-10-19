# Conditional site checklist

Create one record per ID below, then add records for site-specific features. A row is Passed only after all its applicable subchecks have evidence. Use Not present only for absent features, not failed tests. Use Couldn't test for inaccessible, unsafe or unfinished checks. Preserve exact gaps even when other checks pass.

| ID | Applicability and checks |
|---|---|
| scope | Always: reconcile source routes, rendered navigation, buttons, sections, dialogs and states; record version and boundaries. |
| copy | Always: spelling (NZ/British for Tab Lab), punctuation, missing/duplicate/truncated text, placeholders, image lettering, contact details, meaningful labels and page titles. |
| layout | Always: desktop, portrait and landscape; balanced headlines/photos; intentional spacing, no unexplained empty blocks; readable body text; wrapping, image crop/aspect, alignment, overlap, scrolling and sticky elements. Review all content, not just first viewport. A 12px automated threshold is a warning floor, not comfortable body-text approval; aim around 16px for ordinary body copy and judge actual readability. |
| media | If images/video/audio exist: all load; appropriate alternative text or decorative handling; controls, captions where needed, poster/fallback, no unintended autoplay; no distortion, pixelation or cut-off meaningful image lettering. |
| links | Always: every distinct navigation/footer/button/anchor destination; correct site identity; successful intended destination; back/forward, direct URLs, refresh, new-tab links, downloads, email/phone syntax. No empty or stale links. Record external-service limits. |
| branding | Always: correct logo/name/favicon/title; no leftover client/template identity; Tab Lab public destinations use intended .rkdb.nz addresses. Preview hosting is recorded separately. |
| wrapper | If demo wrapper exists: open full screen, visible usable Tab Lab return tab, exit restores frame, gallery returns correctly; test at every browser/size, including short landscape. |
| demo | If demonstration site: clear demo purposes only notice; honest non-sending confirmations; no accidental live order, booking, message or payment. |
| accessibility | Always: keyboard-only navigation, visible focus, logical order, no traps, accessible names/labels, heading structure, landmarks, alternative text, text/background contrast, 200% text/zoom and narrow reflow, touch targets, reduced motion. Run an automated accessibility scan if available and manually check what it cannot judge. Do not claim formal certification. |
| responsive | Always: initial loads at all standard sizes; resize portrait-to-landscape and back with menu/dialog open; navigation stays reachable; no horizontal overflow; sticky bars do not cover content; short-height/browser-bar space; record actual-device/virtual-keyboard/safe-area limits. |
| forms | If forms exist: labels, required and invalid input, field types, autocomplete, keyboard, helpful errors, retained input, double-submit prevention, loading/failure/success, privacy wording and correct recipient. Use test/mocked backend; separately record whether real delivery was verified. |
| commerce | If cart/order/payment exists: item/options/quantity, add/remove/update, totals/tax/shipping/currency, empty states, stock, invalid quantities, checkout errors/cancel/success. Use approved sandbox payment only; no real charge. |
| booking | If booking exists: date/time/timezone, unavailable/past dates, party size, validation, confirmation/cancel/change, capacity and duplicate booking behavior in a test environment. |
| discovery | If search/filter/sort exists: matching/no-result/empty states, reset, combinations, order, paging, persistence and keyboard operation. |
| menus | If menus/dialogs/accordions/tabs exist: open/close, outside click and Escape where appropriate, focus entry/return, background scroll, nested states, all content reachable, no off-screen controls. |
| galleries | If carousel/gallery exists: every item, next/previous, bounds/wrapping, swipe/keyboard, pagination, modal close, captions, loading and motion preferences. |
| accounts | If account/auth exists: test login/logout, validation/errors, session expiration and protected routes with approved test account; password reset only in test system. Never assert security from a UI check. |
| services | If map/social/embed/download/third-party widget exists: load, intended destination/content, fallback/error, consent and small-screen usability. No contact with people without explicit authorization. |
| reliability | Always: separate JavaScript exceptions, failed first-party assets, failed external assets, expected blocked requests and console warnings; reload/direct entry; useful 404/error states; no broken-image icons or endless loading. |
| performance | Always: repeat cold loads on a documented slowed connection; note content/image loading and layout movement, oversized assets and blocked interaction. Record measurements and conditions; do not present one lab result as real-user performance. |
| metadata | Always for public sites: title/description, favicon, intended canonical URL, social preview basics, robots/indexing intent and sitemap if present. Preview/demo indexing rules can differ; check project intent. |
| privacy | If tracking/storage/consent exists: identify network destinations, cookies/storage and consent behavior, visible privacy links; flag obvious exposure or mixed content. Legal compliance and security penetration testing are outside this UI audit. |
| review | Always: every required capture inspected by lead; independent coverage recorded; all checklist rows resolved with evidence or an explicit Couldn't test reason. |

# Report format

Use four status words exactly: Passed / Needs fixing / Not present / Couldn't test. Start with 'Audit complete with findings', 'Site passes the scoped checks', or 'Audit incomplete' as justified. Include exact untested boundaries even when they are accepted limitations, such as physical iPhones or real email delivery. Each finding needs severity, location, browser/size, reproduction, expected vs actual and evidence. Recommend a concrete correction; do not publish it automatically.
