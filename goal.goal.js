chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.goalText) {
      console.log("sending goal...")
      sendGoalToServer(message.goalText).then(response => {
        sendResponse({response: response});
        return true; // This keeps the message channel open until sendResponse is called
      });
    }

    console.log("no goal found")
  });
  
  async function sendGoalToServer(data) {
    console.log("sent goal");

    // saving logs to local cache
    const otherUser = document.querySelector("._3W2ap") ? document.querySelector("._3W2ap").innerText : '';
    localStorage.setItem(otherUser, data);

    const response = await fetch('http://localhost/set_goal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({text: data})
    });
    const result = await response.json();
    return result.response;
  }
  
