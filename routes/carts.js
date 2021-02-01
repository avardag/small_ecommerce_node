const express = require("express");

const cartsRepo = require("../repositories/carts");
const productsRepo = require("../repositories/products");
const cartListTemplate = require("../views/carts/list");

const router = express.Router();

//receive a POST request to add an item to a cart
router.post("/cart/products", async (req, res) => {
  //req.body.productId in a hidden input above ADD btn
  const { productId } = req.body;
  let cart;
  //->1) check if user has a cart in cokie
  if (!req.session.cartId) {
    //no cart, so create one
    cart = await cartsRepo.create({ items: [] });
    //store cartId in req.session.cartId
    req.session.cartId = cart.id;
    //
  } else {
    //user has a cart in cookie. get it from repository
    cart = await cartsRepo.getOne(req.session.cartId);
  }
  //->2) chek if there is a product in users cart already
  const existingItem = cart.items.find((item) => item.id === productId);
  if (existingItem) {
    //increment quantity of existing item
    existingItem.quantity++;
  } else {
    cart.items.push({ id: productId, quantity: 1 });
  }
  //->3) update a cart with changes
  await cartsRepo.update(cart.id, {
    items: cart.items,
  });
  res.redirect("/cart");
});

//receive a GET request to show all items in cart
router.get("/cart", async (req, res) => {
  //if no cart(items in cart)-> redirect to home
  if (!req.session.cartId) {
    res.redirect("/");
  }
  /*
  cart-> {
    "id": "e19163eb",
    "items": [
      {"id": "3c196145", "quantity": 3},
      {"id": "wc1kds45", "quantity": 1},
    ]    
  }
  */
  const cart = await cartsRepo.getOne(req.session.cartId);

  const productsToRender = [];

  for (let item of cart.items) {
    const product = await productsRepo.getOne(item.id);
    productsToRender.push({ ...item, ...product });
  }

  res.send(cartListTemplate({ products: productsToRender }));
});
//receive a POST request to delete a item in cart
router.post("/cart/products/delete", async (req, res) => {
  const cart = await cartsRepo.getOne(req.session.cartId);
  //create new arr of products in cart removing the chosen product
  const updatedItems = cart.items.filter((item) => item.id !== req.body.itemId);

  await cartsRepo.update(req.session.cartId, { items: updatedItems });
  //redirect to main car page
  res.redirect("/cart");
});
module.exports = router;
