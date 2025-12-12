window.addEventListener("DOMContentLoaded", () => main());

const main = () => {
  console.log("app_started");
  init_app();
  attach_event_listeners();
};

const init_app = async () => {
  const api_key = await getfromstorage("api_key");
  const photo_base64 = await getfromstorage("photo");
  if (api_key) {
    ///toggle the statsu and hide the api section
    render_api_key_save(api_key);
  }
  if (photo_base64) {
    renderPhotoPreview(photo_base64);
  }

  updateOverallStatus(api_key, photo_base64);
};
const updateOverallStatus = (api_key, photo) => {
  if (api_key === null) {
    show_status("api key is missing");
    return;
  }
  if (photo === null) {
    show_status("user photo is missing");
    return;
  }
  show_status("lets go to myntra");
};
const attach_event_listeners = async () => {
  document
    .getElementById("save-api-btn")
    .addEventListener("click", save_api_key);
  document.getElementById("upload-btn").addEventListener("click", () => {
    document.getElementById("upload-photo").click();
  });
  document
    .getElementById("upload-photo")
    .addEventListener("change", upload_photo);
};
const savetostorage = async (key, value) => {
  try {
    await chrome.storage.sync.set({ [key]: value });
  } catch (e) {
    console.log("[getfromstorage] [Error]:", e);
    throw e;
  }
};

const getfromstorage = async (key) => {
  try {
    const value = await chrome.storage.sync.get(key);
    return value[key] || null;
  } catch (e) {
    console.log("[getfromstorage] [Error]:", e);
  }
};
const removeFromStorage = async (key) => {
  try {
    await chrome.storage.local.remove(key);
    console.log(`Removed ${key} from storage`);
  } catch (error) {
    console.error("Storage error:", error);
  }
};

const render_api_key_save = () => {
  document.getElementById("api-section").style.display = "none";
  document.getElementById("photo-section").classList.remove("hidden");
  show_status("Api key saved");
};

const show_status = (msg) => {
  document.getElementById("status-message").innerText = msg;
};
const save_api_key = async () => {
  const api_key = document.getElementById("api-key-input").value;
  await savetostorage("api_key", api_key);
  render_api_key_save();
};
const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);

    reader.readAsDataURL(file);
  });
};
const upload_photo = async (e) => {
  alert("here");
  const file = e.target.files[0];
  if (!file) return;
  const base64 = await convertToBase64(file);

  await savetostorage("photo", base64);
  show_status("your photot is saved");
};

const renderPhotoPreview = (base64) => {
  console.log(base64);
};
