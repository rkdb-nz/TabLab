module.exports=async h=>{
 const {R,p,go,settle,metrics,shot,check,error,save,formTests}=h;
 // A mobile-style menu is used at this desktop layout too; choose a reachable
 // opener, and open that menu when its Catering entry is initially hidden.
 try{
  await go(p,'/boardroom/billboard/demos/donut/site.html',[1440,900]);
  let opener=p.locator('[data-overlay="catering"]').filter({visible:true});
  if(!await opener.count()){
   await p.locator('#mobile-menu-toggle').click();
   await p.locator('#mobile-menu-panel').waitFor({state:'visible'});
   opener=p.locator('#mobile-menu-panel [data-overlay="catering"]');
  }
  await opener.first().click();
  await p.locator('#overlay-catering.is-open').waitFor({state:'visible'});
  await settle(p);
  await p.locator('#catering-enquiry').click();
  await p.locator('#catering-form').waitFor({state:'visible'});
  check('Donut Catering enquiry opens from native menu',await p.locator('#catering-enquiry').getAttribute('aria-expanded')==='true');
  const before=R.forms.length;
  await formTests(p,'nested donut-catering');
  const observations=R.forms.slice(before).filter(f=>f.key.endsWith('#catering-form'));
  check('Donut Catering empty form is invalid',observations.some(f=>f.state==='empty-submit'&&f.valid===false),observations.filter(f=>f.state==='empty-submit'));
  check('Donut Catering filled form was exercised',observations.some(f=>f.state==='filled-submit'));
  const text=await p.locator('#catering-form .form-status').innerText();
  check('Donut Catering result honestly says nothing sent',/demo only/i.test(text)&&/no enquiry has been sent/i.test(text),{text});
  R.interactions.push({label:'Donut Catering native nested route and result',metrics:await metrics(p)});
  await shot(p,'donut-catering-result',false);
  await p.keyboard.press('Escape');
  await p.locator('#overlay-catering').waitFor({state:'hidden'});
  const focus=await p.evaluate(()=>{const e=document.activeElement;return{id:e.id,overlay:e.getAttribute('data-overlay'),reachable:!!e.getClientRects().length&&!e.closest('[hidden],[inert]')}});
  check('Donut Catering Escape closes and restores reachable opener',focus.reachable&&(focus.id==='mobile-menu-toggle'||focus.overlay==='catering'),focus);
  save();
 }catch(e){error('Donut Catering scoped recovery',e)}
 // Find Us makes the hero shell inert. Its still-rendered hero contact links
 // must never be selected merely because a visibility test returns true.
 for(const action of ['call','directions'])try{
  await go(p,'/boardroom/noticeboard/demos/diner/site.html',[1440,900]);
  const ticker=p.locator('.ticker-toggle');
  if(await ticker.getAttribute('aria-pressed')==='false')await ticker.click();
  await p.locator('[data-panel="find-panel"]').click();
  await p.locator('#find-panel').waitFor({state:'visible'});
  await settle(p);
  await p.locator('#find-panel [data-demo-action="'+action+'"]').click();
  await p.locator('#contact-panel').waitFor({state:'visible'});
  await settle(p);
  check('Diner '+action+' reaches Contact from Find Us',await p.locator('#contact-panel').getAttribute('aria-hidden')==='false');
  await p.locator('#contact-panel [data-demo-complete="'+action+'"]').click();
  await p.locator('#contact-panel .demo-status').waitFor({state:'visible'});
  const text=await p.locator('#contact-panel .demo-status').innerText();
  check('Diner '+action+' completion is honest',action==='call'?/no call has been placed/i.test(text):/no real directions have been opened/i.test(text),{text});
  R.interactions.push({label:'Diner scoped '+action+' completion',metrics:await metrics(p)});
  if(action==='directions')await shot(p,'diner-directions-result',false);
  await p.keyboard.press('Escape');
  await p.waitForFunction(()=>document.querySelector('#find-panel').getAttribute('aria-hidden')==='false'&&document.querySelector('#contact-panel').getAttribute('aria-hidden')==='true');
  const innerFocus=await p.evaluate(()=>({insideFind:!!document.activeElement.closest('#find-panel'),action:document.activeElement.getAttribute('data-demo-action')}));
  check('Diner '+action+' Escape restores Find Us and its link',innerFocus.insideFind&&innerFocus.action===action,innerFocus);
  await p.keyboard.press('Escape');
  await p.waitForFunction(()=>document.querySelector('#find-panel').getAttribute('aria-hidden')==='true');
  check('Diner '+action+' second Escape restores main opener',await p.locator('[data-panel="find-panel"]').evaluate(e=>e===document.activeElement));
  save();
 }catch(e){error('Diner '+action+' scoped recovery',e)}
 // Dining's desktop spacer is a deliberate reveal journey, not blank content.
 // Drive the actual scroll/key controls rather than injecting its reveal class.
 for(const size of [[1440,900],[390,844]])try{
  await p.goto('about:blank');
  await go(p,'/boardroom/springboard/demos/dining/site.html',size);
  if(size[0]===1440){
   await p.locator('.trifold-sticky').scrollIntoViewIfNeeded();
   await p.waitForFunction(()=>{const r=document.querySelector('.trifold-sticky').getBoundingClientRect();const visible=Math.min(r.bottom,innerHeight)-Math.max(r.top,0);return visible/r.height>=.98});
   // Source-defined arming delay is 180ms after the observer's active state.
   await p.waitForTimeout(250);
   await p.keyboard.press('ArrowDown');
  }else{
   await p.keyboard.press('PageDown');
  }
  await p.waitForFunction(()=>document.querySelector('.trifold-wrap').classList.contains('cards-revealed'),null,{timeout:12000});
  await settle(p);
  check('Dining native Home reveal '+size,true,{classes:await p.locator('.trifold-wrap').getAttribute('class')});
  R.interactions.push({label:'Dining Home revealed by native controls '+size,metrics:await metrics(p)});
  // The general shot helper scrolls the whole document to reveal lazy images,
  // which would replace this deliberate viewport state with the hero.
  await require('./capture.cjs').capture(p,'dining-home-cards-'+size.join('x'),false,R,h.out);
  await p.locator('.trifold-wrap .panel[data-panel="dine"]').click();
  await p.waitForURL(u=>/\/dining\/dine(?:\.html)?$/.test(u.pathname),{timeout:15000});
  await settle(p);
  check('Dining revealed Dine card navigates '+size,true,{url:p.url(),title:await p.title()});
  save();
 }catch(e){error('Dining native Home reveal '+size,e)}
 // The mobile email route has a separate form and read-only destination fields.
 try{
  await p.goto('about:blank');
  await go(p,'/boardroom/springboard/demos/dining/sign.html',[390,844]);
  await p.locator('#open-email-request').click();
  await p.locator('#booking-email[open]').waitFor({state:'visible'});
  await settle(p);
  const before=R.forms.length;
  await formTests(p,'nested dining mobile');
  const observations=R.forms.slice(before).filter(f=>f.key.endsWith('#email-request-form'));
  check('Dining mobile email empty form invalid',observations.some(f=>f.state==='empty-submit'&&f.valid===false));
  await p.locator('#booking-confirmation[open]').waitFor({state:'visible'});
  const text=await p.locator('#booking-confirmation').innerText();
  check('Dining mobile confirmation is a no-send demonstration',/demo|demonstration/i.test(text)&&/no (booking|request|email)|not (been )?sent|not (been )?booked/i.test(text),{text});
  R.interactions.push({label:'Dining mobile email completion',metrics:await metrics(p)});
  await shot(p,'dining-mobile-email-result-final',false);
  await p.locator('#booking-confirmation .booking-confirmation-close').click();
  await p.locator('#booking-confirmation').waitFor({state:'hidden'});
  await p.waitForFunction(()=>document.activeElement.id==='open-email-request');
  check('Dining mobile completion restores request button',await p.locator('#open-email-request').evaluate(e=>e===document.activeElement));
  save();
 }catch(e){error('Dining mobile email targeted recovery',e)}

 // Complete the small finite state inventories left by the generic sampler.
 try{
  await p.goto('about:blank');
  await go(p,'/boardroom/noticeboard/demos/charity-walk/site.html',[390,844]);
  await p.locator('[data-open-view="diary"]').filter({visible:true}).first().click();
  await settle(p);
  const total=await p.locator('.mobile-diary-entry').count(),entries=[];
  check('Charity Diary has expected five entries',total===5,{total});
  for(let i=0;i<total;i++){
   if(i){await p.locator('[data-diary-step="1"]').click();await settle(p)}
   const counter=(await p.locator('[data-diary-current]').innerText()).trim();
   const text=await p.locator('.mobile-diary-entry.is-current').innerText();
   entries.push({index:i,counter,text});
   check('Charity Diary entry '+(i+1)+' is current',Number(counter)===i+1&&await p.locator('.mobile-diary-entry.is-current').count()===1,{counter,text});
  }
  check('Charity Diary entries are distinct',new Set(entries.map(e=>e.text)).size===total,{entries});
  await p.locator('[data-diary-step="-1"]').click();
  check('Charity Diary Previous reverses one entry',Number((await p.locator('[data-diary-current]').innerText()).trim())===total-1);
  R.interactions.push({label:'Charity Diary complete finite inventory',entries,metrics:await metrics(p)});save();
 }catch(e){error('Charity Diary finite controls',e)}
 try{
  await p.goto('about:blank');
  await go(p,'/boardroom/skateboard/demos/tailor/site.html#collection',[390,844]);
  const total=await p.locator('.lookbook-slide').count(),looks=[];
  check('Tailor Collection has expected six looks',total===6,{total});
  for(let i=0;i<total;i++){
   if(i){await p.locator('#look-next').click();await settle(p)}
   const counter=(await p.locator('#look-count').innerText()).trim();
   const text=await p.locator('.lookbook-slide.active').innerText();
   looks.push({index:i,counter,text});
   check('Tailor look '+(i+1)+' is active',Number(counter.split('/')[0].trim())===i+1&&await p.locator('.lookbook-slide.active').count()===1,{counter});
  }
  check('Tailor collection views are distinct',new Set(looks.map(e=>e.text)).size===total,{looks});
  await p.locator('#look-next').click();
  check('Tailor Next look wraps to first',Number((await p.locator('#look-count').innerText()).split('/')[0].trim())===1);
  await p.locator('#look-prev').click();
  check('Tailor Previous look wraps to last',Number((await p.locator('#look-count').innerText()).split('/')[0].trim())===total);
  R.interactions.push({label:'Tailor Collection all looks',looks,metrics:await metrics(p)});
  await go(p,'/boardroom/skateboard/demos/tailor/site.html#details',[390,844]);
  const details=p.locator('.mobile-craft-accordion details'),n=await details.count(),panels=[];
  check('Tailor Craft has native disclosure controls',n>0,{total:n});
  for(let i=0;i<n;i++){
   const d=details.nth(i);await d.locator('summary').click();
   const open=await d.evaluate(e=>e.open),openCount=await p.locator('.mobile-craft-accordion details[open]').count();
   const text=await d.innerText();panels.push({index:i,text,open});
   check('Tailor Craft disclosure '+i+' opens exclusively',open&&openCount===1,{openCount,text});
   await d.locator('summary').press('Enter');
   check('Tailor Craft disclosure '+i+' closes with keyboard',!await d.evaluate(e=>e.open));
  }
  R.interactions.push({label:'Tailor Craft native disclosures',panels,metrics:await metrics(p)});save();
 }catch(e){error('Tailor finite collection/disclosures',e)}
 try{
  await p.goto('about:blank');
  await p.emulateMedia({reducedMotion:'no-preference'});
  await go(p,'/boardroom/skateboard/demos/pottery/mobile.html',[390,844]);
  await p.locator('#scene-next').click();await settle(p);
  const motion=p.locator('#maker-motion');
  check('Pottery maker normal mode offers Pause photos',/Pause photos/i.test(await motion.innerText()));
  await motion.click();
  check('Pottery maker Pause sets pressed state',await motion.getAttribute('aria-pressed')==='true');
  const before=await p.locator('.maker-images img').evaluateAll(els=>els.findIndex(e=>e.classList.contains('selected')));
  // The source rotates maker photographs every 6.5s; pause must survive one interval.
  await p.waitForTimeout(6700);
  const after=await p.locator('.maker-images img').evaluateAll(els=>els.findIndex(e=>e.classList.contains('selected')));
  check('Pottery maker pause holds photograph beyond a full interval',before===after,{before,after});
  await motion.click();
  check('Pottery maker Play resumes unpressed state',await motion.getAttribute('aria-pressed')==='false');
  await p.emulateMedia({reducedMotion:'reduce'});
  await go(p,'/boardroom/skateboard/demos/pottery/mobile.html#maker',[390,844]);
  const previous=await p.locator('.maker-images img').evaluateAll(els=>els.findIndex(e=>e.classList.contains('selected')));
  check('Pottery maker reduced mode offers Next photo',/Next photo/i.test(await motion.innerText()));
  await motion.click();await settle(p);
  const next=await p.locator('.maker-images img').evaluateAll(els=>els.findIndex(e=>e.classList.contains('selected')));
  check('Pottery reduced Next photo advances photograph',previous!==next,{previous,next});
  R.interactions.push({label:'Pottery maker normal/reduced controls',normalPaused:{before,after},reducedNext:{previous,next},metrics:await metrics(p)});
  await p.emulateMedia({reducedMotion:'no-preference'});
  await go(p,'/boardroom/skateboard/demos/pottery/mobile.html#collection',[390,844]);
  const collections=[];
  for(let i=0;i<3;i++){
   if(i){await p.locator('#collection-next').click();await settle(p)}
   const counter=(await p.locator('#collection-count').innerText()).trim(),title=await p.locator('#collection-title').innerText();
   collections.push({index:i,counter,title});
   check('Pottery collection '+(i+1)+' selected',Number(counter.split('/')[0].trim())===i+1,{counter,title});
  }
  check('Pottery three collection titles are distinct',new Set(collections.map(e=>e.title)).size===3,{collections});
  await p.locator('#collection-next').click();
  check('Pottery collection Next wraps first',Number((await p.locator('#collection-count').innerText()).split('/')[0].trim())===1);
  await p.locator('#collection-prev').click();
  check('Pottery collection Previous wraps last',Number((await p.locator('#collection-count').innerText()).split('/')[0].trim())===3);
  R.interactions.push({label:'Pottery all three collections',collections,metrics:await metrics(p)});save();
 }catch(e){error('Pottery finite maker/collection controls',e)}

};
