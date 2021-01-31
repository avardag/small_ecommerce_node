const express = require("express");
const path = require("path");
//multer for multipart forms
var multer = require("multer");

const productsRepo = require("../../repositories/products");
const productsNewTemplate = require("../../views/admin/products/newProduct");
const allProductsTemplate = require("../../views/admin/products/allProducts");
const editProductTemplate = require("../../views/admin/products/editProduct");
const { checkPrice, checkTitle } = require("../admin/validators");
const { handleBodyInputErrors, requireAuth } = require("./middlewares");
const {
  uploadToCloudinary,
  updateInCloudinary,
  deleteFromCloudinary,
} = require("./cloudinaryConfig");
const products = require("../../repositories/products");

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

router.get("/admin/products", requireAuth, async (req, res) => {
  const products = await productsRepo.getAll();
  res.send(allProductsTemplate({ products }));
});

router.get("/admin/products/new", requireAuth, (req, res) => {
  res.send(productsNewTemplate({}));
});

router.post(
  "/admin/products/new",
  requireAuth,
  upload.single("image") /*image upload w/ Multer from multipart form */,
  [checkPrice, checkTitle],
  handleBodyInputErrors(productsNewTemplate),
  async (req, res) => {
    try {
      const image = await uploadToCloudinary(req);

      const { title, price } = req.body;
      await productsRepo.create({
        title,
        price,
        image,
      });

      return res.redirect("/admin/products");
    } catch (error) {
      console.log("🚀 ~ error", error);
    }
  }
);

router.get("/admin/products/:id/edit", requireAuth, async (req, res) => {
  const { id } = req.params;

  const product = await productsRepo.getOne(id);
  if (!product) {
    res.send("Product not found");
  }
  res.send(editProductTemplate({ product }));
});

router.post(
  "/admin/products/:id/edit",
  requireAuth,
  upload.single("image"),
  [checkPrice, checkTitle],
  handleBodyInputErrors(editProductTemplate, async (req) => {
    const product = await productsRepo.getOne(req.params.id);
    return { product };
  }),
  async (req, res) => {
    const { id } = req.params;
    const product = await productsRepo.getOne(id);
    const changes = req.body;
    if (req.file) {
      try {
        const updatedImage = await updateInCloudinary(
          product.image.public_id,
          req
        );
        changes.image = updatedImage;
      } catch (error) {
        res.send("could not update");
      }
    }
    try {
      await productsRepo.update(id, changes);
      return res.redirect("/admin/products");
    } catch (error) {
      res.send("could not update");
    }
  }
);
router.post("/admin/products/:id/delete", requireAuth, async (req, res) => {
  const { id } = req.params;
  const product = await productsRepo.getOne(id);
  const public_id = product.image.public_id;
  try {
    await deleteFromCloudinary(public_id);
    await productsRepo.delete(id);
  } catch (err) {
    res.send("could not delete");
  }

  return res.redirect("/admin/products");
});
module.exports = router;
