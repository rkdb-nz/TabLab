(() => {
  const mobile = matchMedia('(max-width:860px)');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const frames = [...document.querySelectorAll('.reveal-img')];
  if (!mobile.matches || !Element.prototype.animate) return;
  const done = new WeakSet();
  const running = new Map();
  document.body.classList.add('mobile-photo-reveals');
  frames.forEach(frame => {
    frame.classList.add('in');
    const curtain = document.createElement('div');
    curtain.className = 'mobile-photo-curtain';
    curtain.setAttribute('aria-hidden', 'true');
    curtain.hidden = reduced.matches;
    frame.append(curtain);
  });
  function reveal(frame) {
    const curtain = frame.querySelector('.mobile-photo-curtain');
    const img = frame.querySelector('img');
    done.add(frame);
    const cover = curtain.animate([
      {clipPath:'inset(0 0 0 0)'}, {clipPath:'inset(0 0 0 100%)'}
    ], {duration:2500, easing:'cubic-bezier(.45,0,.2,1)', fill:'forwards'});
    const photo = img.animate([
      {transform:'scale(1.3)',filter:'grayscale(1)'}, {transform:'scale(1)',filter:'grayscale(0)'}
    ], {duration:2500, easing:'cubic-bezier(.45,0,.2,1)', fill:'forwards'});
    running.set(frame, [cover, photo]);
    cover.finished.then(() => {
      curtain.hidden = true;
      running.delete(frame);
      cover.cancel(); photo.cancel();
    }).catch(() => {});
  }
  function check() {
    if (!mobile.matches || reduced.matches) return;
    const h = window.visualViewport?.height || innerHeight;
    const top = window.visualViewport?.offsetTop || 0;
    frames.forEach(frame => {
      const box = frame.getBoundingClientRect();
      if (!done.has(frame) && box.top <= top + h * .5 && box.bottom > top + 100) reveal(frame);
    });
  }
  let pending = false;
  window.addEventListener('scroll', () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; check(); });
  }, {passive:true});
  window.addEventListener('resize', check, {passive:true});
  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      running.forEach(animations => animations.forEach(a => a.cancel()));
      running.clear();
      frames.forEach(frame => { frame.querySelector('.mobile-photo-curtain').hidden = true; done.add(frame); });
    } else check();
  });
  requestAnimationFrame(check);
})();
