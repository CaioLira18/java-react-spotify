import React, { useEffect, useState } from 'react'

const DeleteAlbumPage = () => {

    const [albums, setAlbums] = useState([])
    const [selectedAlbum, setSelectedAlbum] = useState(null)
    const [toasts, setToasts] = useState([])
    const API_URL = "http://localhost:8080/api"

    const showToast = (message, type = 'success') => {
        const toastId = Date.now()
        setToasts(prev => [...prev, { id: toastId, message, type }])
        setTimeout(() => removeToast(toastId), 5000)
    }

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }

    useEffect(() => {
        fetch(`${API_URL}/albums`)
            .then(res => {
                if (!res.ok) throw new Error("Erro ao buscar albums")
                return res.json()
            })
            .then(data => {
                setAlbums(Array.isArray(data) ? data : [])
            })
            .catch(err => {
                console.error(err)
                setAlbums([])
            })
    }, [])

    const deleteAlbum = async () => {
        if (!selectedPlaylist) return

        try {
            const response = await fetch(
                `${API_URL}/albums/${selectedPlaylist.id}`,
                { method: 'DELETE' }
            )

            if (response.ok) {
                showToast("Album removido!", "success")

                // remove a playlist da lista após deletar
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

    return (
        <div>
            <h1>Deletar Album</h1>

            {albums.map((album) =>
                <div className="deleteAlbumContainer">
                    <div className="albumDeleteBox">
                        <div className="albumDeleteInformations">
                            <div className="albumDeleteImage">
                                <img src={album.cover} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DeleteAlbumPage
