import React, { useEffect, useState, useMemo } from 'react'
import ReactDOM from 'react-dom'

const Header = ({ setPlaylist, setCurrentIndex }) => {
  const API_URL = "http://localhost:8080/api"
  const [name, setName] = useState("")
  const [songs, setSongs] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [albums, setAlbums] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [type, setType] = useState("ALL")
  const [modalCreateOpen, setModalCreateOpen] = useState(false)
  const [playlistData, setPlaylistData] = useState(null)

  const [userID, setUserID] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')

    if (!storedUser) return

    const parsedUser = JSON.parse(storedUser)

    fetch(`${API_URL}/users/${parsedUser.id}`)
      .then(res => {
        if (!res.ok) throw new Error("Erro ao buscar usuário")
        return res.json()
      })
      .then(userData => {
        setIsAuthenticated(true)
        setName(userData.name)
        setUserID(userData.id)
        setPlaylists(userData.listPlaylists || [])
        setAlbums(userData.listAlbums || [])
        setSongs(userData.listMusic || [])

        localStorage.setItem('user', JSON.stringify(userData))
      })
      .catch(err => console.error(err))
  }, [])


  async function addPlaylistToUserList(playlistId) {
    try {
      const response = await fetch(
        `${API_URL}/users/${userID}/favorites/playlist/${playlistId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }
      )

      if (response.ok) {
        const resPlaylist = await fetch(`${API_URL}/playlists/${playlistId}`)
        const fullPlaylistData = await resPlaylist.json()

        const updatedPlaylists = [...playlists, fullPlaylistData]
        setPlaylists(updatedPlaylists)

        const storedUser = JSON.parse(localStorage.getItem('user'))
        if (storedUser) {
          storedUser.listPlaylists = updatedPlaylists
          localStorage.setItem('user', JSON.stringify(storedUser))
        }
      }
    } catch (error) {
      console.error("Erro ao vincular playlist ao usuário", error)
    }
  }

  async function createPlaylist() {
    const defaultPlaylist = {
      name: "Minha Playlist",
      description: "Playlist padrão",
      cover: "https://res.cloudinary.com/dthgw4q5d/image/upload/v1767333292/playlist_photo_uz7btp.png",
      type: "PLAYLIST",
      year: "2026",
      status: "RELEASED",
      songsIds: [],
    }

    try {
      const response = await fetch(`${API_URL}/playlists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(defaultPlaylist)
      })

      if (!response.ok) throw new Error("Erro ao criar playlist no servidor")

      const createdData = await response.json()
      await addPlaylistToUserList(createdData.id)

      setModalCreateOpen(false)
    } catch (err) {
      console.error(err)
    }
  }

  const handlePlayPlaylist = (playlist) => {
    if (playlist.musicsNames && playlist.musicsNames.length > 0) {
      setPlaylist(playlist.musicsNames)
      setCurrentIndex(0)
    }
  }

  return (
    <>
      <header>
        <div className="header">
          <div className="headerInformations">
            <div className="titleHeader">
              <i className="fa-solid fa-grip"></i>
              <h2>Sua Biblioteca</h2>
            </div>
            <div className="createButton" onClick={() => setModalCreateOpen(true)}>
              <i className="fa-solid fa-plus"></i>
              <span>Criar</span>
            </div>
          </div>

          <div className="othersOptions">
            <div className={`otherOption ${type === "ALL" ? "active" : ""}`} onClick={() => setType("ALL")}>
              <h2>Tudo</h2>
            </div>
            <div className={`otherOption ${type === "PLAYLIST" ? "active" : ""}`} onClick={() => setType("PLAYLIST")}>
              <h2>Playlists</h2>
            </div>
            <div className={`otherOption ${type === "ALBUM" ? "active" : ""}`} onClick={() => setType("ALBUM")}>
              <h2>Albums</h2>
            </div>
          </div>

          <div className="searchFilterOption">
            <div className="search">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                placeholder="Buscar em Sua Biblioteca"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="likedSongs">
            <a href="/likedSongs">
              <div className="boxOption">
                <div className="boxImage">
                  <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1767141711/ab67706c0000da84587ecba4a27774b2f6f07174_tsu1dm.jpg" alt="Liked" />
                </div>
                <div className="informationsLikedSongBox">
                  <span>Músicas Curtidas</span>
                  <span>{songs.length} Músicas</span>
                </div>
              </div>
            </a>
          </div>

          {(type == "ALL" || type == "PLAYLIST") && (
            <div className="playlistsListContainer">
              {playlists.map((playlist) => (
                <div
                  className="optionsHeader"
                  key={playlist.id}
                  onClick={() => handlePlayPlaylist(playlist)}
                  style={{ cursor: "pointer" }}
                >
                  <a href={`/playlists/${playlist.id}`} onClick={(e) => e.stopPropagation()}>
                    <div className="boxOption">
                      <div className="boxImage">
                        <img src={playlist.cover} alt={playlist.name} />
                      </div>
                      <div className="boxInformations">
                        <span>{playlist.name}</span>
                        <p>Playlist • {name}</p>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          )}

           {(type == "ALL" || type == "ALBUM") && (
            <div className="playlistsListContainer">
              {albums.map((album) => (
                <div
                  className="optionsHeader"
                  key={album.id}
                  onClick={() => handlePlayPlaylist(album)}
                  style={{ cursor: "pointer" }}
                >
                  <a href={`/albums/${album.id}`} onClick={(e) => e.stopPropagation()}>
                    <div className="boxOption">
                      <div className="boxImage">
                        <img src={album.cover} alt={album.name} />
                      </div>
                      <div className="boxInformations">
                        <span>{album.name}</span>
                        <p>Album • {album.artistsNames.map(artist => artist.name)}</p>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          )}

        </div>
      </header>

      {modalCreateOpen && ReactDOM.createPortal(
        <>
          <div className="modalOverlay" onClick={() => setModalCreateOpen(false)}></div>
          <div className="createModalContainer">
            <div className="optionCreateBox" onClick={createPlaylist}>
              <div className="playlistCreate">
                <div className="playlistIcon">
                  <i className="fa-solid fa-plus"></i>
                </div>
                <div className="playlistCreateInformation">
                  <span>Criar uma nova playlist</span>
                  <p>Crie uma playlist com músicas</p>
                </div>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  )
}

export default Header