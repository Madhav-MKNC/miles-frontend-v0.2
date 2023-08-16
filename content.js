// Function to get data from local cache
function getConversationData(user, arg) {
  const data = localStorage.getItem("miles");
  if (data) {
    try {
      const parsedData = JSON.parse(data);
      const conversationData = parsedData.conversation_data[user];
      if (conversationData && conversationData.length > 0) {
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

// Save the "self" user name
function saveUserName(self_user) {
  const existingData = JSON.parse(localStorage.getItem("miles")) || {
    conversation_data: {},
    toggle_state: "",
    self_user: "",
  };

  existingData.self_user = self_user;
  localStorage.setItem("miles", JSON.stringify(existingData));
}

// Get the "self" user name
function getUserName() {
  const data = localStorage.getItem("miles");
  if (data) {
    try {
      const parsedData = JSON.parse(data);
      return parsedData.self_user;
    } catch (error) {
      console.error("Error parsing data from localStorage:", error);
      return "";
    }
  }
  return "";
}

// fetch chats, thisUser, otherUser and isGroup
function fetchData() {
  const chatElements = document.querySelectorAll(".copyable-text");
  const otherUser = document.querySelector("._3W2ap")
    ? document.querySelector("._3W2ap").innerText
    : "";
  let thisUser = getUserName() ? getUserName() : "";

  const usernames = new Set();

  const chats = Array.from(chatElements)
    .filter((element) => element.getAttribute("data-pre-plain-text")) // Filter out elements with no 'data-pre-plain-text' attribute
    .map((element) => {
      const info = element.getAttribute("data-pre-plain-text");

      // const username = info.trim().slice(20, -1);
      const usernameStartIndex = info.indexOf("] ") + 2;
      const usernameEndIndex = info.lastIndexOf(":");
      const username = info.slice(usernameStartIndex, usernameEndIndex);
      usernames.add(username); // Add username to a set

      const messageElement = element.querySelector(".selectable-text");
      const messageText = messageElement ? messageElement.innerText : "";

      // If the message is an outgoing message (from "You:"), then set the thisUser
      if (element.closest(".message-out")) {
        thisUser = username;
        saveUserName(thisUser);
      }

      return {
        sender: username,
        message: messageText,
      };
    });

  // If there are more than two users, including "thisUser", then it's a group chat
  const isGroup = usernames.size > 2;

  // Sending goal for this conversation (if any)
  const goal = getConversationData(otherUser, "goal");
  const preamble = getConversationData(otherUser, "preamble");
  console.log("generating reply...");

  /*
  {
    thisUser: string,
    otherUser: string,
    isGroup: boolean,
    goal: string,
    preamble: string,
    chats: array
  }
  */
  return { thisUser, otherUser, isGroup, goal, preamble, chats };
}

// send data to backend
async function sendToServer(data) {
  const response = await fetch("http://localhost/get_reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result.reply;
}

// display generated reply
function placeSuggestedReply(reply) {
  const inputBar = document.querySelector("footer");
  const replyElement = document.createElement("div");
  replyElement.style.backgroundColor = "#101026";
  replyElement.style.opacity = "90%";
  replyElement.style.borderRadius = "5px";
  replyElement.style.padding = "8px";
  replyElement.style.width = "60%";
  replyElement.style.height = "20px";
  replyElement.style.margin = "20px";
  replyElement.style.cursor = "pointer";
  replyElement.innerText = reply;
  inputBar.insertBefore(replyElement, inputBar.firstChild);
  replyElement.addEventListener("click", () => {
    navigator.clipboard.writeText(reply).then(
      function () {
        console.log("Copying to clipboard was successful!");
      },
      function (err) {
        console.error("Could not copy text: ", err);
      }
    );
    replyElement.remove();
  });
}

// main
(async () => {
  const messages = fetchData();
  const reply = await sendToServer(messages);
  placeSuggestedReply(reply);
})();
