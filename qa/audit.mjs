import { chromium } from 'playwright';
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
const output=resolve(here,'results');
await mkdir(output,{recursive:true});
let server;
let base=process.env.QA_BASE_URL;
if(!base) {
  const root=resolve(here,'../public');
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
  await new Promise(r=>server.listen(4173,'127.0.0.1',r));
  base='http://127.0.0.1:4173';
}
const browser=await chromium.launch({headless:true});
const report={target:targetName,base,commit:process.env.GITHUB_SHA||'local',screens:[],limitations:['Viewport/touch emulation; not physical devices.','Screenshots require human visual review; geometry assertions do not judge design quality.']};

// Shared read-only inspection. Ignore hidden/transparent artwork used as mobile backgrounds.
async function inspect(frame) {
  return frame.evaluate(()=>{
    const shown=el=>{const r=el.getBoundingClientRect();if(!r.width||!r.height)return false;for(let a=el;a;a=a.parentElement){const s=getComputedStyle(a);if(s.display==='none'||s.visibility==='hidden'||Number(s.opacity)===0)return false;}return true;};
    const issues=[];
    if(document.documentElement.scrollWidth>innerWidth+2) issues.push('Horizontal document overflow');
    for(const img of document.images) if(shown(img)&&(!img.complete||!img.naturalWidth)) issues.push('Broken image: '+img.getAttribute('src'));
    const selectors='.feature-copy h2,.feature-copy p,.mobile-order-button,.overlay:not([hidden]) h2,.overlay:not([hidden]) p,.overlay:not([hidden]) strong,.overlay:not([hidden]) small,.overlay:not([hidden]) article span,.overlay:not([hidden]) label,.overlay:not([hidden]) input,.overlay:not([hidden]) select,.overlay:not([hidden]) textarea,.overlay:not([hidden]) button';
    const measured=[];
    for(const el of document.querySelectorAll(selectors)) {
      if(!shown(el)||!el.textContent.trim()) continue;
      const r=el.getBoundingClientRect(),s=getComputedStyle(el),text=el.textContent.trim().replace(/\s+/g,' ').slice(0,85);
      measured.push({text,font:parseFloat(s.fontSize),x:r.x,y:r.y,width:r.width,height:r.height});
      if(parseFloat(s.fontSize)<12) issues.push('Small text: '+text+' ('+s.fontSize+')');
      // A scrollable overlay may intentionally contain off-screen content. Only flag
      // clipping by non-scrollable hidden ancestors, and visible landing controls.
      let a=el.parentElement;
      while(a&&a!==document.body) {
        const cs=getComputedStyle(a),ar=a.getBoundingClientRect();
        // Contents can intentionally extend beyond a scrollable panel. Its
        // ancestors must not cause a false clipping failure for scrollable text.
        if(['auto','scroll'].includes(cs.overflowY)&&a.scrollHeight>a.clientHeight+2) break;
        if(['hidden','clip'].includes(cs.overflowY)&&(r.top<ar.top-2||r.bottom>ar.bottom+2)) {issues.push('Clipped vertically: '+text);break;}
        if(['hidden','clip'].includes(cs.overflowX)&&(r.left<ar.left-2||r.right>ar.right+2)) {issues.push('Clipped horizontally: '+text);break;}
        a=a.parentElement;
      }
      if(!el.closest('.overlay')&&(r.top< -2||r.bottom>innerHeight+2||r.right>innerWidth+2||r.left< -2)) issues.push('Outside viewport: '+text);
      if(!el.closest('.overlay')&&el.scrollHeight>el.clientHeight+2&&['hidden','clip'].includes(s.overflowY)) issues.push('Text truncated: '+text);
    }
    return {viewport:{width:innerWidth,height:innerHeight},issues:[...new Set(issues)],measured};
  });
}

try {
  for(const screen of screens) {
    const entry={name:screen.name,width:screen.width,height:screen.height,checks:[],captures:[],errors:[]};
    report.screens.push(entry);
    const context=await browser.newContext({viewport:{width:screen.width,height:screen.height},isMobile:!!screen.mobile,hasTouch:!!screen.mobile,deviceScaleFactor:1});
    // Audit cannot send a real order/payment even if a future site's form is wired.
    await context.route('**/*',route=>['GET','HEAD'].includes(route.request().method())?route.continue():route.abort());
    const page=await context.newPage();
    page.setDefaultTimeout(10000);
    page.setDefaultNavigationTimeout(15000);
    console.log(screen.name+': starting');
    page.on('pageerror',e=>entry.errors.push(e.message));
    page.on('response',response=>{if(response.status()>=400&&['document','image','stylesheet','script','font'].includes(response.request().resourceType()))entry.errors.push('HTTP '+response.status()+': '+response.url());});
    page.on('requestfailed',request=>{if(['document','image','stylesheet','script','font'].includes(request.resourceType()))entry.errors.push('Asset request failed: '+request.url());});
    const check=(pass,label)=>entry.checks.push({pass,label});
    try {
      await page.goto(new URL(target.path,base).href,{waitUntil:'domcontentloaded',timeout:15000});
      const iframe=page.locator('iframe');
      check((await iframe.count())===1,'Demo wrapper contains required iframe');
      const content=await iframe.count()?await iframe.elementHandle().then(e=>e.contentFrame()):page;
      await content.waitForLoadState('load');
      const capture=async(name)=>{
        console.log(screen.name+': capture '+name);
        await page.screenshot({path:resolve(output,screen.name+'-'+name+'.png'),animations:'disabled'});
        const layout=await inspect(content);
        const outer=content===page?null:await inspect(page);
        entry.captures.push({name,file:screen.name+'-'+name+'.png',...layout,outer});
        check(!layout.issues.length, name+': readable and unclipped ('+layout.issues.join('; ')+')');
        if(outer) check(!outer.issues.length,name+': frame fits viewport ('+outer.issues.join('; ')+')');
      };
      await capture('framed');
      const full=page.getByRole('button',{name:'Open example in full screen',exact:true});
      check((await full.count())===1,'Required full-screen control exists');
      if(await full.count()) {
        await full.click();
        await page.getByRole('button',{name:'Exit full screen and return to Tab Lab frame',exact:true}).waitFor({state:'visible'});
        await page.waitForTimeout(250);
        await capture('fullscreen');
      }
      const adapter=await import('./demos/'+target.adapter+'.mjs');
      await adapter.audit({page,content,capture,check});
      const exit=page.getByRole('button',{name:'Exit full screen and return to Tab Lab frame',exact:true});
      if(await exit.isVisible()) {
        await exit.click();
        check(await full.isVisible(),'Tab Lab tab restores browser frame');
      }
      const back=page.getByRole('button',{name:'Back to gallery',exact:true});
      check((await back.count())===1,'Required gallery return exists');
      if(await back.count()) {
        await back.click();
        await page.waitForURL(u=>u.pathname.replace(/index\.html$/,'')===target.gallery);
        check(true,'Back to gallery reaches expected Tab Lab gallery');
      }
    } catch(e) {entry.errors.push(e.stack);check(false,'Runtime: '+e.message);await page.screenshot({path:resolve(output,screen.name+'-runtime-failure.png'),timeout:10000}).catch(()=>{});}
    finally {await context.close();}
    await writeFile(resolve(output,'report.json'),JSON.stringify(report,null,2));
    console.log(screen.name+': '+entry.checks.filter(c=>!c.pass).length+' failed checks; '+entry.errors.length+' runtime errors');
  }
} finally {
  await browser.close();
  if(server) await new Promise(r=>server.close(r));
}
const failed=report.screens.flatMap(s=>s.checks.filter(c=>!c.pass).map(c=>s.name+': '+c.label));
await writeFile(resolve(output,'summary.txt'),[...report.limitations,'',...failed].join('\n'));
console.log('Evidence saved to qa/results. Manual visual review required.');
if(failed.length||report.screens.some(s=>s.errors.length)) process.exitCode=1;
