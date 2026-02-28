function extractProductImages() {
  const images = new Set();

  document.querySelectorAll("picture img").forEach((img) => {
    if (img.src && img.src.includes("myntassets.com")) {
      images.add(img.src);
    }

    if (img.srcset) {
      img.srcset.split(",").forEach((src) => {
        const clean = src.trim().split(" ")[0];
        if (clean.includes("myntassets.com") && images.size < 4) {
          images.add(clean);
        }
      });
    }
    chrome.storage.local.set({
      myntraImages: [...images],
    });
  });
}

extractProductImages();
