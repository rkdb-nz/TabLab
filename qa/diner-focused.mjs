import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const require=createRequire(import.meta.url),pw=require('playwright');
const engine=process.env.QA_BROWSER||'chromium',root=resolve('public'),out=resolve('qa/diner-focused-results',engine),base='/boardroom/noticeboard/demos/diner/';
await mkdir(out,{recursive:true});
const report={engine,commit:process.env.GITHUB_SHA,checks:[],captures:[],errors:[],failures:[],assets:[],console:[],limitations:['Emulated Linux browsers; not physical phones or native Safari/iOS.']};
const mime={'.html':'text/html','.css':'text/css','.js':'application/javascript','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{let p=resolve(root,'.'+new URL(req.url,'http://local').pathname);if(!p.startsWith(root+'/'))throw Error();if((await stat(p)).isDirectory())p+='/index.html';res.writeHead(200,{'Content-Type':mime[extname(p)]||'application/octet-stream'}).end(await readFile(p));}catch{res.writeHead(404).end('Not found');}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
const browser=await pw[engine].launch({headless:true});
const check=(label,pass,evidence)=>{report.checks.push({label,pass,evidence});if(!pass)report.failures.push(label);};
async function settle(f){await f.locator('body').evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));await Promise.all(document.getAnimations().filter(a=>a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})));});}
async function cap(p,label){const file=label+'.png';await p.screenshot({path:resolve(out,file)});report.captures.push({file,viewport:await p.evaluate(()=>[innerWidth,innerHeight]),state:label,visuallyInspected:false});}
const sizes=engine==='chromium'?[[1440,900],[390,844],[844,390],[320,568],[780,300]]:[[1440,900],[390,844]];
try{for(const [width,height] of sizes){const tag=width+'x'+height,cx=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'}),p=await cx.newPage();
await cx.route('**/*',r=>['GET','HEAD'].includes(r.request().method())?r.continue():r.abort());
p.on('pageerror',e=>report.errors.push(e.message));
try{
 await p.goto(origin+base);const f=p.frames().find(f=>f.url().includes('site.html'));await settle(f);await f.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
 check(tag+' landing smoke',await f.locator('.actions').evaluate(e=>{const r=e.getBoundingClientRect();return r.y>=0&&r.bottom<=innerHeight&&r.right<=innerWidth;}));await cap(p,tag+'-home');
 await f.locator('[data-panel=menu-panel]').click();await settle(f);await f.locator('.menu-panel .panel-close').press('Shift+Tab');check(tag+' focus containment',await f.locator('.menu-tab').last().evaluate(e=>e===document.activeElement),await f.evaluate(()=>({active:document.activeElement.outerHTML,items:[...document.querySelectorAll('.menu-panel button')].map(e=>({text:e.innerText,visible:!!e.getClientRects().length}))})));await f.locator('.menu-panel .panel-close').press('Escape');check(tag+' focus return',await f.locator('[data-panel=menu-panel]').evaluate(e=>e===document.activeElement));
 check(tag+' reduced motion',await f.locator('.ticker-track').evaluate(e=>getComputedStyle(e).animationName==='none'));
 if(engine==='chromium'&&[1440,390].includes(width)){
  await p.getByRole('button',{name:'Open example in full screen',exact:true}).click();
  const exit=p.getByRole('button',{name:'Exit full screen and return to Tab Lab frame'});await exit.waitFor({state:'visible'});await settle(f);await p.waitForTimeout(400);
  const before=await p.evaluate(()=>[innerWidth,innerHeight]);const full=await f.evaluate(()=>[innerWidth,innerHeight]);check(tag+' settled fullscreen',await exit.isVisible(),{outer:before,frame:full});await cap(p,tag+'-fullscreen');await exit.click();await p.getByRole('button',{name:'Open example in full screen',exact:true}).waitFor({state:'visible'});await p.waitForTimeout(400);check(tag+' settled return',await f.evaluate(()=>innerWidth>0&&innerHeight>0),await f.evaluate(()=>[innerWidth,innerHeight]));
 }
 if(engine==='chromium'&&width===1440){
  await f.addScriptTag({path:require.resolve('axe-core/axe.min.js')});report.axe=await f.evaluate(async()=>{const r=await axe.run();return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({html:n.html,summary:n.failureSummary}))}));});check('ticker focusable axe',!report.axe.some(v=>v.id==='scrollable-region-focusable'));
  await p.emulateMedia({reducedMotion:'no-preference'});await f.locator('.ticker-toggle').click();check('ticker pause',await f.locator('.ticker-track').evaluate(e=>getComputedStyle(e).animationPlayState==='paused'));await f.locator('.ticker-toggle').click();check('ticker resume',await f.locator('.ticker-track').evaluate(e=>getComputedStyle(e).animationPlayState==='running'));
 }
}catch(e){report.errors.push({tag,error:e.stack});}finally{await cx.close();}}
if(engine==='chromium'){
 const fs=await import('node:fs/promises'),os=await import('node:os'),path=await import('node:path');const temp=await fs.mkdtemp(path.join(os.tmpdir(),'diner-zoom-')),extension=path.join(temp,'extension');await fs.mkdir(extension);
 await fs.writeFile(path.join(extension,'manifest.json'),JSON.stringify({manifest_version:3,name:'Local QA zoom',version:'1.0',permissions:['tabs'],background:{service_worker:'worker.js'}}));await fs.writeFile(path.join(extension,'worker.js'),'chrome.runtime.onInstalled.addListener(()=>{});');
 let zcx;try{
 zcx=await pw.chromium.launchPersistentContext(path.join(temp,'profile'),{channel:'chromium',headless:true,args:['--disable-extensions-except='+extension,'--load-extension='+extension],viewport:{width:1440,height:900}});
 const worker=zcx.serviceWorkers()[0]||await zcx.waitForEvent('serviceworker'),zp=await zcx.newPage();await zp.goto(origin+base+'site.html');const before=await zp.evaluate(()=>[innerWidth,innerHeight,devicePixelRatio]);
 const level=await worker.evaluate(async url=>{const t=(await chrome.tabs.query({})).find(t=>t.url===url);await chrome.tabs.setZoom(t.id,2);return chrome.tabs.getZoom(t.id);},origin+base+'site.html');await zp.waitForTimeout(500);await settle(zp);const after=await zp.evaluate(()=>[innerWidth,innerHeight,devicePixelRatio]);check('native 200 zoom',level===2&&after[0]===before[0]/2&&after[2]===before[2]*2,{before,after,level});await cap(zp,'native-200-home');
 await zp.locator('[data-panel=find-panel]').click();await zp.locator('.find-panel [data-demo-action=email]').click();await settle(zp);await cap(zp,'native-200-email');check('native zoom contact close',await zp.locator('.contact-panel .panel-close').evaluate(e=>{const r=e.getBoundingClientRect();return r.y>=0&&r.bottom<=innerHeight;}));
 }catch(e){report.errors.push({probe:'native zoom',error:e.stack});}finally{await zcx?.close();await fs.rm(temp,{recursive:true,force:true});}
}
}finally{await browser.close();await new Promise(r=>server.close(r));await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}
console.log(JSON.stringify({engine,checks:report.checks.length,failures:report.failures,errors:report.errors,captures:report.captures.length}));if(report.failures.length||report.errors.length)process.exitCode=1;
