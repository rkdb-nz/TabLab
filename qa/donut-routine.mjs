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
browser=await pw[engine].launch({headless:true});report.version=browser.version();
for(const [width,height] of engine==='chromium'?[[1440,900],[390,844],[844,390],[320,568],[780,300]]:[[1440,900],[390,844]]){
const c=await browser.newContext({viewport:{width,height}});await c.route('**/*',r=>r.request().url().startsWith(origin+'/')&&['GET','HEAD'].includes(r.request().method())?r.continue():r.abort());
const p=await c.newPage();p.setDefaultTimeout(6500);p.on('pageerror',e=>report.errors.push(e.message));p.on('console',m=>{if(m.type()==='error')report.console.push(m.text())});p.on('response',r=>{if(r.status()>=400)report.assets.push({url:r.url(),status:r.status()})});
try{
await p.goto(origin+'/boardroom/billboard/demos/donut/');const f=p.frames().find(f=>f.url().includes('/site.html'));await f.locator('.hero img').evaluate(i=>i.decode());await capture(p,width+'-landing');await geometry(f,width+'-landing');
if(width===1440){await f.addScriptTag({path:require.resolve('axe-core/axe.min.js')});report.checks.push({label:'axe-landing',data:await f.evaluate(async()=>{const r=await axe.run();return r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({html:n.html,summary:n.failureSummary}))}))})});report.checks.push({label:'links',data:await p.locator('a').evaluateAll(es=>es.map(e=>({text:e.textContent,href:e.href})))});}
for(const key of (engine==='chromium'&&width===1440?['menu','story','locations','catering','order']:['menu','order'])){
await open(f,key);await geometry(f,width+'-'+key);
if((engine==='chromium'&&(width===1440||width===320||width===780))||key==='order'&&width===390)await capture(p,width+'-'+key);
if(key==='menu'&&engine==='chromium'&&width===390){await p.setViewportSize({width:844,height:390});await capture(p,'rotated-menu');await geometry(f,'rotated-menu');await p.setViewportSize({width,height})}
if(key==='order'){
await f.locator('button[type=submit]').click();report.checks.push({label:width+'-empty',valid:await f.locator('form').evaluate(e=>e.checkValidity())});
await f.locator('[name=name]').fill('Routine Demo');await f.locator('[name=email]').fill('invalid');await f.locator('[name=phone]').fill('000000000');await f.locator('button[type=submit]').click();report.checks.push({label:width+'-invalid',valid:await f.locator('form').evaluate(e=>e.checkValidity())});
await f.locator('[name=email]').fill('qa@example.invalid');await f.locator('[name=box]').selectOption({label:'Twelve donuts'});await f.locator('[name=notes]').fill('Demo check; no contact requested.');await f.locator('button[type=submit]').click();report.checks.push({label:width+'-confirmation',text:await f.locator('.form-status').innerText()});
if(width===1440&&engine==='chromium'){await capture(p,'confirmation');report.checks.push({label:'axe-order',data:await f.evaluate(async()=>{const r=await axe.run();return r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({html:n.html,summary:n.failureSummary}))}))})});await f.locator('.overlay--order .overlay-close').press('Shift+Tab');report.checks.push({label:'trap',active:await f.evaluate(()=>document.activeElement.outerHTML)})}
}
await close(f,key);report.checks.push({label:width+'-'+key+'-focus-return',active:await f.evaluate(()=>document.activeElement.outerHTML)});
}
if(engine==='chromium'&&[1440,390].includes(width)){
const button=p.getByRole('button',{name:'Open example in full screen',exact:true});await button.click();await p.waitForTimeout(800);report.checks.push({label:width+'-fullscreen',native:await p.evaluate(()=>!!document.fullscreenElement),frame:await f.evaluate(()=>[innerWidth,innerHeight])});await capture(p,width+'-fullscreen');await p.getByRole('button',{name:'Exit full screen and return to Tab Lab frame',exact:true}).click();await p.waitForTimeout(800);report.checks.push({label:width+'-return',native:await p.evaluate(()=>!!document.fullscreenElement),frame:await f.evaluate(()=>[innerWidth,innerHeight]),button:await button.isVisible()});
}
if(engine==='chromium'&&width===1440){
await open(f,'story');await f.locator('#overlay-story .overlay-close').press('Escape');await f.locator('#overlay-story').waitFor({state:'hidden'});report.checks.push({label:'escape',pass:true});
await c.grantPermissions([]);await p.emulateMedia({reducedMotion:'reduce'});report.checks.push({label:'reduced-motion',data:await f.locator('.overlay-panel').first().evaluate(e=>({transition:getComputedStyle(e).transitionDuration,animation:getComputedStyle(e).animationDuration}))});
}
}catch(e){report.errors.push({viewport:[width,height],error:e.stack})}await c.close();
}
}catch(e){report.errors.push(e.stack)}finally{if(browser)await browser.close();server.close();await writeFile(resolve(out,'routine-report.json'),JSON.stringify(report,null,2))}
