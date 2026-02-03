chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(["apiKey"], (result) => {
    if (!result.ApiKey) {
      chrome.tabs.create({ url: "options.html" });
    }
  });
});
