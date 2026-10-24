import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const require=createRequire(import.meta.url),pw=require('playwright'),engine=process.env.QA_BROWSER||'chromium',root=resolve('public'),out=resolve('qa/tailor-final-results',engine);
await mkdir(out,{recursive:true});const report={engine,commit:process.env.GITHUB_SHA,checks:[],captures:[],errors:[],scans:[],failures:[]};
const server=createServer(async(req,res)=>{try{let p=resolve(root,'.'+new URL(req.url,'http://local').pathname);if(!p.startsWith(root+'/'))throw Error();if((await stat(p)).isDirectory())p+='/index.html';res.writeHead(200,{'Content-Type':({'.html':'text/html','.css':'text/css','.js':'application/javascript','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'})[extname(p)]||'application/octet-stream'}).end(await readFile(p));}catch{res.writeHead(404).end();}});await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port,base='/boardroom/skateboard/demos/tailor/';
const check=(label,pass,evidence)=>{report.checks.push({label,pass,evidence});if(!pass)report.failures.push(label);};
async function settle(f){await f.waitForFunction(()=>!isAnimating);await f.locator('body').evaluate(async()=>{await document.fonts.ready;await Promise.all(document.getAnimations().filter(a=>a.effect.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})));});await new Promise(r=>setTimeout(r,450));}
async function scan(f,label){await f.addScriptTag({path:require.resolve('axe-core/axe.min.js')});const v=await f.evaluate(async()=>{const r=await axe.run();return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({html:n.html,summary:n.failureSummary}))}));});report.scans.push({label,violations:v});check(label+' axe',v.length===0);}
async function cap(p,label){await p.screenshot({path:resolve(out,label+'.png'),animations:'disabled'});report.captures.push({file:label+'.png',viewport:await p.evaluate(()=>[innerWidth,innerHeight]),inspected:false});}
let browser;
try{browser=await pw[engine].launch(engine==='chromium'?{channel:'chrome'}:{});report.version=browser.version();
for(const [width,height] of(engine==='chromium'?[[1440,900],[390,844],[844,390],[320,568],[780,300]]:[[1440,900],[390,844]])){
 const tag=width+'x'+height,c=await browser.newContext({viewport:{width,height}}),p=await c.newPage();p.setDefaultTimeout(12000);p.on('pageerror',e=>report.errors.push(e.message));
 try{await p.goto(origin+base);const f=p.frames().find(f=>f.url().includes('site.html'));await settle(f);check(tag+' visible Arrival heading',await f.locator('.ch1 h2').isVisible());check(tag+' page h1 present',await f.locator('main>h1').count()===1);
 if(engine==='chromium'){await cap(p,tag+'-home');if(width===1440)await scan(f,'Arrival');}
 await f.locator('#topnav [data-goto="2"]').click();await settle(f);check(tag+' navigation',await f.evaluate(()=>currentIndex===2));await f.locator('#look-next').click();await settle(f);check(tag+' collection control',await f.locator('#look-count').innerText()===(width<=900?'2 / 6':'02 / 06'));
 if(engine==='chromium'&&width===1440){await scan(f,'Collection');await cap(p,'collection-final');}
 if(engine==='chromium'&&width===780){await f.locator('.wordmark').click();await settle(f);await f.locator('.ch1 .type').evaluate(e=>e.scrollTop=e.scrollHeight);await cap(p,'short-landscape-action');}
 }catch(e){report.errors.push({tag,error:e.stack});}finally{await c.close();}}
}catch(e){report.launchError=e.message;}finally{await browser?.close();server.close();await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}
console.log(JSON.stringify({engine,failures:report.failures,errors:report.errors,launchError:report.launchError}));if(report.failures.length||report.errors.length||report.launchError)process.exitCode=1;
