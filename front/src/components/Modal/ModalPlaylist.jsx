import React from 'react'

const ModalPlaylist = ({ isOpen, onClose, playlist, deletePlaylist }) => {
  if (!isOpen || !playlist) return null

  return (
    <div className="song-modal-overlay" onClick={onClose}>
      <div
        className="song-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="song-modal-header">
          <h3>Opções da Playlist</h3>
          <button
            className="song-modal-close"
            onClick={onClose}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="song-modal-body">
          <div className="modal-song-preview">
            <img src={playlist.cover} alt={playlist.name} />
            <div>
              <h4>{playlist.name}</h4>
              <p>Playlist • {playlist.year}</p>
            </div>
          </div>

          <hr className="modal-divider" />

          <button
            className="modal-action-option delete-option"
            onClick={() => {
              onClose()
              deletePlaylist()
            }}
          >
            <i className="fa-solid fa-trash"></i>
            <span>Excluir Playlist</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalPlaylist
