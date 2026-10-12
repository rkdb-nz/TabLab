# Mobile Spring content supplemental observations — partial

2026-10-12, Sub-Auditor forms_states. Existing host `/boardroom/mobile-preview` at preview b94ffb34. Chrome/CDP nested iframe responsive layouts only; no physical phone or model proof.

Method: host Website example selector→Dining; inner locator `frameLocator('#phone').frameLocator('iframe.foundry-demo-frame')`; read-only html ownerDocument measurements. Portrait host360×740 yielded settled child innerWidth352, innerHeight659. Landscape host740×360 yielded child732×308. Outer wrapper/HUD reduces actual available viewport.

| Content route | Orientation | Measured widths/heights | Observed result |
|---|---|---|---|
| Dining site | Portrait | child352×659; body/html scrollWidth337 | Home hero and3cards enumerated in rendered AX; Menu click caused no AX change. Nav Dine/Wine/Sign/Reviews rectangles width0. This one click supports inert-control suspicion, not independently verified diagnosis. |
| Dining dine | Portrait | child352×659; html scrollWidth337, scrollHeight3444 | Home Dine card activation transitioned to Dine after animation; all dinner menu items and Meet Clementine in AX. No root horizontal overflow measured. No lower-page scroll evidence recorded. |
| Dining dine | Landscape | child732×308; html scrollWidth717 | Host Landscape changed dimensions while preserving Dine. No root horizontal overflow measured; content clipping/scroll reachability not fully tested. |

Initial nested about:blank300×150 observed before loading was not adopted as final measurement. Correct settled AX showed Home then Dine, so no missing child-load defect inferred.

Attempt to continue after new task encountered discarded REPL binding (`fr is not defined`); supported rebind tab14 then returned `Tab not found in browser1`. Previous tab had ended and been cleaned up. No further fake continuity claims.

Remaining mobile coverage: Dining site landscape; Wine/Sign/Reviews both orientations; Retreat5 both orientations; Produce5 both orientations. Each remains unverified by this Sub-Auditor. No all15 completeness claimed. Principal may add separate evidence or create new controlled host session. Source/navigation alternatives may permit remaining routes despite hidden Dining header; not attempted here.

## Fresh-tab continuation (recoverable tab cleanup resolved)

Dining Menu Enter also leaves navlinks width0. Home landscape732×308 sw717 measured. Wine portrait352×659 sw337 sh3262; landscape732×308 sw717 sh2832. Sign portrait352×659 sw337 sh1896; landscape732×308 sw717 sh868. Home cards reached Wine/Sign; no submissions. Dining Reviews cannot be reached through displayed header at these widths; remains UI-blocked with existing S16, not environmental capability failure.

Retreat displayed Menu works after transition settles (earlier immediate AX was stale); do not classify Retreat Menu inert. UI links reached all5. Measurements below are html scrollHeight; allportrait child352×659 sw337, alllandscape732×308 sw717, so no root horizontal overflow measured.

|Retreat route|Portrait height|Landscape height|Content observed|
|---|---:|---:|---|
|site|3146|3745|collection hero and4cards|
|retreats|4510|5272|4houses,12gallerybuttons,inclusions|
|discover|5931|2772|8sceneheadings; missinghero retained|
|reviews|3610|3221|8testimonials|
|book|1839|1940|allformcontrols/location/footer|

Geometry+AX content scope only; no fullscroll/paintstate assurance yet. Immediate pretransition Discover measurement was discarded for Reviews; settled Reviews bothdimensions adopted.

## Theatre five-page geometry continuation

Displayed mobileMenu navigation reached all5; initial clickVenue required keyboardEnter alternative on samevisiblelink. No submission. Allportrait352×659 sw337; alllandscape732×308 sw717.

|Theatre route|Portrait scrollHeight|Landscape scrollHeight|Content observed|
|---|---:|---:|---|
|site|681|588|hero5images/headline/ticketCTA|
|now-playing|1518|916|synopsis default,tabbuttons,bookCTA|
|coming-soon|2373|1585|3productioncards|
|book-tickets|1852|1542|all6performance/3zone/quantity/summarycontrols|
|clementine-street#theatre|2407|1407|5tabs,TheTheatredefaultcontent/photos|

No horizontalrootoverflow measured in14reachablecontentpages; DiningReviews bothorientations inaccessible through displayed mobileUI owingS16. This is finite initialgeometry/AX coverage, not fullscrollorallstatepasses. Child actualviewport differs fromhostdimensions, screenshots/physicaldevices/keyboardbrowserchrome/touch not implied. Principal independently reproducedDiningMenuexistingS16.
