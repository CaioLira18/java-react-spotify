import React from 'react';

const MusicaModal = ({ 
  isOpen, 
  onClose, 
  song, 
  favoritesListSongs, 
  onAddFavorite, 
  onDeleteFavorite, 
  onRemoveFromPlaylist 
}) => {
  // Se o modal não estiver aberto ou não houver música selecionada, não renderiza nada
  if (!isOpen || !song) return null;

  // Verifica se a música atual está na lista de favoritos
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

          {/* Lógica de Favoritos baseada na prop isFavorite */}
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

          <button
            className="modal-action-option"
            onClick={() => onRemoveFromPlaylist(song.id)}
          >
            <i className="fa-solid fa-trash"></i>
            <span>Remover Musica da Playlist</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicaModal;