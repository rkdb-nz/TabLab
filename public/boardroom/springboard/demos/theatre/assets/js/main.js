
(function(){
  const btn = document.getElementById('menuBtn');
  const panel = document.getElementById('mobilePanel');
  let lastFocus = null;
  let inerted=[];
  function containOverlay(overlay, open){
    if(open){
      inerted=Array.from(document.body.children).filter(el=>el!==overlay&&!el.contains(overlay)&&!el.inert);
      inerted.forEach(el=>el.inert=true);document.body.classList.add('overlay-open');
    }else{inerted.forEach(el=>el.inert=false);inerted=[];document.body.classList.remove('overlay-open');}
  }
  if(panel){
    const close=document.createElement('button');close.type='button';close.className='btn';close.textContent='Close menu';
    close.addEventListener('click',closeMenu);panel.prepend(close);
  }
  function openMenu(){
    if(!panel) return;
    lastFocus = document.activeElement;
    panel.classList.add('open');
    panel.style.display='flex';
    containOverlay(panel,true);
    btn.setAttribute('aria-expanded','true');
    const first = panel.querySelector('button,a'); if(first) first.focus();
    document.addEventListener('keydown', onKey);
  }
  function closeMenu(){
    if(!panel) return;
    panel.classList.remove('open');
    panel.style.display='none';
    containOverlay(panel,false);
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
    let paused=false;
    const pause=document.getElementById('sequencePause');
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
      if(paused || reduceMotion.matches)return;
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

    if(pause)pause.addEventListener('click',function(){
      paused=!paused;clearTimers();showOnly(currentIndex);
      pause.setAttribute('aria-pressed',String(paused));pause.textContent=paused?'Resume slideshow':'Pause slideshow';
      if(!paused)runStep();
    });
    function syncMotionPreference(){
      if(pause)pause.hidden=reduceMotion.matches;
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

  document.querySelectorAll('a[href="clementine-street.html#email"]').forEach(function(link){
    link.addEventListener('click',function(e){e.preventDefault();openEmail();});
  });
  function openEmail(){
    const dialog=document.createElement('dialog');dialog.className='demo-email-dialog';
    dialog.setAttribute('aria-labelledby','demoEmailTitle');
    dialog.innerHTML='<h2 id="demoEmailTitle">Email Clementine Street Theatre</h2><form><p>To: clementinesttheatre@rkdb.nz</p><label>Your email<input type="email" required autocomplete="email"></label><label>Subject<input required></label><label>Message<textarea required rows="5"></textarea></label><button class="btn btn-primary" type="submit">Send email</button><button class="btn" type="button" data-close>Cancel</button></form><div hidden tabindex="-1" data-result><h3>Demo complete</h3><p>This is a demonstration. No email has been sent.</p><button class="btn" type="button" data-close>Close</button></div>';
    const previous=document.activeElement;document.body.append(dialog);
    dialog.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click',()=>dialog.close()));
    dialog.querySelector('form').addEventListener('submit',function(e){e.preventDefault();this.hidden=true;const result=dialog.querySelector('[data-result]');result.hidden=false;result.focus();});
    dialog.addEventListener('close',function(){dialog.remove();previous.focus();});dialog.showModal();
  }
  if(location.hash==='#email')openEmail();

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

  if(posterTriggers.length && lightbox && lightboxImage && lightboxClose){
    function closeLightbox(){
      lightbox.hidden = true;
      lightbox.setAttribute('aria-hidden', 'true');
      lightboxImage.src = '';
      lightboxImage.alt = '';
      containOverlay(lightbox,false);
      document.removeEventListener('keydown', onLightboxKeydown);
      if(lastPosterTrigger){
        lastPosterTrigger.focus();
      }
    }

    function onLightboxKeydown(e){
      if(e.key==='Tab'){e.preventDefault();lightboxClose.focus();}
      if(e.key === 'Escape'){
        closeLightbox();
      }
    }

    function openLightbox(trigger){
      const posterImage = trigger.querySelector('img');
      if(!posterImage) return;

      lastPosterTrigger = trigger;
      lightboxImage.src = posterImage.currentSrc || posterImage.src;
      lightboxImage.alt = posterImage.alt;
      lightbox.hidden = false;
      lightbox.setAttribute('aria-hidden', 'false');
      containOverlay(lightbox,true);
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

