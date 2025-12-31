import React, { useEffect, useState } from 'react'
import { useParams, useOutletContext } from 'react-router-dom'

const LikedSongsPage = () => {
  const { id } = useParams()
  const { setPlaylist, setCurrentIndex } = useOutletContext()
  const [toasts, setToasts] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSong, setSelectedSong] = useState(null)
  const [favoritesListSongs, setFavoritesListSongs] = useState([])
  const [userID, setUserID] = useState(null)
  const [users, setUsers] = useState([])
  const [albums, setAlbums] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [name, setName] = useState("")
  const [filteredSongs, setFilteredSongs] = useState([])

  const API_URL = "http://localhost:8080/api"

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setIsAuthenticated(true)
        setIsAdmin(parsedUser.role === 'ADMIN')
        setUserID(parsedUser.id)
        setName(parsedUser.name)
        
        const userSongs = parsedUser.listMusic || []
        setFavoritesListSongs(userSongs)
        setFilteredSongs(userSongs)
      } catch (err) {
        console.error(err)
      }
    }
  }, [])

  const handlePlaySong = (index) => {
    setPlaylist(favoritesListSongs)
    setCurrentIndex(index)
  }

  useEffect(() => {
    fetch(`${API_URL}/users`)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(console.error)
  }, [])

  useEffect(() => {
    fetch(`${API_URL}/albums`)
      .then(res => res.json())
      .then(data => setAlbums(data))
      .catch(console.error)
  }, [])

  const showToast = (message, type = 'success') => {
    const toastId = Date.now()
    setToasts(prev => [...prev, { id: toastId, message, type }])
    setTimeout(() => removeToast(toastId), 5000)
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
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
        setFilteredSongs(updatedFavorites)

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
        setFilteredSongs(updatedFavorites)

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

  return (
    <>
      <div className="playlist-page-wrapper">
        <div className="playlist-header-section">
          <img
            src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1767141711/ab67706c0000da84587ecba4a27774b2f6f07174_tsu1dm.jpg"
            alt="Músicas Curtidas"
            className="playlist-cover-image"
          />
          <div className="playlist-header-info">
            <p className="playlist-label-type">Álbum</p>
            <h1 className="playlist-main-title">Musicas Curtidas</h1>
            <div className="playlist-meta-info">
              <img
                src={users.find(user => user.id === userID)?.image || ''}
                alt={name}
                className="playlist-artist-avatar"
              />
              <span className="playlist-artist-name">{name}</span>
              <span>•</span>
              <span>{favoritesListSongs.length} músicas</span>
            </div>
          </div>
        </div>

        <div className="playlist-action-bar">
          <button className="playlist-play-button" onClick={() => handlePlaySong(0)}>
            <i className="fa-solid fa-play"></i>
          </button>
        </div>

        <div className="playlist-songs-list">
          <div className="playlist-table-header">
            <div className="table-col-number">#</div>
            <div className="table-col-title">Título</div>
            <div className="table-col-album">Album</div>
            <div className="table-col-plays">Reproduções</div>
            <div className="table-col-duration">Duração</div>
          </div>

          {favoritesListSongs.map((song, index) => (
            song.status !== 'NOT_RELEASED' && (
              <div key={song.id} className="playlist-song-row">
                <div className="playlist-song-item" onClick={() => handlePlaySong(index)}>
                  <span className="song-index-number">{index + 1}</span>

                  <div className="song-title-section">
                    <img
                      src={song.cover || 'https://via.placeholder.com/64'}
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
            )
          ))}
        </div>

        <div className="playlist-bottom-space"></div>
      </div>

      {modalOpen && (
        <div className="song-modal-overlay" onClick={closeModal}>
          <div className="song-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="song-modal-header">
              <h3>Opções</h3>
              <button className="song-modal-close" onClick={closeModal}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="song-modal-body">
              {selectedSong && (
                <div className="modal-song-preview">
                  <img src={selectedSong.cover || 'https://via.placeholder.com/64'} alt={selectedSong.name} />
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

      <div className="notification-toast-container">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`notification-toast toast-style-${toast.type}`}
          >
            <span>{toast.message}</span>
            <button onClick={() => removeToast(toast.id)}>×</button>
          </div>
        ))}
      </div>
    </>
  )
}

export default LikedSongsPage