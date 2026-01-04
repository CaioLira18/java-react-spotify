import React, { useEffect, useState } from 'react'
import { useParams, useOutletContext, useNavigate } from 'react-router-dom'
import MusicaModal from '../components/Modal/MusicaModal'
import Toast from '../components/Modal/Toast'
import ModalPlaylist from '../components/Modal/ModalPlaylist'

const PlaylistPage = () => {
  const { id } = useParams()
  const { setPlaylist, setCurrentIndex } = useOutletContext()
  const navigate = useNavigate()

  const [playlistData, setPlaylistData] = useState(null)
  const [songs, setSongs] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [toasts, setToasts] = useState([])
  const [coverFile, setCoverFile] = useState(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalPlaylistOpen, setModalPlaylistOpen] = useState(false)
  const [modalOpenPlaylistAdd, setModalOpenPlaylistAdd] = useState(false)
  const [modalEditOpenPlaylist, setModalEditOpenPlaylist] = useState(false)

  const [selectedSong, setSelectedSong] = useState(null)
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)

  const [favoritesListSongs, setFavoritesListSongs] = useState([])
  const [userID, setUserID] = useState(null)
  const [users, setUsers] = useState([])
  const [albums, setAlbums] = useState([])

  const [isAdmin, setIsAdmin] = useState(false)
  const [name, setName] = useState("")
  const [coverKey, setCoverKey] = useState(0) // Para forçar atualização da imagem

  const API_URL = "http://localhost:8080/api"

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUserID(parsedUser.id)
      setIsAdmin(parsedUser.role === 'ADMIN')
      setName(parsedUser.name)
      setFavoritesListSongs(parsedUser.listMusic || [])
    }
  }, [])

  useEffect(() => {
    fetch(`${API_URL}/users`).then(r => r.json()).then(setUsers)
    fetch(`${API_URL}/songs`).then(r => r.json()).then(setSongs)
    fetch(`${API_URL}/albums`).then(r => r.json()).then(setAlbums)
    fetch(`${API_URL}/playlists`).then(r => r.json()).then(setPlaylists)
  }, [])

  useEffect(() => {
    fetchPlaylistData()
  }, [id])

  const fetchPlaylistData = async () => {
    const res = await fetch(`${API_URL}/playlists/${id}`)
    const data = await res.json()
    setPlaylistData(data)
    return data
  }

  const showToast = (message, type = 'success') => {
    const toastId = Date.now()
    setToasts(prev => [...prev, { id: toastId, message, type }])
    setTimeout(() => removeToast(toastId), 4000)
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const modalMoreOptions = (song, e) => {
    e.stopPropagation()
    setSelectedSong(song)
    setModalOpen(true)
    setModalOpenPlaylistAdd(false)
  }

  const modalPlaylistMoreOptions = (playlist, e) => {
    e.stopPropagation()
    setSelectedPlaylist(playlist)
    setModalPlaylistOpen(true)
  }

  const closePlaylistModal = () => {
    setModalPlaylistOpen(false)
    setSelectedPlaylist(null)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedSong(null)
    setModalOpenPlaylistAdd(false)
  }

  const CloseModalEditPlaylist = () => {
    setModalEditOpenPlaylist(false)
  }

  const handlePlay = (index) => {
    setPlaylist(playlistSongs)
    setCurrentIndex(index)
  }

  const addMusicToFavorites = async () => {
    if (!selectedSong || !userID) return
    try {
      const res = await fetch(`${API_URL}/users/${userID}/favorites/music/${selectedSong.id}`, {
        method: 'POST'
      })
      if (res.ok) {
        const updated = [...favoritesListSongs, selectedSong]
        setFavoritesListSongs(updated)
        updateLocalStorage('listMusic', updated)
        showToast("Música adicionada aos favoritos!")
        closeModal()
      }
    } catch (err) {
      showToast("Erro ao adicionar", "error")
    }
  }

  const deleteMusicToFavorites = async () => {
    if (!selectedSong || !userID) return
    try {
      const res = await fetch(`${API_URL}/users/${userID}/favorites/music/${selectedSong.id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        const updated = favoritesListSongs.filter(s => s.id !== selectedSong.id)
        setFavoritesListSongs(updated)
        updateLocalStorage('listMusic', updated)
        showToast("Música removida dos favoritos!")
        closeModal()
      }
    } catch (err) {
      showToast("Erro ao remover", "error")
    }
  }

  const addMusicToPlaylist = async (playlistId) => {
    if (!selectedSong) return
    try {
      const res = await fetch(`${API_URL}/playlists/${playlistId}/music/${selectedSong.id}`, {
        method: 'POST'
      })
      if (res.ok) {
        showToast("Música adicionada à playlist!")
        setModalOpenPlaylistAdd(false)
        closeModal()

        // Se adicionou música na playlist atual, atualizar
        if (playlistId === id) {
          await fetchPlaylistData()
        }
      } else {
        showToast("Erro ao adicionar na playlist", "error")
      }
    } catch (err) {
      showToast("Erro de conexão", "error")
    }
  }

  const removeMusicFromPlaylist = async (playlistId, songId) => {
    try {
      const res = await fetch(
        `${API_URL}/playlists/${playlistId}/music/${songId}`,
        { method: 'DELETE' }
      )

      if (res.ok) {
        showToast("Música removida da playlist!")
        closeModal()

        const updatedPlaylist = await fetchPlaylistData()
      }
    } catch (err) {
      showToast("Erro de conexão", "error")
    }
  }

  const deletePlaylist = async () => {
    if (!selectedPlaylist) return

    try {
      const response = await fetch(
        `${API_URL}/playlists/${selectedPlaylist.id}`,
        { method: 'DELETE' }
      )

      if (response.ok) {
        showToast("Playlist removida!", "success")

        setPlaylists(prev =>
          prev.filter(p => p.id !== selectedPlaylist.id)
        )

        closePlaylistModal()
        navigate('/')
      } else {
        showToast("Erro ao remover Playlist", "error")
      }
    } catch (error) {
      console.error(error)
      showToast("Erro ao remover Playlist", "error")
    }
  }

  const updateLocalStorage = (key, data) => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      user[key] = data
      localStorage.setItem('user', JSON.stringify(user))
    }
  }

  async function uploadCoverToCloudinary() {
    const formData = new FormData()
    formData.append("file", coverFile)
    formData.append("upload_preset", "Covers")
    const response = await fetch("https://api.cloudinary.com/v1_1/dthgw4q5d/image/upload", {
      method: "POST",
      body: formData
    })
    if (!response.ok) throw new Error("Erro no upload")
    const data = await response.json()
    return data.secure_url
  }

  const updatePlaylist = async (data) => {
    try {
      let coverUrl = data.currentCover

      if (data.coverFile) {
        const formData = new FormData()
        formData.append("file", data.coverFile)
        formData.append("upload_preset", "Covers")

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dthgw4q5d/image/upload",
          { method: "POST", body: formData }
        )

        if (response.ok) {
          const cloudData = await response.json()
          coverUrl = cloudData.secure_url
        }
      }

      const payload = {
        name: data.name,
        description: data.description,
        cover: coverUrl,
        status: data.status,
        type: data.type
      }

      const response = await fetch(`${API_URL}/playlists/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        showToast("Playlist atualizada com sucesso!", "success")
        await fetchPlaylistData()
        setCoverKey(prev => prev + 1)
      } else {
        throw new Error("Erro ao atualizar")
      }
    } catch (error) {
      console.error("Erro:", error)
      showToast("Erro ao atualizar playlist", "error")
    }
  }

  const findAlbumForSong = (songId) => {
    const album = albums.find(a =>
      a.musicsNames?.some(m => m.id === songId)
    )
    return album ? album.name : '---'
  }

  const calculateTotalDuration = (songs) => {
    const totalSeconds = songs.reduce((acc, song) => {
      const [min, sec] = song.duration.split(':').map(Number)
      return acc + (min * 60 + sec)
    }, 0)
    return `${Math.floor(totalSeconds / 60)} min ${totalSeconds % 60} s`
  }

  if (!playlistData) return <h1>Carregando Playlist...</h1>

  const playlistSongs = songs.filter(song =>
    playlistData.musicsNames?.some(m => m.id === song.id)
  )

  const userPhoto =
    users.find(u => u.id === userID)?.image ||
    "https://res.cloudinary.com/dthgw4q5d/image/upload/v1766771462/user-solid-full_hixynk.svg"

  // Pegar a capa da playlist (já deve estar atualizada no backend)
  const playlistCover = playlistData.cover ||
    "https://res.cloudinary.com/dthgw4q5d/image/upload/v1767333292/playlist_photo_uz7btp.png"

  return (
    <>
      <div className="playlist-page-wrapper">
        <div className="playlist-header-section">
          <img
            key={coverKey}
            src={playlistCover}
            alt={playlistData.name}
            className="playlist-cover-image"
          />
          <div className="playlist-header-info">
            <span className="playlist-label-type">Playlist</span>
            <h1 className="playlist-main-title">{playlistData.name}</h1>
            <p>{playlistData.description}</p>
            <div className="playlist-meta-info">
              <img
                src={
                  playlistData.type === "SPOTIFY_PLAYLIST"
                    ? "https://res.cloudinary.com/dthgw4q5d/image/upload/v1764399202/Spotify_logo_without_text.svg_b0pw0i.png"
                    : userPhoto
                }
                className="playlist-artist-avatar"
              />
              <span>
                {playlistData.type === "SPOTIFY_PLAYLIST" ? "Spotify" : name}
              </span>
              <span>
                •
              </span>
              <span>
                {playlistSongs.length} Musicas,
              </span>
              <span>
                {calculateTotalDuration(playlistSongs)}
              </span>
            </div>
          </div>
        </div>

        <div className="playlist-action-bar">
          <button
            className="playlist-play-button"
            onClick={() => handlePlay(0)}
          >
            <i className="fa-solid fa-play"></i>
          </button>
          <button
            className="playlist-action-btn"
            onClick={(e) => modalPlaylistMoreOptions(playlistData, e)}
          >
            <i className="fa-solid fa-ellipsis"></i>
          </button>
        </div>

        <div className="playlist-songs-list">
          <div className="playlist-table-header">
            <div className="table-col-number">#</div>
            <div className="table-col-title">Título</div>
            <div className="table-col-album">Album</div>
            <div className="table-col-duration">Duração</div>
          </div>

          {playlistSongs.map((song, index) => (
            <div key={song.id} className="playlist-song-row">
              <div
                className="playlist-song-item"
                onClick={() => handlePlay(index)}
              >
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
          ))}
        </div>
      </div>

      <MusicaModal
        isOpen={modalOpen}
        onClose={closeModal}
        song={selectedSong}
        favoritesListSongs={favoritesListSongs}
        onAddFavorite={addMusicToFavorites}
        onDeleteFavorite={deleteMusicToFavorites}

        isOpenPlaylistAdd={modalOpenPlaylistAdd}
        onOpenPlaylistAdd={() => setModalOpenPlaylistAdd(true)}
        onCloseOpenPlaylistAdd={() => setModalOpenPlaylistAdd(false)}
        onMusicToPlaylist={addMusicToPlaylist}

        onRemoveFromPlaylist={removeMusicFromPlaylist}

        API_URL={API_URL}
      />

      <ModalPlaylist
        isOpen={modalPlaylistMoreOptions}
        onClose={closePlaylistModal}
        playlist={selectedPlaylist}
        deletePlaylist={deletePlaylist}
        updatePlaylist={updatePlaylist}
        API_URL={API_URL}
      />

      <Toast toasts={toasts} removeToast={removeToast} />
    </>
  )
}

export default PlaylistPage