import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createHash} from 'node:crypto';
const require=createRequire(import.meta.url),pw=require('playwright');
const engine=process.env.QA_BROWSER||'chromium',root=resolve('public'),out=resolve('qa/minigolf-results',engine);
await mkdir(out,{recursive:true});
const report={mode:'routine',engine,commit:process.env.GITHUB_SHA,captures:[],checks:[],errors:[],console:[],assets:[],sourceHashes:{},limitations:['Linux emulation, not physical phones or Safari/iOS.','No real booking or message delivery.']};
const base='/boardroom/billboard/demos/mini-golf/';
for(const rel of ['index.html','site.html','css/style.css','css/mobile-final.css','js/app.js'])report.sourceHashes[rel]=createHash('sha256').update(await readFile(resolve(root,'.'+base,rel))).digest('hex');
const mime={'.html':'text/html','.css':'text/css','.js':'application/javascript','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{let p=resolve(root,'.'+new URL(req.url,'http://local').pathname);if(!p.startsWith(root+'/'))throw Error();if((await stat(p)).isDirectory())p+='/index.html';res.writeHead(200,{'Content-Type':mime[extname(p)]||'application/octet-stream'}).end(await readFile(p));}catch{res.writeHead(404).end('Not found');}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port;
const browser=await pw[engine].launch({headless:true});report.version=browser.version();
const sizes=engine==='chromium'?[[1440,900],[390,844],[844,390],[320,568],[780,300],[900,600],[901,600]]:[[1440,900],[390,844]];
async function settle(f){await f.locator('body').evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));await Promise.all(document.getAnimations().filter(a=>a.playState==='running'&&a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})));});}
async function capture(page,f,label){await settle(f);const file=label+'.png';await page.screenshot({path:resolve(out,file)});report.captures.push({file,viewport:await page.evaluate(()=>[innerWidth,innerHeight]),state:label,visuallyInspected:false});}
async function geom(f,label){report.checks.push({label,geometry:await f.locator('body').evaluate(()=>({viewport:[innerWidth,innerHeight],overflow:document.documentElement.scrollWidth>innerWidth,visible:[...document.querySelectorAll('.overlay:not([hidden]) .overlay-panel,.overlay:not([hidden]) .overlay-close,.overlay:not([hidden]) input,.overlay:not([hidden]) button,.mobile-hero-copy h1')].filter(e=>e.getClientRects().length).map(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return{tag:e.tagName,text:(e.innerText||e.name||'').slice(0,70),rect:{x:r.x,y:r.y,right:r.right,bottom:r.bottom},font:s.fontSize,overflow:s.overflowY,scroll:[e.clientHeight,e.scrollHeight]};})}))});}
try{for(const [width,height] of sizes){
 const cx=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});await cx.route('**/*',r=>r.request().url().startsWith(origin+'/')&&['GET','HEAD'].includes(r.request().method())?r.continue():r.abort());
 const p=await cx.newPage();p.setDefaultTimeout(7000);p.on('pageerror',e=>report.errors.push(e.message));p.on('console',m=>{if(['error','warning'].includes(m.type()))report.console.push(m.text());});p.on('response',r=>{if(r.status()>=400)report.assets.push({url:r.url(),status:r.status()});});
 try{await p.goto(origin+base,{waitUntil:'load'});const f=p.frames().find(f=>f.url().includes('/site.html'));if(!f)throw Error('Demo frame missing');const tag=width+'x'+height;
 await capture(p,f,tag+'-home');await geom(f,tag+'-home');
 async function open(key){const menu=f.locator('.mobile-nav-toggle');if(await menu.isVisible()&&await menu.getAttribute('aria-expanded')!=='true')await menu.click();await f.locator('.hotspots [data-overlay="'+key+'"]').click();await f.locator('#overlay-'+key).waitFor({state:'visible'});await settle(f);}
 async function close(){await f.locator('.overlay:not([hidden]) .overlay-close').press('Escape');}
 await open('book');await capture(p,f,tag+'-book');await geom(f,tag+'-book');report.checks.push({label:tag+'-demo-and-semantics',notice:await f.locator('.demo-notice').innerText(),semantic:await f.getByRole('region',{name:'Venue information'}).innerText()});
 await f.locator('button[type="submit"]').click();report.checks.push({label:tag+'-empty-form',valid:await f.locator('form').evaluate(e=>e.checkValidity())});
 await f.locator('[name="name"]').fill('Routine QA');await f.locator('[name="email"]').fill('invalid');await f.locator('[name="date"]').fill('2000-01-01');
 report.checks.push({label:tag+'-invalid-email',valid:await f.locator('[name="email"]').evaluate(e=>e.checkValidity())});
 await f.locator('[name="email"]').fill('qa@example.invalid');
 report.checks.push({label:tag+'-past-date',valid:await f.locator('[name="date"]').evaluate(e=>e.checkValidity())}); await f.locator('[name="date"]').fill('2099-12-31');
 await f.locator('button[type="submit"]').click();report.checks.push({label:tag+'-confirmation',text:await f.locator('.form-status').innerText()});
 await close();report.checks.push({label:tag+'-focus-return',focus:await f.locator('body').evaluate(()=>({html:document.activeElement.outerHTML,visible:!!document.activeElement.getClientRects().length}))});
 if(engine==='chromium'&&(width===1440||width===901)){for(const key of ['course','story','events']){await open(key);await capture(p,f,tag+'-'+key);await geom(f,tag+'-'+key);const panel=f.locator('#overlay-'+key+' .overlay-panel');report.checks.push({label:tag+'-'+key+'-scroll',info:await panel.evaluate(e=>{e.scrollTop=e.scrollHeight;const c=e.querySelector('.overlay-close').getBoundingClientRect();return{client:e.clientHeight,scroll:e.scrollHeight,scrollTop:e.scrollTop,overflow:getComputedStyle(e).overflowY,close:[c.x,c.y,c.bottom],viewport:[innerWidth,innerHeight]};})});if(key==='events'){await f.locator('[data-open-book]').click();report.checks.push({label:'events-to-book',visible:await f.locator('#overlay-book').isVisible()});}await close();}}
 if(engine==='chromium'&&width===320){await open('course');await capture(p,f,tag+'-course');await geom(f,tag+'-course');report.checks.push({label:'narrow-course-scroll',info:await f.locator('#overlay-course .overlay-panel').evaluate(e=>{e.scrollTop=e.scrollHeight;return{scrollTop:e.scrollTop,client:e.clientHeight,scroll:e.scrollHeight,closeTop:e.querySelector('.overlay-close').getBoundingClientRect().top};})});await close();}
 if(engine==='chromium'&&width===390){await open('course');await p.setViewportSize({width:844,height:390});await capture(p,f,'rotation-course');await geom(f,'rotation-course');await close();await p.setViewportSize({width,height});}
 if(engine==='chromium'&&(width===1440||width===390)){await p.getByRole('button',{name:'Open example in full screen',exact:true}).click();await p.getByRole('button',{name:'Exit full screen and return to Tab Lab frame',exact:true}).waitFor({state:'visible'});report.checks.push({label:tag+'-fullscreen',exit:await p.getByRole('button',{name:'Exit full screen and return to Tab Lab frame',exact:true}).isVisible()});await p.getByRole('button',{name:'Exit full screen and return to Tab Lab frame',exact:true}).click();}
 }catch(e){report.errors.push({size:[width,height],error:e.stack});}finally{await cx.close();}
}}finally{await browser.close();await new Promise(r=>server.close(r));await writeFile(resolve(out,'routine-report.json'),JSON.stringify(report,null,2));}
console.log(JSON.stringify({engine,captures:report.captures.length,errors:report.errors}));
