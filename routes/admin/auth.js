const express = require("express");
const usersRepo = require("../../repositories/users");
const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");
//custom validators
const {
  checkEmail,
  checkPassword,
  checkPasswordMatch,
  checkValidEmail,
  checkValidPassword,
} = require("./validators");
const { handleBodyInputErrors } = require("./middlewares");

const router = express.Router();

router.get("/signup", (req, res) => {
  res.send(signupTemplate({}));
});

router.post(
  "/signup",
  [checkEmail, checkPassword, checkPasswordMatch],
  handleBodyInputErrors(signupTemplate),
  async (req, res) => {
    const { email, password } = req.body;

    //create a user
    const newUser = await usersRepo.create({ email, password });
    //store the ID of user inside the cookie
    req.session.userId = newUser.id;

    return res.redirect("/admin/products");
  }
);
router.get("/signout", (req, res) => {
  //destroy session cookie
  req.session = null;
  //
  res.send("You are logged out");
});

router.get("/signin", (req, res) => {
  res.send(signinTemplate({}));
});

router.post(
  "/signin",
  [checkValidEmail, checkValidPassword],
  handleBodyInputErrors(signinTemplate),
  async (req, res) => {
    const { email } = req.body;
    const existingUser = await usersRepo.getOneBy({ email });

    req.session.userId = existingUser.id;
    return res.redirect("/admin/products");
  }
);

module.exports = router;
