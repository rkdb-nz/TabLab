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
    requestAnimationFrame(updateCategoryArrows);
  }

  openers.forEach(button => button.addEventListener('click', () => openPanel(button.dataset.panel)));
  closers.forEach(button => button.addEventListener('click', closePanels));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closePanels(); });

  const categoryStrip = document.querySelector('.menu-tabs');
  const previousCategories = document.querySelector('.category-arrow--back');
  const nextCategories = document.querySelector('.category-arrow--next');
  function updateCategoryArrows() {
    if (!categoryStrip) return;
    previousCategories.disabled = categoryStrip.scrollLeft <= 2;
    nextCategories.disabled = categoryStrip.scrollLeft + categoryStrip.clientWidth >= categoryStrip.scrollWidth - 2;
  }
  function moveCategories(direction) {
    categoryStrip.scrollBy({left: direction * Math.max(120, categoryStrip.clientWidth * .8), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
  }
  previousCategories?.addEventListener('click', () => moveCategories(-1));
  nextCategories?.addEventListener('click', () => moveCategories(1));
  categoryStrip?.addEventListener('scroll', updateCategoryArrows, {passive:true});
  if (categoryStrip) new ResizeObserver(updateCategoryArrows).observe(categoryStrip);
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
