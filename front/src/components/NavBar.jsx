import React, { useEffect, useState } from 'react'

const NavBar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState('');
  const [idUser, setUserId] = useState('');
  const [users, setUsers] = useState([]);
  const API_URL = "http://localhost:8080/api";

      useEffect(() => {
        fetch(`${API_URL}/users`)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Erro ao buscar Usuarios.");
            }
            return response.json();
          })
          .then((data) => setUsers(data))
          .catch((error) => {
            console.error(error);
            alert("Erro ao buscar Usuarios.");
          });
      }, []);
  


useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      setIsAuthenticated(true);
      setIsAdmin(parsedUser.role === 'ADMIN');
      setName(parsedUser.name || '');
      setUserId(parsedUser.id || '');
    } catch (err) {
      console.error("Erro ao processar usuário do localStorage", err);
    }
  }
}, []);

async function handleLogout() {
  localStorage.removeItem('user');
  setIsAuthenticated(false);
}


return (
  <div>
    <div className="navBarContainer">
      <div className="navBarBox">
        <div className="optionsNavBar">
          <a href="/"><i class="fa-solid fa-angle-left"></i></a>
          <i class="fa-solid fa-angle-right"></i>
        </div>
        <div className="logoBox">
          <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1764390583/Spotify_logo_with_text.svg_mg0kr2.webp" alt="" />
        </div>
        {!isAuthenticated && (
          <div className="loginBox">
            <i class="fa-solid fa-user"></i>
            <a href="/login"><h2>Login</h2></a>
          </div>
        )}
        {isAuthenticated && (
          <div className="userBox">
            <div className="userImage">
              <img
                src={
                  users.find(user => user.id === idUser)?.image ||
                  "https://res.cloudinary.com/dthgw4q5d/image/upload/v1766771462/user-solid-full_hixynk.svg"
                }
                alt="Sem foto"
              />
            </div>
            <div className="logout" onClick={handleLogout}>
              <i class="fa-solid fa-right-from-bracket"></i>
            </div>
            {isAdmin && (
              <div className="adminButton">
                <a href="/adminPage"><button>Pagina de Admin</button></a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
)
}

export default NavBar
