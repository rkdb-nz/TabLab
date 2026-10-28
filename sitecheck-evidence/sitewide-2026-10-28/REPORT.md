# Tab Lab sitewide audit — 28 October 2026

**Sitewide routine check complete with findings, within the declared sampled scope.** Eight repair groups are ready for review. All original collection errors were investigated and either recovered or resolved as testing artefacts. This is not release approval.

Scope: Tab Lab and all twelve demos, with every public content document inventoried and a declared representative browser/screen sample. This is an audit, with no website repairs or production publishing.

Source: `7410e040214f7369013a41d47aa3422e4c4bd6e0`, repository `rkdb-nz/TabLab`. Audit scripts/evidence records are isolated on `audit/sitewide-2026-10-28`. Every hosted job verified that `public/` was unchanged against the source commit.

## Fixes I can make

These are eight repair groups, not a count of every repeated scanner instance. No repair is authorised by this report.

| ID | Priority | Confirmed problem and impact | Proposed correction | Evidence |
| --- | --- | --- | --- | --- |
| SW01 | High | Retreat Home white heading crosses bright sky; minimum rendered contrast **1.22:1**, below the 3:1 large-text target. | Strengthen the local text backing/gradient or adjust foreground treatment without changing the approved photograph. | Features run: `.hero h1`, 1440×900, foreground white, worst background RGB(239,233,206), sample (111,191). Screenshot `wrapper-fullscreen-1440x900.png`. |
| SW02 | Medium | Produce phone footer remains 842px wide inside a clipped 390px container when reduced motion disables its ticker. The opening-hours block is partly hidden; the third block is entirely off-screen. Normal mode also has continuous moving information without a visible pause control. | Use a readable static wrap/stack in reduced motion and provide pause/access to all footer information in normal mode. | Focus run: `Produce reduced-motion footer`; `produce-reduced-footer.png`; animation `none`, overflow `hidden`, second block right edge 561.59, third block starts 561.59px. |
| SW03 | Medium | Charity desktop journal footer uses **8.5px** grey text at **4.1:1**, below 4.5:1. | Increase text size for usability and darken the text to meet contrast. | Initial and settled-confirmation axe: `.journal-foot`, #777 on approximately #f6f5f2. Screenshot desktop Charity landing. |
| SW04 | Medium | Tailor’s separate Shop page lacks document language and a main landmark; substantial content sits outside landmarks. | Add `lang="en-NZ"` and a suitable main landmark around collection content. | Initial and settled-confirmation axe: `html-has-lang`, `landmark-one-main`, `region`; `/boardroom/skateboard/demos/tailor/shop/index.html`. |
| SW05 | Medium | Tailor Shop introduction measures **4.41:1**, just below 4.5:1, because of its 0.6 opacity. | Increase the effective text contrast slightly. | Initial and settled-confirmation axe: `p`, effective #72716f on #f7f3ee, 14px. |
| SW06 | Low | Tailor Shop introduction promises “Four looks. Twelve pieces.” but this page displays nine product tiles. | Align the wording with the nine pieces actually shown, or explicitly explain the difference. | Source and full-page Shop capture show nine entries: Overcoat, Blazer, Overshirt, Tux, Trouser, Crew, Shirt, Scarf and Belt. |
| SW07 | Low | Pottery mobile’s Tab Lab return link sits outside the page landmarks. | Place the return control in a suitable navigation landmark while preserving its visible position and behaviour. | Axe `region`, `.tablab-return`; the control remains visible/usable, so this is structural cleanup rather than a broken exit. |
| SW08 | Medium, performance | Main phone landing loads a **1,667,173-byte PNG** background. The local mobile Lighthouse run identifies this as a major image-delivery opportunity. | Produce a visually equivalent smaller image format and verify the approved appearance and loading after replacement. | Lighthouse main landing: `assets/backgrounds/tablab-mobile-portrait.png`. The 64 performance score and simulated 13.2s LCP are diagnostics, not production field timings. |

## Items needing your attention or input

None is required to complete this audit. Product repairs and publication remain separate decisions; nothing in `public/` was changed.

## Coverage and evidence

- Inventory: **56 HTML source files** — 38 content-page sources, 12 demo wrappers, two internal review/preview pages and four shared fragments. Internal previews/fragments were classified rather than represented as public journeys checked.
- Chromium: **97/97 declared page/screen visits**, including the two navigation-timing recoveries. Every content-page source at desktop 1440×900 and portrait 390×844; all twelve wrappers visited. Main landing, Boardroom and Theatre booking also measured at 844×390, 320×568 and 780×300.
- Firefox/WebKit: **52/52** landing visits across desktop and portrait, covering main landing and all twelve demos. Both engines also completed a main navigation interaction and representative isolated Retreat form states.
- Accessibility: **38 initial page/template axe scans**, followed by four targeted confirmation scans. Scanner passes are not a declaration of complete accessibility. Rendered image-backed contrast was measured separately where needed.
- Performance: five Lighthouse runs: main landing, Boardroom, Donut, Pottery responsive route and Retreat Book.
- **82 retained screenshots actually inspected**, including the three initially unstable originals. Those three were replaced by stable captures; 79 retained captures are stable. Targeted native-size crops were also inspected for long Florist/Pottery/Discover pages. See `visual-review.json` for hashes, viewport, state, source and observation.
- Deployment comparison: **137/152 text resources matched byte-for-byte**. All **15** remaining HTML responses match after reversing Cloudflare email obfuscation and removing its inserted email-decode script. No substantive deployment drift was found. Whitespace normalisation is documented in `deployment-normalisation.json`; no image-byte parity claim is made.
- Internal destinations were fetched once per unique destination, retaining titles as well as HTTP status. All **64 unique internal destinations** returned successfully, and no HTTP asset failures were recorded. External, telephone and email destinations were inventoried; real calls/messages/delivery and external-site audits are excluded.

The original collection is [run 40614967756](https://github.com/rkdb-nz/TabLab/actions/runs/40614967756). Its four artifacts are `sitewide-census`, `sitewide-features`, `sitewide-secondary`, `sitewide-lighthouse`. Targeted gap recovery is [run 40621541223](https://github.com/rkdb-nz/TabLab/actions/runs/40621541223), artifact `sitewide-recovery`. Contrast/form ambiguity review is [run 40622086910](https://github.com/rkdb-nz/TabLab/actions/runs/40622086910), artifact `sitewide-focus`. The final finite-control verification is [run 40623084972](https://github.com/rkdb-nz/TabLab/actions/runs/40623084972), artifact `sitewide-nested`. A final collection-only replay, [run 40623627281](https://github.com/rkdb-nz/TabLab/actions/runs/40623627281), artifact `sitewide-collection`, passed all eight checks with no execution errors. It resolved the last test sequencing issue: changing only Pottery’s URL fragment had not reinitialised the active scene; fresh native scene navigation confirmed all three collections and both wrap directions.. Raw artifacts are retained in GitHub for 90 days. This report and its review ledger preserve the decisions and provenance.

## Project-by-project disposition

| Area | What was exercised/reviewed | Disposition |
| --- | --- | --- |
| Tab Lab main + four galleries | Landing/Explore/enquiry, menu including rotation, page text/layout, board previews/links, representative narrow/short sizes, all three engines | Main background optimisation SW08; Noticeboard automated contrast warning resolved separately below |
| Donut | Main layouts, five overlays, local order and Catering empty/completion states, dismissal/focus | Catering/order observations confirm truthful no-send results; native close/focus assertions passed; no additional confirmed defect in sample |
| Mini Golf | Main layouts, Course/Story/Events overlays, invalid/local booking completion | Honest no-send result observed; no additional confirmed defect in sample |
| Drilling | Main layouts, menu and five panels, invalid/local quote completion, keyboard observations | Honest no-send result observed; no additional confirmed defect in sample |
| Charity Walk | Desktop layout, mobile hub views, desktop/mobile note validation/completion, all five Diary entries and previous control | SW03 |
| Diner | Main layouts, ticker pause, ten menu categories, Find Us, nested call/email/directions demonstrations and return route | Nested contact/no-call/no-directions results and return/focus assertions passed; no additional confirmed defect in sample |
| Produce | Main layouts, About/Find panels and demonstration contact actions, reduced-motion footer | SW02 |
| Florist | Long desktop/phone collection layouts, enquiry validation and standalone honest success/return | No additional confirmed defect in sample |
| Pottery | Desktop sections, five mobile scenes normal/reduced, seven making stages, all three collections, five dialogs, maker Pause/Play/Next photo, local enquiry/social demonstrations | SW07 |
| Tailor | Five chapters, all six collection looks and wrap/reverse, native Craft disclosures, both boutique tabs, local visit validation/completion, separate Shop page | SW04–SW06 |
| Dining | All five content pages, four FAQs, desktop/mobile request routes, normal Home reveal and Dine destination | Native desktop/phone reveal and Dine navigation passed; mobile email validation/completion/focus passed; no additional confirmed defect in sample |
| Retreat | All five pages, four galleries with three images each, nine scenes normal/reduced, five invalid variants and five preselection/fragment routes, keyboard/menu/back-to-top, fullscreen/return | SW01 |
| Theatre | All five content pages, venue and production tabs, poster enlargement, sample ticket selection/total/checkout/reset, local hire enquiry | No additional confirmed defect in sample |

## Runner errors resolved rather than counted as site defects

The workflow jobs are evidence collection, not a complete unattended quality decision. This first sitewide campaign needed targeted follow-ups and actual screenshot/semantic review; a single green workflow would not remove that work.

The first collection jobs correctly reported incomplete when a moving ticker prevented stable captures, a responsive redirect destroyed a page context, or generic control selectors chose a hidden/inert duplicate. They did not stop the successful Firefox/WebKit or Lighthouse work. Targeted jobs recovered those gaps without repeating the entire sweep.

- Diner moving captures were replaced after using its visible Pause ticker control. Produce’s infinite decorative animation phase was explicitly held for capture only, and reduced motion was separately tested.
- Pottery dialog controls were reached through their actual scene-navigation controls rather than forced clicks. A desktop request to its mobile source was checked as a responsive route.
- Donut Catering required opening the hamburger menu; Diner nested contact actions required selecting the links inside Find Us, not visually rendered links in its inert background.
- Tailor’s initial enquiry test closed its own dialog after an invalid submit; the corrected helper kept the original dialog open and reached the honest no-send completion.
- Dining’s mobile enquiry contains read-only To/Subject fields; the helper now skips read-only inputs rather than timing out trying to edit them.
- Theatre’s initial venue heading is fully visible. A full-page helper had naturally scrolled an inner content panel while revealing images, which explained the earlier part-scrolled capture.
- Dining’s long desktop document contains a deliberate interaction-driven reveal/spacer; its phone layout has a separate two-scene journey. Empty off-scene regions in a full-page image are not sufficient evidence of a defect. Native navigation checks establish the visible states.
- Tailor’s 1.08:1 oversized floating numeral is explicitly decorative (`aria-hidden="true"`), with a separate readable chapter indicator. It is excluded from the repair list.
- Noticeboard’s reported 1.1:1 contrast was a scanner error: it used the dark underlying HTML background instead of the painted cream background. Glyph-mask sampling of the rendered background measured **12.80:1** for the small heading and **11.66:1** for the large heading. These pass their 4.5:1 and 3:1 targets and are not repair findings.
- Lazy images measured before a natural reveal scroll were not called broken merely because they had not decoded yet. Retained long-page images were inspected after reveal/decode.

A focused second reviewer was used after repeated nested-control preparation failures. That reviewer identified the wrong selectors/prerequisites and supplied the finite-control verification. This was not a duplicate blanket audit.

## Performance context and practical limits

| Local Lighthouse target | Performance | Accessibility | Best practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| Main landing | 64 | 100 | 93 | 100 |
| Boardroom | 98 | 100 | 93 | 100 |
| Donut | 84 | 100 | 96 | 100 |
| Pottery responsive route | 65 | 100 | 96 | 91 |
| Retreat Book | 100 | 100 | 100 | 91 |

Lighthouse used the local read-only snapshot and its mobile simulation. Local uncompressed responses, third-party script loading and the Pottery desktop-to-mobile route affect these scores. Pottery reported a large layout-shift metric (1.004) during the responsive route; it is retained as a diagnostic requiring a production/direct-route comparison, not asserted as a confirmed user-visible defect. Text-compression warnings from the simple local server are not attributed to Cloudflare production.

Form and state interactions were protected by a GET/HEAD-only static server, request routing that blocks mutation/external destinations except fonts, blocked service workers/WebSockets, CSP `form-action 'none'`, and synthetic `audit@example.invalid` data. Lighthouse only loaded pages against the read-only server; it did not exercise submissions. No real booking, enquiry, call or payment was made.

The native zoom keyboard shortcut was attempted, but headless Chromium did not change viewport/device-pixel measurements. This is a declared platform limit, not a zoom pass. The narrow-width sample provides reflow observations but does not substitute for actual browser zoom or screen-reader testing.

This completes the review of the declared available sample. It does not certify every physical phone, real Safari/iOS, every scroll/hover/time state, all photo-backed contrast, screen readers, email delivery, backend services, full WCAG compliance or every pixel. Some long screenshots were reviewed as layout overviews, with targeted native-size crops and extracted/source text for detail. The visual ledger records actual inspection; captured does not mean reviewed.
