(() => {
  const stage = document.getElementById('stage');
  const overlays = [...document.querySelectorAll('.overlay')];
  const backgroundNodes = [...stage.children].filter(node => !node.classList.contains('overlay'));
  let lastTrigger = null;
  let activeOverlay = null;
  const navToggle = document.querySelector('.mobile-nav-toggle');

  function scaleStage() {
    stage.style.transform = "none";
  }

  function setBackgroundInactive(inactive) {
    backgroundNodes.forEach(node => {
      node.inert = inactive;
      if (inactive) {
        node.dataset.previousAriaHidden = node.getAttribute('aria-hidden') ?? '';
        node.setAttribute('aria-hidden', 'true');
      } else {
        const previous = node.dataset.previousAriaHidden;
        if (previous === '') node.removeAttribute('aria-hidden');
        else if (previous !== undefined) node.setAttribute('aria-hidden', previous);
        delete node.dataset.previousAriaHidden;
      }
    });
  }

  function closeAll({ restoreFocus = true } = {}) {
    overlays.forEach(o => o.hidden = true);
    document.body.classList.remove('overlay-open');
    setBackgroundInactive(false);
    activeOverlay = null;
    if (restoreFocus && lastTrigger?.isConnected) {
      const visible = lastTrigger.getClientRects().length && getComputedStyle(lastTrigger).visibility !== 'hidden';
      (visible ? lastTrigger : navToggle)?.focus({ preventScroll: true });
      lastTrigger = null;
    }
  }

  function openOverlay(name, trigger) {
    const overlay = document.getElementById(`overlay-${name}`);
    if (!overlay) return;
    const switchingFromDialog = trigger?.closest('.overlay');
    if (!activeOverlay || !switchingFromDialog) lastTrigger = trigger || document.activeElement;
    closeAll({ restoreFocus: false });
    overlay.hidden = false;
    activeOverlay = overlay;
    setBackgroundInactive(true);
    document.body.classList.add('overlay-open');
    overlay.querySelector('.overlay-close')?.focus({ preventScroll: true });
  }

  function trapFocus(event) {
    if (event.key !== 'Tab' || !activeOverlay) return;
    const focusable = [...activeOverlay.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    )].filter(element => !element.hidden && element.getClientRects().length);
    if (!focusable.length) {
      event.preventDefault();
      activeOverlay.focus({ preventScroll: true });
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus({ preventScroll: true });
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus({ preventScroll: true });
    } else if (!activeOverlay.contains(document.activeElement)) {
      event.preventDefault();
      first.focus({ preventScroll: true });
    }
  }

  document.addEventListener('click', e => {
    const toggleTrigger = e.target.closest('.mobile-nav-toggle');
    if (toggleTrigger) {
      const open = document.body.classList.toggle('mobile-nav-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    } else if (document.body.classList.contains('mobile-nav-open') && !e.target.closest('.hotspots')) {
      document.body.classList.remove('mobile-nav-open');
      navToggle?.setAttribute('aria-expanded', 'false');
      navToggle?.setAttribute('aria-label', 'Open menu');
    }
    const trigger = e.target.closest('[data-overlay]');
    if (trigger) {
      document.body.classList.remove('mobile-nav-open');
      navToggle?.setAttribute('aria-expanded', 'false');
      navToggle?.setAttribute('aria-label', 'Open menu');
      openOverlay(trigger.dataset.overlay, trigger);
    }
    if (e.target.closest('.overlay-close')) closeAll();
    if (e.target.classList.contains('overlay')) closeAll();
    if (e.target.closest('[data-open-book]')) openOverlay('book', e.target.closest('[data-open-book]'));
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && activeOverlay) closeAll();
    else if (e.key === 'Escape' && document.body.classList.contains('mobile-nav-open')) {
      document.body.classList.remove('mobile-nav-open');
      navToggle?.setAttribute('aria-expanded', 'false');
      navToggle?.setAttribute('aria-label', 'Open menu');
      navToggle?.focus({ preventScroll: true });
    }
    else trapFocus(e);
  });

  const bookingForm = document.getElementById('booking-form');
  const bookingDate = bookingForm?.querySelector('[name="date"]');
  function updateDateMinimum() {
    const today = new Date();
    const localDate = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
    if (bookingDate) bookingDate.min = localDate;
  }
  updateDateMinimum();
  bookingDate?.addEventListener('focus', updateDateMinimum);
  bookingForm?.addEventListener('click', e => {
    if (e.target.closest('[type="submit"]')) updateDateMinimum();
  });
  window.addEventListener('focus', updateDateMinimum);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) updateDateMinimum();
  });
  bookingForm?.addEventListener('submit', e => {
    e.preventDefault();
    updateDateMinimum();
    if (!e.currentTarget.reportValidity()) return;
    const status = e.currentTarget.querySelector('.form-status');
    status.textContent = 'Demo complete — no booking or message was sent.';
    e.currentTarget.querySelector('button[type="submit"]').disabled = true;
  });

  window.addEventListener('resize', scaleStage);
  scaleStage();
})();
