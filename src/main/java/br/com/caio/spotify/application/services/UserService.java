package br.com.caio.spotify.application.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.com.caio.spotify.application.entities.User;
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
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        return userRepository.save(user);
    }

    public Optional<User> updateItem(String id, User updatedItem) {
        return userRepository.findById(id).map(item -> {
            item.setName(updatedItem.getName());
            item.setEmail(updatedItem.getEmail());
            item.setPassword(updatedItem.getPassword());
            item.setImage(updatedItem.getImage());
            item.setRole(updatedItem.getRole());
            item.setListMusic(updatedItem.getListMusic());
            item.setListArtists(updatedItem.getListArtists());
            item.setListPlaylists(updatedItem.getListPlaylists());

            if (!updatedItem.getPassword().equals(item.getPassword())) {
                item.setPassword(passwordEncoder.encode(updatedItem.getPassword()));
            }
            return userRepository.save(item);
        });
    }

    public boolean deleteItem(String id) {
        return userRepository.findById(id).map(item -> {
            userRepository.delete(item);
            return true;
        }).orElse(false);
    }

    // Adicionar música aos favoritos
    public Optional<User> addMusicToFavorites(String userId, String musicId) {
        return userRepository.findById(userId).flatMap(user -> 
            musicRepository.findById(musicId).map(music -> {
                if (!user.getListMusic().contains(music)) {
                    user.getListMusic().add(music);
                    return userRepository.save(user);
                }
                return user;
            })
        );
    }

    // Remover música dos favoritos
    public Optional<User> removeMusicFromFavorites(String userId, String musicId) {
        return userRepository.findById(userId).flatMap(user -> 
            musicRepository.findById(musicId).map(music -> {
                user.getListMusic().remove(music);
                return userRepository.save(user);
            })
        );
    }

    // Adicionar playlist aos favoritos
    public Optional<User> addPlaylistToFavorites(String userId, String playlistId) {
        return userRepository.findById(userId).flatMap(user -> 
            playlistRepository.findById(playlistId).map(playlist -> {
                if (!user.getListPlaylists().contains(playlist)) {
                    user.getListPlaylists().add(playlist);
                    return userRepository.save(user);
                }
                return user;
            })
        );
    }

    // Remover playlist dos favoritos
    public Optional<User> removePlaylistFromFavorites(String userId, String playlistId) {
        return userRepository.findById(userId).flatMap(user -> 
            playlistRepository.findById(playlistId).map(playlist -> {
                user.getListPlaylists().remove(playlist);
                return userRepository.save(user);
            })
        );
    }

    // Adicionar artista aos favoritos
    public Optional<User> addArtistToFavorites(String userId, String artistId) {
        return userRepository.findById(userId).flatMap(user -> 
            artistsRepository.findById(artistId).map(artist -> {
                if (!user.getListArtists().contains(artist)) {
                    user.getListArtists().add(artist);
                    return userRepository.save(user);
                }
                return user;
            })
        );
    }

    // Remover artista dos favoritos
    public Optional<User> removeArtistFromFavorites(String userId, String artistId) {
        return userRepository.findById(userId).flatMap(user -> 
            artistsRepository.findById(artistId).map(artist -> {
                user.getListArtists().remove(artist);
                return userRepository.save(user);
            })
        );
    }
}