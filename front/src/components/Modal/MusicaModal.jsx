import React, { useState, useEffect } from 'react';

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
  onRemoveFromPlaylist,
  onMusicToPlaylist,
}) => {
  const [playlists, setPlaylists] = useState([]);
  const [modo, setModo] = useState(''); // 'add' ou 'remove'
  const API_URL = "http://localhost:8080/api";

  useEffect(() => {
    if (isOpen) {
      fetch(`${API_URL}/playlists`)
        .then(response => response.json())
        .then(data => setPlaylists(data))
        .catch(() => console.error("Erro ao buscar Playlists."));
    }
  }, [isOpen]);

  if (!isOpen || !song) return null;

  const handleAbrirSeletor = (tipo) => {
    setModo(tipo);
    // Proteção para evitar o erro "is not a function"
    if (typeof onOpenPlaylistAdd === 'function') {
      onOpenPlaylistAdd();
    }
  };

  const isFavorite = favoritesListSongs.some(fav => fav.id === song.id);

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

          <button className="modal-action-option" onClick={isFavorite ? onDeleteFavorite : onAddFavorite}>
            <i className={isFavorite ? "fa-solid fa-heart" : "fa-regular fa-heart"}
              style={{ color: isFavorite ? '#1db954' : '' }}></i>
            <span>{isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}</span>
          </button>

          {/* Botão para Remover */}
          <button className="modal-action-option" onClick={() => handleAbrirSeletor('remove')}>
            <i className="fa-solid fa-minus-circle"></i>
            <span>Remover de uma Playlist</span>
          </button>

          {/* Botão para Adicionar */}
          <button className="modal-action-option" onClick={() => handleAbrirSeletor('add')}>
            <i className="fa-solid fa-plus"></i>
            <span>Adicionar a uma Playlist</span>
          </button>

          {isOpenPlaylistAdd && (
            <div className="playlist-selector-container">
              <p>{modo === 'add' ? 'Adicionar à:' : 'Remover de:'}</p>
              <select
                className="playlist-select"
                onChange={(e) => {
                  const idPlaylist = e.target.value;
                  if (modo === 'add') {
                    onMusicToPlaylist(idPlaylist);
                  } else {
                    onRemoveFromPlaylist(idPlaylist);
                  }
                }}
                defaultValue=""
              >
                <option value="" disabled>Selecionar...</option>
                {playlists.map(p => p.type !== "SPOTIFY_PLAYLIST" && (
                  <option key={p.id} value={p.id}>{p.name}</option>
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