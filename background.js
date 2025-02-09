chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
  if (details.url.includes('openai.com/playground')) {
    chrome.scripting.executeScript({
      target: { tabId: details.tabId },
      files: ['content.js']
    });
  }
});