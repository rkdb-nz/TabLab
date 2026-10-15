(() => {
  const panels = [...document.querySelectorAll('.panel')];
  const scrim = document.querySelector('.scrim');
  const openers = document.querySelectorAll('[data-panel]');
  const closers = document.querySelectorAll('[data-close-panels]');

  function closePanels() {
    panels.forEach(panel => {
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
    });
    scrim.classList.remove('open');
    document.body.classList.remove('panel-open');
  }

  function openPanel(id) {
    closePanels();
    const panel = document.getElementById(id);
    if (!panel) return;
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    scrim.classList.add('open');
    document.body.classList.add('panel-open');
    panel.querySelector('.panel-close')?.focus();
  }

  openers.forEach(button => button.addEventListener('click', () => openPanel(button.dataset.panel)));
  closers.forEach(button => button.addEventListener('click', closePanels));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closePanels(); });

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
