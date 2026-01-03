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

  const [modalOpen, setModalOpen] = useState(false)
  const [modalPlaylistOpen, setModalPlaylistOpen] = useState(false)

  const [selectedSong, setSelectedSong] = useState(null)
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)

  const [favoritesListSongs, setFavoritesListSongs] = useState([])
  const [userID, setUserID] = useState(null)
  const [users, setUsers] = useState([])
  const [albums, setAlbums] = useState([])

  const [isAdmin, setIsAdmin] = useState(false)
  const [name, setName] = useState("")

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
    fetch(`${API_URL}/playlists/${id}`)
      .then(r => r.json())
      .then(setPlaylistData)
      .catch(() => showToast("Erro ao carregar Playlist", "error"))
  }, [id])

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
  }

  const handlePlay = (index) => {
    setPlaylist(playlistSongs)
    setCurrentIndex(index)
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

  const findAlbumForSong = (songId) => {
    const album = albums.find(a =>
      a.musicsNames?.some(m => m.id === songId)
    )
    return album ? album.name : '---'
  }

  if (!playlistData) return <h1>Carregando Playlist...</h1>

  const playlistSongs = songs.filter(song =>
    playlistData.musicsNames?.some(m => m.id === song.id)
  )

  const userPhoto =
    users.find(u => u.id === userID)?.image ||
    "https://res.cloudinary.com/dthgw4q5d/image/upload/v1766771462/user-solid-full_hixynk.svg"

  return (
    <>
      <div className="playlist-page-wrapper">
        <div className="playlist-header-section">
          <img
            src={playlistData.cover}
            alt={playlistData.name}
            className="playlist-cover-image"
          />
          <div className="playlist-header-info">
            <span className="playlist-label-type">Playlist</span>
            <h1 className="playlist-main-title">{playlistData.name}</h1>
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
                {" • "}
                {playlistData.year}
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

          {isAdmin && (
            <button
              className="playlist-action-btn"
              onClick={(e) => modalPlaylistMoreOptions(playlistData, e)}
            >
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
      />

      <ModalPlaylist
        isOpen={modalPlaylistOpen}
        onClose={closePlaylistModal}
        playlist={selectedPlaylist}
        deletePlaylist={deletePlaylist}
      />

      <Toast toasts={toasts} removeToast={removeToast} />
    </>
  )
}

export default PlaylistPage
