import React, { useEffect, useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import MusicaModal from '../components/Modal/MusicaModal';
import Toast from '../components/Modal/Toast';

const ArtistPage = () => {
    const { id } = useParams();
    const { setPlaylist, setCurrentIndex } = useOutletContext();

    // Dados locais
    const [artistaLocal, setArtistaLocal] = useState(null);
    const [songs, setSongs] = useState([]);
    const [albums, setAlbums] = useState([]);

    // Spotify
    const [spotifyData, setSpotifyData] = useState(null);
    const [ouvintes, setOuvintes] = useState('---');

    // UI
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedSong, setSelectedSong] = useState(null);
    const [toasts, setToasts] = useState([]);

    const API_URL = 'http://localhost:8080/api';

    // 🔹 Dados locais
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const res = await fetch(`${API_URL}/artists/${id}`);
                const data = await res.json();
                setArtistaLocal(data);

                const [resS, resA] = await Promise.all([
                    fetch(`${API_URL}/songs`),
                    fetch(`${API_URL}/albums`)
                ]);

                setSongs(await resS.json());
                setAlbums(await resA.json());
            } catch (err) {
                console.error('Erro ao carregar dados locais:', err);
            }
        };

        if (id) fetchInitialData();
    }, [id]);

    // 🔹 Spotify
    useEffect(() => {
        const fetchSpotifyInfo = async () => {
            if (!artistaLocal?.name) return;

            try {
                const res = await fetch(
                    `${API_URL}/spotify/listeners-by-name/${encodeURIComponent(artistaLocal.name)}`
                );

                if (!res.ok) return;

                const json = await res.json();
                const artistInfo = json?.data?.artist;

                if (artistInfo) {
                    setSpotifyData(artistInfo);

                    if (artistInfo.stats?.monthlyListeners) {
                        setOuvintes(
                            artistInfo.stats.monthlyListeners.toLocaleString('pt-BR')
                        );
                    }
                }
            } catch (err) {
                console.error('Erro ao integrar com Spotify:', err);
            }
        };

        fetchSpotifyInfo();
    }, [artistaLocal]);

    if (!artistaLocal) {
        return <div className="loading">Carregando perfil...</div>;
    }

    // 🔹 Músicas do artista
    const artistSongs = songs.filter(s =>
        s.artistsNames?.some(a => a.name === artistaLocal.name)
    );

    // 🔹 Banner URL
    const bannerUrl =
        spotifyData?.visuals?.headerImage?.sources?.[0]?.url || 
        artistaLocal.bannerPhoto;

    // 🔹 Discografia Spotify
    const spotifyAlbums =
        spotifyData?.discography?.popularReleases?.items
            ?.flatMap(item => item.releases?.items || []) || [];

    return (
        <>
            <div className="artist-individual-container">
                {/* BANNER COM GRADIENTE */}
                <div className="artist-header">
                    {bannerUrl && <img src={bannerUrl} alt={artistaLocal.name} />}
                </div>

                {/* INFORMAÇÕES DO ARTISTA (SOBRE O BANNER) */}
                <div className="artistInformation">
                    <div className="verificy">
                        <i className="fa-solid fa-certificate"></i>
                        <p>
                            {spotifyData?.profile?.verified
                                ? 'Artista Verificado'
                                : 'Artista'}
                        </p>
                    </div>

                    <h1>{artistaLocal.name}</h1>

                    <h2>
                        {ouvintes !== '---'
                            ? `${ouvintes} Ouvintes Mensais`
                            : 'Carregando ouvintes...'}
                    </h2>
                </div>

                {/* MÚSICAS */}
                <div className="songsContainer">
                    <h2 className="sectionTitle">Populares</h2>

                    {artistSongs.length > 0 ? artistSongs.map((song, index) => (
                        <div className="musicsArtistPage" key={song.id || index}>
                            <div
                                className="songContainer"
                                onClick={() => {
                                    setPlaylist(artistSongs);
                                    setCurrentIndex(index);
                                }}
                            >
                                <h4>{index + 1}</h4>
                                <img src={song.cover} alt={song.name} />

                                <div className="songInformation">
                                    <h4>{song.name}</h4>
                                    <p>
                                        {song.artistsNames
                                            ?.map(a => a.name)
                                            .join(', ')}
                                    </p>
                                </div>

                                <div className="otherInformation">
                                    <p>{song.duration}</p>
                                    <i
                                        className="fa-solid fa-ellipsis"
                                        onClick={e => {
                                            e.stopPropagation();
                                            setSelectedSong(song);
                                            setModalOpen(true);
                                        }}
                                    ></i>
                                </div>
                            </div>
                        </div>
                    )) : <p>Nenhuma música encontrada.</p>}
                </div>

                {/* DISCOGRAFIA SPOTIFY */}
                <div className="albumsContainer">
                    <h2 className="sectionTitle">Discografia</h2>

                    <div className="flexAlbums">
                        {spotifyAlbums.map((album, idx) => (
                            <div className="albumsArtistPage" key={album.id || idx}>
                                <div className="albumContainer">
                                    <img
                                        src={
                                            album.coverArt?.sources?.[0]?.url || 
                                            album.coverArt?.sources?.slice(-1)[0]?.url
                                        }
                                        alt={album.name}
                                    />

                                    <div className="albumInformation">
                                        <h4>{album.name}</h4>
                                        <p>
                                            Álbum • {album.date?.year || '—'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Toast
                toasts={toasts}
                removeToast={tid =>
                    setToasts(prev => prev.filter(t => t.id !== tid))
                }
            />

            {modalOpen && (
                <MusicaModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    song={selectedSong}
                />
            )}
        </>
    );
};

export default ArtistPage;