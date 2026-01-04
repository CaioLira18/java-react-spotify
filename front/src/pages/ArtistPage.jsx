import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import Toast from '../components/Modal/Toast';
import MusicaModal from '../components/Modal/MusicaModal';
import ModalAlbum from '../components/Modal/ModalAlbum';

const ArtistPage = () => {
    const { id } = useParams();
    const { setPlaylist, setCurrentIndex } = useOutletContext();

    // Estados de Dados
    const [artistaLocal, setArtistaLocal] = useState(null);
    const [songs, setSongs] = useState([]);
    const [albums, setAlbums] = useState([]);

    // Spotify
    const [spotifyData, setSpotifyData] = useState(null);
    const [ouvintes, setOuvintes] = useState('---');

    // UI
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedSong, setSelectedSong] = useState(null);
    const [toasts, setToasts] = useState([]);

    const [modalOpenAlbum, setModalOpenAlbum] = useState(false);
    const [modalOpenPlaylistAdd, setModalOpenPlaylistAdd] = useState(false);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [favoritesListSongs, setFavoritesListSongs] = useState([]);
    const [favoritesListAlbums, setFavoritesListAlbums] = useState([]);
    const [userID, setUserID] = useState(null);

    const API_URL = 'http://localhost:8080/api';

    // 🔹 NOVO: Carregar dados do usuário logado
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.id) {
            setUserID(userData.id);
            if (userData.listMusic) setFavoritesListSongs(userData.listMusic);
            if (userData.listAlbums) setFavoritesListAlbums(userData.listAlbums);
        }
    }, []);

    // 🔹 1. Carregar Dados Locais
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [resA, resS, resAlb] = await Promise.all([
                    fetch(`${API_URL}/artists/${id}`),
                    fetch(`${API_URL}/songs`),
                    fetch(`${API_URL}/albums`)
                ]);

                const dataArtista = await resA.json();
                const dataSongs = await resS.json();
                const dataAlbums = await resAlb.json();

                setArtistaLocal(dataArtista);
                setSongs(dataSongs);
                setAlbums(dataAlbums);
            } catch (err) {
                console.error('Erro ao carregar dados locais:', err);
            }
        };

        if (id) fetchInitialData();
    }, [id]);

    // 🔹 2. Integrar com Spotify
    useEffect(() => {
        const fetchSpotifyInfo = async () => {
            if (!artistaLocal?.name) return;
            try {
                const res = await fetch(`${API_URL}/spotify/listeners-by-name/${encodeURIComponent(artistaLocal.name)}`);
                if (!res.ok) return;
                const json = await res.json();
                const artistInfo = json?.data?.artist;
                if (artistInfo) {
                    setSpotifyData(artistInfo);
                    if (artistInfo.stats?.monthlyListeners) {
                        setOuvintes(artistInfo.stats.monthlyListeners.toLocaleString('pt-BR'));
                    }
                }
            } catch (err) {
                console.error('Erro ao integrar com Spotify:', err);
            }
        };
        fetchSpotifyInfo();
    }, [artistaLocal]);

    const showToast = (message, type = 'success') => {
        const toastId = Date.now();
        setToasts(prev => [...prev, { id: toastId, message, type }]);
        setTimeout(() => removeToast(toastId), 5000);
    };
    
    const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

    const closeMusicModal = () => { setModalOpen(false); setSelectedSong(null); setModalOpenPlaylistAdd(false); };
    const openAlbumModal = (album, e) => { e.stopPropagation(); setSelectedAlbum(album); setModalOpenAlbum(true); };
    const closeAlbumModal = () => { setModalOpenAlbum(false); setSelectedAlbum(null); };

    const updateLocalStorage = (key, data) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) { 
            user[key] = data; 
            localStorage.setItem('user', JSON.stringify(user)); 
        }
    };

    const addMusicToFavorites = async () => {
        if (!selectedSong || !userID) {
            showToast("Erro: Usuário não identificado", "error");
            return;
        }
        try {
            const res = await fetch(`${API_URL}/users/${userID}/favorites/music/${selectedSong.id}`, { method: 'POST' });
            if (res.ok) {
                const updated = [...favoritesListSongs, selectedSong];
                setFavoritesListSongs(updated);
                updateLocalStorage('listMusic', updated);
                showToast("Música adicionada aos favoritos!");
                closeMusicModal();
            }
        } catch (err) { showToast("Erro ao adicionar", "error"); }
    };

    const deleteMusicToFavorites = async () => {
        if (!selectedSong || !userID) return;
        try {
            const res = await fetch(`${API_URL}/users/${userID}/favorites/music/${selectedSong.id}`, { method: 'DELETE' });
            if (res.ok) {
                const updated = favoritesListSongs.filter(s => s.id !== selectedSong.id);
                setFavoritesListSongs(updated);
                updateLocalStorage('listMusic', updated);
                showToast("Música removida dos favoritos!");
                closeMusicModal();
            }
        } catch (err) { showToast("Erro ao remover", "error"); }
    };

    const addMusicToPlaylist = async (playlistId) => {
        if (!selectedSong) return;
        try {
            const res = await fetch(`${API_URL}/playlists/${playlistId}/music/${selectedSong.id}`, { method: 'POST' });
            if (res.ok) {
                showToast("Música adicionada à playlist!");
                setModalOpenPlaylistAdd(false);
                closeMusicModal();
            } else {
                showToast("Erro ao adicionar na playlist", "error");
            }
        } catch (err) { showToast("Erro de conexão", "error"); }
    };

    const removeMusicFromPlaylist = async (playlistId, songId) => {
        if (!songId || !playlistId) return;
        try {
            const res = await fetch(`${API_URL}/playlists/${playlistId}/music/${songId}`, { method: 'DELETE' });
            if (res.ok) {
                showToast("Música excluída da playlist!");
                closeMusicModal();
            }
        } catch (err) { showToast("Erro de conexão", "error"); }
    };

    const addAlbumToFavorites = async () => {
        if (!selectedAlbum || !userID) return;
        try {
            const res = await fetch(`${API_URL}/users/${userID}/favorites/album/${selectedAlbum.id}`, { method: 'POST' });
            if (res.ok) {
                const updated = [...favoritesListAlbums, selectedAlbum];
                setFavoritesListAlbums(updated);
                updateLocalStorage('listAlbums', updated);
                showToast("Álbum adicionado!"); closeAlbumModal();
            }
        } catch (err) { showToast("Erro ao adicionar", "error"); }
    };

    const deleteAlbumToFavorites = async () => {
        if (!selectedAlbum || !userID) return;
        try {
            const res = await fetch(`${API_URL}/users/${userID}/favorites/album/${selectedAlbum.id}`, { method: 'DELETE' });
            if (res.ok) {
                const updated = favoritesListAlbums.filter(a => a.id !== selectedAlbum.id);
                setFavoritesListAlbums(updated);
                updateLocalStorage('listAlbums', updated);
                showToast("Álbum removido!"); closeAlbumModal();
            }
        } catch (err) { showToast("Erro ao remover", "error"); }
    };

    if (!artistaLocal) return <div className="loading">Carregando perfil...</div>;

    const artistSongs = songs.filter(s => s.artistsNames?.some(a => a.name === artistaLocal.name));
    const bannerUrl = spotifyData?.visuals?.headerImage?.sources?.[0]?.url || artistaLocal.bannerPhoto;
    const spotifyAlbums = spotifyData?.discography?.popularReleases?.items?.flatMap(item => item.releases?.items || []) || [];

    return (
        <>
            <div className="artist-individual-container">
                <div className="artist-header">
                    {bannerUrl && <img src={bannerUrl} alt={artistaLocal.name} />}
                </div>

                <div className="artistInformation">
                    <div className="verificy">
                        <i className="fa-solid fa-certificate"></i>
                        <p>{spotifyData?.profile?.verified ? 'Artista Verificado' : 'Artista'}</p>
                    </div>
                    <h1>{artistaLocal.name}</h1>
                    <h2>{ouvintes !== '---' ? `${ouvintes} Ouvintes Mensais` : 'Carregando ouvintes...'}</h2>
                </div>

                <div className="songsContainer">
                    <h2 className="sectionTitle">Musicas Populares</h2>
                    {artistSongs.length > 0 ? artistSongs.map((song, index) => (
                        <div className="musicsArtistPage" key={song.id || `song-${index}`}>
                            <div className="songContainer" onClick={() => { setPlaylist(artistSongs); setCurrentIndex(index); }}>
                                <h4>{index + 1}</h4>
                                <img src={song.cover} alt={song.name} />
                                <div className="songInformation">
                                    <h4>{song.name}</h4>
                                    <p>{song.artistsNames?.map(a => a.name).join(', ')}</p>
                                </div>
                                <div className="otherInformation">
                                    <p>{song.duration}</p>
                                    <i className="fa-solid fa-ellipsis" onClick={e => {
                                        e.stopPropagation();
                                        setSelectedSong(song);
                                        setModalOpen(true);
                                    }}></i>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="withoutSong">
                            <h1>Nenhuma música encontrada.</h1>
                        </div>
                    )}
                </div>

                <div className="albumsContainer">
                    <h2>Álbuns Disponíveis</h2>
                    <div className="flexAlbums">
                        {albums.map((album) => (
                            album.artistsNames?.some(a => a.name === artistaLocal.name) &&
                            album.status !== 'NOT_RELEASED' && (
                                <div className="albumsArtistPage" key={album.id}>
                                    <div className="albumContainer">
                                        <div className="albumImage">
                                            <a href={`/albums/${album.id}`}>
                                                <img src={album.cover} alt={album.name} />
                                            </a>
                                        </div>
                                        <div className="albumInformation">
                                            <a href={`/albums/${album.id}`}><h4>{album.name}</h4></a>
                                            <div className="albumCredits">
                                                <p>Álbum • {album.year}</p>
                                                <p onClick={(e) => openAlbumModal(album, e)} style={{cursor: 'pointer'}}>
                                                    <i className="fa-solid fa-ellipsis"></i>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            </div>

            <MusicaModal
                isOpen={modalOpen}
                onClose={closeMusicModal}
                song={selectedSong}
                favoritesListSongs={favoritesListSongs}
                onAddFavorite={addMusicToFavorites}
                onDeleteFavorite={deleteMusicToFavorites}
                isOpenPlaylistAdd={modalOpenPlaylistAdd}
                onOpenPlaylistAdd={() => setModalOpenPlaylistAdd(true)}
                onCloseOpenPlaylistAdd={() => setModalOpenPlaylistAdd(false)}
                onMusicToPlaylist={addMusicToPlaylist}
                onRemoveFromPlaylist={removeMusicFromPlaylist}
                API_URL={API_URL}
            />

            <ModalAlbum
                isOpen={modalOpenAlbum}
                onClose={closeAlbumModal}
                album={selectedAlbum}
                favoritesListAlbums={favoritesListAlbums}
                onAddFavorite={addAlbumToFavorites}
                onDeleteFavorite={deleteAlbumToFavorites}
            />

            <Toast toasts={toasts} removeToast={removeToast} />
        </>
    );
};

export default ArtistPage;