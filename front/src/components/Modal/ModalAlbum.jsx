import React from 'react'

const ModalAlbum = ({
    isOpen,
    onClose,
    album,
    favoritesListAlbums,
    onAddFavorite,
    onDeleteFavorite,
}) => {
    if (!isOpen || !album) return null;

    const isFavorite = favoritesListAlbums?.some(fav => fav.id === album.id);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Opções</h3>
                    <button className="close-btn" onClick={onClose}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div className="modal-body">
                    <div className="song-info">
                        <img src={album.cover} alt={album.name} />
                        <div>
                            <h4>{album.name}</h4>
                            <p>{album.artistsNames?.map(a => a.name).join(', ')}</p>
                        </div>
                    </div>

                    {isFavorite ? (
                        <button className="modal-option" onClick={onDeleteFavorite}>
                            <i className="fa-solid fa-heart" style={{ color: '#1db954' }}></i>
                            <span>Remover dos Favoritos</span>
                        </button>
                    ) : (
                        <button className="modal-option" onClick={onAddFavorite}>
                            <i className="fa-regular fa-heart"></i>
                            <span>Adicionar aos Favoritos</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ModalAlbum