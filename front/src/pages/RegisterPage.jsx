import React, { useState } from 'react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState("USER");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [adminPassword, setAdminPassword] = useState("1234");

  async function uploadProfileImageToCloudinary() {
    const formData = new FormData()
    formData.append("file", imageFile)
    formData.append("upload_preset", "profile_users")

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dthgw4q5d/image/upload",
      {
        method: "POST",
        body: formData
      }
    )

    if (!response.ok) throw new Error()

    const data = await response.json()
    return data.secure_url
  }

  async function handleRegister() {
    // Validações básicas
    if (!name || !email || !password || !role) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    if (role === "ADMIN" && !adminPassword) {
      alert("É necessário informar a senha de Admin!");
      return;
    }

    const uploadedImageProfile = await uploadProfileImageToCloudinary()
    setImage(uploadedImageProfile)

    const userData = {
      name,
      email,
      password,
      image: uploadedImageProfile,
      role,
      adminPassword: role === "ADMIN" ? adminPassword : null
    };

    try {
      const response = await fetch("https://java-react-spotify.onrender.com/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        alert("Conta cadastrada com sucesso!");
        // Redirecionar para login
        window.location.href = "/login";
      } else {
        const errorData = await response.json();
        alert("Erro: " + (errorData.message || "Não foi possível registrar"));
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro ao conectar com o servidor.");
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <img
          src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1764390583/Spotify_logo_with_text.svg_mg0kr2.webp"
          alt="Spotify"
          className="logo"
        />

        <h1 className="auth-title">Inscrever-se para começar a ouvir</h1>

        <div className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@dominio.com"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Crie uma senha"
              className="form-input"
            />
            <small className="form-hint">Use no mínimo 8 caracteres.</small>
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)} className="form-input">
              <option value="USER">Usuário</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>

          {role === "ADMIN" && (
            <div className="form-group">
              <label htmlFor="adminPassword">Senha de Admin</label>
              <input
                type="password"
                id="adminPassword"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Digite a senha de Admin"
                className="form-input"
              />
            </div>
          )}

          <div className="inputBox">
              <div className="textLogo">
                <h2>Imagem de Perfil</h2>
              </div>
              <div className="inputArea">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
                {imageFile && <p style={{ color: 'green', marginTop: '5px' }}>Arquivo selecionado: {imageFile.name}</p>}
              </div>
            </div>

          <button onClick={handleRegister} className="btn-primary">
            Inscrever-se
          </button>
        </div>

        <div className="divider">
          <span>OU</span>
        </div>

        <button className="btn-social btn-google">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Inscrever-se com o Google
        </button>
        
        <div className="terms-text">
          Ao clicar em "Inscrever-se", você concorda com os <a href="#">Termos de Uso</a> do Spotify.
        </div>

        <div className="footer-link">
          <span className="text-muted">Já tem uma conta? </span>
          <a href="/login">Fazer login</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;