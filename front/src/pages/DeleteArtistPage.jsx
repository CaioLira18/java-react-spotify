import React, { useEffect, useState } from 'react'
import Toast from '../components/Modal/Toast'

const DeleteArtistPage = () => {

    const [artists, setArtists] = useState([])
    const [selectedArtist, setSelectedArtist] = useState(null)
    const [toasts, setToasts] = useState([])
    const [modalOpenArtist, setModalOpenArtist] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredArtists, setFilteredArtists] = useState([])
    const API_URL = "http://localhost:8080/api"

    const showToast = (message, type = 'success') => {
        const toastId = Date.now()
        setToasts(prev => [...prev, { id: toastId, message, type }])
        setTimeout(() => removeToast(toastId), 5000)
    }

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }

    const modalMoreOptionsArtists = (album, e) => {
        e.stopPropagation()
        setSelectedArtist(album)
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


    useEffect(() => {
        fetch(`${API_URL}/artists`)
            .then(res => {
                if (!res.ok) throw new Error("Erro ao buscar artist")
                return res.json()
            })
            .then(data => {
                const artistData = Array.isArray(data) ? data : [];
                setArtists(artistData);
                setFilteredArtists(artistData); // Add this line so the list shows on load
            })
            .catch(err => {
                console.error(err);
                setArtists([]);
                setFilteredArtists([]); // Ensure this is also reset on error
            })
    }, [])

    const deleteArtist = async () => {
        if (!selectedArtist) return

        try {
            const response = await fetch(
                `${API_URL}/artists/${selectedArtist.id}`,
                { method: 'DELETE' }
            )

            if (response.ok) {
                showToast("Artista removido!", "success")

                setArtists(artists.filter(artist => artist.id !== selectedArtist.id))
                setSelectedArtist(null)
                closeModalArtist()
            } else {
                showToast("Erro ao remover Artista", "error")
            }
        } catch (error) {
            console.error(error)
            showToast("Erro ao remover Artista", "error")
        }
    }

    {
        artists.length === 0 && (
            <h1>Sem Artistas</h1>
        )

        filteredArtists.length === 0 && (
            <h1>Sem Artistas Com Esse Nome</h1>
        )
    }

    return (
        <div>
            <div className="inputDeleteAlbumSearch">
                <input value={searchTerm} onChange={(e) => search(e.target.value)} placeholder='Digite o Nome do Artista' type="text" />
            </div>

            <div className="centerContent">
                <div className="deleteAlbumContainer">
                    {filteredArtists.map((artist) =>
                        artist.status != "OFF" && (
                        <div className="albumDeleteBox">
                            <div className="albumDeleteInformations" onClick={(e) => modalMoreOptionsArtists(artist, e)}>
                                <div className="albumDeleteImage">
                                    <img src={artist.profilePhoto} alt="" />
                                </div>
                                <div className="albumDeleteNames">
                                    <h4>{artist.name}</h4>
                                </div>
                            </div>
                        </div>
                        )
                    )}
                </div>
            </div>


            {/* Modal Artist */}
            {modalOpenArtist && (
                <div className="modal-overlay" onClick={closeModalArtist}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Opções</h3>
                            <button className="close-btn" onClick={closeModalArtist}><i className="fa-solid fa-xmark"></i></button>
                        </div>
                        <div className="modal-body">
                            {selectedArtist && (
                                <div>
                                    <div className="song-info">
                                        <img src={selectedArtist.profilePhoto} alt={selectedArtist.name} />
                                        <div>
                                            <h4>{selectedArtist.name}</h4>
                                        </div>
                                    </div>
                                    <div className="optionDeleteAlbum">
                                        <button onClick={deleteArtist}>Deletar Artista</button>
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

export default DeleteArtistPage
