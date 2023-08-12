chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.goalText) {
    console.log("setting goal...");
    sendGoalToServer(message.goalText).then((response) => {
      sendResponse({ response: response });
      return true; // This keeps the message channel open until sendResponse is called
    });
  }
});


// Function to update the local cache
function saveDataInLocalCache(user, goal, chats) {
  const existingData = JSON.parse(localStorage.getItem("miles#13082023")) || {
    conversation_data: {},
  };

  existingData.conversation_data[user] = [goal, chats];
  localStorage.setItem("miles#13082023", JSON.stringify(existingData));
}


async function sendGoalToServer(goal) {
  console.log("goal set");

  // fetching otherUser
  const otherUser = document.querySelector("._3W2ap")
    ? document.querySelector("._3W2ap").innerText
    : "";

  // fetching coversation with this otherUser
  const chatElements = document.querySelectorAll(".copyable-text");
  const chats = Array.from(chatElements)
    .filter((element) => element.getAttribute("data-pre-plain-text")) // Filter out elements with no 'data-pre-plain-text' attribute
    .map((element) => {
      const info = element.getAttribute("data-pre-plain-text");

      // const username = info.trim().slice(20, -1);
      const usernameStartIndex = info.indexOf("] ") + 2;
      const usernameEndIndex = info.lastIndexOf(":");
      const username = info.slice(usernameStartIndex, usernameEndIndex);

      const messageElement = element.querySelector(".selectable-text");
      const messageText = messageElement ? messageElement.innerText : "";

      return {
        sender: username,
        message: messageText,
      };
    });
  
  // updating data in local cache
  saveDataInLocalCache(otherUser, goal, chats);

  return "";
}
