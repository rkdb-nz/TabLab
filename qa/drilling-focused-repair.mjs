import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createHash} from 'node:crypto';
const require=createRequire(import.meta.url),pw=require('playwright');
const engine=process.env.QA_BROWSER||'chromium',root=resolve('public'),out=resolve('qa/drilling-focused-repair-results',engine);
await mkdir(out,{recursive:true});
const report={mode:'routine',engine,commit:process.env.GITHUB_SHA,captures:[],checks:[],errors:[],console:[],assets:[],sourceHashes:{},limitations:['Linux emulation, not physical phones or Safari/iOS.','No real booking or message delivery.']};
const base='/boardroom/billboard/demos/drilling/';
for(const rel of ['index.html','site.html','css/style.css','css/mobile-fluid.css','js/app.js','css/repairs.css'])report.sourceHashes[rel]=createHash('sha256').update(await readFile(resolve(root,'.'+base,rel))).digest('hex');
const mime={'.html':'text/html','.css':'text/css','.js':'application/javascript','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{let p=resolve(root,'.'+new URL(req.url,'http://local').pathname);if(p!==root&&!p.startsWith(root+'/'))throw Error();if((await stat(p)).isDirectory())p+='/index.html';res.writeHead(200,{'Content-Type':mime[extname(p)]||'application/octet-stream'}).end(await readFile(p));}catch{res.writeHead(404).end('Not found');}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port;
const browser=await pw[engine].launch({headless:true});report.version=browser.version();


report.failures=[];
function check(id,label,pass,evidence){report.checks.push({id,label,pass,evidence});if(!pass)report.failures.push({id,label,evidence});}
const sizes=engine==='firefox'?[[1440,900],[390,844],[844,390],[320,568],[780,300],[914,600],[915,600],[720,450]]:[[1440,900],[390,844]];
async function settle(f){await f.locator('body').evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));await Promise.all(document.getAnimations().filter(a=>a.playState==='running'&&a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})));});}
async function cap(p,f,label){await settle(f);const file=label+'.png';await p.screenshot({path:resolve(out,file)});report.captures.push({file,viewport:await p.evaluate(()=>[innerWidth,innerHeight]),state:label,visuallyInspected:false});}
async function homeGeometry(f){return f.evaluate(()=>{
 const box=e=>{if(!e||!e.getClientRects().length)return null;const r=e.getBoundingClientRect();return{x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height};};
 const shown=e=>e&&e.getClientRects().length&&getComputedStyle(e).display!=='none';
 const mobile=shown(document.querySelector('.mobile-experience'));
 const hero=document.querySelector('.mobile-hero'),heading=document.querySelector('.mobile-hero h1'),proof=document.querySelector('.mobile-proof');
 return{viewport:[innerWidth,innerHeight],mobile,overflow:document.documentElement.scrollWidth>innerWidth,heading:mobile?{...box(heading),client:heading.clientWidth,scroll:heading.scrollWidth}:null,hero:mobile?box(hero):null,proof:mobile?box(proof):null,cta:mobile?box(document.querySelector('.mobile-menu-cta')):null,brand:mobile?box(document.querySelector('.mobile-brand')):null,
 services:mobile?[...document.querySelectorAll('.mobile-services h2')].map(e=>({text:e.innerText,box:box(e),client:e.clientWidth,scroll:e.scrollWidth,font:getComputedStyle(e).fontSize})):[],
 title:document.title,landmark:document.querySelector('main').getAttribute('aria-label'),desktopText:document.querySelector('.desktop-accessible').textContent};
 });}
function assessHome(g,label){
 check('DR-01',label+' no horizontal overflow',!g.overflow,g);
 if(g.mobile){check('DR-01',label+' service labels wrap',g.services.every(e=>e.scroll<=e.client+1),g.services);
 check('DR-01',label+' heading fits',g.heading.scroll<=g.heading.client+1,g.heading);
 check('DR-01',label+' CTA inside hero',g.cta.bottom<=g.hero.bottom+1&&g.cta.y>=g.hero.y,g.cta);
 check('DR-01',label+' heading below brand',g.heading.y>=g.brand.bottom-1,{heading:g.heading,brand:g.brand});}
 check('DR-08',label+' correct identity',g.title.includes('A Hole in One')&&g.landmark==='A Hole in One Drilling',{title:g.title,landmark:g.landmark});
}
async function drawerGeometry(f){return f.evaluate(()=>{
 const close=document.querySelector('.menu-close'),r=close.getBoundingClientRect(),content=document.querySelector('.drawer-content'),nav=document.querySelector('.drawer-nav'),s=document.querySelector('button[type=submit]'),b=s.getBoundingClientRect();
 return{viewport:[innerWidth,innerHeight],close:{top:r.top,bottom:r.bottom},content:{height:content.clientHeight,scroll:content.scrollHeight,top:content.scrollTop},nav:{height:nav.clientHeight,scroll:nav.scrollHeight,top:nav.scrollTop},submit:{top:b.top,bottom:b.bottom},fields:[...document.querySelectorAll('input,textarea,label')].map(e=>({tag:e.tagName,font:getComputedStyle(e).fontSize}))};
 });}
try{
for(const [width,height] of sizes){
 const cx=await browser.newContext({viewport:{width,height}});await cx.route('**/*',r=>r.request().url().startsWith(origin+'/')&&['GET','HEAD'].includes(r.request().method())?r.continue():r.abort());
 const p=await cx.newPage();p.setDefaultTimeout(7000);p.on('pageerror',e=>report.errors.push(e.message));
 p.on('response',r=>{if(r.status()>=400)report.assets.push({url:r.url(),status:r.status()});});
 try{
 await p.goto(origin+base);const f=p.frames().find(f=>f.url().includes('/site.html'));await settle(f);const tag=width+'x'+height;
 await cap(p,f,tag+'-home');assessHome(await homeGeometry(f),tag);
 await f.locator('.menu-toggle').press('Tab');check('DR-04',tag+' closed drawer excluded',await f.evaluate(()=>!document.querySelector('.menu-drawer').contains(document.activeElement)),await f.evaluate(()=>document.activeElement.outerHTML));
 await f.locator('.menu-toggle').click();await settle(f);let d=await drawerGeometry(f);
 check('DR-02',tag+' Close visible',d.close.top>=0&&d.close.bottom<=d.viewport[1],d);
 if(engine==='firefox'&&width===780)await cap(p,f,tag+'-services');
 await f.locator('[data-panel=quote]').click();await settle(f);
 check('DR-03',tag+' notice only inside Quote',await f.locator('.demo-notice').count()===1&&await f.locator('[data-content=quote] .demo-notice').count()===1,await f.locator('.demo-notice').innerText());
 if(engine==='firefox'&&width===1440){
 await f.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
 const a=await f.evaluate(async()=>{const r=await axe.run();return{violations:r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({html:n.html,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>v.id)};});report.checks.push({label:'axe-quote',result:a});
 check('DR-04','valid dialog and hidden-focus semantics',!a.violations.some(v=>['aria-allowed-role','aria-hidden-focus'].includes(v.id)),a);
 await cap(p,f,'desktop-quote');
 }
 const fullForm=(engine!=='chromium'||[1440,320,780].includes(width));
 if(fullForm){
 await f.locator('button[type=submit]').click();check('DR-03',tag+' empty required fields rejected',await f.locator('form').evaluate(e=>!e.checkValidity()),null);
 await f.locator('[name=name]').fill('Routine QA');await f.locator('[name=email]').fill('invalid');await f.locator('[name=project]').fill('Demo verification only.');
 check('DR-03',tag+' invalid email rejected',await f.locator('[name=email]').evaluate(e=>!e.checkValidity()),null);
 await f.locator('[name=email]').fill('qa@example.invalid');await f.locator('button[type=submit]').click();await settle(f);
 const status=await f.locator('.form-status').innerText();check('DR-03',tag+' honest local completion',status==='Demo complete — no quote request was sent.',status);
 d=await drawerGeometry(f);check('DR-02',tag+' Close remains visible after form scroll',d.close.top>=0&&d.close.bottom<=d.viewport[1],d);
 check('DR-06',tag+' readable fields',d.fields.every(e=>parseFloat(e.font)>=(e.tag==='LABEL'?12:16)),d.fields);
 if(engine==='firefox'&&[320,780].includes(width))await cap(p,f,tag+'-completed-quote');
 }
 if(engine==='firefox'&&width===390){
 await f.locator('[data-panel=services]').click();await p.setViewportSize({width:844,height:390});await settle(f);d=await drawerGeometry(f);
 check('DR-02','open menu survives rotation',d.close.top>=0&&d.close.bottom<=d.viewport[1],d);
 await cap(p,f,'rotation-services');await p.setViewportSize({width,height});
 }
 await f.locator('.menu-close').press('Escape');await settle(f);
 check('DR-04',tag+' drawer inert after close',await f.locator('.menu-drawer').evaluate(e=>e.inert&&e.getAttribute('aria-hidden')==='true'),await f.evaluate(()=>document.activeElement.outerHTML));
 if(engine==='firefox'&&width===1440){
 const a=await f.evaluate(async()=>{const r=await axe.run();return{violations:r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({html:n.html,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>v.id)};});report.checks.push({label:'axe-home',result:a});
 check('DR-05','accessible desktop heading/text',await f.locator('.desktop-accessible h1').count()===1&&!a.violations.some(v=>v.id==='page-has-heading-one'),await f.locator('.desktop-accessible').textContent());
 const media=await f.evaluate(()=>performance.getEntriesByType('resource').filter(e=>e.name.includes('/assets/images/')).map(e=>({name:e.name,bytes:e.transferSize})));
 check('DR-07','optimised artwork requested',media.some(e=>e.name.includes('hero-optimised'))&&!media.some(e=>e.name.endsWith('/drilling-hero.webp')),media);
 const style=await f.locator('button[type=submit]').evaluate(e=>({color:getComputedStyle(e).color,background:getComputedStyle(e).backgroundImage,font:getComputedStyle(e).fontSize}));report.checks.push({label:'button-contrast-style',style});
 }
 }catch(e){report.errors.push({size:[width,height],error:e.stack});try{await p.screenshot({path:resolve(out,width+'x'+height+'-error.png')});report.captures.push({file:width+'x'+height+'-error.png',viewport:[width,height],state:'error',visuallyInspected:false});}catch{}}finally{await cx.close();}
}
}finally{await browser.close();await new Promise(r=>server.close(r));await writeFile(resolve(out,'routine-report.json'),JSON.stringify(report,null,2));}
console.log(JSON.stringify({engine,captures:report.captures.length,errors:report.errors,failures:report.failures}));

