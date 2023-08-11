chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.goalText) {
      sendGoalToServer(message.goalText).then(response => {
        sendResponse({response: response});
        return true; // This keeps the message channel open until sendResponse is called
      });
    }
  });
  
  async function sendGoalToServer(data) {
    console.log("sent goal");
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
  
