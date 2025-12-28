import React, { useEffect, useState } from 'react'
import { useParams, useOutletContext } from 'react-router-dom'

const ArtistPage = () => {

  const { id } = useParams()
  const { setPlaylist, setCurrentIndex } = useOutletContext()
  const [artista, setArtista] = useState(null)
  const [songs, setSongs] = useState([])
  const [albums, setAlbums] = useState([])
  const [toasts, setToasts] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [modalOpenAlbum, setModalOpenAlbum] = useState(false)
  const [selectedSong, setSelectedSong] = useState(null)
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

  useEffect(() => {
    fetch(`${API_URL}/albums`)
      .then(res => {
        if (!res.ok) throw new Error("Erro ao buscar Albums"); 
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setAlbums(data);
        } else {
          setAlbums([]);
        }
      })
      .catch(err => {
        console.error(err);
        setAlbums([]);
      });
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/artists/${id}`)
      .then(res => res.json())
      .then(data => setArtista(data))
      .catch(() => showToast("Erro ao carregar artista!", "error"))
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
    setPlaylist(artistSongs)
    setCurrentIndex(index)
  }

  const modalMoreOptions = (song, e) => {
    e.stopPropagation()
    setSelectedSong(song)
    setModalOpen(true)
  }

  const modalMoreOptionsAlbum = (playlist, e) => {
    e.stopPropagation()
    setSelectedPlaylist(playlist)
    setModalOpenAlbum(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedSong(null)
  }

  const closeModalAlbum = () => {
    setModalOpenAlbum(false)
    setSelectedPlaylist(null)
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
    if (!selectedPlaylist || !userID) return

    try {
      const response = await fetch(
        `${API_URL}/users/${userID}/favorites/album/${selectedPlaylist.id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }
      )

      if (response.ok) {
        // Atualiza o estado local
        const updatedFavorites = [...favoritesListPlaylists, selectedPlaylist]
        setFavoritesListPlaylists(updatedFavorites)

        // Sincroniza com localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'))
        if (storedUser) {
          storedUser.listPlaylists = updatedFavorites
          localStorage.setItem('user', JSON.stringify(storedUser))
        }

        showToast("Playlist adicionada aos favoritos!", "success")
        closeModalAlbum()
      } else {
        showToast("Erro ao adicionar playlist aos favoritos", "error")
      }
    } catch (error) {
      console.error(error)
      showToast("Erro ao adicionar playlist aos favoritos", "error")
    }
  }

  const deletePlaylistToFavorites = async () => {
    if (!selectedPlaylist || !userID) return

    try {
      const response = await fetch(
        `${API_URL}/users/${userID}/favorites/album/${selectedPlaylist.id}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        }
      )

      if (response.ok) {
        // Remove do estado local
        const updatedFavorites = favoritesListPlaylists.filter(playlist => playlist.id !== selectedPlaylist.id)
        setFavoritesListPlaylists(updatedFavorites)

        // Sincroniza com localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'))
        if (storedUser) {
          storedUser.listPlaylists = updatedFavorites
          localStorage.setItem('user', JSON.stringify(storedUser))
        }

        showToast("Playlist removida dos favoritos!", "success")
        closeModalAlbum()
      } else {
        showToast("Erro ao remover playlist dos favoritos", "error")
      }
    } catch (error) {
      console.error(error)
      showToast("Erro ao remover playlist dos favoritos", "error")
    }
  }

  // --- FILTROS DE RENDERIZAÇÃO ---

  if (!artista) {
    return <h1>Carregando Artista...</h1>
  }

  const artistSongs = songs.filter(song =>
    song.artistsNames.some(artist => artist.name === artista.name)
  )

  return (
    <>
      <div className="artistFlex">
        {/* Header do Artista */}
        <div className="artist-individual-container">
          <div className="artist-header">
            <img src={artista.bannerPhoto} alt={artista.name} />
          </div>

          <div className="artistInformation">
            <div className="verificy">
              <i className="fa-solid fa-certificate"></i>
              <p>Artista Verificado</p>
            </div>
            <h1>{artista.name}</h1>
            <h2>9 Milhões de Ouvintes Mensais</h2>
          </div>
        </div>

        {/* Músicas Populares */}
        <div className="songsContainer">
          <h2>Músicas Populares</h2>
          {artistSongs.map((song, index) => (
            <div className="musicsArtistPage" key={song.id}>
              <div className="songContainer" onClick={() => handlePlay(index)}>
                <h4>{index + 1}</h4>
                <img src={song.cover} alt={song.name} />
                <div className="songInformation">
                  <h4>{song.name}</h4>
                  <p>{song.artistsNames.map(a => a.name).join(', ')}</p>
                </div>
                <div className="otherInformation">
                  <p>{song.duration}</p>
                  <p onClick={(e) => modalMoreOptions(song, e)}>
                    <i className="fa-solid fa-ellipsis"></i>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Álbuns */}
        <div className="albumsContainer">
          <h2>Álbums Populares</h2>
          {albums.map((album, index) => (
            album.artistsNames.some(artist => artist.name === artista.name) && (
              <div className="albumsArtistPage" key={album.id}>
                <div className="albumContainer" onClick={() => handlePlay(index)}>
                  <div className="albumImage">
                    <a href={`/albums/${album.id}`}><img src={album.cover} alt={album.name} /></a>
                  </div>
                  <div className="albumInformation">
                    <h4>{album.name}</h4>
                    <div className="albumCredits">
                      <p>Album • {album.year}</p>
                      <div className="modalPlaylist">
                        <p onClick={(e) => modalMoreOptionsAlbum(album, e)}>
                          <i className="fa-solid fa-ellipsis"></i>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
        <div className="space"></div>
      </div>

      {/* Modal Música */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Opções</h3>
              <button className="close-btn" onClick={closeModal}><i className="fa-solid fa-xmark"></i></button>
            </div>

            <div className="modal-body">
              {selectedSong && (
                <div className="song-info">
                  <img src={selectedSong.cover} alt={selectedSong.name} />
                  <div>
                    <h4>{selectedSong.name}</h4>
                    <p>{selectedSong.artistsNames.map(a => a.name).join(', ')}</p>
                  </div>
                </div>
              )}

              {selectedSong && (
                favoritesListSongs.some(song => song.id === selectedSong.id) ? (
                  <button className="modal-option" onClick={deleteMusicToFavorites}>
                    <i className="fa-solid fa-heart" style={{ color: '#1db954' }}></i>
                    <span>Remover dos Favoritos</span>
                  </button>
                ) : (
                  <button className="modal-option" onClick={addMusicToFavorites}>
                    <i className="fa-regular fa-heart"></i>
                    <span>Adicionar aos Favoritos</span>
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Album */}
      {modalOpenAlbum && (
        <div className="modal-overlay" onClick={closeModalAlbum}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Opções</h3>
              <button className="close-btn" onClick={closeModalAlbum}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="modal-body">
              {selectedPlaylist && (
                <div className="song-info">
                  <img src={selectedPlaylist.cover} alt={selectedPlaylist.name} />
                  <div>
                    <h4>{selectedPlaylist.name}</h4>
                    <p>{selectedPlaylist.artistsNames.map(a => a.name).join(', ')}</p>
                  </div>
                </div>
              )}
              {selectedPlaylist && (
                favoritesListPlaylists.some(playlist => playlist.id === selectedPlaylist.id) ? (
                  <button className="modal-option" onClick={deletePlaylistToFavorites}>
                    <i className="fa-solid fa-heart" style={{ color: '#1db954' }}></i>
                    <span>Remover dos Favoritos</span>
                  </button>
                ) : (
                  <button className="modal-option" onClick={addPlaylistToFavorites}>
                    <i className="fa-regular fa-heart"></i>
                    <span>Adicionar aos Favoritos</span>
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notificações Toast */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span>{toast.message}</span>
            <button onClick={() => removeToast(toast.id)}>×</button>
          </div>
        ))}
      </div>
    </>
  )
}

export default ArtistPage