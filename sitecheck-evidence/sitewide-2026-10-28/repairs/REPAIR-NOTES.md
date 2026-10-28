# Sitewide repairs — 28 October 2026

Authorised by Robert's “continue” after the completed eight-group audit. Repair branch only; production merge/publishing requires a separate instruction.

Original website source: `7410e040214f7369013a41d47aa3422e4c4bd6e0`. Baseline audit records are preserved unchanged in the parent audit branch.

## Changes

- SW01: stronger left-side backing for Retreat Home's image-backed heading and copy. Photograph unchanged. The established landscape layout still removes the overlay and keeps adjacent dark copy.
- SW02: Produce phone footer uses three static, wrapping columns, in both normal and reduced motion. Every message stays present; the board reserves space above the taller footer. No moving information remains to require a pause control.
- SW03: Charity journal footer increased from 8.5px to 11px and darkened from #777 to #595959.
- SW04: Tailor Shop document language en-NZ and main collection landmark.
- SW05: Tailor Shop introductory text opacity increased from .6 to .75.
- SW06: Tailor Shop introduction now says “Nine considered pieces”, matching its nine tiles.
- SW07: Pottery's fixed return control wrapped in a named navigation landmark. Link, position and action unchanged.
- SW08: phone portrait background encoded as lossless WebP; CSS references updated. Original PNG retained for rollback. PNG 1,667,173 bytes; WebP 1,212,976 bytes, saving 454,197 bytes (27.24%). Decoded image comparison: zero differing pixels. This improves bytes delivered; no new Lighthouse score or production field performance claim.

## Evidence preparation

Lossless encoding run: https://github.com/rkdb-nz/TabLab/actions/runs/40627976904
Artifact: sitewide-repair-image (90-day retention). cwebp -lossless -z 9 -exact, then dwebp decode. ImageMagick compare -metric AE returned 0 with exit 0.

Targeted browser verification, screenshot review and final disposition are recorded in REPORT.md when complete. This preparation note is not a test pass.
