const layout = require("../layout");
const { getInputErrors } = require("../../helpers");

module.exports = ({ errorsArr }) => {
  return layout({
    content: `
      <form method="POST">
        <input placeholder="Title" name="title"/>
        ${getInputErrors(errorsArr, "title")}
        <input placeholder="Price" name="price"/>
        ${getInputErrors(errorsArr, "price")}
        <input type="file" name="image"/>
        <button>Submit</button>
      </form>
    `,
  });
};
