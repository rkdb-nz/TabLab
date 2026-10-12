
(function(){
  const btn = document.getElementById('menuBtn');
  const panel = document.getElementById('mobilePanel');
  let lastFocus = null;
  function openMenu(){
    if(!panel) return;
    lastFocus = document.activeElement;
    panel.classList.add('open');
    panel.style.display='flex';
    document.body.style.overflow='hidden';
    btn.setAttribute('aria-expanded','true');
    const first = panel.querySelector('a'); if(first) first.focus();
    document.addEventListener('keydown', onKey);
  }
  function closeMenu(){
    if(!panel) return;
    panel.classList.remove('open');
    panel.style.display='none';
    document.body.style.overflow='';
    btn.setAttribute('aria-expanded','false');
    if(lastFocus) lastFocus.focus();
    document.removeEventListener('keydown', onKey);
  }
  function onKey(e){
    if(e.key==='Escape'){ closeMenu(); }
    if(e.key==='Tab' && panel){
      const focusable = panel.querySelectorAll('a,button');
      if(!focusable.length) return;
      const first=focusable[0], last=focusable[focusable.length-1];
      if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
    }
  }
  if(btn && panel){
    btn.addEventListener('click', function(){ panel.classList.contains('open') ? closeMenu() : openMenu(); });
    panel.addEventListener('click', function(e){ if(e.target===panel) closeMenu(); });
    panel.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeMenu); });
  }

  // Homepage cinematic crossfade sequence
  const sequenceRoot = document.querySelector('[data-home-sequence]');
  if(sequenceRoot){
    const frames = Array.from(sequenceRoot.querySelectorAll('.home-hero-image'));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let currentIndex = 0;
    let holdTimer = null;
    let fadeTimer = null;
    const steps = [
      { hold: 2400, fade: 7000 },
      { hold: 4000, fade: 3200 },
      { hold: 2800, fade: 3200 },
      { hold: 2800, fade: 3200 },
      { hold: 2800, fade: 3200 }
    ];

    function clearTimers(){
      if(holdTimer){ clearTimeout(holdTimer); holdTimer = null; }
      if(fadeTimer){ clearTimeout(fadeTimer); fadeTimer = null; }
    }

    function showOnly(index){
      frames.forEach(function(frame, i){
        frame.style.transitionDuration = '0ms';
        frame.classList.toggle('is-active', i===index);
      });
    }

    function fadeTo(nextIndex, duration){
      frames[nextIndex].style.transitionDuration = duration + 'ms';
      frames[currentIndex].style.transitionDuration = duration + 'ms';
      frames[nextIndex].classList.add('is-active');
      frames[currentIndex].classList.remove('is-active');
      currentIndex = nextIndex;
    }

    function runStep(){
      const step = steps[currentIndex % steps.length];
      holdTimer = setTimeout(function(){
        const nextIndex = (currentIndex + 1) % frames.length;
        fadeTo(nextIndex, step.fade);
        fadeTimer = setTimeout(runStep, step.fade);
      }, step.hold);
    }

    function startSequence(){
      clearTimers();
      currentIndex = 0;
      showOnly(0);
      runStep();
    }

    function setReducedMotionStatic(){
      clearTimers();
      const nightIndex = Math.max(frames.findIndex(function(frame){
        return frame.getAttribute('data-seq') === 'hero-exterior2';
      }), 0);
      currentIndex = nightIndex;
      showOnly(nightIndex);
    }

    function syncMotionPreference(){
      if(reduceMotion.matches){
        setReducedMotionStatic();
      } else {
        startSequence();
      }
    }

    syncMotionPreference();
    if(typeof reduceMotion.addEventListener === 'function'){
      reduceMotion.addEventListener('change', syncMotionPreference);
    } else if(typeof reduceMotion.addListener === 'function'){
      reduceMotion.addListener(syncMotionPreference);
    }
  }

  // Clementine Street hash routing
  const clemNav = document.querySelector('.clem-nav');
  if(clemNav){
    const tabBtns = Array.from(clemNav.querySelectorAll('[data-panel]'));
    const sections = Array.from(document.querySelectorAll('[data-section]'));
    const clemMain = document.querySelector('.clem-main');
    function activate(id, push){
      const target = id.replace(/^#/, '') || 'theatre';
      const validIds = sections.map(s=>s.id);
      const finalId = validIds.includes(target) ? target : 'theatre';
      tabBtns.forEach(function(b){
        const isSel = b.dataset.panel===finalId;
        b.setAttribute('aria-selected', isSel ? 'true' : 'false');
        b.setAttribute('tabindex', isSel ? '0' : '-1');
      });
      sections.forEach(function(s){
        s.hidden = s.id!==finalId;
      });
      if(clemMain){
        clemMain.setAttribute('data-active-panel', finalId);
      }
      if(push){
        const newUrl = window.location.pathname + '#' + finalId;
        if(window.location.hash !== '#'+finalId){
          history.pushState(null,'',newUrl);
        }
      } else {
        if(window.location.hash !== '#'+finalId){
          history.replaceState(null,'',window.location.pathname + '#' + finalId);
        }
      }
    }
    tabBtns.forEach(function(b){
      b.addEventListener('click', function(){
        activate(b.dataset.panel, true);
      });
      b.addEventListener('keydown', function(e){
        const idx = tabBtns.indexOf(b);
        if(e.key==='ArrowRight' || e.key==='ArrowDown'){
          e.preventDefault();
          const next = tabBtns[(idx+1)%tabBtns.length];
          next.focus(); activate(next.dataset.panel, true);
        } else if(e.key==='ArrowLeft' || e.key==='ArrowUp'){
          e.preventDefault();
          const prev = tabBtns[(idx-1+tabBtns.length)%tabBtns.length];
          prev.focus(); activate(prev.dataset.panel, true);
        }
      });
    });
    // initial from hash
    const initialHash = window.location.hash || '#theatre';
    activate(initialHash, false);
    window.addEventListener('popstate', function(){
      activate(window.location.hash || '#theatre', false);
    });
    window.addEventListener('hashchange', function(){
      activate(window.location.hash || '#theatre', false);
    });
  }

  // Now Playing tabs keyboard
  const npTabs = document.querySelectorAll('.np-tabs [role="tab"]');
  if(npTabs.length){
    npTabs.forEach(function(tab){
      tab.addEventListener('click', function(){
        const target = tab.dataset.tab;
        npTabs.forEach(function(t){ t.setAttribute('aria-selected','false'); t.setAttribute('tabindex','-1'); });
        tab.setAttribute('aria-selected','true'); tab.setAttribute('tabindex','0');
        document.querySelectorAll('[data-pane]').forEach(function(p){ p.hidden = p.dataset.pane!==target; });
      });
      tab.addEventListener('keydown', function(e){
        const tabsArr = Array.from(npTabs);
        const idx = tabsArr.indexOf(tab);
        if(e.key==='ArrowRight'){
          e.preventDefault();
          const next = tabsArr[(idx+1)%tabsArr.length];
          next.focus(); next.click();
        } else if(e.key==='ArrowLeft'){
          e.preventDefault();
          const prev = tabsArr[(idx-1+tabsArr.length)%tabsArr.length];
          prev.focus(); prev.click();
        }
      });
    });
  }

  // Coming Soon hover
  document.querySelectorAll('.cs-prod').forEach(function(p){
    p.addEventListener('mouseenter',function(){document.querySelectorAll('.cs-prod').forEach(function(x){x.classList.remove('active');});p.classList.add('active');});
    p.addEventListener('focusin',function(){document.querySelectorAll('.cs-prod').forEach(function(x){x.classList.remove('active');});p.classList.add('active');});
  });

  // Coming Soon poster lightbox
  const posterTriggers = document.querySelectorAll('.cs-poster-trigger');
  const lightbox = document.getElementById('csLightbox');
  const lightboxImage = document.getElementById('csLightboxImage');
  const lightboxClose = document.getElementById('csLightboxClose');
  let lastPosterTrigger = null;
  let posterBackground = [];
  let posterOverflow = '';
  function setPosterBackgroundInert(){
    posterBackground = [];
    let branch = lightbox;
    while(branch && branch !== document.body){
      Array.from(branch.parentElement.children).forEach(function(sibling){
        if(sibling !== branch && !['SCRIPT','STYLE','LINK'].includes(sibling.tagName)){
          posterBackground.push([sibling, sibling.inert]);
          sibling.inert = true;
        }
      });
      branch = branch.parentElement;
    }
  }

  if(posterTriggers.length && lightbox && lightboxImage && lightboxClose){
    function closeLightbox(){
      lightbox.hidden = true;
      lightbox.setAttribute('aria-hidden', 'true');
      lightboxImage.src = '';
      lightboxImage.alt = '';
      document.body.style.overflow = posterOverflow;
      posterBackground.forEach(function(entry){ entry[0].inert = entry[1]; });
      posterBackground = [];
      document.removeEventListener('keydown', onLightboxKeydown);
      if(lastPosterTrigger){
        lastPosterTrigger.focus();
      }
    }

    function onLightboxKeydown(e){
      if(e.key === 'Escape'){
        e.preventDefault();
        closeLightbox();
      } else if(e.key === 'Tab'){
        e.preventDefault();
        lightboxClose.focus();
      }
    }

    function openLightbox(trigger){
      const posterImage = trigger.querySelector('img');
      if(!posterImage) return;

      lastPosterTrigger = trigger;
      posterOverflow = document.body.style.overflow;
      setPosterBackgroundInert();
      lightboxImage.src = posterImage.currentSrc || posterImage.src;
      lightboxImage.alt = posterImage.alt;
      lightbox.hidden = false;
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      lightboxClose.focus();
      document.addEventListener('keydown', onLightboxKeydown);
    }

    posterTriggers.forEach(function(trigger){
      trigger.addEventListener('click', function(){
        openLightbox(trigger);
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e){
      if(e.target === lightbox){
        closeLightbox();
      }
    });
  }
})();
