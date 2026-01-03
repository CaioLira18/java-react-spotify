import React, { useEffect, useState } from 'react'
import { useParams, useOutletContext } from 'react-router-dom'
import MusicaModal from '../components/Modal/MusicaModal'
import ModalAlbum from '../components/Modal/ModalAlbum'
import Toast from '../components/Modal/Toast'

const ArtistPage = () => {
  const { id } = useParams()
  const { setPlaylist, setCurrentIndex } = useOutletContext()

  const [artista, setArtista] = useState(null)
  const [songs, setSongs] = useState([])
  const [albums, setAlbums] = useState([])
  const [toasts, setToasts] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [modalOpenAlbum, setModalOpenAlbum] = useState(false)
  const [modalOpenPlaylistAdd, setModalOpenPlaylistAdd] = useState(false)
  const [selectedSong, setSelectedSong] = useState(null)
  const [selectedAlbum, setSelectedAlbum] = useState(null)
  const [favoritesListSongs, setFavoritesListSongs] = useState([])
  const [favoritesListAlbums, setFavoritesListAlbums] = useState([])
  const [userID, setUserID] = useState(null)

  const API_URL = "http://localhost:8080/api";

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUserID(parsedUser.id)
        setFavoritesListSongs(parsedUser.listMusic || [])
        setFavoritesListAlbums(parsedUser.listAlbums || [])
      } catch (err) {
        console.error("Erro ao processar usuário", err)
      }
    }
  }, [])

  useEffect(() => {
    fetch(`${API_URL}/songs`).then(res => res.json()).then(data => setSongs(data))
    fetch(`${API_URL}/albums`).then(res => res.json()).then(data => setAlbums(Array.isArray(data) ? data : []))
    fetch(`${API_URL}/artists/${id}`).then(res => res.json()).then(data => setArtista(data))
  }, [id])

  const showToast = (message, type = 'success') => {
    const toastId = Date.now()
    setToasts(prev => [...prev, { id: toastId, message, type }])
    setTimeout(() => removeToast(toastId), 5000)
  }
  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id))

  const handlePlay = (index) => {
    setPlaylist(artistSongs)
    setCurrentIndex(index)
  }

  const openMusicModal = (song, e) => {
    e.stopPropagation();
    setSelectedSong(song);
    setModalOpen(true);
    setModalOpenPlaylistAdd(false);
  }
  const closeMusicModal = () => { setModalOpen(false); setSelectedSong(null); setModalOpenPlaylistAdd(false); }

  const openAlbumModal = (album, e) => { e.stopPropagation(); setSelectedAlbum(album); setModalOpenAlbum(true); }
  const closeAlbumModal = () => { setModalOpenAlbum(false); setSelectedAlbum(null); }

  const addMusicToFavorites = async () => {
    if (!selectedSong || !userID) return
    try {
      const res = await fetch(`${API_URL}/users/${userID}/favorites/music/${selectedSong.id}`, { method: 'POST' })
      if (res.ok) {
        const updated = [...favoritesListSongs, selectedSong]
        setFavoritesListSongs(updated)
        updateLocalStorage('listMusic', updated)
        showToast("Música adicionada aos favoritos!")
        closeMusicModal()
      }
    } catch (err) { showToast("Erro ao adicionar", "error") }
  }

  const deleteMusicToFavorites = async () => {
    try {
      const res = await fetch(`${API_URL}/users/${userID}/favorites/music/${selectedSong.id}`, { method: 'DELETE' })
      if (res.ok) {
        const updated = favoritesListSongs.filter(s => s.id !== selectedSong.id)
        setFavoritesListSongs(updated)
        updateLocalStorage('listMusic', updated)
        showToast("Música removida dos favoritos!")
        closeMusicModal()
      }
    } catch (err) { showToast("Erro ao remover", "error") }
  }

  const addMusicToPlaylist = async (playlistId) => {
    if (!selectedSong) return
    try {
      const res = await fetch(`${API_URL}/playlists/${playlistId}/music/${selectedSong.id}`, { method: 'POST' })
      if (res.ok) {
        showToast("Música adicionada à playlist!")
        setModalOpenPlaylistAdd(false)
        closeMusicModal()
      } else {
        showToast("Erro ao adicionar na playlist", "error")
      }
    } catch (err) { showToast("Erro de conexão", "error") }
  }

  const removeMusicFromPlaylist = async (playlistId, songId) => {
    if (!songId || !playlistId) {
      showToast("Erro: dados incompletos", "error");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/playlists/${playlistId}/music/${songId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast("Música excluída da playlist!");
        closeMusicModal();
      } else {
        showToast("Erro ao excluir da playlist", "error");
      }
    } catch (err) {
      console.error("Erro ao remover música:", err);
      showToast("Erro de conexão", "error");
    }
  };

  const addAlbumToFavorites = async () => {
    if (!selectedAlbum || !userID) return
    try {
      const res = await fetch(`${API_URL}/users/${userID}/favorites/album/${selectedAlbum.id}`, { method: 'POST' })
      if (res.ok) {
        const updated = [...favoritesListAlbums, selectedAlbum]
        setFavoritesListAlbums(updated)
        updateLocalStorage('listAlbums', updated)
        showToast("Álbum adicionado!"); closeAlbumModal()
      }
    } catch (err) { showToast("Erro ao adicionar", "error") }
  }

  const deleteAlbumToFavorites = async () => {
    try {
      const res = await fetch(`${API_URL}/users/${userID}/favorites/album/${selectedAlbum.id}`, { method: 'DELETE' })
      if (res.ok) {
        const updated = favoritesListAlbums.filter(a => a.id !== selectedAlbum.id)
        setFavoritesListAlbums(updated)
        updateLocalStorage('listAlbums', updated)
        showToast("Álbum removido!"); closeAlbumModal()
      }
    } catch (err) { showToast("Erro ao remover", "error") }
  }

  const updateLocalStorage = (key, data) => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) { user[key] = data; localStorage.setItem('user', JSON.stringify(user)) }
  }

  if (!artista) return <h1>Carregando Artista...</h1>

  const artistSongs = songs.filter(song => song.artistsNames?.some(a => a.name === artista.name))

  return (
    <>
      <div className="artistFlex">
        <div className="artist-individual-container">
          <div className="artist-header"><img src={artista.bannerPhoto} alt={artista.name} /></div>
          <div className="artistInformation">
            <div className="verificy"><i className="fa-solid fa-certificate"></i><p>Artista Verificado</p></div>
            <h1>{artista.name}</h1>
            <h2>9 Milhões de Ouvintes Mensais</h2>
          </div>
        </div>

        <div className="songsContainer">
          <h2>Músicas Populares</h2>
          {artistSongs.map((song, index) => (
            song.status !== "NOT_RELEASED" && (
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
                    <p onClick={(e) => openMusicModal(song, e)}><i className="fa-solid fa-ellipsis"></i></p>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>

        <div className="albumsContainer">
          <h2>Álbums Populares</h2>
          <div className="flexAlbums">
            {albums.map((album) => (
              album.artistsNames?.some(a => a.name === artista.name) && album.status !== 'NOT_RELEASED' && (
                <div className="albumsArtistPage" key={album.id}>
                  <div className="albumContainer">
                    <div className="albumImage">
                      <a href={`/albums/${album.id}`}><img src={album.cover} alt={album.name} /></a>
                    </div>
                    <div className="albumInformation">
                      <a href={`/albums/${album.id}`}><h4>{album.name}</h4></a>
                      <div className="albumCredits">
                        <p>Album • {album.year}</p>
                        <p onClick={(e) => openAlbumModal(album, e)}><i className="fa-solid fa-ellipsis"></i></p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </div>

      <MusicaModal
        isOpen={modalOpen}
        onClose={closeMusicModal}
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

      <ModalAlbum
        isOpen={modalOpenAlbum}
        onClose={closeAlbumModal}
        album={selectedAlbum}
        favoritesListAlbums={favoritesListAlbums}
        onAddFavorite={addAlbumToFavorites}
        onDeleteFavorite={deleteAlbumToFavorites}
      />

      <Toast toasts={toasts} removeToast={removeToast} />
    </>
  )
}

export default ArtistPage