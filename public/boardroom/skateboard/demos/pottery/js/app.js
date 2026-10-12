(() => {
  const revealEls = document.querySelectorAll('.reveal, .reveal-img');
  const progressBar = document.getElementById('progressBar');
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
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
    if (!heroImg || motion.matches) return;
    const y = window.scrollY * 0.18;
    heroImg.style.transform = `translateY(${y}px) scale(1.06)`;
    if (window.scrollY < 10) heroImg.style.transform = 'scale(1)';
  }, { passive: true });

  function setMenu(open) {
    nav.classList.toggle('open', open);
    navToggle?.setAttribute('aria-expanded', String(open));
    navToggle?.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  navToggle?.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); navToggle?.focus(); }
  });
  document.querySelectorAll('#navMobile a').forEach(a => {
    a.addEventListener('click', () => setMenu(false));
  });

  motion.addEventListener('change', () => {
    if (motion.matches) {
      if (heroImg) heroImg.style.transform = 'none';
      revealEls.forEach(el => el.classList.add('in'));
    }
  });
  if (motion.matches) {
    document.querySelectorAll('.reveal, .reveal-img').forEach(el => el.classList.add('in'));
  }
})();
