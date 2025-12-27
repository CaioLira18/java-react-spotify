package br.com.caio.spotify.application.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.caio.spotify.application.entities.Album;
import br.com.caio.spotify.application.entities.Artists;
import br.com.caio.spotify.application.entities.Music;
import br.com.caio.spotify.application.repositories.AlbumRepository;
import br.com.caio.spotify.application.repositories.ArtistRepository;
import br.com.caio.spotify.application.repositories.MusicRepository;

@Service
public class AlbumService {

    @Autowired
    private AlbumRepository albumRepository;

    @Autowired
    private ArtistRepository artistRepository;

    @Autowired
    private MusicRepository musicRepository;

    public List<Album> findAll() {
        return albumRepository.findAll();
    }

    public Optional<Album> findPlaylistById(String id) {
        return albumRepository.findById(id);
    }

    public Album createAlbum(Album album, List<String> artistsIds, List<String> musicsIds) {
        List<Artists> artists = artistRepository.findAllById(artistsIds);
        List<Music> musics = musicRepository.findAllById(musicsIds);

        album.setArtistsNames(artists);
        album.setMusicsNames(musics);
        return albumRepository.save(album); // Agora salvará sem erros de duplicidade
    }

    public Optional<Album> updateAlbum(String id, Album updatedAlbum, List<String> artistsIds,
            List<String> songsIds) {
        return albumRepository.findById(id).map(item -> {
            List<Artists> artists = artistRepository.findAllById(artistsIds);
            List<Music> musics = musicRepository.findAllById(songsIds);

            item.setName(updatedAlbum.getName());
            item.setCover(updatedAlbum.getCover());
            item.setDuration(updatedAlbum.getDuration());
            item.setType(updatedAlbum.getType());
            item.setYear(updatedAlbum.getYear());
            item.setArtistsNames(artists);
            item.setMusicsNames(musics);

            return albumRepository.save(item);
        });
    }

    public boolean deleteAlbum(String id) {
        return albumRepository.findById(id).map(item -> {
            albumRepository.delete(item);
            return true;
        }).orElse(false);
    }

    public Optional<Album> addMusicToAlbum(String musicId, String albumId) {
        return musicRepository.findById(musicId)
                .flatMap(music -> albumRepository.findById(albumId).map(playlist -> {
                    playlist.getMusicsNames().add(music);
                    return albumRepository.save(playlist);
                }));
    }

    public Optional<Album> removeMusicFromAlbum(String musicId, String albumId) {
        return musicRepository.findById(musicId)
                .flatMap(music -> albumRepository.findById(albumId).map(playlist -> {
                    playlist.getMusicsNames().remove(music);
                    return albumRepository.save(playlist);
                }));
    }
}
