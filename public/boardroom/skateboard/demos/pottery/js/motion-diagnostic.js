(() => {
  const panel = document.getElementById('motion-test-panel');
  const status = panel.querySelector('p');
  const button = panel.querySelector('button');
  const mobile = matchMedia('(max-width:860px)');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const frames = [...document.querySelectorAll('.reveal-img')];
  const done = new WeakSet();
  const running = new Map();
  let latest = 'waiting for a photo';
  function report(message) {
    latest = message;
    status.textContent = `${innerWidth}px · Reduced motion ${reduced.matches ? 'ON' : 'OFF'} · ${message}`;
  }
  if (!mobile.matches) { report('mobile test inactive'); button.hidden = true; return; }
  document.body.classList.add('motion-diagnostic');
  frames.forEach((frame, i) => {
    frame.classList.add('in');
    const curtain = document.createElement('div');
    curtain.className = 'motion-test-curtain';
    curtain.setAttribute('aria-hidden', 'true');
    curtain.textContent = '4 SECOND PHOTO REVEAL';
    curtain.hidden = reduced.matches;
    frame.append(curtain);
    frame.dataset.motionTestName = `Photo ${i + 1}`;
  });
  function play(frame, manual = false) {
    if (!frame || (!manual && reduced.matches)) return;
    if (!frame.querySelector('img').animate) { report('animation API unavailable'); return; }
    const previous = running.get(frame);
    previous?.forEach(animation => animation.cancel());
    const curtain = frame.querySelector('.motion-test-curtain');
    const img = frame.querySelector('img');
    curtain.hidden = false;
    report(`${frame.dataset.motionTestName}: RUNNING for 4 seconds`);
    const cover = curtain.animate([{clipPath:'inset(0 0 0 0)'},{clipPath:'inset(0 0 0 100%)'}], {duration:4000, easing:'linear', fill:'forwards'});
    const photo = img.animate([{transform:'scale(1.3)',filter:'grayscale(1)'},{transform:'scale(1)',filter:'grayscale(0)'}], {duration:4000, easing:'linear', fill:'forwards'});
    running.set(frame, [cover, photo]);
    done.add(frame);
    cover.finished.then(() => {
      if (running.get(frame)?.[0] !== cover) return;
      curtain.hidden = true;
      running.delete(frame);
      cover.cancel(); photo.cancel();
      report(`${frame.dataset.motionTestName}: COMPLETE`);
    }).catch(() => {});
  }
  let pending = false;
  function check() {
    if (!mobile.matches || reduced.matches) return;
    const h = window.visualViewport?.height || innerHeight;
    for (const frame of frames) {
      const box = frame.getBoundingClientRect();
      if (!done.has(frame) && box.top <= h * .5 && box.bottom > 100) play(frame);
    }
  }
  window.addEventListener('scroll', () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; check(); });
  }, {passive:true});
  button.addEventListener('click', () => {
    // A manual, single test can be explicitly requested even with reduced motion.
    const frame = frames.find(f => { const b=f.getBoundingClientRect(); return b.top < innerHeight*.75 && b.bottom > 120; }) || frames[0];
    frame.scrollIntoView({behavior:'instant',block:'center'});
    requestAnimationFrame(() => requestAnimationFrame(() => play(frame, true)));
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      running.forEach(animations => animations.forEach(a => a.cancel()));
      running.clear();
      frames.forEach(f => { f.querySelector('.motion-test-curtain').hidden = true; });
    }
    report(reduced.matches ? 'automatic test OFF; button runs one test' : latest);
  });
  report(reduced.matches ? 'automatic test OFF; button runs one test' : latest);
  requestAnimationFrame(check);
})();
