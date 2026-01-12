import React, { useEffect, useState } from 'react'
import Toast from '../components/Modal/Toast'

const DeleteMusicPage = () => {

    const [songs, setSongs] = useState([])
    const [selectedSong, setSelectedSong] = useState(null)
    const [toasts, setToasts] = useState([])
    const [modalOpenSong, setModalOpenSong] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [filtredSongs, setFiltredSongs] = useState([])
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
        setSelectedSong(album)
        setModalOpenSong(true)
    }

    const closeModalSong = () => {
        setModalOpenSong(false)
        setSelectedSong(null)
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

    const deleteSong = async () => {
        if (!selectedSong) return

        try {
            const response = await fetch(
                `${API_URL}/songs/${selectedSong.id}`,
                { method: 'DELETE' }
            )

            if (response.ok) {
                showToast("Musica removida!", "success")

                setSongs(songs.filter(album => album.id !== selectedSong.id))
                setFiltredSongs(filtredSongs.filter(album => album.id !== selectedSong.id))
                setSelectedSong(null)
                closeModalSong()
            } else {
                showToast("Erro ao remover Musica", "error")
            }
        } catch (error) {
            console.error(error)
            showToast("Erro ao remover Musica", "error")
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
                        song.status != "NOT_RELEASED" && (
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
                        )
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
                                    <div className="optionDeleteAlbum">
                                        <button onClick={deleteSong}>Deletar Musica</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Notificações Toast */}
            <Toast toasts={toasts} removeToast={removeToast} />
        </div>
    )
}

export default DeleteMusicPage