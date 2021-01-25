const { check } = require("express-validator");

const usersRepo = require("../../repositories/users");

module.exports = {
  checkEmail: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Must be a valid Email")
    .custom(async (email) => {
      //check if email already exsts in db
      const existingUser = await usersRepo.getOneBy({ email });
      if (existingUser) {
        throw new Error("Email already taken");
      }
    }),
  checkPassword: check("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Must be between 4 to 20 charachters"),
  checkPasswordMatch: check("passwordConfirmation")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Must be between 4 to 20 charachters")
    .custom((passwordConfirmation, { req }) => {
      //check passwords match
      if (passwordConfirmation !== req.body.password) {
        throw new Error("Passwords must match");
      }
    }),
  checkValidEmail: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Must be a valid Email")
    .custom(async (email) => {
      //check if email exsts in db
      const user = await usersRepo.getOneBy({ email });
      if (!user) {
        throw new Error("Email not found");
      }
    }),
  checkValidPassword: check("password")
    .trim()
    .custom(async (password, { req }) => {
      const user = await usersRepo.getOneBy({ email: req.body.email });
      if (!user) {
        throw new Error("Invalid password");
      }
      // compare password in db and password
      const validPassord = await usersRepo.comparePasswords(
        user.password,
        password
      );
      if (!validPassord) {
        throw new Error("Invalid password");
      }
    }),
};
