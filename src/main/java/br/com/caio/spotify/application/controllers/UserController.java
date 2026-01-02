package br.com.caio.spotify.application.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.caio.spotify.application.entities.User;
import br.com.caio.spotify.application.services.UserService;

@RestController
@CrossOrigin(origins = {
    "http://localhost:5173",
})
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllItems() {
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getItemById(@PathVariable String id) {
        Optional<User> item = userService.findById(id);
        return item.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<User> createItem(@RequestBody User user) {
        return ResponseEntity.ok(userService.createItem(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateItem(@PathVariable String id, @RequestBody User user) {
        Optional<User> updatedItem = userService.updateItem(id, user);
        return updatedItem.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable String id) {
        boolean deleted = userService.deleteItem(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    // Adicionar música aos favoritos
    @PostMapping("/{userId}/favorites/music/{musicId}")
    public ResponseEntity<User> addMusicToFavorites(
            @PathVariable String userId, 
            @PathVariable String musicId) {
        Optional<User> updatedUser = userService.addMusicToFavorites(userId, musicId);
        return updatedUser.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Remover música dos favoritos
    @DeleteMapping("/{userId}/favorites/music/{musicId}")
    public ResponseEntity<User> removeMusicFromFavorites(
            @PathVariable String userId, 
            @PathVariable String musicId) {
        Optional<User> updatedUser = userService.removeMusicFromFavorites(userId, musicId);
        return updatedUser.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Adicionar playlist aos favoritos
    @PostMapping("/{userId}/favorites/album/{albumId}")
    public ResponseEntity<User> addAlbumToFavorites(
            @PathVariable String userId, 
            @PathVariable String albumId) {
        Optional<User> updatedUser = userService.addAlbumToFavorites(userId, albumId);
        return updatedUser.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Remover playlist dos favoritos
    @DeleteMapping("/{userId}/favorites/album/{albumId}")
    public ResponseEntity<User> removeAlbumFromFavorites(
            @PathVariable String userId, 
            @PathVariable String albumId) {
        Optional<User> updatedUser = userService.removeAlbumFromFavorites(userId, albumId);
        return updatedUser.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Adicionar artista aos favoritos
    @PostMapping("/{userId}/favorites/artist/{artistId}")
    public ResponseEntity<User> addArtistToFavorites(
            @PathVariable String userId, 
            @PathVariable String artistId) {
        Optional<User> updatedUser = userService.addArtistToFavorites(userId, artistId);
        return updatedUser.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Remover artista dos favoritos
    @DeleteMapping("/{userId}/favorites/artist/{artistId}")
    public ResponseEntity<User> removeArtistFromFavorites(
            @PathVariable String userId, 
            @PathVariable String artistId) {
        Optional<User> updatedUser = userService.removeArtistFromFavorites(userId, artistId);
        return updatedUser.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Adicionar playlist aos favoritos
    @PostMapping("/{userId}/favorites/playlist/{playlistId}")
    public ResponseEntity<User> addPlaylistToFavorites(
            @PathVariable String userId, 
            @PathVariable String playlistId) {
        Optional<User> updatedUser = userService.addPlaylistToFavorites(userId, playlistId);
        return updatedUser.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}