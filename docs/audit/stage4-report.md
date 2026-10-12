# Tab Lab Stage4 repair and stabilisation report

13 October 2026, Pacific/Auckland. **Authorised straightforward repairs are complete; significant decisions remain deferred.** The preview is ready for practical user testing. This report does not certify the original audit as complete, every mobile device, or production publication.

Repository: `rkdb-nz/TabLab`. Default branch `main` remains at `cf5fcbc24a14a2c85d140abc493d99e4036e86cb`. Repair branch: **`repair/tab-lab-stage4`**. The Stage 3 archive and its 30-file manifest were validated, including the recovered Stage 1 and 2 documents. Completed investigations were reused.

Final tested source commit: **`25b7f949ecd6580af72219501b954cc3b8f2fefa`**. Working immutable preview: **https://97f031ed.foundry-a3k.pages.dev/**. The final documentation commit is supplied in the delivery and archive manifest; a commit cannot contain its own hash.

## Repair delivery and checkpoints

Local repair checkpoints:

- `7b81fc6`: shared navigation, gallery readability and Boardroom text fitting.
- `78646a8`: demo validation, focus and responsive repairs.
- `3ce1bdf`: Dining and Retreat navigation, dialogs and imagery.
- `91e0a7e`: Theatre and Tailor controls, layout and chapter state.
- `60cd1d4`: separate, scoped gallery contrast stylesheet.
- `8860d02`: extensionless deployed paths and focus follow-up.
- `efad087`: accurate alternative text for existing images.
- `15403bb`: current guidance distinguished from historical notes.
- `344b089`: immediate Dining dialog visibility and preservation of approved target sizes.

Shell Git push lacked write credentials. The connected GitHub service delivered matching source to the dedicated repair branch in commits `50c1a32`, `19f34cf` and `25b7f94`. Local `public`, README and notes match the fetched remote source byte for byte. Local checkpoint and remote API hashes differ; both histories are preserved in the archive. The local checkpoint hashes should not be assumed to exist remotely.

No merge into `main`, asset deletion or relocation, or production publication occurred. Cloudflare reported preview deployment success for each source commit. Direct binary downloads returned HTTP 403, so deployed bytes could not be independently hashed.

## Every recoverable finding and disposition

**Fixed** means implemented. **Verified** means the cited source or runtime check passed within its stated scope. **Unverified** means evidence is insufficient. **Deferred** means a decision or capability prevents completion. **Not applicable** marks aliases or rejected claims. No previously resolved items were found in the unchanged baseline, and no finding was silently removed. There are 34 repaired finding IDs; aliases are counted separately as not applicable.

|ID|Severity|Disposition|Evidence/remaining scope|
|---|---|---|---|
| S01 | Medium | Fixed | Verified image runtime; local checkpoint 3ce1bdf; included in remote source25b7f94. |
| S02 | Medium | Deferred | Deferred decision: malformed fictional Retreat recipient; ask intended address, do not invent mailbox. |
| S03 | Medium | Deferred | Deferred content decision: simulated form/payment success disclosure across demos; no backend or payments authorised. |
| S04 | Medium | Fixed | Verified invalid rejection and separate local success; local checkpoint 78646a8; included in remote source25b7f94. |
| S05 | Medium | Fixed | Verified source descriptions; no visual change; local checkpoint efad087; included in remote source25b7f94. |
| S06 | Medium | Fixed | Verified fresh-entry fallback; history variants bounded; local checkpoint 7b81fc6; included in remote source25b7f94. |
| S07 | Medium | Fixed | Verified Principal and independent reviewer; local checkpoint 7b81fc6; included in remote source25b7f94. |
| S08 | Medium | Deferred | Confirmed Start old header; use approved shared current header if exact existing integration suffices, otherwise approval for visual change. |
| S09 | Low | Deferred | Deferred maintenance appearance intent; not proved unwanted branding. |
| S10 | Low | Fixed | Verified current README and historical labels; local checkpoint 7b81fc6/15403bb; included in remote source25b7f94. |
| S11 | Low | Fixed | Verified source and rendered success; local checkpoint 78646a8; included in remote source25b7f94. |
| S12 | Low | Unverified | Unverified Diner suspected email typo; confirm recipient before changing. No repair assumed. |
| S13 | Low | Fixed | Verified Ctrl-click; download not exercised; local checkpoint 7b81fc6; included in remote source25b7f94. |
| S14 | Low | Deferred | Deferred metadata content/canonical/share-art decision; absence not broken-preview proof. |
| S15 | — | Unverified | Unverified broader reduced-motion concern; do not duplicate stronger S19. No repair assumed. |
| S16 | High | Fixed | Verified portrait/landscape navigation sample; local checkpoint 3ce1bdf/8860d02; included in remote source25b7f94. |
| S17 | Medium | Fixed | Verified native keyboard selector; physical touch U; local checkpoint 3ce1bdf; included in remote source25b7f94. |
| S18 | Medium | Fixed | Verified accessible names and FAQ keyboard sample; local checkpoint 3ce1bdf; included in remote source25b7f94. |
| S19 | Medium | Fixed | Source verified; reduced-motion runtime unverified; local checkpoint 78646a8/3ce1bdf; included in remote source25b7f94. |
| S20 | Medium | Deferred | Deferred approved mobile/desktop product promise wording; no unrequested copy redesign. |
| S21 | Medium | Fixed | Verified desktop text fit and scroll reachability; local checkpoint 7b81fc6; included in remote source25b7f94. |
| S22 | Low | Deferred | Deferred fictional review names; align alt only after intent established. |
| S23 | Low | Fixed | Verified extensionless current-page marker; local checkpoint 3ce1bdf/8860d02; included in remote source25b7f94. |
| S24 | Low | Fixed | Verified lang source; local checkpoint 91e0a7e; included in remote source25b7f94. |
| S25 | — | Not applicable separately | Not applicable as separate defect: alias P02. |
| S26 | Low | Deferred | Deferred Drilling/golf fictional brand/preview mismatch decision; baked image text cannot be masked. |
| S27 | Low | Deferred | Deferred Theatre locality/schedule convention; corrected Stage2 evidence says poster3 has no baked date and poster2 April alone not conflict. |
| S28 | Medium | Fixed | ARIA/state source and sampled runtime verified; target-size U; local checkpoint 78646a8/3ce1bdf; included in remote source25b7f94. |
| P01 | Medium | Deferred | Confirmed old desktop Boardroom anvil; replacement artwork/layout decision unless approved replacement established exactly. Retain original. |
| P02 | High | Fixed | Verified Principal and separate agent two orientations; local checkpoint 78646a8; included in remote source25b7f94. |
| P03 | Low | Fixed | Verified accurate existing-image descriptions; local checkpoint efad087; included in remote source25b7f94. |
| P04 | Medium | Fixed | Verified scoped foregrounds and opaque ratios; image-backed U; local checkpoint 78646a8/3ce1bdf/60cd1d4; included in remote source25b7f94. |
| P05 | Medium | Fixed | Verified final Dining and separate Retreat modal workflows; local checkpoint 3ce1bdf/344b089; included in remote source25b7f94. |
| P06 | Medium | Fixed | Verified focused last link fully visible in scroll panel; local checkpoint 91e0a7e; included in remote source25b7f94. |
| P07 | Low | Deferred | Deferred fictional Pottery identity / Dining and Donut locality artwork mismatch. |
| C01 | Low | Deferred | Source fact, runtime unverified opacity transition preference; deferred motion intent, distinct from S19. |
| C04 | Medium | Fixed | Source corruption removed; previously discarded palette retained inactive; local checkpoint 78646a8; included in remote source25b7f94. |
| C05/C06 | — | Not applicable separately | Not applicable separately: motion aliases incorporated in S19. |
| C07 | — | Unverified | Unverified wide-short gallery clipping risk; test before repair, no speculative override. No repair assumed. |
| C08 | Low | Deferred | Deferred Tailor shop twelve-versus-nine collection copy decision; no invented checkout defect. |
| S2-FONT01 | Medium | Deferred | Deferred font permission/provenance gap; no infringement finding or replacement authorisation. |
| S2-A01 | Medium | Unverified | Unverified visible Care legacy crop; actual asset selection verified, approved desktop header preserved. No replacement based on filename. No repair assumed. |
| S2-CSS01 | Medium | Fixed | Verified single-column Hire in both orientations; local checkpoint 91e0a7e; included in remote source25b7f94. |
| S2-CSS02 | Low | Fixed | Verified intended token source; downloaded font U; local checkpoint 3ce1bdf; included in remote source25b7f94. |
| S2-N01 | Low | Deferred | Deferred Dining text-confirmation promise without phone/email; part of S03 disclosure decision, no new feature. |
| S2-N02 | Low | Fixed | Verified actual form selector and responsive layout; local checkpoint 91e0a7e; included in remote source25b7f94. |
| S3-K01 | Medium | Fixed | Rendered by repair agent; Principal source review, not all consumer repeats; local checkpoint 78646a8; included in remote source25b7f94. |
| S3-K02 | Medium | Fixed | Separate runtime first/middle/last controls; Principal source review; local checkpoint 3ce1bdf; included in remote source25b7f94. |
| S3-K03 | Medium | Fixed | Verified Principal and independent reviewer NowPlaying; local checkpoint 91e0a7e; included in remote source25b7f94. |
| S3-K04 | Medium | Fixed | Verified direct/settled inactive chapters; permutations bounded; local checkpoint 91e0a7e; included in remote source25b7f94. |
| S3-K05 | Medium | Fixed | Verified Principal and separate agent nested return; local checkpoint 78646a8; included in remote source25b7f94. |
| S3-L01 | Medium | Fixed | Rendered strip228/228width by agent; Principal source review; local checkpoint 78646a8; included in remote source25b7f94. |
| S3-L02 | — | Unverified | Unverified lost30821379 summary only; do not implement or count as confirmed. No repair assumed. |
| S3-F01 | Medium | Fixed | Verified runtime201 rejection/200 local success and mock boundaries; local checkpoint 91e0a7e; included in remote source25b7f94. |
| S3-H01 | Medium | Fixed | Verified Principal direct hash and independent Arrow/Craft recovery; local checkpoint 91e0a7e; included in remote source25b7f94. |
| S3-C01 | Medium | Fixed | Verified computed opaque CTA pair; local checkpoint 91e0a7e; included in remote source25b7f94. |

## Remaining decisions and severity

- **P01 / S08, Medium:** the desktop Boardroom still uses old anvil artwork, and Start retains its earlier header. Their status as unwanted remnants is confirmed. The exact replacement artwork and Start integration require approval before a significant visual change. Originals remain in place.
- **S02 / S03 / S2-N01, Medium or Low:** confirm the fictional Retreat recipient and truthful wording for local demo confirmations, ticket checkout and text confirmation. No delivery backend or payment feature was added.
- **S20 / S22 / S26 / S27 / P07 / C08, Low or Medium:** confirm product promises, fictional names, locality spelling, poster conventions and the nine-versus-twelve collection description. Baked image text was neither masked nor altered.
- **S09 / S14, Low:** confirm the maintenance appearance and intended canonical/social metadata. Their absence or variation is not automatically a broken implementation.
- **S2-FONT01, Medium:** font permission and provenance remain unresolved. This is not an infringement finding, and fonts were not replaced.
- **S12 / S15 / C07 / S2-A01 / S3-L02:** concerns remain unverified. They were not automatically repaired as defects.

No critical production outage was established. Deferred branding and content items mean not every issue is resolved; the functional repairs are ready for testing.

## Regression results

The Principal independently reproduced material results: Dining menu, dialog, time and FAQ; shared drawer and direct Back; Ctrl-click; Pottery overflow; Theatre menu, Hire grid, attendance validation, ticket arithmetic, poster dialog and CTA contrast; restored Retreat hero; Boardroom text fit and scrolling; Florist invalid email; Tailor direct-hash rendering and inactive chapters; and Donut nested focus return.

A separate reviewer independently checked the drawer, Tailor Arrow/Craft recovery, Theatre poster and Boardroom scrolling. Repair agents additionally exercised Diner, Produce and Drilling closed focus, Retreat lightbox and confirmation, and Charity’s editing strip. Detailed evidence is in `stage4-principal-verification.md`, `stage4-independent-verification.md`, `stage4-demos-rendered.md` and `stage4-spring-rendered.md`.

All 22 JavaScript syntax checks and whitespace checks passed. Theatre ticket prices and booking logic were unchanged; two adult, one concession and one under-25 ticket still total $148. No payment was made.

The Principal checked twelve demo defaults in both supported orientations: 24 of 24 initial root measurements had equal client and scroll width. Pottery’s three cards fit inside the portrait content width. Theatre’s last focused menu link scrolls fully into view. Dining’s four landscape menu links fit. Boardroom descriptions end 23 pixels inside their cards, and the last card is reachable by scrolling.

Dining entry focus failed on two intermediate previews. Its CSS visibility transition was diagnosed and corrected. Both Principal and separate agent then verified immediate Close focus, Tab containment, Escape and return on the final source preview. Loading captures were excluded from settled conclusions.

These results cover meaningful repair regressions, not every route/state combination or full WCAG conformance.

## Mobile and environment limits

The existing QA host provides 360×740 portrait and 740×360 landscape frames. Nested demo windows measure 352×659 or 732×308; scrollbars reduce some client widths to 337 or 717. Desktop testing used cloud Chrome/CDP at 1363×936; its exact version was unavailable.

This establishes responsive behavior at those dimensions, not physical-phone certification. Additional representative iPhone, Samsung Galaxy—including A16—and Pixel sizes, breakpoint sweeps and alternative browser engines remain unverified because the available controls could not set them. No product features were added to manufacture test coverage.

Physical touch, keyboards, browser bars, safe areas, zoom, reduced-motion preference execution, actual font loading, comprehensive console/network capture, native fullscreen and external delivery remain unverified. S19’s preference repair is verified in source only. Screen-reader behavior beyond the tested keyboard workflow is also unverified.

## Legacy and structure

All 39 legacy candidates remain in place. **Review date: 11 April 2027.** This is reassessment, not automatic deletion. The canonical register’s earlier 8 April date was corrected to the user’s required date. The 23 apparently unused candidates are not proven safe to remove. Active and conditional assets still require future dependency and cascade checks.

Approved header masters and all assets were preserved. S01 uses an existing asset at its correct path. Stage 1 established no separate critical structural defect. Current README guidance was corrected, and older Foundry notes were labelled as history rather than erased.

## Handoff

The authorised straightforward repair pass stops here. Test the preview practically next. Deferred visual and content decisions require approval before implementation. Targeted corrections and production publication are later phases. The archive preserves source, documentation and both Git histories. Unrelated projects were not touched.
