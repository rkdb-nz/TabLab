# Minigolf — routine check continuation, 23 October 2026

**Routine check complete with findings, within the declared sample. No product files changed.**

## Fixes I can make

| ID | Impact and proposed correction | Evidence |
|---|---|---|
| MG-01 | High: bound dialog height and allow internal scrolling, with Close reachable. | Fresh Chromium 320×568 Course: panel client height 465px, content 524px, overflow hidden; bottom content missing in inspected capture. |
| MG-02 | High: repair narrow/short composition and text wrapping. | Fresh 320×568 landing clips the Parties label; 780×300 header/navigation crowds the hero. Earlier 900/901px breakpoint and native-zoom faults remain on unchanged source. |
| MG-03 | High: enlarge tiny mobile copy and improve text contrast. | Fresh portrait footer and landscape form copy remain very small. Earlier measured text failures retained, including white/orange 2.21:1 and tagline 4.09:1. Tiny text is a usability issue, not a minimum-font-size WCAG rule. Close-icon contrast is advisory pending its applicable control requirement. |
| MG-04 | High: add a demo notice and truthful no-send confirmation. | Fresh all nine combinations: local form says “Thanks for booking with us! We’ll be in touch shortly.” No remote submission was allowed. |
| MG-05 | Medium: return focus to a visible opener and provide clear keyboard focus. | Fresh portrait close leaves focus on hidden Close in Chromium/WebKit or body in Firefox. Earlier Firefox focus-ring finding retained. |
| MG-06 | Medium: reject dates before today with a useful error. | Fresh all nine combinations: 2000-01-01 passes native validity and produces the local confirmation. Empty required fields and invalid email correctly fail. |
| MG-07 | Medium: optimise existing media delivery. | Reused earlier measurement: 5,429,133 initial media bytes. No new loading benchmark; earlier simulated timings are not real visitor timings. |
| MG-08 | Medium: add equivalent accessible desktop venue text. | Source and prior/live desktop accessibility inspection: important details are embedded in raster artwork, generic alt text does not convey them. |

## Items needing your attention or input

- **Scrolling:** approve internal dialog scrolling so readable text and all content remain reachable on short screens.
- **Mobile background:** choose a clean existing background, or authorise artwork editing to remove desktop wording visible behind mobile content. No masking or new imagery is approved.
- **Public intent:** confirm whether demos should remain noindex, their intended public URL and analytics intent before metadata/privacy changes.

## Execution and provenance

Used existing GitHub Actions fallback on PR #63, branch qa/sitecheck-readiness. Only qa/minigolf-audit.mjs changed, replacing the old probe with a bounded routine runner. No production merge or publish. The existing workflow step still says “Capture full Minigolf audit matrix”; its executed script is routine-only. No exhaustive matrix or coverage gate was run.

QA commit: 61c29ed083d6387c798cde418f5f774bad8cee68.
Actions run: https://github.com/rkdb-nz/TabLab/actions/runs/39836942698 — all three jobs succeeded.
Product main: 2767653f5208cd3b4a5dcbae4a1f28a0068d6be3. Compared all public-tree entries with PR source: no differences. The QA commit changes one QA file only. Per-engine reports include SHA-256 hashes for five target HTML/CSS/JS files.

Primary Chromium: 1440×900, 390×844, 844×390, 320×568, 780×300.
Firefox and WebKit: 1440×900 and 390×844 each.
These are measured outer CSS viewports, not frame dimensions. For example, the 320×568 wrapper leaves a 312×487 embedded page; rotated 844×390 leaves 836×338.

Browsers: Chromium 151-series (exact value in machine report below), Firefox 153.0, Linux WebKit 26.5; Playwright 1.62.1. All four dialogs checked on Chromium desktop; Course also checked narrow and after portrait-to-landscape rotation. All nine combinations checked landing, menu/opener navigation, Booking, required/invalid email/past-date/local-success states and Escape close. Event→Booking passed. Screenshot success states are supported by recorded text, not separate captures.

26 fresh Actions captures were personally opened and visually inspected: 23 routine captures plus three readiness captures. Together with six hosted captures from the first segment, total 32, below the 40 ceiling. No extra screenshots were captured for the interrupted ZIP transfer; a complete retry recovered the Chromium archive. That was a transfer issue, not a browser/test failure.

No page exceptions or local HTTP asset errors in fresh reports. Chromium/Firefox console records include expected failures for deliberately blocked external analytics; not counted as product asset failures. Reduced-motion preference enabled throughout this fresh sample. No new independent reviewer used.

## Reused evidence, clearly historical

Read the prior report at sitecheck-evidence/2026-10-22/minigolf-audit/report.md on 68821661ba8de2b43575e9f5424d661d65b6a140, and decoded its bundled Chromium/Firefox/WebKit machine reports. Retain unchanged-source findings and earlier link, keyboard, accessibility, zoom, metadata and loading observations; do not describe those as freshly executed. Historical reports identify product main 2767653… (Chromium/Firefox machine records carry QA revision c610e784…); source comparisons and prior report provenance establish unchanged product content. No historical screenshot collection was rerun or claimed newly inspected.

## Precise remaining limits

- Linux viewport emulation does not certify physical Samsung/iPhone devices, Safari/iOS, browser bars, safe areas, virtual keyboards or actual screen-reader output.
- Focused settled Chromium check now verifies native Fullscreen API entry and return in 390×844 emulation. Frame changes from 382×763 at (4,77) to 390×844 at (0,0), then returns exactly to its original geometry. Tab Lab return control is visible, focused and clickable; exiting restores focus to Full screen. Physical Android/iOS/browser chrome and mobile fullscreen in Firefox/WebKit remain unverified. Earlier immediate probes are superseded for Chromium only.
- Fresh routine tests used checked-out local copies on GitHub runners. The earlier hosted Chrome session exercised the live default URL, but its deployment SHA was not established in this continuation. Historical live hash matching applies only to the prior pinned preview.
- No fresh native zoom, accessibility scan, timing benchmark, full keyboard traversal or every external destination check. Reuse their unchanged-source historical evidence; Firefox/WebKit native zoom remains unsupported/unverified. No new zero-gap claim.
- Analytics delivery/consent and real booking/email services were not exercised. Only local GET/HEAD traffic was allowed; no bookings/messages sent. This demo has no delivery backend to certify.
- This is reasonable assurance for the routine sample; no exhaustive or physical-device certification.

## Fresh screenshot review ledger

Every row below was opened at readable size in this continuation. Routine report raw flags remain false from collection; this explicit ledger records subsequent human-style visual inspection by the assistant.

| Engine | Outer size/state | File | Observation |
|---|---|---|---|
<!-- chromium exact version: 151.0.7922.34 -->
| chromium | 1440×900 1440x900-home | chromium-routine/minigolf-results/chromium/1440x900-home.png | Desktop composition fits; embedded text needs accessible equivalent. |
| chromium | 1440×900 1440x900-book | chromium-routine/minigolf-results/chromium/1440x900-book.png | Dialog and Close fit this sample. |
| chromium | 1440×900 1440x900-course | chromium-routine/minigolf-results/chromium/1440x900-course.png | Dialog and Close fit this sample. |
| chromium | 1440×900 1440x900-story | chromium-routine/minigolf-results/chromium/1440x900-story.png | Dialog and Close fit this sample. |
| chromium | 1440×900 1440x900-events | chromium-routine/minigolf-results/chromium/1440x900-events.png | Dialog and Close fit this sample. |
| chromium | 390×844 390x844-home | chromium-routine/minigolf-results/chromium/390x844-home.png | Mobile layout fits; background wording and tiny footer persist. |
| chromium | 390×844 390x844-book | chromium-routine/minigolf-results/chromium/390x844-book.png | Form fits; small copy. Confirmation/date issues recorded separately. |
| chromium | 844×390 rotation-course | chromium-routine/minigolf-results/chromium/rotation-course.png | Course remains open and fits after rotation; text small. |
| chromium | 844×390 844x390-home | chromium-routine/minigolf-results/chromium/844x390-home.png | Landscape composition fits; small labels. |
| chromium | 844×390 844x390-book | chromium-routine/minigolf-results/chromium/844x390-book.png | Form fits; small copy. Confirmation/date issues recorded separately. |
| chromium | 320×568 320x568-home | chromium-routine/minigolf-results/chromium/320x568-home.png | Parties label clipped; footer tiny. |
| chromium | 320×568 320x568-book | chromium-routine/minigolf-results/chromium/320x568-book.png | Form fits; small copy. Confirmation/date issues recorded separately. |
| chromium | 320×568 320x568-course | chromium-routine/minigolf-results/chromium/320x568-course.png | Lower Course content clipped; overflow hidden. |
| chromium | 780×300 780x300-home | chromium-routine/minigolf-results/chromium/780x300-home.png | Header/nav crowds hero; footer clipped at bottom. |
| chromium | 780×300 780x300-book | chromium-routine/minigolf-results/chromium/780x300-book.png | Form fits; small copy. Confirmation/date issues recorded separately. |
| chromium | 1366×768 readiness Course | chromium-routine/readiness-results/chromium/chromium-1366x768.png | Course visible after click; dialog and Close fit. |
<!-- firefox exact version: 153.0 -->
| firefox | 1440×900 1440x900-home | sitecheck-readiness-firefox/minigolf-results/firefox/1440x900-home.png | Desktop composition fits; embedded text needs accessible equivalent. |
| firefox | 1440×900 1440x900-book | sitecheck-readiness-firefox/minigolf-results/firefox/1440x900-book.png | Dialog and Close fit this sample. |
| firefox | 390×844 390x844-home | sitecheck-readiness-firefox/minigolf-results/firefox/390x844-home.png | Mobile layout fits; background wording and tiny footer persist. |
| firefox | 390×844 390x844-book | sitecheck-readiness-firefox/minigolf-results/firefox/390x844-book.png | Form fits; small copy. Confirmation/date issues recorded separately. |
| firefox | 1366×768 readiness Course | sitecheck-readiness-firefox/readiness-results/firefox/firefox-1366x768.png | Course visible after click; dialog and Close fit. |
<!-- webkit exact version: 26.5 -->
| webkit | 1440×900 1440x900-home | sitecheck-readiness-webkit/minigolf-results/webkit/1440x900-home.png | Desktop composition fits; embedded text needs accessible equivalent. |
| webkit | 1440×900 1440x900-book | sitecheck-readiness-webkit/minigolf-results/webkit/1440x900-book.png | Dialog and Close fit this sample. |
| webkit | 390×844 390x844-home | sitecheck-readiness-webkit/minigolf-results/webkit/390x844-home.png | Mobile layout fits; background wording and tiny footer persist. |
| webkit | 390×844 390x844-book | sitecheck-readiness-webkit/minigolf-results/webkit/390x844-book.png | Form fits; small copy. Confirmation/date issues recorded separately. |
| webkit | 1366×768 readiness Course | sitecheck-readiness-webkit/readiness-results/webkit/webkit-1366x768.png | Course visible after click; dialog and Close fit. |

Evidence is now committed durably under sitecheck-evidence/2026-10-23/minigolf-routine on qa/sitecheck-readiness, PR #63. Minigolf-routine-evidence.zip preserves the original 26 inspected PNGs and six machine reports; Minigolf-focused-fullscreen.zip preserves the three focused captures and report. The external review-ledger.json supersedes collection-time unreviewed flags and the original ledger inside the first archive. Archive hashes are in SHA256SUMS. No dependence on Actions expiry remains.

## Focused completion — fullscreen and durable preservation

Run https://github.com/rkdb-nz/TabLab/actions/runs/39838449883; PR head b5da7bbb57e1c361d86ae26880bbac3de2609282; tested PR merge revision 883e13bcba5c522b35fa1e4bb70dada37c0ed6bc. One Chromium 151.0.7922.34 session at 390×844, three screenshots only. Waited for state change, completed animations and settling before measurements/capture. Fullscreen API target was demo-browser-content, CSS fallback was false. Container and iframe both occupied the measured 390×844 viewport. Return control at x=0,y=185.67 measured 36×86.64, visible and focused. Click returned to framed view; iframe 382×763 at x=4,y=77 exactly restored. Return control then hidden and focus restored to Full screen. No errors. All three PNGs personally opened and inspected. Screenshots total now 35/40, with 29 Actions PNGs and six earlier hosted PNGs. No findings changed, no product edits, no new audit/matrix run.

The original six hosted captures were inspected inline in the earlier session and were not exported as files; no downloadable originals exist to preserve. Their observations remain in this report. All 29 file-backed inspected screenshots are now preserved, along with raw reports and review ledger.
