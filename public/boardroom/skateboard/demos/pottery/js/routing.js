(() => {
 const mobile=matchMedia('(max-width:980px)');
 const mobileIds={studio:'maker',process:'making',collections:'collection',workshops:'visit',contact:'visit',gallery:'collection',welcome:'clay',hero:'clay'};
 const desktopIds={maker:'studio',making:'process',collection:'collections',visit:'visit',clay:'clay'};
 let timer;
 function route(){
  const isMobile=location.pathname.endsWith('/mobile.html');
  const targetMobile=mobile.matches;
  if(isMobile===targetMobile)return;
  const id=location.hash.slice(1),mapped=(targetMobile?mobileIds:desktopIds)[id]||id;
  const next=new URL(targetMobile?'mobile.html':'site.html',location.href);
  if(mapped)next.hash=mapped;
  location.replace(next.href);
 }
 function schedule(){clearTimeout(timer);timer=setTimeout(route,120);}
 requestAnimationFrame(()=>requestAnimationFrame(route));
 mobile.addEventListener('change',schedule);
 window.addEventListener('resize',schedule);
})();