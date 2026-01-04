import React, { useEffect, useState } from 'react'
import { useParams, useOutletContext } from 'react-router-dom'
import MusicaModal from '../components/Modal/MusicaModal'
import Toast from '../components/Modal/Toast'

const AlbumPage = () => {
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
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const API_URL = "http://localhost:8080/api"

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setIsAuthenticated(true)
        setIsAdmin(parsedUser.role === 'ADMIN')
        setUserID(parsedUser.id)
        setFavoritesListSongs(parsedUser.listMusic || [])
        setFavoritesListAlbums(parsedUser.listPlaylists || [])
      } catch (err) {
        console.error("Erro ao processar usuário", err)
      }
    }
  }, [])

  useEffect(() => {
    fetch(`${API_URL}/songs`).then(res => res.json()).then(data => setSongs(data))
    fetch(`${API_URL}/albums/${id}`).then(res => res.json()).then(data => setPlaylistData(data))
    fetch(`${API_URL}/albums`).then(res => res.json()).then(data => setAlbums(data))
  }, [id])

  const showToast = (message, type = 'success') => {
    const toastId = Date.now()
    setToasts(prev => [...prev, { id: toastId, message, type }])
    setTimeout(() => removeToast(toastId), 5000)
  }

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id))

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

  const updateLocalStorage = (key, data) => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      user[key] = data
      localStorage.setItem('user', JSON.stringify(user))
    }
  }

  const addMusicToFavorites = async () => {
    if (!selectedSong || !userID) return
    try {
      const res = await fetch(`${API_URL}/users/${userID}/favorites/music/${selectedSong.id}`, { method: 'POST' })
      if (res.ok) {
        const updated = [...favoritesListSongs, selectedSong]
        setFavoritesListSongs(updated)
        updateLocalStorage('listMusic', updated)
        showToast("Música adicionada aos favoritos!")
        closeModal()
      }
    } catch (error) { showToast("Erro ao favoritar", "error") }
  }

  const deleteMusicToFavorites = async () => {
    if (!selectedSong || !userID) return
    try {
      const res = await fetch(`${API_URL}/users/${userID}/favorites/music/${selectedSong.id}`, { method: 'DELETE' })
      if (res.ok) {
        const updated = favoritesListSongs.filter(s => s.id !== selectedSong.id)
        setFavoritesListSongs(updated)
        updateLocalStorage('listMusic', updated)
        showToast("Música removida!")
        closeModal()
      }
    } catch (error) { showToast("Erro ao remover", "error") }
  }

  const addAlbumToFavorites = async () => {
    if (!playlistData || !userID) return
    try {
      const res = await fetch(`${API_URL}/users/${userID}/favorites/album/${playlistData.id}`, { method: 'POST' })
      if (res.ok) {
        const updated = [...favoritesListAlbums, playlistData]
        setFavoritesListAlbums(updated)
        updateLocalStorage('listPlaylists', updated)
        showToast("Álbum salvo!")
      }
    } catch (error) { showToast("Erro ao salvar álbum", "error") }
  }

  const deleteAlbumFromFavorites = async () => {
    if (!playlistData || !userID) return
    try {
      const res = await fetch(`${API_URL}/users/${userID}/favorites/album/${playlistData.id}`, { method: 'DELETE' })
      if (res.ok) {
        const updated = favoritesListAlbums.filter(p => p.id !== playlistData.id)
        setFavoritesListAlbums(updated)
        updateLocalStorage('listPlaylists', updated)
        showToast("Álbum removido!")
      }
    } catch (error) { showToast("Erro ao remover álbum", "error") }
  }

  const findAlbumForSong = (songId) => {
    const album = albums.find(a => a.musicsNames?.some(m => m.id === songId))
    return album ? album.name : '---'
  }

  const addMusicToAlbum = async () => {
    if (!selectedSongToAlbum || !playlistData) return
    try {
      const res = await fetch(`${API_URL}/albums/${playlistData.id}/music/${selectedSongToAlbum}`, { method: 'POST' })
      if (res.ok) {
        showToast("Música adicionada ao álbum!")
        fetch(`${API_URL}/albums/${id}`).then(res => res.json()).then(data => setPlaylistData(data))
        closeAdminModal()
      }
    } catch (error) { showToast("Erro ao adicionar música", "error") }
  }

  const removeMusicFromPlaylist = async () => {
    if (!selectedSongToAlbum || !playlistData) return
    try {
      const res = await fetch(`${API_URL}/albums/${playlistData.id}/music/${selectedSongToAlbum}`, { method: 'DELETE' })
      if (res.ok) {
        showToast("Música removida do álbum!")
        fetch(`${API_URL}/albums/${id}`).then(res => res.json()).then(data => setPlaylistData(data))
        closeAdminModal()
      }
    } catch (error) { showToast("Erro ao remover música", "error") }
  }

  const calculateTotalDuration = (songs) => {
    const totalSeconds = songs.reduce((acc, song) => {
      const [min, sec] = song.duration.split(':').map(Number)
      return acc + (min * 60 + sec)
    }, 0)
    return `${Math.floor(totalSeconds / 60)} min ${totalSeconds % 60} s`
  }

  if (!playlistData) return <h1>Carregando Álbum...</h1>

  const playlistSongs = songs.filter(song =>
    playlistData.musicsNames?.some(music => music.id === song.id)
  )

  const isPlaylistFavorited = favoritesListAlbums.some(p => p.id === playlistData.id)

  return (
    <>
      <div className="playlist-page-wrapper">
        <div className="playlist-header-section">
          <img src={playlistData.cover} alt={playlistData.name} className="playlist-cover-image" />
          <div className="playlist-header-info">
            <span className="playlist-label-type">Álbum</span>
            <h1 className="playlist-main-title">{playlistData.name}</h1>
            <div className="playlist-meta-info">
              <img src={playlistData.artistsNames?.[0]?.profilePhoto} alt="Artist" className="playlist-artist-avatar" />
              <a href={`/artists/${playlistData.artistsNames?.[0]?.id}`}>
                <span className="playlist-artist-name">{playlistData.artistsNames?.map(a => a.name).join(', ')}</span>
              </a>
              <span>• {playlistData.year} • {playlistSongs.length} músicas, {calculateTotalDuration(playlistSongs)}</span>
            </div>
          </div>
        </div>

        <div className="playlist-action-bar">
          <button className="playlist-play-button" onClick={() => handlePlay(0)}><i className="fa-solid fa-play"></i></button>
          <button className="playlist-action-btn" onClick={isPlaylistFavorited ? deleteAlbumFromFavorites : addAlbumToFavorites}>
            <i className={isPlaylistFavorited ? "fa-solid fa-check" : "fa-regular fa-heart"}></i>
          </button>
          {isAdmin && (
            <button className="playlist-action-btn" onClick={(e) => modalAdminMoreOptions(playlistData, e)}>
              <i className="fa-solid fa-ellipsis"></i>
            </button>
          )}
        </div>

        <div className="playlist-songs-list">
          <div className="playlist-table-header">
            <div className="table-col-number">#</div>
            <div className="table-col-title">Título</div>
            <div className="table-col-album">Album</div>
            <div className="table-col-duration">Duração</div>
          </div>

          {playlistSongs.map((song, index) => (
            song.status !== 'NOT_RELEASED' && (
              <div key={song.id} className="playlist-song-row">
                <div className="playlist-song-item" onClick={() => handlePlay(index)}>
                  <span className="song-index-number">{index + 1}</span>
                  <div className="song-title-section">
                    <img src={song.cover} alt={song.name} className="song-cover-thumb" />
                    <div className="song-text-info">
                      <p className="song-title-text">{song.name}</p>
                      <p className="song-artist-text">{song.artistsNames?.map(a => a.name).join(', ')}</p>
                    </div>
                  </div>
                  <div className="song-album-name">{findAlbumForSong(song.id)}</div>
                  <div className="song-duration-section">
                    <p className="song-time-text">{song.duration}</p>
                    <button className="song-options-btn" onClick={(e) => modalMoreOptions(song, e)}>⋮</button>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      <MusicaModal
        isOpen={modalOpen} onClose={closeModal} song={selectedSong}
        favoritesListSongs={favoritesListSongs} onAddFavorite={addMusicToFavorites} onDeleteFavorite={deleteMusicToFavorites}
      />

      {modalAdminOpen && (
        <div className="song-modal-overlay" onClick={closeAdminModal}>
          <div className="song-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="song-modal-header">
              <h3>Painel Admin</h3>
              <button className="song-modal-close" onClick={closeAdminModal}>×</button>
            </div>
            <div className="song-modal-body">
              <select className="form-input" value={selectedSongToAlbum} onChange={(e) => setSelectedSongToAlbum(e.target.value)}>
                <option value="">Selecione uma música</option>
                {playlistSongs.map(song => <option key={song.id} value={song.id}>{song.name}</option>)}
              </select>
              <div className="form-input-button">
                <button onClick={addMusicToAlbum}>Adicionar ao Álbum</button>
                <button onClick={removeMusicFromPlaylist}>Remover do Álbum</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* O componente Toast agora recebe os dados corretamente */}
      <Toast toasts={toasts} removeToast={removeToast} />
    </>
  )
}

export default AlbumPage