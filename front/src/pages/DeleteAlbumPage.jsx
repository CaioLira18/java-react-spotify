import React, { useEffect, useState } from 'react'

const DeleteAlbumPage = () => {

    const [albums, setAlbums] = useState([])
    const [selectedAlbum, setSelectedAlbum] = useState(null)
    const [toasts, setToasts] = useState([])
    const [modalOpenAlbum, setModalOpenAlbum] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredAlbums, setFilteredAlbums] = useState([])
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
        setSelectedAlbum(album)
        setModalOpenAlbum(true)
    }

    const closeModalAlbum = () => {
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
            album.name.toLowerCase().includes(value.toLowerCase()) ||
            (album.artistsNames && album.artistsNames.some(artist =>
                artist.name.toLowerCase().includes(value.toLowerCase())
            ))
        )
        setFilteredAlbums(filtered)
    }


    useEffect(() => {
        fetch(`${API_URL}/albums`)
            .then(res => {
                if (!res.ok) throw new Error("Erro ao buscar albums")
                return res.json()
            })
            .then(data => {
                const albumsData = Array.isArray(data) ? data : [];
                setAlbums(albumsData);
                setFilteredAlbums(albumsData); // Add this line so the list shows on load
            })
            .catch(err => {
                console.error(err);
                setAlbums([]);
                setFilteredAlbums([]); // Ensure this is also reset on error
            })
    }, [])

    const deleteAlbum = async () => {
        if (!selectedAlbum) return

        try {
            const response = await fetch(
                `${API_URL}/albums/${selectedAlbum.id}`,
                { method: 'DELETE' }
            )

            if (response.ok) {
                showToast("Album removido!", "success")

                setAlbums(albums.filter(album => album.id !== selectedAlbum.id))
                setSelectedAlbum(null)
            } else {
                showToast("Erro ao remover Album", "error")
            }
        } catch (error) {
            console.error(error)
            showToast("Erro ao remover Album", "error")
        }
    }

    {
        albums.length === 0 && (
            <h1>Sem albums</h1>
        )
    }

    return (
        <div>
            <div className="inputDeleteAlbumSearch">
                <input value={searchTerm} onChange={(e) => search(e.target.value)} placeholder='Digite o Nome do Álbum' type="text" />
            </div>

            {filteredAlbums.map((album) =>
                <div className="deleteAlbumContainer">
                    <div className="albumDeleteBox">
                        <div className="albumDeleteInformations" onClick={(e) => modalMoreOptionsAlbum(album, e)}>
                            <div className="albumDeleteImage">
                                <img src={album.cover} alt="" />
                            </div>
                            <div className="albumDeleteNames">
                                <h4>{album.name} - {album.artistsNames.map(artist => artist.name)}</h4>
                                <h5>Álbum • {album.year}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Album */}
            {modalOpenAlbum && (
                <div className="modal-overlay" onClick={closeModalAlbum}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Opções</h3>
                            <button className="close-btn" onClick={closeModalAlbum}><i className="fa-solid fa-xmark"></i></button>
                        </div>
                        <div className="modal-body">
                            {selectedAlbum && (
                                <div>

                                    <div className="song-info">
                                        <img src={selectedAlbum.cover} alt={selectedAlbum.name} />
                                        <div>
                                            <h4>{selectedAlbum.name}</h4>
                                            <p>{selectedAlbum.artistsNames.map(a => a.name).join(', ')}</p>
                                        </div>
                                    </div>
                                    <div className="optionDeleteAlbum">
                                        <button onClick={deleteAlbum}>Deletar Album</button>
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

export default DeleteAlbumPage
