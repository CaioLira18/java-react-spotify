import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const MusicaModal = ({
  isOpen,
  onClose,
  isOpenPlaylistAdd, // Propriedade recebida do pai
  onOpenPlaylistAdd,
  onCloseOpenPlaylistAdd,
  song,
  favoritesListSongs,
  onAddFavorite,
  onDeleteFavorite,
  onMusicToPlaylist,
  onRemoveFromPlaylist,
  addMusicToPlaylist,
  API_URL,
}) => {
  const [playlists, setPlaylists] = useState([]);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const { id: playlistIdFromUrl } = useParams();

  useEffect(() => {
    if (isOpen) {
      fetch(`${API_URL}/playlists`)
        .then(response => response.json())
        .then(data => {
          setPlaylists(data);
          if (playlistIdFromUrl) {
            const current = data.find(p => p.id === playlistIdFromUrl);
            setCurrentPlaylist(current);
          }
        })
        .catch(err => console.error("Erro ao carregar playlists", err));
    }
  }, [isOpen, API_URL, playlistIdFromUrl]);

  if (!isOpen || !song) return null;

  const isFavorite = favoritesListSongs.some(fav => fav.id === song.id);
  const isUserPlaylist = currentPlaylist && currentPlaylist.type !== "SPOTIFY_PLAYLIST";

  return (
    <div className="song-modal-overlay" onClick={onClose}>
      <div className="song-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="song-modal-header">
          <h3>Opções</h3>
          <button className="song-modal-close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="song-modal-body">
          <div className="modal-song-preview">
            <img src={song.cover} alt={song.name} />
            <div>
              <h4>{song.name}</h4>
              <p>{song.artistsNames?.map(a => a.name).join(', ')}</p>
            </div>
          </div>

          <hr style={{ border: '0.5px solid #333', margin: '10px 0' }} />

          {isFavorite ? (
            <button className="modal-action-option" onClick={onDeleteFavorite}>
              <i className="fa-solid fa-heart" style={{ color: '#1db954' }}></i>
              <span>Remover dos Favoritos</span>
            </button>
          ) : (
            <button className="modal-action-option" onClick={onAddFavorite}>
              <i className="fa-regular fa-heart"></i>
              <span>Adicionar aos Favoritos</span>
            </button>
          )}

          <button className="modal-action-option" onClick={onOpenPlaylistAdd}>
            <i className="fa-solid fa-plus"></i>
            <span>Adicionar em uma Playlist</span>
          </button>

          {playlistIdFromUrl && isUserPlaylist && (
            <button
              className="modal-action-option"
              onClick={() => onRemoveFromPlaylist(playlistIdFromUrl, song.id)}
            >
              <i className="fa-solid fa-minus-circle"></i>
              <span>Remover desta Playlist</span>
            </button>
          )}

          {/* SESSÃO DE SELEÇÃO DE PLAYLIST */}
          {isOpenPlaylistAdd && (
            <div className="playlist-selector-container" style={{ marginTop: '15px', padding: '15px', backgroundColor: '#282828', borderRadius: '8px' }}>
              <p style={{ marginBottom: '10px', fontSize: '14px' }}>Escolha a Playlist:</p>
              <select
                className="playlist-select"
                onChange={(e) => {
                  if (e.target.value) addMusicToPlaylist(e.target.value);
                }}
                defaultValue=""
                style={{ width: '100%', padding: '10px', borderRadius: '4px', backgroundColor: '#333', color: 'white', border: 'none' }}
              >
                <option value="" disabled>Selecionar...</option>
                {playlists
                  .filter(p => p.type !== "SPOTIFY_PLAYLIST")
                  .map(playlist => (
                    <option key={playlist.id} value={playlist.id}>
                      {playlist.name}
                    </option>
                  ))}
              </select>
              <button 
                onClick={onCloseOpenPlaylistAdd}
                style={{ marginTop: '10px', width: '100%', padding: '8px', cursor: 'pointer', background: 'transparent', color: '#b3b3b3', border: 'none' }}
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicaModal;