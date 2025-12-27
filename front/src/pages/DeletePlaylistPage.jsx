import React, { useEffect, useState } from 'react'

const DeletePlaylistPage = () => {

    const [playlists, setPlaylists] = useState([])
    const [selectedPlaylist, setSelectedPlaylist] = useState(null)

    const API_URL = "http://localhost:8080/api"

    useEffect(() => {
        fetch(`${API_URL}/playlists`)
            .then(res => {
                if (!res.ok) throw new Error("Erro ao buscar playlists")
                return res.json()
            })
            .then(data => {
                setPlaylists(Array.isArray(data) ? data : [])
            })
            .catch(err => {
                console.error(err)
                setPlaylists([])
            })
    }, [])

    const deletePlaylist = async () => {
        if (!selectedPlaylist) return

        try {
            const response = await fetch(
                `${API_URL}/playlists/${selectedPlaylist.id}`,
                { method: 'DELETE' }
            )

            if (response.ok) {
                showToast("Playlist removida!", "success")

                // remove a playlist da lista após deletar
                setPlaylists(playlists.filter(p => p.id !== selectedPlaylist.id))
                setSelectedPlaylist(null)
            } else {
                showToast("Erro ao remover playlist", "error")
            }
        } catch (error) {
            console.error(error)
            showToast("Erro ao remover playlist", "error")
        }
    }

    return (
        <div>
            <h1>Deletar Playlist</h1>

            {playlists.map((playlist) =>
                <div className="deletePlaylistContainer">
                    <div className="playlistDeleteBox">
                        <div className="playlistDeleteInformations">


                            <div className="playlistDeleteImage">
                                <img src="" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DeletePlaylistPage
