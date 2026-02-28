import { generate } from "./generate.js";
document.addEventListener("DOMContentLoaded", init);

function init() {
  loadStatus();
  loadReference();
  loadPreviews();

  document
    .getElementById("settingsBtn")
    .addEventListener("click", openSettings);

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
function loadReference() {
  const grid = document.getElementById("referenceGrid");
  var images = [];

  chrome.storage.local.get(["myntraImages"], (data) => {
    images = data.myntraImages;
    if (images.length === 0) {
      grid.innerHTML = "";
      grid.innerHTML = `<div class="empty">No reference images configured</div>`;
      return;
    }
    images.forEach((src) => {
      const wrapper = document.createElement("div");
      wrapper.className = "preview";
      const img = document.createElement("img");
      img.srcset = src;
      wrapper.appendChild(img);
      grid.appendChild(wrapper);
    });
  });
}
function loadPreviews() {
  const grid = document.getElementById("previewGrid");
  grid.innerHTML = "";

  const images = [];
  chrome.storage.local.get(["referenceImages"], (data) => {
    const images = data.referenceImages;

    if (images.length === 0) {
      grid.innerHTML = `<div class="empty">You image is not configured</div>`;
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
