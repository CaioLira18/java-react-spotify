import React, { useEffect, useState } from 'react'

const Header = () => {

  const [songs, setSongs] = useState([]);
  const API_URL = "http://localhost:8080/api";
  const cont = 0;

  useEffect(() => {
    fetch(`${API_URL}/songs`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao buscar Artistas.");
        }
        return response.json();
      })
      .then((data) => setSongs(data))
      .catch((error) => {
        console.error(error);
        alert("Erro ao buscar Artistas.");
      });
  }, []);

  return (
    <div>
      <header>
        <div className="header">
          <div className="headerInformations">
            <div className="titleHeader">
              <i class="fa-solid fa-grip"></i>
              <h2>Sua Biblioteca</h2>
            </div>
          </div>
          <div className="othersOptions">
            <div className="otherOption">
              <h2>Playlist</h2>
            </div>
            <div className="otherOption">
              <h2>Podcast</h2>
            </div>
            <div className="otherOption">
              <h2>Album</h2>
            </div>
          </div>

          <div className="searchFilterOption">
            <div className="search">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input type="text" />
            </div>
            <div className="filter">
              <select name="" id="">
                <option value="">Recentes</option>
              </select>
              <i class="fa-solid fa-list"></i>
            </div>
          </div>

          {songs.map(song => (
            <div className="optionsHeader">
              <div className="boxOption">
                <div className="boxImage">
                  <img src={song.cover} alt="" />
                </div>
                <div className="boxInformations">
                  <a href="">{song.name}</a>
                  <p>{song.type === "MUSIC" ? 'Song' : 'Album'} - {song.artistsNames.map(artist => artist.name).join(', ')}</p>
                </div>
              </div>
            </div>
          ))}
          <div className="headerButtons">
            <div className="buttonHeader">
              <button><i class="fa-solid fa-plus"></i></button>
            </div>
            <div className="buttonHeader">
              <button><i class="fa-solid fa-plus"></i></button>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}

export default Header
