const adminLayout = require("../layout");

module.exports = ({ req }) => {
  return adminLayout({
    content: `
  <div>
    <div>Your id is : ${req.session.userId}</div>
    <form method="POST">
      <input type="email" name="email" placeholder="email"/>
      <input type="password" name="password" placeholder="password"/>
      <button>
        Sign In
      </button>
    </form>
  </div>
  `,
  });
};
