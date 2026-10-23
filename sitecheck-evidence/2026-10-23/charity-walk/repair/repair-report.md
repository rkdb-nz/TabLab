# Charity Walk repair check

Five approved findings CW-01–05 repaired on preview only. No production merge or publication. Genuine Daffodil Day destination, imagery, indexing and analytics unchanged.

Preview: https://0272abaf.foundry-a3k.pages.dev/boardroom/noticeboard/demos/charity-walk/
PR: https://github.com/rkdb-nz/TabLab/pull/72
Product/QA head: 4ba06468bab5f06156caed390e77e09bb01b2585
Actions run: 39895501837. Exact tested merge revision recorded in each report.json.

## Resolved

- CW-01: Desktop valid submission ends in a native modal explaining demo only, not sent. Mobile Support opens a labelled form with required fields, then the same final confirmation. No mailto remains in this demo; no mail or server submission occurs. Form text preserved and Done restores trigger focus. Real donation link retained.
- CW-02: Screen changes focus Journey using preventScroll, and return restores the originating hub tile. Inactive views become inert before delayed visual hiding.
- CW-03: Inactive diary articles aria-hidden and inert; only current entry exposed, with polite atomic live region. Next/previous, counter and visibility stay in sync.
- CW-04: Secondary blue changed from #6b8a9a to #425e6b. Computed WCAG contrast against journal #ebe8e1 now 5.64:1 (previously 3.00:1); other solid light card colours 6.14–6.83:1. Small typography is not claimed as a minimum-font-size standards failure.
- CW-05: Charity wrapper body fixed to viewport; overflow clipped at this wrapper only. Mobile focus uses preventScroll. Header y=0 and navigation y>=0 verified after every screen opening at each sampled size. 780x300 Story/Trail screenshots confirm complete toolbar; header-pixel comparison with landing shows identical top rows. No shared wrapper consumers changed.

## Validation

Targeted runner uses existing pinned Playwright/axe dependencies and Actions fallback. Browser installation omits apt dependency update this time, avoiding the earlier four-minute mirror bottleneck. Chromium 151.0.7922.34 passes 92 checks at 1440x900,390x844,844x390,320x568,780x300. Firefox 153.0 passes 29 checks at desktop/portrait. Zero assertion failures and zero page exceptions across these seven executed combinations. Two targeted axe scans (desktop confirmation, mobile diary) return zero violations. Invalid required form and email checked; mobile and desktop final no-send flows exercised. Focus, diary accessibility, rotation, wrapper fullscreen/return/gallery checked. Original unchanged feature evidence reused from initial routine report; no exhaustive rerun.

Fifteen Actions PNGs individually opened and inspected; ledger records each. Two additional direct deployed-preview screenshots inspected (initial immediate screenshot preceded dialog paint; settled screenshot confirms readable no-send modal). Hosted Chrome executed deployed desktop form and checked Done restores focus to Send trail note. Source-run screenshots are not presented as deployed-page screenshots.

## Remaining / limitations

WebKit binary downloaded, but launch failed for missing Ubuntu libraries (including libgtk-4.so.1, libgraphene-1.0.so.0, GStreamer and related libraries); exact list in screens/webkit/report.json. Its successful Actions job is not a browser pass: zero WebKit checks/captures. Two planned WebKit combinations remain unverified. Native 200% zoom remains unverified; earlier hosted shortcut attempt changed neither viewport nor device scale. Emulated Linux phones are not physical phones or native Safari/iOS. Optional independent review not used.

No remaining approved product finding and no new product regression identified in available sample. Overall routine browser coverage remains limited, with all five repairs verified in available engines. Existing analytics requests returning 404 remain a pending analytics decision; analytics configuration not modified.

Evidence: screenshots, original downloaded artifact ZIPs, machine reports and review ledger alongside this file locally. Text reports and ledger also preserved on QA branch; Actions binary artifacts expire after 90 days. No claim that local screenshot files have been committed remotely.

Publishing must apply only the four Charity Walk product files from the approved preview; do not merge the branch QA workflow changes into main merely to publish the demo.
