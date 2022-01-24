const Pet = require("../models/Pet");
const User = require("../models/User");

// helpers
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");

module.exports = class PetController {
  //create a pet
  static async create(req, res) {
    const { name, age, weight, color } = req.body;

    const images = req.files;

    const available = true;

    // images upload

    //validations
    if (!name) {
      res.status(422).json({
        message: "O nome é obrigatório",
      });
      return;
    }
    if (!age) {
      res.status(422).json({
        message: "A idade é obrigatória",
      });
      return;
    }
    if (!weight) {
      res.status(422).json({
        message: "O peso é obrigatório",
      });
      return;
    }
    if (!color) {
      res.status(422).json({
        message: "A cor do animal é obrigatória",
      });
      return;
    }
    if (images.length === 0) {
      res.status(422).json({
        message: "A imagem é obrigatória",
      });
      return;
    }

    //get pet owner
    const token = getToken(req);
    const user = await getUserByToken(token);

    // create a pet
    const pet = {
      ...req.body,
      available,
      images: "",
      UserId: user.id,
    };

    let nomeImagens = "";

    images.map((imagem) => {
      if (nomeImagens === "") {
        nomeImagens = imagem.filename;
      } else {
        nomeImagens = `${nomeImagens},${imagem.filename}`;
      }
    });

    pet.images = nomeImagens;

    try {
      const newPet = await Pet.create(pet);
      res.status(201).json({
        message: "Pet cadastrado com sucesso",
        newPet,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async getPetsUser(req, res) {
    //get pet owner
    const token = getToken(req);
    const user = await getUserByToken(token);

    const pets = await Pet.findAll({
      where: { UserId: user.id },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).send(pets);
  }

  static async getAll(req, res) {
    const pets = await Pet.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).send(pets);
  }

  static async getMyAdoptions(req, res) {
    //get pet owner
    const token = getToken(req);
    const user = await getUserByToken(token);

    res.status(200).send(pets);
  }

  static async getPetById(req, res) {
    const id = req.params.id;

    const petFound = await Pet.findOne({ where: { id } });

    if (!petFound) {
      res.status(404).json({
        message: "Pet não encontrado",
      });
      return;
    }

    res.status(200).send(petFound);
  }

  static async removePetById(req, res) {
    const id = req.params.id;

    //check if pet exists
    const pet = await Pet.findOne({ where: { id } });

    if (!pet) {
      res.status(404).json({ message: "Pet não encontrado" });
      return;
    }

    //check if logged in user registered the pet
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (pet.UserId.toString() !== user.id.toString()) {
      res
        .status(422)
        .json({ message: "Houve um problema ao processar sua solicitação!" });
      return;
    }

    await Pet.destroy({ where: { id: pet.id } });

    res.status(200).json({
      message: "Pet deletado com sucesso",
    });
  }

  static async updatePet(req, res) {
    const id = req.params.id;

    const { name, age, weight, color, available } = req.body;

    const images = req.files;

    const updatedData = {};

    //check if pet exists

    const pet = await Pet.findOne({ where: { id } });

    if (!pet) {
      res.status(404).json({ message: "Pet não encontrado" });
      return;
    }

    //check if logged in user registered the pet
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (pet.UserId.toString() !== user.id.toString()) {
      res
        .status(422)
        .json({ message: "Houve um problema ao processar sua solicitação!" });
      return;
    }

    //validations
    if (!name) {
      res.status(422).json({
        message: "O nome é obrigatório",
      });
      return;
    }

    updatedData.name = name;

    if (!age) {
      res.status(422).json({
        message: "A idade é obrigatória",
      });
      return;
    }

    updatedData.age = age;

    if (!weight) {
      res.status(422).json({
        message: "O peso é obrigatório",
      });
      return;
    }

    updatedData.weight = weight;

    if (!color) {
      res.status(422).json({
        message: "A cor do animal é obrigatória",
      });
      return;
    }

    updatedData.color = color;

    let nomeImagens = "";

    if (images.length > 0) {
      console.log("entrou aqui e vai mudar a imagem");
      images.map((imagem) => {
        if (nomeImagens === "") {
          nomeImagens = imagem.filename;
        } else {
          nomeImagens = `${nomeImagens},${imagem.filename}`;
        }
      });
      updatedData.images = nomeImagens;
    }

    Pet.findOne({ where: { id } }).then(async (petFound) => {
      petFound.update(updatedData);
    });

    res.status(200).json({
      message: "Pet atualizado com sucesso",
    });
  }

  static async schedule(req, res) {
    const id = req.params.id;

    // check if pet exists
    const pet = await Pet.findOne({ where: { id } });

    if (!pet) {
      res.status(404).json({ message: "Pet não encontrado" });
      return;
    }

    // check if user registered the pet
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (pet.UserId.toString() === user.id.toString()) {
      res
        .status(422)
        .json({ message: "Você não pode agentar visitas aos seus pets" });
      return;
    }

    // check if user has already scheduled a visit
    // if(pet.adopter) {
    //     if(pet.adopter.id.equals(user.id)) {
    //         res
    //           .status(422)
    //           .json({ message: "Você já agendou uma visita para esse Pet!" });
    //         return;
    //     }
    // }

    // add user to pet
  }
};
