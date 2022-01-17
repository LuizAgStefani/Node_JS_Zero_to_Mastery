const express = require("express");
const cors = require("cors");

const app = express();

const conn = require("./db/conn");

// adding dotenv to the project
require("dotenv").config();

// Config JSON response
app.use(express.json());

// Solve CORS
app.use(cors({ credentials: true, origin: "http://localhost:3000" })); // origin = da onde virá a requisição

// Public folder for images
app.use(express.static("public"));

// Routes
const UserRoutes = require("./routes/UserRoutes");
const PetRoutes = require("./routes/PetRoutes");

app.use("/users", UserRoutes);
app.use("/pets", PetRoutes);

conn
  .sync()
  // .sync({ force: true }) // Apagar todo o banco quando a aplicação iniciar
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => console.log(err));
