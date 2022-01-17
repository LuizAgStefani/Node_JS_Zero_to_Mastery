const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// helpers
const createUserToken = require("../helpers/create-user-token");
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");

module.exports = class UserController {
  static async register(req, res) {
    const { name, email, phone, password, confirmpassword } = req.body;

    // validations
    if (!name) {
      res.status(422).json({ message: "O Nome é Obrigatório" });
      return;
    }
    if (!email) {
      res.status(422).json({ message: "O Email é Obrigatório" });
      return;
    }
    if (!phone) {
      res.status(422).json({ message: "O Telefone é Obrigatório" });
      return;
    }
    if (!password) {
      res.status(422).json({ message: "A senha é Obrigatória" });
      return;
    }
    if (!confirmpassword) {
      res.status(422).json({ message: "A Confirmação de Senha é Obrigatória" });
      return;
    }

    if (password !== confirmpassword) {
      res.status(422).json({ message: "As senhas não coincidem" });
      return;
    }

    // check if user exists
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      res.status(422).json({
        message: "Já existe um usuário com esse e-mail!",
      });
      return;
    }

    // create a password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    //create a user
    const user = {
      name,
      email,
      phone,
      password: passwordHash,
    };

    try {
      const newUser = await (await User.create(user)).dataValues;

      await createUserToken(newUser, req, res);
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    if (!email) {
      res.status(422).json({ message: "O email é obrigatório" });
      return;
    }
    if (!password) {
      res.status(422).json({ message: "A senha é obrigatória" });
      return;
    }

    // check if user exists
    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(422).json({
        message: "Não foi encontrado um usuário com esse email!",
      });
      return;
    }

    // check if password match with db password
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      res.status(422).json({
        message: "Senha incorreta",
      });
      return;
    }

    await createUserToken(user, req, res);
  }

  static async checkUser(req, res) {
    let currentUser;

    if (req.headers.authorization) {
      const token = getToken(req);
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      currentUser = await User.findOne({ where: { id: decoded.id } });

      currentUser.password = undefined;
    } else {
      currentUser = null;
    }

    res.status(200).send(currentUser);
  }

  static async getUserById(req, res) {
    const id = req.params.id;

    const user = await User.findOne({
      where: { id: id },
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      res.status(422).json({
        message: "Usuário não encontrado!",
      });
      return;
    }

    res.status(200).send(user);
  }

  static async editUser(req, res) {
    const id = req.params.id;

    // check if email has already taken
    const token = getToken(req);
    const user = await getUserByToken(token);

    const { name, email, phone, password, confirmpassword } = req.body;
    let image = "";

    if (req.file) {
      req.body.image = req.file.filename;
    }

    // validations
    if (!name) {
      res.status(422).json({ message: "O Nome é Obrigatório" });
      return;
    }

    user.name = name;

    if (!email) {
      res.status(422).json({ message: "O Email é Obrigatório" });
      return;
    }

    // chek if email has already taken
    const userExists = await User.findOne({ where: { email } });

    if (user.email !== email && userExists) {
      res.status(422).json({
        message: "Por favor, utilize outro email!",
      });
      return;
    }

    user.email = email;

    if (!phone) {
      res.status(422).json({ message: "O Telefone é Obrigatório" });
      return;
    }

    user.phone = phone;

    if (password !== confirmpassword) {
      res.status(422).json({ message: "As senhas não coincidem" });
      return;
    } else if (password === confirmpassword && password != null) {
      // creating password
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      req.body.password = passwordHash;
    }

    const updates = {
      ...req.body,
    };
    console.log(updates);

    try {
      User.findOne({ where: { id: user.id } }).then((usuario) => {
        if (usuario) {
          usuario.update(updates).then(() => {
            res.status(200).send({
              message: "Usuário atualizado com sucesso",
            });
          });
        }
      });
    } catch (error) {
      res.status(500).send({ message: error });
      return;
    }
  }
};
