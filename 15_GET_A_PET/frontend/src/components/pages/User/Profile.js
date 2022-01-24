import { useState, useEffect } from "react";

import api from "../../../utils/api";

import styles from "./Profile.module.css";
import formStyles from "../../form/Form.module.css";

import Input from "../../form/Input";

import useFlashMessage from "../../../hooks/useFlashMessage";
import RoundedImage from "../../layouts/RoundedImage";

function Profile() {
  const [user, setUser] = useState({});
  const [token] = useState(localStorage.getItem("token") || "");
  const [preview, setPreview] = useState();
  const { setFlashMessage } = useFlashMessage();

  useEffect(() => {
    api
      .get("/users/checkuser", {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setUser(response.data);
      });
  }, [token]);

  const onFileChange = (e) => {
    setPreview(e.target.files[0]);
    setUser({ ...user, [e.target.name]: e.target.files[0] });
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let msgType = "success";

    const formData = new FormData();

    await Object.keys(user).forEach((key) => {
      formData.append(key, user[key]);
    });

    const data = await api
      .patch(`/users/edit/${user.id}`, formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        msgType = "error";
        return error.response.data;
      });

    setFlashMessage(data.message, msgType);
  };

  return (
    <section>
      <div className={styles.profile_container}>
        <h1>Perfil</h1>
        {(user.image || preview) && (
          <RoundedImage
            alt={user.name}
            src={
              preview
                ? URL.createObjectURL(preview)
                : `${process.env.REACT_APP_API}images/users/${user.image}`
            }
          />
        )}
      </div>
      <form onSubmit={handleSubmit} className={formStyles.form_container}>
        <Input
          text={"Imagem"}
          type={"file"}
          name={"image"}
          id="image"
          handleOnChange={onFileChange}
        />
        <Input
          text={"Email"}
          type={"email"}
          name={"email"}
          id="email"
          placeholder={"Digite o seu E-mail"}
          handleOnChange={handleChange}
          value={user.email || ""}
        />
        <Input
          text={"Nome"}
          type={"text"}
          name={"name"}
          id="name"
          placeholder={"Digite o seu Nome"}
          handleOnChange={handleChange}
          value={user.name || ""}
        />
        <Input
          text={"Telefone"}
          type={"text"}
          name={"phone"}
          id="phone"
          placeholder={"Digite o seu Telefone"}
          handleOnChange={handleChange}
          value={user.phone || ""}
        />
        <Input
          text={"Senha"}
          type={"password"}
          name={"password"}
          id="password"
          placeholder={"Digite a sua Senha"}
          handleOnChange={handleChange}
        />
        <Input
          text={"Confirmação de Senha"}
          type={"password"}
          name={"confirmpassword"}
          id="confirmpassword"
          placeholder={"Confirme a sua Senha"}
          handleOnChange={handleChange}
        />
        <input type={"submit"} value={"Editar"} />
      </form>
    </section>
  );
}

export default Profile;
