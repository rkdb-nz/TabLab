# Charity Walk routine check — browser coverage limited

Source: main 21a372ce3d92c92b5b33e72b282ae0c98adab1fc. QA-only local branch qa/charity-walk-routine, commit e728c83. Product files unchanged. Push rejected by automatic approval review; no PR or Actions run created and no publication performed.

Verified live URL: https://tablab.rkdb.nz/boardroom/noticeboard/demos/charity-walk/

Read site.html, script.js, styles.css, wrapper HTML, shared wrapper script and existing pinned QA runner/workflow. Local Chromium launch failed: executable missing at /root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell. Tried existing hosted Actions fallback; automatic approval review rejected commit/workflow push as unapproved remote mutation. Did not retry via another mechanism.

## Available direct-browser sample

Hosted Chrome, outer viewport 1363x936. Existing mobile-preview.html used for phone composition; outer phone frame 360x740 and landscape 740x360. Measured inner site viewports 352x659 portrait and 732x308 landscape. These are explicit substitutions, not claims of the specified five-size sample.

Desktop landing visually inspected. Desktop fullscreen measured site 1363x936 and exit returned to wrapper. Required name field blocks empty submission and receives focus; invalid email yields validity.typeMismatch. No valid submit or mailto opened. Mobile hub, story, diary, trail and support visually inspected; story/trail/support at portrait and landscape. Diary next increments counter to 2 and settled visible entry is May 13. Open diary survives portrait-to-landscape switch and Journey returns to hub. Phone wrapper fullscreen fallback grows inner site to 360x740; return restores 352x659 and focuses fullscreen control. This nested-frame fallback does not prove native mobile fullscreen. Back to gallery navigates to Noticeboard. Wrapper menu opens.

Eleven relevant screenshots personally inspected in browser tool transcript: desktop framed landing; desktop fullscreen; portrait hub; portrait diary transition; settled landscape diary; landscape story; landscape trail; landscape support; portrait support; portrait story; portrait trail. Diary transition capture shows counter updated before content transition settles; settled landscape capture confirms correct entry. One unrelated Donut image from the preview's initial loading state is excluded. PNG files not exported; durable image evidence remains incomplete.

All seven DOM image instances report complete and naturalWidth>0. Assets in source: hero.jpg 2,222,173 bytes, portrait.png 2,194,998 bytes, boots.jpg 656,362 bytes. No performance claim. Visible links point to Daffodil Day and mailto:kokiri_ontheroad@rkdb.nz. No donation or message sent. Recent console log output consists of browser-extension metadata errors, not demonstrated product exceptions; no claim of a clean full console/network trace.

Native zoom attempted once with Control++; measured outer width and devicePixelRatio unchanged at 1363 and 1. Native 200% zoom remains unverified. No CSS surrogate counted as native zoom.

## Findings (provisional until remaining sample)

- CW-01: Desktop submit constructs real mailto to kokiri_ontheroad@rkdb.nz and mobile Support links directly to same address. No final demo-only warning. Add realistic final demo confirmation and prevent unintended contact with fictional walker. Source-backed; delivery intentionally not executed.
- CW-02: showMobileView changes visibility without moving focus. Direct observations show clicked hub control initially retains focus while its view becomes hidden, then document.activeElement is BODY. Move focus into opened screen and restore originating tile on return.
- CW-03: All five mobile diary articles remain exposed in accessibility tree while only one entry is visually current. Script toggles class only. Hide inactive entries from accessibility tree and announce current entry accessibly.
- CW-04: Live .eyebrow computed color rgb(107,138,154), font-size 8px. Journal background #ebe8e1 from source gives 2.997:1, below 4.5:1 normal-text requirement. Darken low-contrast secondary labels. Small desktop type is additionally a usability concern, not a minimum-font-size standards failure.

## Decisions and limits

Decision: retain the genuine external Daffodil Day donation destination, or use a final demo-only handoff? No donation changes made. Indexing and analytics unchanged; no inferred authorisation to modify them.

Remaining: specified five-size primary sample; Firefox and WebKit desktop/portrait smoke checks; 320px and short-landscape stress conditions; automated accessibility scan; native 200% zoom; reduced-motion runtime check; complete link destination checks and durable PNG export. Existing local QA-only runner prepares nine combinations and accessibility scans but has not run. No independent second review (optional routine mode). Live deployment commit could not be independently pinned; source revision above is the reviewed main checkout.

Approval needed only to push qa/charity-walk-routine to verified rkdb-nz/TabLab and open draft QA PR to trigger existing free Actions fallback. Reviewable change: qa/charity-routine.mjs plus adjustment of existing .github/workflows/sitecheck-readiness.yml. No product modifications or production publishing.


## Authorised hosted continuation (supersedes initial access limitation)

The user explicitly authorised pushing the QA branch to rkdb-nz/TabLab and running checks. Git CLI push lacked credentials; authenticated GitHub connector successfully uploaded the QA-only changes and opened draft PR #72: https://github.com/rkdb-nz/TabLab/pull/72 . No product modifications, merge or production publishing.

Run 39893493281 tested PR merge d6e58a28361ad17ba9fdfea907928e85b47771cf, QA head 5244e895b21c7f23699840471b9744caa6b63eb0, product main 21a372ce3d92c92b5b33e72b282ae0c98adab1fc. Chromium 151.0.7922.34 covered five outer CSS sizes (1440x900,390x844,844x390,320x568,780x300); Firefox 153.0 covered desktop and portrait. Reports record actual site viewport dimensions. Browser readiness proven by interactions and screenshot inspection. Twenty retained PNGs individually opened and inspected; review-ledger.json records each. Together with eleven earlier direct-browser captures, total routine captures so far: 31/40. Reports and downloaded original ZIPs are beside this file. Actions retention is 90 days (expires 21 January 2027); downloaded evidence is local and has not been committed remotely as binary files.

Chromium and Firefox report no page exceptions or first-party HTTP asset errors. Third-party analytics config and config.js requests to us-assets.i.posthog.com returned 404; analytics left unchanged pending decision. Empty required form and malformed email rejected in both engines. Diary controls open and increment. Mobile story/trail/support and neighbouring short layouts inspected. Reduced-motion ticker reports animation none, 0s. Chromium mobile fullscreen measured 390x844, returning to 382x763; gallery navigation passed. Automated hub accessibility scan returned zero violations; this narrow scan does not clear the manually established diary/contrast issues.

The Chromium desktop script's valid-form test accidentally allowed the default local form navigation after stopping the app listener, interrupting subsequent desktop scan/fullscreen/zoom-surrogate steps. No email opened or message sent: app handler was stopped, default target was the local runner. The initial successful Actions job is not represented as all checks passing. QA runner corrected to check validity without submitting. A focused Chromium desktop-only follow-up uses QA head d3be7cf6a1e9c3d7bb368b02a3cff2e059fe051a, run 39893757751; unchanged phone and Firefox evidence reused.

WebKit recovery failed before any browser launch: Playwright --with-deps install timed out at 240 seconds (exit 124) while Ubuntu mirror downloads were still in progress. Job 120218438314 has no screenshots/report. No repeated WebKit installation attempted. Native 200% zoom remains unverified: earlier hosted Control++ changed neither viewport nor device scale; headless CSS zoom, if completed, is only a surrogate. Real devices and Safari/iOS remain outside executed coverage. No independent review (optional routine mode).

New finding CW-05: In Chromium 780x300 short landscape, the wrapper toolbar shifts upwards after Story and Trail navigation. Compare 780x300-home.png and 780x300-support.png (intact toolbar) with 780x300-story.png and 780x300-trail.png (toolbar top clipped). Prevent outer wrapper focus/scroll displacement while keeping all inner content reachable. Inner-document clipping metrics alone missed this outer-page defect; visual evidence governs.

Findings CW-01–04 remain unchanged. Genuine Daffodil Day destination is retained under user approval. Indexing/analytics unchanged. Remaining browser coverage is explicitly limited, not a site failure. Product repairs have not been performed in this QA-only continuation.


Focused desktop completion outcome: Run 39893757751 also failed in the 240-second browser-install stage before executing the test script. No additional captures produced. Thus 31/40 routine captures were taken, with 20 exported Actions PNGs inspected and recorded plus 11 earlier browser-transcript captures. No more installation attempts. Missing checks: WebKit desktop/portrait, desktop automated scan, the runner desktop fullscreen/gallery repetition and CSS200 surrogate. Earlier direct desktop fullscreen/return and native-zoom attempt remain valid; native 200% zoom is not verified. Final status: Routine check incomplete: browser coverage limited.
