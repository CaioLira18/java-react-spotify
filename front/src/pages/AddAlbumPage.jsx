import React, { useEffect, useState } from 'react';

const AddAlbumPage = () => {
  const API_URL = "http://localhost:8080/api";

  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [type, setType] = useState("ALBUM");
  const [status, setStatus] = useState("");
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [artistsIds, setArtistsIds] = useState([]);
  const [songsIds, setSongsIds] = useState([]);
  const [coverFile, setCoverFile] = useState(null);

  // Busca lista de artistas
  useEffect(() => {
    fetch(`${API_URL}/artists`)
      .then(response => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then(data => setArtists(data))
      .catch(() => alert("Erro ao buscar Artistas."));
  }, []);

  // Busca lista de músicas
  useEffect(() => {
    fetch(`${API_URL}/songs`)
      .then(response => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then(data => setSongs(data))
      .catch(() => alert("Erro ao buscar Músicas."));
  }, []);

  async function uploadCoverToCloudinary() {
    const formData = new FormData();
    formData.append("file", coverFile);
    formData.append("upload_preset", "Covers");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dthgw4q5d/image/upload",
      {
        method: "POST",
        body: formData
      }
    );

    if (!response.ok) throw new Error("Erro no upload para o Cloudinary");

    const data = await response.json();
    return data.secure_url;
  }

  async function addItem() {
    if (
      !name.trim() ||
      !coverFile ||
      !status ||
      !year ||
      !type ||
      
      artistsIds.length === 0
    ) {
      alert("Preencha todos os campos obrigatórios, incluindo a imagem.");
      return;
    }

    try {
      // 1. Faz o upload da imagem primeiro
      const uploadedCoverUrl = await uploadCoverToCloudinary();

      // 2. Monta o payload usando a URL retornada diretamente
      const payload = {
        name,
        cover: uploadedCoverUrl,
        type,
        year,
        status,
        songsIds,
        artistsIds
      };

      // 3. Envia para o seu backend
      const response = await fetch(`${API_URL}/albums`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Erro ao salvar álbum no servidor");

      alert("Álbum adicionado com sucesso!");

      // Limpa os campos após o sucesso
      setName("");
      setCoverFile(null);
      setType("ALBUM");
      setYear("");
      setStatus("");
      setSongsIds([]);
      setArtistsIds([]);
      
    } catch (error) {
      console.error(error);
      alert("Erro ao adicionar álbum. Verifique o console para mais detalhes.");
    }
  }

  return (
    <div>
      <div className="artist">
        <div className="containerItem">
          <div className="boxItem">
            <div className="logoBox">
              <img
                src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1764390583/Spotify_logo_with_text.svg_mg0kr2.webp"
                alt="Logo"
              />
            </div>

            <h1>Adicionar Álbum</h1>

            {/* Nome */}
            <div className="inputBox">
              <div className="textLogo">
                <i className="fa-solid fa-pencil"></i>
                <h2>Nome do Álbum</h2>
              </div>
              <div className="inputArea">
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            </div>

            {/* Cover (Corrigido para usar coverFile) */}
            <div className="inputBox">
              <div className="textLogo">
                <i className="fa-solid fa-panorama"></i>
                <h2>Capa do Álbum</h2>
              </div>
              <div className="inputArea">
                <label htmlFor="file-upload" className="custom-file-upload">
                  <i className="fas fa-cloud-upload-alt"></i>
                  {coverFile ? `Selecionado: ${coverFile.name}` : " Escolher arquivo"}
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => setCoverFile(e.target.files[0])}
                />
              </div>
            </div>

            {/* Ano */}
            <div className="inputBox">
              <div className="textLogo">
                <i className="fa-solid fa-pencil"></i>
                <h2>Ano de Lançamento</h2>
              </div>
              <div className="inputArea">
                <input value={year} onChange={(e) => setYear(e.target.value)} />
              </div>
            </div>

            {/* Artistas */}
            <div className="inputBox">
              <div className="textLogo">
                <i className="fa-solid fa-pencil"></i>
                <h2>Selecionar Artistas</h2>
              </div>
              <div className="inputArea">
                <select
                  multiple
                  className="form-input"
                  value={artistsIds}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    setArtistsIds(values);
                  }}
                >
                  {artists.map(artist => (
                    <option key={artist.id} value={artist.id}>{artist.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Lista de Artistas Selecionados para Visualização */}
            {artistsIds.length > 0 && (
              <div className="inputBox">
                <h2>Artistas Selecionados:</h2>
                <ul>
                  {artistsIds.map(id => (
                    <li key={id}>{artists.find(a => String(a.id) === String(id))?.name}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Musicas */}
            <div className="inputBox">
              <div className="textLogo">
                <i className="fa-solid fa-pencil"></i>
                <h2>Selecionar Músicas</h2>
              </div>
              <div className="inputArea">
                <select
                  multiple
                  className="form-input"
                  value={songsIds}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    setSongsIds(values);
                  }}
                >
                  {songs.map(song => (
                    <option key={song.id} value={song.id}>{song.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status */}
            <div className="inputBox">
              <div className="textLogo">
                <i className="fa-solid fa-pencil"></i>
                <h2>Status</h2>
              </div>
              <div className="inputArea">
                <select
                  className="form-input"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">Selecione o status</option>
                  <option value="RELEASED">Lançado</option>
                  <option value="NOT_RELEASED">Não Lançado</option>
                </select>
              </div>
            </div>

            <div className="addItemButton">
              <button onClick={addItem}>Adicionar Álbum</button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default AddAlbumPage;