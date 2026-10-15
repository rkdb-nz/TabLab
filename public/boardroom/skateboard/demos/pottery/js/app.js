(() => {
  const revealEls = document.querySelectorAll('.reveal, .reveal-img');
  const progressBar = document.getElementById('progressBar');
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');

  const mobileView = matchMedia('(max-width: 860px)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const photoFrames = [...document.querySelectorAll('.reveal-img')];
  function updatePhotoDrift() {
    photoFrames.forEach(frame => {
      const img = frame.querySelector('img');
      if (!img) return;
      if (!mobileView.matches || reducedMotion.matches) {
        img.style.removeProperty('--photo-drift');
        return;
      }
      const box = frame.getBoundingClientRect();
      if (box.bottom < 0 || box.top > innerHeight) return;
      const viewportHeight = window.visualViewport?.height || innerHeight;
      const viewportTop = window.visualViewport?.offsetTop || 0;
      if (!frame.classList.contains('in') && box.top <= viewportTop + viewportHeight * .5 && box.bottom > viewportTop) {
        frame.classList.add('in');
      }
      const travel = Math.min(18, box.height * .04);
      const progress = Math.max(-1, Math.min(1, (innerHeight / 2 - box.top - box.height / 2) / ((innerHeight + box.height) / 2)));
      img.style.setProperty('--photo-drift', (progress * travel).toFixed(2) + 'px');
    });
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !(mobileView.matches && entry.target.classList.contains('reveal-img'))) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));

  requestAnimationFrame(() => {
    document.querySelector('.hero')?.classList.add('loaded');
  });

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updatePhotoDrift();
        const h = document.documentElement;
        const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
        if (progressBar) progressBar.style.width = scrolled + '%';
        if (nav) {
          if (window.scrollY > 20) nav.classList.add('scrolled');
          else nav.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  const heroImg = document.querySelector('.hero-media img');
  window.addEventListener('scroll', () => {
    if (!heroImg || (mobileView.matches && reducedMotion.matches)) return;
    const y = window.scrollY * 0.18;
    heroImg.style.transform = `translateY(${y}px) scale(1.06)`;
    if (window.scrollY < 10) heroImg.style.transform = 'scale(1)';
  }, { passive: true });

  window.addEventListener('resize', updatePhotoDrift, { passive: true });
  window.visualViewport?.addEventListener('resize', updatePhotoDrift, { passive: true });
  window.visualViewport?.addEventListener('scroll', updatePhotoDrift, { passive: true });
  reducedMotion.addEventListener('change', updatePhotoDrift);
  updatePhotoDrift();

  navToggle?.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
  document.querySelectorAll('#navMobile a').forEach(a => {
    a.addEventListener('click', () => nav.classList.remove('open'));
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal, .reveal-img').forEach(el => el.classList.add('in'));
  }
})();
