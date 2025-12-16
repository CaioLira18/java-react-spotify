import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import MusicPlayer from '../components/MusicPlayer';

const ArtistPage = () => {
    const { id } = useParams();
    const [artista, setArtista] = useState(null);
    const [songs, setSongs] = useState([]);
    const [toasts, setToasts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(null);

    const API_URL = "http://localhost:8080/api";

    useEffect(() => {
        fetch(`${API_URL}/songs`)
            .then(res => res.json())
            .then(data => setSongs(data))
            .catch(console.error);
    }, []);

    useEffect(() => {
        fetch(`${API_URL}/artists/${id}`)
            .then(res => res.json())
            .then(data => setArtista(data))
            .catch(() => showToast("Erro ao carregar artista!", "error"));
    }, [id]);

    const showToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 5000);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    if (!artista) {
        return <h1>Carregando Artista...</h1>;
    }

    // ✅ Agora é seguro
    const artistSongs = songs.filter(
        song => song.artistName === artista.name
    );

    return (
        <>
            <div className="artist-individual-container">
                <div className="artist-header">
                    <img src={artista.bannerPhoto} alt="" />
                </div>

                <div className="artistInformation">
                    <div className="verificy">
                        <i className="fa-solid fa-certificate"></i>
                        <p>Artista Verificado</p>
                    </div>
                    <h1>{artista.name}</h1>
                    <h2>9 Milhões de Ouvintes Mensais</h2>
                </div>
            </div>

            <div className="songsContainer">
                <h1>Músicas Populares</h1>

                {artistSongs.map((song, index) => (
                    <div className="musicsArtistPage" key={song.id}>
                        <div className="songContainer" onClick={() => setCurrentIndex(index)}>
                            <h1>{index + 1}</h1>
                            <img src={song.cover} alt={song.name} />
                            <div className="songInformation">
                                <h1>{song.name}</h1>
                                <p>{song.artistName}</p>
                            </div>
                            <div className="otherInformation">
                                <p>{song.duration}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 🎧 PLAYER SEMPRE NO FINAL */}
            <MusicPlayer
                playlist={artistSongs}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
            />
        </>
    );
};

export default ArtistPage;
