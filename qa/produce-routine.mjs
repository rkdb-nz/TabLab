import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const require=createRequire(import.meta.url),pw=require('playwright'),engine=process.env.QA_BROWSER||'chromium',out=resolve('qa/produce-repair-results',engine),root=resolve('public');
await mkdir(out,{recursive:true});
const report={engine,commit:process.env.GITHUB_SHA,checks:[],captures:[],errors:[],assets:[],scans:[],limitations:['Linux emulation; not physical phones or Safari.']};
const server=createServer(async(req,res)=>{try{let p=resolve(root,'.'+new URL(req.url,'http://local').pathname);if(!p.startsWith(root+'/'))throw Error();if((await stat(p)).isDirectory())p+='/index.html';res.writeHead(200,{'Content-Type':({'.html':'text/html','.css':'text/css','.js':'application/javascript','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp'})[extname(p)]||'application/octet-stream'}).end(await readFile(p));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port,base='/boardroom/noticeboard/demos/produce/';
const check=(label,evidence)=>report.checks.push({label,evidence});
async function settle(f){await f.locator('body').evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});await new Promise(r=>setTimeout(r,650));}
async function cap(p,label){await p.screenshot({path:resolve(out,label+'.png')});report.captures.push({file:label+'.png',viewport:await p.evaluate(()=>[innerWidth,innerHeight]),state:label,inspected:false});}
async function metrics(f,label){check(label,await f.evaluate(()=>({viewport:[innerWidth,innerHeight],document:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],active:document.activeElement?.outerHTML,visible:[...document.querySelectorAll('h1,h2,p,a,button,li,.contact-card')].filter(e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden').map(e=>{const r=e.getBoundingClientRect();return {text:(e.innerText||e.getAttribute('aria-label')||'').slice(0,100),rect:[r.x,r.y,r.width,r.height]};})}))); }
let browser;
try{browser=await pw[engine].launch();report.version=browser.version();
for(const [width,height] of (engine==='chromium'?[[1440,900],[390,844],[844,390],[320,568],[780,300]]:[[1440,900],[390,844]])){
const tag=width+'x'+height,c=await browser.newContext({viewport:{width,height}}),p=await c.newPage();
p.on('pageerror',e=>report.errors.push(e.message));p.on('response',r=>{if(r.status()>=400)report.assets.push({url:r.url(),status:r.status()});});
try{await p.goto(origin+base);const f=p.frames().find(f=>f.url().includes('site.html'));await settle(f);if(engine==='chromium')await cap(p,tag+'-home');if(engine==='chromium'&&width===780){await f.locator('.board ol').focus();await p.keyboard.press('End');check('short board scroll',await f.locator('.board ol').evaluate(e=>({top:e.scrollTop,scroll:e.scrollHeight,client:e.clientHeight,font:getComputedStyle(e).fontSize})));await cap(p,'short-board-bottom');await f.locator('.board ol').evaluate(e=>e.scrollTop=0);}await metrics(f,tag+' home');
check(tag+' links',await f.locator('a').evaluateAll(es=>es.map(e=>({text:e.innerText,href:e.href}))));
check(tag+' demo board',await f.locator('.edit-message').innerText());
for(const panel of ['about','find']){await f.locator('[data-panel="'+panel+'-panel"]').click();await settle(f);check(tag+' '+panel+' open',await f.locator('#'+panel+'-panel').getAttribute('aria-hidden'));await metrics(f,tag+' '+panel);
check(tag+' '+panel+' focus inside',await f.evaluate(()=>document.querySelector('.side-panel.open').contains(document.activeElement)));
const opened=f.locator('#'+panel+'-panel');
await opened.evaluate(e=>e.scrollTop=e.scrollHeight);
check(tag+' '+panel+' scroll bottom',await opened.evaluate(e=>({top:e.scrollTop,height:e.clientHeight,scroll:e.scrollHeight,last:(e.querySelector('.thank-you')||e.querySelector('.contact-card')).getBoundingClientRect().bottom,panelBottom:e.getBoundingClientRect().bottom})));
if(panel==='about')check(tag+' no overlap',await f.evaluate(()=>document.querySelector('.thank-you').getBoundingClientRect().top>=document.querySelector('.panel-card:last-of-type').getBoundingClientRect().bottom));
if(panel==='find'&&width===390){await f.locator('[data-demo-contact="call"]').click();check(tag+' demo call',await f.locator('.demo-result').innerText());await f.locator('[data-demo-contact="email"]').click();check(tag+' demo email',await f.locator('.demo-result').innerText());}
if(engine==='chromium'&&width===390&&panel==='find')await cap(p,'demo-contact-bottom');
await opened.evaluate(e=>e.scrollTop=0);if(engine==='chromium'&&[390,780].includes(width)&&panel==='about')await cap(p,tag+'-'+panel);
if(engine==='chromium'&&width===390&&panel==='find'){await p.setViewportSize({width:844,height:390});await settle(f);await metrics(f,'rotation find');await p.setViewportSize({width,height});await settle(f);}
await f.locator('#'+panel+'-panel .panel-close').click();await settle(f);}
await f.locator('[data-panel="about-panel"]').focus();await p.keyboard.press('Enter');await p.keyboard.press('Tab');check(tag+' keyboard panel focus',await f.evaluate(()=>({active:document.activeElement.outerHTML,open:document.querySelector('.side-panel.open')?.id})));await p.keyboard.press('Escape');check(tag+' focus restored',await f.locator('[data-panel="about-panel"]').evaluate(e=>e===document.activeElement));check(tag+' Escape',await f.locator('.side-panel.open').count());
if(engine==='chromium'&&width===1440){await f.addScriptTag({path:require.resolve('axe-core/axe.min.js')});report.scans.push(await f.evaluate(async()=>{const r=await axe.run();return r.violations.map(v=>({id:v.id,impact:v.impact,help:v.help,nodes:v.nodes.map(n=>({html:n.html,summary:n.failureSummary}))}));}));}
if(engine==='chromium'&&[1440,390].includes(width)){await p.getByRole('button',{name:'Open example in full screen',exact:true}).click();await settle(f);check(tag+' fullscreen',await f.evaluate(()=>[innerWidth,innerHeight]));await p.getByRole('button',{name:'Exit full screen and return to Tab Lab frame',exact:true}).click();await settle(f);check(tag+' return',await f.evaluate(()=>[innerWidth,innerHeight]));await p.getByRole('button',{name:'Back to gallery',exact:true}).click();await p.waitForURL('**/noticeboard/index.html');check(tag+' gallery',p.url());}
if(engine==='chromium'&&width===1440){await p.goto(origin+base+'site.html');await p.keyboard.press('Control++');check('native zoom attempt',await p.evaluate(()=>({width:innerWidth,dpr:devicePixelRatio})));await p.evaluate(()=>document.documentElement.style.zoom='2');await settle(p);await cap(p,'css200-surrogate');check('CSS200 geometry',await p.evaluate(()=>({viewport:[innerWidth,innerHeight],page:document.querySelector('.page').getBoundingClientRect().toJSON(),brand:document.querySelector('.brand').getBoundingClientRect().toJSON(),board:document.querySelector('.board-zone').getBoundingClientRect().toJSON(),scroll:document.querySelector('.board ol').scrollHeight,client:document.querySelector('.board ol').clientHeight})));await metrics(p,'CSS200 surrogate');}
if(engine==='chromium'&&width===390){await p.goto(origin+base+'site.html');await p.emulateMedia({reducedMotion:'reduce'});check('reduced motion',await p.locator('.side-panel').first().evaluate(e=>getComputedStyle(e).transitionDuration));}
}catch(e){check(tag+' execution error',e.message);}finally{await c.close();}}
}catch(e){report.launchError=e.message;}finally{if(browser)await browser.close();server.close();await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}
report.failures=report.checks.filter(c=>c.label.includes('execution error')||(/no overlap|focus inside|focus restored/.test(c.label)&&c.evidence!==true));if(report.launchError||report.failures.length)process.exitCode=1;
