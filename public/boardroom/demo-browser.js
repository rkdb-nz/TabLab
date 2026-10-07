(() => {
  const oldBack = document.querySelector('.foundry-global-back');
  if (!oldBack) return;
  // Replace the history listener: this always leaves the example, including
  // after visitors follow links within a multi-page iframe.
  const back = oldBack.cloneNode(true);
  back.setAttribute('aria-label', 'Back to gallery');
  back.title = 'Back to gallery';
  back.innerHTML = '<span aria-hidden="true">←</span><span>Back to gallery</span>';
  oldBack.replaceWith(back);
  back.addEventListener('click', () => { location.href = '../../index.html'; });

  const viewport = document.querySelector('.demo-browser-content');
  const fullScreen = document.createElement('button');
  fullScreen.type = 'button';
  fullScreen.className = 'foundry-global-control demo-fullscreen';
  fullScreen.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3H3v6M15 3h6v6M3 15v6h6M21 15v6h-6"/></svg><span>Full screen</span>';
  fullScreen.setAttribute('aria-label', 'Open example in full screen');
  back.after(fullScreen);

  const exit = document.createElement('button');
  exit.type = 'button';
  exit.className = 'demo-fullscreen-return';
  exit.textContent = 'Tab Lab';
  exit.title = 'Return to Tab Lab frame';
  exit.setAttribute('aria-label', 'Exit full screen and return to Tab Lab frame');
  exit.hidden = true;
  viewport.append(exit);

  const sync = () => {
    const active = document.fullscreenElement === viewport;
    exit.hidden = !active;
    if (active) exit.focus({ preventScroll: true });
    else fullScreen.focus({ preventScroll: true });
  };
  const status = document.createElement('span');
  status.className = 'demo-fullscreen-status';
  status.setAttribute('role', 'status');
  document.body.append(status);
  if (!document.fullscreenEnabled || !viewport.requestFullscreen) fullScreen.hidden = true;
  fullScreen.addEventListener('click', async () => {
    try {
      status.textContent = '';
      await viewport.requestFullscreen();
    } catch {
      status.textContent = 'Full screen is unavailable in this browser.';
    }
  });
  exit.addEventListener('click', async () => {
    if (document.fullscreenElement === viewport) await document.exitFullscreen();
  });
  document.addEventListener('fullscreenchange', sync);
})();
