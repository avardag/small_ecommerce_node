const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(`
  <div>
    <form method="POST">
      <input type="email" name="email" placeholder="email"/>
      <input type="password" name="password" placeholder="password"/>
      <input type="password" name="passwordConfirmation" placeholder="Confirm Password"/>
      <button>
        Sign Up
      </button>
    </form>
  </div>
  `);
});

app.post("/", (req, res) => {
  console.log("🚀 ~ app.post ~ req.body", req.body);

  res.send(`
  <div>
    recieved
  </div>
  `);
});

app.listen(port, () => {
  console.log("Server started on " + port);
});
