import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const require=createRequire(import.meta.url),pw=require('playwright'),engine=process.env.QA_BROWSER||'chromium',root=resolve('public'),out=resolve('qa/theatre-repair-results',engine),base='/boardroom/springboard/demos/theatre/';
await mkdir(out,{recursive:true});
const report={engine,commit:process.env.GITHUB_SHA,checks:[],captures:[],errors:[],scans:[],assets:[],console:[],links:[],limits:[]};
const server=createServer(async(req,res)=>{try{let p=resolve(root,'.'+new URL(req.url,'http://local').pathname);if(!p.startsWith(root+'/'))throw Error();if((await stat(p)).isDirectory())p+='/index.html';res.writeHead(200,{'Content-Type':({'.html':'text/html','.css':'text/css','.js':'application/javascript','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'})[extname(p)]||'application/octet-stream'}).end(await readFile(p));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
const check=(label,evidence)=>report.checks.push({label,evidence});
async function settle(f){await f.locator('body').evaluate(async()=>{
 await Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,3000))]);
 const visible=[...document.images].filter(i=>{const r=i.getBoundingClientRect();return i.complete||(i.getClientRects().length&&r.top<innerHeight&&r.bottom>0);});
 await Promise.race([Promise.all(visible.map(i=>i.decode().catch(()=>{}))),new Promise(r=>setTimeout(r,3000))]);
 await Promise.race([Promise.all(document.getAnimations().filter(a=>a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{}))),new Promise(r=>setTimeout(r,3000))]);
});}
async function cap(p,f,label){await settle(f);await p.screenshot({path:resolve(out,label+'.png')});report.captures.push({file:label+'.png',outer:await p.evaluate(()=>[innerWidth,innerHeight]),frame:await f.evaluate(()=>[innerWidth,innerHeight]),inspected:false});await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}
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
function assert(label,value){check(label,value);if(!value)throw Error(label);}
try{
 browser=await pw[engine].launch(engine==='chromium'?{channel:'chrome'}:{headless:true});report.version=browser.version();
 for(const [width,height] of (engine==='chromium'?[[1440,900],[390,844],[844,390],[320,568],[780,300]]:[[1440,900],[390,844]])){
  const c=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'}),p=await c.newPage(),tag=width+'x'+height;
  await c.route('**/*',r=>['GET','HEAD'].includes(r.request().method())?r.continue():r.abort());
  p.on('pageerror',e=>report.errors.push({tag,error:e.message}));
  await p.goto(origin+base);const f=p.frames().find(f=>f.url().includes('site.html'));await settle(f);if(width!==1440)await cap(p,f,tag+'-home');await layout(f,tag+' home');
  if(width<981){await f.locator('#menuBtn').click();if(engine==='chromium'&&width===390){await p.setViewportSize({width:844,height:390});await f.locator('#mobilePanel a').last().scrollIntoViewIfNeeded();await cap(p,f,'rotated-menu');await p.setViewportSize({width,height});}await f.locator('#mobilePanel a[href*="now-playing"]').click();}
  else await f.locator('.nav a[href*="now-playing"]').click();
  await f.waitForURL('**/now-playing.html*');assert(tag+' navigation',f.url().includes('now-playing'));
  if(width===1440||width===390){
    await f.locator('.np-poster-trigger').click();await f.locator('#csLightboxClose').press('Tab');assert(tag+' poster focus contained',await f.locator('#csLightbox').evaluate(e=>e.contains(document.activeElement)));await f.locator('#csLightboxClose').press('Escape');
    await f.goto(origin+base+'clementine-street.html#hire');await settle(f);await layout(f,tag+' hire');
    assert(tag+' hire fits',await f.locator('.clem-main').evaluate(e=>e.scrollWidth<=e.clientWidth+1));
    await f.locator('#hireForm [type=submit]').click();assert(tag+' first invalid focused',await f.locator('#fName').evaluate(e=>e===document.activeElement));
    await f.locator('#fName').fill('QA Example');await f.locator('#fEmail').fill('qa@example.invalid');await f.locator('#fType').selectOption({label:'Rehearsal'});await f.locator('#fMsg').fill('Safe demo test');await f.locator('#fAtt').fill('999');await f.locator('#hireForm [type=submit]').click();assert(tag+' max rejected',await f.locator('#fAtt').getAttribute('aria-invalid')==='true');
    if(engine==='chromium'&&width===390)await cap(p,f,tag+'-hire-errors');
    await f.locator('#fAtt').fill('200');await f.locator('#hireForm [type=submit]').click();assert(tag+' truthful hire', (await f.locator('#formSuccess').innerText()).includes('No enquiry or email has been sent'));
    if(width===390)await cap(p,f,tag+'-hire-result');
    await f.locator('a[href="clementine-street.html#email"]').click();await f.locator('.demo-email-dialog input[type=email]').fill('qa@example.invalid');await f.locator('.demo-email-dialog input').nth(1).fill('Test');await f.locator('.demo-email-dialog textarea').fill('Demo only');await f.locator('.demo-email-dialog [type=submit]').click();assert(tag+' truthful email',await f.locator('[data-result]').isVisible());if(engine==='chromium'&&width===390)await cap(p,f,'email-result');await f.locator('[data-result] [data-close]').click();
  }
  if(engine==='chromium'&&width===1440){
   for(const file of ['now-playing.html','coming-soon.html','book-tickets.html','clementine-street.html']){await f.goto(origin+base+file);await settle(f);await scan(f,file);if(file==='clementine-street.html')await cap(p,f,'venue-final');}
   await f.goto(origin+base+'site.html');await p.emulateMedia({reducedMotion:'no-preference'});await f.locator('#sequencePause').click();const frame=await f.locator('.home-hero-image.is-active').getAttribute('data-seq');await p.waitForTimeout(3000);assert('paused still',frame===await f.locator('.home-hero-image.is-active').getAttribute('data-seq'));await f.locator('#sequencePause').click();assert('resume label',await f.locator('#sequencePause').innerText()==='Pause slideshow');await p.waitForTimeout(2600);assert('resume advances',frame!==await f.locator('.home-hero-image.is-active').getAttribute('data-seq'));await p.emulateMedia({reducedMotion:'reduce'});await f.locator('#sequencePause').waitFor({state:'hidden'});assert('reduced static',await f.locator('#sequencePause').isHidden());
  }
  if(engine==='chromium'&&width===320){await booking(f,p,tag,true);await layout(f,'narrow booking');assert('narrow tickets fit',await f.locator('.book-left').evaluate(e=>e.scrollWidth<=e.clientWidth+1));}
  if(engine==='chromium'&&(width===844||width===780)){await f.goto(origin+base+'clementine-street.html#hire');await layout(f,tag+' hire neighbour');assert(tag+' hire fits',await f.locator('.clem-main').evaluate(e=>e.scrollWidth<=e.clientWidth+1));}
  await c.close();
 }
}catch(e){report.errors.push(e.stack);}finally{await browser?.close();server.close();await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}
console.log(JSON.stringify({engine,captures:report.captures.length,errors:report.errors}));if(report.errors.length)process.exitCode=1;
