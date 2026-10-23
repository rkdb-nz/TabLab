import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const require=createRequire(import.meta.url),pw=require('playwright'),engine=process.env.QA_BROWSER||'chromium',out=resolve('qa/florist-repair-results',engine),root=resolve('public');
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
const assert=(label,value)=>{check(label,value);if(value!==true)report.failures.push(label);};
report.failures=[];
async function stable(f){await settle(f);let last=-1;for(let i=0;i<30;i++){const y=await f.evaluate(()=>scrollY);if(Math.abs(y-last)<1)break;last=y;await new Promise(r=>setTimeout(r,100));}}
async function scan(f,label){await f.addScriptTag({path:require.resolve('axe-core/axe.min.js')});const v=await f.evaluate(async()=>{const r=await axe.run();return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({html:n.html,summary:n.failureSummary}))}));});report.scans.push({label,violations:v});assert(label+' accessibility',v.length===0);}
try{
browser=await pw[engine].launch(engine==='chromium'?{channel:'chrome'}:{});report.version=browser.version();
for(const [width,height] of (engine==='chromium'?[[1440,900],[390,844],[844,390],[320,568],[780,300]]:[[1440,900],[390,844]])){
 const tag=width+'x'+height,c=await browser.newContext({viewport:{width,height}}),p=await c.newPage();
 await c.route('**/*',r=>!['GET','HEAD'].includes(r.request().method())?r.abort():r.continue());
 p.on('pageerror',e=>report.errors.push(e.message));
 try{
 await p.goto(origin+base);const f=p.frames().find(f=>f.url().includes('site.html'));await stable(f);
 await cap(p,tag+'-home');await metrics(f,tag+' home');
 assert(tag+' navigation fits',await f.locator('#topnav a').evaluateAll(es=>es.every(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=document.querySelector('#topnav').getBoundingClientRect().bottom+1;})));
 await f.locator('.links [data-scroll="collections"]').click();await stable(f);
 assert(tag+' collection heading separated',await f.evaluate(()=>{const h=document.querySelector('.section-head h2').getBoundingClientRect(),s=document.querySelector('.section-head p').getBoundingClientRect();return s.left>=h.right-1||s.top>=h.bottom-1;}));
 if(engine==='chromium'&&width===320)await cap(p,'320-collections');
 await f.locator('.links [data-scroll="enquire"]').click();await stable(f);
 assert(tag+' labels connected',await f.locator('input,select,textarea').evaluateAll(es=>es.every(e=>e.labels.length===1)));
 if(engine==='chromium'&&[1440,320].includes(width)){
 await f.locator('button[type=submit]').click();
 assert(tag+' empty name focused',await f.locator('[name=name]').evaluate(e=>e===document.activeElement&&e.getAttribute('aria-invalid')==='true'));
 await f.locator('[name=name]').fill('   ');await f.locator('[name=email]').fill('invalid-email');await f.locator('button[type=submit]').click();
 assert(tag+' whitespace name rejected',await f.locator('[name=name]').getAttribute('aria-invalid')==='true');
 await f.locator('[name=name]').fill('Sitecheck');await f.locator('button[type=submit]').click();
 assert(tag+' invalid email rejected',f.url().includes('site.html')&&await f.locator('[name=email]').getAttribute('aria-invalid')==='true');
 assert(tag+' error focus',await f.locator('[name=email]').evaluate(e=>e===document.activeElement));
 await cap(p,tag+'-invalid');
 }
 if(engine==='chromium'&&width===1440){
 await f.locator('[data-demo-contact]').click();assert('demo email result',await f.locator('#contact-result').innerText()==='This is a demonstration. No email has been sent.');
 await scan(f,'enquiry');
 await f.locator('.logo').focus();await p.keyboard.press('Enter');await stable(f);
 assert('keyboard logo works',await f.locator('#hero').evaluate(e=>e.getBoundingClientRect().top>=-1));
 }
 if(engine==='chromium'&&width===390){
 await f.locator('[name=message]').fill('Rotation survives.');
 await p.setViewportSize({width:844,height:390});await stable(f);
 assert('rotation preserves form',await f.locator('[name=message]').inputValue()==='Rotation survives.');
 await p.setViewportSize({width,height});await stable(f);
 }
 await f.locator('[name=name]').fill('  Sitecheck Test  ');await f.locator('[name=email]').fill('sitecheck@example.com');await f.locator('[name=type]').selectOption('Wedding');
 await f.locator('button[type=submit]').click();await f.waitForURL('**/success.html');await stable(f);
 assert(tag+' final demo notice',await f.locator('.success-card').innerText().then(t=>t.includes('has not been sent')&&t.includes('demonstration')));
 assert(tag+' no persisted details',await f.evaluate(()=>localStorage.getItem('ash_oak_florist_enquiry')===null));
 assert(tag+' success content fits',await f.locator('.success-card').evaluate(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&e.scrollWidth<=e.clientWidth+1;}));
 if(engine==='chromium'&&[390,320,780].includes(width))await cap(p,tag+'-success');
 if(engine==='chromium'&&width===1440)await scan(f,'success');
 await f.getByRole('link',{name:'Back to Ash & Oak',exact:true}).click();await f.waitForURL('**/site.html');await stable(f);
 if(engine==='chromium'&&[1440,390].includes(width)){
 await p.getByRole('button',{name:'Open example in full screen',exact:true}).click();await stable(f);
 const r=await p.evaluate(()=>{const b=document.querySelector('.demo-fullscreen-return').getBoundingClientRect(),a=document.querySelector('iframe').getBoundingClientRect();return {outer:[innerWidth,innerHeight],frame:[a.width,a.height],noOverlap:b.bottom<=a.top};});
 check(tag+' fullscreen geometry',r);assert(tag+' return outside content',r.noOverlap);
 if(width===390)await cap(p,'390-fullscreen');
 await p.getByRole('button',{name:'Exit full screen and return to Tab Lab frame',exact:true}).click();await stable(f);
 assert(tag+' return restored',await p.locator('.demo-fullscreen-return').isHidden());
 await p.getByRole('button',{name:'Back to gallery',exact:true}).click();await p.waitForURL('**/skateboard/index.html');assert(tag+' gallery return',p.url().endsWith('/skateboard/index.html'));
 }
 if(engine==='chromium'&&width===390){
 await p.goto(origin+base+'site.html');await p.emulateMedia({reducedMotion:'reduce'});await stable(p);
 assert('reduced motion honoured',await p.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior==='auto'&&getComputedStyle(document.querySelector('.card-img img')).transitionDuration==='0s'));
 }
 }catch(e){report.failures.push(tag+' execution: '+e.message);}finally{await c.close();}
}
}catch(e){report.launchError=e.message;}finally{if(browser)await browser.close();server.close();await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}
if(report.launchError||report.failures.length||report.errors.length)process.exitCode=1;
