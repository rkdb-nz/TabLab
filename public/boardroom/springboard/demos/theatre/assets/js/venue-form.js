
(function(){
  const form = document.getElementById('hireForm');
  const success = document.getElementById('formSuccess');
  const sendAnother = document.getElementById('sendAnotherBtn');
  if(!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    let valid=true;
    const required = form.querySelectorAll('[required]');
    required.forEach(function(inp){
      const err = inp.parentElement.querySelector('.field-error');
      const isEmpty = inp.type==='checkbox' ? !inp.checked : !inp.value.trim();
      if(isEmpty){
        valid=false;
        inp.setAttribute('aria-invalid','true');
        if(err) err.textContent='This field is required.';
      } else {
        inp.removeAttribute('aria-invalid');
        if(err) err.textContent='';
      }
      if(inp.type==='email' && inp.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value)){
        valid=false;
        inp.setAttribute('aria-invalid','true');
        if(err) err.textContent='Enter a valid email.';
      }
    });
    const attendance = form.elements.attendance;
    if(attendance){
      const err = attendance.parentElement.querySelector('.field-error');
      if(attendance.value !== '' && !attendance.checkValidity()){
        valid = false;
        attendance.setAttribute('aria-invalid','true');
        if(err) err.textContent = 'Enter a whole number from 1 to 200.';
      } else {
        attendance.removeAttribute('aria-invalid');
        if(err) err.textContent = '';
      }
    }
    if(!valid){
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    form.style.display='none';
    if(success){ success.classList.add('show'); success.style.display='block'; success.focus(); }
  });
  if(sendAnother){
    sendAnother.addEventListener('click', function(){
      if(success){ success.classList.remove('show'); success.style.display='none'; }
      form.style.display='grid';
      form.reset();
      form.querySelectorAll('[aria-invalid]').forEach(function(el){ el.removeAttribute('aria-invalid'); });
      form.querySelectorAll('.field-error').forEach(function(el){ el.textContent=''; });
      const first = form.querySelector('input, select, textarea');
      if(first) first.focus();
    });
  }
})();
