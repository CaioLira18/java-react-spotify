import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const NavBar = ({ setPlaylist, setCurrentIndex }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState('');
  const [idUser, setUserId] = useState('');
  const [users, setUsers] = useState([]);

  const API_URL = "http://localhost:8080/api";

  const [searchTerm, setSearchTerm] = useState("");
  const [modalSearchHome, setModalSearchHome] = useState(false);

  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);

  const [filteredSongs, setFilteredSongs] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);

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

  const closeSearch = () => setModalSearchHome(false);

  const handlePlay = (song, list) => {
    if (!setPlaylist || !setCurrentIndex) return;

    setPlaylist(list);
    const index = list.findIndex(s => s.id === song.id);
    setCurrentIndex(index !== -1 ? index : 0);
    closeSearch();
  };

  useEffect(() => {
    fetch(`${API_URL}/users`)
      .then(res => res.json())
      .then(setUsers)
      .catch(console.error);
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
      .catch(console.error);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;

    try {
      const user = JSON.parse(storedUser);
      setIsAuthenticated(true);
      setIsAdmin(user.role === 'ADMIN');
      setName(user.name || '');
      setUserId(user.id || '');
    } catch (err) {
      console.error("Erro ao ler usuário", err);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  return (
    <div>
      <div className="navBarContainer">
        <div className="navBarBox">

          <div className="optionsNavBar">
            <a href="/"><i className="fa-solid fa-angle-left"></i></a>
            <i className="fa-solid fa-angle-right"></i>
          </div>

          <div className="searchContainer">
            <div className="inputItemSearch">
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

                  {filteredSongs.map(song => (
                    <div
                      key={song.id}
                      className="songHomeSearch"
                      onClick={() => handlePlay(song, filteredSongs)}
                    >
                      <img src={song.cover} alt={song.name} />
                      <div className="songInfo">
                        <span>{song.name}</span>
                        <p>Song • {song.artistsNames?.map(a => a.name).join(', ')}</p>
                      </div>
                    </div>
                  ))}

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

                  {filteredArtists.length === 0 &&
                    filteredSongs.length === 0 &&
                    filteredAlbums.length === 0 && (
                      <p className="noResults">Nenhum resultado encontrado.</p>
                    )}

                </div>
              </div>
            )}
          </div>

          {!isAuthenticated && (
            <div className="loginBox">
              <i className="fa-solid fa-user"></i>
              <a href="/login"><h2>Login</h2></a>
            </div>
          )}

          {isAuthenticated && (
            <div className="userBox">
              <i className="fa-regular fa-bell"></i>

              <div className="userImage">
                <img
                  src={
                    users.find(u => u.id === idUser)?.image ||
                    "https://res.cloudinary.com/dthgw4q5d/image/upload/v1766771462/user-solid-full_hixynk.svg"
                  }
                  alt="User"
                />
              </div>

              <div className="logout" onClick={handleLogout}>
                <i className="fa-solid fa-right-from-bracket"></i>
              </div>

              {isAdmin && (
                <div className="adminButton">
                  <a href="/adminPage">
                    <button>Pagina de Admin</button>
                  </a>
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
