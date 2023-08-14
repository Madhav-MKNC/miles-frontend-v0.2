// Function to update the local cache
function saveDataInLocalCache(user, goal, preamble, chats) {
  const existingData = JSON.parse(localStorage.getItem("miles#13082023")) || {
    conversation_data: {},
    toggle_state: "",
    self_user: "",
  };

  existingData.conversation_data[user] = [goal, preamble, chats, []];
  localStorage.setItem("miles#13082023", JSON.stringify(existingData));
}

// Function to get data from local cache
function getConversationData(user, arg) {
  const data = localStorage.getItem("miles#13082023");
  if (data) {
    try {
      const parsedData = JSON.parse(data);
      const conversationData = parsedData.conversation_data[user];
      if (conversationData && conversationData.length > 1) {
        if (arg === "goal") {
          return conversationData[0].trim();
        } else if (arg === "preamble") {
          return conversationData[1].trim();
        }
      }
    } catch (error) {
      console.error("Error parsing data from localStorage:", error);
      return "";
    }
  }
  return "";
}

// set goal and preamble
async function sendGoalToServer(goal) {
  // fetching otherUser
  otherUser = document.querySelector("._3W2ap")
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

  // goal => preamble (from server)
  const response = await fetch("http://localhost/set_goal", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      goal: goal,
      preamble: getConversationData(otherUser, "preamble"),
      chats: chats,
    }),
  });

  const result = await response.json();
  const preamble = result.preamble;

  // updating data in local cache
  saveDataInLocalCache(otherUser, goal, preamble, chats);

  return "";
}

// main
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.goalText) {
    console.log("setting goal...");
    sendGoalToServer(message.goalText).then((response) => {
      sendResponse({ response: response });
      return true; // This keeps the message channel open until sendResponse is called
    });
  }
});
