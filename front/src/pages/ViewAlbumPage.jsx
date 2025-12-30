import React, { useEffect, useState } from 'react'

const ViewAlbumPage = () => {
    const [selectedAlbum, setSelectedAlbum] = useState(null)
    const [toasts, setToasts] = useState([])
    const [modalOpenAlbum, setModalOpenAlbum] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredAlbums, setFilteredAlbums] = useState([])
    const [albums, setAlbums] = useState([])

    const API_URL = "http://localhost:8080/api"

    useEffect(() => {
        fetch(`${API_URL}/albums`)
            .then(response => response.json())
            .then(data => {
                setAlbums(data)
                setFilteredAlbums(data)
            })
            .catch(() => alert("Erro ao buscar Albums."))
    }, [])

    useEffect(() => {
        fetch(`${API_URL}/albums`)
            .then(response => response.json())
            .then(data => {
                setAlbums(data)
            })
            .catch(() => alert("Erro ao buscar Albums."))
    }, [])

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }

    const modalMoreOptionsArtists = (artist, e) => {
        e.stopPropagation()
        setSelectedAlbum(artist)
        setModalOpenAlbum(true)
    }

    const closeModalArtist = () => {
        setModalOpenAlbum(false)
        setSelectedAlbum(null)
    }

    function search(value) {
        setSearchTerm(value)
        if (!value.trim()) {
            setFilteredAlbums(albums)
            return
        }
        const filtered = albums.filter(album =>
            album.name.toLowerCase().includes(value.toLowerCase())
        )
        setFilteredAlbums(filtered)
    }

    return (
        <div>
            <div className="inputDeleteAlbumSearch">
                <input
                    value={searchTerm}
                    onChange={(e) => search(e.target.value)}
                    placeholder='Digite o Nome do Álbum'
                    type="text"
                />
            </div>

            <div className="centerContent">
                <div className="deleteAlbumContainer">
                    {filteredAlbums.length === 0 && searchTerm === "" && (
                        <h1>Sem Albums</h1>
                    )}

                    {filteredAlbums.length === 0 && searchTerm !== "" && (
                        <h1>Sem Albums Com Esse Nome</h1>
                    )}

                    {filteredAlbums.map((album) =>
                        <div key={album.id} className="albumDeleteBox">
                            <div className="albumDeleteInformations" onClick={(e) => modalMoreOptionsArtists(album, e)}>
                                <div className="albumDeleteImage">
                                    <img src={album.cover} alt={album.name} />
                                </div>
                                <div className="albumDeleteNames">
                                    <h4>{album.name}</h4>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Artist */}
            {modalOpenAlbum && selectedAlbum && (
                <div className="modal-overlay" onClick={closeModalArtist}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <button className="close-btn" onClick={closeModalArtist}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="song-info">
                                <img src={selectedAlbum.cover} alt={selectedAlbum.name} />
                                <div>
                                    <h4>{selectedAlbum.name}</h4>
                                    <p>Álbum</p>
                                </div>
                            </div>
                            <div className="statsSongs">
                                <h4>
                                    Artista: {selectedAlbum.artistsNames.map(a => a.name).join(", ")}
                                </h4>
                                <h4>
                                    Musicas:
                                    {selectedAlbum.musicsNames.map((song) => (
                                        <div className="albumViewBox">
                                            <div className="flexAlbumView">
                                                <div className="albumViewImage">
                                                    <img src={song.cover} alt="" />
                                                </div>
                                                <div className="albumViewInformations">
                                                    <p>{song.name}</p>
                                                    <p>
                                                        Song -{" "}
                                                        {song.artistsNames.map((artist, index) => (
                                                            <span key={artist.id}>
                                                                <a href={`/artists/${artist.id}`}>{artist.name}</a>
                                                                {index < song.artistsNames.length - 1 && ", "}
                                                            </span>
                                                        ))}
                                                    </p>
                                                </div>

                                            </div>
                                        </div>
                                    ))}
                                </h4>
                            </div>
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

export default ViewAlbumPage