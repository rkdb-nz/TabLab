import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createHash} from 'node:crypto';
const require=createRequire(import.meta.url),pw=require('playwright');
const engine=process.env.QA_BROWSER||'chromium',root=resolve('public'),out=resolve('qa/drilling-focused',engine);
await mkdir(out,{recursive:true});
const report={mode:'routine',engine,commit:process.env.GITHUB_SHA,captures:[],checks:[],errors:[],console:[],assets:[],sourceHashes:{},limitations:['Linux emulation, not physical phones or Safari/iOS.','No real booking or message delivery.']};
const base='/boardroom/billboard/demos/drilling/';
for(const rel of ['index.html','site.html','css/style.css','css/mobile-fluid.css','js/app.js'])report.sourceHashes[rel]=createHash('sha256').update(await readFile(resolve(root,'.'+base,rel))).digest('hex');
const mime={'.html':'text/html','.css':'text/css','.js':'application/javascript','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{let p=resolve(root,'.'+new URL(req.url,'http://local').pathname);if(!p.startsWith(root+'/'))throw Error();if((await stat(p)).isDirectory())p+='/index.html';res.writeHead(200,{'Content-Type':mime[extname(p)]||'application/octet-stream'}).end(await readFile(p));}catch{res.writeHead(404).end('Not found');}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port;
const browser=await pw[engine].launch({headless:true});report.version=browser.version();


try{
for(const [width,height] of [[1440,900],[390,844]]){
 const cx=await browser.newContext({viewport:{width,height}}),p=await cx.newPage();const failed=[];
 p.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()}));await p.goto(origin+base);
 const f=p.frames().find(f=>f.url().includes('/site.html'));
 async function measure(){return {outer:await p.evaluate(()=>[innerWidth,innerHeight]),frame:await f.evaluate(()=>[innerWidth,innerHeight]),full:await p.evaluate(()=>!!document.fullscreenElement),expanded:await p.locator('.demo-browser-content').evaluate(e=>e.classList.contains('demo-expanded'))};}
 const before=await measure();
 await p.getByRole('button',{name:'Open example in full screen',exact:true}).click();
 await p.waitForFunction(()=>!!document.fullscreenElement||document.querySelector('.demo-expanded'));
 await p.waitForTimeout(750);const full=await measure();await p.screenshot({path:resolve(out,width+'-full.png')});
 await p.getByRole('button',{name:'Exit full screen and return to Tab Lab frame',exact:true}).click();
 await p.waitForFunction(()=>!document.fullscreenElement&&!document.querySelector('.demo-expanded'));await p.waitForTimeout(750);
 const returned=await measure();await p.screenshot({path:resolve(out,width+'-returned.png')});
 report.checks.push({label:'settled-fullscreen-'+width,before,full,returned,exitHidden:await p.getByRole('button',{name:'Exit full screen and return to Tab Lab frame',exact:true}).isHidden(),focus:await p.evaluate(()=>document.activeElement.outerHTML)});
 if(width===1440){
 await f.locator('.menu-toggle').press('Tab');report.checks.push({label:'closed-menu-tab',active:await f.evaluate(()=>document.activeElement.outerHTML)});
 const links=await p.locator('a').evaluateAll(es=>[...new Set(es.map(e=>e.href))].filter(h=>h.startsWith(location.origin)));
 for(const url of links){const r=await cx.request.get(url);report.checks.push({label:'destination',url,status:r.status()});}
 }
 await f.locator('.menu-toggle').click();await f.locator('[data-panel=quote]').click();
 report.checks.push({label:'contrast-'+width,styles:await f.locator('.drawer-panel.is-active').evaluate(e=>[...e.querySelectorAll('p,label,button,input')].map(e=>({text:e.innerText,font:getComputedStyle(e).fontSize,color:getComputedStyle(e).color,bg:getComputedStyle(e).backgroundColor})))});
 report.checks.push({label:'failed-requests-'+width,failed});await cx.close();
}
}finally{await browser.close();await new Promise(r=>server.close(r));await writeFile(resolve(out,'focused-report.json'),JSON.stringify(report,null,2));}
