import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const require=createRequire(import.meta.url),pw=require('playwright'),engine=process.env.QA_BROWSER||'chromium',root=resolve('public'),out=resolve('qa/retreat-focus-results',engine),base='/boardroom/springboard/demos/retreat/';
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
async function form(f,p,tag,capture){
 await go(f,'book.html');const form=f.locator('#clementine-book-form');await form.locator('button').click();check(tag+' invalid required',await form.locator(':invalid').count());
 await form.locator('input').nth(2).fill('QA Example');await form.locator('input').nth(3).fill('bad-email');await form.locator('button').click();check(tag+' invalid email',await form.locator('input[type=email]').evaluate(e=>e.validity.typeMismatch));
 await form.locator('input').nth(3).fill('qa@example.invalid');await form.locator('input[type=number]').fill('999');await form.locator('button').click();check(tag+' invalid guest limit',await form.locator('input[type=number]').evaluate(e=>e.validity.rangeOverflow));
 if(capture)await cap(p,f,tag+'-book-invalid');
 await form.locator('input[type=number]').fill('2');await form.locator('button').click();check(tag+' result',await f.locator('#clementine-confirmation').innerText());
 await f.locator('.clementine-confirmation-ok').press('Tab');check(tag+' modal focus',await f.locator('.clementine-confirmation-card').evaluate(e=>e.contains(document.activeElement)));await p.keyboard.press('Escape');check(tag+' Escape closes',await f.locator('#clementine-confirmation').isHidden());
 if(capture)await cap(p,f,tag+'-book-result');await f.locator('.clementine-confirmation-ok').click();await p.waitForTimeout(300);check(tag+' modal close focus',await f.evaluate(()=>document.activeElement.outerHTML));
}
try{
 browser=await pw.chromium.launch({channel:'chrome'});const c=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),p=await c.newPage();p.setDefaultTimeout(10000);await p.goto(origin+base);const f=p.frames().find(f=>f.url().includes('site.html'));await settle(f);
 await f.locator('.menu-btn').click();await f.locator('.menu-btn').press('Tab');check('menu Tab focus',await f.evaluate(()=>document.activeElement.outerHTML.slice(0,300)));await f.locator('.menu-btn').press('Escape');
 await go(f,'retreats.html');await f.locator('.retreat-thumb-btn').first().click();for(let i=0;i<4;i++){await p.keyboard.press('Tab');check('gallery Tab '+i,await f.evaluate(()=>({contained:document.querySelector('#retreat-lightbox').contains(document.activeElement),active:document.activeElement.outerHTML.slice(0,200)})));}await p.keyboard.press('Escape');
 await go(f,'book.html');check('location card clipping',await f.locator('.book-grid > div').nth(1).evaluate(e=>{const card=e.firstElementChild,img=card.querySelector('img'),copy=card.querySelector('div');return {card:card.getBoundingClientRect().toJSON(),image:img.getBoundingClientRect().toJSON(),copy:copy.getBoundingClientRect().toJSON(),overflow:getComputedStyle(card).overflow};}));
 const form=f.locator('#clementine-book-form');await form.locator('input').nth(2).fill('QA Example');await form.locator('input').nth(3).fill('qa@example.invalid');await form.locator('button').click();await settle(f);await scan(f,'Book open confirmation');
 await f.locator('.clementine-confirmation-ok').click();
 await go(f,'discover.html');await f.locator('.menu-btn').click();await f.locator('.menu-btn').click();await f.locator('.menu-btn').press('PageDown');await p.waitForTimeout(1700);check('Discover PageDown after menu',await f.locator('.discover-track').getAttribute('style'));
 await p.setViewportSize({width:780,height:300});for(let i=0;i<8;i++){await f.locator('body').press('PageDown');await p.waitForTimeout(1550);}await cap(p,f,'short-discover-closing');check('short closing geometry',await f.locator('.d-scene-closing .d-text').evaluate(e=>({viewport:[innerWidth,innerHeight],header:document.querySelector('.header').getBoundingClientRect().toJSON(),copy:e.getBoundingClientRect().toJSON(),button:e.querySelector('a').getBoundingClientRect().toJSON(),scene:e.closest('section').getBoundingClientRect().toJSON()})));
 await c.close();
}catch(e){report.errors.push(e.stack);}finally{await browser?.close();server.close();await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}
console.log(JSON.stringify({errors:report.errors}));
