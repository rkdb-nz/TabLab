const track=document.getElementById('track');
const scroller=document.getElementById('scroller');
const progress=document.getElementById('progress');
const chapterInd=document.getElementById('chapter-ind');
const counter=document.getElementById('counter');
const wheelHint=document.getElementById('wheel-hint');
const visitScroll=document.getElementById('visit-scroll');
const chapterPrev=document.getElementById('chapter-prev');
const chapterNext=document.getElementById('chapter-next');
const chapters=Array.from(track.querySelectorAll('.chapter'));
const total=chapters.length;
const chaptersMeta=[{n:'01',name:'Arrival'},{n:'02',name:'Atelier'},{n:'03',name:'Collection'},{n:'04',name:'Craft'},{n:'05',name:'Visit'}];
const motion=matchMedia('(prefers-reduced-motion: reduce)');
const pad=n=>String(n).padStart(2,'0');
const isMobile=()=>innerWidth<=900;
const chapterHashes=['','#atelier','#collection','#details','#boutiques'];
let currentIndex=0,targetIndex=0,isAnimating=false,animationTimer,resizeFrame,suppressScrollUntil=0;

function updateUI(index,announce=true){
  const m=chaptersMeta[index];
  chapters.forEach((chapter,i)=>{
    const selected=i===index;
    chapter.classList.toggle('active',selected);
    chapter.setAttribute('role','region');chapter.setAttribute('aria-label',`${chaptersMeta[i].name}, chapter ${i+1} of ${total}`);
    chapter.inert=!selected;
    chapter.setAttribute('aria-hidden',String(!selected));
    if(selected){chapter.querySelectorAll('.reveal,.img-reveal').forEach(el=>el.classList.add('in'));}
  });
  document.querySelectorAll('#topnav [data-goto]').forEach(link=>{
    const selected=Number(link.dataset.goto)===index;
    link.classList.toggle('is-current',selected);
    if(selected)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
  });
  chapterInd.innerHTML=`<div class="cur">${m.n}</div><div class="meta">${m.name}<br>${pad(index+1)} / ${pad(total)}</div>`;
  counter.textContent=`${pad(index+1)} — ${pad(total)}`;
  const fraction=index/(total-1);progress.style.setProperty('--p',fraction);progress.style.transform=`scaleX(${fraction})`;
  chapterPrev.hidden=index===0;chapterNext.hidden=index===total-1;
  if(announce)document.getElementById('chapter-status').textContent=`${m.name}, chapter ${index+1} of ${total}`;
}
function positionChapter(animate=true){
  clearTimeout(animationTimer);
  const smooth=animate&&!motion.matches;
  if(isMobile()){
    track.style.transition='none';track.style.transform='none';
    scroller.scrollTo({left:currentIndex*innerWidth,top:0,behavior:smooth?'smooth':'instant'});
    isAnimating=false;
  }else{
    scroller.scrollTo({left:0,top:0,behavior:'instant'});
    track.style.transition=smooth?'transform .75s cubic-bezier(.22,1,.36,1)':'none';
    track.style.transform=`translate3d(${-currentIndex*innerWidth}px,0,0)`;
    isAnimating=smooth;
    animationTimer=setTimeout(()=>{isAnimating=false;},smooth?780:0);
  }
}
function goTo(index,{animate=true,focus=false,history=true}={}){
  currentIndex=targetIndex=Math.max(0,Math.min(total-1,index));
  wheelHint.classList.add('hide');
  updateUI(currentIndex);positionChapter(animate);
  if(history&&location.hash!==chapterHashes[currentIndex])window.history.replaceState(null,'',location.pathname+location.search+chapterHashes[currentIndex]);
  if(focus){const heading=chapters[currentIndex].querySelector('h1,h2');heading.tabIndex=-1;heading.focus({preventScroll:true});}
}
function hashChapter(){const i=chapterHashes.indexOf(location.hash);return i<0?0:i;}

// Build the mobile reading card from the original magazine spread.
const lookSlides=Array.from(document.querySelectorAll('.lookbook-slide'));
const lookCount=document.getElementById('look-count');
let lookIndex=0;
lookSlides.forEach((slide,index)=>{
  const copy=slide.querySelector('.copy');
  const photograph=slide.querySelector('figure.hero img')||slide.querySelector('figure.still.big img');
  const card=document.createElement('div');card.className='mobile-look-card';
  const photo=photograph.cloneNode(true);photo.className='mobile-look-photo';
  const description=copy.cloneNode(true);description.className='mobile-look-copy';
  description.querySelectorAll('br').forEach(br=>br.replaceWith(document.createTextNode(' ')));
  card.append(photo,description);slide.append(card);
  slide.setAttribute('role','group');slide.setAttribute('aria-label',`Look ${index+1} of ${lookSlides.length}`);
});
function showLook(index,announce=false){
  lookIndex=(index+lookSlides.length)%lookSlides.length;
  lookSlides.forEach((slide,i)=>{const selected=i===lookIndex;slide.classList.toggle('active',selected);slide.inert=!selected;slide.setAttribute('aria-hidden',String(!selected));});
  lookCount.textContent=`${isMobile()?lookIndex+1:pad(lookIndex+1)} / ${isMobile()?lookSlides.length:pad(lookSlides.length)}`;
  if(announce)document.getElementById('chapter-status').textContent=`Collection look ${lookIndex+1} of ${lookSlides.length}: ${lookSlides[lookIndex].querySelector('.copy h2').innerText.replace(/\s+/g,' ')}`;
}
const lookPrev=document.getElementById('look-prev'),lookNext=document.getElementById('look-next');
lookPrev.setAttribute('aria-label','Previous collection look');lookNext.setAttribute('aria-label','Next collection look');
lookPrev.addEventListener('click',()=>showLook(lookIndex-1,true));lookNext.addEventListener('click',()=>showLook(lookIndex+1,true));

// Craft uses exclusive, native disclosure controls on phones.
const craftPanel=document.querySelector('.ch4 .details');
const accordion=document.createElement('div');accordion.className='mobile-craft-accordion';
craftPanel.querySelectorAll('.ditem').forEach((entry,index)=>{
  const item=document.createElement('details');item.name='tailor-craft';
  const summary=document.createElement('summary');
  const number=document.createElement('span');number.className='craft-number';number.textContent=pad(index+1);
  const title=document.createElement('span');title.className='craft-title';title.textContent=entry.querySelector('h3').textContent;
  summary.append(number,title);item.append(summary,entry.querySelector('p').cloneNode(true));
  item.addEventListener('toggle',()=>{if(item.open)accordion.querySelectorAll('details').forEach(other=>{if(other!==item)other.open=false;});});
  accordion.append(item);
});
craftPanel.append(accordion);

const visitTabs=Array.from(document.querySelectorAll('[data-visit-panel]'));
function syncVisit(index){visitTabs.forEach((button,i)=>{button.classList.toggle('active',i===index);button.setAttribute('aria-pressed',String(i===index));});}
function showVisitPanel(index,smooth=true){
  const panel=Math.max(0,Math.min(1,index));
  if(isMobile())visitScroll.scrollTo({left:panel*visitScroll.clientWidth,top:0,behavior:smooth&&!motion.matches?'smooth':'instant'});
  else visitScroll.scrollTo({left:0,top:panel?visitScroll.scrollHeight:0,behavior:smooth&&!motion.matches?'smooth':'instant'});
  syncVisit(panel);
}
visitTabs.forEach((button,i)=>button.addEventListener('click',()=>showVisitPanel(i)));
visitScroll.addEventListener('scroll',()=>{if(isMobile())syncVisit(Math.round(visitScroll.scrollLeft/visitScroll.clientWidth));},{passive:true});

document.querySelectorAll('[data-goto]').forEach(link=>link.addEventListener('click',e=>{
  e.preventDefault();const index=Number(link.dataset.goto);
  goTo(index,{focus:!link.closest('#topnav')});if(index===4)showVisitPanel(0,false);
}));
chapterPrev.addEventListener('click',()=>goTo(currentIndex-1));chapterNext.addEventListener('click',()=>goTo(currentIndex+1));

// Register at every initial width, so native phone scrolling also works after resize.
let scrollFrame=0;
scroller.addEventListener('scroll',()=>{
  cancelAnimationFrame(scrollFrame);
  scrollFrame=requestAnimationFrame(()=>{
    if(!isMobile()){if(scroller.scrollLeft||scroller.scrollTop)scroller.scrollTo({left:0,top:0,behavior:'instant'});return;}
    if(performance.now()<suppressScrollUntil)return;
    const index=Math.max(0,Math.min(total-1,Math.round(scroller.scrollLeft/innerWidth)));
    if(index!==currentIndex){currentIndex=targetIndex=index;updateUI(index);}
  });
},{passive:true});

function scrollableParent(element){
  for(let p=element;p&&p!==scroller;p=p.parentElement){const style=getComputedStyle(p);if(p.scrollHeight>p.clientHeight+1&&/(auto|scroll)/.test(style.overflowY))return p;}
  return null;
}
window.addEventListener('keydown',e=>{
  if(document.querySelector('dialog[open]')||e.altKey||e.ctrlKey||e.metaKey||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
  if(e.target.closest('.lookbook-controls')&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();showLook(lookIndex+(e.key==='ArrowRight'?1:-1),true);return;}
  if(e.target.closest('summary')||scrollableParent(e.target))return;
  if(['PageDown','PageUp'].includes(e.key)||(['ArrowLeft','ArrowRight'].includes(e.key)&&(e.target===document.body||e.target===scroller||e.target.closest('#topnav,.mobile-chapter-controls')))){
    e.preventDefault();goTo(currentIndex+(['PageDown','ArrowRight'].includes(e.key)?1:-1));
  }
});
let wheelTotal=0,wheelTimer;
window.addEventListener('wheel',e=>{
  if(isMobile()||document.querySelector('dialog[open]')||e.ctrlKey||scrollableParent(e.target))return;
  if(currentIndex===total-1){if(e.deltaY<0&&visitScroll.scrollTop<=1){e.preventDefault();goTo(total-2);}return;}
  e.preventDefault();if(isAnimating)return;wheelTotal+=e.deltaY;clearTimeout(wheelTimer);wheelTimer=setTimeout(()=>wheelTotal=0,250);
  if(Math.abs(wheelTotal)>40){goTo(currentIndex+(wheelTotal>0?1:-1));wheelTotal=0;}
},{passive:false});
let touchX=0,touchY=0;
window.addEventListener('touchstart',e=>{touchX=e.touches[0].clientX;touchY=e.touches[0].clientY;},{passive:true});
window.addEventListener('touchend',e=>{if(isMobile()||document.querySelector('dialog[open]'))return;const dx=e.changedTouches[0].clientX-touchX,dy=e.changedTouches[0].clientY-touchY;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy))goTo(currentIndex+(dx<0?1:-1));},{passive:true});
window.addEventListener('resize',()=>{
  suppressScrollUntil=performance.now()+250;cancelAnimationFrame(resizeFrame);
  resizeFrame=requestAnimationFrame(()=>{positionChapter(false);showLook(lookIndex);showVisitPanel(visitTabs[1].getAttribute('aria-pressed')==='true'?1:0,false);});
});
window.addEventListener('hashchange',()=>goTo(hashChapter(),{animate:false,history:false}));
motion.addEventListener('change',()=>positionChapter(false));

// Visit requests finish locally with an explicit no-send demonstration result.
const visitDialog=document.getElementById('visit-dialog'),visitForm=document.getElementById('visit-form'),visitResult=document.getElementById('visit-result');
let visitTrigger;
const dateField=visitForm.elements.date;
const today=new Date();today.setMinutes(today.getMinutes()-today.getTimezoneOffset());dateField.min=today.toISOString().slice(0,10);
document.querySelectorAll('.book-visit').forEach(button=>button.addEventListener('click',()=>{
  visitTrigger=button;visitForm.reset();visitForm.hidden=false;visitResult.hidden=true;visitResult.textContent='';visitForm.elements.boutique.value=button.dataset.boutique;visitDialog.showModal();
}));
visitDialog.querySelector('.dialog-close').addEventListener('click',()=>visitDialog.close());
visitDialog.addEventListener('close',()=>visitTrigger?.focus({preventScroll:true}));
visitForm.addEventListener('submit',e=>{
  e.preventDefault();if(!visitForm.reportValidity())return;
  visitForm.hidden=true;visitResult.hidden=false;visitResult.textContent='Demonstration only. No visit has been booked and no enquiry or message has been sent.';visitResult.focus({preventScroll:true});
});
document.querySelectorAll('.ch1 .type,.ch2 .right-content,.mobile-look-card,.ch4 .details,.visit-intro').forEach(region=>{region.tabIndex=0;});
showLook(0);syncVisit(0);currentIndex=targetIndex=hashChapter();updateUI(currentIndex,false);positionChapter(false);
