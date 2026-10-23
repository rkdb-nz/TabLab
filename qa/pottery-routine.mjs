import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const require=createRequire(import.meta.url),pw=require('playwright'),engine=process.env.QA_BROWSER||'chromium',out=resolve('qa/pottery-settled-results',engine),root=resolve('public');
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
const measure=async(f,label)=>check(label,await f.evaluate(()=>({scene:document.body.dataset.scene,viewport:[innerWidth,innerHeight],journeyScroll:document.querySelector('.journey').scrollTop,track:getComputedStyle(document.querySelector('.scene-track')).transform,active:document.querySelector('.scene.active').getBoundingClientRect().toJSON()})));
try{browser=await pw.chromium.launch({channel:'chrome'});const c=await browser.newContext({viewport:{width:390,height:844}}),p=await c.newPage();await p.goto(origin+base);await p.locator('iframe').waitFor();const f=p.frames().find(f=>/mobile.html/.test(f.url()));await settle(f);
await f.locator('.brand').press('ArrowDown');await new Promise(r=>setTimeout(r,1900));await measure(f,'keyboard settled');
await p.getByRole('button',{name:'Open example in full screen',exact:true}).click();await new Promise(r=>setTimeout(r,2100));await measure(f,'fullscreen settled');await cap(p,'fullscreen-settled');
await p.getByRole('button',{name:'Exit full screen and return to Tab Lab frame',exact:true}).click();await new Promise(r=>setTimeout(r,2100));await measure(f,'return settled');await cap(p,'return-settled');
await p.getByRole('button',{name:'Back to gallery',exact:true}).click();await p.waitForURL('**/skateboard/index.html');check('gallery return',p.url());
await c.close();}catch(e){report.error=e.message;}finally{if(browser)await browser.close();server.close();await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}
