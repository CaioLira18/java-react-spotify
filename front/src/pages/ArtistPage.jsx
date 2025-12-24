import React, { useEffect, useState } from 'react'
import { useParams, useOutletContext } from 'react-router-dom'

const ArtistPage = () => {
  const { id } = useParams()
  const { setPlaylist, setCurrentIndex } = useOutletContext()

  const [artista, setArtista] = useState(null)
  const [songs, setSongs] = useState([])
  const [toasts, setToasts] = useState([])

  const API_URL = "http://localhost:8080/api"

  useEffect(() => {
    fetch(`${API_URL}/songs`)
      .then(res => res.json())
      .then(data => setSongs(data))
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

  if (!artista) {
    return <h1>Carregando Artista...</h1>
  }

  const artistSongs = songs.filter(song =>
    song.artistsNames.some(artist => artist.name === artista.name)
  )

  const handlePlay = (index) => {
    setPlaylist(artistSongs)
    setCurrentIndex(index)
  }

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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default ArtistPage
