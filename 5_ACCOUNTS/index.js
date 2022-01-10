// modulos externos
const inquirer = require("inquirer");
const chalk = require("chalk");

// modulos internos
const fs = require("fs");

operation();

//main operation of system
function operation() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "O que você deseja fazer?",
        choices: [
          "Criar Conta",
          "Consultar Saldo",
          "Depositar",
          "Sacar",
          "Sair",
        ],
      },
    ])
    .then((answer) => {
      const action = answer["action"];

      if (action === "Criar Conta") {
        createAccount();
      } else if (action === "Consultar Saldo") {
        showBalance();
      } else if (action === "Depositar") {
        deposit();
      } else if (action === "Sacar") {
        withdraw();
      } else if (action === "Sair") {
        console.log(chalk.bgBlue.black("Obrigado por usar o Accounts!"));
        process.exit();
      }
    })
    .catch((err) => console.log(err));
}

// create an account
function createAccount() {
  console.log(chalk.bgGreen.black("Parabéns por escolher o nosso banco!"));
  console.log(chalk.green("Defina as opções da sua conta a seguir:"));
  buildAccount();
}

// register an account
function buildAccount() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Digite um nome para a sua conta:",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];
      console.info(accountName);

      if (!fs.existsSync("accounts")) {
        fs.mkdirSync("accounts");
      }

      if (fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(
          chalk.bgRed.black("Esta conta já existe, escolha outro nome")
        );
        buildAccount();
      } else {
        fs.writeFileSync(
          `accounts/${accountName}.json`,
          '{"balance": 0}',
          (err) => {
            console.log(err);
          }
        );

        console.log(
          chalk.green("Parabéns, sua conta foi criada com sucesso!!")
        );
        operation();
      }
    })
    .catch((err) => console.log(err));
}

// deposit money to an especif account
function deposit() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual o nome da sua conta?",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];

      if (!verifyAccount(accountName)) {
        return deposit();
      }

      inquirer
        .prompt([
          {
            name: "amount",
            message: "Quanto você deseja depositar:",
          },
        ])
        .then((answ) => {
          const amount = answ["amount"];

          //add an amount
          addAmount(accountName, amount);

          operation();
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}

//verify if an account exists
function verifyAccount(accountName) {
  if (!fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(
      chalk.bgRed.black("Esta conta não existe, escolha outro nome!")
    );
    return false;
  }

  return true;
}

// add an amount to an account
function addAmount(accountName, amount) {
  const account = getAccount(accountName);

  if (!amount) {
    console.log(chalk.bgRed.black("Ocorreu um erro, tente novamente"));
    return deposit();
  }

  account.balance += parseFloat(amount);

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(account),
    (err) => console.log(err)
  );

  console.log(
    chalk.green(
      `Foi depositado o valor de R$${amount} na conta '${accountName}'`
    )
  );
}

// get an account in a json format
function getAccount(accountName) {
  if (!fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(chalk.bgRed.black("Não encontrado nome com essa conta"));
    return;
  }

  const accountJson = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: "utf8",
    flag: "r",
  });

  return JSON.parse(accountJson);
}

// show how much money has an account
function showBalance() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Digite o nome da conta a ser consultado o saldo:",
      },
    ])
    .then((answ) => {
      const accountName = answ["accountName"];
      account = getAccount(accountName);

      balance = account.balance;

      console.log(
        chalk.bgGreen.yellow(
          `A conta '${accountName}' tem um saldo de ${balance}`
        )
      );
      operation();
    })
    .catch((err) => console.log(err));
}

// withdraw an amount from an valid account
function withdraw() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual conta você deseja sacar dinheiro:",
      },
    ])
    .then((answ) => {
      const accountName = answ["accountName"];

      if (!verifyAccount(accountName)) {
        return withdraw();
      }

      inquirer
        .prompt([
          {
            name: "amount",
            message: "Quanto você deseja sacar:",
          },
        ])
        .then((answ) => {
          const amount = answ["amount"];
          removeAmount(accountName, amount);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}

// remove a value from an account
function removeAmount(accountName, amount) {
  const accountData = getAccount(accountName);

  if (!amount) {
    console.log(chalk.bgRed.black("Digite um valor válido"));
    return withdraw();
  }

  if (accountData.balance < amount) {
    console.log(chalk.red("Você não tem esse valor para o saque"));
    return withdraw();
  }

  accountData.balance -= parseFloat(amount);

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    (err) => {
      console.log(err);
    }
  );

  console.log(
    chalk.bgGreen.yellow(`Foi realizado um saque de R$${amount} na sua conta!`)
  );

  operation();
}
