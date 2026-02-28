export function generate() {
  chrome.storage.sync.get(["apiKey"], (syncData) => {
    chrome.storage.local.get(["referenceImages"], (localData) => {
      if (!syncData.apiKey || !localData.referenceImages?.length) {
        alert("Please configure API key and images first.");
        return;
      }

      // 🔥 Your generation logic goes here
      console.log("Generating with:", {
        apiKey: syncData.apiKey,
        images: localData.referenceImages.length,
      });
    });
  });
}
