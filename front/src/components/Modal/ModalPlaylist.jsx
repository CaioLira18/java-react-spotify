import React, { useState, useEffect } from 'react'

const ModalPlaylist = ({ 
  isOpen, 
  onClose, 
  playlist, 
  deletePlaylist, 
  updatePlaylist,
  API_URL 
}) => {
  const [isEditMode, setIsEditMode] = useState(false)
  const [name, setName] = useState('')
  const [year, setYear] = useState('')
  const [description, setDescription] = useState('')
  const [coverFile, setCoverFile] = useState(null)

  // Resetar estados quando o modal abrir/fechar ou playlist mudar
  useEffect(() => {
    if (isOpen && playlist) {
      setName(playlist.name || '')
      setYear(playlist.year || '')
      setDescription(playlist.description || '')
      setCoverFile(null)
      setIsEditMode(false)
    }
  }, [isOpen, playlist])

  if (!isOpen || !playlist) return null

  const handleEditClick = (e) => {
    e.preventDefault()
    setIsEditMode(true)
  }

  const handleCancelEdit = () => {
    setIsEditMode(false)
    setName(playlist.name || '')
    setYear(playlist.year || '')
    setDescription(playlist.description || '')
    setCoverFile(null)
  }

  const handleUpdatePlaylist = async () => {
    try {
      await updatePlaylist({
        id: playlist.id,
        name: name.trim() || playlist.name,
        year: year || playlist.year,
        description: description || playlist.description,
        coverFile: coverFile,
        status: playlist.status,
        type: playlist.type,
        currentCover: playlist.cover
      })
      setIsEditMode(false)
      onClose()
    } catch (error) {
      console.error('Erro ao atualizar playlist:', error)
    }
  }

  return (
    <div className="song-modal-overlay" onClick={onClose}>
      <div
        className="song-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="song-modal-header">
          <h3>{isEditMode ? 'Editar Playlist' : 'Opções da Playlist'}</h3>
          <button
            className="song-modal-close"
            onClick={onClose}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="song-modal-body">
          {!isEditMode ? (
            <>
              <div className="modal-song-preview">
                <img src={playlist.cover} alt={playlist.name} />
                <div>
                  <h4>{playlist.name}</h4>
                  <p>Playlist • {playlist.year}</p>
                </div>
              </div>

              <button
                className="modal-action-option"
                onClick={handleEditClick}
              >
                <i className="fa-solid fa-pencil"></i>
                <span>Editar Playlist</span>
              </button>

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
            </>
          ) : (
            <div className="edit-playlist-container">
              <div className="imageEditPlaylist">
                <img 
                  src={coverFile ? URL.createObjectURL(coverFile) : playlist.cover} 
                  alt={playlist.name} 
                />
                <label className="file-input-label">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setCoverFile(e.target.files[0])}
                  /> 
                  <span>
                    <i className="fa-solid fa-upload"></i>
                    {coverFile ? 'Trocar Capa' : 'Carregar Nova Capa'}
                  </span>
                </label>
              </div>

              <div className="informationsEditPlaylist">
                <div className="input-group">
                  <label>Nome da Playlist</label>
                  <input 
                    type="text"
                    placeholder={playlist.name} 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                  />
                </div>

                <div className="input-group">
                  <label>Descrição</label>
                  <textarea 
                    placeholder={playlist.description || 'Adicione uma descrição'} 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                  />
                </div>
              </div>

              <div className="buttonEditPlaylist">
                <button 
                  className="btn-cancel"
                  onClick={handleCancelEdit}
                >
                  Cancelar
                </button>
                <button 
                  className="btn-save"
                  onClick={handleUpdatePlaylist}
                >
                  Salvar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ModalPlaylist