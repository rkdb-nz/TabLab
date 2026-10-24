(() => {
 const form=document.getElementById('clementine-book-form');if(!form)return;
 const dialog=document.getElementById('clementine-confirmation'),ok=dialog.querySelector('button'),summary=document.getElementById('enquiry-errors'),submit=form.querySelector('[type=submit]');
 const select=document.getElementById('retreat-choice'),choice=new URLSearchParams(location.search).get('retreat');
 const retreats={woodland:'Woodland Retreat',coastal:'Coastal Retreat',farm:'Farm Retreat',town:'Town Retreat',undecided:'Undecided'};
 if(choice&&retreats[choice])select.value=retreats[choice];
 const fields=[...form.querySelectorAll('input,select,textarea')];
 fields.forEach(input=>{const error=document.createElement('p');error.id=input.id+'-error';error.className='field-error';input.after(error);input.setAttribute('aria-describedby',error.id);});
 form.addEventListener('submit',e=>{
  e.preventDefault();let first=null,count=0;
  fields.forEach(input=>{
   let message='';
   if(input.required&&!input.value.trim())message='Please enter your '+(input.type==='email'?'email address.':'name.');
   else if(!input.validity.valid)message=input.type==='email'?'Enter a valid email address.':input.type==='number'?'Enter a whole number of guests from 1 to 6.':'Enter a valid value.';
   document.getElementById(input.id+'-error').textContent=message;
   if(message){input.setAttribute('aria-invalid','true');if(!first)first=input;count++;}else input.removeAttribute('aria-invalid');
  });
  summary.textContent=count?'Please correct '+count+' '+(count===1?'field.':'fields.'):'';
  if(first){first.focus({preventScroll:true});first.scrollIntoView({block:'center',behavior:'instant'});return;}
  dialog.showModal();dialog.classList.add('is-open');document.body.classList.add('retreat-modal-open');ok.focus();
 });
 ok.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
 dialog.addEventListener('close',()=>{dialog.classList.remove('is-open');document.body.classList.remove('retreat-modal-open');submit.focus();});
})();
