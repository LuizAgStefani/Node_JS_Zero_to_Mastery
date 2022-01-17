const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("getapet", "root", "biagio04", {
  host: "localhost",
  dialect: "mysql",
});

try {
  sequelize.authenticate();
  console.log("Conectamos com sucesso com o Sequelize");
} catch (error) {
  console.log(`Não foi possível conectar: ${error}`);
}

module.exports = sequelize;
