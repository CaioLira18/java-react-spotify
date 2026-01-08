import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import SlideHome from "../components/SlideHome";

const Home = () => {
    const API_URL = "http://localhost:8080/api";
    const [artistsOn, setArtistsOn] = useState([]);
    const [name, setName] = useState("");
    const [playlists, setPlaylists] = useState([]);
    const [aiRecommendations, setAiRecommendations] = useState("");
    const [loadingAi, setLoadingAi] = useState(false);

    // Função para buscar recomendações da IA baseada no usuário
    const fetchAiRecommendations = async (userId) => {
        setLoadingAi(true);
        try {
            const res = await fetch(`${API_URL}/recommendations/${userId}`);
            if (res.ok) {
                const data = await res.text();
                setAiRecommendations(data);
            }
        } catch (err) {
            console.error("Erro ao buscar recomendações IA:", err);
        } finally {
            setLoadingAi(false);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;
        const parsedUser = JSON.parse(storedUser);

        // 1. Busca dados atualizados do Usuário e Recomendações
        fetch(`${API_URL}/users/${parsedUser.id}`)
            .then(res => res.json())
            .then(userData => {
                setPlaylists(userData.listPlaylists || []);
                setName(userData.name);
                localStorage.setItem('user', JSON.stringify(userData));

                // Dispara a IA assim que temos o ID do usuário
                fetchAiRecommendations(userData.id);
            })
            .catch(err => console.error("Erro User Fetch:", err));

        // 2. Busca Artistas Populares/Online
        fetch(`${API_URL}/artists`)
            .then(res => res.json())
            .then(artistsData => {
                const online = artistsData.filter(artist => artist.status !== "OFF");
                setArtistsOn(online);
            })
            .catch(err => console.error("Erro Artists Fetch:", err));
    }, []);

    return (
        <div className="homeFlex">
            <SlideHome />

            {/* Seção de Artistas */}
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

            {/* Seção de Playlists do Usuário */}
            <div className="secctionHomeContainer">
                <div className="secctionHomeBox">
                    <div className="secctionHomeHeader">
                        <h1>Suas Playlists</h1>
                        <Link to="/playlists"><p>Mostrar Tudo</p></Link>
                    </div>

                    <div className="gridMyPlaylists">
                        {playlists.map((playlist) => (
                            <Link to={`/playlists/${playlist.id}`} key={playlist.id} className="playlistLink">
                                <div className="secctionHomeContent">
                                    <div className="secctionHomeContentImage">
                                        <img src={playlist.cover} alt={playlist.name} />
                                    </div>
                                    <div className="secctionHomeContainerArtists">
                                        <h4>{playlist.name}</h4>
                                        <p>De {name}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Seção de Inteligência Artificial (Gemini) */}
            <div className="secctionHomeContainer">
                <div className="secctionHomeBox">
                    <div className="secctionHomeHeader">
                        <h1>✨ Seu Mix IA (Gemini)</h1>
                    </div>
                    <div className="aiBoxContent" style={{
                        background: 'linear-gradient(135deg, #1db95422, #191414)',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid #1db95444',
                        marginTop: '15px'
                    }}>
                        {loadingAi ? (
                            <div className="loaderIA">Gerando recomendações personalizadas...</div>
                        ) : (
                            <p style={{ color: '#e0e0e0', fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>
                                {aiRecommendations || "Comece a ouvir para habilitar as sugestões da IA."}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <div className="space"></div>


            {artistsOn.length === 0 && (
                <div className="withoutArtists">
                    Sem Artistas Online no momento.
                </div>
            )}
        </div>
    );
}

export default Home;