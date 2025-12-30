import React, { useEffect, useState } from 'react'

const ViewMusicPage = () => {
    const [artists, setArtists] = useState([])
    const [selectedSong, setSelectedSong] = useState(null)
    const [toasts, setToasts] = useState([])
    const [modalOpenSong, setModalOpenSong] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredSongs, setFilteredSongs] = useState([])
    const [songs, setSongs] = useState([])
    const [albums, setAlbums] = useState([])

    const API_URL = "http://localhost:8080/api"

    useEffect(() => {
        fetch(`${API_URL}/songs`)
            .then(response => response.json())
            .then(data => {
                setSongs(data)
                setFilteredSongs(data)
            })
            .catch(() => alert("Erro ao buscar Musicas."))
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
        setSelectedSong(artist)
        setModalOpenSong(true)
    }

    const closeModalArtist = () => {
        setModalOpenSong(false)
        setSelectedSong(null)
    }

    function search(value) {
        setSearchTerm(value)
        if (!value.trim()) {
            setFilteredSongs(songs)
            return
        }
        const filtered = songs.filter(song =>
            song.name.toLowerCase().includes(value.toLowerCase())
        )
        setFilteredSongs(filtered)
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

            <div className="centerContent">
                <div className="deleteAlbumContainer">
                    {filteredSongs.length === 0 && searchTerm === "" && (
                        <h1>Sem Artistas</h1>
                    )}

                    {filteredSongs.length === 0 && searchTerm !== "" && (
                        <h1>Sem Artistas Com Esse Nome</h1>
                    )}

                    {filteredSongs.map((artist) =>
                        <div key={artist.id} className="albumDeleteBox">
                            <div className="albumDeleteInformations" onClick={(e) => modalMoreOptionsArtists(artist, e)}>
                                <div className="albumDeleteImage">
                                    <img src={artist.cover} alt={artist.name} />
                                </div>
                                <div className="albumDeleteNames">
                                    <h4>{artist.name}</h4>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Artist */}
            {modalOpenSong && selectedSong && (
                <div className="modal-overlay" onClick={closeModalArtist}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <button className="close-btn" onClick={closeModalArtist}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="song-info">
                                <img src={selectedSong.cover} alt={selectedSong.name} />
                                <div>
                                    <h4>{selectedSong.name}</h4>
                                    <p>Musica</p>
                                </div>
                            </div>
                            <div className="statsSongs">
                                <h4>
                                    Artista: {selectedSong.artistsNames.map(a => a.name).join(", ")}
                                </h4>
                                <h4>
                                    Duração: {selectedSong.duration + "s"}
                                </h4>
                                <h4>
                                    Ano de Lançamento: {selectedSong.year}
                                </h4>
                                <h4>
                                    Album: {
                                        albums.find(album =>
                                            album.musicsNames.some(music => music.id === selectedSong.id)
                                        )?.name || 'Sem Álbum'
                                    }
                                </h4>
                                <h4>
                                    Número de Reproduções: 0
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

export default ViewMusicPage