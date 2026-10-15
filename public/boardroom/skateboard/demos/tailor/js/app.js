const scroller = document.getElementById('scroller');
const track = document.getElementById('track');
const progress = document.getElementById('progress');
const chapterInd = document.getElementById('chapter-ind');
const counter = document.getElementById('counter');
const wheelHint = document.getElementById('wheel-hint');
const visitScroll = document.getElementById('visit-scroll');
const chapterPrev = document.getElementById('chapter-prev');
const chapterNext = document.getElementById('chapter-next');
const chapters = track ? Array.from(track.querySelectorAll('.chapter')) : [];
const total = chapters.length || 5;
let currentIndex = 0;
let targetIndex = 0;
let isAnimating = false;
let currentX = 0;
let targetX = 0;
const chaptersMeta = [
  {n:'01', name:'Arrival'},
  {n:'02', name:'Atelier'},
  {n:'03', name:'Collection'},
  {n:'04', name:'Details'},
  {n:'05', name:'Boutiques'}
];

function isMobile(){ return window.matchMedia('(max-width:900px), (pointer:coarse) and (max-width:1100px)').matches }
function pad(n){ return String(n).padStart(2,'0') }

function updateUI(idx){
  const topnav = document.getElementById('topnav');
  if(topnav) topnav.style.color = idx === 3 ? '#B8B3A8' : '';
  document.querySelectorAll('nav#topnav .links a[data-goto]').forEach(link=>{
    const isCurrent = parseInt(link.dataset.goto,10) === idx && idx > 0;
    link.classList.toggle('is-current', isCurrent);
    if(isCurrent) link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  });
  const m = chaptersMeta[idx];
  if(chapterInd && m) chapterInd.innerHTML = `<div class="cur">${m.n}</div><div class="meta">${m.name}<br>${pad(idx+1)} / ${pad(total)}</div>`;
  if(counter) counter.textContent = `${pad(idx+1)} — ${pad(total)}`;
  if(progress){
    const p = total > 1 ? idx/(total-1) : 1;
    progress.style.setProperty('--p', p);
    progress.style.transform = `scaleX(${p})`;
  }
  if(chapterPrev) chapterPrev.hidden = idx <= 0;
  if(chapterNext) chapterNext.hidden = idx >= total-1;
  chapters.forEach((ch,i)=>{
    if(isMobile()) ch.inert = i !== idx;
    ch.classList.toggle('active', i===idx);
    if(i===idx){
      ch.querySelectorAll('.reveal').forEach((el,j)=>setTimeout(()=>el.classList.add('in'),j*120));
      ch.querySelectorAll('.img-reveal').forEach((el,j)=>setTimeout(()=>el.classList.add('in'),j*150+200));
    }
  });
}

function goTo(index){
  if(!track) return;
  index = Math.max(0, Math.min(total-1, index));

  if(isMobile()){
    targetIndex=index;
    currentIndex=index;
    isAnimating=false;
    wheelHint?.classList.add('hide');
    scroller?.scrollTo({left:index*scroller.clientWidth,behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
    updateUI(index);
    return;
  }

  if(index===targetIndex && isAnimating) return;
  targetIndex=index;
  targetX=-index*window.innerWidth;
  isAnimating=true;
  wheelHint?.classList.add('hide');
}

function lerp(a,b,t){ return a+(b-a)*t }
function animate(){
  if(track && !isMobile()){    currentX=lerp(currentX,targetX,0.08);
    if(Math.abs(currentX-targetX)<0.5){
      currentX=targetX;
      if(isAnimating){ currentIndex=targetIndex; updateUI(currentIndex); isAnimating=false; }
    }
    track.style.transform=`translate3d(${currentX}px,0,0)`;
  }
  requestAnimationFrame(animate);
}
function getInitialChapterIndex(){
  if(isMobile()) {
    const idx = chapters.findIndex(ch => '#' + ch.id === location.hash);
    if(idx >= 0) return idx;
  }
  if(location.hash==='#boutiques') return total-1;
  if(location.hash==='#collection') return 2;
  return 0;
}
if(track){
  const initialIndex = getInitialChapterIndex();
  currentIndex = initialIndex;
  targetIndex = initialIndex;
  currentX = -initialIndex * window.innerWidth;
  targetX = currentX;
  track.style.transform = `translate3d(${currentX}px,0,0)`;
  animate();
  updateUI(initialIndex);
  if(isMobile()) requestAnimationFrame(()=>scroller.scrollTo({left:initialIndex*scroller.clientWidth,behavior:'instant'}));
}

let wheelAcc=0;
let wheelTimeout=null;
function handleWheel(e){
  if(!track || isMobile()) return;
  if(isAnimating){ e.preventDefault(); return; }

  // Final chapter opens vertically: Wāperiki -> Milan.
  // At the very top, an upward scroll returns to Craft.
  if(targetIndex===total-1 && visitScroll){
    if(e.deltaY < 0 && visitScroll.scrollTop <= 1){
      e.preventDefault();
      goTo(total-2);
    }
    return;
  }

  e.preventDefault();
  wheelAcc += e.deltaY;
  clearTimeout(wheelTimeout);
  wheelTimeout=setTimeout(()=>{wheelAcc=0},300);
  if(Math.abs(wheelAcc)<40) return;
  goTo(wheelAcc>0 ? targetIndex+1 : targetIndex-1);
  wheelAcc=0;
}
window.addEventListener('wheel',handleWheel,{passive:false});

let touchStartX=0,touchStartY=0;
window.addEventListener('touchstart',e=>{touchStartX=e.touches[0].clientX;touchStartY=e.touches[0].clientY},{passive:true});
window.addEventListener('touchend',e=>{
  if(!track) return;
  const dx=e.changedTouches[0].clientX-touchStartX;
  const dy=e.changedTouches[0].clientY-touchStartY;

  if(isMobile()){
    // Native horizontal chapter swipes; each chapter may scroll vertically.
    return;
  }

  if(Math.abs(dx)>Math.abs(dy)&&Math.abs(dx)>60){
    goTo(dx<0 ? targetIndex+1 : targetIndex-1);
  }
},{passive:true});

chapterPrev?.addEventListener('click',()=>goTo(targetIndex-1));
chapterNext?.addEventListener('click',()=>goTo(targetIndex+1));
document.querySelectorAll('[data-goto]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();goTo(parseInt(a.dataset.goto,10))}));
window.addEventListener('keydown',e=>{
  if(!track) return;
  if(e.key==='ArrowRight'||e.key==='ArrowDown'||e.key==='PageDown') goTo(targetIndex+1);
  if(e.key==='ArrowLeft'||e.key==='ArrowUp'||e.key==='PageUp') goTo(targetIndex-1);
});

// Collection lookbook: explicit controls only. The wheel remains chapter navigation.
const lookSlides=Array.from(document.querySelectorAll('.lookbook-slide'));
const lookCount=document.getElementById('look-count');
let lookIndex=0;
function showLook(index){
  if(!lookSlides.length) return;
  lookIndex=(index+lookSlides.length)%lookSlides.length;
  lookSlides.forEach((slide,i)=>slide.classList.toggle('active',i===lookIndex));
  if(isMobile()) lookSlides[lookIndex]?.querySelector('.mobile-look')?.scrollTo({top:0,behavior:'instant'});
  if(lookCount) lookCount.textContent=`${pad(lookIndex+1)} / ${pad(lookSlides.length)}`;
}
document.getElementById('look-prev')?.addEventListener('click',()=>showLook(lookIndex-1));
document.getElementById('look-next')?.addEventListener('click',()=>showLook(lookIndex+1));
showLook(0);

// Mobile Visit is a simple two-panel horizontal ending.
const visitTabs=Array.from(document.querySelectorAll('[data-visit-panel]'));
function showVisitPanel(index, smooth=true){
  if(!visitScroll) return;
  const panel=Math.max(0,Math.min(1,index));
  visitScroll.scrollTo({left:panel*visitScroll.clientWidth,top:0,behavior:smooth?'smooth':'auto'});
  visitTabs.forEach((button,i)=>button.classList.toggle('active',i===panel));
}
visitTabs.forEach((button,i)=>button.addEventListener('click',()=>showVisitPanel(i)));
visitScroll?.addEventListener('scroll',()=>{
  if(!isMobile()) return;
  const panel=visitScroll.clientWidth ? Math.round(visitScroll.scrollLeft/visitScroll.clientWidth) : 0;
  visitTabs.forEach((button,i)=>button.classList.toggle('active',i===panel));
},{passive:true});

// Reset to Wāperiki whenever Visit is entered directly.
document.querySelector('a[data-goto="4"]')?.addEventListener('click',()=>showVisitPanel(0,false));

// Reflow native chapter and location positions after rotation or viewport resizing.
let wasMobile=isMobile();
window.addEventListener('resize',()=>{
  if(!track) return;
  if(isMobile()){
    buildMobileLooks();
    scroller.scrollTo({left:targetIndex*scroller.clientWidth,behavior:'instant'});
    const selected=visitTabs.findIndex(button=>button.classList.contains('active'));
    showVisitPanel(Math.max(0,selected),false);
  } else {
    if(wasMobile){
      chapters.forEach(ch=>ch.inert=false);
      scroller.scrollLeft=0;
    }
    targetX=-targetIndex*window.innerWidth;
    currentX=targetX;
    track.style.transform=`translate3d(${currentX}px,0,0)`;
  }
  wasMobile=isMobile();
});

let mobileScrollFrame=0;
scroller?.addEventListener('scroll',()=>{
  if(!isMobile()) return;
  cancelAnimationFrame(mobileScrollFrame);
  mobileScrollFrame=requestAnimationFrame(()=>{
    const idx=Math.max(0,Math.min(total-1,Math.round(scroller.scrollLeft/scroller.clientWidth)));
    if(idx!==currentIndex){
      currentIndex=idx;
      targetIndex=idx;
      updateUI(idx);
    }
  });
},{passive:true});

// A mobile look combines both magazine pages without discarding their contents.
// Desktop continues to use the original spread markup and styling.
function buildMobileLooks(){
  if(!isMobile()) return;
  lookSlides.forEach((slide,index)=>{
    if(slide.querySelector('.mobile-look')) return;
    const mobile=document.createElement('div');
    mobile.className='mobile-look';
    const copy=slide.querySelector('.book-page .copy');
    if(copy){
      const clone=copy.cloneNode(true);
      clone.className='mobile-copy';
      mobile.append(clone);
    }
    const gallery=document.createElement('div');
    gallery.className='mobile-gallery';
    slide.querySelectorAll('.book-page figure img').forEach((img,i)=>{
      const clone=img.cloneNode(true);
      clone.alt=img.alt || (copy?.querySelector('h2')?.textContent.replace(/\s+/g,' ').trim() || `Look ${index+1}`) + (i ? ' — detail' : '');
      clone.decoding='async';
      gallery.append(clone);
    });
    mobile.append(gallery);
    slide.querySelectorAll('.book-page blockquote,.book-page .pull,.book-page .caption,.book-page .closing').forEach(note=>{
      const clone=note.cloneNode(true);
      clone.className='mobile-note';
      mobile.append(clone);
    });
    slide.append(mobile);
  });
}
buildMobileLooks();
if(isMobile()){
  document.getElementById('look-prev').textContent='← Previous look';
  document.getElementById('look-next').textContent='Next look →';
}

window.addEventListener('hashchange',()=>{
  if(isMobile()) goTo(getInitialChapterIndex());
});
