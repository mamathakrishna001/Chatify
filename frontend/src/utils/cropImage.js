const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    // Important: Set crossOrigin to 'anonymous' if you load images from other domains
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

/**
 * Generates a cropped image from a given image source (base64 or URL) and cropped area.
 * @param {string} imageSrc - The base64 or URL of the image.
 * @param {Object} pixelCrop - The pixel crop coordinates {x, y, width, height}.
 * @returns {Promise<string>} - A promise that resolves to the base64 data URL of the cropped image.
 */
export default async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  // Set canvas size to the cropped area dimensions
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Return the cropped image as a base64 data URL (JPEG format with 90% quality)
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
        if (!blob) {
            resolve(null);
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            resolve(reader.result);
        };
    }, 'image/jpeg', 0.9);
  });
}