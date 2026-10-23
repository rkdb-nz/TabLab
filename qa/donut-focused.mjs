import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const require=createRequire(import.meta.url),pw=require('playwright'),engine=process.env.QA_BROWSER||'chromium',root=resolve('public'),out=resolve('qa/donut-results',engine);
await mkdir(out,{recursive:true});
const report={engine,commit:process.env.GITHUB_SHA,captures:[],checks:[],errors:[],assets:[],console:[]};
const server=createServer(async(req,res)=>{try{let p=resolve(root,'.'+new URL(req.url,'http://local').pathname);if(p!==root&&!p.startsWith(root+'/'))throw Error();if((await stat(p)).isDirectory())p+='/index.html';res.writeHead(200,{'Content-Type':({'.html':'text/html','.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png'})[extname(p)]||'application/octet-stream'}).end(await readFile(p));}catch{res.writeHead(404).end('Not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
let browser;
async function capture(p,label){const file=label+'.png';await p.screenshot({path:resolve(out,file)});report.captures.push({file,viewport:await p.evaluate(()=>[innerWidth,innerHeight]),state:label,reviewed:false})}
async function geometry(f,label){report.checks.push({label,data:await f.evaluate(()=>({viewport:[innerWidth,innerHeight],overflow:document.documentElement.scrollWidth>innerWidth,active:document.activeElement.outerHTML,els:[...document.querySelectorAll('button,input,select,textarea,h1,h2,.overlay-panel,.form-status,.feature-copy p,.feature-copy h2')].filter(e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden').map(e=>{let r=e.getBoundingClientRect(),s=getComputedStyle(e);return{text:(e.innerText||e.name||'').slice(0,110),tag:e.tagName,rect:{x:r.x,y:r.y,right:r.right,bottom:r.bottom},font:s.fontSize,color:s.color,bg:s.backgroundColor,scroll:[e.clientWidth,e.scrollWidth,e.clientHeight,e.scrollHeight]}})}))})}
async function open(f,key){if(await f.locator('.nav').isVisible())await f.locator('.nav [data-overlay='+key+']').click();else if(key==='order')await f.locator('.mobile-order-button').click();else{await f.locator('#mobile-menu-toggle').click();await f.locator('#mobile-menu-panel [data-overlay='+key+']').click()}await f.locator('#overlay-'+key).waitFor({state:'visible'});await new Promise(r=>setTimeout(r,800))}
async function close(f,key){await f.locator('#overlay-'+key+' .overlay-close').click();await f.locator('#overlay-'+key).waitFor({state:'hidden'})}

try{
browser=await pw.chromium.launch({headless:true});
for(const [width,height] of [[320,568],[780,300]]){
const c=await browser.newContext({viewport:{width,height}}),p=await c.newPage();p.setDefaultTimeout(6500);await c.route('**/*',r=>r.request().url().startsWith(origin+'/')?r.continue():r.abort());await p.goto(origin+'/boardroom/billboard/demos/donut/');const f=p.frames().find(f=>f.url().includes('/site.html'));
for(const key of ['menu','story','locations','catering','order']){
await open(f,key);const panel=f.locator('#overlay-'+key+' .overlay-panel');
const result=await panel.evaluate(e=>{e.scrollTop=e.scrollHeight;const b=e.getBoundingClientRect(),close=e.querySelector('.overlay-close').getBoundingClientRect();return{scrollTop:e.scrollTop,max:e.scrollHeight-e.clientHeight,box:{top:b.top,bottom:b.bottom},close:{top:close.top,bottom:close.bottom},viewport:[innerWidth,innerHeight]}});report.checks.push({label:width+'-'+key+'-scroll-end',data:result});
if(key==='order')await capture(p,width+'-order-scroll-end');
await close(f,key);
report.checks.push({label:width+'-'+key+'-focus',active:await f.evaluate(()=>document.activeElement.tagName+' '+document.activeElement.getAttribute('id'))});
}
report.checks.push({label:width+'-resources',data:await f.evaluate(()=>performance.getEntriesByType('resource').map(e=>({name:e.name,bytes:e.transferSize,duration:e.duration})))});
await p.getByRole('button',{name:'Open menu',exact:true}).click();report.checks.push({label:width+'-wrapper',text:await p.locator('body').innerText()});await capture(p,width+'-wrapper');
await c.close();
}
const fs=await import('node:fs/promises'),os=await import('node:os'),path=await import('node:path'),temp=await fs.mkdtemp(path.join(os.tmpdir(),'donut-zoom-')),extension=path.join(temp,'extension');await fs.mkdir(extension);
await fs.writeFile(path.join(extension,'manifest.json'),JSON.stringify({manifest_version:3,name:'Local QA zoom',version:'1.0',permissions:['tabs'],background:{service_worker:'worker.js'}}));await fs.writeFile(path.join(extension,'worker.js'),'chrome.runtime.onInstalled.addListener(()=>{});');
let zcx;try{
zcx=await pw.chromium.launchPersistentContext(path.join(temp,'profile'),{channel:'chromium',headless:true,args:['--disable-extensions-except='+extension,'--load-extension='+extension],viewport:{width:1440,height:900}});
await zcx.route('**/*',r=>r.request().url().startsWith(origin+'/')?r.continue():r.abort());
const worker=zcx.serviceWorkers()[0]||await zcx.waitForEvent('serviceworker'),p=await zcx.newPage();await p.goto(origin+'/boardroom/billboard/demos/donut/');
const before=await p.evaluate(()=>[innerWidth,innerHeight,devicePixelRatio]);
const level=await worker.evaluate(async url=>{const t=(await chrome.tabs.query({})).find(t=>t.url===url);await chrome.tabs.setZoom(t.id,2);return chrome.tabs.getZoom(t.id)},origin+'/boardroom/billboard/demos/donut/');
await p.waitForTimeout(800);report.checks.push({label:'native-zoom',level,before,after:await p.evaluate(()=>[innerWidth,innerHeight,devicePixelRatio])});
const f=p.frames().find(f=>f.url().includes('/site.html'));await geometry(f,'native-200-home');await capture(p,'native-200-home');await open(f,'order');await geometry(f,'native-200-order');await capture(p,'native-200-order');
}catch(e){report.errors.push({probe:'zoom',error:e.stack})}finally{await zcx?.close();await fs.rm(temp,{recursive:true,force:true})}
}catch(e){report.errors.push(e.stack)}finally{await browser?.close();server.close();await writeFile(resolve(out,'focused-report.json'),JSON.stringify(report,null,2))}
