import React, { useEffect, useState } from 'react'

const AddMusicPage = () => {
  const API_URL = "http://localhost:8080/api";

  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [cover, setCover] = useState("");
  const [musicUrl, setMusicUrl] = useState("");
  const [type, setType] = useState("MUSIC");
  const [artists, setArtists] = useState([]);
  const [artistsIds, setArtistsIds] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/artists`)
      .then(response => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then(data => setArtists(data))
      .catch(() => alert("Erro ao buscar Artistas."));
  }, []);

  function addItem() {
    if (
      !name.trim() ||
      !duration.trim() ||
      !cover.trim() ||
      !musicUrl.trim() ||
      !type.trim() ||
      artistsIds.length === 0
    ) {
      alert("Preencha os campos obrigatórios.");
      return;
    }

    const payload = {
      name,
      duration,
      cover,
      musicUrl,
      type,
      artistsIds
    };

    fetch(`${API_URL}/songs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(response => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then(() => {
        alert("Adicionado com sucesso!");
        setName("");
        setDuration("");
        setCover("");
        setMusicUrl("");
        setType("");
        setArtistsIds([]);
      })
      .catch(() => alert("Erro ao adicionar."));
  }

  return (
    <div>
      <div className="artist">
        <div className="containerItem">
          <div className="boxItem">
            <div className="logoBox">
              <img
                src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1764390583/Spotify_logo_with_text.svg_mg0kr2.webp"
                alt=""
              />
            </div>

            <h1>Adicionar Música</h1>

            {/* Nome */}
            <div className="inputBox">
              <div className="textLogo">
                <i className="fa-solid fa-pencil"></i>
                <h2>Name</h2>
              </div>
              <div className="inputArea">
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            </div>

            {/* Cover */}
            <div className="inputBox">
              <div className="textLogo">
                <i className="fa-solid fa-pencil"></i>
                <h2>Cover</h2>
              </div>
              <div className="inputArea">
                <input value={cover} onChange={(e) => setCover(e.target.value)} />
              </div>
            </div>

            {/* Duração */}
            <div className="inputBox">
              <div className="textLogo">
                <i className="fa-solid fa-pencil"></i>
                <h2>Duração</h2>
              </div>
              <div className="inputArea">
                <input value={duration} onChange={(e) => setDuration(e.target.value)} />
              </div>
            </div>

            {/* Artistas */}
            <div className="inputBox">
              <div className="textLogo">
                <i className="fa-solid fa-pencil"></i>
                <h2>Artistas</h2>
              </div>
              <div className="inputArea">
                <select
                  multiple
                  className="form-input"
                  value={artistsIds}
                  onChange={(e) => {
                    const values = Array.from(
                      e.target.selectedOptions,
                      option => option.value
                    );
                    setArtistsIds(values);
                  }}
                >
                  {artists.map(artist => (
                    <option key={artist.id} value={artist.id}>
                      {artist.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Artistas Selecionados */}
            <div className="inputBox">
              <div className="textLogo">
                <i className="fa-solid fa-pencil"></i>
                <h2>Artistas Selecionados</h2>
              </div>
              <div className="inputArea">
                <ul>
                  {artistsIds.map(id => {
                    const artist = artists.find(a => a.id === id);
                    return <li key={id}>{artist?.name}</li>;
                  })}
                </ul>
              </div>
            </div>

            {/* Tipo */}
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

            {/* Música URL */}
            <div className="inputBox">
              <div className="textLogo">
                <i className="fa-solid fa-pencil"></i>
                <h2>Musica Url</h2>
              </div>
              <div className="inputArea">
                <input value={musicUrl} onChange={(e) => setMusicUrl(e.target.value)} />
              </div>
            </div>

            <div className="addItemButton">
              <button onClick={addItem}>Adicionar</button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default AddMusicPage;
