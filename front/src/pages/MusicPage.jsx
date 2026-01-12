import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MusicaModal from '../components/Modal/MusicaModal';
import Toast from '../components/Modal/Toast';
import { usePlayer } from '../components/PlayerContext';

const MusicPage = () => {
    const { id } = useParams();
    const { setPlaylist, setCurrentIndex } = usePlayer();

    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpenPlaylistAdd, setModalOpenPlaylistAdd] = useState(false);
    const [songData, setSongData] = useState(null);
    const [toasts, setToasts] = useState([]);
    const [selectedSong, setSelectedSong] = useState(null);
    const [favoritesListSongs, setFavoritesListSongs] = useState([]);
    const [favoritesListAlbums, setFavoritesListAlbums] = useState([]);
    const [userID, setUserID] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false)


    const API_URL = "http://localhost:8080/api";

    const formatDuration = (duration) => {
        if (!duration) return "0s";
        const timeStr = String(duration).replace(':', '.');
        const [minutes, seconds] = timeStr.split('.');
        return `${minutes}min ${seconds || '00'}s`;
    };

    const fetchData = async () => {
        try {
            const res = await fetch(`${API_URL}/songs/${id}`);
            const data = await res.json();
            setSongData(data);
        } catch (err) {
            console.error("Erro ao buscar dados", err);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUserID(parsedUser.id);
                setFavoritesListSongs(parsedUser.listMusic || []);
                setFavoritesListAlbums(parsedUser.listAlbums || []);
                setIsAuthenticated(true);
            } catch (err) {
                console.error("Erro ao processar usuário", err);
            }
        }
        fetchData();
    }, [id]);

    {
        !isAuthenticated && (
            navigate('/login')
        )
    }

    const showToast = (message, type = 'success') => {
        const toastId = Date.now();
        setToasts(prev => [...prev, { id: toastId, message, type }]);
        setTimeout(() => removeToast(toastId), 5000);
    };

    const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

    const closeModal = () => {
        setModalOpen(false);
        setSelectedSong(null);
        setModalOpenPlaylistAdd(false);
    };

    const handlePlayMusic = (song) => {
        if (song.status === "NOT_RELEASED") return;
        setPlaylist([song]);
        setCurrentIndex(0);
    };

    const modalMoreOptions = (song, e) => {
        e.stopPropagation();
        setSelectedSong(song);
        setModalOpen(true);
    };

    if (!songData) return <div className="loading-screen"><h1>Carregando Musica...</h1></div>;

    return (
        <>
            <div className="playlist-page-wrapper">
                <div className="playlist-header-section">
                    <img src={songData.cover} alt={songData.name} className="playlist-cover-image" />
                    <div className="playlist-header-info">
                        <span className="playlist-label-type">Single</span>
                        <h1 className="playlist-main-title">{songData.name}</h1>
                        <div className="playlist-meta-info">
                            <div className="playlist-artists-photos" style={{ display: 'flex', alignItems: 'center' }}>
                                {songData.artistsNames?.map((artist) => (
                                    <img
                                        key={artist.id}
                                        src={artist.profilePhoto || 'https://via.placeholder.com/50'}
                                        alt={artist.name}
                                        className="playlist-artist-avatar"
                                        style={{ marginRight: '-10px', border: '2px solid #121212' }} // Estilo sobreposto opcional
                                    />
                                ))}
                            </div>

                            <span className="playlist-artist-name" style={{ marginLeft: songData.artistsNames?.length > 1 ? '15px' : '0' }}>
                                {songData.artistsNames?.map((a, index) => (
                                    <React.Fragment key={a.id}>
                                        <a href={`/artists/${a.id}`}>{a.name}</a>
                                        {index < songData.artistsNames.length - 1 && ' • '}
                                    </React.Fragment>
                                ))}
                            </span>
                            <span> • {songData.year} • 1 música, {formatDuration(songData.duration)}</span>
                        </div>
                    </div>
                </div>

                <div className="playlist-action-bar">
                    <button
                        className="playlist-play-button"
                        onClick={() => handlePlayMusic(songData)}
                        disabled={songData.status === "NOT_RELEASED"}
                    >
                        <i className="fa-solid fa-play"></i>
                    </button>
                </div>

                <div className="playlist-songs-list">
                    <div className="playlist-table-header">
                        <div className="table-col-number">#</div>
                        <div className="table-col-title">Título</div>
                        <div className="table-col-album">Álbum</div>
                        <div className="table-col-duration">Duração</div>
                    </div>

                    <div
                        className={`playlist-song-row ${songData.status === "NOT_RELEASED" ? "disabled" : ""}`}
                        onClick={() => handlePlayMusic(songData)}
                    >
                        <div className={songData.status !== "NOT_RELEASED" ? "playlist-song-item" : "playlist-song-item-not-released"}>
                            <span className="song-index-number">1</span>
                            <div className="song-title-section">
                                <img src={songData.cover} alt={songData.name} className="song-cover-thumb" />
                                <div className="song-text-info">
                                    <p className="song-title-text">{songData.name}</p>
                                    <p className="song-artist-text">{songData.artistsNames?.map(a => a.name).join(', ')}</p>
                                </div>
                            </div>
                            <div className="song-album-name">{songData.name}</div>
                            <div className="song-duration-section">
                                <p className="song-time-text">
                                    {songData.status !== "NOT_RELEASED" ? formatDuration(songData.duration) : "Bloqueado"}
                                </p>
                                <button className="song-options-btn" onClick={(e) => modalMoreOptions(songData, e)}>⋮</button>
                            </div>
                        </div>
                    </div>
                    <div className="space"></div>
                </div>
            </div>

            <MusicaModal
                isOpen={modalOpen}
                onClose={closeModal}
                isOpenPlaylistAdd={modalOpenPlaylistAdd}
                onOpenPlaylistAdd={() => setModalOpenPlaylistAdd(true)}
                onCloseOpenPlaylistAdd={() => setModalOpenPlaylistAdd(false)}
                song={selectedSong}
                favoritesListSongs={favoritesListSongs}
                API_URL={API_URL}
            />

            <Toast toasts={toasts} removeToast={removeToast} />
        </>
    );
};

export default MusicPage;