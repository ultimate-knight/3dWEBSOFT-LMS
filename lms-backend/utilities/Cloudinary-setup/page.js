const cloudinary = require("../../config/cloudinary");
const streamifier = require("streamifier");

const uploadStream = (buffer) => {
  if (!Buffer.isBuffer(buffer)) {
    return Promise.reject(new TypeError("Expected the uploaded file as a Buffer"));
  }

  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      { folder: "my-folder" },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Cloudinary returned no upload result"));
        resolve(result);
      }
    );

    const source = streamifier.createReadStream(buffer);
    source.on("error", reject);
    upload.on("error", reject);
    source.pipe(upload);
  });
};

module.exports = uploadStream;





// const cloudinary = require("../../config/cloudinary");
// const streamifier = require("streamifier");

// const uploadStream = (buffer) => {
//     return new Promise((resolve, reject) => {

//         if (!Buffer.isBuffer(buffer)) {
//             return reject(new Error("Invalid image buffer received"));
//         }

//         const cloudinaryStream = cloudinary.uploader.upload_stream(
//             {
//                 folder: "my-folder",
//                 resource_type: "image"
//             },
//             (error, result) => {
//                 if (error) {
//                     console.error("CLOUDINARY UPLOAD ERROR:", error);
//                     return reject(error);
//                 }

//                 if (!result?.secure_url) {
//                     return reject(
//                         new Error("Cloudinary did not return an image URL")
//                     );
//                 }

//                 console.log("Cloudinary upload successful");
//                 resolve(result);
//             }
//         );

//         const readableStream = streamifier.createReadStream(buffer);

//         readableStream.on("error", reject);
//         cloudinaryStream.on("error", reject);

//         readableStream.pipe(cloudinaryStream);
//     });
// };

// module.exports = uploadStream;
