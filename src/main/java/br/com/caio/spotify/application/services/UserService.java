package br.com.caio.spotify.application.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.com.caio.spotify.application.entities.User;
import br.com.caio.spotify.application.repositories.AlbumRepository;
import br.com.caio.spotify.application.repositories.ArtistRepository;
import br.com.caio.spotify.application.repositories.MusicRepository;
import br.com.caio.spotify.application.repositories.PlaylistRepository;
import br.com.caio.spotify.application.repositories.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private MusicRepository musicRepository;
    @Autowired
    private AlbumRepository albumRepository;
    @Autowired
    private PlaylistRepository playlistRepository;
    @Autowired
    private ArtistRepository artistsRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    public User createItem(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<User> updateItem(String id, User updatedItem) {
        return userRepository.findById(id).map(item -> {
            item.setName(updatedItem.getName());
            item.setEmail(updatedItem.getEmail());
            item.setImage(updatedItem.getImage());
            item.setRole(updatedItem.getRole());

            // Se as listas vierem no objeto, precisamos convertê-las/atualizá-las
            // cuidadosamente
            item.setListMusic(updatedItem.getListMusic());
            item.setListArtists(updatedItem.getListArtists());
            item.setListAlbums(updatedItem.getListAlbums());
            item.setListPlaylists(updatedItem.getListPlaylists());

            if (updatedItem.getPassword() != null && !updatedItem.getPassword().isEmpty()
                    && !passwordEncoder.matches(updatedItem.getPassword(), item.getPassword())) {
                item.setPassword(passwordEncoder.encode(updatedItem.getPassword()));
            }
            return userRepository.save(item);
        });
    }

    // Métodos de Favoritos (Exemplo de Música)
    public Optional<User> addMusicToFavorites(String userId, String musicId) {
        return userRepository.findById(userId).flatMap(user -> musicRepository.findById(musicId).map(music -> {
            user.getListMusic().add(music); // O Set já cuida de não duplicar
            return userRepository.save(user);
        }));
    }

    public Optional<User> removeMusicFromFavorites(String userId, String musicId) {
        return userRepository.findById(userId).flatMap(user -> musicRepository.findById(musicId).map(music -> {
            user.getListMusic().remove(music);
            return userRepository.save(user);
        }));
    }

    // Adicionar Album aos favoritos
    public Optional<User> addAlbumToFavorites(String userId, String albumId) {
        return userRepository.findById(userId).flatMap(user -> albumRepository.findById(albumId).map(album -> {
            user.getListAlbums().add(album);
            return userRepository.save(user);
        }));
    }

    // Remover Album dos favoritos
    public Optional<User> removeAlbumFromFavorites(String userId, String albumId) {
        return userRepository.findById(userId).flatMap(user -> albumRepository.findById(albumId).map(album -> {
            user.getListAlbums().remove(album);
            return userRepository.save(user);
        }));
    }

    // Adicionar Artista aos favoritos
    public Optional<User> addArtistToFavorites(String userId, String artistId) {
        return userRepository.findById(userId).flatMap(user -> artistsRepository.findById(artistId).map(artist -> {
            user.getListArtists().add(artist);
            return userRepository.save(user);
        }));
    }

    // Remover Artista dos favoritos
    public Optional<User> removeArtistFromFavorites(String userId, String artistId) {
        return userRepository.findById(userId).flatMap(user -> artistsRepository.findById(artistId).map(artist -> {
            user.getListArtists().remove(artist);
            return userRepository.save(user);
        }));
    }

    // Adicionar Playlist aos favoritos
    public Optional<User> addPlaylistToFavorites(String userId, String playlistId) {
        return userRepository.findById(userId).flatMap(user -> playlistRepository.findById(playlistId).map(playlist -> {
            user.getListPlaylists().add(playlist);
            return userRepository.save(user);
        }));
    }

    // Remover Playlist dos favoritos
    public Optional<User> removePlaylistFromFavorites(String userId, String playlistId) {
        return userRepository.findById(userId).flatMap(user -> playlistRepository.findById(playlistId).map(playlist -> {
            user.getListPlaylists().remove(playlist);
            return userRepository.save(user);
        }));
    }

    public boolean deleteItem(String id) {
        return userRepository.findById(id).map(item -> {
            userRepository.delete(item);
            return true;
        }).orElse(false);
    }
}
