import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  // const API_URL = "http://localhost:8080/api";
  const API_URL = "https://java-react-spotify.onrender.com/api";


  const handleLogin = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    // Validação básica
    if (!email || !password) {
      setError("Por favor, preencha todos os campos");
      setLoading(false);
      return;
    }

    try {
      console.log("Tentando login com:", { email, password: "***" });
      
      const response = await Axios.post(
        `${API_URL}/auth/login`,
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Resposta do servidor:", response.data);

      if (response.data) {
        const userData = {
          id: response.data.id,
          email: response.data.email,
          name: response.data.name,
          role: (response.data.role || "USER").toUpperCase(),
          token: response.data.token,
          authenticated: true,
        };
        
        localStorage.setItem("user", JSON.stringify(userData));
        setSuccess("Login realizado com sucesso!");
        
        // Aguarda um pouco antes de navegar para mostrar a mensagem
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    } catch (error) {
      console.error("Erro completo:", error);
      
      if (error.code === "ERR_NETWORK") {
        setError("Erro de conexão. Verifique se o servidor está rodando.");
      } else if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);
        
        const message = typeof error.response.data === 'string' 
          ? error.response.data 
          : error.response.data?.message || 
            error.response.data?.error || 
            "Credenciais inválidas";
        setError(message);
      } else {
        setError("Erro inesperado. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-box">
        <img 
          src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1764390583/Spotify_logo_with_text.svg_mg0kr2.webp" 
          alt="Spotify" 
          className="logo"
        />

        <h1 className="auth-title">Faça Login para começar a ouvir</h1>

        <div className="auth-form">
          <div className="form-group">
            <label htmlFor="email">E-mail ou nome de usuário</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail ou nome de usuário"
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
              placeholder="Senha"
              className="form-input"
            />
          </div>

          <div className="remember-me">
            <label>
              <input type="checkbox" />
              <span>Lembrar de mim</span>
            </label>
          </div>

          <button onClick={handleLogin} className="btn-primary">
            Entrar
          </button>
        </div>

        <a href="#" className="forgot-password">Esqueceu sua senha?</a>

        <div className="divider">
          <span>OU</span>
        </div>

        <button className="btn-social btn-google">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuar com o Google
        </button>

        <div className="footer-link">
          <span className="text-muted">Não tem uma conta? </span>
          <a href="/register">Inscrever-se no Spotify</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;