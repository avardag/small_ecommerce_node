const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const repo = require("./repositories/users");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    keys: ["kklnc23md-032ncls-2-3iocjls-0inlscsl09jiccn023dcnknc"],
  })
);

app.get("/signup", (req, res) => {
  res.send(`
  <div>
    <div>Your id is : ${req.session.userId}</div>
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

app.post("/signup", async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;
  //check if email already exsts in db
  const existingUser = await repo.getOneBy({ email });
  if (existingUser) {
    return res.send("Email already taken");
  }
  //check passwords match
  if (password !== passwordConfirmation) {
    return res.send("Passwords must match");
  }
  //create a user
  const newUser = await repo.create({ email, password });
  //store the ID of user inside the cookie
  req.session.userId = newUser.id;
  res.send(`
  <div>
    recieved
  </div>
  `);
});
app.get("/signout", (req, res) => {
  //destroy session cookie
  req.session = null;
  //
  res.send("You are logged out");
});

app.get("/signin", (req, res) => {
  res.send(`
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
  `);
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await repo.getOneBy({ email });
  if (!existingUser) {
    return res.send("Email not found");
  }
  if (existingUser.password !== password) {
    return res.send("Invalid passowrd");
  }
  req.session.userId = existingUser.id;
  res.send("You are signed in");
});

//server
app.listen(port, () => {
  console.log("Server started on " + port);
});
