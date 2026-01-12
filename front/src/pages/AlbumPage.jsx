import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MusicaModal from '../components/Modal/MusicaModal';
import Toast from '../components/Modal/Toast';
import { usePlayer } from '../components/PlayerContext';

const AlbumPage = () => {
    const { id } = useParams();
    const { setPlaylist, setCurrentIndex } = usePlayer();

    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpenPlaylistAdd, setModalOpenPlaylistAdd] = useState(false);
    const [playlistData, setPlaylistData] = useState(null);
    const [allSongs, setAllSongs] = useState([]);
    const [toasts, setToasts] = useState([]);
    const [selectedSong, setSelectedSong] = useState(null);
    const [favoritesListSongs, setFavoritesListSongs] = useState([]);
    const [favoritesListAlbums, setFavoritesListAlbums] = useState([]); // Esta lista armazenará os objetos de álbuns
    const [userID, setUserID] = useState(null);

    const API_URL = "http://localhost:8080/api";

    const fetchData = async () => {
        try {
            const [albumRes, songsRes] = await Promise.all([
                fetch(`${API_URL}/albums/${id}`),
                fetch(`${API_URL}/songs`)
            ]);
            const albumData = await albumRes.json();
            const songsData = await songsRes.json();
            setPlaylistData(albumData);
            setAllSongs(songsData);
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

    const playlistSongs = allSongs.filter(song =>
        playlistData?.musicsNames?.some(m => m.id === song.id)
    );

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

    const playPlaylistSong = (index) => {
        if (playlistSongs.length > 0) {
            setPlaylist(playlistSongs);
            setCurrentIndex(index);
        }
    };


    const isPlaylistFavorited = favoritesListAlbums.some(p => String(p.id) === String(playlistData?.id));

    const handleAlbumFavoriteToggle = async () => {
        if (!playlistData?.id || !userID) return;

        const isFavorited = isPlaylistFavorited;
        const method = isFavorited ? 'DELETE' : 'POST';

        try {
            const res = await fetch(`${API_URL}/users/${userID}/favorites/album/${playlistData.id}`, { method });

            if (res.ok) {
                let updatedFavorites;
                if (isFavorited) {
                    updatedFavorites = favoritesListAlbums.filter(p => String(p.id) !== String(playlistData.id));
                    showToast("Álbum removido dos favoritos!");
                } else {
                    updatedFavorites = [...favoritesListAlbums, playlistData];
                    showToast("Álbum adicionado aos favoritos!");
                }

                setFavoritesListAlbums(updatedFavorites);

                const storedUser = JSON.parse(localStorage.getItem('user'));
                if (storedUser) {
                    storedUser.listAlbums = updatedFavorites;
                    localStorage.setItem('user', JSON.stringify(storedUser));
                }
            } else {
                showToast("Erro ao atualizar favoritos", "error");
            }
        } catch (err) {
            showToast("Erro de conexão", "error");
        }
    };

    const addMusicToPlaylist = async (playlistId) => {
        if (!selectedSong) return;
        try {
            const res = await fetch(`${API_URL}/playlists/${playlistId}/music/${selectedSong.id}`, { method: 'POST' });
            if (res.ok) {
                showToast("Música adicionada à playlist!");
                closeModal();
            }
        } catch (err) { showToast("Erro de conexão", "error"); }
    };

    const modalMoreOptions = (song, e) => {
        e.stopPropagation();
        setSelectedSong(song);
        setModalOpen(true);
    };

    if (!playlistData) return <div className="loading-screen"><h1>Carregando Álbum...</h1></div>;

    return (
        <>
            <div className="playlist-page-wrapper">
                <div className="playlist-header-section">
                    <img src={playlistData.cover} alt={playlistData.name} className="playlist-cover-image" />
                    <div className="playlist-header-info">
                        <span className="playlist-label-type">Álbum</span>
                        <h1 className="playlist-main-title">{playlistData.name}</h1>
                        <div className="playlist-meta-info">
                            {playlistData.artistsNames?.map((artist) => (
                                <img
                                    key={artist.id}
                                    src={artist.profilePhoto || 'https://via.placeholder.com/50'}
                                    alt={artist.name}
                                    className="playlist-artist-avatar"
                                    style={{ marginRight: '-10px', border: '2px solid #121212' }} // Estilo sobreposto opcional
                                />
                            ))}
                            <span className="playlist-artist-name" style={{ marginLeft: playlistData.artistsNames?.length > 1 ? '15px' : '0' }}>
                                {playlistData.artistsNames?.map((a, index) => (
                                    <React.Fragment key={a.id}>
                                        <a href={`/artists/${a.id}`}>{a.name}</a>
                                        {index < playlistData.artistsNames.length - 1 && ' • '}
                                    </React.Fragment>
                                ))}
                            </span>
                            <span> • {playlistData.year} • {playlistSongs.length} músicas</span>
                        </div>
                    </div>
                </div>

                <div className="playlist-action-bar">
                    <button className="playlist-play-button" onClick={() => playPlaylistSong(0)} disabled={playlistSongs.length === 0}>
                        <i className="fa-solid fa-play"></i>
                    </button>

                    <button className="playlist-action-btn" onClick={handleAlbumFavoriteToggle}>
                        <i className={isPlaylistFavorited ? "fa-solid fa-heart" : "fa-regular fa-heart"}
                            style={{ color: isPlaylistFavorited ? "#1db954" : "" }}></i>
                    </button>
                </div>

                <div className="playlist-songs-list">
                    <div className="playlist-table-header">
                        <div className="table-col-number">#</div>
                        <div className="table-col-title">Título</div>
                        <div className="table-col-album">Álbum</div>
                        <div className="table-col-duration">Duração</div>
                    </div>

                    {playlistSongs.map((song, index) => (
                        <div key={song.id} className="playlist-song-row" onClick={() => playPlaylistSong(index)}>
                            <div className={song.status !== "NOT_RELEASED" ? "playlist-song-item" : "playlist-song-item-not-released"}>
                                <span className="song-index-number">{index + 1}</span>
                                <div className="song-title-section">
                                    <img src={song.cover} alt={song.name} className="song-cover-thumb" />
                                    <div className="song-text-info">
                                        <p className="song-title-text">{song.name}</p>
                                        <p className="song-artist-text">{song.artistsNames?.map(a => a.name).join(', ')}</p>
                                    </div>
                                </div>
                                <div className="song-album-name">{playlistData.name}</div>
                                <div className="song-duration-section">
                                    <p className="song-time-text">{song.ststaus != "NOT_RELEASED" ? song.duration : ""}</p>
                                    <button className="song-options-btn" onClick={(e) => modalMoreOptions(song, e)}>⋮</button>
                                </div>
                            </div>
                        </div>
                    ))}
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

export default AlbumPage;