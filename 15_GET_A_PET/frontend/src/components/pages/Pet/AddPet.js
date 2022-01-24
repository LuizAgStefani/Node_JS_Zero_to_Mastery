import api from "../../../utils/api";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./AddPet.module.css";

/* hooks */
import useFlashMessage from "../../../hooks/useFlashMessage";

// components
import PetForm from "../../form/PetForm";

function AddPet() {
  const [token] = useState(localStorage.getItem("token"));

  const { setFlashMessage } = useFlashMessage();

  const registerPet = async (pet) => {
    let msgType = "success";

    const formData = new FormData();

    await Object.keys(pet).forEach((key) => {
      if (key === "images") {
        for (let i = 0; i < pet[key].length; i++) {
          formData.append(key, pet[key][i]);
        }
      } else {
        formData.append(key, pet[key]);
      }
    });

    const data = await api
      .post("pets/create", formData, {
        Authorization: `Bearer ${JSON.parse(token)}`,
        "Content-Type": "multipart/form-data",
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        msgType = "error";
        return error.response.data;
      });

    setFlashMessage(data.message, msgType);

    if (msgType !== "error") {
      navigate("/pet/mypets");
    }
  };

  const navigate = useNavigate();
  return (
    <section className={styles.addpet_header}>
      <div>
        <h1>Cadastre um Pet</h1>
        <p>Depois ele ficará disponível para a adoção.</p>
      </div>
      <PetForm handleSubmit={registerPet} btnText="Cadastrar Pet" />
    </section>
  );
}

export default AddPet;
