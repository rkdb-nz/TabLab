# Separate contrast review — Stage 3 recovery

Date: 2026-10-12 UTC. Preview: https://b94ffb34.foundry-a3k.pages.dev/. Browser cloud Chrome/CDP; engine/version not exposed in this review. Read-only DOM computed-style measurement; actual viewport 1363×936 CSS pixels. This is desktop observation, not device testing. Preview bytes not hashed against baseline.

## Reproducible findings awaiting Principal reproduction

Navigate to each route, inspect selector using getComputedStyle, confirm the nearest opaque panel has no background image and element/panel have no painting pseudo-elements. Use WCAG sRGB relative luminance and (Llighter+.05)/(Ldarker+.05). Alpha foreground composite is applied in sRGB against the opaque panel first.

| Route | Selector/text | Foreground | Opaque background | Font | Ratio | Result |
|---|---|---|---|---|---:|---|
| /boardroom/noticeboard/ | .board-kicker, 02 / NOTICEBOARD | rgb(207,143,57) | .board-intro rgb(246,241,230) |12px 800|2.44|Below 4.5 normal-text threshold|
| /boardroom/skateboard/ | .board-kicker, 03 / SKATEBOARD |rgb(227,168,78)|.board-intro rgb(124,103,86)|12px 800|2.54|Below 4.5|
| /boardroom/skateboard/ | .board-copy |rgba(248,251,251,.78), composite (220.72,218.44,214.70)|.board-intro rgb(124,103,86)|15px 400|3.85|Below 4.5|
| /boardroom/springboard/ | a.active, SPRINGBOARD |rgb(255,255,255)|element rgb(102,130,125)|14px 800|4.16|Below 4.5|

Opaque-panel checks also yielded Billboard heading/tagline 12.80; kicker5.99; alpha copy7.38. Noticeboard heading/tagline15.12 and alpha copy5.94. Skateboard heading/tagline5.13. These apply only to measured selectors, not whole-page compliance.

## Painted-background limitation

Read computed styles on Home, Care, About, Why, Boardroom and all four galleries, selecting all visible a/button/h1/h2/h3/p/label/input/select/summary elements. Core page foregrounds encountered image, gradient, transparency or opacity ancestors; their contrast remains unverified by this method. All gallery introductory paragraphs and headings were inspected separately, and alpha foreground errors corrected. A naive Noticeboard 'in action' label versus HTML black produced1.11, but screenshot and body pseudo-elements showed cream painted underneath: that invalid pair was discarded. Other transparent ancestors/pseudo painting, gallery title imagery, CTA gradients, card artwork, SVG header controls, drawer gradient/translucent text and focus indicator contrast require reliable painted-background measurement. No broad pass claimed.

## Natural keyboard observations

Home: click Open menu; Tab naturally moves from toggle to Home drawer button. Its computed outline was `rgba(216,168,111,.996) none 3px`, shadow none; screenshot shows highlighted Home text. Escape closes and returns focus to toggle (aria-label Open menu). This is successful Escape return in this state only; not proof of general containment.

Noticeboard: from direct entry, Tab focuses Boardroom return link with solid2px rgb(207,143,57) outline.

Springboard: from direct entry, Tab focuses Boardroom return link with solid2px rgb(215,164,72) outline. Click Open menu; natural Tab goes to Home link; outline `rgba(244,231,211,.84) none 3px`. Escape closes and returns focus to menu toggle. Focus was not synthetically assigned by DOM code.

## Exact incomplete scope

No reliable painted-pixel contrast measurements performed. No full closed/open keyboard loop or focus visibility sweep for every control, gallery card or core page; no mouse-close versus keyboard-close comparison across every drawer consumer. Home secondary Make/Choose panel states not measured here. Hover/active/disabled/invalid form control-state contrast not covered. No alternate viewport, zoom/reflow, reduced-motion, touch, font-loading, full network/console audit or native fullscreen conducted. Root must combine this evidence with other agents and independently reproduce candidate failures; this file does not establish Stage3 completion.

## Continuation: exhaustive gallery solid-style and core drawer boundaries

Principal independently reproduced the four contrast pairs above; retain these as **P04 extensions**, not new finding IDs.

On all four galleries, normal-state direct text nodes were enumerated across all visible body descendants (including nested strong/span card labels), rather than measuring only anchor inherited colours. Nearest opaque panel method, composited foreground alpha, opacity/gradient/image/translucent and painting pseudo-element exclusions applied. Active-tab ratios: Billboard11.10, Noticeboard10.68, Skateboard5.30, Springboard4.16. Bold inline intro copy: Billboard12.81; Noticeboard15.12. No additional defensible opaque-pair failure beyond P04 extensions.

Exact normal-state painted gaps on all galleries: Boardroom return label (pseudo rendering font0 plus gradient), inactive navigation (gradient), CTA (translucent), 'in action' label (body pseudo paint), gallery heading (opacity/pseudo), each of three card title and Open site labels (translucent child surface); Springboard entire intro panel (translucent). Earlier inherited demo-card anchor pass values do not prove child-label contrast and must not be used for that purpose.

Natural forward Tab visited all **10 gallery focus targets on each of four routes**: Boardroom return; Billboard/Noticeboard/Skateboard/Springboard navigation; CTA; three demo cards; menu toggle. Each of first9 targets computed solid2px focus outline in route accent: Billboard21715467; Noticeboard20714357; Skateboard22716878; Springboard21516472. Toggle computed solid1px rgba(21916495,.82). Active-tab text foreground/background was unchanged in focused state. All other target text uses painted/translucent backgrounds; focus outline existence is verified, minimum contrast of the outline against surrounding painted surface unverified. Hover interaction is not exposed by the supported locator/native API in this environment; forced :hover via DOM mutations was not used. No disabled gallery controls were observed.

### Core drawer boundary reproduction — existing shared focus finding extension

Routes independently tested: /, /foundrycare/, /the-foundry/, /whywebsite/, /boardroom/.

On each: direct entry, click Open menu. Natural Tabs1–7 = Home, Boardroom, Care, About, Why, Make me a site, Contact. Tab8 leaves web focus (document.activeElement BODY); Tab9 returns to background page target while drawer remains open:
- Home: Make me a site hero button.
- Care: TABLAB brand link.
- About and Why: Tab Lab brand link.
- Boardroom: TAB LAB mobile wordmark link.

From newly opened drawer toggle, Shift+Tab also escapes drawer: Home/Care/About/Why goes to header Home anchor; Boardroom goes to background Springboard card. Thus verified absence of closed focus boundary on these five consumers, not an extrapolated all-site result. Forward reverse-back from background traverses BODY then Contact then Make me a site. Escape from those states closes drawer and returns focus to Open menu toggle on all five.

Supported scope closed here: all four gallery normal text opaque-pair inventory, all40 natural gallery focus targets, all5 core drawer forward/reverse boundary checks and Escape return. Still unverified: all enumerated painted-surface contrast, pointer hover, active pointer-held styles, focus-outline contrast, unrelated demo form states, alternate viewports/zoom/reduced motion. No global contrast/accessibility pass.
