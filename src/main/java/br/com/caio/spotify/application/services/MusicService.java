package br.com.caio.spotify.application.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.caio.spotify.application.entities.Artists;
import br.com.caio.spotify.application.entities.Music;
import br.com.caio.spotify.application.repositories.ArtistRepository;
import br.com.caio.spotify.application.repositories.MusicRepository;

@Service
public class MusicService {

    @Autowired
    private MusicRepository musicRepository;

    @Autowired
    private ArtistRepository artistRepository;

    public List<Music> findAll() {
        return musicRepository.findAll();
    }

    public Optional<Music> findMusicById(String id) {
        return musicRepository.findById(id);
    }

    public Music createMusic(Music music, List<String> artistsIds) {
        List<Artists> artists = artistRepository.findAllById(artistsIds);
        music.setArtistsNames(artists);
        return musicRepository.save(music);
    }

    public Optional<Music> updateMusic(String id, Music updatedMusic, List<String> artistsIds) {
        return musicRepository.findById(id).map(item -> {
            item.setName(updatedMusic.getName());
            item.setDuration(updatedMusic.getDuration());
            item.setCover(updatedMusic.getCover());
            item.setType(updatedMusic.getType());
            item.setStatus(updatedMusic.getStatus());
            item.setMusicUrl(updatedMusic.getMusicUrl());

            if (artistsIds != null) {
                List<Artists> artists = artistRepository.findAllById(artistsIds);
                item.setArtistsNames(artists);
            }

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
