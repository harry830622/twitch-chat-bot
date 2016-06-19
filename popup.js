const toggleAutoReplyBtn = document.querySelector('button#toggle-auto-reply');
const defaultReplyInput = document.querySelector('input#default-reply');
const updateDefaultReplyBtn = document.querySelector('button#update-default-reply');
const addRuleBtn = document.querySelector('button#add-rule');
const clearAllRulesBtn = document.querySelector('button#clear-all-rules');

let isAutoReplyEnabled = undefined;

chrome.storage.sync.get(
  ['isAutoReplyEnabled', 'defaultReply', 'rules'],
  (obj) => {
    isAutoReplyEnabled = obj.isAutoReplyEnabled;
    if (isAutoReplyEnabled) {
      toggleAutoReplyBtn.innerHTML = 'Disable auto reply';
    } else {
      toggleAutoReplyBtn.innerHTML = 'Enable auto reply';
    }

    defaultReplyInput.value = obj.defaultReply;

    const rules = obj.rules;
    for (let key in rules) {
      displayRule(key, rules[key]);
    }
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

addRuleBtn.addEventListener('click', (e) => {
  const textIncludedInput = document.querySelector('input#rule-text-included');
  const replyInput = document.querySelector('input#rule-reply');

  const textIncluded = textIncludedInput.value.trim();
  const reply = replyInput.value.trim();
  if (textIncluded === '' || reply === '') {
    return;
  }

  displayRule(textIncluded, reply);

  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      {
        type: 'AddRule',
        textIncluded,
        reply,
      }
    );
  });
});

clearAllRulesBtn.addEventListener('click', (e) => {
  // TODO: Remove rule spans.

  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      {
        type: 'ClearAllRules',
      }
    );
  });
});

const displayRule = (textIncluded, reply) => {
  const textIncludedSpan = document.createElement('span');
  textIncludedSpan.innerHTML = textIncluded;

  const replySpan = document.createElement('span');
  replySpan.innerHTML = reply;

  // TODO: Add delete button.

  const ruleDiv = document.createElement('div');
  ruleDiv.appendChild(textIncludedSpan);
  ruleDiv.appendChild(replySpan);

  const rulesDiv = document.querySelector('div#rules-section');
  rulesDiv.appendChild(ruleDiv);
};
