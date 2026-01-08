import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
    const audioRef = useRef(new Audio());
    const [playlist, setPlaylist] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        if (currentIndex !== null && playlist[currentIndex]) {
            const newSrc = playlist[currentIndex].musicUrl;
            
            // SÓ troca a fonte e dá play se a música for realmente diferente da atual
            if (audio.src !== newSrc) {
                audio.src = newSrc;
                audio.play().catch(err => console.log("Erro ao reproduzir:", err));
                setIsPlaying(true);
            }
        }
    }, [currentIndex, playlist]);

    const togglePlay = () => {
        if (isPlaying) audioRef.current.pause();
        else audioRef.current.play();
        setIsPlaying(!isPlaying);
    };

    return (
        <PlayerContext.Provider value={{ 
            playlist, setPlaylist, 
            currentIndex, setCurrentIndex, 
            isPlaying, setIsPlaying, togglePlay,
            audioRef 
        }}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => useContext(PlayerContext);