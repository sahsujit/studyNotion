const cloudinary = require('cloudinary').v2


exports.uploadImageToCloudinary  = async (file, folder, height, quality) => {
    const options = {folder};
    if(height) {
        options.height = height;
    }
    if(quality) {
        options.quality = quality;
    }
    options.resource_type = "auto";

    return await cloudinary.uploader.upload(file.tempFilePath, options);
}




// exports.uploadImageToCloudinary = async (filePath, folder, height, quality) => {
//     try {
//       const options = { folder };
//       if (height) {
//         options.height = height;
//       }
//       if (quality) {
//         options.quality = quality;
//       }
//       options.resource_type = 'auto';
  
//       return await cloudinary.uploader.upload(filePath, options);
      
//     } catch (error) {
//       throw new Error('Failed to upload image to Cloudinary: ' + error.message);
//     }
//   };