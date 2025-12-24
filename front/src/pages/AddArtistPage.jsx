import React, { useEffect, useState } from 'react'

const AddArtistPage = () => {
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [bannerPhoto, setBannerPhoto] = useState("");
  const [description, setDescription] = useState("");

  const API_URL = "http://localhost:8080/api";

  function addItem() {
    if (!name.trim() || !profilePhoto.trim() || !bannerPhoto.trim()) {
      alert("Preencha os campos obrigatórios.");
      return;
    }

    const payload = {
      name,
      profilePhoto,
      bannerPhoto,
      description
      /* Outros Atriburtos */
    };

    fetch(`${API_URL}/artists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Erro ao adicionar.");
        }
        return response.json();
      })
      .then(() => {
        alert("Adicionado com sucesso!");
        setName("");
        {/* Outros Atributos */ }
      })
      .catch(error => {
        console.error(error);
        alert("Erro ao adicionar.");
      });
  }
  return (

    <div>

      <div className="artist">

        <div className="containerItem">
          <div className="boxItem">
            <div className="logoBox">
              <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1764390583/Spotify_logo_with_text.svg_mg0kr2.webp" alt="" />
            </div>
            <h1>Adicionar Artista</h1>

            {/* Nome */}
            <div className="inputBox">
              <div className="textLogo">
                <i className="fa-solid fa-pencil"></i>
                <h2>Name</h2>
              </div>
              <div className="inputArea">
                <input value={name} onChange={(e) => setName(e.target.value)} type="text" />
              </div>
            </div>

            <div className="inputBox">
              <div className="textLogo">
                <i className="fa-solid fa-pencil"></i>
                <h2>Foto de Perfil</h2>
              </div>
              <div className="inputArea">
                <input value={profilePhoto} onChange={(e) => setProfilePhoto(e.target.value)} type="text" />
              </div>
            </div>

            <div className="inputBox">
              <div className="textLogo">
                <i className="fa-solid fa-pencil"></i>
                <h2>Banner do Artista</h2>
              </div>
              <div className="inputArea">
                <input value={bannerPhoto} onChange={(e) => setBannerPhoto(e.target.value)} type="text" />
              </div>
            </div>

            <div className="inputBox">
              <div className="textLogo">
                <i className="fa-solid fa-pencil"></i>
                <h2>Descrição</h2>
              </div>
              <div className="inputArea">
                <input value={description} onChange={(e) => setDescription(e.target.value)} type="text" />
              </div>
            </div>

            {/* Outros Atributos */}

            <div className="addItemButton">
              <button onClick={addItem}>Adicionar</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default AddArtistPage
