const { DataTypes } = require("sequelize");

const db = require("../db/conn");

const User = require("./User");

const Pet = db.define("Pet", {
  name: {
    type: DataTypes.STRING,
    required: true,
  },
  age: {
    type: DataTypes.INTEGER,
    required: true,
  },
  weight: {
    type: DataTypes.FLOAT,
    required: true,
  },
  color: {
    type: DataTypes.STRING,
    required: true,
  },
  images: {
    type: DataTypes.STRING,
    required: true,
  },
  available: {
    type: DataTypes.BOOLEAN,
  },
});

User.hasMany(Pet);
Pet.belongsTo(User);

module.exports = Pet;
