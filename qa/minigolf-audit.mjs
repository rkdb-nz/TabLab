import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const require=createRequire(process.env.SITECHECK_PACKAGE_JSON||import.meta.url);
const pw=require('playwright');
const engine=process.env.QA_BROWSER||'webkit';
const out=resolve(process.env.AUDIT_OUTPUT||`qa/minigolf-results/${engine}`);
await mkdir(out,{recursive:true});
const root=resolve(process.env.QA_ROOT||'public');
const mime={'.html':'text/html','.css':'text/css','.js':'application/javascript','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{let p=resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!p.startsWith(root+'/'))throw Error('path');if((await stat(p)).isDirectory())p+='/index.html';res.writeHead(200,{'Content-Type':mime[extname(p)]||'application/octet-stream'}).end(await readFile(p));}catch{res.writeHead(404).end('Not found');}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin=`http://127.0.0.1:${server.address().port}`;
const path='/boardroom/billboard/demos/mini-golf/';
const sizes=[[1366,768],[1440,900],[1920,1080],[320,568],[568,320],[360,780],[780,360],[390,844],[844,390],[412,915],[915,412],[780,300],[768,1024],[1024,768],[900,600],[901,600]];
const report={engine,version:'',playwright:require('playwright/package.json').version,source:process.env.GITHUB_SHA||process.env.SITECHECK_COMMIT,timestamp:new Date().toISOString(),inventory:{routes:[path,path+'site.html'],dialogs:['course','story','events','book'],controls:['mobile menu','4 navigation hotspots','hero booking','event booking','close','booking form','home anchor','wrapper fullscreen','return tab','gallery','global home','global menu']},screens:[],captures:[],checks:[],errors:[],assets:[],blocked:[],warnings:[],limitations:['Viewport/touch emulation, not physical devices.','CSS fullscreen fallback tested on every engine; native OS fullscreen separate.','No real bookings or email delivery.']};
const browser=await pw[engine].launch({headless:true,timeout:20000});report.version=browser.version();
const check=(pass,label,meta={})=>report.checks.push({pass,label,...meta});
async function inspect(frame){return frame.evaluate(()=>{const shown=e=>{let r=e.getBoundingClientRect();return !!(r.width&&r.height)&&getComputedStyle(e).visibility!=='hidden'&&getComputedStyle(e).display!=='none'&&!e.closest('[hidden]');};return {size:[innerWidth,innerHeight],scroll:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],title:document.title,text:document.body.innerText,links:[...document.querySelectorAll('a')].map(a=>({text:a.getAttribute('aria-label')||a.innerText,href:a.getAttribute('href')})),broken:[...document.images].filter(shown).filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),textMetrics:[...document.querySelectorAll('h1,h2,p,label,input,select,textarea,button,small,strong,.panel-note')].filter(shown).map(e=>{let r=e.getBoundingClientRect(),s=getComputedStyle(e);return {text:(e.innerText||e.getAttribute('aria-label')||e.name||'').trim(),font:s.fontSize,color:s.color,background:s.backgroundColor,rect:[r.x,r.y,r.width,r.height],overflow:[s.overflowX,s.overflowY],scroll:[e.scrollWidth,e.scrollHeight],client:[e.clientWidth,e.clientHeight]};}),storage:{local:Object.keys(localStorage),session:Object.keys(sessionStorage),cookies:document.cookie}};});}
try{for(const [w,h] of sizes){
 const size=`${w}x${h}`;console.log(engine,size);
 const ctx=await browser.newContext({viewport:{width:w,height:h},hasTouch:w<1100,deviceScaleFactor:1});
 await ctx.addInitScript(()=>Object.defineProperty(Element.prototype,'requestFullscreen',{value:undefined,configurable:true}));
 await ctx.route('**/*',r=>{if(r.request().url().startsWith(origin+'/')&&['GET','HEAD'].includes(r.request().method()))return r.continue();report.blocked.push({size,url:r.request().url(),method:r.request().method()});return r.abort();});
 const page=await ctx.newPage();page.setDefaultTimeout(5000);
 page.on('pageerror',e=>report.errors.push({size,error:e.message}));page.on('response',r=>{if(r.status()>=400)report.assets.push({size,url:r.url(),status:r.status()});});page.on('console',m=>{if(['error','warning'].includes(m.type()))report.warnings.push({size,text:m.text()});});
 let frame;
 const cap=async(state)=>{await page.waitForTimeout(80);let actual=await page.evaluate(()=>[innerWidth,innerHeight]);let requested=page.viewportSize();check(actual[0]===requested.width&&actual[1]===requested.height,'Measured viewport',{size,state,actual,requested});let file=`${size}-${state}.png`;await page.screenshot({path:resolve(out,file),animations:'disabled'});report.captures.push({size,state,file,actual,requested,leadReviewed:false,layout:await inspect(frame)});};
 const open=async(key)=>{let toggle=frame.getByRole('button',{name:'Open menu',exact:true});if(await toggle.isVisible())await toggle.click();await frame.locator(`.hotspots [data-overlay="${key}"]`).click();await frame.locator('#overlay-'+key).waitFor({state:'visible'});};
 const close=async()=>{await frame.locator('.overlay:not([hidden]) .overlay-close').click();};
 try{
 await page.goto(origin+path,{waitUntil:'load'});frame=page.frames().find(f=>f.url().includes('/site.html'));
 await cap('framed-home');
 const menu=frame.locator('.mobile-nav-toggle');if(await menu.isVisible()){await menu.click();check(await menu.getAttribute('aria-expanded')==='true','Menu opens',{size});await cap('mobile-menu');await page.setViewportSize({width:h,height:w});await cap('menu-rotated');await page.setViewportSize({width:w,height:h});await menu.press('Escape');check(await menu.getAttribute('aria-expanded')==='false','Menu Escape closes',{size});}
 await open('course');await cap('framed-course');await close();
 await page.getByRole('button',{name:'Open example in full screen',exact:true}).click();const back=page.getByRole('button',{name:'Exit full screen and return to Tab Lab frame',exact:true});check(await back.isVisible(),'Fullscreen return visible',{size});await cap('full-home');
 for(const key of ['course','story','events','book']){
 await open(key);const dialog=frame.locator('#overlay-'+key);await cap('full-'+key);
 const scrollers=await dialog.evaluate(d=>[d,...d.querySelectorAll('*')].filter(e=>['auto','scroll'].includes(getComputedStyle(e).overflowY)&&e.scrollHeight>e.clientHeight+2).map((e,i)=>{e.dataset.auditScroll=String(i);return {id:i,max:e.scrollHeight-e.clientHeight,step:Math.max(50,e.clientHeight*.8)};}));
 for(const {id,max,step} of scrollers){for(let y=step;y<max+step;y+=step){await dialog.locator(`[data-audit-scroll="${id}"]`).evaluate((e,y)=>e.scrollTop=y,Math.min(y,max));await cap(`full-${key}-scroll-${id}-${Math.round(Math.min(y,max))}`);}}
 await frame.locator('.overlay-close:visible').focus();await frame.locator('.overlay-close:visible').press('Shift+Tab');check(await dialog.evaluate(d=>d.contains(document.activeElement)),'Dialog reverse focus stays inside',{size,key});await frame.locator('.overlay-close:visible').press('Escape');check(!(await dialog.isVisible()),'Dialog Escape closes',{size,key});
 if(key==='events'){await open(key);await dialog.getByRole('button',{name:'Plan an event →',exact:true}).click();check(await frame.locator('#overlay-book').isVisible(),'Event CTA opens booking',{size});await close();}
 if(key==='book'){
 await open(key);const form=frame.locator('#booking-form');await form.getByRole('button',{name:'Send booking request →',exact:true}).click();check(await form.evaluate(f=>!f.checkValidity()),'Empty booking rejected',{size});
 await form.locator('[name=name]').fill('Demo Test');await form.locator('[name=email]').fill('invalid');await form.locator('[name=date]').fill('2026-12-04');check(await form.locator('[name=email]').evaluate(e=>!e.checkValidity()),'Invalid email rejected',{size});await form.locator('[name=email]').fill('demo@example.com');await form.locator('[name=players]').selectOption({index:3});await form.locator('[name=notes]').fill('Audit only; no booking intended.');await form.getByRole('button',{name:'Send booking request →',exact:true}).click();let message=await form.locator('.form-status').innerText();check(/no .*sent|demo/i.test(message),'Honest demo confirmation',{size,message});check(await form.locator('[type=submit]').isDisabled(),'Double-submit prevented',{size});await cap('full-confirmation');await close();
 }
 }
 await open('course');await page.setViewportSize({width:h,height:w});await cap('dialog-rotated');await page.setViewportSize({width:w,height:h});await cap('dialog-restored');await close();
 await back.click();check(await page.getByRole('button',{name:'Open example in full screen',exact:true}).isVisible(),'Return restores wrapper',{size});
 await page.getByRole('button',{name:'Back to gallery',exact:true}).click();await page.waitForURL('**/boardroom/billboard/index.html');check(await page.title()!=='','Gallery destination rendered',{size,url:page.url(),title:await page.title()});
 await page.goto(origin+path+'site.html',{waitUntil:'load'});frame=page;await cap('direct-home');await page.reload({waitUntil:'load'});check((await page.title()).includes('A Hole in One'),'Direct refresh',{size});
 await page.emulateMedia({reducedMotion:'reduce'});await open('story');await cap('reduced-motion');await close();await page.evaluate(()=>document.documentElement.style.fontSize='200%');await cap('text-200-percent');
 report.screens.push({size,complete:true});
 }catch(e){report.screens.push({size,complete:false,error:e.stack});await page.screenshot({path:resolve(out,size+'-failure.png')}).catch(()=>{});}
 finally{await ctx.close();await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}
}
}finally{await browser.close();await new Promise(r=>server.close(r));await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}
console.log('Audit evidence captured; visual review pending.');
