// The same gesture-triggered 1.5-second glide as the restaurant landing.
(() => {
  const mobile = matchMedia('(max-width:700px) and (orientation:portrait), (max-width:1000px) and (orientation:landscape)');
  if (!mobile.matches) return;
  const shell = document.querySelector('.discover-shell');
  const track = document.querySelector('.discover-track');
  const sections = [...track.children];
  let index = 0, moving = false, touch = null;
  function go(next) {
    if (moving || next < 0 || next >= sections.length || next === index || document.querySelector('.nav.open')) return;
    index = next;
    moving = true;
    track.style.transition = 'transform 1.5s cubic-bezier(.65,0,.35,1)';
    track.style.transform = `translateY(${-index * 100}%)`;
    sections.forEach((section, i) => {section.inert = i !== index;});
    document.querySelector('.header').classList.toggle('scrolled', index > 0);
    document.querySelector('.progress').style.width = `${index / (sections.length - 1) * 100}%`;
    setTimeout(() => {moving = false;}, 1500);
  }
  sections.forEach((section, i) => {section.inert = i !== index;});
  shell.addEventListener('touchstart', event => {
    touch = event.touches.length === 1 && !event.target.closest('a,button') ? {x:event.touches[0].clientX,y:event.touches[0].clientY} : null;
  }, {passive:true});
  shell.addEventListener('touchend', event => {
    if (!touch || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - touch.x;
    const dy = event.changedTouches[0].clientY - touch.y;
    touch = null;
    if (Math.abs(dy) > 48 && Math.abs(dy) > Math.abs(dx) * 1.2) go(index + (dy < 0 ? 1 : -1));
  }, {passive:true});
  shell.addEventListener('touchcancel', () => {touch = null;}, {passive:true});
  window.addEventListener('wheel', event => {if (Math.abs(event.deltaY) > 35) go(index + (event.deltaY > 0 ? 1 : -1));}, {passive:true});
  document.addEventListener('keydown', event => {
    if (event.target.closest('a,button,input,select,textarea')) return;
    if (['ArrowDown','PageDown',' '].includes(event.key)) {event.preventDefault();go(index + 1);}
    if (['ArrowUp','PageUp'].includes(event.key)) {event.preventDefault();go(index - 1);}
  });
  mobile.addEventListener('change', () => location.reload());
})();
