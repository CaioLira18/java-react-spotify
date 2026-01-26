import React, { useEffect, useState } from 'react';
import ModalPlaylist from './Modal/ModalPlaylist';

const SlideHome = () => {
    // const API_URL = "http://localhost:8080/api";
    const API_URL = "https://java-react-spotify.onrender.com/api";
    const [playlists, setPlaylists] = useState([]);
    const [modalPlaylistOpen, setModalPlaylistOpen] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [favoritesListPlaylists, setFavoritesListPlaylists] = useState([]);
    const [userID, setUserID] = useState(null);

    // Carregar dados do usuário
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.id) {
            setUserID(userData.id);
            if (userData.listPlaylists) setFavoritesListPlaylists(userData.listPlaylists);
        }
    }, []);

    // Função auxiliar para atualizar LocalStorage
    const updateLocalStorage = (updatedList) => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
            userData.listPlaylists = updatedList;
            localStorage.setItem('user', JSON.stringify(userData));
        }
    };

    const addPlaylistToFavorite = async (playlist) => {
        if (!playlist.id || !userID) return;
        try {
            const res = await fetch(`${API_URL}/users/${userID}/favorites/playlist/${playlist.id}`, { method: 'POST' });
            if (res.ok) {
                const updated = [...favoritesListPlaylists, playlist];
                setFavoritesListPlaylists(updated);
                updateLocalStorage(updated);
                // showToast("Playlist Adicionada aos Favoritos", "success");
            }
        } catch (error) {
            // showToast("Erro ao salvar Playlist", "error");
        }
    };

    const deletePlaylistToFavorite = async (id) => {
        if (!id || !userID) return;
        try {
            const res = await fetch(`${API_URL}/users/${userID}/favorites/playlist/${id}`, { method: 'DELETE' });
            if (res.ok) {
                const updated = favoritesListPlaylists.filter(p => p.id !== id);
                setFavoritesListPlaylists(updated);
                updateLocalStorage(updated);
                // showToast("Removido dos Favoritos", "success");
            }
        } catch (error) {
            // showToast("Erro ao remover Playlist", "error");
        }
    };

    const fetchPlaylistData = async () => {
        try {
            const response = await fetch(`${API_URL}/playlists`);
            const data = await response.json();
            setPlaylists(data);
        } catch (error) {
            console.error("Erro ao buscar playlists:", error);
        }
    };

    useEffect(() => {
        fetchPlaylistData();
    }, []);

    const modalPlaylistMoreOptions = (playlist, e) => {
        e.stopPropagation();
        setSelectedPlaylist(playlist);
        setModalPlaylistOpen(true);
    };

    const closePlaylistModal = () => {
        setModalPlaylistOpen(false);
        setSelectedPlaylist(null);
    };

    const deletePlaylist = async () => {
        if (!selectedPlaylist) return;
        try {
            const response = await fetch(`${API_URL}/playlists/${selectedPlaylist.id}`, { method: 'DELETE' });
            if (response.ok) {
                setPlaylists(prev => prev.filter(p => p.id !== selectedPlaylist.id));
                closePlaylistModal();
            }
        } catch (error) {
            console.error("Erro ao remover:", error);
        }
    };

    const updatePlaylist = async (data) => {
        // ... sua lógica de upload Cloudinary e PUT se mantém igual ...
        // Certifique-se de chamar fetchPlaylistData() ao final com sucesso
    };

    return (
        <div>
            {playlists.map((playlist) => {
                // Verificação individual para cada playlist no loop
                const isFavorite = favoritesListPlaylists.some(p => p.id === playlist.id);

                return playlist.type === "SPOTIFY_PLAYLIST" && (
                    <div key={playlist.id} className="slideTopPlaylistsHomeContainer">
                        <div className="slideTopPlaylistsHomeBox">
                            <div className="slideTopPlaylistsHomeImagePlaylist">
                                <img src={playlist.cover} alt={playlist.name} />
                            </div>
                            <div className="slideTopPlaylistsHomeInformations">
                                <div className="slideTopPlaylistsHomeInformationsPlaylist">
                                    <strong><span>Playlist</span></strong>
                                    <h1>{playlist.name}</h1>
                                    <p>{playlist.description}</p>
                                </div>
                                <div className="slideTopPlaylistsHomeButton">
                                    <a href={`/playlists/${playlist.id}`}>
                                        <button className='play-button'>Play</button>
                                    </a>
                                    
                                    {/* Botão de Seguir Corrigido */}
                                    <button 
                                        className={`follow_button ${isFavorite ? "following" : ""}`}
                                        onClick={() => isFavorite ? deletePlaylistToFavorite(playlist.id) : addPlaylistToFavorite(playlist)}
                                    >
                                        {isFavorite ? "Seguindo" : "Seguir"}
                                    </button>

                                    <button
                                        onClick={(e) => modalPlaylistMoreOptions(playlist, e)}
                                        className='more_button'
                                    >
                                        <i className="fa-solid fa-ellipsis"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            <ModalPlaylist
                isOpen={modalPlaylistOpen}
                onClose={closePlaylistModal}
                playlist={selectedPlaylist}
                deletePlaylist={deletePlaylist}
                updatePlaylist={updatePlaylist}
                API_URL={API_URL}
            />
        </div>
    );
};

export default SlideHome;