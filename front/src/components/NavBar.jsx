import React, { useEffect, useState } from 'react'

const NavBar = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setIsAuthenticated(true);
        setIsAdmin(parsedUser.role === 'ADMIN');
        setName(parsedUser.name || '');
      } catch (err) {
        console.error("Erro ao processar usuário do localStorage", err);
      }
    }
  }, []);

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
              <i class="fa-solid fa-user"></i>
              <h1>{name}</h1>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default NavBar
