import React, { useEffect, useState } from 'react'

const AddAlbumPage = () => {
  const API_URL = "http://localhost:8080/api";

  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [cover, setCover] = useState("");
  const [year, setYear] = useState("");
  const [musicUrl, setMusicUrl] = useState("");
  const [type, setType] = useState("ALBUM");
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [artistsIds, setArtistsIds] = useState([]);
  const [songsIds, setSongsIds] = useState([]);


  useEffect(() => {
    fetch(`${API_URL}/artists`)
      .then(response => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then(data => setArtists(data))
      .catch(() => alert("Erro ao buscar Artistas."));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/songs`)
      .then(response => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then(data => setSongs(data))
      .catch(() => alert("Erro ao buscar Artistas."));
  }, []);

  function addItem() {
    // Verifique se os IDs estão chegando como Array de Strings
    const payload = {
      name,
      duration,
      cover,
      type,
      year,
      artistsIds,
      songsIds
    };

    fetch(`${API_URL}/albums`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(async response => {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Erro no servidor");
        }
        return response.json();
      })
      .then(() => {
        alert("Adicionado com sucesso!");
        // Resetar para valores padrão, não strings vazias em campos obrigatórios
        setName("");
        setDuration("");
        setCover("");
        setYear("");
        setType("ALBUM");
        setArtistsIds([]);
        setSongsIds([]);
      })
      .catch(err => alert("Erro: " + err.message));
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

            <h1>Adicionar Álbum</h1>

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

            {/* Musicas */}
            <div className="inputBox">
              <div className="textLogo">
                <i className="fa-solid fa-pencil"></i>
                <h2>Musicas</h2>
              </div>
              <div className="inputArea">
                <select
                  multiple
                  className="form-input"
                  value={songsIds}
                  onChange={(e) => {
                    const values = Array.from(
                      e.target.selectedOptions,
                      option => option.value
                    );
                    setSongsIds(values);
                  }}
                >
                  {songs.map(song => (
                    <option key={song.id} value={song.id}>
                      {song.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Musicas Selecionadas */}
            <div className="inputBox">
              <div className="textLogo">
                <i className="fa-solid fa-pencil"></i>
                <h2>Musicas Selecionadas</h2>
              </div>
              <div className="inputArea">
                <ul>
                  {songsIds.map(id => {
                    const song = songs.find(s => s.id === id);
                    return <li key={id}>{song?.name}</li>;
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
                  <option value="ALBUM">Album</option>
                </select>
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

export default AddAlbumPage;