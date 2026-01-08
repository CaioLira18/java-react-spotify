import React, { useEffect, useState } from "react";
import { usePlayer } from "../components/PlayerContext"; // Importe o seu novo contexto

const MusicPlayer = () => {
    // Consumindo estados e a referência de áudio global do Contexto
    const { 
        playlist, 
        currentIndex, 
        setCurrentIndex, 
        isPlaying, 
        togglePlay, 
        audioRef 
    } = usePlayer();

    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [shuffle, setShuffle] = useState(false);
    const [repeat, setRepeat] = useState(false);

    const currentSong = playlist[currentIndex];

    useEffect(() => {
        const audio = audioRef.current;

        // Atualiza o progresso visual sem interromper o áudio
        const updateTime = () => setProgress(audio.currentTime);
        const updateMetadata = () => setDuration(audio.duration);
        const handleEnded = () => {
            if (repeat) {
                audio.currentTime = 0;
                audio.play();
            } else {
                handleNext();
            }
        };

        // Adiciona listeners diretamente à instância global de áudio
        audio.addEventListener("timeupdate", updateTime);
        audio.addEventListener("loadedmetadata", updateMetadata);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", updateTime);
            audio.removeEventListener("loadedmetadata", updateMetadata);
            audio.removeEventListener("ended", handleEnded);
        };
    }, [currentIndex, repeat, playlist]); // Re-executa se a música ou modo de repetição mudar

    const handleSeek = (e) => {
        const time = Number(e.target.value);
        audioRef.current.currentTime = time;
        setProgress(time);
    };

    const handleVolume = (e) => {
        const vol = Number(e.target.value);
        setVolume(vol);
        audioRef.current.volume = vol;
    };

    const handleNext = () => {
        if (shuffle) {
            const randomIndex = Math.floor(Math.random() * playlist.length);
            setCurrentIndex(randomIndex);
        } else {
            setCurrentIndex((prev) => (prev + 1 < playlist.length ? prev + 1 : 0));
        }
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 >= 0 ? prev - 1 : playlist.length - 1));
    };

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60).toString().padStart(2, "0");
        return `${min}:${sec}`;
    };

    if (!currentSong) return null;

    return (
        <div className="spotify-player">
            {/* LADO ESQUERDO: INFO DA MÚSICA */}
            <div className="player-left">
                <img src={currentSong.cover} alt={currentSong.name} />
                <div>
                    <strong>{currentSong.name}</strong>
                    <p>{currentSong.artistsNames?.map(artist => artist.name).join(', ')}</p>
                </div>
            </div>

            {/* CENTRO: CONTROLES DE REPRODUÇÃO */}
            <div className="player-center">
                <div style={{ display: "flex", gap: 12, justifyContent: "center", alignItems: "center" }}>
                    <button 
                        onClick={() => setShuffle(!shuffle)} 
                        className={shuffle ? "active-btn" : ""}
                    >
                        <i className="fa-solid fa-shuffle"></i>
                    </button>

                    <button onClick={handlePrev}><i className="fa-solid fa-backward-fast"></i></button>

                    <button onClick={togglePlay} className="play-pause-btn">
                        {isPlaying ? <i className="fa-solid fa-pause"></i> : <i className="fa-solid fa-play"></i>}
                    </button>

                    <button onClick={handleNext}><i className="fa-solid fa-forward-fast"></i></button>

                    <button 
                        className={repeat ? "active-btn" : ""} 
                        onClick={() => setRepeat(!repeat)}
                    >
                        <i className="fa-solid fa-repeat"></i>
                    </button>
                </div>

                <div className="progress">
                    <span>{formatTime(progress)}</span>
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={progress}
                        onChange={handleSeek}
                    />
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            {/* LADO DIREITO: VOLUME */}
            <div className="volume" style={{ width: "30%", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px" }}>
                <i className="fa-solid fa-volume-high"></i>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolume}
                />
            </div>
        </div>
    );
};

export default MusicPlayer;