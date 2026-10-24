(function(){
  const form=document.getElementById('hireForm'), success=document.getElementById('formSuccess'), again=document.getElementById('sendAnotherBtn');
  if(!form)return;
  const fields=Array.from(form.querySelectorAll('input,select,textarea'));
  fields.forEach(function(input){
    let error=input.parentElement.querySelector('.field-error');
    if(!error){error=document.createElement('div');error.className='field-error';input.after(error);}
    error.id=input.id+'Error';error.setAttribute('aria-live','polite');input.setAttribute('aria-describedby',error.id);
  });
  form.addEventListener('submit',function(e){
    e.preventDefault();let first=null;
    fields.forEach(function(input){
      const error=document.getElementById(input.id+'Error');
      let message='';
      if(input.required&&!input.value.trim())message='This field is required.';
      else if(!input.validity.valid){
        message=input.type==='email'?'Enter a valid email address.':input.type==='number'?'Enter a whole number from 1 to 200.':'Enter a valid value.';
      }
      error.textContent=message;
      if(message){input.setAttribute('aria-invalid','true');if(!first)first=input;}else input.removeAttribute('aria-invalid');
    });
    if(first){first.focus();return;}
    form.hidden=true;form.style.display='none';success.classList.add('show');success.style.display='block';success.focus();
  });
  again.addEventListener('click',function(){
    success.classList.remove('show');success.style.display='none';form.hidden=false;form.style.display='grid';form.reset();
    fields.forEach(function(input){input.removeAttribute('aria-invalid');document.getElementById(input.id+'Error').textContent='';});fields[0].focus();
  });
})();
