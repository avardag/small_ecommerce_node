const adminLayout = require("../layout");
const { getInputErrors } = require("../../helpers");

module.exports = ({ req, errorsArr }) => {
  return adminLayout({
    content: `
  <div>
    <div>Your id is : ${req.session.userId}</div>
    <form method="POST">
      <input type="email" name="email" placeholder="email"/>
      ${getInputErrors(errorsArr, "email")}
      <input type="password" name="password" placeholder="password"/>
      ${getInputErrors(errorsArr, "password")}
      <input type="password" name="passwordConfirmation" placeholder="Confirm Password"/>
      ${getInputErrors(errorsArr, "passwordConfirmation")}
      <button>
        Sign Up
      </button>
    </form>
  </div>
  `,
  });
};
