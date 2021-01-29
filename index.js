require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const authRouter = require("./routes/admin/auth");
const productsRouter = require("./routes/admin/products");

const app = express();
const port = 3000;
//public
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    keys: ["kklnc23md-032ncls-2-3iocjls-0inlscsl09jiccn023dcnknc"],
  })
);

//routes
app.use(authRouter);
app.use(productsRouter);

//server
app.listen(port, () => {
  console.log("Server started on " + port);
});
