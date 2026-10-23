import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const require=createRequire(import.meta.url),pw=require('playwright');
const engine=process.env.QA_BROWSER||'chromium',root=resolve('public'),out=resolve('qa/diner-results',engine),base='/boardroom/noticeboard/demos/diner/';
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
p.on('pageerror',e=>report.errors.push(e.message));p.on('console',m=>{if(m.type()==='error')report.console.push(m.text());});p.on('response',r=>{if(r.status()>=400)report.assets.push({url:r.url(),status:r.status()});});
try{
await p.goto(origin+base);const f=p.frames().find(f=>f.url().includes('site.html'));await settle(f);
check(tag+' actual viewport',await p.evaluate(([w,h])=>innerWidth===w&&innerHeight===h,[width,height]));
check(tag+' landing reachable',await f.locator('.actions').evaluate(e=>{const r=e.getBoundingClientRect();return r.y>=0&&r.bottom<=innerHeight&&r.x>=0&&r.right<=innerWidth;}));await cap(p,tag+'-home');
await f.locator('[data-panel=menu-panel]').click();await settle(f);
await f.locator('.menu-panel .panel-close').press('Shift+Tab');check(tag+' focus contained',await f.locator('.menu-tab').last().evaluate(e=>e===document.activeElement));
for(const tab of await f.locator('.menu-tab').all()){await tab.click();check(tag+' category '+await tab.getAttribute('data-category'),await tab.getAttribute('aria-pressed')==='true'&&await f.locator('.category-panel.active article').count()===4);}
await f.locator('.menu-tab').first().click();if(engine==='chromium'&&[1440,390,320,780].includes(width))await cap(p,tag+'-menu');
if(engine==='chromium'&&width===390){await p.setViewportSize({width:844,height:390});await settle(f);check('open menu rotation',await f.locator('.menu-panel .panel-close').isVisible());await cap(p,'rotation-menu');await p.setViewportSize({width,height});}
await f.locator('.menu-panel .panel-close').press('Escape');check(tag+' focus return',await f.locator('[data-panel=menu-panel]').evaluate(e=>e===document.activeElement));
await f.locator('[data-panel=find-panel]').click();await settle(f);if(engine==='chromium'&&width===390)await cap(p,tag+'-location');
await f.locator('.find-panel [data-demo-action=email]').click();await settle(f);
await f.locator('.enquiry-form button').click();check(tag+' empty enquiry invalid',!(await f.locator('.enquiry-form').evaluate(e=>e.checkValidity())));
await f.locator('[name=name]').fill('Routine QA');await f.locator('[name=email]').fill('invalid');await f.locator('[name=message]').fill('Local demo test');await f.locator('.enquiry-form button').click();check(tag+' bad email invalid',!(await f.locator('[name=email]').evaluate(e=>e.checkValidity())));
await f.locator('[name=email]').fill('qa@example.invalid');await f.locator('.enquiry-form button').click();check(tag+' demo email confirmation',(await f.locator('.demo-status').innerText()).includes('no enquiry has been sent'));
if(engine==='chromium'&&[1440,390,320,780].includes(width))await cap(p,tag+'-email');
await f.locator('.contact-panel .panel-close').click();check(tag+' return to location',await f.locator('#find-panel').getAttribute('aria-hidden')==='false');
await f.locator('.find-panel [data-demo-action=directions]').click();await f.locator('[data-demo-complete=directions]').click();check(tag+' demo directions',(await f.locator('.demo-status').innerText()).includes('fictional'));
await f.locator('.contact-panel .panel-close').click();await f.locator('.find-panel [data-demo-action=call]').click();await f.locator('[data-demo-complete=call]').click();check(tag+' demo call',(await f.locator('.demo-status').innerText()).includes('no call has been placed'));
await f.locator('.contact-panel .panel-close').click();await f.locator('.find-panel .panel-close').click();
check(tag+' reduced motion',await f.locator('.ticker-track').evaluate(e=>getComputedStyle(e).animationName==='none'));
if(engine==='chromium'&&width===1440){await p.emulateMedia({reducedMotion:'no-preference'});await f.locator('.ticker-toggle').click();check('pause ticker',await f.locator('.ticker-track').evaluate(e=>getComputedStyle(e).animationPlayState==='paused'));await f.locator('.ticker-toggle').click();check('resume ticker',await f.locator('.ticker-track').evaluate(e=>getComputedStyle(e).animationPlayState==='running'));await p.emulateMedia({reducedMotion:'reduce'});
await f.addScriptTag({path:require.resolve('axe-core/axe.min.js')});report.axe=await f.evaluate(async()=>{const r=await axe.run();return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({html:n.html,summary:n.failureSummary}))}));});}
if(engine==='chromium'&&[1440,390].includes(width)){await p.getByRole('button',{name:'Open example in full screen',exact:true}).click();await settle(f);check(tag+' fullscreen return visible',await p.getByRole('button',{name:'Exit full screen and return to Tab Lab frame'}).isVisible(),await f.evaluate(()=>[innerWidth,innerHeight]));await p.getByRole('button',{name:'Exit full screen and return to Tab Lab frame'}).click();await settle(f);check(tag+' return restored',await p.getByRole('button',{name:'Open example in full screen',exact:true}).isVisible(),await f.evaluate(()=>[innerWidth,innerHeight]));}
}catch(e){report.errors.push({tag,error:e.stack});}finally{await cx.close();}}
}finally{await browser.close();await new Promise(r=>server.close(r));await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}
console.log(JSON.stringify({engine,checks:report.checks.length,failures:report.failures,errors:report.errors,captures:report.captures.length}));
if(report.failures.length||report.errors.length)process.exitCode=1;
