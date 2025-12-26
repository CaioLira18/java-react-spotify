import React, { useEffect, useState } from 'react'

const Header = ({ setPlaylist, setCurrentIndex }) => {

  const API_URL = "http://localhost:8080/api"

  const [songs, setSongs] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [filteredSongs, setFilteredSongs] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [type, setType] = useState("ALL")

  useEffect(() => {
    fetch(`${API_URL}/songs`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Erro ao buscar músicas.")
        }
        return response.json()
      })
      .then(data => {
        setSongs(data)
        setFilteredSongs(data)
      })
      .catch(error => {
        console.error(error)
        alert("Erro ao buscar músicas.")
      })
  }, [])


  useEffect(() => {
    fetch(`${API_URL}/playlists`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Erro ao buscar playlists.")
        }
        return response.json()
      })
      .then(data => {
        setPlaylists(data)
      })
      .catch(error => {
        console.error(error)
        alert("Erro ao buscar playlists.")
      })
  }, [])

  const handlePlay = (index) => {
    setPlaylist(filteredSongs)
    setCurrentIndex(index)
  }

  function search(value) {
    setSearchTerm(value)

    const filtered = songs.filter(song =>
      song.name.toLowerCase().includes(value.toLowerCase()) ||
      song.artistsNames.some(artist =>
        artist.name.toLowerCase().includes(value.toLowerCase())
      )
    )

    setFilteredSongs(filtered)
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
          <div className="otherOption" onClick={() => setType("ALL")}><h2>All</h2></div>
          <div className="otherOption" onClick={() => setType("PLAYLIST")}><h2>Playlist</h2></div>
          <div className="otherOption" onClick={() => setType("ALBUM")}><h2>Album</h2></div>
          <div className="otherOption" onClick={() => setType("MUSIC")}><h2>Músicas</h2></div>
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


        {filteredSongs.map((song, index) => (
          (type === "MUSIC" || type === "ALL") && (
            <div
              className="optionsHeader"
              key={song.id}
              onClick={() => handlePlay(index)}
              style={{ cursor: "pointer" }}
            >
              <div className="boxOption">
                <div className="boxImage">
                  <img src={song.cover} alt={song.name} />
                </div>

                <div className="boxInformations">
                  <span>{song.name}</span>
                  <p>
                    {song.type === "MUSIC" ? "Song" : "Album"} –{" "}
                    {song.artistsNames.map(a => a.name).join(", ")}
                  </p>
                </div>
              </div>
            </div>
          )
        ))}

        {playlists.map((playlist, index) => (
          (type === "PLAYLIST" || type === "ALL") && (
            <div
              className="optionsHeader"
              key={playlist.id}
              onClick={() => handlePlay(index)}
              style={{ cursor: "pointer" }}
            >
              <div className="boxOption">
                <div className="boxImage">
                  <img src={playlist.cover} alt={playlist.name} />
                </div>

                <div className="boxInformations">
                  <span>{playlist.name}</span>
                  <p>
                    {playlist.type === "PLAYLIST" ? "playlist" : "Album"} –{" "}
                    {playlist.artistsNames.map(a => a.name).join(", ")}
                  </p>
                </div>
              </div>
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
