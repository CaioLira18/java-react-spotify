import React, { useEffect, useState } from 'react'

const AddMusicPage = () => {
  const API_URL = "http://localhost:8080/api"

  const CLOUD_NAME = "dthgw4q5d"
  const UPLOAD_PRESET = "Musics"

  const [name, setName] = useState("")
  const [duration, setDuration] = useState("")
  const [cover, setCover] = useState("")
  const [musicUrl, setMusicUrl] = useState("")
  const [musicFile, setMusicFile] = useState(null)
  const [coverFile, setCoverFile] = useState(null)
  const [type, setType] = useState("MUSIC")
  const [artists, setArtists] = useState([])
  const [artistsIds, setArtistsIds] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`${API_URL}/artists`)
      .then(response => response.json())
      .then(data => setArtists(data))
      .catch(() => alert("Erro ao buscar Artistas."))
  }, [])

  async function uploadMusicToCloudinary() {
    const formData = new FormData()
    formData.append("file", musicFile)
    formData.append("upload_preset", "Musics")

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dthgw4q5d/video/upload",
      {
        method: "POST",
        body: formData
      }
    )

    if (!response.ok) throw new Error()

    const data = await response.json()
    return data.secure_url
  }

  async function uploadCoverToCloudinary() {
    const formData = new FormData()
    formData.append("file", coverFile)
    formData.append("upload_preset", "Covers")

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dthgw4q5d/image/upload",
      {
        method: "POST",
        body: formData
      }
    )

    if (!response.ok) throw new Error()

    const data = await response.json()
    return data.secure_url
  }

  async function addItem() {
    if (
      !name.trim() ||
      !duration.trim() ||
      !coverFile ||
      !musicFile ||
      artistsIds.length === 0
    ) {
      alert("Preencha os campos obrigatórios.")
      return
    }

    try {
      setLoading(true)

      const uploadedUrl = await uploadMusicToCloudinary()
      setMusicUrl(uploadedUrl)
      const uploadedCoverUrl = await uploadCoverToCloudinary()
      setCover(uploadedCoverUrl)

      const payload = {
        name,
        duration,
        cover: uploadedCoverUrl,
        musicUrl: uploadedUrl,
        type,
        artistsIds
      }

      await fetch(`${API_URL}/songs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      alert("Adicionado com sucesso!")

      setName("")
      setDuration("")
      setCover("")
      setMusicUrl("")
      setMusicFile(null)
      setArtistsIds([])
    } catch {
      alert("Erro ao adicionar.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="artist">
        <div className="containerItem">
          <div className="boxItem">

            <div className="logoBox">
              <img
                src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1764390583/Spotify_logo_with_text.svg_mg0kr2.webp"
                alt=""
              />
            </div>

            <h1>Adicionar Música</h1>

            {/* Nome */}
            <div className="inputBox">
              <div className="textLogo">
                <i className="fa-solid fa-pencil"></i>
                <h2>Name</h2>
              </div>
              <div className="inputArea">
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            </div>

            {/* Cover */}
            <div className="inputBox">
              <div className="textLogo">
                <i className="fa-solid fa-pencil"></i>
                <h2>Cover</h2>
              </div>
              <div className="inputArea">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverFile(e.target.files[0])}
                />
              </div>
            </div>

            {/* Duração */}
            <div className="inputBox">
              <div className="textLogo">
                <i className="fa-solid fa-pencil"></i>
                <h2>Duração</h2>
              </div>
              <div className="inputArea">
                <input value={duration} onChange={(e) => setDuration(e.target.value)} />
              </div>
            </div>

            {/* Artistas */}
            <div className="inputBox">
              <div className="textLogo">
                <i className="fa-solid fa-pencil"></i>
                <h2>Artistas</h2>
              </div>
              <div className="inputArea">
                <select
                  multiple
                  className="form-input"
                  value={artistsIds}
                  onChange={(e) => {
                    const values = Array.from(
                      e.target.selectedOptions,
                      option => option.value
                    )
                    setArtistsIds(values)
                  }}
                >
                  {artists.map(artist => (
                    <option key={artist.id} value={artist.id}>
                      {artist.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Artistas Selecionados */}
            <div className="inputBox">
              <div className="textLogo">
                <i className="fa-solid fa-pencil"></i>
                <h2>Artistas Selecionados</h2>
              </div>
              <div className="inputArea">
                <ul>
                  {artistsIds.map(id => {
                    const artist = artists.find(a => a.id === id)
                    return <li key={id}>{artist?.name}</li>
                  })}
                </ul>
              </div>
            </div>

            {/* Tipo */}
            <div className="inputBox">
              <div className="textLogo">
                <i className="fa-solid fa-pencil"></i>
                <h2>Role</h2>
              </div>
              <div className="inputArea">
                <select
                  className="form-input"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="MUSIC">Musica</option>
                  <option value="ALBUM">Album</option>
                </select>
              </div>
            </div>

            {/* Música (UPLOAD) */}
            <div className="inputBox">
              <div className="textLogo">
                <i className="fa-solid fa-pencil"></i>
                <h2>Musica</h2>
              </div>
              <div className="inputArea">
                <input
                  type="file"
                  accept="audio/mp3"
                  onChange={(e) => setMusicFile(e.target.files[0])}
                />
              </div>
            </div>

            <div className="addItemButton">
              <button onClick={addItem} disabled={loading}>
                {loading ? "Enviando..." : "Adicionar"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default AddMusicPage
