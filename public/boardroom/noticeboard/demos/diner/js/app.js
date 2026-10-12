(() => {
  const panels = [...document.querySelectorAll('.panel')];
  const scrim = document.querySelector('.scrim');
  const openers = document.querySelectorAll('[data-panel]');
  const closers = document.querySelectorAll('[data-close-panels]');

  let panelOpener = null;
  panels.forEach(panel => { panel.inert = true; });

  function closePanels(restoreFocus = true) {
  const wasOpen = [...panels].some(panel => panel.classList.contains('open'));
    panels.forEach(panel => {
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
      panel.inert = true;
    });
    scrim.classList.remove('open');
    if (restoreFocus && wasOpen && panelOpener) panelOpener.focus();
    document.body.classList.remove('panel-open');
  }

  function openPanel(id) {
    closePanels(false);
    panelOpener = document.activeElement;
    const panel = document.getElementById(id);
    if (!panel) return;
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    panel.inert = false;
    scrim.classList.add('open');
    document.body.classList.add('panel-open');
    panel.querySelector('.panel-close')?.focus();
  }

  openers.forEach(button => button.addEventListener('click', () => openPanel(button.dataset.panel)));
  closers.forEach(button => button.addEventListener('click', () => closePanels()));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closePanels();
    if (event.key === 'Tab') {
      const active = [...panels].find(panel => panel.classList.contains('open'));
      if (!active) return;
      const items = [...active.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(el => !el.disabled && el.offsetParent !== null);
      const first = items[0], last = items[items.length - 1];
      if (!first) return;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    } });

  const tabs = [...document.querySelectorAll('.menu-tab')];
  const categoryPanels = [...document.querySelectorAll('[data-category-panel]')];
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.dataset.category;
      tabs.forEach(item => item.classList.toggle('active', item === tab));
      categoryPanels.forEach(panel => panel.classList.toggle('active', panel.dataset.categoryPanel === category));
      document.querySelector('.menu-panel')?.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
})();
