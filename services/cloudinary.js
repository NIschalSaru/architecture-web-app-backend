const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const folderName = "uploads";

async function uploadSingleImage(fileBuffer, title, resourceType = "raw") {
  if (!fileBuffer) {
    throw new Error("File buffer is required for upload.");
  }
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: resourceType,
          folder: folderName,
          public_id: title,
        },
        (error, result) => {
          if (error) {
            console.error(`Error uploading ${resourceType}:`, error.message);
            return reject(`Failed to upload ${resourceType}.`);
          }
          // console.log("Image uploaded successfully:", result.secure_url);
          resolve(result.secure_url);
        }
      )
      .end(fileBuffer);
  });
}

// Function to upload multiple images using file buffers
// async function uploadMultipleImages(files) {
//   if (!Array.isArray(files) || files.length === 0) {
//     throw new Error("Invalid input. An array of file is required.");
//   }
//   const uploadPromises = files.map((file, index) => {
//     const title = `image_${Date.now()}_${index + 1}`;
//     return uploadSingleImage(file.buffer, title);
//   });
//   return Promise.all(uploadPromises);
// }

function extractPublicIdFromCloudinaryURL(url, folderName) {
  try {
    if (!folderName.endsWith("/")) {
      folderName += "/";
    }
    let publicIdWithExtension = url.split(folderName)[1];
    publicIdWithExtension = publicIdWithExtension.replace(/^v\d+\//, "");
    const lastDotIndex = publicIdWithExtension.lastIndexOf(".");
    if (lastDotIndex === -1) {
      return folderName + publicIdWithExtension;
    }
    const publicId = publicIdWithExtension.substring(0, lastDotIndex);
    return folderName + publicId;
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return null;
  }
}

async function deleteImage(imageUrl) {
  try {
    const publicId = extractPublicIdFromCloudinaryURL(imageUrl, folderName);
    if (!publicId) {
      throw new Error("Could not extract public ID.");
    }
    const resp = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });
    // console.log("Image deleted successfully:", resp);
    return resp;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
}

module.exports = { uploadSingleImage, deleteImage };
