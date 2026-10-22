// QA only. Native Chromium zoom via the already-proven tabs.setZoom method.
// Records layout geometry separately from screenshot raster dimensions.
import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,stat,mkdtemp,rm} from 'node:fs/promises';
import {resolve,extname,join} from 'node:path';
import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';
const require=createRequire(process.env.SITECHECK_PACKAGE_JSON||import.meta.url);
const {chromium,request}=require('playwright');
const engine=process.env.QA_BROWSER||'chromium';
const root=resolve(process.env.QA_ROOT||'public');
const out=resolve(process.env.AUDIT_OUTPUT||`qa/minigolf-results/${engine}`);
await mkdir(out,{recursive:true});
const physical={width:1366,height:768};
const report={kind:'native Chromium zoom recovery',methodSource:'e096ccfa6f7d6dbaa961726e7b3dd208033d1d88:qa/minigolf-audit.mjs',source:process.env.GITHUB_SHA||process.env.SITECHECK_COMMIT||'unrecorded',timestamp:new Date().toISOString(),playwright:require('playwright/package.json').version,physicalViewport:physical,before:null,after:null,sourceHashes:{},checks:[],captures:[],states:[],errors:[],blocked:[],limitations:['Chromium native browser zoom only; other engines and physical hardware outside this probe.','Raster dimensions alone do not prove the entire zoomed page was captured. Inspect CDP captures against DOM geometry.']};
const target='/boardroom/billboard/demos/mini-golf/site.html';
for(const rel of ['site.html','css/style.css','css/mobile-final.css','js/app.js']){const bytes=await readFile(resolve(root,'.'+target.replace('site.html',''),rel));report.sourceHashes[rel]=createHash('sha256').update(bytes).digest('hex');}
const mime={'.html':'text/html','.css':'text/css','.js':'application/javascript','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{let p=resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(p!==root&&!p.startsWith(root+'/'))throw Error('outside root');if((await stat(p)).isDirectory())p+='/index.html';res.writeHead(200,{'Content-Type':mime[extname(p)]||'application/octet-stream'}).end(await readFile(p));}catch{res.writeHead(404).end('Not found');}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin=`http://127.0.0.1:${server.address().port}`;
const temporary=await mkdtemp(join(tmpdir(),'minigolf-zoom-'));
const extension=join(temporary,'extension');await mkdir(extension);
await writeFile(join(extension,'manifest.json'),JSON.stringify({manifest_version:3,name:'Local audit zoom',version:'1.0',permissions:['tabs'],background:{service_worker:'worker.js'}}));
await writeFile(join(extension,'worker.js'),'chrome.runtime.onInstalled.addListener(()=>{});');
let context;
// Metadata requests are safe, lightweight GETs and work in every engine job.
report.engine=engine;report.metadata=[];
const api=await request.newContext();
try{for(const resource of ['/robots.txt','/sitemap.xml']){
 try{const response=await api.get('https://e0d06aac.foundry-a3k.pages.dev'+resource,{timeout:30000});report.metadata.push({resource,url:response.url(),status:response.status(),headers:response.headers(),body:(await response.text()).slice(0,20000)});}
 catch(e){report.errors.push({resource,error:e.stack});}
}}finally{await api.dispose();}
// Recover one initially premature 1920px landing capture with explicit image readiness.
const readyBrowser=await require('playwright')[engine].launch({headless:true});
try{const cx=await readyBrowser.newContext({viewport:{width:1920,height:1080}}),pg=await cx.newPage();await cx.route('**/*',r=>r.request().url().startsWith(origin+'/')?r.continue():r.abort());await pg.goto(origin+'/boardroom/billboard/demos/mini-golf/');const fr=pg.frameLocator('iframe');await fr.locator('.artwork').waitFor({state:'visible'});await fr.locator('.artwork').evaluate(async e=>{await e.decode();});await pg.waitForTimeout(500);const measured=await pg.evaluate(()=>[innerWidth,innerHeight]);await pg.screenshot({path:resolve(out,'1920x1080-framed-home-settled.png'),fullPage:true});report.settledLanding={file:'1920x1080-framed-home-settled.png',measured,imageDecoded:true};await cx.close();}finally{await readyBrowser.close();}
if(engine!=='chromium'){
 report.status='Metadata recovery collected; native Chromium zoom is performed in the Chromium job only';
 await new Promise(r=>server.close(r));await rm(temporary,{recursive:true,force:true});
 await writeFile(resolve(out,'zoom-recovery-report.json'),JSON.stringify(report,null,2));console.log(report.status);process.exit(0);
}
function pngDimensions(bytes){if(bytes.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')throw Error('Invalid PNG');return{width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20)};}
async function geometry(page){return page.evaluate(()=>{
 const rect=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return{selector:e.id?'#'+e.id:e.tagName.toLowerCase()+'.'+e.className,rect:{x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom},client:[e.clientWidth,e.clientHeight],scroll:[e.scrollWidth,e.scrollHeight],overflow:[s.overflowX,s.overflowY],zoom:s.zoom,transform:s.transform,font:s.fontSize};};
 const visible=e=>!e.closest('[hidden]')&&getComputedStyle(e).display!=='none'&&getComputedStyle(e).visibility!=='hidden'&&e.getClientRects().length;
 return{innerWidth,innerHeight,outerWidth,outerHeight,dpr:devicePixelRatio,screen:{width:screen.width,height:screen.height},visualViewport:visualViewport?{width:visualViewport.width,height:visualViewport.height,scale:visualViewport.scale,offsetLeft:visualViewport.offsetLeft,offsetTop:visualViewport.offsetTop,pageLeft:visualViewport.pageLeft,pageTop:visualViewport.pageTop}:null,documentClient:[document.documentElement.clientWidth,document.documentElement.clientHeight],documentScroll:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],media:{max900:matchMedia('(max-width:900px)').matches,landscape:matchMedia('(orientation:landscape)').matches,max520:matchMedia('(max-height:520px)').matches},elements:[...document.querySelectorAll('html,body,.viewport,.stage,.mobile-home,.mobile-header,.mobile-hero-copy,.mobile-highlights,.mobile-details,.hotspots,.overlay:not([hidden]),.overlay:not([hidden]) .overlay-panel')].filter(visible).map(rect),controls:[...document.querySelectorAll('button,input,select,textarea,a[href]')].filter(visible).map(e=>({...rect(e),name:e.getAttribute('aria-label')||e.name||e.textContent.trim().slice(0,100),intersectsViewport:(()=>{const r=e.getBoundingClientRect();return r.right>0&&r.bottom>0&&r.x<innerWidth&&r.y<innerHeight;})(),fullyInViewport:(()=>{const r=e.getBoundingClientRect();return r.x>=0&&r.y>=0&&r.right<=innerWidth&&r.bottom<=innerHeight;})()}))};
 });}
async function saveCapture(state,method,bytes,extra={}){const file=`1366x768-native-zoom-${state}-${method}.png`;const dims=pngDimensions(bytes);await writeFile(resolve(out,file),bytes);report.captures.push({state,method,file,png:dims,physicalViewportMatch:dims.width===physical.width&&dims.height===physical.height,visuallyInspected:false,...extra});}
try{
 context=await chromium.launchPersistentContext(join(temporary,'profile'),{channel:'chromium',headless:true,args:[`--disable-extensions-except=${extension}`,`--load-extension=${extension}`],viewport:physical});
 report.browserVersion=context.browser()?.version()||'persistent Chromium';
 await context.route('**/*',route=>{if(route.request().url().startsWith(origin+'/')&&['GET','HEAD'].includes(route.request().method()))return route.continue();report.blocked.push({url:route.request().url(),method:route.request().method()});return route.abort();});
 const worker=context.serviceWorkers()[0]||await context.waitForEvent('serviceworker',{timeout:20000});
 const page=await context.newPage();page.setDefaultTimeout(10000);await page.goto(origin+target,{waitUntil:'load'});
 report.before=await geometry(page);
 const zoom=await worker.evaluate(async({url})=>{const tabs=await chrome.tabs.query({});const tab=tabs.find(t=>t.url===url);if(!tab)throw Error('Audit tab unavailable');await chrome.tabs.setZoom(tab.id,2);return chrome.tabs.getZoom(tab.id);},{url:origin+target});
 await page.waitForTimeout(750);report.after=await geometry(page);
 report.checks.push({pass:zoom===2&&Math.abs(report.after.innerWidth*2-report.before.innerWidth)<=2&&report.after.dpr===report.before.dpr*2,label:'Native browser zoom is 200 percent',zoom,before:[report.before.innerWidth,report.before.innerHeight,report.before.dpr],after:[report.after.innerWidth,report.after.innerHeight,report.after.dpr]});
 const cdp=await context.newCDPSession(page);
 report.browserVersion=await cdp.send('Browser.getVersion');
 try{report.window=await cdp.send('Browser.getWindowForTarget');}catch(e){report.windowError=e.message;}
 async function capture(state){
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all(document.getAnimations().filter(a=>a.playState==='running').map(a=>a.finished.catch(()=>{})));});
  await page.waitForTimeout(200);
  const dom=await geometry(page),metrics=await cdp.send('Page.getLayoutMetrics');
  report.states.push({state,dom,cdpMetrics:metrics});
  // Use the verified full Chrome surface; cropped diagnostic variants are unnecessary.
  const raw=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false});
  await saveCapture(state,'cdp-surface',Buffer.from(raw.data,'base64'),{primary:true});
  await writeFile(resolve(out,'zoom-recovery-report.json'),JSON.stringify(report,null,2));
 }
 await capture('home');
 const home=page.locator('.mobile-home');if(await home.isVisible()){await home.evaluate(e=>e.scrollTop=e.scrollHeight);await capture('home-end');await home.evaluate(e=>e.scrollTop=0);}
 for(const key of ['course','story','events','book']){
  const toggle=page.locator('.mobile-nav-toggle');if(await toggle.isVisible()&&await toggle.getAttribute('aria-expanded')!=='true')await toggle.click();
  await page.locator(`.hotspots [data-overlay="${key}"]`).click();await page.locator('#overlay-'+key).waitFor({state:'visible'});
  await capture(key);const panel=page.locator('#overlay-'+key+' .overlay-panel');const max=await panel.evaluate(e=>e.scrollHeight-e.clientHeight);if(max>2){for(let y=200;y<max+200;y+=200){await panel.evaluate((e,y)=>e.scrollTop=y,Math.min(y,max));await capture(key+'-scroll-'+Math.round(Math.min(y,max)));}}await page.locator('#overlay-'+key+' .overlay-close').press('Escape');
 }
 report.status='Native zoom geometry and capture variants collected; visual review pending';
}catch(e){report.errors.push({error:e.stack});report.status='Zoom recovery incomplete';process.exitCode=1;}
finally{await context?.close();await new Promise(r=>server.close(r));await rm(temporary,{recursive:true,force:true});await writeFile(resolve(out,'zoom-recovery-report.json'),JSON.stringify(report,null,2));}
console.log(report.status);
