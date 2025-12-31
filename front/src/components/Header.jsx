import React, { useEffect, useState } from 'react'

const Header = ({ setPlaylist, setCurrentIndex }) => {

  const API_URL = "http://localhost:8080/api"
  const [songs, setSongs] = useState([])
  const [artists, setArtists] = useState([])
  const [albums, setAlbums] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [type, setType] = useState("ALL")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userID, setUserID] = useState(null)
  const [filteredSongs, setFilteredSongs] = useState([])


  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setIsAuthenticated(true)
        setIsAdmin(parsedUser.role === 'ADMIN')
        setUserID(parsedUser.id)

        // Corrigir os nomes das propriedades
        const userPlaylists = parsedUser.listPlaylists || []
        const userSongs = parsedUser.listMusic || []

        setPlaylists(userPlaylists)
        setSongs(userSongs)
        setFilteredSongs(userSongs)
      } catch (err) {
        console.error("Erro ao processar usuário do localStorage", err)
      }
    }
  }, [])

  useEffect(() => {
      fetch(`${API_URL}/artists`)
        .then(res => res.json())
        .then(data => setArtists(data))
        .catch(console.error)
  }, [])

  useEffect(() => {
      fetch(`${API_URL}/albums`)
        .then(res => res.json())
        .then(data => setAlbums(data))
        .catch(console.error)
  }, [])

  const handlePlayPlaylist = (playlist) => {
    if (playlist.songs && playlist.songs.length > 0) {
      setPlaylist(playlist.songs)
      setCurrentIndex(0)
    }
  }

  function search(value) {
    setSearchTerm(value)

    if (!value.trim()) {
      setFilteredSongs(songs)
      setFilteredArtists(artists)
      setFilteredAlbums(albums)
      return
    }

    const filteredSongsSearch = songs.filter(song =>
      song.name.toLowerCase().includes(value.toLowerCase()) 
    )

    const filteredArtistsSearch = artists.filter(artist =>
      artist.name.toLowerCase().includes(value.toLowerCase()) 
    )

    const filteredAlbumSearch = albums.filter(album =>
      album.name.toLowerCase().includes(value.toLowerCase())
    )

    setFilteredSongs(filteredSongsSearch)
    setFilteredAlbums(filteredAlbumSearch)
    setFilteredArtists(filteredArtistsSearch)
  }

  return (
    <header>
      <div className="header">
        <div className="headerInformations">
          <div className="titleHeader">
            <i className="fa-solid fa-grip"></i>
            <h2>Sua Biblioteca</h2>
          </div>
        </div>

        <div className="othersOptions">
          <div className="otherOption" onClick={() => setType("ALL")}>
            <h2>All</h2>
          </div>
          <div className="otherOption" onClick={() => setType("PLAYLIST")}>
            <h2>Playlist</h2>
          </div>
          <div className="otherOption" onClick={() => setType("ALBUM")}>
            <h2>Album</h2>
          </div>
          <div className="otherOption" onClick={() => setType("MUSIC")}>
            <h2>Músicas</h2>
          </div>
        </div>

        <div className="searchFilterOption">
          <div className="search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => search(e.target.value)}
            />
          </div>

          <div className="filter">
            <select>
              <option>Recentes</option>
            </select>
            <i className="fa-solid fa-list"></i>
          </div>
        </div>

        <div className="likedSongs">
          <a href="/likedSongs">
          <div className="boxOption">
            <div className="boxImage">
              <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1767141711/ab67706c0000da84587ecba4a27774b2f6f07174_tsu1dm.jpg" alt="" />
            </div>
            <div className="informationsLikedSongBox">
              <span> Musicas Curtidas</span>
              <span>{songs.length} Musicas</span>
            </div>
          </div></a>
        </div>

        {/* Renderizar playlists */}
        {playlists.length > 0 && playlists.map((playlist) => (
          (type === "PLAYLIST" || type === "ALL") && (
            <div
              className="optionsHeader"
              key={playlist.id}
              onClick={() => handlePlayPlaylist(playlist)}
              style={{ cursor: "pointer" }}
            >
              <a href={`/albums/${playlist.id}`}>
                <div className="boxOption">
                  <div className="boxImage">
                    <img src={playlist.cover} alt={playlist.name} />
                  </div>

                  <div className="boxInformations">
                    <span>{playlist.name}</span>
                    <p>
                      Playlist –{" "}
                      {playlist.artistsNames && playlist.artistsNames.map(a => a.name).join(", ")}
                    </p>
                  </div>
                </div>
              </a>
            </div>
          )
        ))}

        <div className="headerButtons">
          <div className="buttonHeader">
            <button><i className="fa-solid fa-plus"></i></button>
          </div>
          <div className="buttonHeader">
            <button><i className="fa-solid fa-plus"></i></button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header