const layout = require("../../admin/layout");
const { getInputErrors } = require("../../helpers");

module.exports = ({ product, errorsResultObj }) => {
  return layout({
    content: `
    <div class="columns is-centered">
    <div class="column is-half">
      <h1 class="subtitle">Edit a Product</h1>

      <form method="POST" enctype="multipart/form-data">
        <div class="field">
          <label class="label">Title</label>
          <input class="input" placeholder="Title" name="title" value="${
            product.title
          }">
          <p class="help is-danger">${getInputErrors(
            errorsResultObj,
            "title"
          )}</p>
        </div>
        
        <div class="field">
          <label class="label">Price</label>
          <input class="input" placeholder="Price" name="price" value="${
            product.price
          }">
         <p class="help is-danger">${getInputErrors(
           errorsResultObj,
           "price"
         )}</p>
        </div>
        
        <div class="field">
          <label class="label">Image</label>            
          <input type="file" name="image" />
        </div>
        <br />
        <button class="button is-primary">Edit</button>
      </form>
    </div>
  </div>
    `,
  });
};
