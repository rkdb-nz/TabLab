const scrim = document.querySelector('.scrim');
const panels = [...document.querySelectorAll('.side-panel')];
const background = [...document.querySelector('.page').children].filter(el => !el.matches('.side-panel, .scrim'));
let activePanel = null;
let opener = null;
function closePanels() {
  const previous = activePanel;
  activePanel = null;
  background.forEach(el => { el.inert = false; });
  if (opener?.isConnected) opener.focus({preventScroll: true});
  panels.forEach(panel => {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    panel.inert = true;
  });
  scrim.classList.remove('active');
  document.querySelectorAll('[data-panel]').forEach(button => button.setAttribute('aria-expanded', 'false'));
  if (previous) previous.scrollTop = 0;
}
function openPanel(id, trigger) {
  const panel = document.getElementById(id);
  if (!panel) return;
  opener = trigger;
  panels.forEach(other => { other.inert = other !== panel; });
  panel.inert = false;
  panel.removeAttribute('aria-hidden');
  panel.classList.add('open');
  activePanel = panel;
  panel.scrollTop = 0;
  panel.querySelector('.panel-close').focus({preventScroll: true});
  background.forEach(el => { el.inert = true; });
  scrim.classList.add('active');
  trigger.setAttribute('aria-expanded', 'true');
}
document.querySelectorAll('[data-panel]').forEach(button => {
  button.setAttribute('aria-controls', button.dataset.panel);
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-haspopup', 'dialog');
  button.addEventListener('click', () => openPanel(button.dataset.panel, button));
});
document.querySelectorAll('.panel-close').forEach(button => button.addEventListener('click', closePanels));
scrim.addEventListener('click', closePanels);
document.addEventListener('keydown', event => {
  if (!activePanel) return;
  if (event.key === 'Escape') { event.preventDefault(); closePanels(); }
  if (event.key === 'Tab') {
    const controls = [...activePanel.querySelectorAll('button, a[href], input, textarea, [tabindex="0"]')].filter(el => !el.disabled);
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
document.querySelectorAll('[data-demo-contact]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelector('.demo-result').textContent = button.dataset.demoContact === 'call'
      ? 'Demo only — no call has been placed.'
      : 'Demo only — no email has been created or sent.';
  });
});

/* Keep the fixed canvas within the visible viewport when browser tools magnify it. */
function fitVisibleHeight() {
  const scale = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
  document.querySelector('.page').style.setProperty('--produce-height', (window.innerHeight / scale) + 'px');
}
fitVisibleHeight();
window.addEventListener('resize', fitVisibleHeight);
new MutationObserver(fitVisibleHeight).observe(document.documentElement, {attributes: true, attributeFilter: ['style']});
