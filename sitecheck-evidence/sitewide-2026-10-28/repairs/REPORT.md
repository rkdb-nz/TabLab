# Tab Lab sitewide repair verification — 28 October 2026

**Targeted routine repair check complete within the sampled scope. SW01–SW08 resolved on the repair branch. Production unchanged; publication awaits Robert's approval.**

Baseline website: `7410e040214f7369013a41d47aa3422e4c4bd6e0`. Product repairs tested at `050482bd7cbee74993414f8a54ffbea3c705ded6`. Follow-ups `a12e546e2d67b6cf0961425bd8d653d6edb42c3c` and `28e98d1d28b9744572b3a12bb1b94b10e4222359` change only test infrastructure; their website tree is unchanged. The parent sitewide audit and its 82-image review ledger remain preserved, and provide unchanged-page evidence rather than being claimed as freshly rerun.

Preview: https://9cb67c81.foundry-a3k.pages.dev/

## Fixes I can make

All approved repairs are now implemented and verified; none remains pending.

| ID | Result | Verification |
| --- | --- | --- |
| SW01 | Resolved: stronger local image backing on Retreat Home, approved photograph retained | Rendered heading minimum 7.85:1 desktop, 12.65:1 portrait, 13.88:1 adjacent-copy landscape; target 3:1. Paragraph minima 15.18:1, 14.78:1, 13.88:1; target 4.5:1. Three screenshots reviewed. |
| SW02 | Resolved: static three-column Produce footer, with wrapping and board clearance | All three messages and supporting lines fit at five sizes in normal and reduced motion; 20 layout assertions pass. Portrait, landscape and narrow reduced-motion screenshots reviewed. |
| SW03 | Resolved: Charity journal footer 11px and #595959 | Desktop axe scan zero violations; larger footer fits under five entries in reviewed screenshot. |
| SW04 | Resolved: Tailor Shop en-NZ language and main landmark | Desktop and portrait axe scans zero violations; one main element contains collection content. |
| SW05 | Resolved: Tailor Shop introduction opacity .75 | Both targeted axe scans pass contrast. Native top crops inspected, alongside full layout overviews. |
| SW06 | Resolved: “Nine considered pieces” | DOM asserts nine tiles and matching text at desktop and portrait; all nine tiles visible in reviewed full-page captures. |
| SW07 | Resolved: named navigation around Pottery return control | Portrait axe scan zero violations; return control remains visible with original href and position. |
| SW08 | Resolved: lossless portrait WebP and CSS references | 1,667,173 → 1,212,976 bytes (27.24% smaller); decoded pixel comparison zero differences. Initial WebP background and unchanged monitor-free Explore treatment verified in Chromium, Firefox and WebKit; each asset fetch returns 200 with the expected byte count. |

No new product findings were confirmed in this targeted sample.

## Items needing your attention or input

- Approve production publication when ready. No further checking input or visual inspection from Robert is required.

## Verification and evidence

Primary run: https://github.com/rkdb-nz/TabLab/actions/runs/40628173180 — artifact `sitewide-repair-retest`.
Image-only diagnostic follow-up: https://github.com/rkdb-nz/TabLab/actions/runs/40628540770 — artifact `sitewide-repair-imageverify`.
Final image-only verification: https://github.com/rkdb-nz/TabLab/actions/runs/40628918378 — artifact `sitewide-repair-imageverify`.
Image preparation: https://github.com/rkdb-nz/TabLab/actions/runs/40627976904 — artifact `sitewide-repair-image`.
Artifacts retained 90 days. Compact review/evidence summaries are committed beside this report. The one-off repair workflow currently runs only the final image verification; it is not a new full-site audit trigger.

- Nine landing/navigation combinations: Chromium 1440×900, 390×844, 844×390, 320×568, 780×300; Firefox and Linux WebKit each 1440×900 and 390×844. Every destination panel appeared and document overflow checks passed.
- Four targeted axe scans: Charity desktop, Shop desktop/portrait, Pottery portrait. Zero violations in those scans.
- Six rendered contrast measurements: Retreat heading and paragraph at desktop, portrait and landscape. All pass. The inherited sampler's raw `viewport` label is hard-coded as 1440×900; actual execution sizes come from the ordered repair loop, screenshot dimensions and this report. Raw results are retained unaltered, with corrected dimensions in the compact summary.
- Produce tested at the five Chromium sizes in both motion settings; all footer containment and board-clearance assertions pass. The changed footer is static, so it remains accessible without a pause control.
- Three isolated representative Retreat forms: empty submit reports the missing name/email; valid synthetic completion explicitly says no enquiry was sent and no stay booked, in all three engines. Six state observations reviewed.
- Fourteen retained screenshots, all stable and actually inspected. Shop full pages were reviewed as layout overviews; native top crops verify the changed introduction. `visual-review.json` records files, hashes, actual sizes and observations.
- No recorded unexpected JavaScript errors or HTTP asset failures in the repair run.
- Deployed preview independently opened: Retreat heading visually inspected; Book link navigated correctly. Shop revised wording/collection structure and preview main landing verified.

## Test correction, preserved transparently

The first repair run completed with no execution errors and 53/56 assertions passing. Its three failed assertions inspected the landing's base background *after* Explore opened, when the existing design intentionally uses a landscape base. An image-only follow-up confirmed the initial WebP and expected asset bytes in all three engines, but incorrectly expected a portrait pseudo-element after Explore. Source review found the explicit existing rule at tablab-mobile.css:331–337: “Explore's mobile content does not need the decorative monitor overlay”, followed by display:none and background:none. These six failures across two attempts were incorrect test expectations, not product defects. The standing two-attempt rule triggered a focused independent source reviewer. The final small replay checks initial WebP, unchanged landscape/hidden-overlay Explore treatment and delivered asset bytes in all three engines. All nine image assertions pass; no successful page/feature suite was repeated.

The original collection runner exits on execution errors and retains failed assertion records for review. A green Actions job alone is not a product pass; this report is based on the records and actual visual review.

A focused independent source reviewer was used after the two incorrect image-layer test assumptions. The original campaign's independent nested-control review also remains part of the baseline evidence.

## Limits

This is a targeted repair rerun, not another whole-site crawl or full WCAG certification. Physical phones, actual Safari/iOS, assistive-technology sessions, live delivery/backends and production field performance remain outside the sample. The baseline native-zoom platform limitation remains. No new Lighthouse score is claimed; lossless optimisation proves fewer bytes and identical pixels, not a guaranteed real-user loading time. Existing imagery, branding, analytics and metadata policies were retained. No production merge or real form delivery occurred.
