import { useEffect, useState } from "react";
import { useOutletContext, Link } from 'react-router-dom';

const Home = () => {
    const API_URL = "http://localhost:8080/api";
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredSongs, setFilteredSongs] = useState([]);
    const [filteredArtists, setFilteredArtists] = useState([]);
    const [filteredAlbums, setFilteredAlbums] = useState([]);
    const [modalSearchHome, setModalSearchHome] = useState(false);
    
    const [songs, setSongs] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [artists, setArtists] = useState([]);

    // Importando do OutletContext (certifique-se que o nome é setPlaylist)
    const { setPlaylist, setCurrentIndex } = useOutletContext();

    useEffect(() => {
        // Busca de dados inicial
        Promise.all([
            fetch(`${API_URL}/artists`).then(res => res.json()),
            fetch(`${API_URL}/songs`).then(res => res.json()),
            fetch(`${API_URL}/albums`).then(res => res.json())
        ]).then(([artistsData, songsData, albumsData]) => {
            setArtists(artistsData);
            setSongs(songsData);
            setAlbums(albumsData);
        }).catch(err => console.error("Erro ao carrergar dados:", err));
    }, []);

    // Função de Play corrigida
    const handlePlay = (songToPlay, list) => {
        setPlaylist(list); // Define a lista atual como a fila do player
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

                {/* MODAL DE BUSCA CORRIGIDO */}
                {modalSearchHome && (
                    <div className="modalSearchHomeContainer">
                        <div className="modalSearchScroll">
                            {filteredArtists.length > 0 && (
                                <div className="searchSection">
                                    <h4>Artistas</h4>
                                    {filteredArtists.map(artist => (
                                        <Link to={`/artists/${artist.id}`} key={artist.id} className="artistHomeSearch">
                                            <img src={artist.profilePhoto} alt={artist.name} />
                                            <span>{artist.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {filteredSongs.length > 0 && (
                                <div className="searchSection">
                                    <h4>Músicas</h4>
                                    {filteredSongs.map(song => (
                                        <div key={song.id} className="songHomeSearch" onClick={() => handlePlay(song, filteredSongs)}>
                                            <img src={song.cover} alt={song.name} />
                                            <div className="songInfo">
                                                <span>{song.name}</span>
                                                <p>{song.artistsNames?.map(a => a.name).join(', ')}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {filteredAlbums.length > 0 && (
                                <div className="searchSection">
                                    <h4>Álbuns</h4>
                                    {filteredAlbums.map(album => (
                                        <Link to={`/albums/${album.id}`} key={album.id} className="albumHomeSearch">
                                            <img src={album.cover} alt={album.name} />
                                            <span>{album.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                            
                            {filteredArtists.length === 0 && filteredSongs.length === 0 && filteredAlbums.length === 0 && (
                                <p className="noResults">Nenhum resultado encontrado.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Restante do conteúdo (Artistas Populares) */}
            <div className="artistas">
                <h1>Artistas Populares</h1>
                <div className="containerArtists">
                    {artists.map((artista) => (
                        <div className="artistsBox" key={artista.id}>
                            <div className="imageArtist">
                                <img src={artista.profilePhoto} alt={artista.name} />
                            </div>
                            <div className="artistHomeInformation">
                                <strong><Link to={`/artists/${artista.id}`}>{artista.name}</Link></strong>
                                <p>Artista</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;