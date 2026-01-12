import React, { useEffect, useState } from 'react'

const ViewArtistPage = () => {
    const [artists, setArtists] = useState([])
    const [selectedArtist, setSelectedArtist] = useState(null)
    const [toasts, setToasts] = useState([])
    const [modalOpenArtist, setModalOpenArtist] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredArtists, setFilteredArtists] = useState([])
    const [songs, setSongs] = useState([])

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

    useEffect(() => {
        fetch(`${API_URL}/songs`)
            .then(response => response.json())
            .then(data => setSongs(data))
            .catch(() => alert("Erro ao buscar Músicas."))
    }, [])

    useEffect(() => {
        fetch(`${API_URL}/artists`)
            .then(response => response.json())
            .then(data => {
                setArtists(data)
                setFilteredArtists(data) // Importante: define o estado inicial da busca
            })
            .catch(() => alert("Erro ao buscar Artistas."))
    }, [])

    // Função auxiliar para calcular a média de tempo (Base 60)
    const getAverageDuration = (artistId) => {
        const songsByArtist = songs.filter(song =>
            Array.isArray(song.artistsNames) &&
            song.artistsNames.some(a => a.id === artistId)
        )

        if (songsByArtist.length === 0) return "0:00"

        // Converte tudo para segundos totais
        const totalSeconds = songsByArtist.reduce((sum, song) => {
            if (!song.duration || !song.duration.includes(':')) return sum
            const [min, sec] = song.duration.split(':').map(Number)
            return sum + (min * 60) + (sec || 0)
        }, 0)

        // Calcula a média de segundos
        const avgSeconds = Math.round(totalSeconds / songsByArtist.length)

        // Formata de volta para MM:SS
        const finalMinutes = Math.floor(avgSeconds / 60)
        const finalSeconds = String(avgSeconds % 60).padStart(2, '0')

        return `${finalMinutes}:${finalSeconds}`
    }

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }

    const modalMoreOptionsArtists = (artist, e) => {
        e.stopPropagation()
        setSelectedArtist(artist)
        setModalOpenArtist(true)
    }

    const closeModalArtist = () => {
        setModalOpenArtist(false)
        setSelectedArtist(null)
    }

    function search(value) {
        setSearchTerm(value)
        if (!value.trim()) {
            setFilteredArtists(artists)
            return
        }
        const filtered = artists.filter(artist =>
            artist.name.toLowerCase().includes(value.toLowerCase())
        )
        setFilteredArtists(filtered)
    }

    return (
        <div>
            <div className="inputDeleteAlbumSearch">
                <input
                    value={searchTerm}
                    onChange={(e) => search(e.target.value)}
                    placeholder='Digite o Nome do Artista'
                    type="text"
                />
            </div>

            <div className="centerContent">
                <div className="deleteAlbumContainer">
                    {filteredArtists.length === 0 && searchTerm === "" && (
                        <h1>Sem Artistas</h1>
                    )}

                    {filteredArtists.length === 0 && searchTerm !== "" && (
                        <h1>Sem Artistas Com Esse Nome</h1>
                    )}

                    {filteredArtists.map((artist) =>
                        <div key={artist.id} className="albumDeleteBox">
                            <div className="albumDeleteInformations" onClick={(e) => modalMoreOptionsArtists(artist, e)}>
                                <div className="albumDeleteImage">
                                    <img src={artist.profilePhoto} alt={artist.name} />
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
            {modalOpenArtist && selectedArtist && (
                <div className="modal-overlay" onClick={closeModalArtist}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <button className="close-btn" onClick={closeModalArtist}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="song-info">
                                <img src={selectedArtist.profilePhoto} alt={selectedArtist.name} />
                                <div>
                                    <h4>{selectedArtist.name}</h4>
                                    <p>Artista</p>
                                </div>
                            </div>
                            <div className="statsArtists">
                                <h4>
                                    Total de Músicas: {
                                        songs.filter(song =>
                                            song.artistsNames && song.artistsNames.some(a => a.id === selectedArtist.id)
                                        ).length
                                    }
                                </h4>
                                <h4>Descrição: {selectedArtist.description || "Nenhuma descrição informada."} </h4>
                                <h4>
                                    Duração Média das Musicas: {getAverageDuration(selectedArtist.id) + 's'}
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

export default ViewArtistPage