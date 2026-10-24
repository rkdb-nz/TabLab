import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const require=createRequire(import.meta.url),pw=require('playwright'),engine=process.env.QA_BROWSER||'chromium',root=resolve('public'),out=resolve('qa/retreat-results',engine),base='/boardroom/springboard/demos/retreat/';
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
async function form(f,p,tag,capture){
 await go(f,'book.html');const form=f.locator('#clementine-book-form');await form.locator('button').click();check(tag+' invalid required',await form.locator(':invalid').count());
 await form.locator('input').nth(2).fill('QA Example');await form.locator('input').nth(3).fill('bad-email');await form.locator('button').click();check(tag+' invalid email',await form.locator('input[type=email]').evaluate(e=>e.validity.typeMismatch));
 await form.locator('input').nth(3).fill('qa@example.invalid');await form.locator('input[type=number]').fill('999');await form.locator('button').click();check(tag+' invalid guest limit',await form.locator('input[type=number]').evaluate(e=>e.validity.rangeOverflow));
 if(capture)await cap(p,f,tag+'-book-invalid');
 await form.locator('input[type=number]').fill('2');await form.locator('button').click();check(tag+' result',await f.locator('#clementine-confirmation').innerText());
 await f.locator('.clementine-confirmation-ok').press('Tab');check(tag+' modal focus',await f.locator('.clementine-confirmation-card').evaluate(e=>e.contains(document.activeElement)));await p.keyboard.press('Escape');check(tag+' Escape closes',await f.locator('#clementine-confirmation').isHidden());
 if(capture)await cap(p,f,tag+'-book-result');await f.locator('.clementine-confirmation-ok').click();await p.waitForTimeout(300);check(tag+' modal close focus',await f.evaluate(()=>document.activeElement.outerHTML));
}
try{
 browser=await pw[engine].launch(engine==='chromium'?{channel:'chrome'}:{headless:true});report.version=browser.version();
 const sizes=engine==='chromium'?[[1440,900],[390,844],[844,390],[320,568],[780,300]]:[[1440,900],[390,844]];
 for(const [width,height] of sizes){
  const tag=width+'x'+height,c=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'}),p=await c.newPage();p.setDefaultTimeout(10000);
  await c.route('**/*',r=>['GET','HEAD'].includes(r.request().method())?r.continue():r.abort());p.on('pageerror',e=>report.errors.push({tag,error:e.message}));p.on('response',r=>{if(r.status()>=400)report.assets.push({url:r.url(),status:r.status()});});
  await p.goto(origin+base);const f=p.frames().find(f=>f.url().includes('site.html'));await settle(f);await cap(p,f,tag+'-home');await dims(f,tag+' home');
  if(engine==='chromium'&&width===1440){await scan(f,'Home');check('metadata/link inventory',await f.evaluate(()=>({title:document.title,description:document.querySelector('meta[name=description]')?.content,robots:document.querySelector('meta[name=robots]')?.content,links:[...document.links].map(a=>a.getAttribute('href'))})));}
  await probe(tag+' nav',async()=>{
   if(width<1001){await f.locator('.menu-btn').click();await settle(f);check(tag+' menu expanded',await f.locator('.menu-btn').getAttribute('aria-expanded'));if(engine==='chromium'&&width===390){await p.setViewportSize({width:844,height:390});await cap(p,f,'rotated-menu');await dims(f,'rotated menu');await p.setViewportSize({width,height});}await f.locator('.nav a[href*=retreats]').click();}else await f.locator('.nav a[href*=retreats]').click();
   await f.waitForURL('**/retreats.html*');check(tag+' navigated',f.url());
  });
  if(engine==='chromium'&&width===1440){
   await scan(f,'Retreats');check('closed lightbox tabbable',await f.locator('#retreat-lightbox button').evaluateAll(es=>es.map(e=>({tab:e.tabIndex,display:getComputedStyle(e).display,visibility:getComputedStyle(e).visibility}))));
   for(let group=0;group<4;group++)await probe('gallery '+group,async()=>{
    const card=f.locator('.retreat-full').nth(group);await card.scrollIntoViewIfNeeded();await settle(f);if(group===0||group===3)await cap(p,f,'retreat-'+group);
    await card.locator('.retreat-thumb-btn').first().click();await settle(f);if(group===0)await cap(p,f,'lightbox');
    check('gallery '+group+' previous disabled',await f.locator('.lightbox-prev').isDisabled());
    for(let i=0;i<3;i++){check('gallery '+group+' image '+i,await f.locator('.lightbox-image').evaluate(e=>({src:e.currentSrc,decoded:e.naturalWidth>0,alt:e.alt})));if(i<2)await f.locator('.lightbox-next').click();await settle(f);}
    check('gallery '+group+' next disabled',await f.locator('.lightbox-next').isDisabled());await f.locator('.lightbox-close').press('Tab');check('lightbox focus contained',await f.locator('#retreat-lightbox').evaluate(e=>e.contains(document.activeElement)));await p.keyboard.press('Escape');check('lightbox Escape restores trigger',await card.locator('.retreat-thumb-btn').first().evaluate(e=>e===document.activeElement));
   });
   await probe('enquiry preserves choice',async()=>{await f.locator('#coastal a.btn').click();await f.waitForURL('**/book.html*');check('coastal selected on arrival',await f.locator('select').inputValue());});
   await form(f,p,tag,true);await scan(f,'Book');check('book links',await f.locator('a').evaluateAll(es=>es.map(e=>e.getAttribute('href'))));
   await go(f,'reviews.html');await scan(f,'Reviews');for(let i=0;i<8;i++){await f.locator('.testimonial-entry').nth(i).scrollIntoViewIfNeeded();await settle(f);check('review '+i,await f.locator('.testimonial-entry').nth(i).innerText());if(i===0||i===7)await cap(p,f,'review-'+i);}
   await go(f,'discover.html');await scan(f,'Discover');
   for(let i=0;i<9;i++){await f.locator('.d-scene').nth(i).scrollIntoViewIfNeeded();await settle(f);check('discover scene '+i,await f.locator('.d-scene').nth(i).evaluate(e=>({text:e.innerText,img:e.querySelector('img').naturalWidth,rect:[e.getBoundingClientRect().y,e.getBoundingClientRect().height],motion:getComputedStyle(e.querySelector('.d-bg')).transitionDuration})));if([0,1,8].includes(i))await cap(p,f,'discover-'+i);}
   await f.locator('.d-scene-closing a').click();await f.waitForURL('**/book.html*');check('discover reserve destination',f.url());
   const before=await p.evaluate(()=>[innerWidth,innerHeight,devicePixelRatio]);await p.keyboard.press('Control++');await p.keyboard.press('Control++');await p.keyboard.press('Control++');check('native zoom attempt',{before,after:await p.evaluate(()=>[innerWidth,innerHeight,devicePixelRatio])});
  }
  if(width===390){
   await form(f,p,tag,true);
   if(engine==='chromium'){
    await go(f,'retreats.html#coastal');await f.locator('#coastal .retreat-thumb-btn').first().click();await cap(p,f,'phone-gallery');await f.locator('.lightbox-close').click();
    await go(f,'reviews.html');await f.locator('.testimonial-entry').nth(5).scrollIntoViewIfNeeded();await cap(p,f,'phone-review');
    await go(f,'discover.html');await f.locator('body').press('PageDown');await p.waitForTimeout(1700);await cap(p,f,'phone-discover');await dims(f,'phone discover');check('phone discover transition in reduced motion',await f.locator('.discover-track').getAttribute('style'));
    for(let i=1;i<8;i++){await f.locator('body').press('PageDown');await p.waitForTimeout(1600);check('phone discover step '+i,await f.locator('.discover-track').getAttribute('style'));}
    check('phone reserve reachable',await f.locator('.d-scene-closing a').evaluate(e=>{const r=e.getBoundingClientRect();return {rect:[r.x,r.y,r.width,r.height],inert:e.closest('[inert]')!==null};}));await f.locator('.retreat-back-top').click();await p.waitForTimeout(1600);check('Discover return top',await f.locator('.discover-track').getAttribute('style'));
   }
  }
  if(engine==='chromium'&&(width===844||width===320||width===780)){
   await go(f,'discover.html');await f.locator('body').press('PageDown');await p.waitForTimeout(1600);await dims(f,tag+' Discover');if(width===780)await cap(p,f,'short-discover');
   await go(f,'book.html');await dims(f,tag+' Book');
  }
  if(engine==='chromium'&&(width===1440||width===390))await probe(tag+' wrapper',async()=>{
   await p.getByRole('button',{name:'Open example in full screen',exact:true}).click();await p.waitForTimeout(600);check(tag+' fullscreen',{frame:await f.evaluate(()=>[innerWidth,innerHeight]),returnVisible:await p.getByRole('button',{name:'Exit full screen and return to Tab Lab frame'}).isVisible()});await p.getByRole('button',{name:'Exit full screen and return to Tab Lab frame'}).click();await p.waitForTimeout(400);check(tag+' return',await p.getByRole('button',{name:'Open example in full screen',exact:true}).isVisible());await p.getByRole('button',{name:'Back to gallery',exact:true}).click();check(tag+' gallery',p.url());await p.goto(origin+base);
  });
  await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));await c.close();
 }
}catch(e){report.errors.push({fatal:e.stack});}finally{await browser?.close();server.close();await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}
console.log(JSON.stringify({engine,captures:report.captures.length,errors:report.errors}));
