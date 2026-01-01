import React, { useEffect, useState } from 'react'
import { useOutletContext, Link } from 'react-router-dom';

const NavBar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState('');
  const [idUser, setUserId] = useState('');
  const [users, setUsers] = useState([]);
  const API_URL = "http://localhost:8080/api";
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [modalSearchHome, setModalSearchHome] = useState(false);
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [artistsOn, setArtistsOn] = useState([]);

  // CORREÇÃO 1: Evita o erro de "null" ao desestruturar
  const context = useOutletContext();
  const { setAlbum, setCurrentIndex } = context || {};

  function search(value) {
    setSearchTerm(value);
    if (!value.trim()) {
      setModalSearchHome(false);
      return;
    }

    setModalSearchHome(true);
    const lowerValue = value.toLowerCase();

    setFilteredSongs(songs.filter(s => s.name.toLowerCase().includes(lowerValue)));
    setFilteredArtists(artists.filter(a => a.name.toLowerCase().includes(lowerValue)));
    setFilteredAlbums(albums.filter(al => al.name.toLowerCase().includes(lowerValue)));
  }

  const updateArtistsOnline = (allArtists) => {
    const online = allArtists.filter(artist => artist.status !== "OFF");
    setArtistsOn(online);
  };

  const handlePlay = (songToPlay, list) => {
    // CORREÇÃO 2: Verifica se as funções existem antes de chamar
    if (setAlbum && setCurrentIndex) {
      setAlbum(list);
      const index = list.findIndex(s => s.id === songToPlay.id);
      setCurrentIndex(index !== -1 ? index : 0);
    } else {
      console.warn("Contexto de áudio não encontrado. O NavBar pode estar fora do Outlet.");
    }
  };

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
      });
  }, []);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/artists`).then(res => res.json()),
      fetch(`${API_URL}/songs`).then(res => res.json()),
      fetch(`${API_URL}/albums`).then(res => res.json())
    ]).then(([artistsData, songsData, albumsData]) => {
      setArtists(artistsData);
      setSongs(songsData);
      setAlbums(albumsData);

      updateArtistsOnline(artistsData);
    }).catch(err => console.error("Erro ao carregar dados:", err));
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
            <a href="/"><i className="fa-solid fa-angle-left"></i></a>
            <i className="fa-solid fa-angle-right"></i>
          </div>
          <div className="searchContainer">
            <div className="inputItemSearch">
              <input
                value={searchTerm}
                onChange={(e) => search(e.target.value)}
                placeholder='O que você quer ouvir hoje?'
                type="text"
              />
            </div>

            {modalSearchHome && (
              <div className="modalSearchHomeContainer">
                <div className="modalSearchScroll">
                  {filteredArtists.length > 0 && (
                    <div className="searchSection">
                      {filteredArtists
                        .filter(a => a.status !== "OFF")
                        .map(artist => (
                          <Link to={`/artists/${artist.id}`} key={artist.id} className="artistHomeSearch">
                            <img src={artist.profilePhoto} alt={artist.name} />
                            <div className='columnArtist'>
                              <span>{artist.name}</span>
                              <p>Artista</p>
                            </div>
                          </Link>
                        ))
                      }
                    </div>
                  )}

                  {filteredSongs.length > 0 && (
                    <div className="searchSection">
                      {filteredSongs
                        .filter(s => s.status !== "NOT_RELEASED")
                        .map(song => (
                          <div key={song.id} className="songHomeSearch" onClick={() => handlePlay(song, filteredSongs)}>
                            <img src={song.cover} alt={song.name} />
                            <div className="songInfo">
                              <span>{song.name}</span>
                              <p>Song • {song.artistsNames?.map(a => a.name).join(', ')}</p>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  )}

                  {filteredAlbums.length > 0 && (
                    <div className="searchSection">
                      {filteredAlbums
                        .filter(al => al.status !== "NOT_RELEASED")
                        .map(album => (
                          <Link to={`/albums/${album.id}`} key={album.id} className="albumHomeSearch">
                            <img src={album.cover} alt={album.name} />
                            <div className="songInfo">
                              <span>{album.name}</span>
                              <p>Álbum • {album.artistsNames?.map(a => a.name).join(', ')}</p>
                            </div>
                          </Link>
                        ))
                      }
                    </div>
                  )}

                  {filteredArtists.length === 0 && filteredSongs.length === 0 && filteredAlbums.length === 0 && (
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
                <i className="fa-solid fa-right-from-bracket"></i>
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

export default NavBar;