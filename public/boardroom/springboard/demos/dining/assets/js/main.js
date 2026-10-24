
// Nav show/hide on home
const nav = document.querySelector('.nav');
const hero = document.querySelector('.hero');
function setNavHidden(hidden) {
  if (!nav) return;
  nav.classList.toggle('hidden', hidden);
  nav.inert = hidden;
  nav.setAttribute('aria-hidden', String(hidden));
}
if(hero && nav){
  setNavHidden(true);
}
// Trifold scroll
const wrap = document.querySelector('.trifold-wrap');
const mobileLanding = window.matchMedia("(max-width:700px) and (orientation:portrait), (max-width:1000px) and (orientation:landscape)");
if(wrap && !mobileLanding.matches){
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
        setNavHidden(false);
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
// FAQ buttons work with pointer, Enter and Space.
document.querySelectorAll('.faq-q').forEach(button => {
  button.addEventListener('click', () => {
    const answer = document.getElementById(button.getAttribute('aria-controls'));
    if (!answer) return;
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    answer.hidden = !open;
    button.querySelector('span').textContent = open ? '−' : '+';
  });
});

// Requests stay in this browser; final confirmation clearly identifies the demo.
(() => {
  const dialog = document.querySelector('#booking-confirmation');
  if (!dialog) return;
  const emailDialog = document.querySelector('#booking-email');
  const emailButton = document.querySelector('#open-email-request');
  let opener;
  emailButton?.addEventListener('click', () => {
    emailDialog.classList.add('is-open');
    emailDialog.showModal();
  });
  emailDialog?.querySelector('.email-cancel').addEventListener('click', () => emailDialog.close());
  emailDialog?.addEventListener('close', () => {
    emailDialog.classList.remove('is-open');
    emailButton?.focus({preventScroll:true});
  });
  document.querySelectorAll('.booking-form').forEach(form => {
    const date = form.elements.date;
    const name = form.elements.name;
    const now = new Date();
    date.min = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
    function validate() {
      name.setCustomValidity(name.value.trim() ? '' : 'Please enter your name.');
      date.setCustomValidity('');
      if (date.value) {
        const day = new Date(date.value + 'T12:00:00').getDay();
        if (day === 1 || day === 2) date.setCustomValidity('Please choose a date from Wednesday to Sunday.');
      }
    }
    form.addEventListener('input', validate);
    form.addEventListener('submit', event => {
      event.preventDefault();
      validate();
      if (!form.reportValidity()) return;
      const isEmail = form.id === 'email-request-form';
      opener = isEmail ? emailButton : form.querySelector('[type="submit"]');
      if (isEmail) emailDialog.close();
      dialog.classList.add('is-open');
      dialog.showModal();
    });
  });
  // Keep keyboard focus inside the active dialog, including inside the demo iframe.
  document.querySelectorAll('dialog').forEach(modal => {
    modal.addEventListener('keydown', event => {
      if (event.key !== 'Tab' || !modal.open) return;
      const controls = [...modal.querySelectorAll('button,input,select,textarea,a[href],[tabindex]')]
        .filter(element => !element.disabled && element.tabIndex >= 0 && element.getClientRects().length);
      const first = controls[0], last = controls[controls.length - 1];
      if (!first) { event.preventDefault(); return; }
      if (event.shiftKey && (document.activeElement === first || !modal.contains(document.activeElement))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !modal.contains(document.activeElement))) {
        event.preventDefault(); first.focus();
      }
    });
  });
  dialog.querySelector('.booking-confirmation-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    dialog.classList.remove('is-open');
    opener?.focus({preventScroll:true});
  });
})();

// Home cards: finish the image crossfade before opening the selected page.
(() => {
  const panels = document.querySelectorAll('.home-page .panel[data-href]');
  if (!panels.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const navigationDelay = reducedMotion ? 0 : 1050;
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
    }, navigationDelay);
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

// Mobile landing: a deliberate swipe glides between two complete screens.
(() => {
  const track = document.querySelector('.home-track');
  if (!track) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let scene = 0, moving = false, touch = null, revealTimer, settleTimer, lastSwipe = 0;
  function revealAfterRest() {
    moving = false;
    clearTimeout(revealTimer);
    if (scene === 1) revealTimer = setTimeout(() => {
      if (mobileLanding.matches && scene === 1) wrap.classList.add('cards-revealed');
    }, reducedMotion.matches ? 0 : 2000);
  }
  function go(next) {
    if (!mobileLanding.matches || moving || next === scene || next < 0 || next > 1) return;
    scene = next;
    moving = true;
    clearTimeout(revealTimer);
    clearTimeout(settleTimer);
    wrap.classList.remove('cards-revealed');
    // Match pottery: set the glide explicitly for every scene change.
    track.style.transition = reducedMotion.matches ? 'none' : 'transform 1.5s cubic-bezier(.65,0,.35,1)';
    track.classList.toggle('show-cards', scene === 1);
    setNavHidden(scene === 0);
    hero.inert = scene !== 0;
    wrap.inert = scene !== 1;
    // The timer starts only after the glide has finished.
    settleTimer = setTimeout(revealAfterRest, reducedMotion.matches ? 0 : 1500);
  }
  track.addEventListener('touchstart', event => {
    touch = event.touches.length === 1 ? {x:event.touches[0].clientX,y:event.touches[0].clientY} : null;
  }, {passive:true});
  track.addEventListener('touchend', event => {
    if (!touch || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - touch.x;
    const dy = event.changedTouches[0].clientY - touch.y;
    touch = null;
    if (Math.abs(dy) > 48 && Math.abs(dy) > Math.abs(dx) * 1.2) {
      lastSwipe = Date.now();
      go(scene + (dy < 0 ? 1 : -1));
    }
  }, {passive:true});
  track.addEventListener('click', event => {
    if (mobileLanding.matches && Date.now() - lastSwipe < 400) {event.preventDefault();event.stopImmediatePropagation();}
  }, true);
  track.addEventListener('touchcancel', () => {touch = null;}, {passive:true});
  window.addEventListener('wheel', event => {
    if (Math.abs(event.deltaY) > 35) go(scene + (event.deltaY > 0 ? 1 : -1));
  }, {passive:true});
  document.addEventListener('keydown', event => {
    if (!mobileLanding.matches || event.target.closest('a,button,[role="button"]')) return;
    if (['ArrowDown','PageDown',' '].includes(event.key)) {event.preventDefault();go(1);}
    if (['ArrowUp','PageUp'].includes(event.key)) {event.preventDefault();go(0);}
  });
  // Reinitialise the original desktop observer when crossing the breakpoint.
  mobileLanding.addEventListener('change', () => location.reload());
  if (mobileLanding.matches) wrap.inert = true;
})();

// Restaurant mobile navigation: keep the links above the page content.
(() => {
  const toggle = document.querySelector('.mobile-toggle');
  const links = document.querySelector('.nav-links');
  if (!nav || !toggle || !links) return;
  links.id = 'restaurant-navigation';
  toggle.type = 'button';
  toggle.textContent = '☰';
  toggle.setAttribute('aria-controls', links.id);
  const setOpen = open => {
    nav.classList.toggle('mobile-menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close restaurant menu' : 'Open restaurant menu');
    toggle.textContent = open ? '×' : '☰';
  };
  setOpen(false);
  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('mobile-menu-open')));
  links.addEventListener('click', () => setOpen(false));
  document.addEventListener('click', event => {if (!nav.contains(event.target)) setOpen(false);});
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('mobile-menu-open')) {
      setOpen(false);
      toggle.focus();
    }
  });
})();
