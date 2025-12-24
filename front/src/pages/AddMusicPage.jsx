import React, { useEffect, useState } from 'react'

const AddMusicPage = () => {
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [cover, setCover] = useState("");
  const [artistName, setArtistName] = useState("");
  const [musicUrl, setMusicUrl] = useState("");
  const [type, setType] = useState("");
  const [artists, setArtists] = useState("");
  const API_URL = "http://localhost:8080/api";

  useEffect(() => {
    fetch(`${API_URL}/artists`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao buscar itens.");
        }
        return response.json();
      })
      .then((data) => setArtists(data))
      .catch((error) => {
        console.error(error);
        alert("Erro ao buscar Artistas.");
      });
  }, []);

  function addItem() {
    if (!name.trim() || !duration.trim() || !cover.trim() || !musicUrl.trim() || !type.trim() || !artistName.trim()) {
      alert("Preencha os campos obrigatórios.");
      return;
    }

    const payload = {
      name,
      duration,
      cover,
      artistName,
      musicUrl,
      type
      /* Outros Atriburtos */
    };

    fetch(`${API_URL}/songs`, {
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
                <h2>Cover</h2>
              </div>
              <div className="inputArea">
                <input value={cover} onChange={(e) => setCover(e.target.value)} type="text" />
              </div>
            </div>

            <div className="inputBox">
              <div className="textLogo">
                <i className="fa-solid fa-pencil"></i>
                <h2>Duração</h2>
              </div>
              <div className="inputArea">
                <input value={duration} onChange={(e) => setDuration(e.target.value)} type="text" />
              </div>
            </div>

            <div className="inputBox">
              <div className="textLogo">
                <i className="fa-solid fa-pencil"></i>
                <h2>Artista</h2>
              </div>
              <div className="inputArea">
                <select className='form-input' value={artistName} onChange={(e) => setArtistName(e.target.value)}>
                  {artists && artists.map((artist) => (
                    <option key={artist.id} value={artist.name}>{artist.name}</option>
                  ))}
                </select>
              </div>
            </div>

             <div className="inputBox">
              <div className="textLogo">
                <i className="fa-solid fa-pencil"></i>
                <h2>Role</h2>
              </div>
              <div className="inputArea">
                <select className='form-input' value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="MUSIC">Musica</option>
                  <option value="ALBUM">Album</option>
                </select>
              </div>
            </div>

            <div className="inputBox">
              <div className="textLogo">
                <i className="fa-solid fa-pencil"></i>
                <h2>Musica Url</h2>
              </div>
              <div className="inputArea">
                <input value={musicUrl} onChange={(e) => setMusicUrl(e.target.value)} type="text" />
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
  );
}

export default AddMusicPage
