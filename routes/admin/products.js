const express = require("express");
const path = require("path");
const { validationResult } = require("express-validator");
//multer for multipart forms
var multer = require("multer");

const productsRepo = require("../../repositories/products");
const productsNewTemplate = require("../../views/admin/products/newProduct");
const { checkPrice, checkTitle } = require("../admin/validators");
const uploadToCloudinary = require("./cloudinaryConfig");

const router = express.Router();
//Upload dir from Multer
const upload = multer({
  storage: multer.memoryStorage(),
  // storage: multer.diskStorage({}),
  fileSize: 1000 * 1000 * 4, // limit to 4mb
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
});

router.get("/admin/products", (req, res) => {});

router.get("/admin/products/new", (req, res) => {
  res.send(productsNewTemplate({}));
});

router.post(
  "/admin/products/new",
  upload.single("image") /*image upload w/ Multer from multipart form */,
  [checkPrice, checkTitle],
  async (req, res) => {
    const errorsArr = validationResult(req);

    if (!errorsArr.isEmpty()) {
      return res.send(productsNewTemplate({ errorsArr }));
    }
    try {
      const uploadResult = await uploadToCloudinary(req);

      const { title, price } = req.body;
      const { public_id, secure_url } = uploadResult;
      await productsRepo.create({
        title,
        price,
        image: { public_id, secure_url },
      });

      return res.send("uploaded");
    } catch (error) {
      console.log("🚀 ~ error", error);
    }

    res.send("submitted");
  }
);
module.exports = router;
