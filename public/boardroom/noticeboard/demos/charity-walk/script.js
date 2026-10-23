document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('message-form');
  const status = document.getElementById('form-status');

  const noteDialog = document.getElementById('trail-note-dialog');
  const mobileForm = document.getElementById('mobile-message-form');
  const confirmation = document.getElementById('trail-note-confirmation');
  let noteTrigger;
  const openNote = (compose, trigger) => {
    noteTrigger = trigger;
    mobileForm.hidden = !compose;
    confirmation.hidden = compose;
    noteDialog.querySelector('h2').textContent = compose ? 'Leave Kōkiri a trail note.' : 'Thank you for trying it.';
    noteDialog.showModal();
    (compose ? mobileForm.querySelector('input') : confirmation.querySelector('button')).focus({ preventScroll: true });
  };
  const validateNote = (target) => {
    const fields = ['name', 'email', 'message'].map(name => target.elements.namedItem(name));
    const empty = fields.find(field => !field.value.trim());
    if (empty) { empty.focus({ preventScroll: true }); return false; }
    return target.reportValidity();
  };
  if (form && status) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!validateNote(form)) { status.textContent = 'Please complete all three fields.'; return; }
      status.textContent = '';
      openNote(false, event.submitter || form.querySelector('button'));
    });
  }
  document.querySelector('[data-compose-note]').addEventListener('click', event => openNote(true, event.currentTarget));
  mobileForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!validateNote(mobileForm)) {
      mobileForm.querySelector('.trail-note-error').textContent = 'Please complete all three fields.';
      return;
    }
    mobileForm.hidden = true;
    confirmation.hidden = false;
    noteDialog.querySelector('h2').textContent = 'Thank you for trying it.';
    confirmation.querySelector('button').focus({ preventScroll: true });
  });
  noteDialog.querySelectorAll('[data-close-note]').forEach(button => button.addEventListener('click', () => noteDialog.close()));
  noteDialog.addEventListener('close', () => {
    if (noteTrigger?.isConnected) noteTrigger.focus({ preventScroll: true });
  });

  const mobileViews = Array.from(document.querySelectorAll('[data-mobile-view]'));
  const viewButtons = document.querySelectorAll('[data-open-view]');
  let originatingTile;
  const showMobileView = (name, trigger) => {
    const target = mobileViews.find(view => view.dataset.mobileView === name);
    if (!target) return;
    if (name !== 'hub') originatingTile = trigger;
    target.hidden = false;
    target.inert = false;
    target.setAttribute('aria-hidden', 'false');
    target.classList.add('is-active');
    const focusTarget = name === 'hub' ? originatingTile : target.querySelector('[data-open-view="hub"]');
    focusTarget?.focus({ preventScroll: true });
    mobileViews.filter(view => view !== target).forEach(view => {
      view.inert = true;
      view.classList.remove('is-active');
      view.setAttribute('aria-hidden', 'true');
      window.setTimeout(() => {
        if (!view.classList.contains('is-active')) view.hidden = true;
      }, 360);
    });
  };
  mobileViews.forEach(view => { view.inert = !view.classList.contains('is-active'); });
  viewButtons.forEach(button => {
    button.addEventListener('click', () => showMobileView(button.dataset.openView, button));
  });

  const diaryEntries = Array.from(document.querySelectorAll('.mobile-diary-entry'));
  const diaryCurrent = document.querySelector('[data-diary-current]');
  let diaryIndex = 0;
  const showDiaryEntry = (nextIndex) => {
    diaryIndex = (nextIndex + diaryEntries.length) % diaryEntries.length;
    diaryEntries.forEach((entry, index) => {
      const current = index === diaryIndex;
      entry.classList.toggle('is-current', current);
      entry.setAttribute('aria-hidden', String(!current));
      entry.inert = !current;
    });
    if (diaryCurrent) diaryCurrent.textContent = String(diaryIndex + 1);
  };

  showDiaryEntry(0);

  document.querySelectorAll('[data-diary-step]').forEach((button) => {
    button.addEventListener('click', () => showDiaryEntry(diaryIndex + Number(button.dataset.diaryStep)));
  });

  let touchStartX = 0;
  const diaryStack = document.querySelector('.mobile-diary-stack');
  if (diaryStack) {
    diaryStack.addEventListener('touchstart', (event) => {
      touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });
    diaryStack.addEventListener('touchend', (event) => {
      const distance = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(distance) > 45) showDiaryEntry(diaryIndex + (distance < 0 ? 1 : -1));
    }, { passive: true });
  }
});
