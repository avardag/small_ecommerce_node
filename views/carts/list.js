const layout = require("../layout");

module.exports = ({ products }) => {
  const renderedItems = products
    .map(
      (product) =>
        `<div class="cart-item message">
        <h3 class="subtitle">${product.title}</h3>
        <div class="cart-right">
          <div>
            $${product.price}  X  ${product.quantity} = 
          </div>
          <div class="price is-size-4">
            $${product.price * product.quantity}
          </div>
          <div class="remove">
            <form method="POST" action="/cart/products/delete">
              <input hidden name="itemId" value="${product.id}"/>
              <button class="button is-danger">                  
                <span class="icon is-small">
                  <i class="fas fa-times"></i>
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>`
    )
    .join("");

  const cartTotal = products.reduce(
    (acc, curr) => acc + curr.price * curr.quantity,
    0
  );

  return layout({
    content: `
    <div id="cart" class="container">
        <div class="columns">
          <div class="column"></div>
          <div class="column is-four-fifths">
            <h3 class="subtitle"><b>Shopping Cart</b></h3>
            <div>
              ${renderedItems}
            </div>
            <div class="total message is-info">
              <div class="message-header">
                Total
              </div>
              <h1 class="title">$${cartTotal}</h1>
              <button class="button is-primary">Buy</button>
            </div>
          </div>
          <div class="column"></div>
        </div>
      </div>
    `,
  });
};
