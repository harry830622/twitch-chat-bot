const intervalTime = 1000;

let lastChatLineLIId = undefined;

const intervalId = setInterval(() => {
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

    // TODO: Exclude messages from myself.
    if (fromText === '') {
      continue;
    }

    const messageText = newChatLineLIs[i].querySelector('span.message').innerText;

    chatMessageTextarea.focus();
    chatMessageTextarea.value = 'Hello @' + fromText;
    chatSendMessageBtn.focus();
    chatSendMessageBtn.click();

    console.log(fromText + ': ' + messageText);
  }
}, intervalTime);
