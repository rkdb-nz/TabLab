import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const require=createRequire(import.meta.url),pw=require('playwright'),engine=process.env.QA_BROWSER||'chromium',root=resolve('public'),out=resolve('qa/retreat-repair-results',engine),base='/boardroom/springboard/demos/retreat/';
await mkdir(out,{recursive:true});
const report={engine,commit:process.env.GITHUB_SHA,checks:[],captures:[],errors:[],scans:[],assets:[],console:[],links:[],limits:[]};
const server=createServer(async(req,res)=>{try{let p=resolve(root,'.'+new URL(req.url,'http://local').pathname);if(!p.startsWith(root+'/'))throw Error();if((await stat(p)).isDirectory())p+='/index.html';res.writeHead(200,{'Content-Type':({'.html':'text/html','.css':'text/css','.js':'application/javascript','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'})[extname(p)]||'application/octet-stream'}).end(await readFile(p));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
const check=(label,evidence)=>{report.checks.push({label,evidence});};
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
async function go(f,file){await f.goto(origin+base+file);await settle(f);}
async function dims(f,label){check(label,await f.evaluate(()=>({viewport:[innerWidth,innerHeight],document:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],activeNav:[...document.querySelectorAll('.nav a.active,[aria-current]')].map(e=>e.textContent),focus:document.activeElement?.outerHTML,overflows:[...document.querySelectorAll('main,.wrap,.retreat-full,.retreat-copy,.book-grid,.d-text,.nav,.clementine-confirmation-card')].filter(e=>e.getClientRects().length).filter(e=>e.scrollWidth>e.clientWidth+2||e.getBoundingClientRect().right>innerWidth+2).map(e=>({class:e.className,client:[e.clientWidth,e.clientHeight],scroll:[e.scrollWidth,e.scrollHeight],rect:[e.getBoundingClientRect().x,e.getBoundingClientRect().y,e.getBoundingClientRect().width,e.getBoundingClientRect().height]}))})));}
report.failures=[];
function ensure(label,value){check(label,value);if(!value)report.failures.push(label);}
async function repairForm(f,p,tag,capture){
 await go(f,'book.html?retreat=coastal');ensure(tag+' selection preserved',await f.locator('#retreat-choice').inputValue()==='Coastal Retreat');
 const form=f.locator('#clementine-book-form');await form.locator('[type=submit]').click();ensure(tag+' first invalid focus',await f.locator('#guest-name').evaluate(e=>e===document.activeElement));
 await f.locator('#guest-name').fill('QA Example');await f.locator('#guest-email').fill('bad-email');await form.locator('[type=submit]').click();ensure(tag+' email invalid',await f.locator('#guest-email').getAttribute('aria-invalid')==='true');
 await f.locator('#guest-email').fill('qa@example.invalid');await f.locator('#guest-count').fill('999');await form.locator('[type=submit]').click();ensure(tag+' range invalid',await f.locator('#guest-count').getAttribute('aria-invalid')==='true');ensure(tag+' invalid field below header',await f.locator('#guest-count').evaluate(e=>{const r=e.getBoundingClientRect(),h=document.querySelector('.header').getBoundingClientRect();return r.top>=h.bottom&&r.bottom<=innerHeight;}));
 if(capture&&engine==='chromium')await cap(p,f,tag+'-form-errors');
 await f.locator('#guest-count').fill('2');await form.locator('[type=submit]').click();ensure(tag+' truthful result',(await f.locator('#clementine-confirmation').innerText()).includes('No enquiry has been sent'));
 await f.locator('.clementine-confirmation-ok').press('Tab');ensure(tag+' result focus contained',await f.locator('#clementine-confirmation').evaluate(e=>e.contains(document.activeElement)));
 if(capture)await cap(p,f,tag+'-form-result');
 await f.locator('.clementine-confirmation-ok').press('Escape');ensure(tag+' Escape closes',await f.locator('#clementine-confirmation').evaluate(e=>!e.open));ensure(tag+' focus restored',await form.locator('[type=submit]').evaluate(e=>e===document.activeElement));
 ensure(tag+' location copy visible',await f.locator('.booking-location').evaluate(e=>e.scrollHeight<=e.clientHeight+1));
}
try{
 browser=await pw[engine].launch(engine==='chromium'?{channel:'chrome'}:{headless:true});report.version=browser.version();
 for(const [width,height] of (engine==='chromium'?[[1440,900],[390,844],[844,390],[320,568],[780,300]]:[[1440,900],[390,844]])){
  const c=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'}),p=await c.newPage(),tag=width+'x'+height;p.setDefaultTimeout(10000);p.on('pageerror',e=>report.errors.push({tag,error:e.message}));
  await c.route('**/*',r=>['GET','HEAD'].includes(r.request().method())?r.continue():r.abort());
  try{
   await p.goto(origin+base);const f=p.frames().find(f=>f.url().includes('site.html'));await settle(f);await cap(p,f,tag+'-home');
   ensure(tag+' Home current',(await f.locator('.nav a[aria-current=page]').innerText()).toLowerCase()==='home');ensure(tag+' landing fits',await f.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   if(width<1001){
    await f.locator('.menu-btn').click();for(let i=0;i<7;i++)await p.keyboard.press('Tab');ensure(tag+' menu focus contained',await f.locator('.header').evaluate(e=>e.contains(document.activeElement)));
    if(engine==='chromium'&&width===390){await p.setViewportSize({width:844,height:390});await cap(p,f,'rotated-menu');await p.setViewportSize({width,height});}
    await f.locator('.nav a[href*=retreats]').click();
   }else await f.locator('.nav a[href*=retreats]').click();
   await f.waitForURL('**/retreats.html*');ensure(tag+' navigation',(await f.locator('.nav a[aria-current=page]').innerText()).toLowerCase()==='retreats');
   await f.locator('.retreat-thumb-btn').first().click();await f.locator('.lightbox-close').press('Tab');await p.keyboard.press('Tab');ensure(tag+' gallery focus contained',await f.locator('#retreat-lightbox').evaluate(e=>e.contains(document.activeElement)));
   if(engine==='chromium'&&width===390)await cap(p,f,'phone-gallery');await p.keyboard.press('Escape');ensure(tag+' gallery closes',await f.locator('#retreat-lightbox').evaluate(e=>!e.open));ensure(tag+' hidden gallery absent',await f.locator('#retreat-lightbox').evaluate(e=>getComputedStyle(e).display==='none'));
   if(width===1440||width===390||engine==='chromium'&&width===320)await repairForm(f,p,tag,width===390||engine==='chromium'&&width===1440);
   if(engine==='chromium'&&width===1440){
    for(const page of ['site.html','retreats.html','book.html','reviews.html','discover.html']){
     await go(f,page);await scan(f,page);ensure(page+' main',await f.locator('main').count()===1);
     if(page==='retreats.html'){await f.locator('#town').scrollIntoViewIfNeeded();await cap(p,f,'town-copy');}
     if(page==='reviews.html'){await f.locator('.testimonial-entry').first().scrollIntoViewIfNeeded();await cap(p,f,'reviews-optimised');ensure('reviews sample wording',(await f.locator('.reviews-sub').innerText()).startsWith('Sample'));}
     if(page==='book.html'){await f.locator('.booking-location').scrollIntoViewIfNeeded();await cap(p,f,'location-copy');}
     if(page==='discover.html'){await cap(p,f,'corrected-sign-desktop');ensure('corrected sign decoded',await f.locator('.d-scene-hero img').evaluate(e=>e.naturalWidth>0&&e.currentSrc.includes('corrected')));}
    }
   }
   if(engine==='chromium'&&(width===390||width===780)){
    await go(f,'discover.html');await f.locator('.menu-btn').click();await f.locator('.menu-btn').press('Escape');await f.locator('.menu-btn').press('PageDown');
    ensure(tag+' PageDown after menu',await f.locator('.discover-track').evaluate(e=>e.style.transform==='translateY(-100%)'));ensure(tag+' reduced no slide',await f.locator('.discover-track').evaluate(e=>e.style.transition==='none'));
    if(width===390){await f.locator('.retreat-back-top').click();await cap(p,f,'corrected-sign-phone');await f.getByRole('button',{name:'Next scene',exact:true}).click();}
    for(let i=1;i<8;i++)await f.getByRole('button',{name:'Next scene',exact:true}).click();
    await f.locator('.d-scene-closing a').scrollIntoViewIfNeeded();ensure(tag+' closing CTA reachable',await f.locator('.d-scene-closing a').evaluate(e=>{const r=e.getBoundingClientRect(),h=document.querySelector('.header').getBoundingClientRect();return r.top>=h.bottom&&r.bottom<=innerHeight;}));
    await cap(p,f,width===390?'discover-closing-phone':'discover-closing-short');
    await f.locator('.retreat-back-top').click();ensure(tag+' return top',await f.locator('.discover-track').evaluate(e=>e.style.transform==='translateY(0%)'));
    if(width===390){await p.emulateMedia({reducedMotion:'no-preference'});await f.getByRole('button',{name:'Next scene',exact:true}).click();ensure('normal motion preserved',await f.locator('.discover-track').evaluate(e=>e.style.transition.includes('1.5s')));await p.waitForTimeout(1600);await p.emulateMedia({reducedMotion:'reduce'});}
   }
   if(engine==='chromium'&&(width===844||width===320)){await go(f,'book.html');ensure(tag+' booking fits',await f.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));}
  }catch(e){report.errors.push({tag,error:e.stack});}finally{await c.close();}
 }
}catch(e){report.errors.push(e.stack);}finally{await browser?.close();server.close();await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}
console.log(JSON.stringify({engine,captures:report.captures.length,failures:report.failures,errors:report.errors}));if(report.errors.length||report.failures.length)process.exitCode=1;
