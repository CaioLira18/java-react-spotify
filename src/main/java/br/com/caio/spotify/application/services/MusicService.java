package br.com.caio.spotify.application.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.caio.spotify.application.entities.Music;
import br.com.caio.spotify.application.repositories.MusicRepository;

@Service
public class MusicService {

    @Autowired
    private MusicRepository musicRepository;

    public List<Music> findAll() {
        return musicRepository.findAll();
    }

    public Optional<Music> findMusicById(String id) {
        return musicRepository.findById(id);
    }

    public Music createMusic(Music music) {
        return musicRepository.save(music);
    }

    public Optional<Music> updateMusic(String id, Music updatedMusic) {
        return musicRepository.findById(id).map(item -> {
            item.setName(updatedMusic.getName());
            item.setArtistName(updatedMusic.getArtistName());
            item.setDuration(updatedMusic.getDuration());
            item.setCover(updatedMusic.getCover());
            item.setType(updatedMusic.getType());
            item.setMusicUrl(updatedMusic.getMusicUrl());
            return musicRepository.save(item);
        });
    }

    public boolean deleteMusic(String id) {
        return musicRepository.findById(id).map(item -> {
            musicRepository.delete(item);
            return true;
        }).orElse(false);
    }
}