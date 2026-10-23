import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const require=createRequire(import.meta.url),pw=require('playwright'),engine=process.env.QA_BROWSER||'chromium',out=resolve('qa/pottery-repair-results',engine),root=resolve('public');
await mkdir(out,{recursive:true});
const report={engine,commit:process.env.GITHUB_SHA,checks:[],captures:[],errors:[],assets:[],scans:[],limitations:['Linux emulation; not physical phones or Safari.']};
const server=createServer(async(req,res)=>{try{let p=resolve(root,'.'+new URL(req.url,'http://local').pathname);if(!p.startsWith(root+'/'))throw Error();if((await stat(p)).isDirectory())p+='/index.html';res.writeHead(200,{'Content-Type':({'.html':'text/html','.css':'text/css','.js':'application/javascript','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp'})[extname(p)]||'application/octet-stream'}).end(await readFile(p));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port,base='/boardroom/skateboard/demos/pottery/';
const check=(label,evidence)=>report.checks.push({label,evidence});
async function settle(f){await f.locator('body').evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].filter(i=>i.hasAttribute('src')&&(i.loading!=='lazy'||i.complete)).map(i=>i.decode().catch(()=>{})));});await new Promise(r=>setTimeout(r,650));}
async function cap(p,label){await p.screenshot({path:resolve(out,label+'.png')});report.captures.push({file:label+'.png',viewport:await p.evaluate(()=>[innerWidth,innerHeight]),state:label,inspected:false});}
async function metrics(f,label){check(label,await f.evaluate(()=>({viewport:[innerWidth,innerHeight],document:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],active:document.activeElement?.outerHTML,visible:[...document.querySelectorAll('h1,h2,p,a,button,li,.contact-card')].filter(e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden').map(e=>{const r=e.getBoundingClientRect();return {text:(e.innerText||e.getAttribute('aria-label')||'').slice(0,100),rect:[r.x,r.y,r.width,r.height]};})}))); }



let browser;report.failures=[];
const assert=(label,value)=>{check(label,value);if(value!==true)report.failures.push(label);};
async function waitScene(f){await new Promise(r=>setTimeout(r,1700));await settle(f);}
async function scan(f,label){await f.addScriptTag({path:require.resolve('axe-core/axe.min.js')});const v=await f.evaluate(async()=>{const r=await axe.run();return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({html:n.html,summary:n.failureSummary}))}));});report.scans.push({label,violations:v});assert(label+' Axe',v.length===0);}
async function routeFrame(p,mobile){
 const f=await p.waitForEvent('framenavigated',{predicate:f=>f.url().includes(mobile?'mobile.html':'site.html'),timeout:15000}).catch(()=>p.frames().find(f=>f.url().includes(mobile?'mobile.html':'site.html')));
 if(!f)throw Error('Expected '+(mobile?'mobile':'desktop')+' route');
 await f.waitForLoadState('load');await settle(f);return f;
}
try{
browser=await pw[engine].launch(engine==='chromium'?{channel:'chrome'}:{});report.version=browser.version();
for(const [width,height] of (engine==='chromium'?[[1440,900],[390,844],[844,390],[320,568],[780,300]]:[[1440,900],[390,844]])){
 const tag=width+'x'+height,c=await browser.newContext({viewport:{width,height}}),p=await c.newPage();
 p.on('pageerror',e=>report.errors.push(e.message));p.on('response',r=>{if(r.status()>=400&&new URL(r.url()).hostname==='127.0.0.1')report.assets.push({url:r.url(),status:r.status()});});
 try{
 await p.goto(origin+base);let f=p.frames().find(f=>f.url().includes(width>980?'site.html':'mobile.html'));
 if(!f){await new Promise(r=>setTimeout(r,600));f=p.frames().find(f=>f.url().includes(width>980?'site.html':'mobile.html'));}
 await f.waitForLoadState('load');await settle(f);
 assert(tag+' route',f.url().includes(width>980?'site.html':'mobile.html'));await cap(p,tag+'-home');
 if(width>980){
 await f.locator('.nav-links a[href="#studio"]').click();await waitScene(f);assert(tag+' navigation',await f.locator('#studio').evaluate(e=>Math.abs(e.getBoundingClientRect().top)<180));
 await f.locator('#contact').scrollIntoViewIfNeeded();await waitScene(f);
 const form=f.locator('#pottery-enquiry');await form.locator('button').click();assert(tag+' missing required',await form.locator('input').first().evaluate(e=>e.validity.valueMissing));
 await form.locator('input').first().fill('Sitecheck');await form.locator('input[type=email]').fill('invalid');assert(tag+' malformed email',await form.locator('input[type=email]').evaluate(e=>e.validity.typeMismatch));
 await form.locator('input[type=email]').fill('sitecheck@example.com');await form.locator('textarea').fill('QA demonstration. Do not send.');await form.locator('button').click();assert(tag+' no-send result',(await f.locator('#formSuccess').innerText()).includes('has not been sent'));
 for(const name of ['Instagram','Journal','Newsletter']){await f.locator('[data-demo-social="'+name+'"]').click();assert(tag+' '+name+' honest',(await f.locator('#social-result').innerText()).includes('demonstration only'));}
 if(engine==='chromium'){
 await cap(p,'desktop-result');await scan(f,'desktop');
 await f.locator('.nav-logo').click();await waitScene(f);
 check('normal load bytes',await f.evaluate(()=>performance.getEntriesByType('resource').reduce((n,r)=>n+r.transferSize,0)));
 assert('small favicon',await f.evaluate(()=>{const r=performance.getEntriesByType('resource').find(r=>r.name.includes('favicon.png'));return !r||r.transferSize<15000;}));
 await p.emulateMedia({reducedMotion:'reduce'});await f.evaluate(()=>scrollTo(0,500));await settle(f);
 assert('desktop reduced motion',await f.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior==='auto'&&getComputedStyle(document.querySelector('.hero-media img')).transitionDuration==='0s'));
 await p.emulateMedia({reducedMotion:'no-preference'});
 // Cross the exact responsive boundary once in each direction; remaining sample evidence is reused.
 await p.setViewportSize({width:980,height:768});await new Promise(r=>setTimeout(r,700));f=p.frames().find(f=>f.url().includes('mobile.html'));assert('980 uses mobile',!!f);await settle(f);
 await p.setViewportSize({width:1000,height:768});await new Promise(r=>setTimeout(r,700));f=p.frames().find(f=>f.url().includes('site.html'));assert('1000 uses desktop',!!f);await settle(f);
 await p.setViewportSize({width,height});await settle(f);
 }
 }else{
 assert(tag+' controls fit',await f.locator('.journey-footer').evaluate(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.bottom<=innerHeight+1;}));
 assert(tag+' swipe hint',await f.locator('.swipe-hint').isVisible());
 assert(tag+' gallery deferred',await f.locator('#gallery img').evaluateAll(es=>es.every(i=>!i.hasAttribute('src'))));
 await f.locator('#scene-next').click();await waitScene(f);assert(tag+' next scene',await f.locator('body').getAttribute('data-scene')==='1');
 if(engine==='chromium'&&width===390){
 await f.locator('#maker-motion').click();const selected=await f.locator('.maker-images .selected').getAttribute('src');await new Promise(r=>setTimeout(r,6700));assert('pause stops images',await f.locator('.maker-images .selected').getAttribute('src')===selected);await cap(p,'maker-paused');
 await p.emulateMedia({reducedMotion:'reduce'});await f.locator('#scene-next').click();assert('reduced track no motion',await f.locator('.scene-track').evaluate(e=>getComputedStyle(e).transitionDuration==='0s'));
 await p.emulateMedia({reducedMotion:'no-preference'});
 }else{await f.locator('#scene-next').click();await waitScene(f);}
 assert(tag+' collection scene',await f.locator('body').getAttribute('data-scene')==='2');
 await f.locator('#collection-next').click();assert(tag+' collection switch',await f.locator('#collection-title').innerText()==='Gather');
 await f.locator('[data-dialog="gallery"]').click();await settle(f);assert(tag+' gallery loaded',await f.locator('#gallery img').evaluateAll(es=>es.every(i=>i.complete&&i.naturalWidth>0)));await f.locator('#gallery [data-close]').click();
 await f.locator('#scene-next').click();await waitScene(f);await f.locator('[data-step="6"]').click();assert(tag+' final making stage',(await f.locator('#step-title').innerText()).includes('Finishing'));
 await f.locator('#scene-next').click();await waitScene(f);assert(tag+' final scene',await f.locator('body').getAttribute('data-scene')==='4');
 assert(tag+' final next disabled',await f.locator('#scene-next').isDisabled());
 if(engine==='chromium'&&[320,780,390].includes(width))await cap(p,tag+'-visit');
 await f.locator('[data-dialog="workshops"]').click();await settle(f);
 await f.locator('#workshops .demo-contact').click();assert(tag+' workshop final demo',(await f.locator('#workshops .demo-result').innerText()).includes('No enquiry, booking or message'));
 if(engine==='chromium'&&width===390){
 await cap(p,'workshop-demo');await p.setViewportSize({width:844,height:390});await settle(f);assert('rotation keeps dialog',await f.locator('#workshops').evaluate(e=>e.open));await p.setViewportSize({width,height});await settle(f);
 }
 await f.locator('#workshops [data-close]').click();
 if(engine==='chromium'&&width===390){
 for(const id of ['contact','visit-details']){await f.locator('[data-dialog="'+id+'"]').click();await settle(f);await f.locator('#'+id+' .demo-contact').click();assert(id+' final demo',(await f.locator('#'+id+' .demo-result').innerText()).includes('demonstration'));await f.locator('#'+id+' [data-close]').click();}
 await scan(f,'mobile');
 }
 await f.locator('#scene-prev').click();await waitScene(f);assert(tag+' previous scene',await f.locator('body').getAttribute('data-scene')==='3');
 }
 if(engine==='chromium'&&[1440,390].includes(width)){
 await p.getByRole('button',{name:'Open example in full screen',exact:true}).click();await waitScene(f);check(tag+' fullscreen',await f.evaluate(()=>[innerWidth,innerHeight]));if(width===390)await cap(p,'phone-fullscreen');
 await p.getByRole('button',{name:'Exit full screen and return to Tab Lab frame',exact:true}).click();await waitScene(f);assert(tag+' return',await p.locator('.demo-fullscreen-return').isHidden());
 await p.getByRole('button',{name:'Back to gallery',exact:true}).click();await p.waitForURL('**/skateboard/index.html');assert(tag+' gallery return',p.url().endsWith('/skateboard/index.html'));
 }
 }catch(e){report.failures.push(tag+' '+e.message);}finally{await c.close();}
}
}catch(e){report.launchError=e.message;}finally{if(browser)await browser.close();server.close();await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}
if(report.launchError||report.failures.length||report.errors.length||report.assets.length)process.exitCode=1;
