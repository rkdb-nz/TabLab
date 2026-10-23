import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const require=createRequire(import.meta.url),pw=require('playwright'),engine=process.env.QA_BROWSER||'chromium',out=resolve('qa/pottery-focus-results',engine),root=resolve('public');
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
async function shotState(f,label){check(label,await f.evaluate(()=>({url:location.href,viewport:[innerWidth,innerHeight],scene:document.body.dataset.scene,focus:document.hasFocus(),items:[...document.querySelectorAll('.scene.active h1,.scene.active p,.scene.active button')].filter(e=>getComputedStyle(e).display!=='none').map(e=>({text:e.innerText,rect:e.getBoundingClientRect().toJSON()}))}))); }
try{
browser=await pw[engine].launch(engine==='chromium'?{channel:'chrome'}:{});
for(const [width,height] of (engine==='chromium'?[[390,844],[320,568],[780,300]]:engine==='webkit'?[[1440,900],[390,844]]:[[390,844]])){
const tag=width+'x'+height,c=await browser.newContext({viewport:{width,height}}),p=await c.newPage();
await c.route('**/*',r=>!['GET','HEAD'].includes(r.request().method())?r.abort():r.continue());
try{
 await p.goto(origin+base);await p.locator('iframe').waitFor();let f=p.frames().find(f=>/mobile.html|site.html/.test(f.url()));await f.waitForLoadState('load');await settle(f);
 if(width===1440){check('WebKit desktop route',f.url());await cap(p,'webkit-desktop-route');if(f.url().includes('site.html')){await f.locator('.nav-links a[href="#studio"]').click();check('desktop navigation','Studio clicked');}else{await f.locator('.brand').press('ArrowDown');await new Promise(r=>setTimeout(r,1800));await shotState(f,'WebKit desktop mobile-route keyboard');}continue;}
 for(let i=1;i<5;i++){
 await f.locator('.brand').press('ArrowDown');await new Promise(r=>setTimeout(r,1800));await shotState(f,tag+' focused keyboard '+i);
 if(await f.locator('body').getAttribute('data-scene')!==String(i)){check(tag+' keyboard mismatch','Loading scene via hash for isolated feature inspection.');await f.goto(origin+base+'mobile.html#'+['clay','maker','collection','making','visit'][i]);await settle(f);}
 if(engine==='chromium'&&(width===390||(width===780&&i>=3)))await cap(p,tag+'-scene-'+i);
 if(i===1&&width===390){await f.locator('[data-dialog="elinor"]').click({timeout:5000});await settle(f);check('maker dialog opens',await f.locator('#elinor').evaluate(e=>e.open));if(engine==='chromium')await cap(p,'maker-dialog');await f.locator('#elinor [data-close]').click();}
 if(i===2){for(let k=0;k<3;k++){await f.locator('#collection-next').click({timeout:5000});check(tag+' collection '+k,await f.locator('#collection-title').innerText());}if(engine==='chromium'&&width===390){await f.locator('[data-dialog="gallery"]').click();await settle(f);await cap(p,'gallery-dialog');await f.locator('#gallery').evaluate(e=>e.scrollTop=e.scrollHeight);check('gallery scroll',await f.locator('#gallery').evaluate(e=>({top:e.scrollTop,scroll:e.scrollHeight,client:e.clientHeight})));await f.locator('#gallery [data-close]').click();}}
 if(i===3)for(let k=0;k<7;k++){await f.locator('[data-step="'+k+'"]').click({timeout:5000});check(tag+' process '+k,await f.locator('#step-title').innerText());}
 }
 await f.locator('[data-dialog="workshops"]').click();await settle(f);check(tag+' workshop opened',true);
 if(engine==='chromium'&&width===390){await cap(p,'workshop-dialog');await p.setViewportSize({width:844,height:390});await settle(f);check('rotation workshop still open',await f.locator('#workshops').evaluate(e=>e.open));await p.setViewportSize({width,height});await settle(f);}
 await f.locator('#workshops').evaluate(e=>e.scrollTop=e.scrollHeight);check(tag+' workshop scroll',await f.locator('#workshops').evaluate(e=>({top:e.scrollTop,scroll:e.scrollHeight,client:e.clientHeight,last:e.querySelector('.sheet-body').lastElementChild.getBoundingClientRect().toJSON()})));await f.locator('#workshops [data-close]').click();
 if(engine==='chromium'&&width===390){
 for(const id of ['contact','visit-details']){await f.locator('[data-dialog="'+id+'"]').click();await settle(f);await cap(p,id+'-dialog');await f.locator('#'+id+' [data-close]').click();}
 await f.addScriptTag({path:require.resolve('axe-core/axe.min.js')});report.scans.push(await f.evaluate(async()=>{const r=await axe.run();return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({html:n.html,summary:n.failureSummary}))}));}));
 await f.locator('.brand').click();await p.emulateMedia({reducedMotion:'reduce'});await f.locator('.brand').press('ArrowDown');check('reduced scene transition',await f.locator('.scene-track').evaluate(e=>getComputedStyle(e).transitionDuration));
 await p.getByRole('button',{name:'Open example in full screen',exact:true}).click();await settle(f);await cap(p,'phone-fullscreen');check('fullscreen viewport',await f.evaluate(()=>[innerWidth,innerHeight]));await p.getByRole('button',{name:'Exit full screen and return to Tab Lab frame',exact:true}).click();await settle(f);check('return viewport',await f.evaluate(()=>[innerWidth,innerHeight]));await p.getByRole('button',{name:'Back to gallery',exact:true}).click();await p.waitForURL('**/skateboard/index.html');check('gallery return',p.url());
 }
}catch(e){check(tag+' error',e.message);}finally{await c.close();}
}
}catch(e){report.launchError=e.message;}finally{if(browser)await browser.close();server.close();await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}
