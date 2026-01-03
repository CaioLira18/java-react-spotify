import React, { useEffect, useState } from 'react'

const ArtistsSelect = ({ artistsIds }) => {
    const [artists, setArtists] = useState([])
    const API_URL = "http://localhost:8080/api" // Certifique-se de definir aqui

    useEffect(() => {
        fetch(`${API_URL}/artists`)
          .then(response => response.json())
          .then(data => setArtists(data))
          .catch(() => console.error("Erro ao buscar Artistas."))
    }, [])

    return (
        <div className="inputBox">
            <div className="textLogo">
                <i className="fa-solid fa-pencil"></i>
                <h2>Artistas Selecionados</h2>
            </div>
            <div className="inputArea">
                <ul>
                    {artistsIds.length > 0 ? (
                        artistsIds.map(id => {
                            const artist = artists.find(a => a.id === id)
                            return <li key={id}>{artist ? artist.name : "Carregando..."}</li>
                        })
                    ) : (
                        <li>Nenhum artista selecionado</li>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default ArtistsSelect