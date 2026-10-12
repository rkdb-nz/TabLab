
const header=document.querySelector('.header');
window.addEventListener('scroll',()=>{ header.classList.toggle('scrolled', scrollY>40); });

const obs=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); }),{threshold:.15});
document.querySelectorAll('.reveal,.img-reveal').forEach(el=>obs.observe(el));
document.querySelector('.hero')?.classList.add('loaded');
// discover parallax
const scenes=document.querySelectorAll('.d-bg img');
const sceneBlocks=document.querySelectorAll('.d-scene');
const progress=document.querySelector('.progress');
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
const updateDiscoverMotion=()=>{
  if(motionPreference.matches){
    document.querySelectorAll('.reveal,.img-reveal').forEach(el=>el.classList.add('in'));
    scenes.forEach(img=>{img.style.setProperty('--img-scale','1.02');img.style.setProperty('--img-opacity','1');});
    sceneBlocks.forEach(scene=>{scene.style.setProperty('--scene-shift','0px');scene.style.setProperty('--scene-float','0px');scene.style.setProperty('--scene-scale','.03');scene.style.setProperty('--text-lift','0px');});
    return;
  }
  const sc=scrollY/(document.body.scrollHeight-innerHeight);
  if(progress) progress.style.width=sc*100+'%';
  sceneBlocks.forEach((scene,index)=>{
    const rect=scene.getBoundingClientRect();
    const viewportCenter=innerHeight * .5;
    const sceneCenter=rect.top + rect.height * .5;
    const distance=(sceneCenter-viewportCenter)/(innerHeight * .9);
    const depth=1 + ((index % 4) * .03);
    const floatOffset=Math.max(-14,Math.min(14,distance * -14 * depth));
    const textLift=Math.max(-8,Math.min(8,distance * -8));
    scene.style.setProperty('--scene-depth', depth.toFixed(2));
    scene.style.setProperty('--scene-shift', `${floatOffset * 0.08}px`);
    scene.style.setProperty('--scene-float', `${floatOffset * 0.05}px`);
    scene.style.setProperty('--scene-scale', `${Math.max(.02,Math.min(.07,Math.abs(distance) * .03 + (index % 3) * .004))}`);
    scene.style.setProperty('--text-lift', `${textLift}px`);
  });
  scenes.forEach(img=>{
    const rect=img.closest('.d-scene').getBoundingClientRect();
    const viewportCenter=innerHeight * .5;
    const sceneCenter=rect.top + rect.height * .5;
    const distance=(sceneCenter-viewportCenter)/(innerHeight * .75);
    const grow=Math.max(1.02,Math.min(1.08,1.03 + Math.abs(distance) * .03));
    const fade=Math.max(.86,Math.min(1,1 - Math.abs(distance) * .07));
    img.style.setProperty('--img-scale', grow.toFixed(3));
    img.style.setProperty('--img-opacity', fade.toFixed(3));
  });
};
updateDiscoverMotion();
window.addEventListener('scroll',updateDiscoverMotion,{passive:true});
window.addEventListener('resize',updateDiscoverMotion,{passive:true});
motionPreference.addEventListener('change',updateDiscoverMotion);

const thumbButtons=[...document.querySelectorAll('.retreat-thumb-btn')];
const lightbox=document.querySelector('#retreat-lightbox');
if(thumbButtons.length && lightbox){
  const lightboxImage=lightbox.querySelector('.lightbox-image');
  const lightboxCaption=lightbox.querySelector('.lightbox-caption');
  const closeBtn=lightbox.querySelector('.lightbox-close');
  const prevBtn=lightbox.querySelector('.lightbox-prev');
  const nextBtn=lightbox.querySelector('.lightbox-next');
  let activeIndex=0;
  let activeGallery=[];
  let lastTrigger=null;
  let lightboxBackgrounds=[];
  lightbox.inert=true;

  const setNavState=()=>{
    const atStart=activeIndex<=0;
    const atEnd=activeIndex>=activeGallery.length-1;
    prevBtn.disabled=atStart;
    nextBtn.disabled=atEnd;
    prevBtn.setAttribute('aria-disabled',String(atStart));
    nextBtn.setAttribute('aria-disabled',String(atEnd));
  };

  const showImage=(index)=>{
    if(!activeGallery.length) return;
    activeIndex=Math.max(0,Math.min(index,activeGallery.length-1));
    const item=activeGallery[activeIndex];
    lightboxImage.src=item.src;
    lightboxImage.alt=item.alt;
    lightboxCaption.textContent=item.alt;
    setNavState();
  };

  const openLightbox=(gallery,index,trigger)=>{
    lastTrigger=trigger;
    activeGallery=gallery;
    showImage(index);
    lightbox.inert=false;
    lightboxBackgrounds=[...document.body.children].filter(el=>el!==lightbox && !['SCRIPT','LINK','STYLE'].includes(el.tagName)).map(el=>[el,el.inert]);
    lightboxBackgrounds.forEach(([el])=>{el.inert=true;});
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    closeBtn.focus();
  };

  const closeLightbox=()=>{
    lightbox.classList.remove('open');
    lightbox.inert=true;
    lightboxBackgrounds.forEach(([el,inert])=>{el.inert=inert;});
    lightboxBackgrounds=[];
    lightbox.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
    lightboxImage.src='';
    activeGallery=[];
    if(lastTrigger) lastTrigger.focus();
  };

  thumbButtons.forEach((btn)=>{
    btn.addEventListener('click',()=>{
      const retreat=btn.closest('.retreat-full');
      if(!retreat) return;
      const groupButtons=[...retreat.querySelectorAll('.retreat-thumb-btn')];
      const groupGallery=groupButtons.map((thumbBtn)=>{
        const img=thumbBtn.querySelector('img');
        return { src:img?.getAttribute('src')||'', alt:img?.getAttribute('alt')||'' };
      });
      const index=groupButtons.indexOf(btn);
      openLightbox(groupGallery,Math.max(0,index),btn);
    });
  });

  prevBtn.addEventListener('click',()=>showImage(activeIndex-1));
  nextBtn.addEventListener('click',()=>showImage(activeIndex+1));
  closeBtn.addEventListener('click',closeLightbox);

  lightbox.addEventListener('click',(e)=>{
    if(e.target===lightbox) closeLightbox();
  });

  document.addEventListener('keydown',(e)=>{
    if(!lightbox.classList.contains('open')) return;
    if(e.key==='Escape'){e.preventDefault();closeLightbox();}
    if(e.key==='Tab'){
      const controls=[closeBtn,prevBtn,nextBtn].filter(button=>!button.disabled);
      const index=controls.indexOf(document.activeElement);
      e.preventDefault();
      controls[(index+(e.shiftKey?-1:1)+controls.length)%controls.length].focus();
    }
    if(e.key==='ArrowLeft' && !prevBtn.disabled) showImage(activeIndex-1);
    if(e.key==='ArrowRight' && !nextBtn.disabled) showImage(activeIndex+1);
  });
}


// Accessible mobile navigation and query-independent current-page marking.
(() => {
  const menu=document.querySelector('.header .nav');
  const toggle=document.querySelector('.menu-btn');
  if(!menu || !toggle) return;
  menu.id='demo-navigation';
  toggle.setAttribute('aria-controls',menu.id);
  const mobile=matchMedia('(max-width:900px)');
  const setOpen=open=>{
    menu.classList.toggle('open',open);
    toggle.setAttribute('aria-expanded',String(open));
    toggle.setAttribute('aria-label',open?'Close menu':'Open menu');
    if(mobile.matches) menu.inert=!open;
    else menu.inert=false;
  };
  setOpen(false);
  toggle.addEventListener('click',()=>setOpen(!menu.classList.contains('open')));
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape' && menu.classList.contains('open')){setOpen(false);toggle.focus();}
  });
  mobile.addEventListener('change',()=>setOpen(false));
  menu.querySelectorAll('a').forEach(link=>{
    if(new URL(link.href).pathname.replace(/\.html$/, '').replace(/\/$/, '')===location.pathname.replace(/\.html$/, '').replace(/\/$/, '')){link.classList.add('active');link.setAttribute('aria-current','page');}
    link.addEventListener('click',()=>setOpen(false));
  });
})();

// This demonstration confirmation is local; no enquiry is transmitted.
(() => {
  const form=document.querySelector('#clementine-book-form');
  const modal=document.querySelector('#clementine-confirmation');
  if(!form || !modal) return;
  const close=modal.querySelector('.clementine-confirmation-ok');
  let trigger=null;
  let backgrounds=[];
  const closeDialog=()=>{
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden','true');
    modal.hidden=true;
    backgrounds.forEach(([element,inert])=>{element.inert=inert;});
    backgrounds=[];
    if(trigger?.isConnected) trigger.focus();
  };
  form.addEventListener('submit',event=>{
    event.preventDefault();
    trigger=document.activeElement;
    // Inert siblings at each ancestor level, preserving any pre-existing state.
    for(let node=modal;node.parentElement;node=node.parentElement){
      for(const sibling of node.parentElement.children){
        if(sibling!==node && !['SCRIPT','STYLE','LINK'].includes(sibling.tagName)){
          backgrounds.push([sibling,sibling.inert]);sibling.inert=true;
        }
      }
      if(node.parentElement===document.body) break;
    }
    modal.hidden=false;
    modal.setAttribute('aria-hidden','false');
    modal.classList.add('is-open');
    close.focus();
  });
  close.addEventListener('click',closeDialog);
  modal.addEventListener('click',event=>{if(event.target===modal) closeDialog();});
  modal.addEventListener('keydown',event=>{
    if(event.key==='Escape'){event.preventDefault();closeDialog();}
    if(event.key==='Tab'){event.preventDefault();close.focus();}
  });
})();
