document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get(["ApiKey"], ({ ApiKey }) => {
    if (!ApiKey) {
      chrome.runtime.openOptionsPage();
    }
  });
});
