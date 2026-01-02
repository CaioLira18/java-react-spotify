import React, { useEffect, useState, useMemo } from 'react'
import ReactDOM from 'react-dom'

const Header = ({ setPlaylist, setCurrentIndex }) => {
  const API_URL = "http://localhost:8080/api"
  const [name, setName] = useState([])
  const [songs, setSongs] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [type, setType] = useState("ALL")
  const [modalCreateOpen, setModalCreateOpen] = useState(false)

  const [userID, setUserID] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setIsAuthenticated(true)
        setName(parsedUser.name)
        setUserID(parsedUser.id)
        setPlaylists(parsedUser.listPlaylists || [])
        setSongs(parsedUser.listMusic || [])
      } catch (err) {
        console.error("Erro ao carregar usuário", err)
      }
    }
  }, [])

  const filteredPlaylists = useMemo(() => {
    return playlists.filter(playlist => 
      playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [playlists, searchTerm])

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
        // Buscar os dados completos da playlist para atualizar a UI
        const resPlaylist = await fetch(`${API_URL}/playlists/${playlistId}`)
        const fullPlaylistData = await resPlaylist.json()

        // ATUALIZAÇÃO CRÍTICA: Atualiza o estado e o LocalStorage
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
      
      // Agora vinculamos essa nova playlist ao usuário logado
      await addPlaylistToUserList(createdData.id)
      
      setModalCreateOpen(false)
      alert("Playlist adicionada à sua biblioteca!")
    } catch (err) {
      console.error(err)
      alert("Houve um erro ao criar a playlist.")
    }
  }

  const handlePlayPlaylist = (playlist) => {
    if (playlist.songs && playlist.songs.length > 0) {
      setPlaylist(playlist.songs)
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

          <div className="playlistsListContainer">
            {filteredPlaylists.map((playlist) => (
              (type === "PLAYLIST" || type === "ALL") && (
                <div
                  className="optionsHeader"
                  key={playlist.id}
                  onClick={() => handlePlayPlaylist(playlist)}
                  style={{ cursor: "pointer" }}
                >
                  <a href={`/playlists/${playlist.id}`}>
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
              )
            ))}
          </div>
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