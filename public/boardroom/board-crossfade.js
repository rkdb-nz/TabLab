/* Crossfade only the four Board destinations; normal navigation remains the fallback. */
(() => {
  const boardPath = /\/boardroom\/(billboard|noticeboard|skateboard|springboard)\/(?:index\.html)?$/;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let busy = false;
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.hasAttribute('download') || (link.target && link.target !== '_self') || reducedMotion.matches) return;
    const next = new URL(link.href, location.href);
    if (next.origin !== location.origin || !boardPath.test(next.pathname) || next.href === location.href) return;
    if (busy) { event.preventDefault(); return; }
    event.preventDefault();
    busy = true;
    const frame = document.createElement('iframe');
    frame.title = 'Opening the next Board';
    frame.setAttribute('aria-hidden', 'true');
    frame.tabIndex = -1;
    Object.assign(frame.style, { position: 'fixed', inset: '0', width: '100%', height: '100%', border: '0', zIndex: '2147483647', opacity: '0', pointerEvents: 'none', background: 'transparent' });
    let finished = false;
    const navigate = () => {
      if (finished) return;
      finished = true;
      clearTimeout(timeout);
      location.assign(next.href);
    };
    const timeout = setTimeout(navigate, 10000);
    frame.addEventListener('load', async () => {
      if (finished) return;
      try {
        if (!frame.contentDocument || frame.contentWindow.location.pathname !== next.pathname || !frame.contentDocument.querySelector('.board-main')) { navigate(); return; }
        await Promise.race([frame.contentDocument.fonts.ready, new Promise(resolve => setTimeout(resolve, 700))]);
        if (finished) return;
        const animation = frame.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1500, easing: 'ease-in-out', fill: 'forwards' });
        await animation.finished;
        navigate();
      } catch (_) { navigate(); }
    }, { once: true });
    frame.src = next.href;
    document.body.append(frame);
    window.addEventListener('pageshow', () => {frame.remove();busy=false;clearTimeout(timeout);}, {once:true});
  });
})();
