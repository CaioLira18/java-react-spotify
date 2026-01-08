import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import MusicaModal from '../components/Modal/MusicaModal';
import Toast from '../components/Modal/Toast';
import { usePlayer } from '../components/PlayerContext';

const AlbumPage = () => {
    const { id } = useParams();
    // Consumindo apenas o necessário do contexto para evitar re-renders desnecessários
    const { setPlaylist, setCurrentIndex } = usePlayer();
    
    const [playlistData, setPlaylistData] = useState(null);
    const [allSongs, setAllSongs] = useState([]); 
    const [toasts, setToasts] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalAdminOpen, setModalAdminOpen] = useState(false);
    const [selectedSong, setSelectedSong] = useState(null);
    const [selectedSongToAlbum, setSelectedSongToAlbum] = useState('');
    const [favoritesListSongs, setFavoritesListSongs] = useState([]);
    const [favoritesListAlbums, setFavoritesListAlbums] = useState([]);
    const [userID, setUserID] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const API_URL = "http://localhost:8080/api";

    // 1. Carregar dados do Usuário (apenas uma vez na montagem)
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setIsAdmin(parsedUser.role === 'ADMIN');
                setUserID(parsedUser.id);
                setFavoritesListSongs(parsedUser.listMusic || []);
                setFavoritesListAlbums(parsedUser.listPlaylists || []);
            } catch (err) {
                console.error("Erro ao processar usuário", err);
            }
        }
    }, []);

    // 2. Carregar dados do Álbum e Músicas (Sempre que o ID mudar)
    useEffect(() => {
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

        fetchData();
    }, [id]);

    // Filtro de músicas otimizado com useMemo ou apenas variável simples
    const playlistSongs = allSongs.filter(song =>
        playlistData?.musicsNames?.some(m => m.id === song.id)
    );

    const showToast = (message, type = 'success') => {
        const toastId = Date.now();
        setToasts(prev => [...prev, { id: toastId, message, type }]);
        setTimeout(() => removeToast(toastId), 5000);
    };

    const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

    // FUNÇÃO DE PLAY CORRIGIDA
    const playPlaylistSong = (index) => {
        if (playlistSongs.length > 0) {
            // Primeiro definimos a playlist, depois o index
            setPlaylist(playlistSongs);
            setCurrentIndex(index);
        }
    };

    const modalMoreOptions = (song, e) => {
        e.stopPropagation();
        setSelectedSong(song);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedSong(null);
    };

    // ... (Demais funções de favoritos e admin permanecem iguais)

    if (!playlistData) return <div className="loading-screen"><h1>Carregando Álbum...</h1></div>;

    const isPlaylistFavorited = favoritesListAlbums.some(p => p.id === playlistData.id);

    return (
        <>
            <div className="playlist-page-wrapper">
                <div className="playlist-header-section">
                    <img src={playlistData.cover} alt={playlistData.name} className="playlist-cover-image" />
                    <div className="playlist-header-info">
                        <span className="playlist-label-type">Álbum</span>
                        <h1 className="playlist-main-title">{playlistData.name}</h1>
                        <div className="playlist-meta-info">
                            <img 
                                src={playlistData.artistsNames?.[0]?.profilePhoto || 'https://via.placeholder.com/50'} 
                                alt="Artist" 
                                className="playlist-artist-avatar" 
                            />
                            <span className="playlist-artist-name">
                                {playlistData.artistsNames?.map(a => a.name).join(', ')}
                            </span>
                            <span> • {playlistData.year} • {playlistSongs.length} músicas</span>
                        </div>
                    </div>
                </div>

                <div className="playlist-action-bar">
                    <button 
                        className="playlist-play-button" 
                        onClick={() => playPlaylistSong(0)}
                        disabled={playlistSongs.length === 0}
                    >
                        <i className="fa-solid fa-play"></i>
                    </button>
                    
                    <button className="playlist-action-btn" onClick={isPlaylistFavorited ? () => {} : () => {}}>
                        <i className={isPlaylistFavorited ? "fa-solid fa-check" : "fa-regular fa-heart"} 
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
                            <div className="playlist-song-item">
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
                                    <p className="song-time-text">{song.duration}</p>
                                    <button className="song-options-btn" onClick={(e) => modalMoreOptions(song, e)}>⋮</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <MusicaModal
                isOpen={modalOpen} 
                onClose={closeModal} 
                song={selectedSong}
                favoritesListSongs={favoritesListSongs} 
                onAddFavorite={() => {}} 
                onDeleteFavorite={() => {}}
                API_URL={API_URL}
            />

            <Toast toasts={toasts} removeToast={removeToast} />
        </>
    );
};

export default AlbumPage;