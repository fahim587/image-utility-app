// Convert file to base64 or blob
export const toBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

// Load image from source
export const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.setAttribute("crossOrigin", "anonymous");
        image.src = url;
    });

export const getRadianAngle = (degreeValue) => {
    return (degreeValue * Math.PI) / 180;
};

export function rotateSize(width, height, rotation) {
    const rotRad = getRadianAngle(rotation);

    return {
        width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
        height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    };
}

/**
 * Core Processing Logic
 * Uses OffscreenCanvas where available (Worker context) or DOM Canvas
 */
export async function getCroppedImg(
    imageSrc,
    pixelCrop,
    rotation = 0,
    flip = { horizontal: false, vertical: false },
    outputFormat = "image/jpeg",
    quality = 0.92,
    resize = null // { width, height } or null
) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        return null;
    }

    const rotRad = getRadianAngle(rotation);

    // 1. Calculate bounding box of the rotated image
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(image.width, image.height, rotation);

    // 2. Set canvas size to match the rotated bounding box
    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    // 3. Draw image with rotation and flip
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.translate(-image.width / 2, -image.height / 2);
    ctx.drawImage(image, 0, 0);

    // 4. Extract the cropped area
    const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);

    // 5. Resize Logic
    // If resize dimensions are provided, we scale the final canvas to that.
    // Otherwise, we default to the crop size.
    const finalWidth = resize?.width ? parseInt(resize.width) : pixelCrop.width;
    const finalHeight = resize?.height ? parseInt(resize.height) : pixelCrop.height;

    // We need a fresh canvas for the final output to handle resizing cleanly
    const outputCanvas = document.createElement("canvas");
    outputCanvas.width = finalWidth;
    outputCanvas.height = finalHeight;
    const outputCtx = outputCanvas.getContext("2d");

    // Use a temporary canvas to hold the cropped data before resizing
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = pixelCrop.width;
    tempCanvas.height = pixelCrop.height;
    const tempCtx = tempCanvas.getContext("2d");
    tempCtx.putImageData(data, 0, 0);

    // Draw temp canvas onto output canvas (this handles the resize)
    // We can enable higher quality smoothing here
    outputCtx.imageSmoothingEnabled = true;
    outputCtx.imageSmoothingQuality = "high";
    outputCtx.drawImage(
        tempCanvas,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height, // Source
        0,
        0,
        finalWidth,
        finalHeight // Destination
    );

    // 6. Output as Blob
    return new Promise((resolve, reject) => {
        outputCanvas.toBlob(
            (file) => {
                if (file) resolve(file);
                else reject(new Error("Canvas to Blob failed"));
            },
            outputFormat,
            quality
        );
    });
}
