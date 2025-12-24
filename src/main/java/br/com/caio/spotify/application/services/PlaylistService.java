package br.com.caio.spotify.application.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.caio.spotify.application.entities.Artists;
import br.com.caio.spotify.application.entities.Music;
import br.com.caio.spotify.application.entities.Playlist;
import br.com.caio.spotify.application.repositories.ArtistRepository;
import br.com.caio.spotify.application.repositories.MusicRepository;
import br.com.caio.spotify.application.repositories.PlaylistRepository;

@Service
public class PlaylistService {

    @Autowired
    private PlaylistRepository playlistRepository;

    @Autowired
    private ArtistRepository artistRepository;

    @Autowired
    private MusicRepository musicRepository;

    public List<Playlist> findAll() {
        return playlistRepository.findAll();
    }

    public Optional<Playlist> findPlaylistById(String id) {
        return playlistRepository.findById(id);
    }

    public Playlist createPlaylist(Playlist playlist, List<String> artistsIds, List<String> musicsIds) {
        List<Artists> artists = artistRepository.findAllById(artistsIds);
        List<Music> musics = musicRepository.findAllById(musicsIds);

        playlist.setArtistsNames(artists);
        playlist.setMusicsNames(musics);
        return playlistRepository.save(playlist);
    }

    public Optional<Playlist> updatePlaylist(String id, Playlist updatedPlaylist, List<String> artistsIds,
            List<String> songsIds) {
        return playlistRepository.findById(id).map(item -> {
            List<Artists> artists = artistRepository.findAllById(artistsIds);
            List<Music> musics = musicRepository.findAllById(songsIds);

            item.setName(updatedPlaylist.getName());
            item.setCover(updatedPlaylist.getCover());
            item.setDuration(updatedPlaylist.getDuration());
            item.setType(updatedPlaylist.getType());
            item.setYear(updatedPlaylist.getYear());
            item.setArtistsNames(artists);
            item.setMusicsNames(musics);

            return playlistRepository.save(item);
        });
    }

    public boolean deletePlaylist(String id) {
        return playlistRepository.findById(id).map(item -> {
            playlistRepository.delete(item);
            return true;
        }).orElse(false);
    }
}
