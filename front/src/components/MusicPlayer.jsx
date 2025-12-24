import React, { useEffect, useRef, useState } from "react";

const MusicPlayer = ({ playlist = [], currentIndex, setCurrentIndex }) => {
    const audioRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [shuffle, setShuffle] = useState(false);
    const [repeat, setRepeat] = useState(false);

    const currentSong = playlist[currentIndex];

    useEffect(() => {
        if (!currentSong) return;

        if (audioRef.current) {
            audioRef.current.pause();
        }

        audioRef.current = new Audio(currentSong.musicUrl);
        audioRef.current.volume = volume;

        audioRef.current.onloadedmetadata = () => {
            setDuration(audioRef.current.duration);
        };

        audioRef.current.ontimeupdate = () => {
            setProgress(audioRef.current.currentTime);
        };

        audioRef.current.onended = () => {
            if (repeat) {
                audioRef.current.currentTime = 0;
                audioRef.current.play();
            } else {
                handleNext();
            }
        };

        audioRef.current.play();
        setIsPlaying(true);

        return () => audioRef.current?.pause();
    }, [currentIndex]);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }

        setIsPlaying(!isPlaying);
    };

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
            setCurrentIndex((prev) =>
                prev + 1 < playlist.length ? prev + 1 : 0
            );
        }
    };

    const handlePrev = () => {
        setCurrentIndex((prev) =>
            prev - 1 >= 0 ? prev - 1 : playlist.length - 1
        );
    };

    const formatTime = (time) => {
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60).toString().padStart(2, "0");
        return `${min}:${sec}`;
    };

    if (!currentSong) return null;

    return (
        <div className="spotify-player">
            {/* LEFT */}
            <div className="player-left">
                <img src={currentSong.cover} alt={currentSong.name} />
                <div>
                    <strong>{currentSong.name}</strong>
                    <p>{currentSong.artistsNames.map(artist => artist.name).join(', ')}</p>
                </div>
            </div>

            {/* CENTER */}
            <div className="player-center">
                <div style={{ display: "flex", gap: 12 }}>
                    <button onClick={() => setShuffle(!shuffle)}>
                        <i class="fa-solid fa-shuffle"></i>
                    </button>

                    <button onClick={handlePrev}><i class="fa-solid fa-backward-fast"></i></button>

                    <button onClick={togglePlay}>
                        {isPlaying ? <i class="fa-solid fa-pause"></i> : <i class="fa-solid fa-play"></i>}
                    </button>

                    <button onClick={handleNext}><i class="fa-solid fa-forward-fast"></i></button>

                    <button className="repeat-button active" onClick={() => setRepeat(!repeat)}>
                        <i class="fa-solid fa-repeat"></i>
                    </button>
                </div>

                <div className="progress">
                    <span>{formatTime(progress)}</span>
                    <input
                        type="range"
                        min="0"
                        max={duration}
                        value={progress}
                        onChange={handleSeek}
                    />
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            {/* RIGHT */}
            <div className="volume" style={{ width: "30%", display: "flex", justifyContent: "flex-end" }}>
                <i class="fa-solid fa-volume-high"></i>
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
