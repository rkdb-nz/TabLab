import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const require=createRequire(import.meta.url),{chromium}=require('playwright'),root=resolve('public'),out=resolve('qa/minigolf-results/chromium');
await mkdir(out,{recursive:true});
const r={kind:'focused mobile fullscreen return',commit:process.env.GITHUB_SHA,requested:{width:390,height:844},captures:[],states:[],errors:[],limitations:['Linux Chromium viewport emulation; not physical Android/iOS or browser chrome.']};
const mime={'.html':'text/html','.css':'text/css','.js':'application/javascript','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{let p=resolve(root,'.'+new URL(req.url,'http://local').pathname);if(!p.startsWith(root+'/'))throw Error();if((await stat(p)).isDirectory())p+='/index.html';res.writeHead(200,{'Content-Type':mime[extname(p)]||'application/octet-stream'}).end(await readFile(p));}catch{res.writeHead(404).end();}});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));const origin='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true});r.version=browser.version();const cx=await browser.newContext({viewport:r.requested});
await cx.route('**/*',route=>route.request().url().startsWith(origin+'/')&&['GET','HEAD'].includes(route.request().method())?route.continue():route.abort());
const p=await cx.newPage();p.setDefaultTimeout(10000);
async function settled(){await p.evaluate(async()=>{await document.fonts.ready;await Promise.all(document.getAnimations({subtree:true}).filter(a=>a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})));});await p.waitForTimeout(300);}
async function state(name){await settled();const outer=await p.evaluate(()=>{const v=document.querySelector('.demo-browser-content'),b=document.querySelector('.demo-fullscreen-return'),f=document.querySelector('iframe');const rect=e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom};};return{viewport:[innerWidth,innerHeight],fullscreen:!!document.fullscreenElement,fullscreenTarget:document.fullscreenElement?.className||null,expanded:v.classList.contains('demo-expanded'),container:rect(v),frame:rect(f),returnControl:{hidden:b.hidden,rect:rect(b),display:getComputedStyle(b).display},focus:document.activeElement?.getAttribute('aria-label')};});
const frame=p.frames().find(f=>f.url().includes('site.html'));const inner=await frame.evaluate(()=>({viewport:[innerWidth,innerHeight],scroll:[document.documentElement.scrollWidth,document.documentElement.scrollHeight]}));
const file=name+'.png';await p.screenshot({path:resolve(out,file)});r.states.push({name,outer,inner});r.captures.push({file,state:name,visuallyInspected:false});return outer;}
try{await p.goto(origin+'/boardroom/billboard/demos/mini-golf/',{waitUntil:'load'});const f=p.frameLocator('iframe');await f.locator('.mobile-home').waitFor({state:'visible'});await f.locator('body').evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});r.before=await state('mobile-framed-before');
await p.getByRole('button',{name:'Open example in full screen',exact:true}).click();
await p.waitForFunction(()=>{const v=document.querySelector('.demo-browser-content'),e=document.querySelector('.demo-fullscreen-return');return(document.fullscreenElement===v||v.classList.contains('demo-expanded'))&&!e.hidden&&e.getBoundingClientRect().width>0;},{timeout:10000});
r.entered=await state('mobile-fullscreen-settled');
await p.getByRole('button',{name:'Exit full screen and return to Tab Lab frame',exact:true}).click();
await p.waitForFunction(()=>!document.fullscreenElement&&!document.querySelector('.demo-browser-content').classList.contains('demo-expanded')&&document.querySelector('.demo-fullscreen-return').hidden,{timeout:10000});
r.returned=await state('mobile-return-settled');r.result={entered:true,mode:r.entered.fullscreen?'native fullscreen API':'CSS fallback',returnWorked:true,restoredViewport:JSON.stringify(r.before.viewport)===JSON.stringify(r.returned.viewport),restoredFrame:JSON.stringify(r.before.frame)===JSON.stringify(r.returned.frame)};r.status='Verified within emulated Chromium environment';
}catch(e){r.errors.push(e.stack);r.status='Focused check incomplete';}finally{await writeFile(resolve(out,'fullscreen-report.json'),JSON.stringify(r,null,2));await cx.close();await browser.close();await new Promise(ok=>server.close(ok));}console.log(JSON.stringify(r));
