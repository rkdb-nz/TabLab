# Drilling — routine sitecheck, 23 October 2026

**Routine check incomplete: browser coverage limited. Product files unchanged.**

## Fixes I can make

| ID | Impact and proposed correction | Evidence |
|---|---|---|
| DR-01 | High: repair mobile landing text wrapping and short-screen composition. | Inspected Chromium 390×844 and 320×568: service titles run over image areas. At 780×300 the lower contact-button line is obscured by the service row. Native 200% zoom changes 1440×900 to 720×450 CSS pixels and the main heading overlaps the proof list; heading client width 223px versus 266px scroll width. WebKit portrait also shows service-label overflow. |
| DR-02 | High: keep menu navigation, Close and the quote action reachable on short screens; contain scrolling inside appropriate drawer regions. | At outer 780×300, the frame is 772×248. Services Get a Quote spans y246–290, beyond the frame. Clicking it scrolls the drawer, moving Close to y−34–10; the submit button extends to y259.8. Inspected services/quote images confirm clipping. Escape still closes the menu. |
| DR-03 | High: add a concise demo notice within the quote panel and truthful no-send confirmation. | Source and sampled submissions only preventDefault and set local status. Current status says a request was received and promises follow-up. No request is sent. Empty required fields and malformed email correctly fail. |
| DR-04 | High: remove the closed drawer from keyboard navigation and correct dialog semantics. | Axe flags aria-hidden-focus while closed and an unsupported dialog role on aside while open. Focused keyboard probe confirms Tab from MENU focuses the offscreen Close button. Opening focus, open-menu Shift+Tab wrapping, Escape and return to MENU otherwise work in tested states. Use inert/hidden appropriately and a valid dialog container. |
| DR-05 | Medium: provide equivalent accessible desktop landing text and a heading. | Desktop consists of raster artwork with a generic scene alt; the mobile textual composition is hidden. The title, service claims and supporting desktop copy are absent from the accessible landing content. Axe reports no visible H1. Preserve the approved artwork. |
| DR-06 | Medium: improve form readability and button contrast. | Portrait labels and typed input text compute to 8px; desktop inputs 10px. This is a usability finding, not a formal minimum-font-size rule. The desktop submit label is white, 16px bold: adjacent gradient background at label rows measures 3.28:1–3.96:1, below the applicable 4.5:1 text requirement. Enlarge text and darken its button background. |
| DR-07 | Medium: optimise existing image delivery without changing artwork. | Desktop hero is 2,616,167 bytes; mobile background 194,026 bytes. Mobile also retains the large hero element and uses the large file in service crops. Source and normal desktop local load establish payload, not real visitor speed. |
| DR-08 | Low: align document title, description and main accessible name with the visible company. | Current metadata and main landmark say Deepcore Drilling; visible logo and drawer say A Hole in One Drilling. Update metadata/accessibility labels; preserve raster lettering. |

## Items needing your attention or input

- Confirm search-indexing and analytics intent for this public demo before changes to those settings. The target has no explicit noindex meta, and shared navigation loads PostHog. Analytics delivery/consent has not been certified.

## Source and execution

- Repository: rkdb-nz/TabLab. Product main: 2767653f5208cd3b4a5dcbae4a1f28a0068d6be3.
- Target: public/boardroom/billboard/demos/drilling/. Live interaction: https://foundry-a3k.pages.dev/boardroom/billboard/demos/drilling/ . Opened menu, inspected its settled screenshot, opened quote panel, closed menu with focus return and followed Back to gallery successfully.
- QA-only branch: qa/drilling-routine, draft PR https://github.com/rkdb-nz/TabLab/pull/66 . No product changes, production merge or publishing.
- Existing pinned runner and GitHub Actions fallback adapted for this target; Playwright 1.62.1 and axe-core 4.11.1. An initial runner syntax error produced no audit evidence; corrected and syntax-checked before the bounded sample executed. No exhaustive coverage gate or duplicate global audit.
- Routine run: https://github.com/rkdb-nz/TabLab/actions/runs/39847719344 at QA head e1bfa900e57cf35d817cbe0443ec76f262c4b7d0. Its synthetic merge SHA is recorded in machine reports.
- Focused run: https://github.com/rkdb-nz/TabLab/actions/runs/39848119557 at QA head 56e00b5276f62eb536f84b0e9adbb4177126419e. Adds settled fullscreen/return, closed-menu keyboard, link-target responses and failed-request identification. It reuses unchanged routine evidence.

## Coverage and passes

Chromium 151.0.7922.34: outer CSS viewports 1440×900, 390×844, 844×390, 320×568, 780×300. WebKit 26.5: 1440×900 and 390×844. Firefox desktop/portrait was not executed: the hosted installation step remained in progress after the bounded wait, with no Firefox test report or screenshot available. No Firefox pass is claimed. The workflow has a ten-minute job timeout; no identical retry or new browser infrastructure was launched. These are emulated Linux browser viewports, not physical devices or Safari/iOS.

Reviewed all five inner menu panels on Chromium desktop. Services/navigation/quote empty, malformed-email and local-confirmation states checked across available combinations. Portrait-to-landscape with Services open works. Get in touch opens Quote. Escape and focus restoration work in tested combinations. Shared wrapper menu opens. Reduced-motion computed animation and transition durations are 0s. No retained first-party asset HTTP failures or page JavaScript exceptions in completed routine reports. Chromium's blocked external resource errors are distinguished from first-party failures: the focused probe identifies an aborted PostHog configuration request; it does not prove an analytics outage.

Two axe scans cover the landing and quote template, with manual screenshot/contrast review. Axe contrast incomplete entries are not counted as passes. Normal loading only; local transfer durations are not field performance. No paid services, new imagery, external-site audit, real messages or requests.

## Settled fullscreen result

Passed native Chromium fullscreen entry and clickable return after 750ms settling on both screens:

| Outer CSS viewport | Original frame | Fullscreen frame | Returned frame |
|---|---|---|---|
| 1440×900 | 1426×845 | 1440×900 | 1426×845 |
| 390×844 | 382×763 | 390×844 | 382×763 |

The Fullscreen API state clears, the exit control hides and focus returns to Full screen. Initial immediate return geometry in the routine report is superseded by this settled probe. Firefox/WebKit fullscreen and physical mobile browser chrome remain unverified.

## Evidence and precise limits

29 collected screenshots have been opened and visually reviewed at readable size: 21 Chromium routine, 4 WebKit routine and 4 focused fullscreen/return. See review-ledger.json for filenames, measured outer viewports, state and observation. Raw capture flags remain false because review occurred after collection; the ledger is authoritative for review status. Three additional live-browser screenshots were inspected transiently, including an unsettled menu transition; none is claimed as a retained audit screenshot. Total captures so far: 32, below the routine ceiling of 40.

Original engine ZIPs, machine reports and the ledger are preserved alongside this report on the QA branch, beyond Actions expiry. Machine source hashes cover target HTML/CSS/JS. Hosted tests served the checked-out source locally; the live deployment commit was not independently established, so source-specific findings refer to the pinned product commit.

The local link probe's root / response is a harness limitation: its root-containment guard returns 404 for the root directory itself. It is not evidence of a broken production Home link. A separate live HTTP check confirms Home returns 200. Other listed internal page destinations return 200. Back to gallery was exercised live. mailto:tablab@rkdb.nz was inspected only; no email client or delivery was triggered.

No exhaustive certification, real screen-reader output, physical Samsung/iPhone testing, virtual keyboard/safe-area testing or legal/security certification. Independent second-agent review was not used; routine mode makes it optional. Available Linux fonts can affect wrapping; Impact/Arial Narrow availability is not assumed. Product repairs await approval.
