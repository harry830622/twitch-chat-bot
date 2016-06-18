const toggleAutoReplyBtn = document.querySelector('button#toggle-auto-reply');

let isEnabled = false;
toggleAutoReplyBtn.addEventListener('click', (e) => {
  const btn = e.target;

  if (isEnabled) {
    isEnabled = false;
    btn.innerHTML = 'Enable auto reply';
  } else {
    isEnabled = true;
    btn.innerHTML = 'Disable auto reply';
  }
});
