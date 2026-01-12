import React, { useEffect, useState } from 'react'

const UpdateArtistPage = () => {

    const [artists, setArtists] = useState([])
    const [selectedArtist, setSelectedArtist] = useState(null)
    const [toasts, setToasts] = useState([])
    const [modalOpenArtist, setModalOpenArtist] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredArtists, setFilteredArtists] = useState([])
    const API_URL = "http://localhost:8080/api"
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [photoFile, setPhotoFile] = useState(null)
    const [bannerFile, setBannerFile] = useState(null)
    const [isUpdating, setIsUpdating] = useState(false)

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setIsAuthenticated(true);
                setIsAdmin(parsedUser.role === 'ADMIN');
            } catch (err) {
                console.error("Erro ao processar usuário do localStorage", err);
            }
        }
    }, []);

    {
        !isAdmin && (
            navigate('/')
        )
    }

    {
        !isAuthenticated && (
            navigate('/login')
        )
    }

    const showToast = (message, type = 'success') => {
        const toastId = Date.now()
        setToasts(prev => [...prev, { id: toastId, message, type }])
        setTimeout(() => removeToast(toastId), 5000)
    }

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }

    const modalMoreOptionsArtists = (artist, e) => {
        e.stopPropagation()
        setSelectedArtist(artist)
        // Preenche os campos com os valores atuais
        setName(artist.name)
        setDescription(artist.description)
        setModalOpenArtist(true)
    }

    const closeModalArtist = () => {
        setModalOpenArtist(false)
        setSelectedArtist(null)
        // Limpa os campos ao fechar
        setName("")
        setDescription("")
        setPhotoFile(null)
        setBannerFile(null)
    }

    function search(value) {
        setSearchTerm(value)

        if (!value.trim()) {
            setFilteredArtists(artists)
            return
        }

        const filtered = artists.filter(artist =>
            artist.name.toLowerCase().includes(value.toLowerCase())
        )
        setFilteredArtists(filtered)
    }

    async function uploadPhotoToCloudinary(file) {
        if (!file) {
            throw new Error("Nenhum arquivo selecionado para foto")
        }

        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", "Artists_Photo")

        const response = await fetch(
            "https://api.cloudinary.com/v1_1/dthgw4q5d/image/upload",
            {
                method: "POST",
                body: formData
            }
        )

        if (!response.ok) throw new Error("Erro ao fazer upload da foto")

        const data = await response.json()
        return data.secure_url
    }

    async function uploadBannerToCloudinary(file) {
        if (!file) {
            throw new Error("Nenhum arquivo selecionado para banner")
        }

        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", "Artists_Banner")

        const response = await fetch(
            "https://api.cloudinary.com/v1_1/dthgw4q5d/image/upload",
            {
                method: "POST",
                body: formData
            }
        )

        if (!response.ok) throw new Error("Erro ao fazer upload do banner")

        const data = await response.json()
        return data.secure_url
    }

    const fetchArtists = async () => {
        try {
            const res = await fetch(`${API_URL}/artists`)
            if (!res.ok) throw new Error("Erro ao buscar artistas")
            const data = await res.json()
            const artistData = Array.isArray(data) ? data : [];
            setArtists(artistData);
            setFilteredArtists(artistData);
        } catch (err) {
            console.error(err);
            setArtists([]);
            setFilteredArtists([]);
            showToast("Erro ao carregar artistas", "error")
        }
    }

    useEffect(() => {
        fetchArtists()
    }, [])

    async function updateArtist() {
        // Validação básica
        if (!name.trim()) {
            showToast("O nome do artista é obrigatório", "error")
            return
        }

        setIsUpdating(true)

        try {
            // Monta o payload com os valores atuais
            const payload = {
                name: name.trim(),
                description: description.trim(),
                profilePhoto: selectedArtist.profilePhoto, // Mantém a foto atual
                bannerPhoto: selectedArtist.bannerPhoto    // Mantém o banner atual
            };

            // Só faz upload de nova foto se o usuário selecionou uma
            if (photoFile) {
                console.log("Fazendo upload da foto de perfil...")
                payload.profilePhoto = await uploadPhotoToCloudinary(photoFile)
                console.log("Foto de perfil uploaded:", payload.profilePhoto)
            }

            // Só faz upload de novo banner se o usuário selecionou um
            if (bannerFile) {
                console.log("Fazendo upload do banner...")
                payload.bannerPhoto = await uploadBannerToCloudinary(bannerFile)
                console.log("Banner uploaded:", payload.bannerPhoto)
            }

            console.log("Payload final:", payload)

            const response = await fetch(`${API_URL}/artists/${selectedArtist.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.text()
                throw new Error(`Erro ao atualizar artista: ${errorData}`);
            }

            const result = await response.json();
            console.log("Resposta da API:", result)

            showToast("Artista atualizado com sucesso!", "success")

            // Recarrega a lista de artistas
            await fetchArtists()

            // Fecha o modal
            closeModalArtist()

        } catch (error) {
            console.error("Erro completo:", error);
            showToast("Erro ao atualizar artista: " + error.message, "error")
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <div>
            <div className="inputDeleteAlbumSearch">
                <input
                    value={searchTerm}
                    onChange={(e) => search(e.target.value)}
                    placeholder='Digite o Nome do Artista'
                    type="text"
                />
            </div>

            <div className="centerContent">
                <div className="deleteAlbumContainer">
                    {filteredArtists.length === 0 && searchTerm === "" && (
                        <h1>Sem Artistas</h1>
                    )}

                    {filteredArtists.length === 0 && searchTerm !== "" && (
                        <h1>Sem Artistas Com Esse Nome</h1>
                    )}

                    {filteredArtists.map((artist) =>
                        <div key={artist.id} className="albumDeleteBox">
                            <div className="albumDeleteInformations" onClick={(e) => modalMoreOptionsArtists(artist, e)}>
                                <div className="albumDeleteImage">
                                    <img src={artist.profilePhoto} alt={artist.name} />
                                </div>
                                <div className="albumDeleteNames">
                                    <h4>{artist.name}</h4>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Artist */}
            {modalOpenArtist && selectedArtist && (
                <div className="modal-overlay" onClick={closeModalArtist}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Atualizar Artista</h3>
                            <button className="close-btn" onClick={closeModalArtist}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="song-info">
                                <img src={selectedArtist.profilePhoto} alt={selectedArtist.name} />
                                <div>
                                    <h4>{selectedArtist.name}</h4>
                                    <p>Artista</p>
                                </div>
                            </div>

                            {/* Nome */}
                            <div className="inputBox">
                                <div className="textLogo">
                                    <i className="fa-solid fa-pencil"></i>
                                    <h2>Nome</h2>
                                </div>
                                <div className="inputArea">
                                    <input
                                        placeholder="Nome do artista"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        type="text"
                                    />
                                </div>
                            </div>

                            <div className="inputBox">
                                <div className="textLogo">
                                    <i className="fa-solid fa-image"></i>
                                    <h2>Foto de Perfil</h2>
                                </div>
                                <div className="inputArea">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setPhotoFile(e.target.files[0])}
                                    />
                                    {photoFile && <small>Novo arquivo selecionado: {photoFile.name}</small>}
                                    {!photoFile && <small>Manter foto atual</small>}
                                </div>
                            </div>

                            <div className="inputBox">
                                <div className="textLogo">
                                    <i className="fa-solid fa-image"></i>
                                    <h2>Banner do Artista</h2>
                                </div>
                                <div className="inputArea">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setBannerFile(e.target.files[0])}
                                    />
                                    {bannerFile && <small>Novo arquivo selecionado: {bannerFile.name}</small>}
                                    {!bannerFile && <small>Manter banner atual</small>}
                                </div>
                            </div>

                            <div className="inputBox">
                                <div className="textLogo">
                                    <i className="fa-solid fa-pencil"></i>
                                    <h2>Descrição</h2>
                                </div>
                                <div className="inputArea">
                                    <input
                                        placeholder="Descrição do artista"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        type="text"
                                    />
                                </div>
                            </div>

                            <div className="optionDeleteAlbum">
                                <button
                                    onClick={updateArtist}
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? "Atualizando..." : "Atualizar Artista"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Notificações Toast */}
            <div className="toast-container">
                {toasts.map(toast => (
                    <div key={toast.id} className={`toast toast-${toast.type}`}>
                        <span>{toast.message}</span>
                        <button onClick={() => removeToast(toast.id)}>×</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UpdateArtistPage