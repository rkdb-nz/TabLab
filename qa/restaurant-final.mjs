import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const require=createRequire(import.meta.url),pw=require('playwright'),engine=process.env.QA_BROWSER||'chromium',root=resolve('public'),out=resolve('qa/restaurant-final-results',engine),base='/boardroom/springboard/demos/dining/';
await mkdir(out,{recursive:true});
const report={engine,commit:process.env.GITHUB_SHA,checks:[],captures:[],errors:[],scans:[],assets:[],console:[],links:[],limits:[]};
const server=createServer(async(req,res)=>{try{let p=resolve(root,'.'+new URL(req.url,'http://local').pathname);if(!p.startsWith(root+'/'))throw Error();if((await stat(p)).isDirectory())p+='/index.html';res.writeHead(200,{'Content-Type':({'.html':'text/html','.css':'text/css','.js':'application/javascript','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'})[extname(p)]||'application/octet-stream'}).end(await readFile(p));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
const check=(label,evidence)=>report.checks.push({label,evidence});
async function settle(f){await f.locator('body').evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));await Promise.all(document.getAnimations().filter(a=>a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})));});}
async function cap(p,f,label){await settle(f);await p.screenshot({path:resolve(out,label+'.png')});report.captures.push({file:label+'.png',outer:await p.evaluate(()=>[innerWidth,innerHeight]),frame:await f.evaluate(()=>[innerWidth,innerHeight]),inspected:false});}
async function measure(f,label){check(label,await f.evaluate(()=>({viewport:[innerWidth,innerHeight],scroll:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],controls:[...document.querySelectorAll('a,button,input,select,.faq-q')].filter(e=>e.getClientRects().length).map(e=>({text:e.textContent.trim().slice(0,45),tag:e.tagName,tab:e.tabIndex,rect:(()=>{let r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}})()}))})));}


let browser;
const assert=(label,pass,evidence)=>{check(label,{pass,evidence});if(!pass)throw Error(label+': '+JSON.stringify(evidence));};
try{
 browser=await pw[engine].launch(engine==='chromium'?{channel:'chrome'}:{headless:true});
 report.version=browser.version();
 const sizes=[[1440,900],[390,844]];
 for(const [width,height] of sizes){
  const c=await browser.newContext({viewport:{width,height}}),p=await c.newPage(),tag=width+'x'+height;
  const outbound=[];await c.route('**/*',r=>{if(!['GET','HEAD'].includes(r.request().method())){outbound.push({url:r.request().url(),frame:r.request().frame().url(),method:r.request().method()});return r.abort();}return r.continue();});
  p.on('pageerror',e=>report.errors.push(e.message));
  try{
   await p.goto(origin+base);const f=p.frames().find(f=>f.url().includes('site.html'));await f.goto(origin+base+'sign.html');await settle(f);
   const mobile=width!==1440;if(mobile)await f.locator('#open-email-request').click();
   const form=f.locator(mobile?'#email-request-form':'main .booking-form');
   const button=form.locator('[type=submit]');await button.scrollIntoViewIfNeeded();
   const geometry=await button.evaluate(e=>{const r=e.getBoundingClientRect();return {height:r.height,bottom:r.bottom,viewport:innerHeight};});
   assert(tag+' button height',geometry.height===46,geometry);
   assert(tag+' button reachable',geometry.bottom<=geometry.viewport,geometry);
   assert(tag+' no horizontal overflow',await f.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),{});
   if(mobile)assert(tag+' dialog no horizontal overflow',await f.locator('#booking-email .booking-confirmation-card').evaluate(e=>e.scrollWidth<=e.clientWidth),{});
   // Reuse the inspected final layout captures; this continuation only classifies requests.
   await form.locator('[name=name]').fill('QA Example');await form.locator('[name=phone]').fill('021 000 0000');
   const d=new Date();d.setDate(d.getDate()+7);while(d.getDay()!==3)d.setDate(d.getDate()+1);
   await form.locator('[name=date]').fill([d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-'));
   await button.click();const dialog=f.locator('#booking-confirmation');await dialog.waitFor({state:'visible'});
   assert(tag+' demo only',await dialog.innerText().then(t=>t.includes('No table request has been sent')),{});
   await dialog.locator('button').press('Tab');assert(tag+' tab contained',await dialog.evaluate(e=>e.contains(document.activeElement)),{});
   await dialog.locator('button').press('Shift+Tab');assert(tag+' reverse tab contained',await dialog.evaluate(e=>e.contains(document.activeElement)),{});
   await dialog.locator('button').press('Escape');const wrapperFlags=outbound.filter(o=>o.frame===origin+base&&new URL(o.url).hostname==='us.i.posthog.com'&&new URL(o.url).pathname==='/flags/');
   const requests=outbound.filter(o=>!wrapperFlags.includes(o));
   check(tag+' pre-existing wrapper telemetry',{ignored:wrapperFlags});
   assert(tag+' no booking send attempts',requests.length===0,{requests});
  }catch(e){report.errors.push({tag,error:e.stack});}finally{await c.close();}
 }
}catch(e){report.errors.push(e.stack);}finally{await browser?.close();server.close();await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}
console.log(JSON.stringify({engine,errors:report.errors,captures:report.captures.length}));if(report.errors.length)process.exitCode=1;
