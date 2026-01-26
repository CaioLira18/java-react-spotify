import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePlayer } from '../components/PlayerContext';

const NavBar = () => {
  const navigate = useNavigate();
  const { setPlaylist, setCurrentIndex } = usePlayer();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [idUser, setUserId] = useState('');
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("")

  // const API_URL = "http://localhost:8080/api";
  const API_URL = "https://java-react-spotify.onrender.com/api";

  const [searchTerm, setSearchTerm] = useState("");
  const [modalSearchHome, setModalSearchHome] = useState(false);
  const [modalProfile, setModalProfile] = useState(false);

  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);

  const [filteredSongs, setFilteredSongs] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);

  // Lógica de Busca
  function search(value) {
    setSearchTerm(value);

    if (!value.trim()) {
      setModalSearchHome(false);
      return;
    }

    setModalSearchHome(true);
    const lower = value.toLowerCase();

    setFilteredSongs(
      songs.filter(s => s.name.toLowerCase().includes(lower))
    );

    setFilteredArtists(
      artists.filter(a => a.name.toLowerCase().includes(lower) && a.status !== "OFF")
    );

    setFilteredAlbums(
      albums.filter(a => a.name.toLowerCase().includes(lower) && a.status !== "NOT_RELEASED")
    );
  }

  const handleModalProfileOpen = () => {
    setModalProfile(true);
  }

  const handleModalProfileClose = () => {
    setModalProfile(false);
  }

  const closeSearch = () => {
    setModalSearchHome(false);
    setSearchTerm("");
  };

  const playFromSearch = (song) => {
    setPlaylist([song]);
    setCurrentIndex(0);
    closeSearch();
  };

  useEffect(() => {
    fetch(`${API_URL}/users`)
      .then(res => res.json())
      .then(setUsers)
      .catch(err => console.error("Erro ao carregar usuários:", err));
  }, []);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/artists`).then(res => res.json()),
      fetch(`${API_URL}/songs`).then(res => res.json()),
      fetch(`${API_URL}/albums`).then(res => res.json())
    ])
      .then(([artistsData, songsData, albumsData]) => {
        setArtists(artistsData);
        setSongs(songsData);
        setAlbums(albumsData);
      })
      .catch(err => console.error("Erro ao carregar dados da busca:", err));
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;

    try {
      const user = JSON.parse(storedUser);
      setIsAuthenticated(true);
      setIsAdmin(user.role === 'ADMIN');
      setUserId(user.id || '');
      setName(user.name || '')
    } catch (err) {
      console.error("Erro ao ler usuário do localStorage", err);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate('/login');
  };

  return (
    <div className="navBarContainer">
      <div className="navBarBox">

        <div className="optionsNavBar">
          <a onClick={() => navigate(-1)} className="nav-arrow">
            <i className="fa-solid fa-angle-left"></i>
          </a>
          <a onClick={() => navigate(1)} className="nav-arrow">
            <i className="fa-solid fa-angle-right"></i>
          </a>
        </div>

        <div className="searchContainer">
          <div className="inputItemSearch">
            <Link to="/"><button className="home-btn"><i className="fa-solid fa-house"></i></button></Link>
            <input
              value={searchTerm}
              onChange={(e) => search(e.target.value)}
              placeholder="O que você quer ouvir hoje?"
              type="text"
            />
          </div>

          {modalSearchHome && (
            <div className="modalSearchHomeContainer">
              <div className="modalSearchScroll">

                {/* Resultados de Artistas */}
                {filteredArtists.map(artist => (
                  <Link
                    key={artist.id}
                    to={`/artists/${artist.id}`}
                    onClick={closeSearch}
                    className="artistHomeSearch"
                  >
                    <img src={artist.profilePhoto} alt={artist.name} />
                    <div className="columnArtist">
                      <span>{artist.name}</span>
                      <p>Artista</p>
                    </div>
                  </Link>
                ))}

                {/* Resultados de Músicas */}
                {filteredSongs.map(song => (
                  <div
                    key={song.id}
                    className="songHomeSearch"
                    onClick={() => playFromSearch(song)}
                  >
                    <img src={song.cover} alt={song.name} />
                    <div className="songInfo">
                      <span>{song.name}</span>
                      <p>Música • {song.artistsNames?.map(a => a.name).join(', ')}</p>
                    </div>
                  </div>
                ))}

                {/* Resultados de Álbuns */}
                {filteredAlbums.map(album => (
                  <Link
                    key={album.id}
                    to={`/albums/${album.id}`}
                    onClick={closeSearch}
                    className="albumHomeSearch"
                  >
                    <img src={album.cover} alt={album.name} />
                    <div className="songInfo">
                      <span>{album.name}</span>
                      <p>Álbum</p>
                    </div>
                  </Link>
                ))}

                {/* Fallback caso não encontre nada */}
                {filteredArtists.length === 0 &&
                  filteredSongs.length === 0 &&
                  filteredAlbums.length === 0 && (
                    <p className="noResults">Nenhum resultado encontrado.</p>
                  )}

              </div>
            </div>
          )}
        </div>

        <div className="navBarRight">
          {!isAuthenticated ? (
            <div className="loginBox">
              <i className="fa-solid fa-user"></i>
              <Link to="/login"><h2>Login</h2></Link>
            </div>
          ) : (
            <div className="userBox">
              <i className="fa-regular fa-bell"></i>

              <div className="userImage" onClick={handleModalProfileOpen}>
                <img
                  src={
                    users.find(u => u.id === idUser)?.image ||
                    "https://res.cloudinary.com/dthgw4q5d/image/upload/v1766771462/user-solid-full_hixynk.svg"
                  }
                  alt="User"
                />
              </div>

              {modalProfile && (
                <div className="modalProfileContainer">
                  {/* Overlay opcional para fechar ao clicar fora */}
                  <div className="modalOverlayHeader" onClick={handleModalProfileClose}></div>
                  <div className="modalProfileBox">
                    <Link onClick={handleModalProfileClose} to="/edit" className="modalItem">
                      <span><strong>{name}</strong></span>
                    </Link>
                    <div className="modalDivider"></div>
                    <Link onClick={handleModalProfileClose} to="/edit" className="modalItem">
                      <span>Editar Perfil</span>
                    </Link>
                    {isAdmin && (
                      <Link onClick={handleModalProfileClose} to="/adminPage" className="modalItem">
                        <span>Painel de Admin</span>
                      </Link>
                    )}
                    <Link onClick={handleModalProfileClose} className="modalItem">
                      <span>Fechar</span>
                    </Link>
                    <div className="modalDivider"></div>
                    <span className="modalItem" onClick={handleLogout}><strong>Sair</strong></span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;