import React from 'react'

const NavBar = () => {
  return (
    <div>
      <div className="navBarContainer">
        <div className="navBarBox">
            <div className="logoBox">
                <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1764390583/Spotify_logo_with_text.svg_mg0kr2.webp" alt="" />
            </div>
            <div className="loginBox">
                <i class="fa-solid fa-user"></i>
                <a href="/login"><h2>Login</h2></a>
            </div>
        </div>
      </div>
    </div>
  )
}

export default NavBar
