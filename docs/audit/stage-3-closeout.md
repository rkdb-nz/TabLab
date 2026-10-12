# Stage 3 closeout — 13 October 2026 NZ

Status: **closed with documented exceptions**, following the user's explicit approval to finish the supported review and close the report with limitations. This is an administrative end to the bounded Stage3 review, not a complete original audit, universal accessibility pass or full mobile sign-off. Exceptions remain unverified; no waived check is recorded as passed.

Repository rkdb-nz/TabLab; default main; branch audit/tab-lab-full-review. Site source baseline cf5fcbc24a14a2c85d140abc493d99e4036e86cb. Documentation predecessor a29ff82455bc8c424789506f1dbd19e6a5b7b13e. Approved design evidence remains the attributed October5–8 approvals recovered from uploadedStage1/2 handoffs, including deliberate page differences. Preview b94ffb34.foundry-a3k.pages.dev associated with baseline by handoff; deployed bytes not independently hashed. Source diff remains empty. No fixes, deletion, pushes, merges, publication or external submissions.

## Outcome

There is enough reproducible evidence to plan corrections and subsequent practical regression testing. All50default preview documents have Principal and separate-agent observations; this is not50complete-route passes. The finite focus review covers12demo identities and remaining Diner category/Pottery footer targets. Specific drawer/modal/history/form/navigation/ticket checks are documented, with observed failures preserved. Broad generic pending entries are replaced by the finite disposition below; no endless permutation testing is required to close this approved bounded stage.

| Check group | Disposition | Evidence |
|---|---|---|
| Default route observations | Observed50/50 by Principal and separate agent; no route-wide pass | stage-3-route-state-register.md, resource-scope.md/.json |
| Shared drawer boundaries | Verified failures S07; Escape return passes in sampled sequences | principal-review.md, sub-review.md |
| Nested history applicability | Non-history overlays/scroll controls reviewed; wrapper Back/Forward sampled, Tailor shop excluded from wrapper assumptions | nested-states.md, forms-states.md |
| Donut nested menu return focus | Resolved as verified failure, S3-K05 extension; outer fullscreen fallback is a different passing sequence | closeout reproduction below, nested-states.md, final-residuals.md |
| Theatre poster dialogs | Containment failure S3-K03; Escape return passes | principal-review.md |
| Theatre tickets | All3quantity families1–10/cap/decrement,6performances,3zones and representative mixed$148summary checked; exhaustive mixtures excluded | principal-review.md, forms-states.md |
| Theatre carousel | Separate agent observed natural third/fourth; Principal corroborated fourth; third independent visual verification exception | sub-review.md, principal-continuation.md |
| Tailor hashes/chapters | S3-H01 directhash and Arrow/Craft blank recovery independently reproduced | final-residuals.md, principal-continuation.md |
| Dining/Retreat safe form/navigation states | Agent sampled10page journeys; Principal confirmed P05 dialog failures; no real sends | forms-states.md, principal-review.md |
| Preview desktop host | All12targets and existing orientation controls checked | principal-review.md |
| Initial demo focus/control presentation |12identities, remainingDiner categories/Pottery footer completed by agent; no painted contrast pass | final-focus.md |
| Opaque text contrast | S3-C01/P04 failures independently calculated | contrast-review.md, contrast-calculations.json |
| Responsive supplementary checks |12demo defaults×2orientations;14reachableSpring pages×2 plus selectedcore/gallery states. P02/P06/S16 confirmed; mobile assurance partial | mobile-frame-checks.md/.json, mobile-spring-content.md, principal-continuation.md |
| Console sample | Only browser-extension metadata errors in captured sample; no complete clean claim | principal-continuation.md |

## Final Principal reproduction: nested Donut focus loss

13October2026 NZ /12OctoberUTC. Cloud Chrome/CDP top-level1363×936. Wrapper /boardroom/billboard/demos/donut/ displays its own responsive hamburger within nested iframe despite desktophost. Actual sequence: inner Openmenu → TheMenu → wait #overlay-menu.is-open → Escape → wait #overlay-menu[hidden]. Settled read-only DOM: activeElement BODY, activeId empty, mobile-menu-panel.hidden=true, overlay-menu.hidden=true, mobile-menu-toggle aria-expanded=false. Overlay closure succeeds; focus does not return to the visible opener. A first rapid sequence was excluded from the settled conclusion; the fully-open repeat independently reproduces the earlier separate-agent result.

Source public/boardroom/billboard/demos/donut/js/app.js38 closes the mobilemenu before44 records its inner TheMenu trigger;73–76 hides overlay then tries focusing that now-hidden trigger. Escape103–110 invokes closeAll. Preserve S3-K05 family, now supported by newly reproduced evidence rather than unavailable30821379 summary. Medium keyboard usability correction: return focus to visible hamburger when nested trigger is hidden, preserving directdesktoptrigger return and outerfallback behavior. No fix implemented.

## Exceptions retained without pass claims

- Complex image/gradient/translucent text and focus-indicator contrast: unmeasured. DOM colour pairs do not establish painted compliance. Requires pixel/background measurement across relevant states; deferred from this approved bounded closeout.
- Full hover/held-active states: no advertised hover input method used; no forcedCSS mutations. Initial naturalkeyboard presentation observed, not everyinteractionstate.
- True browserzoom, reducedmotion preference, alternateviewport/model/breakpoint sweeps, actual font-file use, comprehensive requests/console, nativefullscreen and physicaldevices: unavailable or not established by the supported environment. No unchanged failing calls retried indefinitely.
- ThirdTheatrecarousel visual Principal corroboration remains agent-only; bytehash/deployment attestation remains unavailable.
- DiningReviews responsiveUI blocked by S16; no hiddenlink/source injection used to invent mobilepass. CoreWhy/Start/fullAbout and everyremainingresponsivepainted/scroll/formstate lack complete verification; broadermobile work belongs to its own scope.
- Externalemail/payment/enquiry/donation submissions intentionally excluded from authorization. Local simulatedforms are not integrationproof.

## Ready for correction planning

Verified keyboard/focus, missingasset, Tailorstate, opaquecontrast, Diningmenu, Potteryoverflow and Theatremenu defects have concrete implementation recommendations in the canonical report. Design/content choices and legacyart intent remain separate decisions, not inferred fixes. Legacy retention remains documented in place; original review date11April2027 unchanged. No deletion authorized.

The next useful step is a separately authorized correction pass followed by practical desktop/phone regression testing. Originalsevenstagefullaudit and fullmobilecertification are not complete. This closeout ends Stage3 under its explicitly approved limitations; it does not erase gaps.
