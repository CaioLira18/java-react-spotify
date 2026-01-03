package br.com.caio.spotify.application.services;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

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
        // Usando o método otimizado que criamos no repository
        return albumRepository.findByIdCustom(id);
    }

    public Album createAlbum(Album album, List<String> artistsIds, List<String> musicsIds) {
        // Convertendo as buscas para Set
        Set<Artists> artists = new HashSet<>(artistRepository.findAllById(artistsIds));
        Set<Music> musics = new HashSet<>(musicRepository.findAllById(musicsIds));

        album.setArtistsNames(artists);
        album.setMusicsNames(musics);
        return albumRepository.save(album); 
    }

    public Optional<Album> updateAlbum(String id, Album updatedAlbum, List<String> artistsIds, List<String> songsIds) {
        return albumRepository.findById(id).map(item -> {
            Set<Artists> artists = (artistsIds != null && !artistsIds.isEmpty())
                    ? new HashSet<>(artistRepository.findAllById(artistsIds))
                    : new HashSet<>();

            Set<Music> musics = (songsIds != null && !songsIds.isEmpty())
                    ? new HashSet<>(musicRepository.findAllById(songsIds))
                    : new HashSet<>();

            item.setName(updatedAlbum.getName());
            item.setCover(updatedAlbum.getCover());
            item.setDuration(updatedAlbum.getDuration());
            item.setType(updatedAlbum.getType());
            item.setStatus(updatedAlbum.getStatus());
            item.setYear(updatedAlbum.getYear());
            item.setArtistsNames(artists); // Corrigido para usar a lista buscada
            item.setMusicsNames(musics);

            return albumRepository.save(item);
        });
    }

    public boolean deleteAlbum(String id) {
        return albumRepository.findById(id).map(item -> {
            albumRepository.removeAlbumFromAllFavorites(id);
            albumRepository.delete(item);
            return true;
        }).orElse(false);
    }

    public Optional<Album> addMusicToAlbum(String musicId, String albumId) {
        return musicRepository.findById(musicId)
                .flatMap(music -> albumRepository.findById(albumId).map(album -> {
                    album.getMusicsNames().add(music);
                    return albumRepository.save(album);
                }));
    }

    public Optional<Album> removeMusicFromAlbum(String musicId, String albumId) {
        return musicRepository.findById(musicId)
                .flatMap(music -> albumRepository.findById(albumId).map(album -> {
                    album.getMusicsNames().remove(music);
                    return albumRepository.save(album);
                }));
    }
}