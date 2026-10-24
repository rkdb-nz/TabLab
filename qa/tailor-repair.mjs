import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const require=createRequire(import.meta.url),pw=require('playwright'),engine=process.env.QA_BROWSER||'chromium',root=resolve('public'),out=resolve('qa/tailor-repair-results',engine);
await mkdir(out,{recursive:true});
const report={engine,commit:process.env.GITHUB_SHA,checks:[],captures:[],errors:[],assets:[],scans:[],failures:[]};
const server=createServer(async(req,res)=>{try{let p=resolve(root,'.'+new URL(req.url,'http://local').pathname);if(!p.startsWith(root+'/'))throw Error();if((await stat(p)).isDirectory())p+='/index.html';res.writeHead(200,{'Content-Type':({'.html':'text/html','.css':'text/css','.js':'application/javascript','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'})[extname(p)]||'application/octet-stream'}).end(await readFile(p));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port,base='/boardroom/skateboard/demos/tailor/';
const note=(label,evidence)=>report.checks.push({label,evidence});
const check=(label,value,evidence)=>{note(label,{pass:value,evidence});if(!value)report.failures.push(label);};
async function settled(f){await f.waitForFunction(()=>!isAnimating);await f.locator('body').evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].filter(i=>i.hasAttribute('src')&&(i.loading!=='lazy'||i.complete)).map(i=>i.decode().catch(()=>{})));await Promise.all(document.getAnimations().filter(a=>a.effect.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})));});await new Promise(r=>setTimeout(r,450));}
async function cap(p,label){await p.screenshot({path:resolve(out,label+'.png'),animations:'disabled'});report.captures.push({file:label+'.png',viewport:await p.evaluate(()=>[innerWidth,innerHeight]),state:label,inspected:false});}
async function nav(f,i){const link=f.locator('#topnav [data-goto="'+i+'"]').first();if(await link.isVisible())await link.click();else{let current=await f.evaluate(()=>currentIndex);while(current!==i){await f.locator(current<i?'#chapter-next':'#chapter-prev').click();await settled(f);current=await f.evaluate(()=>currentIndex);}}await settled(f);}
async function scan(f,label){await f.addScriptTag({path:require.resolve('axe-core/axe.min.js')});const result=await f.evaluate(async()=>{const r=await axe.run();return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({html:n.html,summary:n.failureSummary}))}));});report.scans.push({label,result});check(label+' axe',result.length===0,result.map(v=>v.id));}
let browser;
try{browser=await pw[engine].launch(engine==='chromium'?{channel:'chrome'}:{});report.version=browser.version();
for(const [width,height] of(engine==='chromium'?[[1440,900],[390,844],[844,390],[320,568],[780,300]]:[[1440,900],[390,844]])){
 const tag=width+'x'+height,c=await browser.newContext({viewport:{width,height}}),p=await c.newPage();p.setDefaultTimeout(12000);
 await c.route('**/*',r=>['GET','HEAD'].includes(r.request().method())?r.continue():r.abort());p.on('pageerror',e=>report.errors.push({tag,error:e.message}));p.on('response',r=>{if(r.status()>=400&&new URL(r.url()).hostname==='127.0.0.1')report.assets.push({tag,url:r.url(),status:r.status()});});
 try{await p.goto(origin+base);let f=p.frames().find(f=>f.url().includes('site.html'));await settled(f);await cap(p,tag+'-home');
 check(tag+' active chapter only',await f.locator('.chapter').evaluateAll(es=>es.every(e=>e.inert===!e.classList.contains('active'))));
 if(engine==='chromium'&&width===1440){
  const bytes=await f.evaluate(()=>performance.getEntriesByType('resource').reduce((n,r)=>n+r.transferSize,0));note('normal initial resource bytes',bytes);check('initial transfer below 3MB',bytes<3000000,bytes);
  await f.locator('.wordmark').focus();let escaped=false;for(let i=0;i<16;i++){await p.keyboard.press('Tab');escaped ||= await f.evaluate(()=>{const e=document.activeElement.closest('.chapter');return !!e&&!e.classList.contains('active');});}
  check('keyboard excludes inactive chapters',!escaped);check('keyboard keeps parent aligned',await f.locator('#scroller').evaluate(e=>e.scrollLeft===0));
 }
 if(engine==='chromium'&&width<=900){
  const m=await f.locator('.ch1 .type').evaluate(e=>{e.scrollTop=e.scrollHeight;const a=e.querySelector('.btn').getBoundingClientRect(),r=e.getBoundingClientRect();return {clip:r.toJSON(),action:a.toJSON(),reachable:a.top>=r.top-1&&a.bottom<=r.bottom+1};});check(tag+' Arrival action reachable',m.reachable,m);
 }
 await nav(f,1);check(tag+' House navigation',await f.evaluate(()=>currentIndex===1));
 await nav(f,2);await f.locator('#look-next').click();check(tag+' page turn',await f.locator('#look-count').innerText()===(width<=900?'2 / 6':'02 / 06'));
 if(engine==='chromium'&&width===1440){
  await f.locator('#look-prev').click();for(let i=0;i<6;i++){await settled(f);const overlap=await f.locator('.lookbook-slide.active').evaluate(e=>{const copy=e.querySelector('.book-page .copy'),hero=e.querySelector('.book-page .hero');if(!copy||!hero||copy.parentElement!==hero.parentElement)return false;return copy.getBoundingClientRect().right>hero.getBoundingClientRect().left;});check('look '+i+' copy clear of image',!overlap);if([0,1,5].includes(i))await cap(p,'look-'+i);await f.locator('#look-next').click();}
  await settled(f);await scan(f,'desktop collection');
  await f.locator('#look-next').press('ArrowRight');check('look keyboard stays in Collection',await f.evaluate(()=>currentIndex===2));
  await p.emulateMedia({reducedMotion:'reduce'});await nav(f,3);check('reduced motion transition',await f.locator('.img-reveal img').first().evaluate(e=>getComputedStyle(e).transitionDuration==='0s'));await p.emulateMedia({reducedMotion:'no-preference'});
  await nav(f,2);await p.setViewportSize({width:390,height:844});await settled(f);let m=await f.evaluate(()=>({current:currentIndex,left:scroller.scrollLeft,width:innerWidth}));check('desktop to phone preserves chapter',m.current===2&&Math.abs(m.left-2*m.width)<2,m);
  await f.locator('#chapter-next').click();await settled(f);check('resized next chapter',await f.evaluate(()=>currentIndex===3));
  await p.setViewportSize({width,height});await settled(f);check('return to desktop aligned',await f.evaluate(()=>currentIndex===3&&scroller.scrollLeft===0));
 }
 await nav(f,3);if(width<=900){const ds=f.locator('.mobile-craft-accordion details');await ds.first().locator('summary').click();await ds.last().locator('summary').click();check(tag+' exclusive craft disclosure',await ds.evaluateAll(es=>es.filter(e=>e.open).length===1&&es.at(-1).open));
 if(engine==='chromium'&&width===390){await p.setViewportSize({width:844,height:390});await settled(f);check('rotation retains craft',await f.evaluate(()=>currentIndex===3&&document.querySelector('.mobile-craft-accordion details:last-child').open));await p.setViewportSize({width,height});await settled(f);}}
 await nav(f,4);if(width<=900){await f.locator('[data-visit-panel="1"]').click();await settled(f);check(tag+' boutique selected state',await f.locator('[data-visit-panel="1"]').getAttribute('aria-pressed')==='true');}
 const book=f.locator(width<=900?'.visit-milan .book-visit':'.visit-waperiki .book-visit');await book.click();await settled(f);
 check(tag+' enquiry dialog opens',await f.locator('#visit-dialog').evaluate(e=>e.open));
 const form=f.locator('#visit-form');await form.locator('[type=submit]').click();check(tag+' required validation',await form.evaluate(e=>!e.checkValidity()));
 await form.locator('[name=date]').fill('2099-12-01');await form.locator('[name=time]').selectOption('Afternoon');await form.locator('[name=name]').fill('Sitecheck');await form.locator('[name=email]').fill('invalid');check(tag+' email validation',await form.locator('[name=email]').evaluate(e=>e.validity.typeMismatch));
 await form.locator('[name=email]').fill('sitecheck@example.com');await form.locator('[name=message]').fill('QA demonstration only.');
 if(engine==='chromium'&&width===390)await cap(p,'phone-enquiry');
 await form.locator('[type=submit]').click();check(tag+' final no-send result',(await f.locator('#visit-result').innerText()).includes('no enquiry or message has been sent'));
 if(engine==='chromium'&&[1440,780].includes(width))await cap(p,tag+'-result');
 if(engine==='chromium'&&width===390)await scan(f,'visit dialog result');
 await f.locator('.dialog-close').click();check(tag+' close restores trigger focus',await book.evaluate(e=>e===document.activeElement));
 await book.click();await f.locator('.dialog-close').press('Escape');check(tag+' Escape closes dialog',await f.locator('#visit-dialog').evaluate(e=>!e.open));
 if(engine==='chromium'&&width===390){await scan(f,'mobile visit');await p.emulateMedia({reducedMotion:'reduce'});check('mobile reduced scroll',await f.locator('#scroller').evaluate(e=>getComputedStyle(e).scrollBehavior==='auto'));await p.emulateMedia({reducedMotion:'no-preference'});}
 if(engine==='chromium'&&[1440,390].includes(width)){
  await p.getByRole('button',{name:'Open example in full screen',exact:true}).click();await settled(f);note(tag+' fullscreen size',await f.evaluate(()=>[innerWidth,innerHeight]));
  await p.getByRole('button',{name:'Exit full screen and return to Tab Lab frame',exact:true}).click();await settled(f);check(tag+' fullscreen return chapter',await f.evaluate(()=>currentIndex===4));
  await p.getByRole('button',{name:'Back to gallery',exact:true}).click();await p.waitForURL('**/skateboard/**');check(tag+' gallery return',p.url().includes('/skateboard/'));
 }
 }catch(e){report.errors.push({tag,error:e.stack});}finally{await c.close();}}
}catch(e){report.launchError=e.stack;}finally{await browser?.close();server.close();await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}
console.log(JSON.stringify({engine,failures:report.failures,errors:report.errors,captures:report.captures.length,launchError:report.launchError}));if(report.failures.length||report.errors.length||report.launchError)process.exitCode=1;
