chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
  if (details['url'].includes('openai.com/playground')) {
    chrome.tabs.executeScript(null, {file: "content.js"});
  }
});