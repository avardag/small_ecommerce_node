const path = require("path");
const cloudinary = require("cloudinary").v2;
const DatauriParser = require("datauri/parser");
const parser = new DatauriParser();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/*** @description This function converts the buffer to data url*
 *  @param {Object} req containing the field object
 * * @returns {String} The data url from the string buffer
 */
const dataUri = (req) =>
  parser.format(
    path.extname(req.file.originalname).toString(),
    req.file.buffer
  );

//
// const dataUri = (req) =>
//   dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);

/*** @description This async function uploads images to cloudinary*
 *  @param {Object} req containing the field object
 *  @returns Promise with result of the upload, ie the object containing public_id, secure_url etc
 */
const uploadToCloudinary = async (req) => {
  return new Promise((resolve, reject) => {
    if (!req.file) {
      reject(new Error("No Image file"));
    } else {
      const file = dataUri(req).content;
      // const result = cloudinary.upload(file);
      cloudinary.uploader.upload(file, (err, result) => {
        if (err) {
          reject(new Error("Couldn't upload"));
        }
        return resolve(result);
      });
    }
  });
};

module.exports = uploadToCloudinary;
