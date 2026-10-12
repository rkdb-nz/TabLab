# Stage4 Principal verification — 13October2026 NZ

New repairs only; baseline source cf5fcbc, auditcloseout2210235. Source25b7f949ecd6580af72219501b954cc3b8f2fefa deployed successfully by Cloudflare to https://97f031ed.foundry-a3k.pages.dev/. Earlier repairs tested on71b54b2e (50c1a32) and09b65188 (19f34cf); unchanged public files compared in Git before carrying tests forward. Local public/README/notes bytecontent identical to remote25b7f94. Direct deployed JS/CSS binary downloads returnedHTTP403 for all9requests; do not claim deployed-byte hash attestation. Browser still rendered new source behavior normally. No bypass or repeated failures.

## Independently reproduced by Principal

|Finding|Actual result|
|---|---|
|S06|Fresh Whywebsite direct tab→Back lands at Home#explore instead ofabout:blank. Existing configuredfallback reused. Ordinary inpage history withstate retained by source; not allreferrer cases tested.|
|S07|Home drawer opened; eightnaturalTabs cycled toHome; maininert attribute present; Escape returnedOpenmenu/expandedfalse. Separate reviewer independentlyforward/reversecyclepassed.|
|S13|Ctrl-click About fromExplore leavesoriginaltab at#explore. Singleinterceptor preservesmodifiers,target,download/defaultprevented. Native downloading notexecuted.|
|S16|Dining DineportraitMenu opens4links; Reviews nowreachable. Reviewslandscape717×308, linksbottom141.59/183.19/224.78/266.38 allwithin308. Sign reachable. Home,Dine,Reviews,Sign exercised; Wine sharedhandler source, notseparatejourneyclaim.|
|S17/S18|DiningSignkeyboardEnter opensDresscode aria-expandedtrue; nativeTimeselect accepts7:15pm. Sourcepreserves21quarterhourvalues/default7pm. ActualtouchOSselector nottested.|
|P05Dining|Final97preview validlocaltestName→RequestTable immediatelyClosefocus/visibilityvisible; TabandShiftTabremainClose; Escape hidesandreturnsRequestTable. Earlierfirst/twopreview timingfailure wasfixedbyopacityonlytransition andguardeddocumentkeyhandling. Independentagentrepeatpasses.|
|P02/S25|Pottery337×659 portrait scroll337; allthreecardleft22/right315. Landscape717×308 scroll717. Separateagentindependentlyconfirms.|
|P06|Theatre landscape717×308 mobilepanel client250/scroll311/overflowauto. NaturalShiftTabtoClementineStreet scrollTop43 andlinktop257/bottom308,fullyvisible. LinkactivatesactualClementineStreetroute. No touchscrollcertification.|
|S2CSS01/S2N02|Hireactualformgridlandscape717px singlecolumn/formwidth672;portrait337px/form292; bothrootwidth=scrollwidth. No misplacedthreecolumnlayout.|
|S3F01|LocalHire withvalidrequiredvalues attendance201 rejects aria-invalidtrue/errorwhole1–200; formvisible/no success. Changingto200reacheslocalsimulatedconfirmation. Actualhandler mock blank1/200accept0/201/1.5reject alsoexecutedbyrepairagent. No enquiry sent.|
|S3C01|NowPlaying ComingSoon CTA computedforegroundrgb42,36,29 onopaqueparent239,235,230. Independentratio meetsnormaltextcontrast; approvedsurface/primarybutton retained.|
|S3K03|NowPlayingGlassRoom posterClose remainsfocusedafterTab/ShiftTab; Escape hidesandreturnsEnlargepostertrigger. Separate reviewer independentlysamepass. ComingSoonsharedcode, fullconsumerruntime notclaimed.|
|S01|Discoverhero correctedasset complete=true,naturalWidth1448. Independentrepairagentvisuallyconfirmed.|
|S21|Boardroom naturalwheel scrollY118; allcardcopybottom23pxinsidecardbottom; lastcardbottom860.94/copy837.94 within936viewport. root1348/1348. Separate reviewerinitial/finalscrollconfirmed.|
|S3H01/S3K04|Tailor finalpreviewdirect#details: scroller.scrollLeft0/detailsX0; settledheadingopacity1; details onlynoninertchapter. Initialopacity0/loading screenshotdiscarded afternaturalsettlement. IndependentreviewerArrow→Craftrecoveryscroll0/detailsX0paintedpass. Principalperformedown directhashstate/render check and reviewedhandler.|
|S04|Florist invalidemail click remains/site, typeMismatchtrue/validfalse, focusenquiry-email. Independentagentvalidlocalworkflowreachedsuccess.|
|P04|Actualgallerytextmatchesnewscopedcolour: Notice133,91,32;Skatekicker255,241,216/copy248,251,251;Springactive17,17,17on102,130,125. Independentopaque ratios5.3045/4.7884/5.1337/4.5447. Floristlabel112,107,100;RetreatBook/Locationcolourconfirmedbyseparateagent. No broadpaintedcontrastpass.|
|S3K05|NestedDonutportraitOpenmenu→TheMenu→waitis-open→Escape→waithiddenreturnsactualmobile-menu-toggle; panelhidden. Separateagentindependentlysamepass.|

Other verified source/results:22JavaScript syntaxchecks pass; whitespacecheckpasses; S05elevenlookbookalts verifiedagainstexistingcopy/filenames;P03accuratealt descriptionsdon'tchangeart. S24langsource verified. S19motion sourceguard/cascadefixes implemented; actualpreference runtime remainsunverified. Diner/Produce/Drillingclosedfocus andCharitystrip were renderedbyrepairagent; Principal independentlyinspectedthecode but didnotrepeat everyconsumer. Recordthelimitedverification ratherthaninferringuniversalpasses.

## Orientation default regression sweep

PrincipalusedexistinghostUIonly12selectoptions×Portrait/Landscape. EachactualnestedURLmatchedselecteddemo. All24rootclientwidth=scrollwidth. Actualnestedheight659/308. Donut,MiniGolf,Drilling,Diner,Produce,Charity,Tailor clients352/732; Florist,Pottery,Dining,Retreat,Theatre337/717 withscrollbar. This checksinitialgeometryandrotation, not everylowerpage,stateorpaintedregion. Host360×740/740×360 top-level1363×936Chrome/CDP. No arbitraryDOMviewportinjection or testproductfeatureadded.

Additionalpopularphoneprofiles(iPhone,GalaxyincludingA16,Pixel), exactbreakpoint-adjacentwidths, Safari/WebKit/Firefox, physicaltouch/browserbars/safeareas/virtualkeyboard, zoomandpreferenceemulation remainunverified. Actualfontloading,completeconsole/network,externaldelivery/nativefullscreen alsounverified. Thesearespecifictestinglimitations, notpassedchecks.
