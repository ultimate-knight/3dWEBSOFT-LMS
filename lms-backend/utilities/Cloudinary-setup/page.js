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