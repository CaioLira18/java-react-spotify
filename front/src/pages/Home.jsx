import { useEffect, useState } from "react";


const Home = () => {
    const [artistas, setArtistas] = useState([]);

    const API_URL = "http://localhost:8080/api";

    useEffect(() => {
        fetch(`${API_URL}/artistas`)
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
      <div className="containerArtists">
        <div className="artistsBox">
            <div className="imageArtist">
                <img src="" alt="" />
                <p>Artista</p>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Home
