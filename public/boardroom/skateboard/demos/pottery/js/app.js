(() => {
  const mobileMotion = window.matchMedia('(max-width:980px)');
  const revealEls = document.querySelectorAll('.reveal, .reveal-img');
  const progressBar = document.getElementById('progressBar');
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (mobileMotion.matches) return;
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));

  requestAnimationFrame(() => {
    if (!mobileMotion.matches) document.querySelector('.hero')?.classList.add('loaded');
  });

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const h = document.documentElement;
        const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
        if (progressBar) progressBar.style.width = scrolled + '%';
        if (nav) {
          if (window.scrollY > 20) nav.classList.add('scrolled');
          else nav.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  const heroImg = document.querySelector('.hero-media img');
  window.addEventListener('scroll', () => {
    if (!heroImg || mobileMotion.matches) return;
    const y = window.scrollY * 0.18;
    heroImg.style.transform = `translateY(${y}px) scale(1.06)`;
    if (window.scrollY < 10) heroImg.style.transform = 'scale(1)';
  }, { passive: true });

  navToggle?.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
  document.querySelectorAll('#navMobile a').forEach(a => {
    a.addEventListener('click', () => nav.classList.remove('open'));
  });

  if (!mobileMotion.matches && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal, .reveal-img').forEach(el => el.classList.add('in'));
  }
})();

/* Mobile motion uses the visible viewport, loaded pictures, and repeatable reveals. */
(() => {
  const mobile=matchMedia('(max-width:980px)');
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  const root=document.documentElement;
  const photos=Array.from(document.querySelectorAll('.hero-media, .reveal-img, .collection-media'));
  photos.forEach(photo=>photo.classList.add('pottery-photo-reveal'));
  const targets=Array.from(new Set([...document.querySelectorAll('.reveal'),...photos]));
  const visible=new Map();
  const loads=new WeakMap();
  let frame=0;

  function imagesReady(element){
    if(!loads.has(element)){
      loads.set(element,Promise.all(Array.from(element.querySelectorAll('img')).map(img=>{
        if(img.complete) return Promise.resolve();
        return new Promise(resolve=>{
          img.addEventListener('load',resolve,{once:true});
          img.addEventListener('error',resolve,{once:true});
        });
      })));
    }
    return loads.get(element);
  }
  function updateDrift(){
    frame=0;
    if(!mobile.matches || reduced.matches) return;
    const height=window.innerHeight;
    photos.forEach(photo=>{
      const rect=photo.getBoundingClientRect();
      if(rect.bottom<0 || rect.top>height) return;
      const position=(height/2-(rect.top+rect.height/2))/(height/2+rect.height/2);
      const driftLimit=Math.min(12,rect.height*0.04);
      photo.style.setProperty('--pottery-drift',Math.max(-driftLimit,Math.min(driftLimit,position*driftLimit))+'px');
    });
  }
  function scheduleDrift(){
    if(!frame) frame=requestAnimationFrame(updateDrift);
  }
  const observer=new IntersectionObserver(entries=>{
    if(!mobile.matches) return;
    entries.forEach(entry=>{
      const element=entry.target;
      if(!entry.isIntersecting){
        visible.set(element,false);
        element.classList.remove('in','pottery-photo-active');
        return;
      }
      if(entry.intersectionRatio<0.22) return;
      visible.set(element,true);
      imagesReady(element).then(()=>{
        if(!mobile.matches || !visible.get(element)) return;
        // Commit the starting appearance before entering the animated state.
        requestAnimationFrame(()=>requestAnimationFrame(()=>{
          if(!mobile.matches || !visible.get(element)) return;
          element.classList.add('in');
          if(element.classList.contains('pottery-photo-reveal')) element.classList.add('pottery-photo-active');
        }));
      });
    });
    scheduleDrift();
  },{threshold:[0,0.22],rootMargin:'0px 0px -24px 0px'});

  function syncMode(){
    const leavingMobile=root.classList.contains('pottery-mobile-motion') && !mobile.matches;
    root.classList.toggle('pottery-mobile-motion',mobile.matches);
    observer.disconnect();
    visible.clear();
    targets.forEach(element=>{
      element.classList.remove('pottery-photo-active');
      if(mobile.matches){
        element.classList.remove('in');
        observer.observe(element);
      } else {
        if(leavingMobile) element.classList.add('in');
        element.style.removeProperty('--pottery-drift');
      }
    });
    scheduleDrift();
  }
  mobile.addEventListener('change',syncMode);
  reduced.addEventListener('change',scheduleDrift);
  window.addEventListener('scroll',scheduleDrift,{passive:true});
  window.addEventListener('resize',scheduleDrift,{passive:true});
  syncMode();
})();
