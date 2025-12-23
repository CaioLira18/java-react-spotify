import { useEffect, useState } from "react";
import Header from "../components/Header";

const Home = () => {
    const [artistas, setArtistas] = useState([]);
    const API_URL = "http://localhost:8080/api";

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [name, setName] = useState('');
   
   useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setIsAuthenticated(true);
        setIsAdmin(parsedUser.role === 'ADMIN');
        setName(parsedUser.name || '');
      } catch (err) {
        console.error("Erro ao processar usuário do localStorage", err);
      }
    }
  }, []);

    useEffect(() => {
        fetch(`${API_URL}/artists`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao buscar Artistas.");
                }
                return response.json();
            })
            .then((data) => setArtistas(data))
            .catch((error) => {
                console.error(error);
                alert("Erro ao buscar Artistas.");
            });
    }, []);

    return (
        <div>
            <div className="homeFlex">
                <div className="artistas">
                    <div className="informationHeaderArtistas">
                        <h1>Seus Artistas Favoritos</h1>
                    </div>

                    <div className="containerArtists">
                        {artistas.map((artista) => (
                            <div className="artistsBox" key={artista.id}>
                                <div className="imageArtist">
                                    <img src={artista.profilePhoto} alt={artista.name} />
                                    <i className="fa-solid fa-circle-play"></i>
                                </div>
                                <div className="artistHomeInformation">
                                    <strong><a href={`/artists/${artista.id}`} className="artistClass">{artista.name}</a></strong>
                                    <p>Artista</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;