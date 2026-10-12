# Finite desktop focus review — twelve demo identities

2026-10-12 UTC. Separate agent; cloud Chrome/CDP1363×936. Existing preview b94ffb34.foundry-a3k.pages.dev. Each direct path `/boardroom/<family>/demos/<name>/site.html` redirects to extensionless `/site`. Source baseline unchanged. Each observation used natural Tab, read-only activeElement/computed styles; no synthetic focus, form submission, email, donation or source mutation.

## Controls actually visited

| Demo | Natural sequence inspected | Focus evidence |
|---|---|---|
| Donut | Brand; Menu; Story; Locations; Catering; Order Now; BODY; brand | Brand UAauto1px. Nav outline none but nav surface/shadow changes; Order ring3px cream + glow. Translucent nav background; no contrast pass. |
| Mini Golf | Course; Above Par; Parties/Events; Book; BODY; cycle repeats | All4 hotspots solid5px white outline and translucent white fill. Painted-image outline contrast unverified. |
| Drilling | Menu; close; Services; About; Projects; Safety; Quote; BODY | Menu/close solid2px orange; regular drawer solid3px text-colour; Quote solid2px lightorange. Closed drawer receives focus without activation; existing hidden-focus issue, not new ID. |
| Diner | Menu; Find; address; phone; panelclose; Burgers; HotDogs; Pizzas | Menu/Find outline none, coloured shadow. Links and hidden panel controls UAauto1px. Existing hidden-panel issue corroborated. |
| Produce | Brand; About; Find; board-zone; two panelclose buttons; BODY; repeat | Links/buttons UAauto1px; board-zone outline none/shadow none; closed panelclose controls reachable. Existing keyboard issues need remediation; no new duplicate ID. |
| Charity Walk | Donate; Support; name; email; message; Send; BODY; repeat | Links auto3px; fields outline none with2px rgba green shadow; Send UAauto1px. No activation/transmission. |
| Florist | Brand; Collections; Enquire; Explore; email; name/email/phone; date segments; type select; message; Send; BODY; brand | Links UAauto1px, submitauto3px. Fields outline none; source focus bottom-border ink transition. Date segments included. Full initial cycle closed after recovery. |
| Pottery | Brand; Studio; Process; Collections; Visit; Explore; Process CTA; Plan visit; workshops; name/email/message; Send; footerStudio/Process | Links UAauto1px, submit/footerauto3px. Settled textarea focus background255254251 / border176140110 / nooutline: focus presentation exists via border+background. No claim absent focus merely from outline:none. |
| Tailor | Brand; House; Collection; Craft; Visit; EnterAtelier; Viewcraft; TurnBack; TurnPage; two Bookvisit; BODY | UAauto1px links/arrows, primaryauto3px. Hidden chapter focus may overlap known chapter state issue; no extra claim. |
| Dining | Logo; Dine/Wine/Sign/Reviews; three main panels; BODY; repeat | Header UAauto1px; mainpanels solid2px gold + existing shadows. Image-backed labels/panels contrast not measured from inherited divcolor. |
| Retreat | Logo; Home/Retreats/Discover/Reviews/Book; four retreat cards; Checkavailability; BODY | Headerauto3px (logo1px); cardUAauto1px; CTAauto3px. White foreground on opaque dark CTA and darkcard surface; photographic header ratio unverified. |
| Theatre | Skip; Brand; Home/NowPlaying/ComingSoon; Booknav; Venue; Bookhero; What'sOn; email; Accessibility; BODY | Skip/brand/email/footerUAauto1px; textnav/CTAs auto2–3px. HeroBook opaque burgundy background; others translucent/photo. Existing lowerCTA contrast separately P04/S3-C01. |

## Exact finite gaps and interpretation

Normal initial-state focus presentation is inspected for all12demo identities. This closes the generic 'no demo focus review' gap. It does not imply every page/state passes. Relevant menu/modal/form-success boundary behaviors are already covered by other agents and known findings; do not invent endless quantity/permutation retests.

Remaining rendered-pixel measurement gap: indicator/text minimum contrast where photo/gradient/translucent surface occurs (Donut navigation and primary; MiniGolfhotspots; Drillingmenu/active/quote; Dineractions; Produceboard; Floristphoto/translucent navigation; PotteryheroCTA; Tailorchapterphoto; Diningpanels; Retreatheader; Theatreheader/hero ghost). Opaque field style inspection confirms existence or removal of outline plus compensating border/shadow, but border/shadow contrast needs settled paintedmeasurement to claim compliance.

Finite unvisited focus targets: Diner remaining category buttons beyondPizzas (shared same control style), Pottery footer links beyondStudio/Process (shared same style). No new menu/modal opens performed in this pass: rely on specific existing records, not inferred passes. Hover/pointer-held states lack supported hover method; do not force CSS via mutation. Zoom/viewport/reducedmotion remain environment gaps elsewhere.

A longer form-cycle batch timed out and reset the browserREPL. Recovery used one freshFlorist tab and short bounded actions; Florist cycle completed and Pottery form targets inspected. Initial computed values during bordertransition were not treated as final: settled Potterytextarea has visible border+background change despite outline:none.

## Final finite set closures

Diner: naturally continued after Pizzas through Salads, Fries&sides, Breakfast, Shakes, Drinks, Desserts, Kids, second panelclose, phone, email, OpeninMaps, BODY theninitialcontrols. Everyremainingcategory andlink computed UAauto1pxoutline. No activation; closedpanelcontrols still receivefocus, extending existinghiddenfocusfinding.

Pottery: allfooterlinks naturally visited: Studio, Process, Gallery, Workshops, FindUs, Contact, Instagram, Journal, Newsletter, thenBODY. Each computed auto3px rgba232226217outline. No linkactivation. Thus the two previously listed finiteunvisitedsets are closed. Only painted/complex indicatorcontrast and unavailablehover/viewportstates remain for this focus pass; do not retain these two sets as pending.
