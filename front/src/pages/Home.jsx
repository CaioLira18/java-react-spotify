import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import SlideHome from "../components/SlideHome";

const Home = () => {
    const API_URL = "http://localhost:8080/api";
    const [artistsOn, setArtistsOn] = useState([]);
    const [songs, setSongs] = useState([]);
    const [name, setName] = useState("");
    const [albums, setAlbums] = useState([]);
    const [artists, setArtists] = useState([]);
    const [playlists, setPlaylists] = useState([])

    const updateArtistsOnline = (allArtists) => {
        const online = allArtists.filter(artist => artist.status !== "OFF");
        setArtistsOn(online);
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user')

        if (!storedUser) return

        const parsedUser = JSON.parse(storedUser)

        fetch(`${API_URL}/users/${parsedUser.id}`)
            .then(res => {
                if (!res.ok) throw new Error("Erro ao buscar usuário")
                return res.json()
            })
            .then(userData => {
                setPlaylists(userData.listPlaylists || [])
                setAlbums(userData.listAlbums || [])
                setSongs(userData.listMusic || [])
                setName(parsedUser.name)

                localStorage.setItem('user', JSON.stringify(userData))
            })
            .catch(err => console.error(err))
    }, [])

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

    return (

        <div className="homeFlex">
            <SlideHome />
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

            <div className="secctionHomeContainer">
                <div className="secctionHomeBox">
                    <div className="secctionHomeHeader">
                        <h1>Suas Playlists</h1>
                        <p>Mostrar Tudo</p>
                    </div>

                    <div className="gridMyPlaylists">
                        {playlists.map((playlist) => (
                            <a href={`/playlists/${playlist.id}`}>
                            <div className="secctionHomeContent" key={playlist.id}>
                                <div className="secctionHomeContentImage">
                                    <img src={playlist.cover} alt={playlist.name} />
                                </div>
                                <div className="secctionHomeContainerArtists">
                                    <h4>{playlist.name}</h4>
                                    <p>De {name}</p>
                                </div>
                            </div>
                            </a>
                        ))}
                    </div>
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