const express = require("express");
const exphbs = require("express-handlebars");

const app = express();

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

app.get("/dashboard", (req, res) => {
  res.render("dashboard", { itens });
});

app.get("/", (req, res) => {
  const user = {
    name: "Luiz",
    surname: "Stefani",
    age: 21,
  };

  const palavra = "Teste";

  const auth = false;

  const approved = true;

  res.render("home", { user: user, palavra, auth, approved });
});

app.listen(3000, () => {
  console.log("App funcionando");
});
