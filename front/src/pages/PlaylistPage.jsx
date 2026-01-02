import React, { useEffect, useState } from 'react'
import { useParams, useOutletContext } from 'react-router-dom'

const PlaylistPage = () => {

  const { id } = useParams()
  const { setPlaylist, setCurrentIndex } = useOutletContext()
  const [playlistData, setPlaylistData] = useState(null)
  const [songs, setSongs] = useState([])
  const [toasts, setToasts] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [modalAdminOpen, setModalAdminOpen] = useState(false)
  const [selectedSong, setSelectedSong] = useState(null)
  const [selectedSongToAlbum, setSelectedSongToAlbum] = useState('')
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const [favoritesListSongs, setFavoritesListSongs] = useState([])
  const [favoritesListAlbums, setFavoritesListAlbums] = useState([])
  const [userID, setUserID] = useState(null)
  const [albums, setAlbums] = useState([])
  const [users, setUsers] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [name, setName] = useState("")
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const API_URL = "http://localhost:8080/api"

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setIsAuthenticated(true)
        setName(parsedUser.name)
        setIsAdmin(parsedUser.role === 'ADMIN')
        setUserID(parsedUser.id)
        setFavoritesListSongs(parsedUser.listMusic || [])
        setFavoritesListAlbums(parsedUser.listPlaylists || [])
      } catch (err) {
        console.error("Erro ao processar usuário do localStorage", err)
      }
    }
  }, [])

  function search(value) {
    setSearchTerm(value);
    if (!value.trim()) {
      return;
    }
    const lowerValue = value.toLowerCase();

    setFilteredSongs(songs.filter(s => s.name.toLowerCase().includes(lowerValue)));
  }

  useEffect(() => {
    fetch(`${API_URL}/users`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao buscar Usuarios.");
        }
        return response.json();
      })
      .then((data) => setUsers(data))
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/songs`)
      .then(res => res.json())
      .then(data => setSongs(data))
      .catch(console.error)
  }, [])

  useEffect(() => {
    fetch(`${API_URL}/playlists/${id}`)
      .then(res => res.json())
      .then(data => setPlaylistData(data))
      .catch(() => showToast("Erro ao carregar Album!", "error"))
  }, [id])

  useEffect(() => {
    fetch(`${API_URL}/albums`)
      .then(res => res.json())
      .then(data => setAlbums(data))
      .catch(console.error)
  }, [])

  // --- FUNÇÕES DE UTILIDADE ---

  const showToast = (message, type = 'success') => {
    const toastId = Date.now()
    setToasts(prev => [...prev, { id: toastId, message, type }])
    setTimeout(() => removeToast(toastId), 5000)
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const handlePlay = (index) => {
    setPlaylist(playlistSongs)
    setCurrentIndex(index)
  }

  const modalMoreOptions = (song, e) => {
    e.stopPropagation()
    setSelectedSong(song)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedSong(null)
  }

  const modalAdminMoreOptions = (playlist, e) => {
    e.stopPropagation()
    setSelectedPlaylist(playlist)
    setModalAdminOpen(true)
  }

  const closeAdminModal = () => {
    setModalAdminOpen(false)
    setSelectedPlaylist(null)
    setSelectedSongToAlbum('')
  }

  const addMusicToFavorites = async () => {
    if (!selectedSong || !userID) return

    try {
      const response = await fetch(
        `${API_URL}/users/${userID}/favorites/music/${selectedSong.id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }
      )

      if (response.ok) {
        const updatedFavorites = [...favoritesListSongs, selectedSong]
        setFavoritesListSongs(updatedFavorites)

        const storedUser = JSON.parse(localStorage.getItem('user'))
        if (storedUser) {
          storedUser.listMusic = updatedFavorites
          localStorage.setItem('user', JSON.stringify(storedUser))
        }

        showToast("Música adicionada aos favoritos!", "success")
        closeModal()
      } else {
        showToast("Erro ao adicionar música aos favoritos", "error")
      }
    } catch (error) {
      console.error(error)
      showToast("Erro ao adicionar música aos favoritos", "error")
    }
  }

  const deleteMusicToFavorites = async () => {
    if (!selectedSong || !userID) return

    try {
      const response = await fetch(
        `${API_URL}/users/${userID}/favorites/music/${selectedSong.id}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        }
      )

      if (response.ok) {
        const updatedFavorites = favoritesListSongs.filter(song => song.id !== selectedSong.id)
        setFavoritesListSongs(updatedFavorites)

        const storedUser = JSON.parse(localStorage.getItem('user'))
        if (storedUser) {
          storedUser.listMusic = updatedFavorites
          localStorage.setItem('user', JSON.stringify(storedUser))
        }

        showToast("Música removida dos favoritos!", "success")
        closeModal()
      } else {
        showToast("Erro ao remover música dos favoritos", "error")
      }
    } catch (error) {
      console.error(error)
      showToast("Erro ao remover música dos favoritos", "error")
    }
  }

  const findAlbumForSong = (songId) => {
    const album = albums.find(album =>
      album.musicsNames?.some(music => music.id === songId)
    )
    return album ? album.name : '---'
  }

  // Adicione o 'async' antes da função
  async function addMusicToPlaylist(songId) {
    // Verificamos se a playlist foi carregada
    if (!playlistData) return;

    try {
      const response = await fetch( // Adicionado await
        `${API_URL}/playlists/${playlistData.id}/music/${songId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response.ok) {
        showToast("Música adicionada à playlist!", "success");

        const res = await fetch(`${API_URL}/playlists/${id}`);
        const data = await res.json();
        setPlaylistData(data);

        closeAdminModal();
      } else {
        showToast("Erro ao adicionar música à playlist", "error");
      }
    } catch (error) {
      console.error('Erro ao adicionar música:', error);
      showToast("Erro ao conectar com o servidor", "error");
    }
  }

  async function removeMusicToPlaylist(songId) {
    if (!playlistData) return;

    try {
      const response = await fetch(
        `${API_URL}/playlists/${playlistData.id}/music/${songId}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response.ok) {
        showToast("Música deletada à playlist!", "success");

        const res = await fetch(`${API_URL}/playlists/${id}`);
        const data = await res.json();
        setPlaylistData(data);

        closeModal();
      } else {
        showToast("Erro ao adicionar música à playlist", "error");
      }
    } catch (error) {
      console.error('Erro ao adicionar música:', error);
      showToast("Erro ao conectar com o servidor", "error");
    }
  }


  const calculateTotalDuration = (songs) => {
    const totalSeconds = songs.reduce((acc, song) => {
      const [min, sec] = song.duration.split(':').map(Number);
      return acc + (min * 60 + sec);
    }, 0);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes} min ${seconds} s`;
  }


  if (!playlistData) {
    return <h1>Carregando Playlist...</h1>
  }

  const playlistSongs = songs.filter(song =>
    playlistData.musicsNames.some(music => music.id === song.id)
  )

  const isPlaylistFavorited = favoritesListAlbums.some(p => p.id === playlistData.id)

  return (
    <>
      <div className="playlist-page-wrapper">
        {/* Header da Playlist */}
        <div className="playlist-header-section">
          <img src={playlistData.cover} alt={playlistData.name} className="playlist-cover-image" />
          <div className="playlist-header-info">
            <span className="playlist-label-type">Playlist</span>
            <h1 className="playlist-main-title">{playlistData.name}</h1>
            <div className="playlist-meta-info">
              <img src={
                users.find(user => user.id === userID)?.image ||
                "https://res.cloudinary.com/dthgw4q5d/image/upload/v1766771462/user-solid-full_hixynk.svg"
              }
                alt="Sem foto" className="playlist-artist-avatar" />
              <span>{name} • {playlistData.year}</span>
              {playlistData.musicsNames.length != 0 && (
                <span> • {playlistSongs.length} músicas, {calculateTotalDuration(playlistSongs)}</span>
              )}
            </div>
          </div>
        </div>


        {/* Lista de Músicas */}
        <div className="playlist-songs-list">
          <div className="playlist-table-header">
            <div className="table-col-number">#</div>
            <div className="table-col-title">Título</div>
            <div className="table-col-album">Album</div>
            <div className="table-col-plays">Reproduções</div>
            <div className="table-col-duration">Duração</div>
          </div>

          {playlistSongs.map((song, index) => (
            (song.status != 'NOT_RELEASED' && (
              <div key={song.id} className="playlist-song-row">
                <div className="playlist-song-item" onClick={() => handlePlay(index)}>
                  <span className="song-index-number">{index + 1}</span>

                  <div className="song-title-section">
                    <img
                      src={song.cover}
                      alt={song.name}
                      className="song-cover-thumb"
                    />
                    <div className="song-text-info">
                      <p className="song-title-text">{song.name}</p>
                      <p className="song-artist-text">
                        {song.artistsNames?.map(a => a.name).join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="song-album-name">
                    {findAlbumForSong(song.id)}
                  </div>

                  <div className="song-plays-count">
                    {(Math.random() * 100000000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                  </div>

                  <div className="song-duration-section">
                    <p className="song-time-text">{song.duration}</p>
                    <button
                      className="song-options-btn"
                      onClick={(e) => modalMoreOptions(song, e)}
                    >
                      ⋮
                    </button>
                  </div>
                </div>
              </div>
            ))
          ))}
        </div>

        {playlistData.musicsNames.length == 0 && (
          <div className="addMusicsToPlaylistRecomendContainer">
            <div className="addMusicsToPlaylistRecomendBox">
              <h2>Vamos Incrementar Sua Playlist Com Uma Musica</h2>
            </div>
            <div className="searchPlaylist">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                placeholder="Buscar Músicas ou Episodios"
                value={searchTerm}
                onChange={(e) => search(e.target.value)}
              />
            </div>
          </div>
        )}


        {filteredSongs.map((song) => (
          playlistData.musicsNames.length == 0 && (
            <div className="songPlaylistPageContainer">
              <div className="songPlaylistPageBox">
                <div className="songPlaylistPageImage">
                  <img src={song.cover} alt="" />
                </div>
                <div className="songPlaylistPage">
                  <div className="songPlaylistPageInformations">
                    <span>{song.name}</span>
                    <span>{song.artistsNames.map(artist => artist.name).join(", ")}</span>
                  </div>
                  <div className="songPlaylistPageAlbum">
                    <span>{findAlbumForSong(song.id)}</span>
                  </div>
                  <div className="songPlaylistPageButton">
                    <button onClick={() => addMusicToPlaylist(song.id)}>Adicionar</button>
                  </div>
                </div>
              </div>
            </div>
          )
        ))}

      </div>

      {/* Modal Música */}
      {modalOpen && (
        <div className="song-modal-overlay" onClick={closeModal}>
          <div className="song-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="song-modal-header">
              <h3>Opções</h3>
              <button className="song-modal-close" onClick={closeModal}><i className="fa-solid fa-xmark"></i></button>
            </div>

            <div className="song-modal-body">
              {selectedSong && (
                <div className="modal-song-preview">
                  <img src={selectedSong.cover} alt={selectedSong.name} />
                  <div>
                    <h4>{selectedSong.name}</h4>
                    <p>{selectedSong.artistsNames?.map(a => a.name).join(', ')}</p>
                  </div>
                </div>
              )}

              {selectedSong && (
                favoritesListSongs.some(song => song.id === selectedSong.id) ? (
                  <button className="modal-action-option" onClick={deleteMusicToFavorites}>
                    <i className="fa-solid fa-heart" style={{ color: '#1db954' }}></i>
                    <span>Remover dos Favoritos</span>
                  </button>
                ) : (
                  <button className="modal-action-option" onClick={addMusicToFavorites}>
                    <i className="fa-regular fa-heart"></i>
                    <span>Adicionar aos Favoritos</span>
                  </button>
                )
              )}

              {selectedSong && (
                <button
                  className="modal-action-option"
                  onClick={() => removeMusicToPlaylist(selectedSong.id)}
                >
                  <i className="fa-solid fa-trash"></i>
                  <span>Remover Musica da Playlist</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Admin */}
      {modalAdminOpen && (
        <div className="song-modal-overlay" onClick={closeAdminModal}>
          <div className="song-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="song-modal-header">
              <h3>Opções</h3>
              <button className="song-modal-close" onClick={closeAdminModal}><i className="fa-solid fa-xmark"></i></button>
            </div>

            <div className="song-modal-body">
              {selectedPlaylist && (
                <div className="modal-song-preview">
                  <img src={selectedPlaylist.cover} alt={selectedPlaylist.name} />
                  <div>
                    <h4>{selectedPlaylist.name}</h4>
                    <p>{selectedPlaylist.artistsNames?.map(a => a.name).join(', ')}</p>
                  </div>
                </div>
              )}

              {selectedPlaylist && (
                favoritesListAlbums.some(playlist => playlist.id === selectedPlaylist.id) ? (
                  <button className="modal-action-option" onClick={deleteAlbumFromFavorites}>
                    <i className="fa-solid fa-heart" style={{ color: '#1db954' }}></i>
                    <span>Remover dos Favoritos</span>
                  </button>
                ) : (
                  <button className="modal-action-option" onClick={addAlbumToFavorites}>
                    <i className="fa-regular fa-heart"></i>
                    <span>Adicionar aos Favoritos</span>
                  </button>
                )
              )}

              {isAdmin && (
                <div className="adminOptions">
                  <div className="inserirMusica">
                    <select
                      className="form-input"
                      name="musicas"
                      id="musicas"
                      value={selectedSongToAlbum}
                      onChange={(e) => setSelectedSongToAlbum(e.target.value)}
                    >
                      <option value="">Selecione uma música</option>
                      {songs.map(song => (
                        <option key={song.id} value={song.id}>
                          {song.name} - {song.artistsNames?.map(a => a.name).join(', ')}
                        </option>
                      ))}
                    </select>
                    <button onClick={addMusicToAlbum}>Adicionar Música No Álbum</button>
                    <button onClick={removeMusicFromPlaylist}>Remover Música do Álbum</button>
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>
      )}


      {/* Notificações Toast */}
      <div className="notification-toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`notification-toast toast-style-${toast.type}`}>
            <span>{toast.message}</span>
            <button onClick={() => removeToast(toast.id)}>×</button>
          </div>
        ))}
      </div>
    </>
  )
}

export default PlaylistPage