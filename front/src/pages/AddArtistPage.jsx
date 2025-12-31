import React, { useState } from 'react';

const AddArtistPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [status, setStatus] = useState("ON"); 
  const [toasts, setToasts] = useState([])

  const API_URL = "http://localhost:8080/api";

  const showToast = (message, type = 'success') => {
    const toastId = Date.now()
    setToasts(prev => [...prev, { id: toastId, message, type }])
    setTimeout(() => removeToast(toastId), 5000)
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  // Função para upload da foto de perfil
  async function uploadPhotoToCloudinary() {
    if (!photoFile) return null;
    const formData = new FormData();
    formData.append("file", photoFile);
    formData.append("upload_preset", "Artists_Photo");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dthgw4q5d/image/upload",
      {
        method: "POST",
        body: formData
      }
    );

    if (!response.ok) throw new Error("Erro ao fazer upload da foto");

    const data = await response.json();
    return data.secure_url;
  }

  // Função para upload do banner
  async function uploadBannerToCloudinary() {
    if (!bannerFile) return null;
    const formData = new FormData();
    formData.append("file", bannerFile);
    formData.append("upload_preset", "Artists_Banner");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dthgw4q5d/image/upload",
      {
        method: "POST",
        body: formData
      }
    );

    if (!response.ok) throw new Error("Erro ao fazer upload do banner");

    const data = await response.json();
    return data.secure_url;
  }

  // Função principal para adicionar o artista
  async function addItem() {
    // Validação: Verificando se os campos obrigatórios e o status estão preenchidos
    if (!name.trim() || !photoFile || !bannerFile || !status) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      // 1. Faz o upload das imagens primeiro
      const uploadedPhoto = await uploadPhotoToCloudinary();
      const uploadedBanner = await uploadBannerToCloudinary();

      // 2. Monta o payload para o seu backend
      const payload = {
        name,
        profilePhoto: uploadedPhoto,
        bannerPhoto: uploadedBanner,
        description,
        status 
      };

      // 3. Envia para o seu API local
      const response = await fetch(`${API_URL}/artists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        showToast("Erro ao adicionar artista no banco de dados.", "error");
      }

      showToast("Artista adicionado com sucesso!", "sucess");

      // 4. Resetar o formulário para o estado original
      setName("");
      setDescription("");
      setPhotoFile(null);
      setBannerFile(null);
      setStatus("ON"); // Reseta para o padrão ON em vez de vazio

    } catch (error) {
      console.error(error);
      showToast("Ocorreu um erro ao processar a solicitação.", "error");
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
                <h2>Nome do Artista</h2>
              </div>
              <div className="inputArea">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Ex: Alok"
                />
              </div>
            </div>

            {/* Foto de Perfil */}
            <div className="inputBox">
              <div className="textLogo">
                <i className="fa-solid fa-image"></i>
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

            {/* Banner */}
            <div className="inputBox">
              <div className="textLogo">
                <i className="fa-solid fa-panorama"></i>
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

            {/* Descrição */}
            <div className="inputBox">
              <div className="textLogo">
                <i className="fa-solid fa-align-left"></i>
                <h2>Descrição</h2>
              </div>
              <div className="inputArea">
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  type="text"
                  placeholder="Breve biografia..."
                />
              </div>
            </div>

            {/* Status */}
            <div className="inputBox">
              <div className="textLogo">
                <i className="fa-solid fa-circle-check"></i>
                <h2>Status</h2>
              </div>
              <div className="inputArea">
                <select
                  className="form-input"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">Selecione o status</option>
                  <option value="ON">Online</option>
                  <option value="OFF">Offline</option>
                </select>
              </div>
            </div>

            <div className="addItemButton">
              <button onClick={addItem}>Finalizar Cadastro</button>
            </div>
          </div>
        </div>
      </div>
      {/* Notificações Toast */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span>{toast.message}</span>
            <button onClick={() => removeToast(toast.id)}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AddArtistPage;