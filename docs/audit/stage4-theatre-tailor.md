# Stage 4 Theatre and Tailor repair record

Changes prepared on `repair/tab-lab-stage4`; source baseline `cf5fcbc24a14a2c85d140abc493d99e4036e86cb`. No external submissions, publication or commits by this repair agent.

| Finding | Repair | Verification |
|---|---|---|
| P06 | Theatre navigation panel scrolls vertically; links cannot flex-shrink below their content height. | Source cascade checked; rendered short-height verification delegated to Principal. |
| S3-K03 | Poster dialog makes sibling background branches inert, traps Tab/Shift+Tab at its sole Close control, restores original inert/overflow states and opening trigger. Applies to Now Playing and Coming Soon. | JavaScript syntax passed; rendered keyboard/background verification pending Principal. |
| S3-C01 | Lower Now Playing non-primary CTA uses existing dark `#2a241d` palette on existing `#EFEBE6` background; primary CTA preserved. | Selector scope checked; exact rendered contrast pending Principal. |
| S3-F01 | Optional attendance explicitly checked against native 1–200 integer constraints despite form `novalidate`; accessible error and first-invalid focus added. | Isolated execution of actual handler accepts blank/1/200 and rejects 0/201/1.5. No delivery performed. |
| S3-H01 | All chapter hashes initialize/reveal correct chapter; navigation writes history and handles hash/history return. Desktop resets unintended native horizontal scroll before applying its existing animated transform. Mobile retains native scroll and updates hash on swipe. Resize resets the appropriate coordinate system. | Actual script executed in DOM mocks at widths 1363 and 740: direct Details, Atelier navigation/history, Boutiques hash change, inactive state, desktop scroll reset and mobile initial offset passed. This is state verification, not visual certification. |
| S3-K04 | Inactive chapters inert and aria-hidden; mobile scroll activation and desktop settled animation restore active chapter. | Actual updateUI state checks passed at both mocked widths; natural keyboard verification pending Principal. |
| S24 | Tailor shop declares English document language. | Source verified. |
| S2-N02 | Hire compression selectors now address `#formWrap`, the actual form parent, rather than unrelated `#hire` informational section. | DOM source ancestry and selector targets checked. |
| S2-CSS01 | Responsive Hire grid receives matching selector specificity at <=980px so desktop three-column rule cannot override intended one-column layout. | Cascade checked; rendered mobile Hire regression pending Principal. |

JavaScript `node --check` passed for Tailor app.js and Theatre main.js/venue-form.js. Scoped `git diff --check` passed. No designs, approved backgrounds, typography, header proportions or ticket pricing changed.

Deferred content/design choices remain S05, S27, C08 and S03. Browser/physical-device claims require separate rendered evidence. Repair status is implemented; Principal independent verification must decide final verified disposition and commit references.
