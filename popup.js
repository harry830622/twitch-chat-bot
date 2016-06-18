const toggleAutoReplyBtn = document.querySelector('button#toggle-auto-reply');
const defaultReplyInput = document.querySelector('input#default-reply');
const updateDefaultReplyBtn = document.querySelector('button#update-default-reply');

let isAutoReplyEnabled = undefined;

chrome.storage.sync.get(
  ['isAutoReplyEnabled', 'defaultReply'],
  (obj) => {
    isAutoReplyEnabled = obj.isAutoReplyEnabled;
    if (isAutoReplyEnabled) {
      toggleAutoReplyBtn.innerHTML = 'Disable auto reply';
    } else {
      toggleAutoReplyBtn.innerHTML = 'Enable auto reply';
    }

    defaultReplyInput.value = obj.defaultReply;
  }
);

toggleAutoReplyBtn.addEventListener('click', (e) => {
  isAutoReplyEnabled = !isAutoReplyEnabled;
  if (isAutoReplyEnabled) {
    toggleAutoReplyBtn.innerHTML = 'Disable auto reply';
  } else {
    toggleAutoReplyBtn.innerHTML = 'Enable auto reply';
  }

  chrome.storage.sync.set({isAutoReplyEnabled});

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

  const replyToUpdate = defaultReplyInput.value.trim();

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
