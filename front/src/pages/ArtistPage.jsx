import React, { useEffect, useState } from 'react'
import { useParams, useOutletContext } from 'react-router-dom'

const ArtistPage = () => {
  const { id } = useParams()
  const { setPlaylist, setCurrentIndex } = useOutletContext()

  const [artista, setArtista] = useState(null)
  const [songs, setSongs] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [toasts, setToasts] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [modalOpenPlaylist, setModalOpenPlaylist] = useState(false)
  const [selectedSong, setSelectedSong] = useState(null)
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const [userID, setUserID] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);


  // ID do usuário logado - você deve obter isso do seu sistema de autenticação

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setIsAuthenticated(true);
        setIsAdmin(parsedUser.role === 'ADMIN');
        setUserID(parsedUser.id);
      } catch (err) {
        console.error("Erro ao processar usuário do localStorage", err);
      }
    }
  }, []);

  const userId = userID;
  const API_URL = "http://localhost:8080/api"

  useEffect(() => {
    fetch(`${API_URL}/songs`)
      .then(res => res.json())
      .then(data => setSongs(data))
      .catch(console.error)
  }, [])

  useEffect(() => {
    fetch(`${API_URL}/playlists`)
      .then(res => res.json())
      .then(data => setPlaylists(data))
      .catch(console.error)
  }, [])

  useEffect(() => {
    fetch(`${API_URL}/artists/${id}`)
      .then(res => res.json())
      .then(data => setArtista(data))
      .catch(() => showToast("Erro ao carregar artista!", "error"))
  }, [id])

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

  const modalMoreOptionsPlaylist = (playlist, e) => {
    e.stopPropagation()
    setSelectedPlaylist(playlist)
    setModalOpenPlaylist(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedSong(null)
  }

  const closeModalPlaylist = () => {
    setModalOpenPlaylist(false)
    setSelectedPlaylist(null)
  }

  const addMusicToFavorites = async () => {
    if (!selectedSong) return

    try {
      const response = await fetch(
        `${API_URL}/users/${userID}/favorites/music/${selectedSong.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.ok) {
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

  const addPlaylistToFavorites = async () => {
    if (!selectedPlaylist) return

    try {
      const response = await fetch(
        `${API_URL}/users/${userId}/favorites/playlist/${selectedPlaylist.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.ok) {
        showToast("Playlist adicionada aos favoritos!", "success")
        closeModalPlaylist()
      } else {
        showToast("Erro ao adicionar playlist aos favoritos", "error")
      }
    } catch (error) {
      console.error(error)
      showToast("Erro ao adicionar playlist aos favoritos", "error")
    }
  }

  if (!artista) {
    return <h1>Carregando Artista...</h1>
  }

  const artistSongs = songs.filter(song =>
    song.artistsNames.some(artist => artist.name === artista.name)
  )

  const artistPlaylists = playlists.filter(playlist =>
    playlist.artistsNames.some(artist => artist.name === artista.name)
  )

  return (
    <>
      <div className="artistFlex">
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

        <div className="songsContainer">
          <h2>Músicas Populares</h2>

          {artistSongs.map((song, index) => (
            <div className="musicsArtistPage" key={song.id}>
              <div
                className="songContainer"
                onClick={() => handlePlay(index)}
              >
                <h4>{index + 1}</h4>

                <img src={song.cover} alt={song.name} />

                <div className="songInformation">
                  <h4>{song.name}</h4>
                  <p>
                    {song.artistsNames
                      .map(artist => artist.name)
                      .join(', ')}
                  </p>
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

        <div className="playlistsContainer">
          <h2>Playlist Populares</h2>

          {playlists.map((playlist, index) => (
            playlist.artistsNames.some(artist => artist.name === artista.name) && (
              <div className="playlistArtistPage" key={playlist.id}>
                <div className="playlistContainer" onClick={() => handlePlay(index)}>
                  <div className="albumImage">
                    <img src={playlist.cover} alt={playlist.name} />
                  </div>

                  <div className="playlistInformation">
                    <h4>{playlist.name}</h4>
                    <div className="albumCredits">
                      <p>Album</p>
                      <p> • </p>
                      <p>{playlist.year}</p>
                      <div className="modalPlaylist">
                        <p onClick={(e) => modalMoreOptionsPlaylist(playlist, e)}>
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
      </div>

      {/* Modal Música */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Opções</h3>
              <button className="close-btn" onClick={closeModal}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="modal-body">
              {selectedSong && (
                <div className="song-info">
                  <img src={selectedSong.cover} alt={selectedSong.name} />
                  <div>
                    <h4>{selectedSong.name}</h4>
                    <p>
                      {selectedSong.artistsNames
                        .map(artist => artist.name)
                        .join(', ')}
                    </p>
                  </div>
                </div>
              )}

              <button className="modal-option" onClick={addMusicToFavorites}>
                <i className="fa-solid fa-heart"></i>
                <span>Adicionar aos Favoritos</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Playlist */}
      {modalOpenPlaylist && (
        <div className="modal-overlay" onClick={closeModalPlaylist}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Opções</h3>
              <button className="close-btn" onClick={closeModalPlaylist}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="modal-body">
              {selectedPlaylist && (
                <div className="song-info">
                  <img src={selectedPlaylist.cover} alt={selectedPlaylist.name} />
                  <div>
                    <h4>{selectedPlaylist.name}</h4>
                    <p>
                      {selectedPlaylist.artistsNames
                        .map(artist => artist.name)
                        .join(', ')}
                    </p>
                  </div>
                </div>
              )}

              <button className="modal-option" onClick={addPlaylistToFavorites}>
                <i className="fa-solid fa-heart"></i>
                <span>Adicionar aos Favoritos</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
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