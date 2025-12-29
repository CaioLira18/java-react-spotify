import React, { useState } from 'react'

const AddArtistPage = () => {
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [bannerPhoto, setBannerPhoto] = useState("");
  const [description, setDescription] = useState("");
  const [photoFile, setPhotoFile] = useState(null)
  const [bannerFile, setBannerFile] = useState(null)

  const API_URL = "http://localhost:8080/api";

  async function uploadPhotoToCloudinary() {
    const formData = new FormData()
    formData.append("file", photoFile)
    formData.append("upload_preset", "Artists_Photo")

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dthgw4q5d/image/upload",
      {
        method: "POST",
        body: formData
      }
    )

    if (!response.ok) throw new Error("Erro ao fazer upload da foto")

    const data = await response.json()
    return data.secure_url
  }

  async function uploadBannerToCloudinary() {
    const formData = new FormData()
    formData.append("file", bannerFile)
    formData.append("upload_preset", "Artists_Banner")

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dthgw4q5d/image/upload",
      {
        method: "POST",
        body: formData
      }
    )

    if (!response.ok) throw new Error("Erro ao fazer upload do banner")

    const data = await response.json()
    return data.secure_url
  }

  async function addItem() {
    if (!name.trim() || !photoFile || !bannerFile) {
      alert("Preencha os campos obrigatórios.");
      return;
    }

    try {
      const uploadedPhoto = await uploadPhotoToCloudinary()
      const uploadedBanner = await uploadBannerToCloudinary()

      const payload = {
        name,
        profilePhoto: uploadedPhoto,
        bannerPhoto: uploadedBanner,
        description
      };

      const response = await fetch(`${API_URL}/artists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Erro ao adicionar.");
      }

      await response.json();
      alert("Adicionado com sucesso!");
      
      setName("");
      setProfilePhoto("");
      setBannerPhoto("");
      setDescription("");
      setPhotoFile(null);
      setBannerFile(null);

    } catch (error) {
      console.error(error);
      alert("Erro ao adicionar.");
    }
  }
  
  return (
    <div>
      <div className="artist">
        <div className="containerItem">
          <div className="boxItem">
            <div className="logoBox">
              <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1764390583/Spotify_logo_with_text.svg_mg0kr2.webp" alt="Spotify Logo" />
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
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files[0])}
                />
              </div>
            </div>

            <div className="inputBox">
              <div className="textLogo">
                <i className="fa-solid fa-pencil"></i>
                <h2>Banner do Artista</h2>
              </div>
              <div className="inputArea">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBannerFile(e.target.files[0])}
                />
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