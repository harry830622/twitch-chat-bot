const toggleAutoReplyBtn = document.querySelector('#toggle-auto-reply');
const defaultReplyInput = document.querySelector('#default-reply');
const updateDefaultReplyBtn = document.querySelector('#update-default-reply');
const addRuleBtn = document.querySelector('#add-rule');
const clearAllRulesBtn = document.querySelector('#clear-all-rules');
const rulesDiv = document.querySelector('#rules');

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
  const textIncludedInput = document.querySelector('#rule-text-included');
  const replyInput = document.querySelector('#rule-reply');

  const textIncluded = textIncludedInput.value.trim();
  const reply = replyInput.value.trim();
  if (textIncluded === '' || reply === '') {
    return;
  }

  textIncludedInput.value = '';
  replyInput.value = '';

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
  rulesDiv.innerHTML = '';

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
  const textIncludedCol = document.createElement('div');
  textIncludedCol.className += ' column is-5';
  textIncludedCol.innerHTML = textIncluded;

  const replyCol = document.createElement('div');
  replyCol.className += ' column is-5';
  replyCol.innerHTML = reply;

  // TODO: Add delete button.

  const ruleRow = document.createElement('div');
  ruleRow.className += ' columns is-mobile';
  ruleRow.appendChild(textIncludedCol);
  ruleRow.appendChild(replyCol);

  rulesDiv.appendChild(ruleRow);
};
