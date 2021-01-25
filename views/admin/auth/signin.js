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
      <button>
        Sign In
      </button>
    </form>
  </div>
  `,
  });
};
