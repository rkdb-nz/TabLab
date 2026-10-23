# Diner targeted repair check — 23 October 2026

Preview branch: preview/diner-sitecheck-repairs. PR #71. Product version: c44d255454dd9a6eac8317c7cad1a5963343671d; 2092cd086e5c56cd1aedd0fbb2df7cfe95613df9 only adds a diagnostic runner. No production publishing or merge.

## Resolved

- DN-01: Inactive panels are inert and hidden. Active panels contain keyboard focus and return focus to their opener. Contact panels restore their parent location panel. Chromium and Firefox pass wrap and return checks at the sampled sizes. WebKit focus-return passes; reverse wrap remains limited as described below.
- DN-02: Category buttons expose aria-pressed selection within ordinary labelled navigation. All ten categories switch and each displays four items. Removed the incomplete tablist pattern.
- DN-03: Added pause/play, stopped animation for reduced motion, made the static ticker keyboard-scrollable and honoured reduced motion when changing categories. Final Chromium landing axe scan reports no violations.
- DN-D1 approved: Phone, email and directions have realistic local steps ending with explicit demo-only confirmations. Required-name/email/message validation checked, including empty and malformed email states. No real call, email or navigation request is made by these actions. No replacement mailbox or real-world address invented.

## Sample and evidence

Initial hosted run 39885292950: Chromium five sizes, Firefox and Linux WebKit desktop/portrait; 196 checks in total. Every category and contact confirmation tested. Raw reports retain failures and limits. Focused run 39885706257 reuses unchanged category/form evidence, checks nine landing/navigation combinations, reduced motion, focus return, settled desktop/phone fullscreen and native 200% zoom. Chromium 29 and Firefox eight checks pass. WebKit landing, reduced motion and focus return pass; two stricter last-button reverse-wrap assertions fail.

CSS viewports: 1440×900; 390×844; 844×390; 320×568; 780×300. Chromium fullscreen settles at frame 1440×900 and 390×844; return restores 1426×845 and 382×763 respectively. Rotation with Menu open inspected. Native Chromium browser zoom confirmed at 2.0, CSS viewport 720×450 and devicePixelRatio 2; landing and contact close control reviewed.

Archive: `diner-evidence.zip` beside this report contains machine reports and 32 reviewed screenshots exported as WebP at their original dimensions, quality 85. Original PNG artifacts are retained for 90 days in the two Actions runs above. The permanent compressed exports preserve layout/readability evidence with the project; no screenshots are claimed to be physical-device results.

Visual ledger: Initial 19 captures and focused 13 captures reviewed in labelled sheets. Four initial menu/enquiry captures additionally reviewed at original resolution. Landing compositions remain balanced at the sampled sizes. Short/narrow panels scroll internally. Native zoom screenshot shows a scrollable enquiry panel with its close control visible. Initial Chromium menu screenshots show a category-highlight/content mismatch during the automated sequence; subsequent direct deployed-preview category interactions show Burgers aria-pressed=true and the other buttons false. The exact cause of the initial painted mismatch was not proven, so those captures are not counted as independent visual selection passes.

## Remaining and new findings

- WebKit reverse-tab wrapping is unverified. The strict test expected the last category button, but focus remained on the close button inside the active panel. It did not reach a hidden panel. Do not label this an exact wrap pass. A focused diagnostic run 39886004499 failed before test execution: the 240-second WebKit install command exited 124. No repeated identical recovery attempted. This is the remaining keyboard testing limit, not an approved new product repair.
- The initial shared wrapper requests for PostHog config/config.js returned HTTP 404. Analytics and indexing decisions remain pending and their implementation is unchanged.
- Emulated Linux browsers are not physical phones or native Safari/iOS. No independent reviewer used. No exhaustive audit, real external messages/calls, or paid services.

Status: Repairs made and available targeted checks completed, with the stated WebKit keyboard limit. No additional design decision needed. Live site unchanged.
