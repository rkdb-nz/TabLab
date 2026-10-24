import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const require=createRequire(import.meta.url),pw=require('playwright'),engine=process.env.QA_BROWSER||'chromium',root=resolve('public'),out=resolve('qa/retreat-final-results',engine),base='/boardroom/springboard/demos/retreat/';
await mkdir(out,{recursive:true});
const report={engine,commit:process.env.GITHUB_SHA,checks:[],captures:[],errors:[],scans:[],assets:[],console:[],links:[],limits:[]};
const server=createServer(async(req,res)=>{try{let p=resolve(root,'.'+new URL(req.url,'http://local').pathname);if(!p.startsWith(root+'/'))throw Error();if((await stat(p)).isDirectory())p+='/index.html';res.writeHead(200,{'Content-Type':({'.html':'text/html','.css':'text/css','.js':'application/javascript','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'})[extname(p)]||'application/octet-stream'}).end(await readFile(p));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
const check=(label,evidence)=>{report.checks.push({label,evidence});};
async function settle(f){await f.locator('body').evaluate(async()=>{
 await Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,3000))]);
 const visible=[...document.images].filter(i=>{const r=i.getBoundingClientRect();return i.complete||(i.getClientRects().length&&r.top<innerHeight&&r.bottom>0);});
 await Promise.race([Promise.all(visible.map(i=>i.decode().catch(()=>{}))),new Promise(r=>setTimeout(r,3000))]);
 await Promise.race([Promise.all(document.getAnimations().filter(a=>a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{}))),new Promise(r=>setTimeout(r,3000))]);
});}
async function cap(p,f,label){await settle(f);await p.screenshot({path:resolve(out,label+'.png')});report.captures.push({file:label+'.png',outer:await p.evaluate(()=>[innerWidth,innerHeight]),frame:await f.evaluate(()=>[innerWidth,innerHeight]),inspected:false});await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}
async function measure(f,label){check(label,await f.evaluate(()=>({viewport:[innerWidth,innerHeight],scroll:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],controls:[...document.querySelectorAll('a,button,input,select,.faq-q')].filter(e=>e.getClientRects().length).map(e=>({text:e.textContent.trim().slice(0,45),tag:e.tagName,tab:e.tabIndex,rect:(()=>{let r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}})()}))})));}

let browser;
async function probe(label,fn){try{await fn();}catch(e){report.errors.push({label,error:e.stack});}}
async function layout(f,label){check(label,await f.evaluate(()=>({viewport:[innerWidth,innerHeight],document:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],main:[...document.querySelectorAll('main,.np-pane,.clem-center,.clem-right,.book-left,.book-right,#mobilePanel')].filter(e=>e.getClientRects().length).map(e=>({class:e.className,id:e.id,client:[e.clientWidth,e.clientHeight],scroll:[e.scrollWidth,e.scrollHeight],overflow:getComputedStyle(e).overflow,rect:(()=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,bottom:r.bottom};})()}))})));}
async function scan(f,label){await f.addScriptTag({path:require.resolve('axe-core/axe.min.js')});report.scans.push({label,violations:await f.evaluate(async()=>{const r=await axe.run();return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({html:n.html,summary:n.failureSummary}))}));})});}
async function go(f,file){await f.goto(origin+base+file);await settle(f);}
async function dims(f,label){check(label,await f.evaluate(()=>({viewport:[innerWidth,innerHeight],document:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],activeNav:[...document.querySelectorAll('.nav a.active,[aria-current]')].map(e=>e.textContent),focus:document.activeElement?.outerHTML,overflows:[...document.querySelectorAll('main,.wrap,.retreat-full,.retreat-copy,.book-grid,.d-text,.nav,.clementine-confirmation-card')].filter(e=>e.getClientRects().length).filter(e=>e.scrollWidth>e.clientWidth+2||e.getBoundingClientRect().right>innerWidth+2).map(e=>({class:e.className,client:[e.clientWidth,e.clientHeight],scroll:[e.scrollWidth,e.scrollHeight],rect:[e.getBoundingClientRect().x,e.getBoundingClientRect().y,e.getBoundingClientRect().width,e.getBoundingClientRect().height]}))})));}
report.failures=[];
const ensure=(label,value)=>{check(label,value);if(!value)report.failures.push(label);};
try{
 browser=await pw[engine].launch(engine==='chromium'?{channel:'chrome'}:{headless:true});
 for(const [width,height] of (engine==='chromium'?[[1440,900],[390,844],[844,390],[320,568],[780,300]]:[[1440,900],[390,844]])){
  const c=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'}),p=await c.newPage();p.setDefaultTimeout(10000);
  await p.goto(origin+base);const f=p.frames().find(f=>f.url().includes('site.html'));await settle(f);
  ensure(width+' Home current',(await f.locator('.nav a[aria-current=page]').textContent()).trim()==='Home');
  if(width<1001)await f.locator('.menu-btn').click();await f.locator('.nav a[href*=retreats]').click();await f.waitForURL('**/retreats.html*');ensure(width+' Retreats current',(await f.locator('.nav a[aria-current=page]').textContent()).trim()==='Retreats');
  if(engine==='chromium'&&width===1440){
   await scan(f,'Retreats final');
   for(const [id,side] of [['woodland','left'],['coastal','right'],['farm','left'],['town','right']]){
    await f.locator('#'+id).scrollIntoViewIfNeeded();await settle(f);ensure(id+' original image side',await f.locator('#'+id).evaluate((e,side)=>{const m=e.querySelector('.retreat-media').getBoundingClientRect(),t=e.querySelector('.retreat-copy').getBoundingClientRect();return side==='left'?m.x<t.x:m.x>t.x;},side));
    if(id==='woodland'||id==='town')await cap(p,f,id+'-layout-final');
   }
  }
  await c.close();
 }
}catch(e){report.errors.push(e.stack);}finally{await browser?.close();server.close();await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}
console.log(JSON.stringify({engine,failures:report.failures,errors:report.errors}));if(report.errors.length||report.failures.length)process.exitCode=1;
