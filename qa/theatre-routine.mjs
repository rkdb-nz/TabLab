import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const require=createRequire(import.meta.url),pw=require('playwright'),engine=process.env.QA_BROWSER||'chromium',root=resolve('public'),out=resolve('qa/theatre-results',engine),base='/boardroom/springboard/demos/theatre/';
await mkdir(out,{recursive:true});
const report={engine,commit:process.env.GITHUB_SHA,checks:[],captures:[],errors:[],scans:[],assets:[],console:[],links:[],limits:[]};
const server=createServer(async(req,res)=>{try{let p=resolve(root,'.'+new URL(req.url,'http://local').pathname);if(!p.startsWith(root+'/'))throw Error();if((await stat(p)).isDirectory())p+='/index.html';res.writeHead(200,{'Content-Type':({'.html':'text/html','.css':'text/css','.js':'application/javascript','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'})[extname(p)]||'application/octet-stream'}).end(await readFile(p));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
const check=(label,evidence)=>report.checks.push({label,evidence});
async function settle(f){await f.locator('body').evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));await Promise.all(document.getAnimations().filter(a=>a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})));});}
async function cap(p,f,label){await settle(f);await p.screenshot({path:resolve(out,label+'.png')});report.captures.push({file:label+'.png',outer:await p.evaluate(()=>[innerWidth,innerHeight]),frame:await f.evaluate(()=>[innerWidth,innerHeight]),inspected:false});}
async function measure(f,label){check(label,await f.evaluate(()=>({viewport:[innerWidth,innerHeight],scroll:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],controls:[...document.querySelectorAll('a,button,input,select,.faq-q')].filter(e=>e.getClientRects().length).map(e=>({text:e.textContent.trim().slice(0,45),tag:e.tagName,tab:e.tabIndex,rect:(()=>{let r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}})()}))})));}

let browser;
async function probe(label,fn){try{await fn();}catch(e){report.errors.push({label,error:e.stack});}}
async function layout(f,label){check(label,await f.evaluate(()=>({viewport:[innerWidth,innerHeight],document:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],main:[...document.querySelectorAll('main,.np-pane,.clem-center,.clem-right,.book-left,.book-right,#mobilePanel')].filter(e=>e.getClientRects().length).map(e=>({class:e.className,id:e.id,client:[e.clientWidth,e.clientHeight],scroll:[e.scrollWidth,e.scrollHeight],overflow:getComputedStyle(e).overflow,rect:(()=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,bottom:r.bottom};})()}))})));}
async function scan(f,label){await f.addScriptTag({path:require.resolve('axe-core/axe.min.js')});report.scans.push({label,violations:await f.evaluate(async()=>{const r=await axe.run();return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({html:n.html,summary:n.failureSummary}))}));})});}
async function booking(f,p,tag,capture){
 await f.goto(origin+base+'book-tickets.html');await settle(f);await layout(f,tag+' booking');
 check(tag+' empty checkout disabled',await f.locator('#checkoutBtn').isDisabled());
 await f.locator('[data-type=adult] [data-dec]').click();check(tag+' quantity floor',await f.locator('[data-type=adult] [data-val]').innerText());
 await f.locator('.perf-btn').first().click();await f.locator('.zone-card').first().click();
 for(const type of ['adult','concession','under25'])await f.locator('[data-type='+type+'] [data-inc]').click();
 check(tag+' mixed price $106',await f.locator('#sumTotal').innerText());
 if(capture)await cap(p,f,tag+'-booking');
 await f.locator('#checkoutBtn').click();await f.locator('#completeDemoBooking').click();
 check(tag+' truthful no payment result',await f.locator('#demoBookingResult').innerText());
 if(capture)await cap(p,f,tag+'-booking-result');
 await f.locator('#anotherBooking').click();check(tag+' reset',await f.locator('#sumTotal').innerText());
}
try{
 browser=await pw[engine].launch(engine==='chromium'?{channel:'chrome'}:{headless:true});report.version=browser.version();
 const sizes=engine==='chromium'?[[1440,900],[390,844],[844,390],[320,568],[780,300]]:[[1440,900],[390,844]];
 for(const [width,height] of sizes){
 const tag=width+'x'+height,c=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'}),p=await c.newPage();
 await c.route('**/*',r=>['GET','HEAD'].includes(r.request().method())?r.continue():r.abort());
 p.on('pageerror',e=>report.errors.push({tag,error:e.message}));p.on('response',r=>{if(r.status()>=400)report.assets.push({url:r.url(),status:r.status()});});
 try{
 await p.goto(origin+base);let f=p.frames().find(f=>f.url().includes('site.html'));await settle(f);await cap(p,f,tag+'-home');await layout(f,tag+' home');
 await probe(tag+' nav',async()=>{
 if(width<981){await f.locator('#menuBtn').click();check(tag+' menu opened',await f.locator('#menuBtn').getAttribute('aria-expanded'));
 await layout(f,tag+' open menu');
 if(engine==='chromium'&&width===390){await cap(p,f,'phone-menu');await p.setViewportSize({width:844,height:390});await cap(p,f,'rotated-menu');await layout(f,'rotated menu');await p.setViewportSize({width,height});}
 await f.locator('#mobilePanel a[href*="now-playing"]').click();
 }else await f.locator('.nav a[href*="now-playing"]').click();
 await f.waitForURL('**/now-playing.html*');check(tag+' nav result',f.url());
 });
 await probe(tag+' booking',()=>booking(f,p,tag,(engine==='chromium'&&(width===1440||width===390))||(engine!=='chromium'&&width===390)));
 if(engine==='chromium'&&width===1440){
  await f.goto(origin+base+'now-playing.html');await settle(f);await scan(f,'Now Playing default');await cap(p,f,'now-playing');
  for(const id of ['note','cast','details','syn']){await f.locator('[data-tab='+id+']').click();check('now tab '+id,await f.locator('[data-pane='+id+']').isVisible());}
  await cap(p,f,'now-playing-details');
  await f.locator('.np-poster-trigger').click();await cap(p,f,'now-poster');
  await f.locator('#csLightboxClose').press('Tab');check('poster tab focus contained',await f.locator('#csLightbox').evaluate(e=>e.contains(document.activeElement)));await f.locator('#csLightboxClose').press('Escape');
  await f.goto(origin+base+'coming-soon.html');await settle(f);await scan(f,'Coming Soon');await cap(p,f,'coming-soon');
  for(let i=0;i<3;i++){await f.locator('.cs-poster-trigger').nth(i).click();check('poster '+i+' image',await f.locator('#csLightboxImage').evaluate(i=>({src:i.currentSrc,ok:i.naturalWidth>0})));if(i===2)await cap(p,f,'coming-poster');await f.locator('#csLightboxClose').click();}
  await f.goto(origin+base+'clementine-street.html');await settle(f);await scan(f,'Venue default');await cap(p,f,'venue-theatre');
  for(const id of ['hire','technical','accessibility','find']){await f.locator('[data-panel='+id+']').click();check('venue tab '+id,{visible:await f.locator('#'+id).isVisible(),hash:await f.evaluate(()=>location.hash)});if(id==='accessibility'||id==='find')await cap(p,f,'venue-'+id);}
  await f.locator('[data-panel=hire]').click();await settle(f);await cap(p,f,'venue-hire');
  const form=f.locator('#hireForm');await form.locator('[type=submit]').click();await cap(p,f,'hire-errors');check('hire invalid focus',await f.evaluate(()=>document.activeElement.outerHTML));
  await f.locator('#fName').fill('QA Example');await f.locator('#fEmail').fill('bad-email');await f.locator('#fType').selectOption({label:'Rehearsal'});await f.locator('#fMsg').fill('Testing the demonstration only.');await form.locator('[type=submit]').click();check('hire bad email error',await f.locator('#fEmail').getAttribute('aria-invalid'));
  await f.locator('#fEmail').fill('qa@example.invalid');await f.locator('#fAtt').fill('999');await form.locator('[type=submit]').click();await cap(p,f,'hire-result');check('hire result and invalid attendance',await f.locator('#formSuccess').innerText());await f.locator('#sendAnotherBtn').click();check('hire reset',await f.locator('#fName').inputValue());
  await f.goto(origin+base+'book-tickets.html');await settle(f);await scan(f,'Booking default');
  await f.goto(origin+base+'site.html');await settle(f);await scan(f,'Home reduced motion');check('reduced sequence static',await f.locator('.home-hero-image.is-active').getAttribute('data-seq'));
  await p.emulateMedia({reducedMotion:'no-preference'});await p.waitForTimeout(2600);check('normal motion controls',await f.locator('button').allTextContents());await p.emulateMedia({reducedMotion:'reduce'});
 }
 if(engine==='chromium'&&width===390){
  await f.goto(origin+base+'coming-soon.html');await settle(f);await cap(p,f,'coming-soon-phone');
  await f.goto(origin+base+'clementine-street.html#hire');await settle(f);await cap(p,f,'venue-hire-phone');await layout(f,'phone hire');
 }
 if(engine==='chromium'&&(width===1440||width===390)){
  await p.getByRole('button',{name:'Open example in full screen',exact:true}).click();await p.waitForTimeout(500);check(tag+' fullscreen',{frame:await f.evaluate(()=>[innerWidth,innerHeight]),return:await p.getByRole('button',{name:'Exit full screen and return to Tab Lab frame'}).isVisible()});
  await p.getByRole('button',{name:'Exit full screen and return to Tab Lab frame'}).click();await p.waitForTimeout(300);check(tag+' fullscreen return',await p.getByRole('button',{name:'Open example in full screen',exact:true}).isVisible());
 }
 if(engine==='chromium'&&width===1440){const before=await p.evaluate(()=>[innerWidth,innerHeight,devicePixelRatio]);await p.keyboard.press('Control++');await p.keyboard.press('Control++');await p.keyboard.press('Control++');check('native zoom shortcut attempt',{before,after:await p.evaluate(()=>[innerWidth,innerHeight,devicePixelRatio])});}
 }catch(e){report.errors.push({tag,error:e.stack});}finally{await c.close();}
 }
}catch(e){report.errors.push(e.stack);}finally{await browser?.close();server.close();await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}
console.log(JSON.stringify({engine,captures:report.captures.length,errors:report.errors}));
