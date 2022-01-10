const fs = require("fs");

const nomeAntigo = "arquivo.txt";
const novoNome = "novoarquivo.txt";

fs.rename(nomeAntigo, novoNome, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log(`O arquivo chamado ${nomeAntigo} foi renomeado para ${novoNome}`);
});
