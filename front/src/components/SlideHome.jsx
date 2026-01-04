import React, { useEffect, useState } from 'react'

const SlideHome = () => {
    const API_URL = "http://localhost:8080/api";
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/playlists`)
            .then(response => response.json())
            .then(data => {
                setPlaylists(data)
            })
    }, [])

    return (
        <div>
            {playlists.map((playlist) => (
                playlist.type === "SPOTIFY_PLAYLIST" && (
                    <div className="slideTopPlaylistsHomeContainer">
                        <div className="slideTopPlaylistsHomeBox">
                            <div className="slideTopPlaylistsHomeImagePlaylist">
                                <img src={playlist.cover} alt="" />
                            </div>
                            <div className="slideTopPlaylistsHomeInformations">
                                <div className="slideTopPlaylistsHomeInformationsPlaylist">
                                    <strong><span>Playlist</span></strong>
                                    <h1>{playlist.name}</h1>
                                    <p>{playlist.description}</p>
                                </div>
                                <div className="slideTopPlaylistsHomeButton">
                                    <a href={`/playlists/${playlist.id}`}><button className='play-button'>Play</button></a>
                                    <button className='follow_button'>Seguir</button>
                                    <button className='more_button'><i className="fa-solid fa-ellipsis"></i></button>
                                </div>
                                <div className="slideBars">
                                    <i class="fa-regular fa-circle"></i>
                                    <i class="fa-solid fa-circle"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            ))}
        </div>
    )
}

export default SlideHome
