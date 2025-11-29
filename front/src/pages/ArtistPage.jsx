import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

const ArtistPage = () => {
    const { id } = useParams();
    const [artista, setArtista] = useState(null);
    const [songs, setSongs] = useState([]);
    const [toasts, setToasts] = useState([]);
    const API_URL = "http://localhost:8080/api";
    const cont = 0;

    useEffect(() => {
        fetch(`${API_URL}/songs`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao buscar Artistas.");
                }
                return response.json();
            })
            .then((data) => setSongs(data))
            .catch((error) => {
                console.error(error);
                alert("Erro ao buscar Artistas.");
            });
    }, []);

    const showToast = (message, type = 'success') => {
        const toastId = Date.now();
        const newToast = { id: toastId, message, type };

        setToasts(prev => [...prev, newToast]);

        setTimeout(() => {
            removeToast(toastId);
        }, 5000);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const getToastIcon = (type) => {
        if (type === 'success') {
            return (
                <svg className="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            );
        }
        if (type === 'error') {
            return (
                <svg className="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            );
        }
        if (type === 'warning') {
            return (
                <svg className="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            );
        }
        return null;
    };

    useEffect(() => {
        fetch(`${API_URL}/artists/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao buscar lutador.");
                }
                return response.json();
            })
            .then((data) => setArtista(data))
            .catch((error) => {
                console.error(error);
                showToast("Erro ao carregar lutador!", "error");
            });
    }, [id]);

    if (!artista) {
        return (
            <div className="adicionar-container">
                <h1>Carregando Artista...</h1>
            </div>
        );
    }

    return (
        <>
            {/* Toast Container */}
            <div className="toast-container">
                {toasts.map(toast => (
                    <div key={toast.id} className={`toast toast-${toast.type}`}>
                        {getToastIcon(toast.type)}
                        <p className="toast-message">{toast.message}</p>
                        <button
                            className="toast-close"
                            onClick={() => removeToast(toast.id)}
                            aria-label="Fechar"
                        >
                            <svg className="toast-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>

            <div className="artist-individual-container" data-artista={id}>
                <div className="artist-header">
                    <img src={artista.bannerPhoto} alt="" />
                </div>
                <div className="artistInformation">
                    <div className="verificy">
                        <i class="fa-solid fa-certificate"></i>
                        <p>Artista Verificado</p>
                    </div>
                    <h1>{artista.name}</h1>
                    <h2>9 Milhões de Ouvintes Mensais</h2>
                </div>
            </div>

            <div className="songsContainer">
                <h1>Músicas Populares</h1>
                {songs.map((song, index) => (
                    song.artistName === artista.name && (
                        <div className="musicsArtistPage" key={song.id}>
                            <div className="musicsArtistBox">
                                <div className="songContainer">
                                    <h1>{index + 1}</h1>
                                    <img src={song.cover} alt={song.name} />
                                    <div className="songInformation">
                                        <div className="informatitonSong">
                                            <h1>{song.name}</h1>
                                            <p>{song.artistName}</p>
                                        </div>
                                    </div>
                                    <div className="otherInformation">
                                        <p>{song.duration}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                ))}
            </div>
        </>
    );
};

export default ArtistPage;