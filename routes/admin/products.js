const express = require("express");
const { validationResult } = require("express-validator");
const productsRepo = require("../../repositories/products");
const productsNewTemplate = require("../../views/admin/products/newProduct");
const { checkPrice, checkTitle } = require("../admin/validators");

const router = express.Router();

router.get("/admin/products", (req, res) => {});

router.get("/admin/products/new", (req, res) => {
  res.send(productsNewTemplate({}));
});

router.post("/admin/products/new", [checkPrice, checkTitle], (req, res) => {
  const errorsArr = validationResult(req);

  if (!errorsArr.isEmpty()) {
    return res.send(productsNewTemplate({ errorsArr }));
  }
  res.send("submitted");
});
module.exports = router;
