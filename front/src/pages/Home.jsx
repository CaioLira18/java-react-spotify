import { useEffect, useState } from "react";
import { useOutletContext, Link } from 'react-router-dom';

const Home = () => {
    const API_URL = "http://localhost:8080/api";
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredSongs, setFilteredSongs] = useState([]);
    const [filteredArtists, setFilteredArtists] = useState([]);
    const [filteredAlbums, setFilteredAlbums] = useState([]);
    const [artistsOn, setArtistsOn] = useState([]);
    const [modalSearchHome, setModalSearchHome] = useState(false);

    const [songs, setSongs] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [artists, setArtists] = useState([]);

    const { setPlaylist, setCurrentIndex } = useOutletContext();

    // Corrigido: Agora filtra os objetos e atualiza o estado
    const updateArtistsOnline = (allArtists) => {
        const online = allArtists.filter(artist => artist.status !== "OFF");
        setArtistsOn(online);
    };

    useEffect(() => {
        Promise.all([
            fetch(`${API_URL}/artists`).then(res => res.json()),
            fetch(`${API_URL}/songs`).then(res => res.json()),
            fetch(`${API_URL}/albums`).then(res => res.json())
        ]).then(([artistsData, songsData, albumsData]) => {
            setArtists(artistsData);
            setSongs(songsData);
            setAlbums(albumsData);
            
            // Inicializa os artistas online logo após o fetch
            updateArtistsOnline(artistsData);
        }).catch(err => console.error("Erro ao carregar dados:", err));
    }, []);

    const handlePlay = (songToPlay, list) => {
        setPlaylist(list);
        const index = list.findIndex(s => s.id === songToPlay.id);
        setCurrentIndex(index !== -1 ? index : 0);
    };

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

    return (
        <div className="homeFlex">
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
                            {/* Artistas na busca */}
                            {filteredArtists.length > 0 && (
                                <div className="searchSection">
                                    {filteredArtists
                                        .filter(a => a.status !== "OFF")
                                        .map(artist => (
                                            <Link to={`/artists/${artist.id}`} key={artist.id} className="artistHomeSearch">
                                                <img src={artist.profilePhoto} alt={artist.name} />
                                                <span>{artist.name}</span>
                                            </Link>
                                        ))
                                    }
                                </div>
                            )}

                            {/* Músicas na busca */}
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

                            {/* Álbuns na busca */}
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

            <div className="artistas">
                <h1>Artistas Populares</h1>
                <div className="containerArtists">
                    {artistsOn.map((artista) => (
                        <div className="artistsBox" key={artista.id}>
                            <div className="imageArtist">
                                <img src={artista.profilePhoto} alt={artista.name} />
                                <i className="fa-solid fa-circle-play"></i>
                            </div>
                            <div className="artistHomeInformation">
                                <strong>
                                    <Link to={`/artists/${artista.id}`}>{artista.name}</Link>
                                </strong>
                                <p>Artista</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {artistsOn.length === 0 && (
                <div className="withoutArtists">
                    Sem Artistas Online
                </div>
            )}
        </div>
    );
}

export default Home;