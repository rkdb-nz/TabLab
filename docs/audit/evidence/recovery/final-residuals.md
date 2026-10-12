# Independent final residual checks

2026-10-12, Chrome/CDP tab9, desktop1363×936, preview b94ffb34. No source fixes or external actions.

## Donut wrapper hidden-trigger focus suspect

Fresh donut/ wrapper, click Open example in full screen. Observed CSS fallback: document.fullscreenElement absent, body.demo-expanded-mode. Exit button focused; trigger rect0×0 while expanded. Tab moves focus to BODY/browser boundary, not hidden trigger. Escape removes expanded mode and focuses visible trigger rect132×32 at1125,7.5; next Tab goes visible Home. Exact sampled fallback enter/Tab/Escape/Tab sequence passes focus return; suspect hidden trigger focus not reproduced. Native-fullscreen success unverified; nested-iframe Escape not covered by this sequence.

Source public/boardroom/demo-browser.js30–35 sync focuses exit while active and trigger while inactive;40–49 fallback,51–59 exit/Escape. Do not derive a blanket wrapper focus pass.

## Tailor Arrow/Craft recovery — failure reproduced again

Fresh direct tailor/site.html#details → Right → click visible Craft. Wait until indicator settles04Details04/05. Actual screenshot blank under header, despite correct indicator. DOM #scroller.scrollLeft4089, #track transform translate3d(-4089px,0,0), track rect.x=-8178 and #details rect.x=-4089. Native hash scrolling and JS chapter translation compound, pushing selected chapter offscreen. Observed twice across separate tabs; Principal verification still required for independent acceptance.

Source public/boardroom/skateboard/demos/tailor/js/app.js86–89 initial parser handles only boutiques/collection;54–73 goTo chooses targetX=-index*innerWidth;77–84 animate translates track without resetting scroller.scrollLeft;147–151 Craft/data-goto and Arrow handlers. Initial hash defect remains S3-H01; recommend extending that finding with recovery failure rather than duplicating.
