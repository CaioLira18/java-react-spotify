import React from 'react'

const Header = () => {
  return (
    <div>
      <header>
        <div className="header">
        <div className="headerInformations">
          <h2>Sua Biblioteca</h2>
          <div className="headerButtons">
            <div className="buttonHeader">
              <button><i class="fa-solid fa-plus"></i></button>
            </div>
            <div className="buttonHeader">
              <button><i class="fa-solid fa-plus"></i></button>
            </div>
          </div>
        </div>
        <div className="optionsHeader">
          <div className="boxOption">
            <div className="boxImage">
              <img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1764397364/ab67616d0000b273863856550e620740ad633d32_aovdtw.jpg" alt="" />
            </div>
            <div className="boxInformations">
              <a href="">Title</a>
              <p>Type - Artista</p>
            </div>
          </div>
        </div>
        </div>
      </header>
    </div>
  )
}

export default Header
