import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const require=createRequire(import.meta.url),pw=require('playwright'),engine=process.env.QA_BROWSER||'chromium',root=resolve('public'),out=resolve('qa/restaurant-repair-results',engine),base='/boardroom/springboard/demos/dining/';
await mkdir(out,{recursive:true});
const report={engine,commit:process.env.GITHUB_SHA,checks:[],captures:[],errors:[],scans:[],assets:[],console:[],links:[],limits:[]};
const server=createServer(async(req,res)=>{try{let p=resolve(root,'.'+new URL(req.url,'http://local').pathname);if(!p.startsWith(root+'/'))throw Error();if((await stat(p)).isDirectory())p+='/index.html';res.writeHead(200,{'Content-Type':({'.html':'text/html','.css':'text/css','.js':'application/javascript','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'})[extname(p)]||'application/octet-stream'}).end(await readFile(p));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
const check=(label,evidence)=>report.checks.push({label,evidence});
async function settle(f){await f.locator('body').evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));await Promise.all(document.getAnimations().filter(a=>a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})));});}
async function cap(p,f,label){await settle(f);await p.screenshot({path:resolve(out,label+'.png')});report.captures.push({file:label+'.png',outer:await p.evaluate(()=>[innerWidth,innerHeight]),frame:await f.evaluate(()=>[innerWidth,innerHeight]),inspected:false});}
async function measure(f,label){check(label,await f.evaluate(()=>({viewport:[innerWidth,innerHeight],scroll:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],controls:[...document.querySelectorAll('a,button,input,select,.faq-q')].filter(e=>e.getClientRects().length).map(e=>({text:e.textContent.trim().slice(0,45),tag:e.tagName,tab:e.tabIndex,rect:(()=>{let r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}})()}))})));}

let browser;
function assert(label,pass,evidence){check(label,{pass,...evidence});if(!pass)throw Error(label+': '+JSON.stringify(evidence));}
const futureDate=()=>{const d=new Date();d.setDate(d.getDate()+7);while(d.getDay()!==3)d.setDate(d.getDate()+1);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');};
async function fillForm(f,form){
 await form.locator('[name=name]').fill('QA Example');
 await form.locator('[name=phone]').fill('021 000 0000');
 await form.locator('[name=date]').fill(futureDate());
}
async function scan(f,label){await f.addScriptTag({path:require.resolve('axe-core/axe.min.js')});const v=await f.evaluate(async()=>{const r=await axe.run();return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({html:n.html,summary:n.failureSummary}))}));});report.scans.push({label,violations:v});assert(label+' axe clean',v.length===0,{violations:v});}
try{
 browser=await pw[engine].launch(engine==='chromium'?{channel:'chrome'}:{headless:true});report.version=browser.version();
 const sizes=engine==='chromium'?[[1440,900],[390,844],[844,390],[320,568],[780,300]]:[[1440,900],[390,844]];
 for(const [width,height] of sizes){
 const tag=width+'x'+height,c=await browser.newContext({viewport:{width,height}}),p=await c.newPage();
 await c.route('**/*',r=>['GET','HEAD'].includes(r.request().method())?r.continue():r.abort());
 p.on('pageerror',e=>report.errors.push(e.message));p.on('response',r=>{if(r.status()>=400)report.assets.push({url:r.url(),status:r.status()});});
 try{
 await p.goto(origin+base);const f=p.frames().find(f=>f.url().includes('site.html'));await settle(f);
 assert(tag+' hidden nav inert',await f.locator('.nav').evaluate(e=>e.inert),{});
 await p.mouse.move(width/2,height/2);await p.mouse.wheel(0,900);await p.waitForTimeout(1900);
 await f.locator('[data-panel=dine]').click();await f.waitForURL('**/dine.html*');await settle(f);
 assert(tag+' dine no horizontal overflow',await f.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),{viewport:await f.evaluate(()=>[innerWidth,innerHeight])});
 await cap(p,f,tag+'-dine');
 if(width===390){await f.getByRole('button',{name:'Open restaurant menu',exact:true}).click();assert(tag+' menu open',await f.locator('.mobile-toggle').getAttribute('aria-expanded')==='true',{});await f.getByRole('button',{name:'Close restaurant menu',exact:true}).press('Escape');}
 await f.goto(origin+base+'sign.html');await settle(f);
 const isMobile=width!==1440;
 if(isMobile)await f.locator('#open-email-request').click();
 const form=f.locator(isMobile?'#email-request-form':'main .booking-form');
 assert(tag+' required validation',await form.evaluate(e=>!e.checkValidity()),{});
 await fillForm(f,form);
 const time=form.locator('[name=time]');await time.focus();const before=await time.inputValue();await time.press('ArrowDown');const after=await time.inputValue();assert(tag+' time keyboard',before!==after,{before,after});
 if(engine==='chromium'&&(width===1440||width===390))await cap(p,f,tag+'-request-form');
 if(engine==='chromium'&&width===390){
 await p.setViewportSize({width:844,height:390});await settle(f);await cap(p,f,'email-rotated');
 await form.locator('[type=submit]').scrollIntoViewIfNeeded();assert('rotated send reachable',await form.locator('[type=submit]').isVisible(),{});
 await p.setViewportSize({width,height});await settle(f);
 }
 await form.locator('[type=submit]').click();const dialog=f.locator('#booking-confirmation');await dialog.waitFor({state:'visible'});
 assert(tag+' no-send confirmation',await dialog.innerText().then(x=>x.includes('No table request has been sent')),{});
 assert(tag+' modal focus',await dialog.evaluate(e=>e.matches(':modal')&&e.contains(document.activeElement)),{});
 await dialog.locator('button').press('Tab');assert(tag+' modal focus contained',await dialog.evaluate(e=>e.contains(document.activeElement)),{});
 if(engine==='chromium'&&(width===1440||width===390))await cap(p,f,tag+'-confirmation');
 await dialog.locator('button').press('Escape');await dialog.waitFor({state:'hidden'});
 assert(tag+' focus restored',await f.locator(isMobile?'#open-email-request':'main .booking-form [type=submit]').evaluate(e=>e===document.activeElement),{});
 const faq=f.locator('.faq-q').first();await faq.focus();await faq.press('Space');assert(tag+' FAQ keyboard open',await faq.getAttribute('aria-expanded')==='true',{});await faq.press('Enter');assert(tag+' FAQ keyboard close',await faq.getAttribute('aria-expanded')==='false',{});
 assert(tag+' no real email links',await f.locator('a[href^="mailto:"]').count()===0,{});
 if(engine==='chromium'&&width===1440){
  const desktop=f.locator('main .booking-form');
  await desktop.locator('[name=date]').fill('2020-01-01');assert('past date rejected',await desktop.evaluate(e=>!e.checkValidity()),{});
  await desktop.locator('[name=name]').fill('   ');await desktop.locator('[name=date]').fill(futureDate());assert('blank name rejected',await desktop.evaluate(e=>!e.checkValidity()),{});
  await fillForm(f,desktop);
  for(const page of ['site.html','dine.html','wine.html','sign.html','reviews.html']){
   await f.goto(origin+base+page);await settle(f);await scan(f,page);
   if(page==='reviews.html'){assert('sample reviews stated',await f.locator('.page-head').innerText().then(x=>x.includes('Sample reviews')),{});await cap(p,f,'reviews-contrast');}
  }
 }
 if(engine==='chromium'&&width===390){
  await f.locator('#open-email-request').click();await scan(f,'mobile-email-dialog');await f.locator('.email-cancel').click();
  await p.emulateMedia({reducedMotion:'reduce'});await f.goto(origin+base+'site.html');await settle(f);
  assert('reduced animation stopped',await f.locator('.scroll-ind .dot').evaluate(e=>getComputedStyle(e).animationName==='none'),{});
  await p.mouse.move(180,350);await p.mouse.wheel(0,700);await p.waitForTimeout(100);
  assert('reduced glide stopped',await f.locator('.home-track').evaluate(e=>getComputedStyle(e).transitionDuration==='0s'),{});
  assert('revealed nav usable',await f.locator('.nav').evaluate(e=>!e.inert),{});await cap(p,f,'reduced-motion-cards');
  await p.emulateMedia({reducedMotion:'no-preference'});
 }
 }catch(e){report.errors.push({tag,error:e.stack});}finally{await c.close();}
 }
}catch(e){report.errors.push(e.stack);}finally{await browser?.close();server.close();await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}
console.log(JSON.stringify({engine,captures:report.captures.length,errors:report.errors,scans:report.scans.map(s=>({label:s.label,violations:s.violations.length}))}));
if(report.errors.length)process.exitCode=1;
