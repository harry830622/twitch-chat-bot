const twitchURL = 'https://www.twitch.tv';

let activatedTabId = undefined;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set(
    {
      isAutoReplyEnabled: false,
      intervalId: undefined,
      defaultReply: undefined,
      rules: {},
    }
  );
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  activatedTabId = activeInfo.tabId;

  chrome.tabs.get(activatedTabId, (tab) => {
    if (tab.status === 'complete' && tab.url.includes(twitchURL)) {
      chrome.pageAction.show(activatedTabId);
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId === activatedTabId && changeInfo.status === 'complete' && tab.url.includes(twitchURL)) {
    chrome.pageAction.show(activatedTabId);
  }
});
