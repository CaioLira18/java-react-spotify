import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const MusicaModal = ({
  isOpen,
  onClose,
  isOpenPlaylistAdd,
  onOpenPlaylistAdd,
  onCloseOpenPlaylistAdd,
  song,
  favoritesListSongs,
  onAddFavorite,
  onDeleteFavorite,
  onMusicToPlaylist,
  onRemoveFromPlaylist,
  API_URL,
}) => {

  const [playlists, setPlaylists] = useState([]);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const { id: playlistIdFromUrl } = useParams();

  useEffect(() => {
    fetch(`${API_URL}/playlists`)
      .then(response => response.json())
      .then(data => {
        setPlaylists(data);
        // Buscar a playlist atual se estiver em uma página de playlist
        if (playlistIdFromUrl) {
          const current = data.find(p => p.id === playlistIdFromUrl);
          setCurrentPlaylist(current);
        }
      })
      .catch(() => alert("Erro ao buscar Playlists."))
  }, [API_URL, playlistIdFromUrl])

  if (!isOpen || !song) return null;

  const isFavorite = favoritesListSongs.some(fav => fav.id === song.id);
  
  // Verificar se está em uma playlist do usuário (não do Spotify)
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

          {/* Botão só aparece se estiver em uma playlist do USUÁRIO (não do Spotify) */}
          {playlistIdFromUrl && isUserPlaylist && onRemoveFromPlaylist && (
            <button
              className="modal-action-option"
              onClick={() => onRemoveFromPlaylist(playlistIdFromUrl, song.id)}
            >
              <i className="fa-solid fa-minus-circle"></i>
              <span>Remover da Playlist</span>
            </button>
          )}

          {isOpenPlaylistAdd && (
            <div className="playlist-selector-container">
              <p>Escolha a Playlist:</p>
              <select
                className="playlist-select"
                onChange={(e) => {
                  if (e.target.value) onMusicToPlaylist(e.target.value);
                }}
                defaultValue=""
              >
                <option value="" disabled>Selecionar...</option>
                {playlists.map(playlist => (
                  playlist.type !== "SPOTIFY_PLAYLIST" && (
                    <option key={playlist.id} value={playlist.id}>
                      {playlist.name}
                    </option>
                  )
                ))}
              </select>
              <button onClick={onCloseOpenPlaylistAdd}>Cancelar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicaModal;