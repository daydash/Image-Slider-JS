const compressImage = (url, maxWidth, maxHeight, quality) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = function () {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      // Check if resizing is required
      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;

        if (width > maxWidth) {
          width = maxWidth;
          height = width / aspectRatio;
        }

        if (height > maxHeight) {
          height = maxHeight;
          width = height * aspectRatio;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      // Compress the image quality
      const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);

      resolve(compressedDataUrl);
    };

    img.onerror = function (error) {
      reject(error);
    };

    img.src = url;
  });
};

const fetchImage = async () => {
  const response = await fetch("https://picsum.photos/v2/list");
  const data = await response.json();
  const arr = data.map((x) => x.download_url);
  return arr;
};

let newImageUrlArray = [];

const onLoad = async () => {
  // async function onLoad() {
  newImageUrlArray = await fetchImage();

  const maxWidth = 700;
  const maxHeight = 400;
  const quality = 1;

  for (let i = 0; i < 4; i++) {
    const id = Math.floor(Math.random() * newImageUrlArray.length);
    const imageUrl = newImageUrlArray[id];
    // const imageUrl = newImageUrlArray[i];
    compressImage(imageUrl, maxWidth, maxHeight, quality)
      .then((compressedDataUrl) => {
        document.getElementById(`image-${i + 1}`).src = compressedDataUrl;
      })
      .catch((error) => {
        console.error(error);
      });
  }
};

const showSlides = (n) => {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");

  /**
   * Enable onLoad for getting a set of 4 random images everytime user ends the current set of images for either of the end
   * Disable onLoad for staying on a single set of 4 random images
   */
  if (n > slides.length) {
    slideIndex = 1;
    onLoad();
  }
  if (n < 1) {
    slideIndex = slides.length;
    onLoad();
  }

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
};

let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
const plusSlides = async (n) => {
  showSlides((slideIndex += n));
  // console.log(newImageUrlArray);
};

// Thumbnail image controls
const currentSlide = (n) => {
  showSlides((slideIndex = n));
};
