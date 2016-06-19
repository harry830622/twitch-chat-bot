const defaultDefaultReply = '安安，住哪，幾歲，給虧嗎？';

let defaultReply = defaultDefaultReply;
let reactionTimeOfReply = 500; // TODO: Make bot have some reaction time.
let rules = {};

chrome.storage.sync.get(
  'defaultReply',
  (obj) => {
    defaultReply = obj.defaultReply || defaultDefaultReply;
  }
);

chrome.storage.sync.get('rules', (obj) => {rules = obj.rules;});

let intervalId = undefined;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'ToggleAutoReply':
      if (request.isAutoReplyEnabled) {
        intervalId = enableAutoReply();

        chrome.storage.sync.set({intervalId});
      } else {
        chrome.storage.sync.get(
          'intervalId',
          (obj) => {
            intervalId = intervalId || obj.intervalId;
            clearInterval(intervalId);
          }
        );
      }
      break;
    case 'UpdateDefaultReply':
      if (request.replyToUpdate === '') {
        defaultReply = defaultDefaultReply;
      } else {
        defaultReply = request.replyToUpdate;
      }

      chrome.storage.sync.set({defaultReply});
      break;
    case 'AddRule':
      addRule(request.textIncluded, request.reply);
      break;
    case 'RemoveRule':
      removeRule(request.removedId);
      break;
    case 'ClearAllRules':
      clearAllRules();
      break;
    default:
      break;
  }
});

const enableAutoReply = () => {
  let lastChatLineLIId = undefined;

  const intervalTime = 1000;
  return setInterval(() => {
    const chatBoxUL = document.querySelector('ul.chat-lines');

    if (chatBoxUL === null) {
      return;
    }

    const chatLineLIs = chatBoxUL.querySelectorAll('li.chat-line');

    const newChatLineLIs = [];
    for (let i = chatLineLIs.length - 1; i >= 0; --i) {
      if (lastChatLineLIId !== undefined && chatLineLIs[i].id === lastChatLineLIId) {
        break;
      }

      newChatLineLIs.splice(0, 0, chatLineLIs[i]);
    }
    lastChatLineLIId = chatLineLIs[chatLineLIs.length - 1].id;

    const chatMessageTextarea = document.querySelector('div.chat-interface textarea.chat_text_input');
    const chatSendMessageBtn = document.querySelector('div.chat-interface div.chat-buttons-container button');

    for (let i = 0; i < newChatLineLIs.length; ++i) {
      const fromText = newChatLineLIs[i].querySelector('span.from').innerText;

      const selfUserName = document.querySelector('dl dt span.js-username').innerText;
      if (fromText.trim() === '' || fromText === 'Jtv' || fromText === selfUserName) {
        continue;
      }

      const messageText = newChatLineLIs[i].querySelector('span.message').innerText;

      let isMatch = false;
      for (let key in rules) {
        if (messageText.includes(key)) {
          isMatch = true;

          const reply = rules[key];

          chatMessageTextarea.focus();
          chatMessageTextarea.value = fromText + ' ' + reply;
          chatSendMessageBtn.focus();
          chatSendMessageBtn.click();
        }
      }

      if (!isMatch) {
        chatMessageTextarea.focus();
        chatMessageTextarea.value = fromText + ' ' + defaultReply;
        chatSendMessageBtn.focus();
        chatSendMessageBtn.click();
      }

      // console.log(fromText + ': ' + messageText);
    }
  }, intervalTime);
};

const addRule = (textIncluded, reply) => {
  rules[textIncluded] = reply;

  saveRules();
};

const removeRule = (id) => {
  delete rules[id];

  saveRules();
};

const clearAllRules = () => {
  rules = {};

  saveRules();
};

const saveRules = () => {
  chrome.storage.sync.set({rules});
};
