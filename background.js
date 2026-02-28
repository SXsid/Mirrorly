chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(["apiKey"], (result) => {
    if (!result.ApiKey) {
      chrome.tabs.create({ url: "options.html" });
    }
  });
});

chrome.runtime.onMessage.addListener((msg, sender, sednResponse) => {
  switch (msg.type) {
    case "GENERATE":
      console.log(msg.payload);
      sednResponse(True);
      break;

    default:
      console.log("Invalid message");
      break;
  }
});
