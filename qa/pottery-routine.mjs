import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const require=createRequire(import.meta.url),pw=require('playwright'),engine=process.env.QA_BROWSER||'chromium',out=resolve('qa/pottery-results',engine),root=resolve('public');
await mkdir(out,{recursive:true});
const report={engine,commit:process.env.GITHUB_SHA,checks:[],captures:[],errors:[],assets:[],scans:[],limitations:['Linux emulation; not physical phones or Safari.']};
const server=createServer(async(req,res)=>{try{let p=resolve(root,'.'+new URL(req.url,'http://local').pathname);if(!p.startsWith(root+'/'))throw Error();if((await stat(p)).isDirectory())p+='/index.html';res.writeHead(200,{'Content-Type':({'.html':'text/html','.css':'text/css','.js':'application/javascript','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp'})[extname(p)]||'application/octet-stream'}).end(await readFile(p));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port,base='/boardroom/skateboard/demos/pottery/';
const check=(label,evidence)=>report.checks.push({label,evidence});
async function settle(f){await f.locator('body').evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});await new Promise(r=>setTimeout(r,650));}
async function cap(p,label){await p.screenshot({path:resolve(out,label+'.png')});report.captures.push({file:label+'.png',viewport:await p.evaluate(()=>[innerWidth,innerHeight]),state:label,inspected:false});}
async function metrics(f,label){check(label,await f.evaluate(()=>({viewport:[innerWidth,innerHeight],document:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],active:document.activeElement?.outerHTML,visible:[...document.querySelectorAll('h1,h2,p,a,button,li,.contact-card')].filter(e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden').map(e=>{const r=e.getBoundingClientRect();return {text:(e.innerText||e.getAttribute('aria-label')||'').slice(0,100),rect:[r.x,r.y,r.width,r.height]};})}))); }



let browser;
async function state(f,label){check(label,await f.evaluate(()=>({viewport:[innerWidth,innerHeight],url:location.href,scene:document.body.dataset.scene,scroll:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],active:document.activeElement?.outerHTML,items:[...document.querySelectorAll('.scene.active h1,.scene.active p,.scene.active button,.scene.active a,dialog[open] h2,dialog[open] button')].filter(e=>getComputedStyle(e).display!=='none').map(e=>({text:e.innerText,rect:e.getBoundingClientRect().toJSON()}))}))); }
async function scan(f,label){await f.addScriptTag({path:require.resolve('axe-core/axe.min.js')});report.scans.push({label,result:await f.evaluate(async()=>{const r=await axe.run();return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({html:n.html,summary:n.failureSummary}))}));})});}
try{
browser=await pw[engine].launch(engine==='chromium'?{channel:'chrome'}:{});report.version=browser.version();
for(const [width,height] of (engine==='chromium'?[[1440,900],[390,844],[844,390],[320,568],[780,300]]:[[1440,900],[390,844]])){
 const tag=width+'x'+height,c=await browser.newContext({viewport:{width,height}}),p=await c.newPage();
 await c.route('**/*',r=>!['GET','HEAD'].includes(r.request().method())||r.request().url().startsWith('mailto:')?r.abort():r.continue());
 p.on('pageerror',e=>report.errors.push(e.message));p.on('response',r=>{if(r.status()>=400)report.assets.push({url:r.url(),status:r.status()});});
 try{
 await p.goto(origin+base);await p.locator('iframe').waitFor();let f=p.frames().find(f=>/\/(site|mobile)\.html/.test(f.url()));await f.waitForLoadState('load');await settle(f);
 await state(f,tag+' landing');await cap(p,tag+'-home');
 check(tag+' links',await f.locator('a').evaluateAll(es=>es.map(e=>({text:e.innerText,href:e.href}))));
 if(width===1440){
 await f.locator('.nav-links a[href="#studio"]').click();await new Promise(r=>setTimeout(r,1800));check(tag+' studio nav',await f.locator('#studio').evaluate(e=>e.getBoundingClientRect().top));
 if(engine==='chromium'){
 for(const selector of ['#welcome','.philosophy','#studio','.artist','#process','#collections','#workshops','#gallery','#visit','#contact','.footer']){
 await f.locator(selector).scrollIntoViewIfNeeded();await new Promise(r=>setTimeout(r,1500));check('desktop section '+selector,await f.locator(selector).innerText());
 if(['#process','#gallery','#contact'].includes(selector))await cap(p,'desktop-'+selector.slice(1));
 }
 const form=f.locator('form');await form.locator('button').click();check('desktop missing required',await form.locator('input').first().evaluate(e=>e.validity.valueMissing));
 await form.locator('input').first().fill('Sitecheck');await form.locator('input[type=email]').fill('invalid');check('desktop invalid email',await form.locator('input[type=email]').evaluate(e=>e.validity.typeMismatch));
 await form.locator('input[type=email]').fill('sitecheck@example.com');await form.locator('textarea').fill('QA demonstration. Do not send.');await form.locator('button').click();check('desktop confirmation',await f.locator('#formSuccess').innerText());await cap(p,'desktop-confirmation');await scan(f,'desktop');
 check('desktop normal load',await f.evaluate(()=>({resources:performance.getEntriesByType('resource').map(r=>({url:r.name,bytes:r.transferSize,duration:r.duration})),images:[...document.images].map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0}))})));
 }
 }else{
 for(let i=1;i<5;i++){
 await f.locator('body').press('ArrowDown');await new Promise(r=>setTimeout(r,1700));await state(f,tag+' scene '+i);
 if(engine==='chromium')await cap(p,tag+'-scene-'+i);
 if(i===1&&width===390){await f.locator('[data-dialog="elinor"]').click();await settle(f);check(engine+' maker dialog',await f.locator('#elinor').evaluate(e=>({open:e.open,scroll:e.scrollHeight,client:e.clientHeight,focus:document.activeElement.outerHTML})));if(engine==='chromium')await cap(p,'maker-dialog');await f.locator('#elinor [data-close]').click();}
 if(i===2){
 await f.locator('#collection-next').click();check(tag+' next collection',await f.locator('#collection-title').innerText());await f.locator('#collection-prev').click();
 if(engine==='chromium'&&width===390){await f.locator('[data-dialog="gallery"]').click();await settle(f);await cap(p,'gallery-dialog');await f.locator('#gallery .sheet-body').evaluate(e=>e.scrollTop=e.scrollHeight);check('gallery bottom',await f.locator('#gallery .sheet-body').evaluate(e=>({top:e.scrollTop,scroll:e.scrollHeight,client:e.clientHeight})));await f.locator('#gallery [data-close]').click();}
 }
 if(i===3){for(let step=0;step<7;step++){await f.locator('[data-step="'+step+'"]').click();check(tag+' stage '+step,await f.locator('#step-title').innerText());}}
 }
 await f.locator('[data-dialog="workshops"]').click();await settle(f);check(tag+' workshop open',await f.locator('#workshops').evaluate(e=>e.open));
 if(engine==='chromium'&&width===390){await cap(p,'workshop-dialog');await p.setViewportSize({width:844,height:390});await settle(f);await state(f,'workshop rotation');await p.setViewportSize({width,height});await settle(f);}
 await f.locator('#workshops .sheet-body').evaluate(e=>e.scrollTop=e.scrollHeight);check(tag+' workshop bottom',await f.locator('#workshops .sheet-body').evaluate(e=>({top:e.scrollTop,scroll:e.scrollHeight,client:e.clientHeight,last:e.lastElementChild.getBoundingClientRect().toJSON()})));
 await f.locator('#workshops [data-close]').click();
 if(engine==='chromium'&&width===390){for(const id of ['contact','visit-details']){await f.locator('[data-dialog="'+id+'"]').click();await settle(f);await cap(p,id+'-dialog');await f.locator('#'+id+' [data-close]').click();}await scan(f,'mobile');await f.locator('.brand').click();await new Promise(r=>setTimeout(r,1700));await p.emulateMedia({reducedMotion:'reduce'});await f.locator('body').press('ArrowDown');check('reduced scene transition',await f.locator('.scene-track').evaluate(e=>getComputedStyle(e).transitionDuration));}
 }
 if(engine==='chromium'&&[1440,390].includes(width)){await p.getByRole('button',{name:'Open example in full screen',exact:true}).click();await settle(f);await state(f,tag+' fullscreen');await cap(p,tag+'-fullscreen');await p.getByRole('button',{name:'Exit full screen and return to Tab Lab frame',exact:true}).click();await settle(f);await state(f,tag+' return');await p.getByRole('button',{name:'Back to gallery',exact:true}).click();await p.waitForURL('**/skateboard/index.html');check(tag+' gallery',p.url());}
 if(engine==='chromium'&&width===1440){await p.goto(origin+base+'site.html');await settle(p);await p.keyboard.press('Control++');check('native zoom attempt',await p.evaluate(()=>({width:innerWidth,dpr:devicePixelRatio})));await p.evaluate(()=>document.documentElement.style.zoom='2');await settle(p);await cap(p,'css200-surrogate');}
 }catch(e){check(tag+' execution error',e.message);}finally{await c.close();}
}
}catch(e){report.launchError=e.message;}finally{if(browser)await browser.close();server.close();await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}
