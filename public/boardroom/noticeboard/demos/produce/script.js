const boardZone = document.querySelector('.board-zone');
const scrim = document.querySelector('.scrim');
const panels = document.querySelectorAll('.side-panel');

let panelOpener = null;
panels.forEach(panel => { panel.inert = true; });

function closePanels(restoreFocus = true) {
  const wasOpen = [...panels].some(panel => panel.classList.contains('open'));
  panels.forEach((panel) => {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    panel.inert = true;
  });
  scrim.classList.remove('active');
  if (restoreFocus && wasOpen && panelOpener) panelOpener.focus();
}

function openPanel(id) {
  closePanels(false);
  panelOpener = document.activeElement;
  const panel = document.getElementById(id);
  if (!panel) return;
  panel.classList.add('open');
  panel.setAttribute('aria-hidden', 'false');
  panel.inert = false;
  panel.querySelector('.panel-close')?.focus();
  scrim.classList.add('active');
}

boardZone.addEventListener('click', () => {
  boardZone.classList.toggle('active');
});

boardZone.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    boardZone.classList.toggle('active');
  }
});

document.querySelectorAll('[data-panel]').forEach((button) => {
  button.addEventListener('click', () => openPanel(button.dataset.panel));
});

document.querySelectorAll('.panel-close').forEach((button) => {
  button.addEventListener('click', () => closePanels());
});

scrim.addEventListener('click', () => closePanels());

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closePanels();
    if (event.key === 'Tab') {
      const active = [...panels].find(panel => panel.classList.contains('open'));
      if (!active) return;
      const items = [...active.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(el => !el.disabled && el.offsetParent !== null);
      const first = items[0], last = items[items.length - 1];
      if (!first) return;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
});
