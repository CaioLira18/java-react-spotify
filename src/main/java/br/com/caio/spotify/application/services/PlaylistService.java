package br.com.caio.spotify.application.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.caio.spotify.application.entities.Music;
import br.com.caio.spotify.application.entities.Playlist;
import br.com.caio.spotify.application.repositories.MusicRepository;
import br.com.caio.spotify.application.repositories.PlaylistRepository;

@Service
public class PlaylistService {

    @Autowired
    private PlaylistRepository playlistRepository;

    @Autowired
    private MusicRepository musicRepository;

    public List<Playlist> findAll() {
        return playlistRepository.findAll();
    }

    public Optional<Playlist> findPlaylistById(String id) {
        return playlistRepository.findById(id);
    }

    public Playlist createPlaylist(Playlist playlist, List<String> musicsIds) {
        List<Music> musics = musicRepository.findAllById(musicsIds);

        playlist.setMusicsNames(musics);
        return playlistRepository.save(playlist); // Agora salvará sem erros de duplicidade
    }

    public Optional<Playlist> updatePlaylist(String id, Playlist updatedPlaylist, List<String> songsIds) {
        return playlistRepository.findById(id).map(item -> {
            
            List<Music> musics = (songsIds != null && !songsIds.isEmpty())
                    ? musicRepository.findAllById(songsIds)
                    : new ArrayList<>();

            item.setName(updatedPlaylist.getName());
            item.setCover(updatedPlaylist.getCover());
            item.setDescription(updatedPlaylist.getDescription());
            item.setType(updatedPlaylist.getType());
            item.setStatus(updatedPlaylist.getStatus());
            item.setYear(updatedPlaylist.getYear());
            item.setMusicsNames(musics);

            return playlistRepository.save(item);
        });
    }

    public boolean deletePlaylist(String id) {
        return playlistRepository.findById(id).map(item -> {
            playlistRepository.removePlaylistFromAllFavorites(id);
            playlistRepository.delete(item);
            return true;
        }).orElse(false);
    }

    public Optional<Playlist> addMusicToPlaylist(String musicId, String playlistId) {
        return musicRepository.findById(musicId)
                .flatMap(music -> playlistRepository.findById(playlistId).map(playlist -> {
                    playlist.getMusicsNames().add(music);
                    return playlistRepository.save(playlist);
                }));
    }

    public Optional<Playlist> removeMusicFromPlaylist(String musicId, String playlistId) {
        return musicRepository.findById(musicId)
                .flatMap(music -> playlistRepository.findById(playlistId).map(playlist -> {
                    playlist.getMusicsNames().remove(music);
                    return playlistRepository.save(playlist);
                }));
    }
}
