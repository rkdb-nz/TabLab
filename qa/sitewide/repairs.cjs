module.exports=async h=>{
 const {R,pw,ctx,go,settle,metrics,shot,check,error,save,formTests}=h;
 const AxeBuilder=require('@axe-core/playwright').default,contrast=require('./rendered-contrast.cjs');
 const retreat='/boardroom/springboard/demos/retreat/',produce='/boardroom/noticeboard/demos/produce/site.html',shop='/boardroom/skateboard/demos/tailor/shop/index.html',charity='/boardroom/noticeboard/demos/charity-walk/site.html',pottery='/boardroom/skateboard/demos/pottery/mobile.html';
 R.extended={contrast:[]};
 const b=await pw.chromium.launch({headless:true});
 try{const {c,p}=await ctx(b,[1440,900]);
 for(const size of [[1440,900],[390,844],[844,390]])try{
   await contrast.checkTargets(p,{go:()=>go(p,retreat+'site.html',size),r:R,result:check},['.hero h1','.hero p']);
   await go(p,retreat+'site.html',size);await shot(p,'retreat-'+size.join('x'),false);
 }catch(e){error('Retreat '+size,e)}
 for(const motion of ['no-preference','reduce'])for(const size of [[1440,900],[390,844],[844,390],[320,568],[780,300]])try{
   await p.emulateMedia({reducedMotion:motion});await go(p,produce,size);
   const detail=await p.locator('.footer').evaluate(e=>{const f=e.getBoundingClientRect();return {footer:f.toJSON(),items:[...e.children].map(x=>{const b=x.getBoundingClientRect();return {text:x.innerText,rect:b.toJSON(),scroll:[x.scrollWidth,x.scrollHeight],client:[x.clientWidth,x.clientHeight],animation:getComputedStyle(x).animationName,inside:b.left>=f.left-1&&b.right<=f.right+1&&b.top>=f.top-1&&b.bottom<=f.bottom+1,fit:x.scrollWidth<=x.clientWidth+1&&x.scrollHeight<=x.clientHeight+1}})}});
   check('Produce all footer content '+motion+' '+size,detail.items.length===3&&detail.items.every(x=>x.inside&&x.fit&&x.animation==='none'),detail);
   const zone=await p.locator('.board-zone').boundingBox();check('Produce board clears footer '+motion+' '+size,zone.y+zone.height<=detail.footer.y+2,{zone,footer:detail.footer});
   if(motion==='reduce'&&[390,844,320].includes(size[0]))await shot(p,'produce-'+size.join('x')+'-reduce',false);
 }catch(e){error('Produce '+motion+' '+size,e)}
 await p.emulateMedia({reducedMotion:'no-preference'});
 for(const [file,size,label]of [[charity,[1440,900],'charity-desktop'],[shop,[1440,900],'shop-desktop'],[shop,[390,844],'shop-phone'],[pottery,[390,844],'pottery-phone']])try{
   await go(p,file,size);const a=await new AxeBuilder({page:p}).analyze();R.scans.push({file,size,violations:a.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
   check(label+' accessibility repaired',a.violations.length===0,R.scans.at(-1));
   if(file===shop){check('Shop language main and nine pieces',await p.evaluate(()=>document.documentElement.lang==='en-NZ'&&document.querySelectorAll('main').length===1&&document.querySelectorAll('main .item').length===9&&document.querySelector('main p').innerText.startsWith('Nine considered pieces.')));await p.locator('.grid .item').last().scrollIntoViewIfNeeded();await settle(p);}
   if(file===pottery){check('Pottery return inside navigation',await p.locator('nav[aria-label="Tab Lab gallery"] .tablab-return').isVisible());const href=await p.locator('.tablab-return').getAttribute('href');check('Pottery return destination retained',href==='../../index.html',href);}
   await shot(p,label,file===shop);
 }catch(e){error(label,e)}
 await c.close();}finally{await b.close()}
 // Nine representative combinations: five Chromium sizes, two Firefox and two WebKit.
 for(const engine of ['chromium','firefox','webkit']){let b;try{b=await pw[engine].launch({headless:true});const {c,p}=await ctx(b,[1440,900]);const sizes=engine==='chromium'?[[1440,900],[390,844],[844,390],[320,568],[780,300]]:[[1440,900],[390,844]];
 for(const size of sizes){await go(p,'/index.html',size);await p.locator('#exploreButton').click();await p.getByRole('link',{name:'The Boardroom',exact:true}).waitFor({state:'visible'});check(engine+' '+size+' main navigation',await p.getByRole('link',{name:'The Boardroom',exact:true}).isVisible());const m=await metrics(p);R.visits.push({engine,size,file:'/index.html',metrics:m});check(engine+' '+size+' main no overflow',m.document[0]<=size[0]+2,m.document);if(size[0]===390||engine==='chromium'&&size[0]===1440)await shot(p,'landing-'+engine+'-'+size.join('x'),false);
 if(size[0]===390){const bg=await p.locator('#tablabMobile .landing').evaluate(e=>({base:getComputedStyle(e).backgroundImage,before:getComputedStyle(e,'::before').backgroundImage}));check(engine+' Explore background retained',bg.base.includes('tablab-mobile-landscape.png')&&bg.before==='none',bg);}}
 await go(p,retreat+'book.html',[390,844]);await formTests(p,engine+' representative unchanged form');await c.close();}catch(e){error('smoke '+engine,e)}finally{if(b)await b.close()}}
 save();
};
