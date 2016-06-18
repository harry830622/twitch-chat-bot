const toggleAutoReplyBtn = document.querySelector('button#toggle-auto-reply');
const updateDefaultReplyBtn = document.querySelector('button#update-default-reply');

// TODO: Use chrome.storage!
let isAutoReplyEnabled = false;

toggleAutoReplyBtn.addEventListener('click', (e) => {
  const btn = e.target;

  if (isAutoReplyEnabled) {
    isAutoReplyEnabled = false;
    btn.innerHTML = 'Enable auto reply';
  } else {
    isAutoReplyEnabled = true;
    btn.innerHTML = 'Disable auto reply';
  }

  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      {
        type: 'ToggleAutoReply',
        isAutoReplyEnabled,
      }
    );
  });
});

updateDefaultReplyBtn.addEventListener('click', (e) => {
  const btn = e.target;

  const replyToUpdate = document.querySelector('input#default-reply').value.trim();

  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      {
        type: 'UpdateDefaultReply',
        replyToUpdate,
      }
    );
  });
});
