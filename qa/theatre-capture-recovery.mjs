import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const require=createRequire(import.meta.url),pw=require('playwright'),engine=process.env.QA_BROWSER||'chromium',root=resolve('public'),out=resolve('qa/theatre-results',engine),base='/boardroom/springboard/demos/theatre/';
await mkdir(out,{recursive:true});
const report={engine,commit:process.env.GITHUB_SHA,checks:[],captures:[],errors:[],scans:[],assets:[],console:[],links:[],limits:[]};
const server=createServer(async(req,res)=>{try{let p=resolve(root,'.'+new URL(req.url,'http://local').pathname);if(!p.startsWith(root+'/'))throw Error();if((await stat(p)).isDirectory())p+='/index.html';res.writeHead(200,{'Content-Type':({'.html':'text/html','.css':'text/css','.js':'application/javascript','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'})[extname(p)]||'application/octet-stream'}).end(await readFile(p));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
const check=(label,evidence)=>report.checks.push({label,evidence});
async function settle(f){await f.locator('body').evaluate(async()=>{
 await Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,3000))]);
 const visible=[...document.images].filter(i=>{const r=i.getBoundingClientRect();return i.complete||(i.getClientRects().length&&r.top<innerHeight&&r.bottom>0);});
 await Promise.race([Promise.all(visible.map(i=>i.decode().catch(()=>{}))),new Promise(r=>setTimeout(r,3000))]);
 await Promise.race([Promise.all(document.getAnimations().filter(a=>a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{}))),new Promise(r=>setTimeout(r,3000))]);
});}
async function cap(p,f,label){await settle(f);await p.screenshot({path:resolve(out,label+'.png')});report.captures.push({file:label+'.png',outer:await p.evaluate(()=>[innerWidth,innerHeight]),frame:await f.evaluate(()=>[innerWidth,innerHeight]),inspected:false});await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}
async function measure(f,label){check(label,await f.evaluate(()=>({viewport:[innerWidth,innerHeight],scroll:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],controls:[...document.querySelectorAll('a,button,input,select,.faq-q')].filter(e=>e.getClientRects().length).map(e=>({text:e.textContent.trim().slice(0,45),tag:e.tagName,tab:e.tabIndex,rect:(()=>{let r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}})()}))})));}


async function booking(f,p,tag,capture){
 await f.goto(origin+base+'book-tickets.html');await settle(f);await layout(f,tag+' booking');
 check(tag+' empty checkout disabled',await f.locator('#checkoutBtn').isDisabled());
 await f.locator('[data-type=adult] [data-dec]').click();check(tag+' quantity floor',await f.locator('[data-type=adult] [data-val]').innerText());
 await f.locator('.perf-btn').first().click();await f.locator('.zone-card').first().click();
 for(const type of ['adult','concession','under25'])await f.locator('[data-type='+type+'] [data-inc]').click();
 check(tag+' mixed price $106',await f.locator('#sumTotal').innerText());
 if(capture)await cap(p,f,tag+'-booking');
 await f.locator('#checkoutBtn').click();await f.locator('#completeDemoBooking').click();
 check(tag+' truthful no payment result',await f.locator('#demoBookingResult').innerText());
 if(capture)await cap(p,f,tag+'-booking-result');
 await f.locator('#anotherBooking').click();check(tag+' reset',await f.locator('#sumTotal').innerText());
}
let browser;
try{
 browser=await pw.chromium.launch({channel:'chrome'});const c=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'}),p=await c.newPage();
 await c.route('**/*',r=>['GET','HEAD'].includes(r.request().method())?r.continue():r.abort());
 await p.goto(origin+base);const f=p.frames().find(f=>f.url().includes('site.html'));
 await booking(f,p,'1440x900',true);
 await f.goto(origin+base+'now-playing.html');await f.locator('[data-tab=details]').click();await cap(p,f,'now-playing-details');
 await f.locator('.np-poster-trigger').click();await cap(p,f,'now-poster');await f.locator('#csLightboxClose').click();
 await f.goto(origin+base+'coming-soon.html');await cap(p,f,'coming-soon');await f.locator('.cs-poster-trigger').nth(2).click();await cap(p,f,'coming-poster');
 await c.close();
}catch(e){report.errors.push(e.stack);}finally{await browser?.close();server.close();await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}
console.log(JSON.stringify({engine,captures:report.captures.length,errors:report.errors}));
