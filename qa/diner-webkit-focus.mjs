import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const require=createRequire(import.meta.url),pw=require('playwright');
const engine=process.env.QA_BROWSER||'chromium',root=resolve('public'),out=resolve('qa/diner-webkit-diagnostic',engine),base='/boardroom/noticeboard/demos/diner/';
await mkdir(out,{recursive:true});
const report={engine,commit:process.env.GITHUB_SHA,checks:[],captures:[],errors:[],failures:[],assets:[],console:[],limitations:['Emulated Linux browsers; not physical phones or native Safari/iOS.']};
const mime={'.html':'text/html','.css':'text/css','.js':'application/javascript','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{let p=resolve(root,'.'+new URL(req.url,'http://local').pathname);if(!p.startsWith(root+'/'))throw Error();if((await stat(p)).isDirectory())p+='/index.html';res.writeHead(200,{'Content-Type':mime[extname(p)]||'application/octet-stream'}).end(await readFile(p));}catch{res.writeHead(404).end('Not found');}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
const browser=await pw[engine].launch({headless:true});
const check=(label,pass,evidence)=>{report.checks.push({label,pass,evidence});if(!pass)report.failures.push(label);};
async function settle(f){await f.locator('body').evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));await Promise.all(document.getAnimations().filter(a=>a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})));});}
async function cap(p,label){const file=label+'.png';await p.screenshot({path:resolve(out,file)});report.captures.push({file,viewport:await p.evaluate(()=>[innerWidth,innerHeight]),state:label,visuallyInspected:false});}
const cx=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),p=await cx.newPage();
try{
await p.goto(origin+base);const f=p.frames().find(f=>f.url().includes('site.html'));await f.locator('[data-panel=menu-panel]').click();await settle(f);await p.waitForTimeout(400);
const state=()=>f.evaluate(()=>({active:document.activeElement.outerHTML,panels:[...document.querySelectorAll('.panel')].map(e=>({id:e.id,inert:e.inert,hidden:e.getAttribute('aria-hidden'),visibility:getComputedStyle(e).visibility})),buttons:[...document.querySelectorAll('.menu-panel button')].map(e=>({text:e.textContent,html:e.outerHTML,hidden:e.hidden,disabled:e.disabled,visibility:getComputedStyle(e).visibility,display:getComputedStyle(e).display,parents:[...function*(x){while(x){yield {tag:x.tagName,cls:x.className,inert:x.inert,hidden:x.hidden,visibility:getComputedStyle(x).visibility};x=x.parentElement;}}(e)]}))}));
report.before=await state();
await f.locator('.menu-panel .panel-close').press('Shift+Tab');report.afterShiftTab=await state();
await f.locator('.menu-tab').last().evaluate(e=>e.focus());report.afterDirectFocus=await state();await cap(p,'webkit-menu-focus');
await f.locator('.menu-tab').first().click();await p.waitForTimeout(200);report.category=await f.locator('.menu-tab').evaluateAll(es=>es.map(e=>({text:e.textContent,active:e.classList.contains('active'),pressed:e.getAttribute('aria-pressed'),background:getComputedStyle(e).backgroundColor})));await cap(p,'webkit-category');
}finally{await cx.close();await browser.close();await new Promise(r=>server.close(r));await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}console.log(JSON.stringify({activeBefore:report.before.active,activeAfter:report.afterShiftTab.active,direct:report.afterDirectFocus.active}));
