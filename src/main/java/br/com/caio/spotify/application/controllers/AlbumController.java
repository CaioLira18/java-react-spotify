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

import br.com.caio.spotify.application.dto.AlbumRequestDTO;
import br.com.caio.spotify.application.entities.Album;
import br.com.caio.spotify.application.services.AlbumService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/albums")
public class AlbumController {

    @Autowired
    private AlbumService albumService;

    @GetMapping
    public ResponseEntity<List<Album>> getAllItems() {
        return ResponseEntity.ok(albumService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Album> getItemById(@PathVariable String id) {
        Optional<Album> playlist = albumService.findPlaylistById(id);
        return playlist.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Em PlaylistController.java
    @PostMapping
    public ResponseEntity<Album> createPlaylist(@RequestBody AlbumRequestDTO dto) {
        Album playlist = new Album();
        playlist.setName(dto.getName());
        playlist.setDuration(dto.getDuration());
        playlist.setCover(dto.getCover());
        playlist.setType(dto.getType());
        playlist.setStatus(dto.getStatus());
        playlist.setYear(dto.getYear()); // Verifique se o DTO e a Entity têm esse campo

        return ResponseEntity.ok(
                albumService.createAlbum(playlist, dto.getArtistsIds(), dto.getSongsIds()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Album> updateItem(
            @PathVariable String id,
            @RequestBody AlbumRequestDTO dto) {

        Album playlist = new Album();

        playlist.setName(dto.getName());
        playlist.setDuration(dto.getDuration());
        playlist.setCover(dto.getCover());
        playlist.setType(dto.getType());
        playlist.setStatus(dto.getStatus());
        playlist.setYear(dto.getYear());

        Optional<Album> updatedItem = albumService.updateAlbum(id, playlist, dto.getArtistsIds(),
                dto.getSongsIds());

        return updatedItem.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable String id) {
        boolean deleted = albumService.deleteAlbum(id);
        return deleted
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    // Adicionar música à playlist
    @PostMapping("/{albumId}/music/{musicId}") // Corrigido o Path e a ordem
    public ResponseEntity<Album> addMusicToPlaylist(
            @PathVariable String albumId,
            @PathVariable String musicId) {
        Optional<Album> updatedPlaylist = albumService.addMusicToAlbum(musicId, albumId);
        return updatedPlaylist.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Remover música da playlist
    @DeleteMapping("/{albumId}/music/{musicId}") // Corrigido o Path e a ordem
    public ResponseEntity<Album> removeMusicFromPlaylist(
            @PathVariable String albumId,
            @PathVariable String musicId) {
        Optional<Album> updatedPlaylist = albumService.removeMusicFromAlbum(musicId, albumId);
        return updatedPlaylist.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}
