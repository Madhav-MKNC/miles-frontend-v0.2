chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.goalText) {
    console.log("setting goal...")
    sendGoalToServer(message.goalText).then(response => {
      sendResponse({response: response});
      return true; // This keeps the message channel open until sendResponse is called
    });
  }
});

async function sendGoalToServer(data) {
  console.log("goal set");

  // saving logs to local cache
  const otherUser = document.querySelector("._3W2ap") ? document.querySelector("._3W2ap").innerText : '';
  localStorage.setItem(otherUser, data);

  return "";
}

