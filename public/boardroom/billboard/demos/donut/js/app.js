(() => {
  const site = document.getElementById('site');
  const triggers = [...document.querySelectorAll('[data-overlay]')];
  const overlays = [...document.querySelectorAll('.overlay')];
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenuPanel = document.getElementById('mobile-menu-panel');
  let lastTrigger = null;
  let closeTimer = null;
  let openTimer = null;
  const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const background = [...site.children].filter(el => !el.classList.contains('overlay'));
  const isVisible = el => el && !el.closest('[hidden],[inert]') && el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden';
  function restoreTriggerFocus() {
    const target = isVisible(lastTrigger) ? lastTrigger :
      isVisible(mobileMenuToggle) ? mobileMenuToggle :
      triggers.find(el => el.dataset.overlay === lastTrigger?.dataset.overlay && isVisible(el));
    target?.focus();
  }

  function closeMobileMenu() {
    if (!mobileMenuToggle || !mobileMenuPanel) return;
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mobileMenuToggle.setAttribute('aria-label', 'Open menu');
    mobileMenuPanel.hidden = true;
  }

  function toggleMobileMenu() {
    if (!mobileMenuToggle || !mobileMenuPanel) return;
    const opening = mobileMenuToggle.getAttribute('aria-expanded') !== 'true';
    mobileMenuToggle.setAttribute('aria-expanded', String(opening));
    mobileMenuToggle.setAttribute('aria-label', opening ? 'Close menu' : 'Open menu');
    mobileMenuPanel.hidden = !opening;
  }

  function resetOverlay(overlay) {
    overlay.classList.remove('is-opening', 'is-open', 'is-closing');
  }

  function hideImmediately(overlay) {
    resetOverlay(overlay);
    overlay.hidden = true;
  }

  function openOverlay(name, trigger) {
    const overlay = document.getElementById(`overlay-${name}`);
    if (!overlay) return;

    closeMobileMenu();
    clearTimeout(closeTimer);
    clearTimeout(openTimer);
    overlays.forEach(other => {
      if (other !== overlay) hideImmediately(other);
    });

    lastTrigger = trigger;
    resetOverlay(overlay);
    overlay.hidden = false;
    overlay.querySelector('.overlay-content').scrollTop = 0;
    overlay.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
      delete img.dataset.src;
    });
    background.forEach(el => { el.inert = true; });
    document.body.classList.add('overlay-open');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.classList.add('is-opening');
        openTimer = setTimeout(() => {
          if (overlay.hidden || overlay.classList.contains('is-closing')) return;
          overlay.classList.remove('is-opening');
          overlay.classList.add('is-open');
          overlay.querySelector('.overlay-close')?.focus();
        }, reducedMotion() ? 0 : 620);
      });
    });
  }

  function closeAll(restoreFocus = true) {
    const active = overlays.find(overlay => !overlay.hidden);
    if (!active) {
      document.body.classList.remove('overlay-open');
      return;
    }

    clearTimeout(closeTimer);
    clearTimeout(openTimer);
    active.classList.remove('is-opening', 'is-open');
    active.classList.add('is-closing');
    document.body.classList.remove('overlay-open');

    closeTimer = setTimeout(() => {
      hideImmediately(active);
      background.forEach(el => { el.inert = false; });
      if (restoreFocus) restoreTriggerFocus();
    }, reducedMotion() ? 0 : 500);
  }

  mobileMenuToggle?.addEventListener('click', toggleMobileMenu);

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => openOverlay(trigger.dataset.overlay, trigger));
  });

  overlays.forEach(overlay => {
    overlay.addEventListener('click', event => {
      if (event.target === overlay) closeAll();
    });

    const close = overlay.querySelector('.overlay-close');
    if (close) {
      close.textContent = 'Back to site';
      close.addEventListener('click', () => closeAll());
    }
  });

  document.addEventListener('click', event => {
    if (!mobileMenuPanel || mobileMenuPanel.hidden) return;
    if (mobileMenuPanel.contains(event.target) || mobileMenuToggle?.contains(event.target)) return;
    closeMobileMenu();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (mobileMenuPanel && !mobileMenuPanel.hidden) {
        closeMobileMenu();
        mobileMenuToggle?.focus();
        return;
      }
      closeAll();
      return;
    }
    if (event.key !== 'Tab') return;
    const active = overlays.find(overlay => !overlay.hidden);
    if (!active) return;
    const focusable = [...active.querySelectorAll('button,input,select,textarea,[href],[tabindex]:not([tabindex="-1"])')]
      .filter(el => !el.disabled && el.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  document.getElementById('catering-enquiry')?.addEventListener('click', event => {
    const form = document.getElementById('catering-form');
    form.hidden = false;
    event.currentTarget.setAttribute('aria-expanded', 'true');
    form.querySelector('input').focus();
  });

  document.getElementById('catering-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const status = event.currentTarget.querySelector('.form-status');
    status.textContent = 'Demo only — no enquiry has been sent.';
    status.focus();
  });

  document.getElementById('order-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const status = event.currentTarget.querySelector('.form-status');
    status.textContent = 'Demo complete — no order request has been sent, no order has been placed and no reply will follow.';
    status.focus();
  });

  site.querySelector('.brand')?.addEventListener('click', event => {
    event.preventDefault();
    closeMobileMenu();
    closeAll(false);
  });
})();
