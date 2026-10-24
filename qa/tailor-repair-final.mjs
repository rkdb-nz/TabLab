import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const require=createRequire(import.meta.url),pw=require('playwright'),engine=process.env.QA_BROWSER||'chromium',root=resolve('public'),out=resolve('qa/tailor-final-results',engine);
await mkdir(out,{recursive:true});const report={engine,commit:process.env.GITHUB_SHA,checks:[],captures:[],errors:[],scans:[],failures:[]};
const server=createServer(async(req,res)=>{try{let p=resolve(root,'.'+new URL(req.url,'http://local').pathname);if(!p.startsWith(root+'/'))throw Error();if((await stat(p)).isDirectory())p+='/index.html';res.writeHead(200,{'Content-Type':({'.html':'text/html','.css':'text/css','.js':'application/javascript','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'})[extname(p)]||'application/octet-stream'}).end(await readFile(p));}catch{res.writeHead(404).end();}});await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port,base='/boardroom/skateboard/demos/tailor/';
const check=(label,pass,evidence)=>{report.checks.push({label,pass,evidence});if(!pass)report.failures.push(label);};
async function settle(f){await f.waitForFunction(()=>!isAnimating);await f.locator('body').evaluate(async()=>{await document.fonts.ready;await Promise.all(document.getAnimations().filter(a=>a.effect.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})));});await new Promise(r=>setTimeout(r,450));}
async function scan(f,label){await f.addScriptTag({path:require.resolve('axe-core/axe.min.js')});const v=await f.evaluate(async()=>{const r=await axe.run();return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({html:n.html,summary:n.failureSummary}))}));});report.scans.push({label,violations:v});
// The duplicated background chapter numeral is pure decoration. Preserve the raw
// warning, but do not treat its intentionally faint watermark as readable copy.
const actionable=v.filter(issue=>!(issue.id==='color-contrast'&&issue.nodes.every(n=>n.html.includes('class=\"floating-num display\"')&&n.html.includes('aria-hidden=\"true\"'))));
if(actionable.length!==v.length)report.reviewedExceptions=[{selector:'.floating-num[aria-hidden=\"true\"]',reason:'Purely decorative background numeral; chapter number is separately provided in readable UI and live status. Raw Axe warning retained.'}];
check(label+' actionable axe',actionable.length===0);}
async function cap(p,label){await p.screenshot({path:resolve(out,label+'.png'),animations:'disabled'});report.captures.push({file:label+'.png',viewport:await p.evaluate(()=>[innerWidth,innerHeight]),inspected:false});}
let browser;
try{browser=await pw.chromium.launch({channel:'chrome'});report.version=browser.version();const c=await browser.newContext({viewport:{width:1440,height:900}}),p=await c.newPage();await p.goto(origin+base);const f=p.frames().find(f=>f.url().includes('site.html'));await settle(f);await scan(f,'Arrival contrast completion');await cap(p,'arrival-final');
await f.locator('#topnav [data-goto="2"]').click();await settle(f);
for(let i=0;i<6;i++){
 await settle(f);const images=await f.locator('.lookbook-slide.active .book-page img').evaluateAll(async es=>{await Promise.all(es.map(i=>i.decode().catch(()=>{})));return es.map(i=>({src:i.getAttribute('src'),ok:i.complete&&i.naturalWidth>0}));});check('look '+i+' images decoded',images.every(i=>i.ok),images);
 if(i===3)await cap(p,'walnut-restored');await f.locator('#look-next').click();}
await c.close();
}catch(e){report.errors.push(e.stack);}finally{await browser?.close();server.close();await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}
console.log(JSON.stringify({failures:report.failures,errors:report.errors}));if(report.failures.length||report.errors.length)process.exitCode=1;
