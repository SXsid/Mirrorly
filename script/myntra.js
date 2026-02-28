function getProductImages() {
  const allPictureImages = [...document.querySelectorAll("picture img")];

  // filter only the ones from myntra's CDN
  const productImages = allPictureImages.filter((img) =>
    img.src.includes("myntassets.com"),
  );

  const imageUrls = productImages.map((img) => img.src);

  console.log("Product images found:", imageUrls);
  return imageUrls;
}

window.addEventListener("load", () => {
  setTimeout(() => {
    getProductImages();
  }, 2000);
});
