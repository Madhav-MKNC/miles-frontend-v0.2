// updating

// Function to update the local cache
function saveDataInLocalCache(userId, goal, chats) {
  const existingData = JSON.parse(localStorage.getItem("miles#13082023")) || {
    conversation_data: {},
    myname: "mknc",
  };

  existingData.conversation_data[userId] = [goal, chats];
  localStorage.setItem("miles#13082023", JSON.stringify(existingData));
}

// Function to get the local cache
function getDataFromLocalCache() {
  const data = localStorage.getItem("miles#13082023");
  return data ? JSON.parse(data) : null;
}
