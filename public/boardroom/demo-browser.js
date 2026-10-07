(() => {
  const oldBack = document.querySelector('.foundry-global-back');
  if (!oldBack) return;
  // Replace the history listener: this always leaves the example, including
  // after visitors follow links within a multi-page iframe.
  const back = oldBack.cloneNode(true);
  back.setAttribute('aria-label', 'Back to gallery');
  back.title = 'Back to gallery';
  back.innerHTML = '<span aria-hidden="true">←</span><span>Back to gallery</span>';
  oldBack.replaceWith(back);
  back.addEventListener('click', () => { location.href = '../../index.html'; });
})();
