import React, { useEffect, useState } from 'react'

const UpdateMusicPage = () => {

    const [name, setName] = useState("")
    const [duration, setDuration] = useState("")
    const [cover, setCover] = useState("")
    const [musicUrl, setMusicUrl] = useState("")
    const [musicFile, setMusicFile] = useState(null)
    const [coverFile, setCoverFile] = useState(null)
    const [type, setType] = useState("MUSIC")
    const [year, setYear] = useState("")
    const [status, setStatus] = useState("RELEASED")
    const [artists, setArtists] = useState([])
    const [artistsIds, setArtistsIds] = useState([])
    const [songs, setSongs] = useState([])
    const [selectedSong, setSelectedSong] = useState(null)
    const [toasts, setToasts] = useState([])
    const [modalOpenSong, setModalOpenSong] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [filtredSongs, setFiltredSongs] = useState([])
    const API_URL = "http://localhost:8080/api"

    const showToast = (message, type = 'success') => {
        const toastId = Date.now()
        setToasts(prev => [...prev, { id: toastId, message, type }])
        setTimeout(() => removeToast(toastId), 5000)
    }

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }

    const modalMoreOptionsAlbum = (album, e) => {
        e.stopPropagation()
        setSelectedSong(album)
        
        // Log para debug
        console.log("Status da música:", album.status)
        console.log("Música completa:", album)
        
        // Preencher os campos com os valores atuais
        setName(album.name || "")
        setYear(album.year || "")
        setDuration(album.duration || "")
        
        // Garantir que o status seja um dos valores válidos
        const validStatus = album.status === "RELEASED" || album.status === "NOT_RELEASED" 
            ? album.status 
            : "RELEASED"
        setStatus(validStatus)
        console.log("Status setado:", validStatus)
        
        setType(album.type || "MUSIC")
        
        // Se quiser preencher os artistas também
        if (album.artistsNames && Array.isArray(album.artistsNames)) {
            const ids = album.artistsNames.map(artist => artist.id).filter(id => id)
            setArtistsIds(ids)
        }
        
        setModalOpenSong(true)
    }

    const closeModalSong = () => {
        setModalOpenSong(false)
        setSelectedSong(null)
        
        // Limpar todos os campos
        setName("")
        setYear("")
        setDuration("")
        setStatus("RELEASED")
        setType("MUSIC")
        setCoverFile(null)
        setMusicFile(null)
        setArtistsIds([])
    }

    function search(value) {
        setSearchTerm(value)

        if (!value.trim()) {
            setFiltredSongs(songs)
            return
        }

        const filtered = songs.filter(song =>
            song.name.toLowerCase().includes(value.toLowerCase()) ||
            (song.artistsNames && song.artistsNames.some(artist =>
                artist.name.toLowerCase().includes(value.toLowerCase())
            ))
        )
        setFiltredSongs(filtered)
    }

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

        if (!response.ok) throw new Error("Erro ao fazer upload da música")

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

        if (!response.ok) throw new Error("Erro ao fazer upload da capa")

        const data = await response.json()
        return data.secure_url
    }


    useEffect(() => {
        fetch(`${API_URL}/songs`)
            .then(res => {
                if (!res.ok) throw new Error("Erro ao buscar musicas")
                return res.json()
            })
            .then(data => {
                const songsData = Array.isArray(data) ? data : [];
                setSongs(songsData);
                setFiltredSongs(songsData);
            })
            .catch(err => {
                console.error(err);
                setSongs([]);
                setFiltredSongs([]);
            })
    }, [])

    useEffect(() => {
        fetch(`${API_URL}/artists`)
            .then(response => response.json())
            .then(data => setArtists(data))
            .catch(() => alert("Erro ao buscar Artistas."))
    }, [])

    const fetchSongs = async () => {
        try {
            const res = await fetch(`${API_URL}/songs`)
            if (!res.ok) throw new Error("Erro ao buscar musicas")
            const data = await res.json()
            const songsData = Array.isArray(data) ? data : [];
            setSongs(songsData);
            setFiltredSongs(songsData);
        } catch (err) {
            console.error(err);
            setSongs([]);
            setFiltredSongs([]);
            showToast("Erro ao carregar musicas", "error")
        }
    }

    async function updateSong() {
        try {
            // Log para debug
            console.log("=== VALORES ANTES DE ENVIAR ===")
            console.log("Status:", status)
            console.log("Type:", type)
            console.log("Name:", name)
            console.log("Year:", year)
            console.log("Duration:", duration)
            
            // Garantir que status nunca seja vazio ou null
            let finalStatus = status;
            if (!finalStatus || (finalStatus !== "RELEASED" && finalStatus !== "NOT_RELEASED")) {
                finalStatus = "RELEASED";
                console.warn("Status inválido, usando RELEASED como padrão");
            }
            
            // Construir payload - usa valores dos states que foram preenchidos no modal
            const payload = {
                name: name.trim() || selectedSong.name,
                year: year || selectedSong.year,
                duration: duration || selectedSong.duration,
                status: finalStatus,
                type: type || "MUSIC",
                cover: selectedSong.cover,
                musicUrl: selectedSong.musicUrl
            };

            // Se há artistas selecionados, adiciona ao payload
            if (artistsIds.length > 0) {
                payload.artistsIds = artistsIds;
            }

            // Upload da capa se foi selecionada
            if (coverFile) {
                console.log("Fazendo upload da foto da capa...")
                payload.cover = await uploadCoverToCloudinary()
                console.log("Foto da Capa uploaded:", payload.cover)
            }

            // Upload da música se foi selecionada
            if (musicFile) {
                console.log("Fazendo upload da musica...")
                payload.musicUrl = await uploadMusicToCloudinary()
                console.log("Music Url uploaded:", payload.musicUrl)
            }

            console.log("Payload final completo:", JSON.stringify(payload, null, 2))

            const response = await fetch(`${API_URL}/songs/${selectedSong.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.text()
                console.error("Erro da API:", errorData)
                throw new Error(`Erro ao atualizar musica: ${errorData}`);
            }

            const result = await response.json();
            console.log("Resposta da API:", result)
            
            showToast("Musica atualizada com sucesso!", "success")
            
            await fetchSongs()
            
            closeModalSong()

        } catch (error) {
            console.error("Erro completo:", error);
            showToast("Erro ao atualizar musica: " + error.message, "error")
        }
    }

    return (
        <div>
            <div className="inputDeleteAlbumSearch">
                <input
                    value={searchTerm}
                    onChange={(e) => search(e.target.value)}
                    placeholder='Digite o Nome da Musica'
                    type="text"
                />
            </div>

            {songs.length === 0 && (
                <h1 style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>Sem Musicas</h1>
            )}

            {filtredSongs.length === 0 && songs.length > 0 && (
                <h1 style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>Sem Musicas Com Esse Nome</h1>
            )}

            {/* Container único para todas as músicas */}
            <div className="centerContent">
                <div className="deleteAlbumContainer">
                    {filtredSongs.map((song) => (
                        <div key={song.id} className="albumDeleteBox">
                            <div className="albumDeleteInformations" onClick={(e) => modalMoreOptionsAlbum(song, e)}>
                                <div className="albumDeleteImage">
                                    <img src={song.cover} alt={song.name} />
                                </div>
                                <div className="albumDeleteNames">
                                    <h4>{song.name} - {song.artistsNames.map(artist => artist.name).join(', ')}</h4>
                                    <h5>Song • {song.year}</h5>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            {/* Modal Album */}
            {modalOpenSong && (
                <div className="modal-overlay" onClick={closeModalSong}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Opções</h3>
                            <button className="close-btn" onClick={closeModalSong}><i className="fa-solid fa-xmark"></i></button>
                        </div>
                        <div className="modal-body">
                            {selectedSong && (
                                <div>
                                    <div className="song-info">
                                        <img src={selectedSong.cover} alt={selectedSong.name} />
                                        <div>
                                            <h4>{selectedSong.name}</h4>
                                            <p>{selectedSong.artistsNames.map(a => a.name).join(', ')}</p>
                                        </div>
                                    </div>
                                    {/* Nome */}
                                    <div className="inputBox">
                                        <div className="textLogo">
                                            <i className="fa-solid fa-pencil"></i>
                                            <h2>Name</h2>
                                        </div>
                                        <div className="inputArea">
                                            <input 
                                                placeholder={selectedSong.name} 
                                                value={name} 
                                                onChange={(e) => setName(e.target.value)} 
                                            />
                                        </div>
                                    </div>

                                    {/* Ano */}
                                    <div className="inputBox">
                                        <div className="textLogo">
                                            <i className="fa-solid fa-pencil"></i>
                                            <h2>Ano da Musica</h2>
                                        </div>
                                        <div className="inputArea">
                                            <input 
                                                placeholder={selectedSong.year} 
                                                value={year} 
                                                onChange={(e) => setYear(e.target.value)} 
                                            />
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
                                            {coverFile && <p style={{color: 'green', marginTop: '5px'}}>Arquivo selecionado: {coverFile.name}</p>}
                                        </div>
                                    </div>

                                    {/* Duração */}
                                    <div className="inputBox">
                                        <div className="textLogo">
                                            <i className="fa-solid fa-pencil"></i>
                                            <h2>Duração</h2>
                                        </div>
                                        <div className="inputArea">
                                            <input 
                                                placeholder={selectedSong.duration} 
                                                value={duration} 
                                                onChange={(e) => setDuration(e.target.value)} 
                                            />
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
                                    {artistsIds.length > 0 && (
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
                                    )}

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
                                            </select>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="inputBox">
                                        <div className="textLogo">
                                            <i className="fa-solid fa-pencil"></i>
                                            <h2>Status</h2>
                                        </div>
                                        <div className="inputArea">
                                            <select
                                                className="form-input"
                                                value={status}
                                                onChange={(e) => {
                                                    console.log("Status selecionado:", e.target.value)
                                                    setStatus(e.target.value)
                                                }}
                                            >
                                                <option value="RELEASED">Lançada</option>
                                                <option value="NOT_RELEASED">Não Lançada</option>
                                            </select>
                                            <p style={{color: 'yellow', marginTop: '5px'}}>Status atual: {status}</p>
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
                                            {musicFile && <p style={{color: 'green', marginTop: '5px'}}>Arquivo selecionado: {musicFile.name}</p>}
                                        </div>
                                    </div>
                                    <div className="optionDeleteAlbum">
                                        <button onClick={updateSong}>Atualizar Musica</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Notificações Toast */}
            <div className="toast-container">
                {toasts.map(toast => (
                    <div key={toast.id} className={`toast toast-${toast.type}`}>
                        <span>{toast.message}</span>
                        <button onClick={() => removeToast(toast.id)}>×</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UpdateMusicPage