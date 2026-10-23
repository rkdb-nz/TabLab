import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const require=createRequire(import.meta.url),pw=require('playwright'),engine=process.env.QA_BROWSER||'chromium',out=resolve('qa/florist-results',engine),root=resolve('public');
await mkdir(out,{recursive:true});
const report={engine,commit:process.env.GITHUB_SHA,checks:[],captures:[],errors:[],assets:[],scans:[],limitations:['Linux emulation; not physical phones or Safari.']};
const server=createServer(async(req,res)=>{try{let p=resolve(root,'.'+new URL(req.url,'http://local').pathname);if(!p.startsWith(root+'/'))throw Error();if((await stat(p)).isDirectory())p+='/index.html';res.writeHead(200,{'Content-Type':({'.html':'text/html','.css':'text/css','.js':'application/javascript','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp'})[extname(p)]||'application/octet-stream'}).end(await readFile(p));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port,base='/boardroom/skateboard/demos/florist/';
const check=(label,evidence)=>report.checks.push({label,evidence});
async function settle(f){await f.locator('body').evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});await new Promise(r=>setTimeout(r,650));}
async function cap(p,label){await p.screenshot({path:resolve(out,label+'.png')});report.captures.push({file:label+'.png',viewport:await p.evaluate(()=>[innerWidth,innerHeight]),state:label,inspected:false});}
async function metrics(f,label){check(label,await f.evaluate(()=>({viewport:[innerWidth,innerHeight],document:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],active:document.activeElement?.outerHTML,visible:[...document.querySelectorAll('h1,h2,p,a,button,li,.contact-card')].filter(e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden').map(e=>{const r=e.getBoundingClientRect();return {text:(e.innerText||e.getAttribute('aria-label')||'').slice(0,100),rect:[r.x,r.y,r.width,r.height]};})}))); }

let browser;
try{browser=await pw[engine].launch();report.version=browser.version();
for(const [width,height] of (engine==='chromium'?[[1440,900],[390,844],[844,390],[320,568],[780,300]]:[[1440,900],[390,844]])){
 const tag=width+'x'+height,c=await browser.newContext({viewport:{width,height}}),p=await c.newPage();
 await c.route('**/*',r=>!['GET','HEAD'].includes(r.request().method())?r.abort():r.continue());
 p.on('pageerror',e=>report.errors.push(e.message));p.on('response',r=>{if(r.status()>=400)report.assets.push({url:r.url(),status:r.status()});});
 try{
 await p.goto(origin+base);await p.locator('iframe').waitFor();let f=p.frames().find(f=>f.url().includes('site.html'));await settle(f);
 await cap(p,tag+'-home');await metrics(f,tag+' home');
 check(tag+' link inventory',await f.locator('a').evaluateAll(es=>es.map(e=>({text:e.innerText,href:e.href}))));
 await f.locator('.links [data-scroll="collections"]').click();await settle(f);check(tag+' collections interaction',await f.locator('#collections').evaluate(e=>e.getBoundingClientRect().top));
 if(engine==='chromium'){await cap(p,tag+'-collections');await metrics(f,tag+' collections');}
 if(engine==='chromium'&&width===390){await f.locator('#reveal-gap').scrollIntoViewIfNeeded();await settle(f);await cap(p,'390-reveal');await f.locator('.grid').nth(1).scrollIntoViewIfNeeded();await settle(f);await cap(p,'390-lower-collection');}
 await f.locator('.links [data-scroll="enquire"]').click();await settle(f);await metrics(f,tag+' enquire');await cap(p,tag+'-enquire');
 check(tag+' form field metadata',await f.locator('input,select,textarea').evaluateAll(es=>es.map(e=>({name:e.name,labels:e.labels.length,required:e.required,type:e.type}))));
 // Empty and malformed submissions use reserved test details; no network delivery exists.
 if(engine==='chromium'&&width===1440){p.once('dialog',async d=>{check('empty form alert',d.message());await d.dismiss();});await f.locator('button[type=submit]').click();}
 await f.locator('[name=name]').fill('Sitecheck Test');await f.locator('[name=email]').fill('invalid-email');
 check(tag+' invalid email validity',await f.locator('[name=email]').evaluate(e=>e.validity.typeMismatch));
 if(engine==='chromium'&&width===1440){await f.locator('button[type=submit]').click();await f.waitForURL('**/success.html');await settle(f);check('invalid email accepted',await f.locator('h1').innerText());check('persistent enquiry storage',await f.evaluate(()=>localStorage.getItem('ash_oak_florist_enquiry')));await cap(p,'desktop-invalid-success');await f.getByRole('link',{name:'Back to Ash & Oak',exact:true}).click();await settle(f);await f.locator('.links [data-scroll="enquire"]').click();await settle(f);}
 await f.locator('[name=name]').fill('Sitecheck Test');await f.locator('[name=email]').fill('sitecheck@example.com');await f.locator('[name=phone]').fill('');await f.locator('[name=type]').selectOption('Wedding');await f.locator('[name=message]').fill('QA demo enquiry. No delivery requested.');
 if(engine==='chromium'&&width===390){await p.setViewportSize({width:844,height:390});await settle(f);await cap(p,'rotation-enquire');await metrics(f,'rotation enquire');await p.setViewportSize({width,height});await settle(f);}
 await f.locator('button[type=submit]').click();await f.waitForURL('**/success.html');await settle(f);await metrics(f,tag+' success');await cap(p,tag+'-success');
 if(engine==='chromium'&&width===1440){await f.addScriptTag({path:require.resolve('axe-core/axe.min.js')});report.scans.push({page:'success',result:await f.evaluate(async()=>{const r=await axe.run();return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({html:n.html,summary:n.failureSummary}))}));})});}
 await f.getByRole('link',{name:'Back to Ash & Oak',exact:true}).click();await settle(f);
 if(engine==='chromium'&&[1440,390].includes(width)){await p.getByRole('button',{name:'Open example in full screen',exact:true}).click();await settle(f);check(tag+' fullscreen',await f.evaluate(()=>[innerWidth,innerHeight]));await cap(p,tag+'-fullscreen');await p.getByRole('button',{name:'Exit full screen and return to Tab Lab frame',exact:true}).click();await settle(f);check(tag+' return',await f.evaluate(()=>[innerWidth,innerHeight]));await p.getByRole('button',{name:'Back to gallery',exact:true}).click();await p.waitForURL('**/skateboard/index.html');check(tag+' gallery',p.url());}
 if(engine==='chromium'&&width===1440){await p.goto(origin+base+'site.html');await settle(p);await p.addScriptTag({path:require.resolve('axe-core/axe.min.js')});report.scans.push({page:'site',result:await p.evaluate(async()=>{const r=await axe.run();return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({html:n.html,summary:n.failureSummary}))}));})});
 await p.keyboard.press('Control++');check('native zoom attempt',await p.evaluate(()=>({width:innerWidth,dpr:devicePixelRatio})));await p.evaluate(()=>document.documentElement.style.zoom='2');await settle(p);await cap(p,'desktop-css200');await metrics(p,'CSS200 surrogate');
 }
 if(engine==='chromium'&&width===390){await p.goto(origin+base+'site.html');await p.emulateMedia({reducedMotion:'reduce'});check('reduced-motion behaviour',await p.evaluate(()=>({scroll:getComputedStyle(document.documentElement).scrollBehavior,transition:getComputedStyle(document.querySelector('.card-img img')).transitionDuration})));await p.keyboard.press('Tab');check('keyboard first focus',await p.evaluate(()=>document.activeElement.outerHTML));}
 }catch(e){check(tag+' execution error',e.message);}finally{await c.close();}
}
}catch(e){report.launchError=e.message;}finally{if(browser)await browser.close();server.close();await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}
