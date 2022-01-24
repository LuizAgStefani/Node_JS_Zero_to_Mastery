import { useState, useEffect } from "react";

import api from "../../../utils/api";

import { useParams } from "react-router-dom";

import styles from "./AddPet.module.css";

import PetForm from "../../form/PetForm";

import useFlashMessage from "../../../hooks/useFlashMessage";

function EditPet() {
  const [pet, setPet] = useState({});
  const [token] = useState(localStorage.getItem("token"));
  const { setFlashMessage } = useFlashMessage();

  //   const params = useParams(); Pegar o objeto de todos os params da URL
  const { id } = useParams();

  useEffect(() => {
    api
      .get(`/pets/${id}`, {
        Authorization: `Bearer ${JSON.parse(token)}`,
      })
      .then((response) => {
        setPet(response.data);
        console.log(response.data);
      });
  }, [token, id]);

  const updatePet = async (pet) => {
    console.log(pet);

    let msgType = "success";

    const formData = new FormData();

    await Object.keys(pet).forEach((key) => {
      if (key === "images") {
        for (let i = 0; i < pet[key].length; i++) {
          formData.append("images", pet[key][i]);
        }
      } else {
        formData.append(key, pet[key]);
      }
    });

    for (var value of formData.getAll("images")) {
      console.log(value);
    }

    const data = await api
      .patch(`pets/${pet.id}`, formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        msgType = "error";
        return err.response.data;
      });

    setFlashMessage(data.message, msgType);
  };

  return (
    <section>
      <div className={styles.addpet_header}>
        <h1>Editando o Pet: {pet.name}</h1>
        <p>Depois da edição, os dados serão atualizados no sistema</p>
      </div>
      {pet.name && (
        <PetForm handleSubmit={updatePet} btnText="Atualizar" petData={pet} />
      )}
    </section>
  );
}

export default EditPet;
