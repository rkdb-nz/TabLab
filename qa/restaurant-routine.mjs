import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const require=createRequire(import.meta.url),pw=require('playwright'),engine=process.env.QA_BROWSER||'chromium',root=resolve('public'),out=resolve('qa/restaurant-results',engine),base='/boardroom/springboard/demos/dining/';
await mkdir(out,{recursive:true});
const report={engine,commit:process.env.GITHUB_SHA,checks:[],captures:[],errors:[],scans:[],assets:[],console:[],links:[],limits:[]};
const server=createServer(async(req,res)=>{try{let p=resolve(root,'.'+new URL(req.url,'http://local').pathname);if(!p.startsWith(root+'/'))throw Error();if((await stat(p)).isDirectory())p+='/index.html';res.writeHead(200,{'Content-Type':({'.html':'text/html','.css':'text/css','.js':'application/javascript','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'})[extname(p)]||'application/octet-stream'}).end(await readFile(p));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
const check=(label,evidence)=>report.checks.push({label,evidence});
async function settle(f){await f.locator('body').evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));await Promise.all(document.getAnimations().filter(a=>a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})));});}
async function cap(p,f,label){await settle(f);await p.screenshot({path:resolve(out,label+'.png')});report.captures.push({file:label+'.png',outer:await p.evaluate(()=>[innerWidth,innerHeight]),frame:await f.evaluate(()=>[innerWidth,innerHeight]),inspected:false});}
async function measure(f,label){check(label,await f.evaluate(()=>({viewport:[innerWidth,innerHeight],scroll:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],controls:[...document.querySelectorAll('a,button,input,select,.faq-q')].filter(e=>e.getClientRects().length).map(e=>({text:e.textContent.trim().slice(0,45),tag:e.tagName,tab:e.tabIndex,rect:(()=>{let r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}})()}))})));}
let browser;
try{
browser=await pw[engine].launch(engine==='chromium'?{channel:'chrome'}:{headless:true});report.version=browser.version();
const sizes=engine==='chromium'?[[1440,900],[390,844],[844,390],[320,568],[780,300]]:[[1440,900],[390,844]];
for(const [width,height] of sizes){
 const tag=width+'x'+height,c=await browser.newContext({viewport:{width,height}}),p=await c.newPage();
 await c.route('**/*',r=>['GET','HEAD'].includes(r.request().method())?r.continue():r.abort());
 p.on('pageerror',e=>report.errors.push(e.message));p.on('response',r=>{if(r.status()>=400)report.assets.push({url:r.url(),status:r.status()});});
 try{
 await p.goto(origin+base);let f=p.frames().find(f=>f.url().includes('site.html'));await cap(p,f,tag+'-home');
 await f.locator('body').press('PageDown');await p.waitForTimeout(1800);
 await f.locator('[data-panel=dine]').click({timeout:6000});await f.waitForURL('**/dine.html*');await settle(f);check(tag+' navigation',f.url());await measure(f,tag+' dine');
 if(width===1440||width===390||width===320||height===300)await cap(p,f,tag+'-dine');
 if(width===390){await f.getByRole('button',{name:'Open restaurant menu',exact:true}).click();await cap(p,f,tag+'-menu');await p.setViewportSize({width:844,height:390});await p.waitForTimeout(500);await cap(p,f,tag+'-rotated-menu');await p.setViewportSize({width,height});}
 await f.goto(origin+base+'sign.html');await settle(f);
 if(width===1440||width===390)await cap(p,f,tag+'-booking');
 await measure(f,tag+' sign');
 if(engine==='chromium'&&width===1440){
 await f.locator('.booking-form button[type=submit]').click();check('empty form invalid',await f.locator('.booking-form').evaluate(e=>!e.checkValidity()));
 await f.locator('.booking-form input').first().fill('QA Example');await f.locator('.booking-form button[type=submit]').click();await cap(p,f,'booking-confirmation');
 check('booking result',await f.locator('#booking-confirmation').evaluate(e=>({visible:getComputedStyle(e).display,text:e.innerText,focus:document.activeElement.outerHTML})));
 await f.locator('.booking-confirmation-close').click();
 await f.locator('.time-wheel').focus();let before=await f.locator('.time-wheel').inputValue();await f.locator('.time-wheel').press('ArrowDown');check('time keyboard',{before,after:await f.locator('.time-wheel').inputValue()});
 await f.locator('.faq-q').first().click();check('FAQ response',await f.locator('.faq-q').first().evaluate(e=>({tab:e.tabIndex,answer:getComputedStyle(e.nextElementSibling).display})));
 for(const page of ['site.html','dine.html','wine.html','sign.html','reviews.html']){
 await f.goto(origin+base+page);await settle(f);
 report.links.push({page,links:await f.locator('a').evaluateAll(es=>es.map(e=>({text:e.textContent,href:e.getAttribute('href')})))});
 await f.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
 report.scans.push({page,violations:await f.evaluate(async()=>{const r=await axe.run();return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({html:n.html,summary:n.failureSummary}))}));})});
 if(page==='wine.html'||page==='reviews.html'){await cap(p,f,page.replace('.html','')+'-desktop');await measure(f,page);}
 }
 await f.emulateMedia?.({reducedMotion:'reduce'});
 }
 if(engine==='chromium'&&width===390){
 for(const page of ['wine.html','reviews.html']){await f.goto(origin+base+page);await cap(p,f,page.replace('.html','')+'-phone');await measure(f,page+' phone');}
 }
 if(engine==='chromium'&&(width===1440||width===390)){
 await p.getByRole('button',{name:'Open example in full screen',exact:true}).click();await p.waitForTimeout(700);
 await cap(p,f,tag+'-fullscreen');check(tag+' fullscreen',await p.getByRole('button',{name:'Exit full screen and return to Tab Lab frame'}).isVisible());
 await p.getByRole('button',{name:'Exit full screen and return to Tab Lab frame'}).click();await p.waitForTimeout(500);check(tag+' return',await p.getByRole('button',{name:'Open example in full screen',exact:true}).isVisible());
 }
 }catch(e){report.errors.push({tag,error:e.stack});}finally{await c.close();}
}
}catch(e){report.errors.push(e.stack);}finally{await browser?.close();server.close();await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}
console.log(JSON.stringify({engine,captures:report.captures.length,errors:report.errors}));
