import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Edit = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(''); // Nome correto conforme Java
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const fileInputRef = useRef(null);

  const API_URL = "https://java-react-plataformstreaming-8f2k.onrender.com/api";
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser.id);

      // Chamada para buscar dados atualizados do banco
      fetch(`${API_URL}/users/${parsedUser.id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Erro ao carregar dados');
          return res.json();
        })
        .then((fullUser) => {
          setIsAuthenticated(true);
          setName(fullUser.name || '');
          setEmail(fullUser.email || '');
          setImage(fullUser.image || ''); // Use .image
          setPhotoPreview(fullUser.image || '');
        })
        .catch((error) => {
          console.error('Erro:', error);
          setMessage('Erro ao carregar dados do usuário');
          setMessageType('error');
        });
    } else {
      navigate('/login'); // Redireciona se não houver user
    }
  }, [navigate]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage('Imagem muito grande. Máximo 5MB');
        setMessageType('error');
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadProfileImageToCloudinary = async () => {
    const formData = new FormData();
    formData.append("file", photoFile);
    formData.append("upload_preset", "profile_users");

    const response = await fetch("https://api.cloudinary.com/v1_1/dthgw4q5d/image/upload", {
      method: "POST",
      body: formData
    });

    if (!response.ok) throw new Error('Erro ao fazer upload da imagem');
    const data = await response.json();
    return data.secure_url;
  };

  const handleSave = async () => {
    // Validações básicas
    if (!name.trim() || !email.trim()) {
      setMessage('Nome e Email são obrigatórios');
      setMessageType('error');
      return;
    }

    setLoading(true);
    try {
      let imageUrl = image; 
      if (photoFile) {
        imageUrl = await uploadProfileImageToCloudinary();
      }

      const updateData = {
        name: name.trim(),
        email: email.trim(),
        image: imageUrl
      };

      if (newPassword) {
        if (newPassword !== confirmPassword) {
          throw new Error('As senhas não coincidem');
        }
        updateData.password = newPassword;
      }

      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) throw new Error('Erro ao atualizar perfil no servidor');

      const updatedUser = await response.json();

      // Atualiza estado e LocalStorage
      setImage(updatedUser.image);
      const storedUser = JSON.parse(localStorage.getItem("user"));
      localStorage.setItem("user", JSON.stringify({
        ...storedUser,
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image // Sincronizado com Java
      }));

      setMessage('Perfil atualizado com sucesso!');
      setMessageType('success');
      setNewPassword('');
      setConfirmPassword('');
      setCurrentPassword('');
    } catch (error) {
      setMessage(error.message);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="loading">
        <div className="loadingText">
          <p>Carregando Conteúdo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="editProfilePage">
      <div className="editProfileContainer">
        <div className="editProfileBox">
          <h1 className="editProfileTitle">Editar Perfil</h1>

          <div className="profilePhotoSection">
            <div className="profilePhotoWrapper" onClick={handlePhotoClick}>
              <img
                src={photoPreview || "https://res.cloudinary.com/dthgw4q5d/image/upload/v1753994647/icon_fzzpew.png"}
                alt="Foto de Perfil"
                className="profilePhoto"
              />
              <div className="profilePhotoOverlay">
                <i className="fa-solid fa-camera"></i>
                <span>Alterar Foto</span>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: 'none' }}
            />
            {photoFile && (
              <p className="photoSelectedText">
                <i className="fa-solid fa-check-circle"></i> Foto selecionada
              </p>
            )}
          </div>

          <div className="editFormGrid">
            <div className="inputGroup">
              <label>Nome</label>
              <div className="inputWithIcon">
                <i className="fa-solid fa-user"></i>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Digite seu nome"
                />
              </div>
            </div>

            <div className="inputGroup">
              <label>Email</label>
              <div className="inputWithIcon">
                <i className="fa-solid fa-envelope"></i>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu email"
                />
              </div>
            </div>

            <div className="inputGroup fullWidth">
              <label>Senha Atual</label>
              <div className="inputWithIcon">
                <i className="fa-solid fa-lock"></i>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Digite sua senha atual"
                />
              </div>
            </div>

            <div className="inputGroup">
              <label>Nova Senha</label>
              <div className="inputWithIcon">
                <i className="fa-solid fa-lock"></i>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Digite a nova senha"
                />
              </div>
            </div>

            <div className="inputGroup">
              <label>Confirmar Nova Senha</label>
              <div className="inputWithIcon">
                <i className="fa-solid fa-lock"></i>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme a nova senha"
                />
              </div>
            </div>
          </div>

          <button
            className="saveButton"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                Salvando...
              </>
            ) : (
              <>
                <i className="fa-solid fa-check"></i>
                Salvar Alterações
              </>
            )}
          </button>

          {message && (
            <div className={`feedbackMessage ${messageType}`}>
              <i className={`fa-solid ${messageType === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default Edit;

