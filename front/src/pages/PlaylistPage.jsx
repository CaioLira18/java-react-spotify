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
  const [selectedSongToPlaylistId, setSelectedSongToPlaylistId] = useState('')
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const [favoritesListSongs, setFavoritesListSongs] = useState([])
  const [favoritesListPlaylists, setFavoritesListPlaylists] = useState([])
  const [userID, setUserID] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const API_URL = "http://localhost:8080/api"

  // Carregar usuário inicial do LocalStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setIsAuthenticated(true)
        setIsAdmin(parsedUser.role === 'ADMIN')
        setUserID(parsedUser.id)
        setFavoritesListSongs(parsedUser.listMusic || [])
        setFavoritesListPlaylists(parsedUser.listPlaylists || [])
      } catch (err) {
        console.error("Erro ao processar usuário do localStorage", err)
      }
    }
  }, [])

  // Buscar todas as músicas
  useEffect(() => {
    fetch(`${API_URL}/songs`)
      .then(res => res.json())
      .then(data => setSongs(data))
      .catch(console.error)
  }, [])

  // Buscar dados da playlist específica
  useEffect(() => {
    fetch(`${API_URL}/playlists/${id}`)
      .then(res => res.json())
      .then(data => setPlaylistData(data))
      .catch(() => showToast("Erro ao carregar playlist!", "error"))
  }, [id])

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
    setSelectedSongToPlaylistId('')
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

  const addPlaylistToFavorites = async () => {
    if (!playlistData || !userID) return

    try {
      const response = await fetch(
        `${API_URL}/users/${userID}/favorites/playlist/${playlistData.id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }
      )

      if (response.ok) {
        const updatedFavorites = [...favoritesListPlaylists, playlistData]
        setFavoritesListPlaylists(updatedFavorites)

        const storedUser = JSON.parse(localStorage.getItem('user'))
        if (storedUser) {
          storedUser.listPlaylists = updatedFavorites
          localStorage.setItem('user', JSON.stringify(storedUser))
        }

        showToast("Playlist adicionada aos favoritos!", "success")
      } else {
        showToast("Erro ao adicionar playlist aos favoritos", "error")
      }
    } catch (error) {
      console.error(error)
      showToast("Erro ao adicionar playlist aos favoritos", "error")
    }
  }

  const deletePlaylistToFavorites = async () => {
    if (!playlistData || !userID) return

    try {
      const response = await fetch(
        `${API_URL}/users/${userID}/favorites/playlist/${playlistData.id}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        }
      )

      if (response.ok) {
        const updatedFavorites = favoritesListPlaylists.filter(p => p.id !== playlistData.id)
        setFavoritesListPlaylists(updatedFavorites)

        const storedUser = JSON.parse(localStorage.getItem('user'))
        if (storedUser) {
          storedUser.listPlaylists = updatedFavorites
          localStorage.setItem('user', JSON.stringify(storedUser))
        }

        showToast("Playlist removida dos favoritos!", "success")
      } else {
        showToast("Erro ao remover playlist dos favoritos", "error")
      }
    } catch (error) {
      console.error(error)
      showToast("Erro ao remover playlist dos favoritos", "error")
    }
  }

  // CORRIGIDO: URL agora é /playlists/{playlistId}/music/{musicId}
  const addMusicToPlaylist = async () => {
    if (!selectedSongToPlaylistId || !playlistData) return

    try {
      const response = await fetch(
        `${API_URL}/playlists/${playlistData.id}/music/${selectedSongToPlaylistId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }
      )

      if (response.ok) {
        showToast("Música adicionada à playlist!", "success")
        
        // Recarregar dados da playlist
        fetch(`${API_URL}/playlists/${id}`)
          .then(res => res.json())
          .then(data => setPlaylistData(data))
          .catch(console.error)
        
        closeAdminModal()
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Erro ao adicionar música:', errorData)
        showToast("Erro ao adicionar música à playlist", "error")
      }
    } catch (error) {
      console.error('Erro ao adicionar música:', error)
      showToast("Erro ao adicionar música à playlist", "error")
    }
  }

  // CORRIGIDO: URL agora é /playlists/{playlistId}/music/{musicId}
  const removeMusicFromPlaylist = async () => {
    if (!selectedSongToPlaylistId || !playlistData) return

    try {
      const response = await fetch(
        `${API_URL}/playlists/${playlistData.id}/music/${selectedSongToPlaylistId}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        }
      )

      if (response.ok) {
        showToast("Música deletada da playlist!", "success")
        
        // Recarregar dados da playlist
        fetch(`${API_URL}/playlists/${id}`)
          .then(res => res.json())
          .then(data => setPlaylistData(data))
          .catch(console.error)
        
        closeAdminModal()
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Erro ao remover música:', errorData)
        showToast("Erro ao remover música da playlist", "error")
      }
    } catch (error) {
      console.error('Erro ao remover música:', error)
      showToast("Erro ao remover música da playlist", "error")
    }
  }

  // Calcular duração total
  const calculateTotalDuration = (songs) => {
    const totalSeconds = songs.reduce((acc, song) => {
      const [min, sec] = song.duration.split(':').map(Number);
      return acc + (min * 60 + sec);
    }, 0);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes} min ${seconds} s`;
  }

  // --- FILTROS DE RENDERIZAÇÃO ---

  if (!playlistData) {
    return <h1>Carregando Playlist...</h1>
  }

  const playlistSongs = songs.filter(song =>
    playlistData.musicsNames.some(music => music.id === song.id)
  )

  const isPlaylistFavorited = favoritesListPlaylists.some(p => p.id === playlistData.id)

  return (
    <>
      <div className="playlist-page-wrapper">
        {/* Header da Playlist */}
        <div className="playlist-header-section">
          <img src={playlistData.cover} alt={playlistData.name} className="playlist-cover-image" />
          <div className="playlist-header-info">
            <span className="playlist-label-type">Álbum</span>
            <h1 className="playlist-main-title">{playlistData.name}</h1>
            <div className="playlist-meta-info">
              <img src={playlistData.artistsNames.map(artista => artista.profilePhoto)} alt={playlistData.name} className="playlist-artist-avatar" />
              <a href={`/artists/${playlistData.artistsNames.map(artista => artista.id)}`}><span className="playlist-artist-name">{playlistData.artistsNames?.map(a => a.name).join(', ')}</span></a>
              <span>• {playlistData.year} • {playlistSongs.length} músicas, {calculateTotalDuration(playlistSongs)}</span>
            </div>
          </div>
        </div>

        {/* Controles de ação */}
        <div className="playlist-action-bar">
          <button className="playlist-play-button" onClick={() => handlePlay(0)}>
            <i className="fa-solid fa-play"></i>
          </button>
          <button className="playlist-action-btn">
            <i className="fa-solid fa-shuffle"></i>
          </button>
          <button
            className="playlist-action-btn"
            onClick={isPlaylistFavorited ? deletePlaylistToFavorites : addPlaylistToFavorites}
          >
            <i className={isPlaylistFavorited ? "fa-solid fa-check" : "fa-regular fa-heart"}></i>
          </button>
          <button className="playlist-action-btn">
            <i className="fa-solid fa-arrow-down"></i>
          </button>
          <button className="playlist-action-btn" onClick={(e) => modalAdminMoreOptions(playlistData, e)}>
            <i className="fa-solid fa-ellipsis"></i>
          </button>
        </div>

        {/* Lista de Músicas */}
        <div className="playlist-songs-list">
          <div className="playlist-table-header">
            <span className="table-col-number">#</span>
            <span className="table-col-title">Título</span>
            <div className="durationReprodution">
              <span className="table-col-plays">Reproduções</span>
              <span className="table-col-duration">Duração</span>
            </div>
          </div>

          {playlistSongs.map((song, index) => (
            <div className="playlist-song-row" key={song.id}>
              <div className="playlist-song-item" onClick={() => handlePlay(index)}>
                <span className="song-index-number">{index + 1}</span>
                <div className="song-title-section">
                  <img src={song.cover} alt={song.name} className="song-cover-thumb" />
                  <div className="song-text-info">
                    <h4 className="song-title-text">{song.name}</h4>
                    <p className="song-artist-text">{song.artistsNames?.map(a => a.name).join(', ')}</p>
                  </div>
                </div>
                <div className="durationReprodution">
                  <span className="song-plays-count">{(Math.random() * 100000000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</span>
                  <div className="song-duration-section">
                    <p className="song-time-text">{song.duration}</p>
                    <button className="song-options-btn" onClick={(e) => modalMoreOptions(song, e)}>
                      <i className="fa-solid fa-ellipsis"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="playlist-bottom-space"></div>
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
                favoritesListPlaylists.some(playlist => playlist.id === selectedPlaylist.id) ? (
                  <button className="modal-action-option" onClick={deletePlaylistToFavorites}>
                    <i className="fa-solid fa-heart" style={{ color: '#1db954' }}></i>
                    <span>Remover dos Favoritos</span>
                  </button>
                ) : (
                  <button className="modal-action-option" onClick={addPlaylistToFavorites}>
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
                      value={selectedSongToPlaylistId}
                      onChange={(e) => setSelectedSongToPlaylistId(e.target.value)}
                    >
                      <option value="">Selecione uma música</option>
                      {songs.map(song => (
                        <option key={song.id} value={song.id}>
                          {song.name} - {song.artistsNames?.map(a => a.name).join(', ')}
                        </option>
                      ))}
                    </select>
                    <button onClick={addMusicToPlaylist}>Adicionar Música No Álbum</button>
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