export function generate(prompt) {
  chrome.storage.sync.get(["apiKey"], (syncData) => {
    chrome.storage.local.get(["referenceImages"], (localData) => {
      if (!syncData.apiKey || !localData.referenceImages?.length) {
        alert("Please configure API key and images first.");
        return;
      }

      const payload = {
        apiKey: syncData.apiKey,
        images: localData.referenceImages,
        prompt,
      };
      // 🔥 Your generation logic goes here
      console.log("Generating with:", payload);

      chrome.runtime.sendMessage(
        {
          type: "GENERATE",
          payload: payload,
        },
        (response) => {
          if (response?.error) {
            console.error(response.error);
            return;
          }

          console.log("Gemini response:", response.data);
          document.getElementById("output").innerText = response.data;
        },
      );
    });
  });
}
