(() => {
  const panels = [...document.querySelectorAll('.panel')];
  const shell = document.querySelector('.site-shell');
  const scrim = document.querySelector('.scrim');
  let activePanel = null;
  let returnFocus = null;
  const focusable = panel => [...panel.querySelectorAll('button,a[href],input,textarea,select,[tabindex="0"]')]
    .filter(el => !el.disabled && el.getClientRects().length && !el.closest('[hidden]'));

  function closePanels(restoreFocus = true) {
    panels.forEach(panel => {
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
      panel.inert = true;
    });
    activePanel = null;
    shell.inert = false;
    scrim.classList.remove('open');
    document.body.classList.remove('panel-open');
    if (restoreFocus && returnFocus?.isConnected && !returnFocus.closest('[inert]')) returnFocus.focus();
  }

  function openPanel(id, opener) {
    // A contact action can originate inside Find Us. Restore that panel on return.
    const previousPanel = activePanel;
    const previousReturn = returnFocus;
    closePanels(false);
    const panel = document.getElementById(id);
    if (!panel) return;
    returnFocus = opener || document.activeElement;
    panel._previous = previousPanel && previousPanel !== panel ? { panel: previousPanel, opener: returnFocus, returnFocus: previousReturn } : null;
    activePanel = panel;
    shell.inert = true;
    panel.inert = false;
    panel.setAttribute('aria-hidden', 'false');
    panel.classList.add('open');
    scrim.classList.add('open');
    document.body.classList.add('panel-open');
    panel.querySelector('.panel-close')?.focus();
  }

  function dismiss() {
    const previous = activePanel?._previous;
    closePanels(!previous);
    if (previous) {
      openPanel(previous.panel.id, previous.returnFocus);
      previous.opener.focus();
    }
  }

  document.querySelectorAll('[data-panel]').forEach(button => button.addEventListener('click', () => openPanel(button.dataset.panel, button)));
  document.querySelectorAll('[data-close-panels]').forEach(button => button.addEventListener('click', dismiss));
  document.addEventListener('keydown', event => {
    if (!activePanel) return;
    if (event.key === 'Escape') { event.preventDefault(); dismiss(); }
    if (event.key === 'Tab') {
      const items = focusable(activePanel);
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || !items.includes(document.activeElement))) {
        event.preventDefault(); last?.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !items.includes(document.activeElement))) {
        event.preventDefault(); first?.focus();
      }
    }
  });

  const tabs = [...document.querySelectorAll('.menu-tab')];
  const categoryPanels = [...document.querySelectorAll('[data-category-panel]')];
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(item => {
      item.classList.toggle('active', item === tab);
      item.setAttribute('aria-pressed', String(item === tab));
    });
    categoryPanels.forEach(panel => panel.classList.toggle('active', panel.dataset.categoryPanel === tab.dataset.category));
    document.querySelector('.menu-panel')?.scrollTo({ top: 0, behavior: 'smooth' });
  }));

  const ticker = document.querySelector('.ticker');
  const tickerToggle = document.querySelector('.ticker-toggle');
  tickerToggle.addEventListener('click', () => {
    const paused = ticker.classList.toggle('is-paused');
    tickerToggle.setAttribute('aria-pressed', String(paused));
    tickerToggle.textContent = paused ? 'Play ticker' : 'Pause ticker';
  });

  const status = document.querySelector('.demo-status');
  const titles = { call: 'Call the diner', email: 'Email the diner', directions: 'Get directions' };
  document.querySelectorAll('[data-demo-action]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    const action = link.dataset.demoAction;
    document.querySelectorAll('[data-contact-step]').forEach(step => { step.hidden = step.dataset.contactStep !== action; });
    document.getElementById('contact-title').textContent = titles[action];
    status.hidden = true;
    status.textContent = '';
    openPanel('contact-panel', link);
  }));
  function complete(action) {
    const messages = {
      call: 'Demo only — no call has been placed. This is an example phone number.',
      email: 'Demo only — no enquiry has been sent. Your details have not been saved or transmitted.',
      directions: 'Demo only — this diner and its address are fictional. No real directions have been opened.'
    };
    status.textContent = messages[action];
    status.hidden = false;
    status.focus();
    status.scrollIntoView({ block: 'nearest' });
  }
  document.querySelectorAll('[data-demo-complete]').forEach(button => button.addEventListener('click', () => complete(button.dataset.demoComplete)));
  document.querySelector('.enquiry-form').addEventListener('submit', event => {
    event.preventDefault();
    complete('email');
  });
})();
