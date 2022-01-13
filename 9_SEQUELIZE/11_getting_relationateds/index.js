const express = require("express");
const exphbs = require("express-handlebars");
const conn = require("./db/conn");

const User = require("./models/User");
const Address = require("./models/Address");

const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

app.use(express.static("public"));

app.get("/users/create", (req, res) => {
  res.render("adduser");
});

app.post("/users/create", async (req, res) => {
  const name = req.body.name;
  const occupation = req.body.occupation;
  let newsletter = req.body.newsletter;

  if (newsletter === "on") {
    newsletter = true;
  } else {
    newsletter = false;
  }

  console.log(req.body);

  await User.create({ name, occupation, newsletter });

  res.redirect("/");
});

app.get("/users/:id", async (req, res) => {
  const id = req.params.id;

  const user = await User.findOne({ raw: true, where: { id: id } });

  res.render("userview", { user });
});

app.post("/users/delete/:id", async (req, res) => {
  const id = req.params.id;

  await User.destroy({ where: { id: id } });

  res.redirect("/");
});

app.get("/users/edit/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findOne({ include: Address, where: { id: id } });
    res.render("useredit", { user: user.get({ plain: true }) });
  } catch (error) {
    console.log(error);
  }
});

app.post("/users/edit", async (req, res) => {
  const user = req.body;

  if (user.newsletter === "on") {
    user.newsletter = true;
  } else {
    user.newsletter = false;
  }

  await User.update(user, { where: { id: user.id } });

  res.redirect("/");
});

app.get("/", async (req, res) => {
  const users = await User.findAll({ raw: true });

  console.log(users);

  res.render("home", { users: users });
});

app.post("/address/create", async (req, res) => {
  const address = req.body;

  await Address.create(address);

  res.redirect(`/users/edit/${address.UserId}`);
});

conn
  .sync()
  // .sync({ force: true }) // Apagar todo o banco quando a aplicação iniciar
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
