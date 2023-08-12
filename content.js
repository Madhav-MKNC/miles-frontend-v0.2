// Function to get the goal of a specific user from the local cache
function getGoalFromLocalCache(user) {
  const data = localStorage.getItem("miles#13082023");
  if (data) {
    const parsedData = JSON.parse(data);
    const conversationData = parsedData.conversation_data[user];
    if (conversationData && conversationData.length > 0) {
      return conversationData[0].trim(); // Return the goal, which is the first element of the array
    }
  }
  return "";
}

// fetch chats, thisUser, otherUser and isGroup
function fetchMessages() {
  console.log("generating reply...");

  const chatElements = document.querySelectorAll(".copyable-text");
  const otherUser = document.querySelector("._3W2ap")
    ? document.querySelector("._3W2ap").innerText
    : "";
  let thisUser = "";

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
      }

      return {
        sender: username,
        message: messageText,
      };
    });

  // If there are more than two users, including "thisUser", then it's a group chat
  const isGroup = usernames.size > 2;

  // Sending goal for this conversation (if any)
  const goal = getGoalFromLocalCache(user);

  return { thisUser, otherUser, isGroup, goal, chats };
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
  const messages = fetchMessages();
  const reply = await sendToServer(messages);
  placeSuggestedReply(reply);
})();
