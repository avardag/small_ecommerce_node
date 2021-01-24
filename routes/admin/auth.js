const express = require("express");
const usersRepo = require("../../repositories/users");
const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");

const router = express.Router();

router.get("/signup", (req, res) => {
  res.send(signupTemplate({ req }));
});

router.post("/signup", async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;
  //check if email already exsts in db
  const existingUser = await usersRepo.getOneBy({ email });
  if (existingUser) {
    return res.send("Email already taken");
  }
  //check passwords match
  if (password !== passwordConfirmation) {
    return res.send("Passwords must match");
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
});
router.get("/signout", (req, res) => {
  //destroy session cookie
  req.session = null;
  //
  res.send("You are logged out");
});

router.get("/signin", (req, res) => {
  res.send(signinTemplate({ req }));
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await usersRepo.getOneBy({ email });
  if (!existingUser) {
    return res.send("Email not found");
  }
  // compare password in db and password
  const validPassord = await usersRepo.comparePasswords(
    existingUser.password,
    password
  );
  if (!validPassord) {
    return res.send("Invalid password");
  }
  req.session.userId = existingUser.id;
  res.send("You are signed in");
});

module.exports = router;
