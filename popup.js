document.addEventListener("DOMContentLoaded", init);

function init() {
  loadStatus();
  loadPreviews();

  document
    .getElementById("settingsBtn")
    .addEventListener("click", openSettings);

  document.getElementById("resetBtn").addEventListener("click", resetConfig);

  document.getElementById("generateBtn").addEventListener("click", generate);
}

function loadStatus() {
  const statusBox = document.getElementById("statusBox");

  chrome.storage.sync.get(["apiKey"], (syncData) => {
    chrome.storage.local.get(["referenceImages"], (localData) => {
      const hasApiKey = !!syncData.apiKey;
      const images = localData.referenceImages || [];

      statusBox.innerHTML = `
        <span class="${hasApiKey ? "ok" : "bad"}">
          ${hasApiKey ? "✔ API key configured" : "✖ API key missing"}
        </span>
        <span class="${images.length ? "ok" : "bad"}">
          ${
            images.length
              ? `✔ ${images.length} reference images loaded`
              : "✖ No reference images"
          }
        </span>
      `;
    });
  });
}

function loadPreviews() {
  const grid = document.getElementById("previewGrid");
  grid.innerHTML = "";

  chrome.storage.local.get(["referenceImages"], (data) => {
    const images = data.referenceImages || [];

    if (images.length === 0) {
      grid.innerHTML = `<div class="empty">No reference images configured</div>`;
      return;
    }

    images.forEach((src) => {
      const wrapper = document.createElement("div");
      wrapper.className = "preview";

      const img = document.createElement("img");
      img.src = src;

      wrapper.appendChild(img);
      grid.appendChild(wrapper);
    });
  });
}

/* ------------------ ACTIONS ------------------ */
function openSettings() {
  chrome.runtime.openOptionsPage();
}

function generate() {
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
