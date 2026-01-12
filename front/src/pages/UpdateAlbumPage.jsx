import React, { useEffect, useState } from 'react'

const UpdateAlbumPage = () => {

    const [albums, setAlbums] = useState([])
    const [selectedAlbum, setSelectedAlbum] = useState(null)
    const [toasts, setToasts] = useState([])
    const [modalOpenAlbum, setModalOpenAlbum] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredAlbums, setFilteredAlbums] = useState([])
    const [name, setName] = useState("");
    const [duration, setDuration] = useState("");
    const [cover, setCover] = useState("");
    const [year, setYear] = useState("");
    const [type, setType] = useState("ALBUM");
    const [artists, setArtists] = useState([]);
    const [songs, setSongs] = useState([]);
    const [artistsIds, setArtistsIds] = useState([]);
    const [songsIds, setSongsIds] = useState([]);
    const [status, setStatus] = useState("")
    const [coverFile, setCoverFile] = useState(null)
    const API_URL = "http://localhost:8080/api";

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setIsAuthenticated(true);
                setIsAdmin(parsedUser.role === 'ADMIN');
            } catch (err) {
                console.error("Erro ao processar usuário do localStorage", err);
            }
        }
    }, []);

    {
        !isAdmin && (
            navigate('/')
        )
    }

    {
        !isAuthenticated && (
            navigate('/login')
        )
    }

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
        setSelectedAlbum(album)

        setName(album.name || "")
        setDuration(album.duration || "")
        setYear(album.year || "")
        setType(album.type || "ALBUM")
        setStatus(album.status || "RELEASED")

        setArtistsIds(album.artistsNames?.map(a => a.id) || [])
        setSongsIds(album.musicsNames?.map(m => m.id) || [])

        setCoverFile(null)
        setModalOpenAlbum(true)
    }

    const closeModalAlbum = () => {
        setModalOpenAlbum(false)
        setSelectedAlbum(null)
        setName("")
        setDuration("")
        setYear("")
        setType("ALBUM")
        setStatus("")
        setArtistsIds([])
        setSongsIds([])
        setCoverFile(null)
    }

    function search(value) {
        setSearchTerm(value)
        if (!value.trim()) {
            setFilteredAlbums(albums)
            return
        }
        const filtered = albums.filter(album =>
            album.name.toLowerCase().includes(value.toLowerCase()) ||
            (album.artistsNames && album.artistsNames.some(artist =>
                artist.name.toLowerCase().includes(value.toLowerCase())
            ))
        )
        setFilteredAlbums(filtered)
    }

    const fetchAlbums = async () => {
        try {
            const res = await fetch(`${API_URL}/albums`)
            if (!res.ok) throw new Error("Erro ao buscar albums")
            const data = await res.json()
            const albumsData = Array.isArray(data) ? data : [];
            setAlbums(albumsData);
            setFilteredAlbums(albumsData);
        } catch (err) {
            console.error(err);
            setAlbums([]);
            setFilteredAlbums([]);
            showToast("Erro ao carregar albums", "error")
        }
    }


    async function updateAlbum() {
        try {
            let finalStatus = status;
            if (!finalStatus || (finalStatus !== "RELEASED" && finalStatus !== "NOT_RELEASED")) {
                finalStatus = selectedAlbum.status || "RELEASED";
            }

            const payload = {
                name: name.trim() || selectedAlbum.name,
                year: year || selectedAlbum.year,
                duration: duration || selectedAlbum.duration,
                status: finalStatus,
                type: type || selectedAlbum.type,
                cover: selectedAlbum.cover,
                artistsIds: artistsIds || [],
                songsIds: songsIds || []
            };

            if (coverFile) {
                payload.cover = await uploadCoverToCloudinary()
            }

            const response = await fetch(`${API_URL}/albums/${selectedAlbum.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.text()
                throw new Error(errorData);
            }

            showToast("Álbum atualizado com sucesso!", "success")
            await fetchAlbums()
            closeModalAlbum()

        } catch (error) {
            console.error("Erro:", error);
            showToast("Erro ao atualizar: IDs não podem ser nulos", "error")
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

    useEffect(() => {
        fetchAlbums()

        fetch(`${API_URL}/artists`)
            .then(res => res.json())
            .then(data => setArtists(data))
            .catch(() => console.error("Erro artistas"));

        fetch(`${API_URL}/songs`)
            .then(res => res.json())
            .then(data => setSongs(data))
            .catch(() => console.error("Erro musicas"));
    }, [])

    return (
        <div>
            <div className="inputDeleteAlbumSearch">
                <input value={searchTerm} onChange={(e) => search(e.target.value)} placeholder='Digite o Nome do Álbum' type="text" />
            </div>

            <div className="centerContent">
                <div className="deleteAlbumContainer">
                    {filteredAlbums.map((album) =>
                        <div key={album.id} className="albumDeleteBox">
                            <div className="albumDeleteInformations" onClick={(e) => modalMoreOptionsAlbum(album, e)}>
                                <div className="albumDeleteImage">
                                    <img src={album.cover} alt={album.name} />
                                </div>
                                <div className="albumDeleteNames">
                                    <h4>{album.name} - {album.artistsNames?.map(artist => artist.name).join(', ')}</h4>
                                    <h5>Álbum • {album.year}</h5>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {modalOpenAlbum && (
                <div className="modal-overlay" onClick={closeModalAlbum}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Atualizar Álbum</h3>
                            <button className="close-btn" onClick={closeModalAlbum}><i className="fa-solid fa-xmark"></i></button>
                        </div>
                        <div className="modal-body">
                            {selectedAlbum && (
                                <div>
                                    <div className="song-info">
                                        <img src={selectedAlbum.cover} alt={selectedAlbum.name} />
                                        <div>
                                            <h4>{selectedAlbum.name}</h4>
                                            <p>{selectedAlbum.artistsNames?.map(a => a.name).join(', ')}</p>
                                        </div>
                                    </div>

                                    <div className="inputBox">
                                        <div className="textLogo"><h2>Nome</h2></div>
                                        <div className="inputArea"><input value={name} onChange={(e) => setName(e.target.value)} /></div>
                                    </div>

                                    <div className="inputBox">
                                        <div className="textLogo"><h2>Capa</h2></div>
                                        <div className="inputArea"><input type="file" onChange={(e) => setCoverFile(e.target.files[0])} /></div>
                                    </div>

                                    <div className="inputBox">
                                        <div className="textLogo"><h2>Duração</h2></div>
                                        <div className="inputArea"><input value={duration} onChange={(e) => setDuration(e.target.value)} /></div>
                                    </div>

                                    <div className="inputBox">
                                        <div className="textLogo"><h2>Ano</h2></div>
                                        <div className="inputArea"><input type="number" value={year} onChange={(e) => setYear(e.target.value)} /></div>
                                    </div>

                                    <div className="inputBox">
                                        <div className="textLogo"><h2>Artistas</h2></div>
                                        <div className="inputArea">
                                            <select multiple className="form-input" value={artistsIds} onChange={(e) => setArtistsIds(Array.from(e.target.selectedOptions, o => o.value))}>
                                                {artists.map(artist => <option key={artist.id} value={artist.id}>{artist.name}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="inputBox">
                                        <div className="textLogo"><h2>Músicas</h2></div>
                                        <div className="inputArea">
                                            <select multiple className="form-input" value={songsIds} onChange={(e) => setSongsIds(Array.from(e.target.selectedOptions, o => o.value))}>
                                                {songs.map(song => <option key={song.id} value={song.id}>{song.name}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="inputBox">
                                        <div className="textLogo"><h2>Tipo</h2></div>
                                        <div className="inputArea">
                                            <select className='form-input' value={type} onChange={(e) => setType(e.target.value)}>
                                                <option value="ALBUM">Álbum</option>
                                                <option value="SINGLE">Single</option>
                                                <option value="EP">EP</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="inputBox">
                                        <div className="textLogo"><h2>Status</h2></div>
                                        <div className="inputArea">
                                            <select className="form-input" value={status} onChange={(e) => setStatus(e.target.value)}>
                                                <option value="RELEASED">Lançado</option>
                                                <option value="NOT_RELEASED">Não Lançado</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="optionDeleteAlbum">
                                        <button onClick={updateAlbum}>Atualizar Álbum</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

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

export default UpdateAlbumPage