
// Nav show/hide on home
const nav = document.querySelector('.nav');
const hero = document.querySelector('.hero');
if(hero && nav){
  nav.classList.add('hidden');
}
// Trifold scroll
const wrap = document.querySelector('.trifold-wrap');
if(wrap){
  const triggerTarget = wrap.querySelector('.trifold-sticky') || wrap;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealDurationMs = prefersReducedMotion ? 0 : 800;
  const downwardThresholdPx = 60;
  const settleDelayMs = 180;
  let revealStarted = false;
  let sectionActive = false;
  let inputArmed = false;
  let accumulatedDownward = 0;
  let settleTimer = null;
  let touchStartY = null;

  function revealNow(){
    if(revealStarted) return;
    revealStarted = true;
    detachInputListeners();
    clearSettleTimer();

    wrap.classList.add('cards-revealed');

    window.setTimeout(()=>{
      if(hero && nav){
        nav.classList.remove('hidden');
      }
    }, revealDurationMs);
  }

  function clearSettleTimer(){
    if(settleTimer){
      window.clearTimeout(settleTimer);
      settleTimer = null;
    }
  }

  function armInputAfterSettle(){
    clearSettleTimer();
    accumulatedDownward = 0;
    inputArmed = false;
    settleTimer = window.setTimeout(()=>{
      if(!sectionActive || revealStarted) return;
      accumulatedDownward = 0;
      inputArmed = true;
    }, settleDelayMs);
  }

  function registerDownward(delta){
    if(!sectionActive || !inputArmed || revealStarted) return;
    if(delta <= 0) return;
    accumulatedDownward += delta;
    if(accumulatedDownward >= downwardThresholdPx){
      revealNow();
    }
  }

  function onWheel(event){
    registerDownward(event.deltaY);
  }

  function onTouchStart(event){
    if(!event.touches || event.touches.length === 0) return;
    touchStartY = event.touches[0].clientY;
  }

  function onTouchMove(event){
    if(!event.touches || event.touches.length === 0 || touchStartY === null) return;
    const currentY = event.touches[0].clientY;
    const delta = touchStartY - currentY;
    touchStartY = currentY;
    registerDownward(delta);
  }

  function onKeyDown(event){
    if(event.key === 'ArrowDown'){
      registerDownward(60);
    }
    if(event.key === 'PageDown' || event.key === ' ' || event.key === 'Spacebar'){
      registerDownward(80);
    }
  }

  function attachInputListeners(){
    window.addEventListener('wheel', onWheel, { passive:true });
    window.addEventListener('touchstart', onTouchStart, { passive:true });
    window.addEventListener('touchmove', onTouchMove, { passive:true });
    window.addEventListener('keydown', onKeyDown);
  }

  function detachInputListeners(){
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('touchstart', onTouchStart);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('keydown', onKeyDown);
    inputArmed = false;
    accumulatedDownward = 0;
    touchStartY = null;
  }

  function setSectionActive(active){
    if(revealStarted) return;
    if(sectionActive === active) return;
    sectionActive = active;
    if(sectionActive){
      attachInputListeners();
      armInputAfterSettle();
    } else {
      clearSettleTimer();
      detachInputListeners();
    }
  }

  if('IntersectionObserver' in window){
    const observer = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        setSectionActive(entry.isIntersecting && entry.intersectionRatio >= 0.98);
      });
    }, { threshold:[0, 0.98, 1] });

    observer.observe(triggerTarget);
  } else {
    function getVisibleRatio(element){
      const rect = element.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const visible = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
      const normalizer = Math.max(Math.min(rect.height, vh), 1);
      return Math.max(0, Math.min(visible / normalizer, 1));
    }

    const onScroll = ()=>{
      setSectionActive(getVisibleRatio(triggerTarget) >= 0.98);
    };

    window.addEventListener('scroll', onScroll, { passive:true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }
}
// FAQ
document.querySelectorAll('.faq-q').forEach(q=>{
  q.addEventListener('click',()=>{
    const a = q.nextElementSibling;
    if(a){ const open=q.getAttribute('aria-expanded')!=='true'; q.setAttribute('aria-expanded',String(open)); a.style.display=open?'block':'none'; }
  });
});



// Home cards: finish the image crossfade before opening the selected page.
(() => {
  const panels = document.querySelectorAll('.home-page .panel[data-href]');
  if (!panels.length) return;

  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let navigating = false;

  function openPanel(panel) {
    if (navigating) return;
    const destination = panel.dataset.href;
    if (!destination) return;

    navigating = true;
    panel.classList.add('is-activating');
    panel.setAttribute('aria-disabled', 'true');

    window.setTimeout(() => {
      window.location.href = destination;
    }, motionPreference.matches ? 0 : 1050);
  }

  panels.forEach(panel => {
    panel.addEventListener('click', event => {
      event.preventDefault();
      openPanel(panel);
    });

    panel.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      openPanel(panel);
    });
  });
})();

// Accessible mobile navigation and query-independent current-page marking.
(() => {
  const menu=document.querySelector('.nav-links');
  const toggle=document.querySelector('.mobile-toggle');
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
    if(new URL(link.href).pathname===location.pathname){link.classList.add('active');link.setAttribute('aria-current','page');}
    link.addEventListener('click',()=>setOpen(false));
  });
})();

// This demonstration confirmation is local; no enquiry is transmitted.
(() => {
  const form=document.querySelector('.booking-form');
  const modal=document.querySelector('#booking-confirmation');
  if(!form || !modal) return;
  const close=modal.querySelector('.booking-confirmation-close');
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
