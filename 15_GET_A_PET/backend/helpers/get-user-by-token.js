const jwt = require("jsonwebtoken");

const User = require("../models/User");

const getUserByToken = async (token) => {
  if (!token) {
    return res.status(422).send({ message: "Token inválido." });
  }

  const decoded = jwt.verify(token, process.env.SECRET_KEY);

  const id = decoded.id;

  const user = await User.findOne({ where: { id } });

  return user;
};

module.exports = getUserByToken;
