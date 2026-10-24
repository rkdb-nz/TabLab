import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const require=createRequire(import.meta.url),pw=require('playwright'),engine=process.env.QA_BROWSER||'chromium',root=resolve('public'),out=resolve('qa/tailor-results',engine);
await mkdir(out,{recursive:true});
const report={engine,source:'56564b0b270d597284a636534eed718bf5e3b27e',commit:process.env.GITHUB_SHA,checks:[],captures:[],errors:[],assets:[],scans:[]};
const server=createServer(async(req,res)=>{try{let p=resolve(root,'.'+new URL(req.url,'http://local').pathname);if(!p.startsWith(root+'/'))throw Error();if((await stat(p)).isDirectory())p+='/index.html';res.writeHead(200,{'Content-Type':({'.html':'text/html','.css':'text/css','.js':'application/javascript','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'})[extname(p)]||'application/octet-stream'}).end(await readFile(p));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port,base='/boardroom/skateboard/demos/tailor/';
const note=(label,evidence)=>report.checks.push({label,evidence});
async function settled(f){await f.waitForFunction(()=>!isAnimating);await f.locator('body').evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].filter(i=>i.hasAttribute('src')&&(i.loading!=='lazy'||i.complete)).map(i=>i.decode().catch(()=>{})));});await new Promise(r=>setTimeout(r,1400));}
async function cap(p,label){await p.screenshot({path:resolve(out,label+'.png')});report.captures.push({file:label+'.png',viewport:await p.evaluate(()=>[innerWidth,innerHeight]),state:label,inspected:false});}
async function metrics(f,label){note(label,await f.evaluate(()=>({viewport:[innerWidth,innerHeight],chapter:currentIndex,scroll:[scroller.scrollLeft,scroller.scrollTop],active:document.activeElement.outerHTML,items:[...document.querySelectorAll('.chapter.active h1,.chapter.active h2,.chapter.active p,.chapter.active .btn,.chapter.active .btn-ghost,.chapter.active summary,#topnav a,#look-prev,#look-next')].filter(e=>e.getClientRects().length).map(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return {text:e.textContent.trim().slice(0,100),rect:[r.x,r.y,r.width,r.height],font:s.fontSize,color:s.color,opacity:s.opacity};})})));}
async function nav(f,i){await f.locator('[data-goto="'+i+'"]').first().click();await settled(f);note('navigate '+i,await f.evaluate(()=>({index:currentIndex,rect:document.querySelector('.chapter.active').getBoundingClientRect().toJSON()})));}

let browser;
try{
 browser=await pw.chromium.launch({channel:'chrome'});report.version=browser.version();
 const c=await browser.newContext({viewport:{width:1440,height:900}}),p=await c.newPage();p.setDefaultTimeout(10000);await p.goto(origin+base);const f=p.frames().find(f=>f.url().includes('site.html'));await settled(f);
 await nav(f,2);
 for(let i=0;i<6;i++){await f.locator('body').evaluate(async()=>{await Promise.all(document.getAnimations().filter(a=>a.effect.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})));});await metrics(f,'settled look '+i);await cap(p,'settled-look-'+i);await f.locator('#look-next').click();}
 await nav(f,0);await f.locator('.wordmark').focus();const order=[];for(let i=0;i<10;i++){await p.keyboard.press('Tab');order.push(await f.evaluate(()=>({chapter:currentIndex,scroll:scroller.scrollLeft,focus:document.activeElement.outerHTML.slice(0,250)})));}note('actual keyboard tab sequence',order);await cap(p,'keyboard-tab');
 await c.close();
 const c2=await browser.newContext({viewport:{width:1440,height:900}}),p2=await c2.newPage();await p2.goto(origin+base);const f2=p2.frames().find(f=>f.url().includes('site.html'));await settled(f2);await nav(f2,1);await f2.locator('.ch2 .btn-ghost').click();await settled(f2);await nav(f2,2);await metrics(f2,'craft CTA then Collection drift');await cap(p2,'cta-collection-drift');
 await p2.setViewportSize({width:390,height:844});await settled(f2);await metrics(f2,'desktop to phone resize');
 await f2.locator('#chapter-next').click();await settled(f2);await metrics(f2,'desktop to phone next');
 await c2.close();
 const c3=await browser.newContext({viewport:{width:320,height:568}}),p3=await c3.newPage();await p3.goto(origin+base);const f3=p3.frames().find(f=>f.url().includes('site.html'));await settled(f3);
 await f3.locator('#topnav [data-goto="2"]').click();await settled(f3);
 note('narrow collection internal scroll',await f3.locator('.lookbook-slide.active .mobile-look-card').evaluate(e=>{e.scrollTop=e.scrollHeight;return {height:e.clientHeight,total:e.scrollHeight,scroll:e.scrollTop,last:e.lastElementChild.getBoundingClientRect().toJSON()};}));
 await f3.locator('#topnav [data-goto="4"]').click();await settled(f3);note('narrow boutique internal scroll',await f3.locator('.visit-waperiki .visit-intro').evaluate(e=>{e.scrollTop=e.scrollHeight;return {height:e.clientHeight,total:e.scrollHeight,scroll:e.scrollTop,button:e.querySelector('a').getBoundingClientRect().toJSON()};}));
 await c3.close();
}catch(e){report.errors.push({error:e.stack});}finally{await browser?.close();server.close();await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}
