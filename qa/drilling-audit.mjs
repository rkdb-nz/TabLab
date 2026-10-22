import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createHash} from 'node:crypto';
const require=createRequire(import.meta.url),pw=require('playwright');
const engine=process.env.QA_BROWSER||'chromium',root=resolve('public'),out=resolve('qa/drilling-results',engine);
await mkdir(out,{recursive:true});
const report={mode:'routine',engine,commit:process.env.GITHUB_SHA,captures:[],checks:[],errors:[],console:[],assets:[],sourceHashes:{},limitations:['Linux emulation, not physical phones or Safari/iOS.','No real booking or message delivery.']};
const base='/boardroom/billboard/demos/drilling/';
for(const rel of ['index.html','site.html','css/style.css','css/mobile-fluid.css','js/app.js'])report.sourceHashes[rel]=createHash('sha256').update(await readFile(resolve(root,'.'+base,rel))).digest('hex');
const mime={'.html':'text/html','.css':'text/css','.js':'application/javascript','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{let p=resolve(root,'.'+new URL(req.url,'http://local').pathname);if(!p.startsWith(root+'/'))throw Error();if((await stat(p)).isDirectory())p+='/index.html';res.writeHead(200,{'Content-Type':mime[extname(p)]||'application/octet-stream'}).end(await readFile(p));}catch{res.writeHead(404).end('Not found');}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port;
const browser=await pw[engine].launch({headless:true});report.version=browser.version();

const sizes=engine==='chromium'?[[1440,900],[390,844],[844,390],[320,568],[780,300]]:[[1440,900],[390,844]];
async function settle(f){await f.locator('body').evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));await Promise.all(document.getAnimations().filter(a=>a.playState==='running'&&a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})));});}
async function cap(p,f,label){await settle(f);const file=label+'.png';await p.screenshot({path:resolve(out,file)});report.captures.push({file,viewport:await p.evaluate(()=>[innerWidth,innerHeight]),state:label,visuallyInspected:false});}
async function geom(f,label){report.checks.push({label,geometry:await f.locator('body').evaluate(()=>({viewport:[innerWidth,innerHeight],overflow:document.documentElement.scrollWidth>innerWidth,title:document.title,description:document.querySelector('meta[name=description]')?.content,active:document.activeElement?.outerHTML,visible:[...document.querySelectorAll('button,input,textarea,.drawer-panel.is-active h2,.drawer-panel.is-active p,.mobile-hero__copy,.mobile-services,.menu-drawer,.drawer-content,.drawer-grid')].filter(e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden').map(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return{tag:e.tagName,text:(e.innerText||e.name||'').slice(0,90),rect:{x:r.x,y:r.y,right:r.right,bottom:r.bottom},font:s.fontSize,color:s.color,background:s.backgroundColor,overflow:s.overflowY,scroll:[e.clientHeight,e.scrollHeight]};})}))});}
try{for(const [width,height] of sizes){
 const cx=await browser.newContext({viewport:{width,height}});
 await cx.route('**/*',r=>r.request().url().startsWith(origin+'/')&&['GET','HEAD'].includes(r.request().method())?r.continue():r.abort());
 const p=await cx.newPage();p.setDefaultTimeout(7000);
 p.on('pageerror',e=>report.errors.push(e.message));p.on('console',m=>{if(['error','warning'].includes(m.type()))report.console.push(m.text());});
 p.on('response',r=>{if(r.status()>=400)report.assets.push({url:r.url(),status:r.status()});});
 try{
 await p.goto(origin+base,{waitUntil:'load'});const f=p.frames().find(f=>f.url().includes('/site.html'));if(!f)throw Error('Demo frame missing');const tag=width+'x'+height;
 await cap(p,f,tag+'-home');await geom(f,tag+'-home');
 if(engine==='chromium'&&width===1440){
 report.checks.push({label:'resource-loading',entries:await f.evaluate(()=>performance.getEntriesByType('resource').map(e=>({name:e.name,duration:e.duration,bytes:e.transferSize})))});
 report.checks.push({label:'all-links',links:await p.locator('a').evaluateAll(es=>es.map(e=>({text:e.textContent,href:e.href}))),innerLinks:await f.locator('a').evaluateAll(es=>es.map(e=>({text:e.textContent,href:e.href})))});
 await f.addScriptTag({path:require.resolve('axe-core/axe.min.js')});report.checks.push({label:'axe-home',result:await f.evaluate(async()=>{const r=await axe.run();return {violations:r.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({html:n.html,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>v.id)};})});
 }
 await f.locator('.menu-toggle').click();await settle(f);
 await f.locator('[data-panel=services]').click();await geom(f,tag+'-services');
 if(engine!=='chromium'||width!==844)await cap(p,f,tag+'-services');
 report.checks.push({label:tag+'-menu-open',expanded:await f.locator('.menu-toggle').getAttribute('aria-expanded'),hidden:await f.locator('.menu-drawer').getAttribute('aria-hidden')});
 if(engine==='chromium'&&width===1440){
 for(const key of ['about','projects','safety']){await f.locator('[data-panel='+key+']').click();await cap(p,f,tag+'-'+key);await geom(f,tag+'-'+key);}
 }
 await f.locator('[data-panel=quote]').click();await settle(f);await geom(f,tag+'-quote');
 if(engine==='chromium'&&[1440,320,780].includes(width))await cap(p,f,tag+'-quote');
 await f.locator('button[type=submit]').click();
 report.checks.push({label:tag+'-empty-form',valid:await f.locator('form').evaluate(e=>e.checkValidity()),status:await f.locator('.form-status').innerText()});
 await f.locator('[name=name]').fill('Routine QA');await f.locator('[name=email]').fill('invalid');await f.locator('[name=project]').fill('Routine demo test. No contact requested.');
 await f.locator('button[type=submit]').click();report.checks.push({label:tag+'-invalid-email',valid:await f.locator('[name=email]').evaluate(e=>e.checkValidity()),status:await f.locator('.form-status').innerText()});
 await f.locator('[name=email]').fill('qa@example.invalid');await f.locator('button[type=submit]').click();report.checks.push({label:tag+'-confirmation',text:await f.locator('.form-status').innerText()});await geom(f,tag+'-confirmation');
 if(engine==='chromium'&&width===1440){
 await cap(p,f,'desktop-confirmation');
 report.checks.push({label:'axe-quote',result:await f.evaluate(async()=>{const r=await axe.run();return{violations:r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({html:n.html,summary:n.failureSummary}))}))};})});
 await f.locator('.menu-close').press('Shift+Tab');report.checks.push({label:'focus-trap',active:await f.locator('body').evaluate(()=>document.activeElement.outerHTML)});
 }
 if(engine==='chromium'&&width===390){await f.locator('[data-panel=services]').click();await p.setViewportSize({width:844,height:390});await cap(p,f,'rotation-services');await geom(f,'rotation-services');await p.setViewportSize({width,height});}
 await f.locator('.menu-close').press('Escape');await settle(f);report.checks.push({label:tag+'-focus-return',focus:await f.locator('body').evaluate(()=>document.activeElement.outerHTML),expanded:await f.locator('.menu-toggle').getAttribute('aria-expanded')});
 if(engine==='chromium'&&width===390){await f.locator('.mobile-menu-cta').click();report.checks.push({label:'get-in-touch',quote:await f.locator('[data-content=quote]').isVisible()});await f.locator('.menu-close').click();}
 if(engine==='chromium'&&[1440,390].includes(width)){
 await p.getByRole('button',{name:'Open example in full screen',exact:true}).click();await settle(p);await settle(f);
 await cap(p,f,tag+'-fullscreen');report.checks.push({label:tag+'-fullscreen',outer:await p.evaluate(()=>[innerWidth,innerHeight]),frame:await f.evaluate(()=>[innerWidth,innerHeight])});
 await p.getByRole('button',{name:'Exit full screen and return to Tab Lab frame',exact:true}).click();await settle(p);await settle(f);
 report.checks.push({label:tag+'-return',outer:await p.evaluate(()=>[innerWidth,innerHeight]),frame:await f.evaluate(()=>[innerWidth,innerHeight]),open:await p.getByRole('button',{name:'Open example in full screen',exact:true}).isVisible()});
 }
 if(engine==='chromium'&&width===1440){
 await p.getByRole('button',{name:'Open menu',exact:true}).click();report.checks.push({label:'wrapper-menu',snapshot:await p.locator('body').innerText(),links:await p.locator('a').evaluateAll(es=>es.map(e=>({text:e.textContent,href:e.href})))});
 await cap(p,f,'wrapper-menu');
 }
 }catch(e){report.errors.push({size:[width,height],error:e.stack});try{await p.screenshot({path:resolve(out,width+'x'+height+'-error.png')});report.captures.push({file:width+'x'+height+'-error.png',viewport:[width,height],state:'error',visuallyInspected:false});}catch{}}finally{await cx.close();}
}
if(engine==='chromium'){
 const cx=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),p=await cx.newPage();await p.goto(origin+base);const f=p.frames().find(f=>f.url().includes('/site.html'));await settle(f);
 report.checks.push({label:'reduced-motion',styles:await f.locator('body').evaluate(()=>[...document.querySelectorAll('.menu-drawer,.menu-backdrop,.menu-icon')].map(e=>({class:e.className,transition:getComputedStyle(e).transitionDuration,animation:getComputedStyle(e).animationDuration})))});
 await cx.close();
}

if(engine==='chromium'){
 const fs=await import('node:fs/promises'),os=await import('node:os'),path=await import('node:path');
 const temp=await fs.mkdtemp(path.join(os.tmpdir(),'drilling-target-zoom-')),extension=path.join(temp,'extension');await fs.mkdir(extension);
 await fs.writeFile(path.join(extension,'manifest.json'),JSON.stringify({manifest_version:3,name:'Local QA zoom',version:'1.0',permissions:['tabs'],background:{service_worker:'worker.js'}}));
 await fs.writeFile(path.join(extension,'worker.js'),'chrome.runtime.onInstalled.addListener(()=>{});');
 let zcx;try{
 zcx=await pw.chromium.launchPersistentContext(path.join(temp,'profile'),{channel:'chromium',headless:true,args:['--disable-extensions-except='+extension,'--load-extension='+extension],viewport:{width:1440,height:900}});
 await zcx.route('**/*',r=>r.request().url().startsWith(origin+'/')&&['GET','HEAD'].includes(r.request().method())?r.continue():r.abort());
 const worker=zcx.serviceWorkers()[0]||await zcx.waitForEvent('serviceworker'),zp=await zcx.newPage();await zp.goto(origin+base+'site.html');
 const before=await zp.evaluate(()=>[innerWidth,innerHeight,devicePixelRatio]);
 const level=await worker.evaluate(async url=>{const t=(await chrome.tabs.query({})).find(t=>t.url===url);await chrome.tabs.setZoom(t.id,2);return chrome.tabs.getZoom(t.id);},origin+base+'site.html');
 await zp.waitForTimeout(500);await settle(zp);
 const after=await zp.evaluate(()=>({viewport:[innerWidth,innerHeight],dpr:devicePixelRatio,heading:(()=>{const e=document.querySelector('.mobile-hero__copy h1'),r=e.getBoundingClientRect();return{width:e.clientWidth,scroll:e.scrollWidth,left:r.x,right:r.right};})()}));
 const cd=await zcx.newCDPSession(zp),shot=await cd.send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false});
 await fs.writeFile(resolve(out,'native-200-home.png'),Buffer.from(shot.data,'base64'));
 report.checks.push({label:'native-200-zoom',level,before,after});report.captures.push({file:'native-200-home.png',viewport:after.viewport,state:'native 200 percent zoom',visuallyInspected:false});
 }catch(e){report.errors.push({probe:'native zoom',error:e.stack});}finally{await zcx?.close();await fs.rm(temp,{recursive:true,force:true});}
}
}finally{await browser.close();await new Promise(r=>server.close(r));await writeFile(resolve(out,'routine-report.json'),JSON.stringify(report,null,2));}
console.log(JSON.stringify({engine,captures:report.captures.length,errors:report.errors}));
