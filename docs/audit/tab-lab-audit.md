# Tab Lab — ASSIST website audit

## Status and provenance

**Status: verified findings and bounded coverage; complete audit sign-off withheld.** Material mobile, browser-engine, accessibility-state and detailed source-review gaps remain. A loaded route, a search match or an independent agent's opinion is not a pass.

| Item | Evidence |
|---|---|
| Accessible repository | `rkdb-nz/TabLab`, https://github.com/rkdb-nz/TabLab; repository API and local Git clone both worked |
| Default branch | `main`, confirmed by repository API |
| Audit branch | `audit/tab-lab-full-review`, isolated from production |
| Audited starting commit | `cf5fcbc24a14a2c85d140abc493d99e4036e86cb` |
| Starting tree | `9ddcd1bac9b916d9838aaed63b87cfba54e5d5d7` |
| Audit date | 2026-10-08 |
| Principal | Main assistant; independent source searches, rendered inspection and reproductions |
| Sub-Auditor | Separate `/root/sub_auditor` agent; forensic source review and exact file register |
| Changes authorized/performed | Audit documentation only. No site fixes, deletion, movement, merge or deployment command |

The repository is the primary source. The public website was used for rendered observations; its deployed SHA was not exposed or independently attested. Agreement between live behavior and source corroborates findings but does not prove every live byte equals the audited commit. Cloudflare settings and automatic branch-deployment behavior were not available for inspection. No publishing action was requested or executed by the auditors.

## Approved design

The user explicitly selected **“Yes, latest approvals”** when asked whether the approved 8 October desktop/mobile designs supersede the 2 October header note, with the old desktop Boardroom anvil background and Start header treated as rebrand issues. This confirmation resolves the conflict; the newest file alone was not treated as approval.

Historical evidence: `notes/tab-lab-header-approved.md` locks header work to `9228e4532698ae53a86f1bdf6a43f598b6c21974`; `README.md:25–29` still refers to it. Later recorded changes include `08b5050` approved portrait/landscape work; `4919c71` shared demo frame; `26d4625` compact example headers; `f2a1b6c` desktop care plaque enlargement; `87fb94b` Why landscape layout; `4d1aacc` preserved desktop care header; and later visitor-wordmark changes through the audited commit. Those hashes identify repository evidence, supplemented by the user's explicit current approval.

Preserve deliberate differences: fictional demo brands, their individual type/layout systems, gallery presentation, and the expressly preserved desktop care header. Internal Foundry class names, paths and neutral asset filenames are not automatically visitor-visible defects (`README.md:23`). Approved original header masters remain preservation assets.

## Plain-English assessment

The current home screens, About, Why and care page show the Tab Lab identity in the inspected desktop view. The twelve examples retain their intended individual brands. All 50 full HTML route documents were opened or rendered through the live browser, with source and runtime depth recorded separately in the coverage register. Core contact links inspected use `tablab@rkdb.nz`; actual mailbox delivery was not tested.

The site needs attention before a full quality sign-off. Pottery loses content off the portrait viewport; Dining hides navigation behind an inert Menu; Boardroom desktop text exceeds its cards and still uses an anvil workshop background; Start retains the earlier header. There are also missing imagery, form validation and keyboard-access problems. These are reproducible findings, rather than a general judgment that every page is broken.

No critical production outage was established. Neither the desktop route sweep nor the limited responsive checks proves the absence of defects. The large layered CSS system still needs broader cascade and state testing.

## Findings ranked by severity

IDs retain the Sub-Auditor's original numbering so its findings can be traced through independent verification. P01 and P02 originated in Principal inspection. **Runtime** means observed in the available Chromium browser; **source** means independently corroborated implementation; **suspected** means the consequence or intended requirement remains uncertain.

### High — mobile content or navigation unavailable in tested layouts

| ID | Evidence and affected pages | Reproduction/result | Recommended correction |
|---|---|---|---|
| P02 | Pottery `public/boardroom/skateboard/demos/pottery/css/style.css:84–85,226–245`; `site.html` philosophy section | Existing mobile preview, outer 360×740; inner content 337×659 with a scrollbar: body/HTML scroll width 505, overflow 168px. Third philosophy card bounds left 362.47/right 504.63, entirely beyond the content width. Landscape inner 717×308 had zero measured horizontal overflow. Fixed `repeat(3,1fr)` never collapses in the mobile rules. | Collapse the philosophy grid and verify intrinsic sizing at small widths; inspect footer rule ordering too. Straightforward layout correction, preserving design. |
| S16 | Dining `public/boardroom/springboard/demos/dining/assets/css/main.css:412`; `assets/js/main.js` complete implementation; `sign.html:17`; shared by Dining pages | In the preview, portrait inner 337×659 and landscape 717×308: `.nav-links` computed `display:none`; clicking Menu left it `none` with no navigation revealed. Home provides other page panels, but the header Menu is inert. Subpage mobile runtime remains untested. | Implement an accessible navigation toggle and test every Dining page. Straightforward functionality correction. |

### Medium — layout, accessibility, branding and misleading interaction

| ID | Exact evidence and affected pages | Principal verification / reproducible check | Recommendation and decision |
|---|---|---|---|
| S21 | `public/boardroom/boardroom.css:304,308–315,510–517,739,750`; Boardroom | Desktop 1363×936 screenshot showed descriptions below their card boundaries. Fixed stack/card height, four rows, padding and description line-height corroborate the constraint. | Allow content-driven card height or redistribute available height. Straightforward correction; check all four cards and breakpoints. |
| P01 | `public/boardroom/boardroom.css:49`; `public/assets/backgrounds/boardroom.webp`; `public/boardroom/index.html:27` | Settled desktop Boardroom renders the old anvil/workshop background and a small unstyled upper-left TAB LAB anchor. User classified the background as a rebrand issue. | Apply the approved current Boardroom design; retain old asset in place. Background requirement resolved; exact replacement/layout may need approved artwork. |
| S08 | `public/start/index.html:20–31`; `public/styles.css:54–72` | Start renders the orange/dark Courier header; computed font and screenshot corroborate it. Shared menu actively routes here. | Bring this active route into the approved current design. User already confirmed it is a rebrand issue; no deletion. |
| S01 | `public/boardroom/springboard/demos/retreat/discover.html:20`; existing `assets/icons/discover-hero.webp` | Requested `assets/images/discover-hero.webp` absent from tracked inventory. Live image `complete:true`, `naturalWidth:0`; hero rendered without photograph. HTTP status itself not captured. | Correct the reference to the intended existing asset. Straightforward. |
| S02 | `public/boardroom/springboard/demos/retreat/book.html:42` | `mailto:Clementines.rkdb.nz` has no `@`; source and live route inspected. Mail client not opened. | Confirm intended fictional recipient, then correct both visible text and href. Contact decision. |
| S04 | Florist `public/boardroom/skateboard/demos/florist/site.html:93–100`; `js/main.js:12–18` | Fictitious name “Audit test” and email “not-an-email” reached the success route. `novalidate` plus nonempty-only check accepts invalid email. Labels have neither `for`/matching IDs nor enclosing controls. | Validate input and associate labels explicitly. Straightforward. Test all invalid/empty/success states. |
| S03 | Drilling `js/app.js:64–67`; Florist `js/main.js:12–18`; Pottery `site.html:212`; Dining `sign.html:35`; Retreat `book.html:49–54`; Mini-golf `js/app.js:110–114`, under their exact demo directories | Independently read client handlers: prevent/reset/store locally/display success without delivery in these handlers. Florist runtime reached “enquiry received” despite invalid email. Other submit outcomes source-confirmed, not runtime exercised. No claim that a production backend was required. | Decide explicit demo disclosure and safe success wording. Real delivery, if intended, is separate implementation requiring authorization. |
| S05 | `public/boardroom/skateboard/demos/tailor/site.html:49–54` | Independent HTML parser and source inspection found 11 lookbook `<img>` elements without `alt`. | Select meaningful descriptions or empty alt for intentionally decorative images. Content/intent decision, then straightforward markup. |
| S06 | `public/js/foundry-global-nav.js:16,58–60`; core inner pages | A newly created tab directly opened Why; clicking Back moved to `about:blank`. `fallback` is calculated but never used. | Define direct-entry Back/Home fallback behavior. Decision needed; preserve ordinary history use where appropriate. |
| S07 | `public/js/foundry-global-nav.js:100–130`; shared drawer | Opening home menu left focus on trigger. Tab from trigger entered first drawer item; Tab after Contact left the drawer to document body. Background was not inert. Escape worked and returned focus when tested previously. | Implement a documented keyboard/focus model, including containment if treated as modal and ordinary-close focus return. Straightforward accessibility work after model choice. |
| S17 | Dining `public/boardroom/springboard/demos/dining/sign.html:39`; `assets/js/main.js:170–180` | Time input is readonly; desktop ArrowUp left value at “7:00 pm”. Source's sole changing handler is mousewheel. Touch runtime unverified. | Use a native select or keyboard/touch-operable controls. Straightforward. |
| S18 | Dining `sign.html:28–31,36–39`; `assets/js/main.js:148–153` | FAQ headings are nonfocusable divs with click-only handlers; form fields lack explicit labels. Desktop layout/source inspected; full keyboard workflow pending. | Use disclosure buttons/details with expanded state; add field labels. Straightforward. |
| S19 | Retreat `public/boardroom/springboard/demos/retreat/js/main.js:14–55`; Pottery `public/boardroom/skateboard/demos/pottery/js/app.js:39–57` | Independent source review confirms Retreat registers motion updates unconditionally and resets only once; next scroll/resize writes motion properties again. Pottery parallax scroll listener ignores preference. Browser preference emulation unavailable. | Gate listeners and smooth/parallax effects under reduced motion, including changes to preference. Straightforward; rendered confirmation required. |
| S20 | `public/boardroom/noticeboard/index.html:16,33–36`; Skateboard `index.html:16,32–36`; Springboard `index.html:16,33–36` | Source definitions describe self-edited content/scroll journey/multipage navigation on desktop, but different good-news/rebel/test-grow promises on mobile. Both layouts are approved; content intent not settled. | Confirm whether mobile should preserve the desktop product promise. Design/content decision; preserve deliberate layout differences. |
| S28 | Pottery `public/boardroom/skateboard/demos/pottery/site.html:29`; `js/app.js:46–50` | Principal source inspection confirms Menu has no `aria-expanded`; handler only toggles a class and keeps “Open menu” label. Expanded state runtime pending. | Add controls/expanded state and meaningful open/close labeling; verify keyboard behavior. Straightforward. |

### Low — documentation, content and behavior consistency

| ID | Evidence / affected area | Verification and recommended action |
|---|---|---|
| S10 | `README.md:25–35`; `notes/master-plan.md`; `notes/foundrycare.md`; demo README files | Independently read: current-contact guidance still says `thefoundry@rkdb.nz`, while runtime `public/script.js:1` and shared menu use `tablab@rkdb.nz`. Historical note remains presented as current design authority. Update current guidance and label retained history. Straightforward documentation corrections. |
| S11 | `public/boardroom/skateboard/demos/florist/success.html:19` | Source and rendered page: “Flowers for each and every moments.” Recommend “Flowers for every moment.” Straightforward. |
| S12 | `public/boardroom/noticeboard/demos/diner/site.html:265` | `ontheroard@rkdb.nz` looks inconsistent with On The Road; source/live page inspected. Mailbox validity not tested, so typo is suspected. Confirm intended address before changing. |
| S13 | `public/script.js:236–274,286–313`; core anchors using this script | Independent source confirms two click interceptors and missing modifier handling. Ctrl-click About from Explore navigated current tab to About after delayed transition. Download consequence is source risk, not a tested failure. Consolidate handling and preserve native modifiers/downloads. Straightforward. |
| S14 | All full route HTML metadata; four shared fragments are excluded from expected page metadata | Independent parser found no `og:` metadata in the 54 HTML files. Social-preview fallback behavior not tested. Decide core canonical/share title/image, then add metadata. Absence is a source fact, not proof of broken social previews. |
| S09 | `public/maintenance/index.html:27–32,82–96` | Rendered black/orange variant with updated Tab Lab brand. Could be deliberate emergency presentation. Design decision; retain until confirmed. |
| S22 | Retreat `public/boardroom/springboard/demos/retreat/reviews.html:68,71` | Independent source: image alt “Hannah and Will” conflicts with visible “Hannah & Jewel”. Confirm fictional names and align accessible text. |
| S23 | Retreat `site.html:28`, `retreats.html:49`, `reviews.html:93`, `discover.html:31`; versioned nav hrefs near top of each file | Equality checks compare bare filenames with query-bearing hrefs; home also checks `index.html` instead of `site.html`. Source mismatch verified; visual active-state impact not fully tested. Normalize destination pathname and set `aria-current`. Straightforward. |
| S24 | `public/boardroom/skateboard/demos/tailor/shop/index.html:1` | `<html>` lacks `lang`; independently verified. Add English language declaration. Straightforward. |
| S26 | `public/boardroom/billboard/demos/drilling/site.html:7–8`; visible demo masthead | Principal source/desktop and portrait text observations: title/description say Deepcore Drilling; visible company says A Hole In One Drilling. Confirm fictional company name and align metadata/accessibility text. Content decision. |
| S27 | Theatre `public/boardroom/springboard/demos/theatre/now-playing.html:22,29`, `book-tickets.html:48`, `coming-soon.html:27–42,49–64,71–84,97` | Principal source confirms entity-decoded Wāpereki conflicts with Wāperiki metadata/other pages. Coming Soon screenshot shows Quiet Hours poster dates Sept 12–Oct 5, 2025 vs “Coming February”; Ashes poster dates April 10–May 3, 2026; Family card June 12–July 4, 2026. Poster paths `assets/images/poster1.webp`, `poster2.webp`, `poster3.webp` inside this demo. Confirm fictional date/place convention and align HTML/image text. Content decision. |

S15's broad CSS-only reduced-motion suspicion is retained as an unverified investigation item, not an additional proven failure: Florist smooth scrolling and Tailor wheel animation need preference-aware runtime tests. S19 supplies the stronger verified implementation evidence for Retreat and Pottery.

S25 in the Sub-Auditor follow-up is the same Pottery overflow as P02, not a second defect. S27 concerns fictional demo consistency, not a claim about a real theatre schedule. Full image text checks remain outstanding where not explicitly verified.

## Mobile results and limitations

See [mobile-test-matrix.md](mobile-test-matrix.md) for exact dimensions, all 50 routes, device profiles and unverified checks. Available checks used the site's pre-existing mobile-preview page, not newly written or deployed test code. Chrome's top-level viewport remained 1363×936. Twelve demo wrappers and their initial iframe pages were measured at outer 360×740 and 740×360; inner viewport dimensions differ after headers/borders/scrollbars. These are responsive iframe observations, not physical phone tests or full device emulation.

Measured horizontal overflow was zero for initial content in the inspected examples except Pottery portrait. Zero page overflow does not prove no clipping: `overflow:hidden`, delayed assets, fixed elements or inner scroll regions can hide content. Screenshots taken during loading/animations were not treated as missing-image or contrast defects without settled corroboration. No physical iPhone, Galaxy A16/other Samsung, Pixel, Safari/WebKit or Firefox was tested. Browser bars, safe areas, touch, on-screen keyboards, zoom and full reduced-motion behavior remain unverified. Every requested phone/breakpoint cell is explicitly unverified.

## Legacy retention

See [legacy-register.md](legacy-register.md). Preserve all listed code/assets **in place** until a new review on **2027-04-08**. Six months is a reassessment, not automatic deletion. Active base CSS has both legacy and current dependencies and carries very high removal risk. Boardroom's old background is active; apparently unused images and navigation code are only candidates. Static references, dynamic JavaScript, cascade conditions and unknown external consumers are distinct checks. Neutral `foundry1a.webp` is not obsolete branding merely because of its filename.

## What passed within the actual scope

- Repository access, immutable source inventory and isolated branch established.
- Inventory has 344 tracked files: 54 HTML (50 routes plus four fragments), 66 CSS, 22 JS, 167 raster assets, 13 SVG, 14 Markdown, three font binaries, three text files and two files without standard extensions.
- Principal independently ran `node --check` on all 22 JavaScript files; all passed syntax checking. This is not integration coverage.
- Principal resolved 698 literal HTML/CSS resource references; only the Retreat hero path was missing in that bounded scan. JavaScript-created resources, inline CSS URLs, external availability and deployments are outside that count.
- Tab Lab visitor identity observed on current desktop home/About/Why/care and example frames. Care's deliberate desktop header preserved.
- Home Explore and drawer opening worked; wrapper Full screen/return and Back to gallery worked on Theatre. No general claim that every link/state passed.

## Blockers and remaining work

1. Local Playwright engines are absent. One official Chromium install failed with a corrupt/empty archive; stopped after the installer's finite internal retries. The supported cloud browser has no viewport/device/reduced-motion emulation API. Resume the full matrix in an execution environment with working engines and physical-device access.
2. Detailed source coverage is incomplete where explicitly marked scan-only/bounded. Principal inspection of shared design components covers rendered presentation and targeted source, not every cascade combination. Finish those rows and repeat relevant states before sign-off.
3. Complete all page/state keyboard flows, contrast measurements, 200%/400% zoom, clipping inspection, touch targets, reduced motion, orientation/browser-bar changes and on-screen keyboard checks.
4. Check every form's invalid/valid/reset/confirmation states. Real sends, mailbox delivery, ticket checkout/payment and external integrations were not executed. Client demo handlers must not be confused with proven delivery.
5. Cloudflare dashboard settings, preview policy, deployed SHA, external redirects/maps/downloads, complete failed-request/console capture, external font loading and dependency freshness remain unverified. No package manifest/lockfile was found; this does not establish vulnerable or current dependencies. PostHog bootstrap exists in shared navigation; successful ingestion was not tested. Observed extension errors were excluded from site findings.
6. Screen all tiny baked image text at full resolution and render all SVG/font assets; the 167-raster contact-sheet screen is not full-resolution QA.

## Decisions needed

- Confirm intended fictional contact addresses (Retreat and Diner), alt-text/name choices, and demo success/disclosure wording.
- Choose direct-entry Back fallback, maintenance variant, mobile product wording and social metadata.
- Confirm Theatre's fictional date/place naming convention before aligning image and HTML text.
- Current design authority, and the treatment of Start/Boardroom rebrand remnants, are already resolved by the user's answer.

No correction is implemented by this audit. See [verification-record.md](verification-record.md) for evidence challenges, reproduction results and explicit limits; [coverage-register.md](coverage-register.md) for exact file accountability.
