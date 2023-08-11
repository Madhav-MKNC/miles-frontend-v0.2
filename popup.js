document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('backup').addEventListener('click', () => {
    chrome.runtime.sendMessage({backup: true});
  });

  document.getElementById('setgoal').addEventListener('click', function() {
    var goalInput = document.getElementById('myInput').value;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {sendgoal: true, goalText: goalInput}, function(response) {
        console.log(response);
      });
    });
  });
}); 
