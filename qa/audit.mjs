import { chromium, firefox, webkit } from 'playwright';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { dirname, resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const here=dirname(fileURLToPath(import.meta.url));
const targets=JSON.parse(await readFile(resolve(here,'targets.json'),'utf8'));
const screens=JSON.parse(await readFile(resolve(here,'screens.json'),'utf8'));
const targetName=process.env.QA_TARGET || 'donut';
const target=targets[targetName];
if(!target) throw new Error(`Unknown QA_TARGET: ${targetName}`);
const browserName=process.env.QA_BROWSER || 'chromium';
const engine={chromium,firefox,webkit}[browserName];
if(!engine) throw new Error('Unsupported QA_BROWSER: '+browserName);
const runId=process.env.GITHUB_RUN_ID || new Date().toISOString().replace(/[:.]/g,'-');
const output=resolve(here,'results',targetName,runId,browserName);
await mkdir(output,{recursive:true});
let server;
let base=process.env.QA_BASE_URL;
if(!base) {
  const root=resolve(process.env.QA_ROOT || resolve(here,'../public'));
  const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.json':'application/json'};
  server=createServer(async(req,res)=>{
    try {
      let file=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
      if(file!==root&&!file.startsWith(root+sep)) {res.writeHead(403).end();return;}
      try {if((await stat(file)).isDirectory()) file=resolve(file,'index.html');} catch {if(!extname(file)) file+='.html';}
      const bytes=await readFile(file);
      res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream'}).end(bytes);
    } catch {res.writeHead(404).end('Not found');}
  });
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(4173,'127.0.0.1',resolve);});
  base='http://127.0.0.1:4173';
}
let browser;
try {browser=await engine.launch({headless:true});}
catch(error) {await writeFile(resolve(output,'setup-failure.json'),JSON.stringify({browser:browserName,error:error.stack}));if(server)await new Promise(r=>server.close(r));throw error;}
const report={target:targetName,base,browser:browserName,browserVersion:browser.version(),platform:process.platform,startedAt:new Date().toISOString(),reviewStatus:'Pending visual and checklist review',commit:process.env.GITHUB_SHA||'local',screens:[],limitations:['Viewport/touch emulation; not physical devices.','Screenshots require human visual review; geometry assertions do not judge design quality.', ...(browserName==='firefox'?['Firefox: viewport/touch only; isMobile unsupported.']:[]), ...(browserName==='webkit'?['Linux WebKit is not actual Safari or iOS.']:[])]};

// Shared read-only inspection. Ignore hidden/transparent artwork used as mobile backgrounds.
async function inspect(frame) {
  return frame.evaluate(({selector,minTextPx,fixedViewport})=>{
    const shown=el=>{const r=el.getBoundingClientRect();if(!r.width||!r.height)return false;for(let a=el;a;a=a.parentElement){const s=getComputedStyle(a);if(s.display==='none'||s.visibility==='hidden'||Number(s.opacity)===0)return false;}return true;};
    const issues=[];
    if(document.documentElement.scrollWidth>innerWidth+2) issues.push('Horizontal document overflow');
    for(const img of document.images) if(shown(img)&&(!img.complete||!img.naturalWidth)) issues.push('Broken image: '+img.getAttribute('src'));
    const measured=[];
    for(const el of document.querySelectorAll(selector)) {
      if(!shown(el)) continue;
      const raw=(el instanceof HTMLInputElement||el instanceof HTMLTextAreaElement)?el.value||el.placeholder||el.getAttribute('name')||el.tagName:el.textContent;
      if(!raw.trim()) continue;
      const r=el.getBoundingClientRect(),s=getComputedStyle(el),text=raw.trim().replace(/\s+/g,' ').slice(0,85);
      measured.push({text,font:parseFloat(s.fontSize),x:r.x,y:r.y,width:r.width,height:r.height});
      if(parseFloat(s.fontSize)<minTextPx) issues.push('Small text: '+text+' ('+s.fontSize+')');
      // A scrollable overlay may intentionally contain off-screen content. Only flag
      // clipping by non-scrollable hidden ancestors, and visible landing controls.
      let a=el.parentElement,bounds=r;
      while(a&&a!==document.body) {
        const cs=getComputedStyle(a),ar=a.getBoundingClientRect();
        // Contents can intentionally extend beyond a scrollable panel. Its
        // ancestors must not cause a false clipping failure for scrollable text.
        if(['auto','scroll'].includes(cs.overflowY)&&a.scrollHeight>a.clientHeight+2) bounds=ar;
        if(['hidden','clip'].includes(cs.overflowY)&&(bounds.top<ar.top-2||bounds.bottom>ar.bottom+2)) {issues.push('Clipped vertically: '+text);break;}
        if(['hidden','clip'].includes(cs.overflowX)&&(bounds.left<ar.left-2||bounds.right>ar.right+2)) {issues.push('Clipped horizontally: '+text);break;}
        a=a.parentElement;
      }
      if(fixedViewport&&!el.closest('.overlay')&&(r.top< -2||r.bottom>innerHeight+2||r.right>innerWidth+2||r.left< -2)) issues.push('Outside viewport: '+text);
      if(!el.closest('.overlay')&&el.scrollHeight>el.clientHeight+2&&['hidden','clip'].includes(s.overflowY)) issues.push('Text truncated: '+text);
    }
    return {viewport:{width:innerWidth,height:innerHeight},issues:[...new Set(issues)],measured};
  },{selector:target.textSelector||'h1,h2,h3,p,label,button,input,select,textarea',minTextPx:target.minTextPx||12,fixedViewport:!!target.fixedViewport});
}

try {
  for(const screen of screens) {
    const entry={name:screen.name,width:screen.width,height:screen.height,checks:[],captures:[],errors:[],assetFailures:[],blockedRequests:[],consoleWarnings:[]};
    report.screens.push(entry);
    const check=(pass,label)=>entry.checks.push({pass,label});
    let context,page;
    try {
    context=await browser.newContext({viewport:{width:screen.width,height:screen.height},...(browserName==='firefox'?{}:{isMobile:!!screen.mobile}),hasTouch:!!screen.mobile,deviceScaleFactor:1});
    // Defense in depth only: adapters must avoid live side effects, including GETs.
    await context.route('**/*',route=>{if(['GET','HEAD'].includes(route.request().method()))return route.continue();entry.blockedRequests.push({method:route.request().method(),url:route.request().url()});return route.abort();});
    page=await context.newPage();
    page.setDefaultTimeout(10000);
    page.setDefaultNavigationTimeout(15000);
    console.log(screen.name+': starting');
    page.on('console',message=>{if(['warning','error'].includes(message.type()))entry.consoleWarnings.push({type:message.type(),text:message.text()});});
    page.on('pageerror',e=>entry.errors.push(e.message));
    page.on('response',response=>{if(response.status()>=400&&['document','image','stylesheet','script','font'].includes(response.request().resourceType()))entry.assetFailures.push('HTTP '+response.status()+': '+response.url());});
    page.on('requestfailed',request=>{if(['document','image','stylesheet','script','font'].includes(request.resourceType()))entry.assetFailures.push('Asset request failed: '+request.url());});
      await page.goto(new URL(target.path,base).href,{waitUntil:'domcontentloaded',timeout:15000});
      const iframe=page.locator(target.frameSelector||'iframe');
      if(target.wrapped) check((await iframe.count())===1,'Demo wrapper contains required iframe');
      const content=(target.wrapped||target.frameSelector)?await iframe.elementHandle().then(e=>e.contentFrame()):page;
      await content.waitForLoadState('load');
      const capture=async(name)=>{
        console.log(screen.name+': capture '+name);
        await page.screenshot({path:resolve(output,screen.name+'-'+name+'.png'),animations:'disabled',fullPage:!target.wrapped});
        const layout=await inspect(content);
        const outer=content===page?null:await inspect(page);
        entry.captures.push({name,file:screen.name+'-'+name+'.png',leadReviewed:false,reviewNotes:'',...layout,outer});
        check(!layout.issues.length, name+': readable and unclipped ('+layout.issues.join('; ')+')');
        if(outer) check(!outer.issues.length,name+': frame fits viewport ('+outer.issues.join('; ')+')');
      };
      await capture('framed');
      if(screen.mobile) {
        await page.setViewportSize({width:screen.height,height:screen.width});
        await page.waitForTimeout(750);
        await capture('rotated');
        await page.setViewportSize({width:screen.width,height:screen.height});
        await page.waitForTimeout(750);
      }
      const full=page.getByRole('button',{name:'Open example in full screen',exact:true});
      if(target.wrapped) check((await full.count())===1,'Required full-screen control exists');
      if(await full.count()) {
        await full.click();
        await page.getByRole('button',{name:'Exit full screen and return to Tab Lab frame',exact:true}).waitFor({state:'visible'});
        await page.waitForTimeout(250);
        await capture('fullscreen');
      }
      if(target.adapter) {
        const adapter=await import('./demos/'+target.adapter+'.mjs');
        await adapter.audit({page,content,capture,check,screen});
      }
      const exit=page.getByRole('button',{name:'Exit full screen and return to Tab Lab frame',exact:true});
      if(await exit.isVisible()) {
        await exit.click();
        check(await full.isVisible(),'Tab Lab tab restores browser frame');
      }
      const back=page.getByRole('button',{name:'Back to gallery',exact:true});
      if(target.wrapped) check((await back.count())===1,'Required gallery return exists');
      if(await back.count()) {
        await back.click();
        await page.waitForURL(u=>u.pathname.replace(/index\.html$/,'')===target.gallery);
        check(true,'Back to gallery reaches expected Tab Lab gallery');
      }
    } catch(e) {entry.errors.push(e.stack);check(false,'Runtime: '+e.message);if(page)await page.screenshot({path:resolve(output,screen.name+'-runtime-failure.png'),timeout:10000}).catch(()=>{});}
    finally {if(context)await context.close();}
    await writeFile(resolve(output,'report.json'),JSON.stringify(report,null,2));
    console.log(screen.name+': '+entry.checks.filter(c=>!c.pass).length+' failed checks; '+entry.errors.length+' JavaScript/runtime errors; '+entry.assetFailures.length+' asset failures');
  }
} finally {
  await browser.close();
  if(server) await new Promise(r=>server.close(r));
}
const failed=report.screens.flatMap(s=>s.checks.filter(c=>!c.pass).map(c=>s.name+': '+c.label));
await writeFile(resolve(output,'summary.txt'),[...report.limitations,'',...failed].join('\n'));
report.finishedAt=new Date().toISOString();
report.unclassifiedBlockedRequests=report.screens.reduce((n,s)=>n+s.blockedRequests.length,0);
await writeFile(resolve(output,'report.json'),JSON.stringify(report,null,2));
console.log('Evidence saved to '+output+'. Manual visual and conditional checklist review required.');
if(failed.length||report.screens.some(s=>s.errors.length||s.assetFailures.length||s.blockedRequests.length)) process.exitCode=1;
