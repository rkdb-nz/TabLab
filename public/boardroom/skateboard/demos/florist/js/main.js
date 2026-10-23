const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('[data-scroll]').forEach(link => {
  link.addEventListener('click', event => {
    const target = document.getElementById(link.dataset.scroll);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({behavior: reducedMotion() ? 'instant' : 'smooth', block: 'start'});
  });
});
// Retire data saved by the previous demo; enquiry details are no longer stored.
try { localStorage.removeItem('ash_oak_florist_enquiry'); } catch {}
document.querySelector('[data-demo-contact]')?.addEventListener('click', () => {
  const result = document.getElementById('contact-result');
  result.hidden = false;
  result.textContent = 'This is a demonstration. No email has been sent.';
});
const form = document.getElementById('enquiryForm');
if (form) {
  const summary = document.getElementById('form-error');
  const fields = [...form.querySelectorAll('input,select,textarea')];
  function clearError(field) {
    field.setCustomValidity('');
    field.removeAttribute('aria-invalid');
    const error = document.getElementById(field.name + '-error');
    if (error) { error.hidden = true; error.textContent = ''; }
  }
  fields.forEach(field => field.addEventListener('input', () => {
    clearError(field);
    if (!form.querySelector('[aria-invalid="true"]')) summary.hidden = true;
  }));
  form.addEventListener('submit', event => {
    event.preventDefault();
    let firstInvalid;
    fields.forEach(field => {
      clearError(field);
      if (field.type === 'text' || field.type === 'email') field.value = field.value.trim();
      let message = '';
      if (field.name === 'name' && !field.value) message = 'Please enter your name.';
      else if (field.name === 'email' && !field.value) message = 'Please enter your email address.';
      else if (field.name === 'email' && field.validity.typeMismatch) message = 'Please enter a valid email address.';
      else if (!field.validity.valid) message = 'Please check this field.';
      if (message) {
        field.setAttribute('aria-invalid','true');
        field.setCustomValidity(message);
        const error = document.getElementById(field.name + '-error');
        if (error) { error.textContent = message; error.hidden = false; }
        firstInvalid ||= field;
      }
    });
    if (firstInvalid) {
      summary.hidden = false;
      summary.textContent = 'Please correct the highlighted fields.';
      firstInvalid.focus();
      return;
    }
    summary.hidden = true;
    window.location.href = 'success.html';
  });
}
