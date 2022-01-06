const fs = require("fs");

console.log("início");

fs.writeFile("arquivo.txt", "oi", function (err) {
  setTimeout(function () {
    console.log("Arquivo Criado!");
  }, 1000);
});

console.log("Fim");
