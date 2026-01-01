import React from 'react'

const SlideHome = () => {
    return (
        <div>
            <div className="slideTopPlaylistsHomeContainer">
                <div className="slideTopPlaylistsHomeBox">
                    <div className="slideTopPlaylistsHomeImagePlaylist">
                        <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1767248696/461d0e2f20b7b7faa9b5929d2d5e0f0d.640x640x1_z05ept.jpg" alt="" />
                    </div>
                    <div className="slideTopPlaylistsHomeInformations">
                        <div className="slideTopPlaylistsHomeInformationsPlaylist">
                            <strong><span>Playlist</span></strong>
                            <h1>TOP HITS · Os Sucessos Mais Ouvidos Top Charts · Today's Best Songs</h1>
                            <p>Ressaca de ano novo? Vem curar ouvindo o melhor do pop internacional.</p>
                        </div>
                        <div className="slideTopPlaylistsHomeButton">
                            <button className='play-button'>Play</button>
                            <button className='follow_button'>Seguir</button>
                            <button className='more_button'><i className="fa-solid fa-ellipsis"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SlideHome
