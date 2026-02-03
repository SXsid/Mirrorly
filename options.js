document.addEventListener("DOMContentLoaded", main);
function main() {
  let uploadedImages = [];
  const MAX_IMAGES = 3;
  const MIN_IMAGES = 1;

  const apiKeyInput = document.getElementById("apiKey");
  const uploadArea = document.getElementById("uploadArea");
  const fileInput = document.getElementById("fileInput");
  const previewGrid = document.getElementById("previewGrid");
  const imageCount = document.getElementById("imageCount");
  const saveBtn = document.getElementById("saveBtn");
  const resetBtn = document.getElementById("resetBtn");
  const statusMessage = document.getElementById("statusMessage");

  chrome.storage.sync.get(["apiKey"], (data) => {
    if (data.apiKey) apiKeyInput.value = data.apiKey;
  });

  chrome.storage.local.get(["referenceImages"], (data) => {
    if (data.referenceImages) {
      uploadedImages = data.referenceImages;
      updatePreview();
    }
  });
  // Upload area click
  uploadArea.addEventListener("click", () => {
    if (uploadedImages.length < MAX_IMAGES) {
      fileInput.click();
    }
  });

  // Drag and drop handlers
  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadArea.classList.add("dragover");
  });

  uploadArea.addEventListener("dragleave", () => {
    uploadArea.classList.remove("dragover");
  });

  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadArea.classList.remove("dragover");

    if (uploadedImages.length < MAX_IMAGES) {
      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/"),
      );
      handleFiles(files);
    }
  });

  // File input change
  fileInput.addEventListener("change", (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
    fileInput.value = ""; // Reset input
  });

  // Handle file uploads
  function handleFiles(files) {
    const remainingSlots = MAX_IMAGES - uploadedImages.length;
    const filesToProcess = files.slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (uploadedImages.length < MAX_IMAGES) {
          uploadedImages.push(e.target.result);
          updatePreview();
        }
      };
      reader.readAsDataURL(file);
    });

    if (files.length > remainingSlots) {
      showStatus(`Only ${remainingSlots} more image(s) allowed`, "error");
    }
  }

  // Update preview grid
  function updatePreview() {
    previewGrid.innerHTML = "";

    uploadedImages.forEach((imgData, index) => {
      const previewItem = document.createElement("div");
      previewItem.className = "preview-item";

      const img = document.createElement("img");
      img.src = imgData;

      const removeBtn = document.createElement("button");
      removeBtn.className = "remove-btn";
      removeBtn.innerHTML = "×";
      removeBtn.onclick = () => removeImage(index);

      previewItem.appendChild(img);
      previewItem.appendChild(removeBtn);
      previewGrid.appendChild(previewItem);
    });

    updateImageCount();
  }

  // Remove image
  function removeImage(index) {
    uploadedImages.splice(index, 1);
    updatePreview();
  }

  // Update image count
  function updateImageCount() {
    const count = uploadedImages.length;
    imageCount.textContent = `${count} / ${MAX_IMAGES} images uploaded`;

    if (count >= MAX_IMAGES) {
      imageCount.classList.add("max");
      uploadArea.style.opacity = "0.5";
      uploadArea.style.cursor = "not-allowed";
    } else {
      imageCount.classList.remove("max");
      uploadArea.style.opacity = "1";
      uploadArea.style.cursor = "pointer";
    }
  }

  // Save settings
  saveBtn.addEventListener("click", () => {
    const apiKey = apiKeyInput.value.trim();

    if (!apiKey) {
      showStatus("Please enter an API key", "error");
      return;
    }

    if (uploadedImages.length < MIN_IMAGES) {
      showStatus(`Please upload at least ${MIN_IMAGES} image(s)`, "error");
      return;
    }

    chrome.storage.sync.set({ apiKey });

    chrome.storage.local.set({
      referenceImages: uploadedImages,
    });
    showStatus("Settings saved successfully", "success");
  });

  // Reset settings
  resetBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to reset all settings?")) {
      apiKeyInput.value = "";
      uploadedImages = [];
      updatePreview();

      chrome.storage.sync.remove(["apiKey", "referenceImages"], () => {
        showStatus("Settings reset successfully", "success");
      });
    }
  });

  // Show status message
  function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;

    setTimeout(() => {
      statusMessage.className = "status-message";
    }, 3000);
  }
}
