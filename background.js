chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.backup) {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ["content.js"]
      });
    });
  }
  if (message.sendgoal) {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, {goalText: message.goalText});
    });
  }
});
