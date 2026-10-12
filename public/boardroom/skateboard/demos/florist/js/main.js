
document.querySelectorAll('[data-scroll]').forEach(el=>{
  el.addEventListener('click', e=>{
    e.preventDefault();
    const id = el.dataset.scroll;
    const node = document.getElementById(id);
    if(node) node.scrollIntoView({behavior:'smooth', block:'start'});
  });
});
const form = document.getElementById('enquiryForm');
if(form){
  form.addEventListener('submit', e=>{
    e.preventDefault();
    if (!form.reportValidity()) return;
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    if(!data.name.trim() || !data.email.trim()){ alert('Please fill name and email'); return; }
    localStorage.setItem('ash_oak_florist_enquiry', JSON.stringify(data));
    window.location.href='success.html';
  });
}
