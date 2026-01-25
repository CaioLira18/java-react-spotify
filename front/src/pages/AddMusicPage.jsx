import React, { useEffect, useState, useMemo } from 'react'
import ArtistsSelect from '../components/ArtistsSelect'
import { useNavigate } from 'react-router-dom'

const AddMusicPage = () => {
  const API_URL = "http://localhost:8080/api"

  const [name, setName] = useState("")
  const [duration, setDuration] = useState("")
  const [musicFile, setMusicFile] = useState(null)
  const [coverFile, setCoverFile] = useState(null)
  const [style, setStyle] = useState("")
  const [type, setType] = useState("MUSIC")
  const [year, setYear] = useState("")
  const [status, setStatus] = useState("")
  const [artists, setArtists] = useState([])
  const [albums, setAlbums] = useState([])
  const [artistsIds, setArtistsIds] = useState([])
  const [selectedAlbumId, setSelectedAlbumId] = useState("")
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [toasts, setToasts] = useState([])
  const [filtredArtists, setFiltredArtists] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setIsAuthenticated(true);
        setIsAdmin(parsedUser.role === 'ADMIN');
      } catch (err) {
        console.error("Erro ao processar usuário do localStorage", err);
      }
    }
  }, []);

  {
    !isAdmin && (
      navigate('/')
    )
  }

  {
    !isAuthenticated && (
      navigate('/login')
    )
  }

  function search(value) {
    setSearchTerm(value);
    const lower = value.toLowerCase();

    if (!value.trim()) {
      setFiltredArtists(artists.filter(a => a.status !== "OFF"));
      return;
    }

    setFiltredArtists(
      artists.filter(a => a.name.toLowerCase().includes(lower) && a.status !== "OFF")
    );
  }

  useEffect(() => {
    fetch(`${API_URL}/artists`)
      .then(res => res.json())
      .then(data => {
        const activeArtists = Array.isArray(data) ? data : [];
        setArtists(activeArtists);
        // Inicializa a lista filtrada com todos os artistas ativos
        setFiltredArtists(activeArtists.filter(a => a.status !== "OFF"));
      })
      .catch(() => console.error("Erro artistas"))

    fetch(`${API_URL}/albums`)
      .then(res => res.json())
      .then(data => setAlbums(Array.isArray(data) ? data : []))
      .catch(() => console.error("Erro álbuns"))
  }, [])

  const artistAlbums = useMemo(() => {
    if (!albums || !Array.isArray(albums)) return [];
    return albums.filter(album =>
      album.artistsNames?.some(artist => artistsIds.includes(String(artist.id)))
    );
  }, [albums, artistsIds]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };

  const addMusicToAlbum = async (albumId, songId) => {
    try {
      await fetch(`${API_URL}/albums/${albumId}/music/${songId}`, { method: 'POST' });
    } catch (err) {
      showToast("Erro ao vincular álbum", "error");
    }
  };

  async function uploadToCloudinary(file, preset, type = "image") {
    if (!file) return null;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);
    const res = await fetch(`https://api.cloudinary.com/v1_1/dthgw4q5d/${type}/upload`, { method: "POST", body: formData });
    const data = await res.json();
    return data.secure_url;
  }

  async function addItem() {
    if (!name.trim() || !coverFile || artistsIds.length === 0) {
      alert("Preencha Nome, Capa e Artistas.");
      return;
    }

    try {
      setLoading(true);
      const [musicUrl, coverUrl] = await Promise.all([
        uploadToCloudinary(musicFile, "Musics", "video"),
        uploadToCloudinary(coverFile, "Covers", "image")
      ]);

      const payload = {
        name, duration: duration || "", cover: coverUrl,
        musicUrl: musicUrl || "", type, year, status, style, artistsIds
      };

      const response = await fetch(`${API_URL}/songs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error();
      const newSong = await response.json();

      if (selectedAlbumId) {
        await addMusicToAlbum(selectedAlbumId, newSong.id);
      }

      showToast("Música adicionada com sucesso!");

      setName(""); setDuration(""); setYear(""); setStatus(""); setStyle("");
      setMusicFile(null); setCoverFile(null); setArtistsIds([]); setSelectedAlbumId("");
      setSearchTerm(""); // Limpa a busca
    } catch (error) {
      showToast("Erro ao adicionar", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="artist">
      <div className="containerItem">
        <div className="boxItem">
          <div className="logoBox">
            <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1764390583/Spotify_logo_with_text.svg_mg0kr2.webp" alt="Logo" />
          </div>
          <h1>Adicionar Música</h1>

          <div className="inputBox">
            <div className="textLogo"><i className="fa-solid fa-pencil"></i><h2>Nome *</h2></div>
            <div className="inputArea"><input value={name} onChange={(e) => setName(e.target.value)} /></div>
          </div>

          <div className="inputBox">
            <div className="textLogo"><i className="fa-solid fa-calendar"></i><h2>Ano *</h2></div>
            <div className="inputArea"><input value={year} onChange={(e) => setYear(e.target.value)} /></div>
          </div>

          <div className="inputBox">
            <div className="textLogo"><i className="fa-solid fa-panorama"></i><h2>Capa *</h2></div>
            <div className="inputArea">
              <label htmlFor="cover-upload" className="custom-file-upload">{coverFile ? coverFile.name : "Escolher capa *"}</label>
              <input id="cover-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => setCoverFile(e.target.files[0])} />
            </div>
          </div>

          <div className="inputBox">
            <div className="textLogo"><i className="fa-solid fa-clock"></i><h2>Duração</h2></div>
            <div className="inputArea"><input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="0:00" /></div>
          </div>

          <div className="inputBox">
            <div className="textLogo"><i className="fa-solid fa-music"></i><h2>Áudio</h2></div>
            <div className="inputArea">
              <label htmlFor="music-upload" className="custom-file-upload">{musicFile ? musicFile.name : "Escolher áudio"}</label>
              <input id="music-upload" type="file" accept="audio/*" style={{ display: 'none' }} onChange={(e) => setMusicFile(e.target.files[0])} />
            </div>
          </div>

          <div className="inputBox">
            <div className="textLogo">
              <i className="fa-solid fa-user"></i>
              <h2>Artistas *</h2>
              <input
                className='inputArtist'
                placeholder="Pesquisar artista..."
                value={searchTerm}
                onChange={(e) => search(e.target.value)}
                type="text"
              />
            </div>
          </div>

          <div className="checkbox-group">
            {filtredArtists.length > 0 ? (
              filtredArtists.map(a => (
                <label key={a.id}>
                  <input
                    type="checkbox"
                    value={a.id}
                    checked={artistsIds.includes(String(a.id))}
                    onChange={(e) => {
                      const id = String(a.id);
                      if (e.target.checked) {
                        setArtistsIds([...artistsIds, id]);
                      } else {
                        setArtistsIds(artistsIds.filter(item => item !== id));
                      }
                    }}
                  />
                  {a.name}
                </label>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <p className="empty-state-text">Nenhum artista encontrado</p>
              </div>
            )}
          </div>

          <ArtistsSelect artistsIds={artistsIds} />

          <div className="inputBox">
            <div className="textLogo"><i className="fa-solid fa-record-vinyl"></i><h2>Vincular a Álbum?</h2></div>
            <div className="inputArea">
              <select className="form-input" value={selectedAlbumId} onChange={(e) => setSelectedAlbumId(e.target.value)}>
                <option value="">Nenhum (Single)</option>
                {artistAlbums.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
          </div>

          <div className="inputBox">
            <div className="textLogo"><i className="fa-solid fa-guitar"></i><h2>Estilo *</h2></div>
            <div className="inputArea">
              <select className="form-input" value={style} onChange={(e) => setStyle(e.target.value)}>
                <option value="">Selecione</option>
                <option value="POP">POP</option>
                <option value="ROCK">ROCK</option>
                <option value="K_POP">K-POP</option>
                <option value="CLASSIC">CLASSICA</option>
                <option value="CHRISTMAS">CHRISTMAS</option>
                <option value="COUNTRY">COUNTRY</option>
              </select>
            </div>
          </div>

          <div className="inputBox">
            <div className="textLogo"><i className="fa-solid fa-check"></i><h2>Status *</h2></div>
            <div className="inputArea">
              <select className="form-input" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">Selecione</option>
                <option value="RELEASED">Lançada</option>
                <option value="NOT_RELEASED">Não Lançada</option>
              </select>
            </div>
          </div>

          <div className="addItemButton">
            <button onClick={addItem} disabled={loading}>{loading ? "Processando..." : "Adicionar Música"}</button>
          </div>
        </div>
      </div>

      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>{t.message}</div>
        ))}
      </div>
    </div>
  )
}

export default AddMusicPage