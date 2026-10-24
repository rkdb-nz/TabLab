(() => {
 const mobile=matchMedia('(max-width:700px) and (orientation:portrait), (max-width:1000px) and (orientation:landscape)'),reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const shell=document.querySelector('.discover-shell'),track=document.querySelector('.discover-track');if(!track)return;
 const sections=[...track.children];track.id='discover-track';let index=0,moving=false,touch=null,timer;
 const nav=document.createElement('nav');nav.className='scene-controls';nav.setAttribute('aria-label','Discover scenes');
 nav.innerHTML='<button type="button" aria-label="Previous scene" aria-controls="discover-track">Previous</button><span aria-live="polite" aria-atomic="true"></span><button type="button" aria-label="Next scene" aria-controls="discover-track">Next</button>';
 const [previous,next]=nav.querySelectorAll('button'),status=nav.querySelector('span');document.body.append(nav);
 sections.forEach(section=>{const text=section.querySelector('.d-text');if(text)text.tabIndex=0;const heading=section.querySelector('h1,h2');if(heading)heading.tabIndex=-1;});
 function sync(){
  nav.hidden=!mobile.matches;
  sections.forEach((section,i)=>section.inert=mobile.matches&&i!==index);
  track.style.transition='none';track.style.transform=mobile.matches?`translateY(${-index*100}%)`:'';
  previous.disabled=index===0;next.disabled=index===sections.length-1;status.textContent=(index+1)+' / '+sections.length;
 }
 function go(target,focus=false){
  if(!mobile.matches||moving||target<0||target>=sections.length||target===index||document.querySelector('.nav.open')||document.querySelector('dialog[open]'))return;
  index=target;moving=!reduce.matches;
  track.style.transition=reduce.matches?'none':'transform 1.5s cubic-bezier(.65,0,.35,1)';track.style.transform=`translateY(${-index*100}%)`;
  sections.forEach((section,i)=>section.inert=i!==index);previous.disabled=index===0;next.disabled=index===sections.length-1;status.textContent=(index+1)+' / '+sections.length;
  document.dispatchEvent(new CustomEvent('retreat-scene-change',{detail:index}));document.querySelector('.header').classList.toggle('scrolled',index>0);document.querySelector('.progress').style.width=`${index/(sections.length-1)*100}%`;
  if(focus)sections[index].querySelector('h1,h2')?.focus({preventScroll:true});
  clearTimeout(timer);timer=setTimeout(()=>moving=false,reduce.matches?0:1500);
 }
 previous.addEventListener('click',()=>go(index-1,true));next.addEventListener('click',()=>go(index+1,true));
 shell.addEventListener('touchstart',e=>{const panel=e.target.closest('.d-text');touch=e.touches.length===1&&!e.target.closest('a,button')?{x:e.touches[0].clientX,y:e.touches[0].clientY,scrollable:panel&&panel.scrollHeight>panel.clientHeight+1}:null;},{passive:true});
 shell.addEventListener('touchend',e=>{if(!touch||!e.changedTouches.length)return;const dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y,scrollable=touch.scrollable;touch=null;if(!scrollable&&Math.abs(dy)>48&&Math.abs(dy)>Math.abs(dx)*1.2)go(index+(dy<0?1:-1));},{passive:true});
 shell.addEventListener('touchcancel',()=>touch=null,{passive:true});
 window.addEventListener('wheel',e=>{const panel=e.target.closest?.('.d-text');if(panel&&panel.scrollHeight>panel.clientHeight+1)return;if(Math.abs(e.deltaY)>35)go(index+(e.deltaY>0?1:-1));},{passive:true});
 document.addEventListener('keydown',e=>{
  if(!mobile.matches||document.querySelector('.nav.open')||document.querySelector('dialog[open]')||e.target.closest('input,select,textarea'))return;
  const panel=e.target.closest('.d-text');if(panel&&panel.scrollHeight>panel.clientHeight+1)return;
  const down=['ArrowDown','PageDown'].includes(e.key),up=['ArrowUp','PageUp'].includes(e.key),space=e.key===' '&&!e.target.closest('a,button');
  if(down||up||space){e.preventDefault();go(index+(up?-1:1),true);}
 });
 document.addEventListener('retreat-return-top',()=>{moving=false;go(0,true);});mobile.addEventListener('change',sync);reduce.addEventListener('change',sync);sync();
})();
