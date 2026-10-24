# Donut approved repair check — 25 October 2026 NZ

Routine targeted rerun passed within the sampled scope. DN-01–07 resolved. No remaining approved repairs or new unresolved product findings. Preview only; publishing requires approval.

Repository rkdb-nz/TabLab. Main baseline98d7c8f54b52a73b3b1e790e4c85059eb1321073. Product checked at c0c7e9fcb51f31571dd051a6a6f1db913c26b1b6; later94102ea46131fc4a8e634f6579f47b215cc80816 changes QA settling only. PR#83. Reviewed deployed preview https://f456f00f.foundry-a3k.pages.dev/boardroom/billboard/demos/donut/ . Final documentation/workflow-restoration commit changes no product files.

## Fixes I can make

- DN-01 resolved: Order Now retains the realistic selection/form process and finishes with an announced, focused result stating no request was sent, no order placed and no reply will follow. Native required-field and invalid-email rejection passed; Catering remains explicitly no-send. No external messages or orders made.
- DN-02 resolved: a separate, non-scrolling toolbar holds Back to site; all five panels have independently scrollable content. Close remains reachable at320×568 and780×300, after valid form completion and portrait-to-landscape rotation.
- DN-03 resolved: closing a panel restores its visible originating button, or the visible mobile menu toggle when the original button is hidden. Background content is inert during a dialog. Keyboard forward/reverse containment and result announcement tested.
- DN-04 resolved: short-landscape promise cards use the full existing right column, with readable content and internal vertical scrolling where needed. All three cards are reachable. The landing page stays fixed; no artwork or baked lettering was changed.
- DN-05 resolved: feature descriptions now13–14px; panel labels14px and form fields16px across the sample. Eyebrow text #855123 on the near-opaque #fffaf6 panel is approximately6.33:1 (previously3.4:1). Actual sampled computed colours checked; two Chromium Axe scans report no violations. Small text was treated as usability, not a formal minimum-font-size rule.
- DN-06 resolved: malformed regex-like opening CSS removed, restoring the intended :root variables. Computed --ink is #401019 in all sampled engines.
- DN-07 resolved: existing map re-encoded as1200×1200 WebP,2,217,643→134,532 bytes (93.9% smaller). It has no src until Locations opens; browser records confirm the old PNG is not requested and the derivative decodes. Lettering and artwork preserved; derivative visually inspected.

## Items needing your attention or input

- Publication approval. Existing indexing and analytics decisions remain pending and unchanged.

## Verification and provenance

- Source read and live Chrome interaction/screenshot inspection proved readiness. Local Playwright launch failed because the pinned Chromium executable was absent; the existing GitHub Actions fallback supplied the tests. No local reinstall loop or new infrastructure.
- Corrected-source run40101567253: Chromium129/129 and Firefox32/32 assertions passed; no page exceptions or first-party asset failures. Chromium five representative outer CSS viewports1440×900,390×844,844×390,320×568 and780×300; Firefox desktop and portrait. Actual inner iframe dimensions recorded in each report.
- WebKit ran desktop and portrait in the same run, passing forms, focus return, readability and assets, but two pre-settlement Close measurements occurred during the opening slide. Settled screenshots show the final panels. Focused run40101835123 explicitly waits for the open-state class: WebKit32/32 passed with no exceptions/assets failures. No product changes or new screenshots in this follow-up. Combined: nine browser/viewport combinations and193 passing assertions, with historical failures retained rather than relabelled.
- Twenty-five corrected-source screenshots were opened and individually inspected at readable scale. review-ledger.json records engine, outer/inner viewport, state, observations and original PNG hashes. evidence.zip durably preserves full-dimension WebP exports, raw machine reports, ledger and failure summaries beyond Actions retention; original PNG artifacts remain for90days.
- The initial attempt plus corrected-source rerun produced50 machine captures cumulatively, exceeding the routine40-capture ceiling. This was a CSS-specificity correction within the same scope, not exhaustive expansion; the final WebKit rerun disabled screenshots. The initial captures are not claimed to have been visually reviewed. No further screenshots generated.
- Live deployed preview Order Now was completed using safe test details; its final no-send/no-order/no-reply result was verified. Approved mug artwork retained. No other demos changed. Shared QA workflow restored to baseline before publication.

## Limits

Native200% browser zoom hotkey left1440×900/DPR1 unchanged, so native zoom is unverified on the repaired version. CSS200 substitute proves scrollable panel/Close reachability only; its brand crop is recorded and it is not a whole-page reflow pass. Earlier native zoom evidence belongs to the original Donut audit and is not represented as a fresh repaired-source pass.

Phone sizes are emulated; Linux WebKit is not actual Safari/iOS. Physical touch/mobile keyboards, actual screen-reader journeys, live delivery, analytics/indexing and security/legal certification are outside this repair check. Unchanged wrapper/fullscreen/return/gallery evidence is reused from the original Donut audit at0d9f58b; index.html changed only its iframe cache version. No independent-agent review used. No production merge/publish.
