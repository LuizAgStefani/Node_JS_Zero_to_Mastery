import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import api from "../../../utils/api";

import RoundedImage from "../../layouts/RoundedImage";

import styles from "./Dashboard.module.css";

/* hooks */
import useFlashMessage from "../../../hooks/useFlashMessage";

function MyPets() {
  const [pets, setPets] = useState([]);
  const [token] = useState(localStorage.getItem("token") || "");
  const { setFlashMessage } = useFlashMessage();

  useEffect(() => {
    api
      .get("/pets/userpets", {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then((response) => {
        const pets = response.data;
        pets.forEach((pet) => {
          const primeiraImagem = pet["images"].split(",")[0];
          pet.images = primeiraImagem;
        });
        setPets(pets);
      });
  }, [token]);

  const removePet = async (id) => {

    let msgType = 'success'

    const data = await api.delete(`/pets/${id}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`
      }
    })
    .then(response => {
      const updatedPets = pets.filter(pet => pet.id !== id);
      setPets(updatedPets);
      return response.data;
    })
    .catch(err => {
      msgType = 'error';
      return err.response.data;
    });

    setFlashMessage(data.message, msgType);

  }

  return (
    <section>
      <div className={styles.petlist_header}>
        <h1>MyPets</h1>
        <Link to={"/pet/add"}>Cadastrar Pet</Link>
      </div>
      <div className={styles.petlist_container}>
        {pets.length > 0 &&
          pets.map((pet) => (
            <div key={pet.id} className={styles.petlist_row}>
              <RoundedImage
                src={`${process.env.REACT_APP_API}images/pets/${pet.images}`}
                alt={pet.name}
                width="px75"
              />
              <span className="bold">{pet.name}</span>
              <div className={styles.actions}>
                {pet.available ? (
                  <>
                    <Link to={`/pet/edit/${pet.id}`}>Editar</Link>
                    <button onClick={() => removePet(pet.id)}>Excluir</button>
                  </>
                ) : (
                  <p>Pet j?? Adotado</p>
                )}
              </div>
            </div>
          ))}
        {pets.length === 0 && <p>N??o h?? Pets cadastrados</p>}
      </div>
    </section>
  );
}

export default MyPets;
