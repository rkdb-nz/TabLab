/* Mobile demo selection uses the original tap for native fullscreen where allowed. */
(() => {
  const mobile = matchMedia('(max-width: 980px)');
  let active = null;

  const close = () => {
    if (!active) return;
    const current = active;
    active = null;
    if (document.fullscreenElement === current.overlay) {
      document.exitFullscreen().catch(() => {});
    }
    current.overlay.remove();
    document.documentElement.classList.remove('board-demo-open');
    current.background.forEach(([element, inert]) => { element.inert = inert; });
    requestAnimationFrame(() => {
      window.scrollTo(current.x, current.y);
      current.link.focus({ preventScroll: true });
    });
  };
  window.addEventListener('popstate', close);
  window.addEventListener('pagehide', close);

  document.addEventListener('click', event => {
    const link = event.target.closest('.mobile-board-page .billboard-example[data-demo-src]');
    if (!link || !mobile.matches || active || event.defaultPrevented || event.button !== 0 ||
        event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const source = new URL(link.dataset.demoSrc, location.href);
    if (source.origin !== location.origin) return;
    event.preventDefault();

    const overlay = document.createElement('section');
    overlay.className = 'board-demo-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    const name = link.querySelector('strong')?.textContent.trim() || 'Website';
    overlay.setAttribute('aria-label', name + ' demo');
    const frame = document.createElement('iframe');
    frame.title = name + ' demo';
    frame.allow = 'fullscreen';
    frame.setAttribute('allowfullscreen', '');
    const back = document.createElement('button');
    back.type = 'button';
    back.className = 'board-demo-return';
    back.textContent = 'Tab Lab';
    back.setAttribute('aria-label', 'Back to gallery');
    back.title = 'Back to gallery';
    back.addEventListener('click', () => {
      if (!active) return;
      const current = active;
      // Closing the iframe first also discards its nested navigation history.
      close();
      history.replaceState(current.galleryState, '', current.galleryUrl);
      history.back();
    });
    overlay.append(frame, back);
    const background = [...document.body.children].map(element => [element, element.inert]);
    active = { overlay, link, background, x: scrollX, y: scrollY,
      galleryState: history.state, galleryUrl: location.href };
    background.forEach(([element]) => { element.inert = true; });
    document.body.append(overlay);
    document.documentElement.classList.add('board-demo-open');
    history.pushState({ ...history.state, tablabDemo: true }, '', '#demo-' + source.pathname.split('/').at(-2));
    frame.src = source.href;
    back.focus({ preventScroll: true });

    // The browser may reject fullscreen. The viewport-sized overlay is already ready.
    try {
      const enter = overlay.requestFullscreen || overlay.webkitRequestFullscreen;
      if (enter) Promise.resolve(enter.call(overlay, { navigationUI: 'hide' })).catch(() => {});
    } catch (_) { /* Keep the expanded browser-window view. */ }
  });
})();
