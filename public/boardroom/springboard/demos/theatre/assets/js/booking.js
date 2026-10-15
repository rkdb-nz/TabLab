
(function(){
  const perfBtns = document.querySelectorAll('.perf-btn');
  const zoneCards = document.querySelectorAll('.zone-card');
  const summaryPerf = document.getElementById('sumPerf');
  const summaryZone = document.getElementById('sumZone');
  const summaryTickets = document.getElementById('sumTickets');
  const summaryTotal = document.getElementById('sumTotal');
  const bookingHint = document.getElementById('bookingHint');
  const checkout = document.getElementById('checkoutBtn');
  const errorEl = document.getElementById('bookingError');
  const resetBtn = document.getElementById('resetBooking');
  const confirmEl = document.getElementById('bookingConfirm');
  const confirmDetails = document.getElementById('confirmDetails');
  const closeConfirm = document.getElementById('closeConfirm');
  const main = document.querySelector('.book-main');
  const payment = document.getElementById('demoPayment');
  const complete = document.getElementById('completeDemoBooking');
  const result = document.getElementById('demoBookingResult');
  const heading = document.getElementById('checkoutHeading');
  const another = document.getElementById('anotherBooking');
  function closeCheckout(){
    confirmEl.hidden=true;
    main.classList.remove('is-checkout');
  }
  function preparePayment(){
    payment.hidden=false;
    result.hidden=true;
    closeConfirm.hidden=false;
    another.hidden=true;
    heading.textContent='Complete your booking';
  }
  const prices = {adult:42, concession:36, under25:28};
  let state = {perf:null, zone:null, adult:0, concession:0, under25:0};
  function update(){
    let totalTickets = state.adult+state.concession+state.under25;
    let total = state.adult*prices.adult + state.concession*prices.concession + state.under25*prices.under25;
    if(summaryPerf) summaryPerf.textContent = state.perf || '—';
    if(summaryZone) summaryZone.textContent = state.zone || '—';
    if(summaryTickets) summaryTickets.textContent = totalTickets ? totalTickets + ' tickets (A:'+state.adult+' C:'+state.concession+' U25:'+state.under25+')' : '—';
    if(summaryTotal) summaryTotal.textContent = '$'+total;
    const valid = state.perf && state.zone && totalTickets>0;
    if(checkout) checkout.disabled = !valid;
    if(bookingHint){
      if(valid){
        bookingHint.textContent = 'Ready to continue. Review your selections and proceed to checkout.';
      } else {
        const missing = [];
        if(!state.perf) missing.push('a performance');
        if(!state.zone) missing.push('a seating area');
        if(totalTickets===0) missing.push('at least one ticket');
        bookingHint.textContent = 'Before checkout, select ' + missing.join(', ') + '.';
      }
    }
    if(errorEl){
      if(!valid && totalTickets>0 && (!state.perf||!state.zone)){
        errorEl.textContent = !state.perf ? 'Select a performance date.' : 'Select a seating area.';
      } else if(totalTickets===0 && state.perf && state.zone){
        errorEl.textContent = 'Choose at least one ticket.';
      } else {
        errorEl.textContent='';
      }
    }
  }
  perfBtns.forEach(function(b){
    b.addEventListener('click', function(){
      perfBtns.forEach(function(x){x.setAttribute('aria-pressed','false');});
      b.setAttribute('aria-pressed','true');
      state.perf = b.dataset.perf;
      update();
    });
  });
  zoneCards.forEach(function(c){
    c.addEventListener('click', function(){
      zoneCards.forEach(function(x){x.setAttribute('aria-pressed','false');});
      c.setAttribute('aria-pressed','true');
      state.zone = c.dataset.zone;
      update();
    });
  });
  document.querySelectorAll('.qty-controls').forEach(function(row){
    const type = row.dataset.type;
    const dec = row.querySelector('[data-dec]');
    const inc = row.querySelector('[data-inc]');
    const val = row.querySelector('[data-val]');
    if(!type) return;
    dec.addEventListener('click', function(){
      if(state[type]>0){ state[type]--; val.textContent=state[type]; update(); }
    });
    inc.addEventListener('click', function(){
      if(state[type]<10){ state[type]++; val.textContent=state[type]; update(); }
    });
  });
  if(resetBtn){
    resetBtn.addEventListener('click', function(){
      state={perf:null,zone:null,adult:0,concession:0,under25:0};
      perfBtns.forEach(function(x){x.setAttribute('aria-pressed','false');});
      zoneCards.forEach(function(x){x.setAttribute('aria-pressed','false');});
      document.querySelectorAll('[data-val]').forEach(function(v){v.textContent='0';});
      if(confirmEl){ closeCheckout(); preparePayment(); }
      update();
    });
  }
  if(checkout){
    checkout.addEventListener('click', function(){
      const totalTickets = state.adult+state.concession+state.under25;
      if(!state.perf || !state.zone || totalTickets===0){
        if(errorEl) errorEl.textContent='Complete performance, zone and tickets before checkout.';
        return;
      }
      const total = state.adult*prices.adult + state.concession*prices.concession + state.under25*prices.under25;
      if(confirmDetails){
        confirmDetails.innerHTML = '<div class=\"summary-line\"><span>Performance</span><span>'+state.perf+'</span></div><div class=\"summary-line\"><span>Zone</span><span>'+state.zone+'</span></div><div class=\"summary-line\"><span>Adult x'+state.adult+'</span><span>$'+(state.adult*prices.adult)+'</span></div><div class=\"summary-line\"><span>Concession x'+state.concession+'</span><span>$'+(state.concession*prices.concession)+'</span></div><div class=\"summary-line\"><span>Under 25 x'+state.under25+'</span><span>$'+(state.under25*prices.under25)+'</span></div><div class=\"summary-total\"><span>Total</span><span>$'+total+'</span></div>';
      }
      if(confirmEl){
        preparePayment();
        complete.textContent='Complete demo booking · $'+total;
        main.classList.add('is-checkout');
        confirmEl.hidden=false;
        confirmEl.focus();
      }
    });
  }
  if(closeConfirm){
    closeConfirm.addEventListener('click', function(){
      closeCheckout();
      checkout.focus();
    });
  }
  document.addEventListener('keydown', function(e){
    if(e.key==='Escape' && !confirmEl.hidden){
      closeCheckout();
      checkout.focus();
    }
  });
  complete.addEventListener('click', function(){
    payment.hidden=true;
    heading.textContent='Demo booking complete';
    result.hidden=false;
    closeConfirm.hidden=true;
    another.hidden=false;
    confirmEl.focus();
  });
  another.addEventListener('click', function(){
    resetBtn.click();
    perfBtns[0].focus();
  });
  update();
})();
