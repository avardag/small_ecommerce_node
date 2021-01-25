const express = require("express");
const { check, validationResult } = require("express-validator");
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

const router = express.Router();

router.get("/signup", (req, res) => {
  res.send(signupTemplate({ req }));
});

router.post(
  "/signup",
  [checkEmail, checkPassword, checkPasswordMatch],
  async (req, res) => {
    const errorsArr = validationResult(req); //check for validation errors

    const { email, password, passwordConfirmation } = req.body;

    if (!errorsArr.isEmpty()) {
      return res.send(signupTemplate({ req, errorsArr }));
    }
    //create a user
    const newUser = await usersRepo.create({ email, password });
    //store the ID of user inside the cookie
    req.session.userId = newUser.id;
    res.send(`
    <div>
      recieved
    </div>
    `);
  }
);
router.get("/signout", (req, res) => {
  //destroy session cookie
  req.session = null;
  //
  res.send("You are logged out");
});

router.get("/signin", (req, res) => {
  res.send(signinTemplate({ req }));
});

router.post(
  "/signin",
  [checkValidEmail, checkValidPassword],
  async (req, res) => {
    const errorsArr = validationResult(req); //check for validation errors

    const { email } = req.body;
    const existingUser = await usersRepo.getOneBy({ email });

    if (!errorsArr.isEmpty()) {
      return res.send(signinTemplate({ req, errorsArr }));
    }
    req.session.userId = existingUser.id;
    res.send("You are signed in");
  }
);

module.exports = router;
