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

import br.com.caio.spotify.application.dto.PlaylistRequestDTO;
import br.com.caio.spotify.application.entities.Playlist;
import br.com.caio.spotify.application.services.PlaylistService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/playlists")
public class PlaylistController {

    @Autowired
    private PlaylistService playlistService;

    @GetMapping
    public ResponseEntity<List<Playlist>> getAllItems() {
        return ResponseEntity.ok(playlistService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Playlist> getItemById(@PathVariable String id) {
        Optional<Playlist> playlist = playlistService.findPlaylistById(id);
        return playlist.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Em PlaylistController.java
    @PostMapping
    public ResponseEntity<Playlist> createPlaylist(@RequestBody PlaylistRequestDTO dto) {
        Playlist playlist = new Playlist();
        playlist.setName(dto.getName());
        playlist.setDuration(dto.getDuration());
        playlist.setCover(dto.getCover());
        playlist.setType(dto.getType());
        playlist.setYear(dto.getYear()); // Verifique se o DTO e a Entity têm esse campo

        return ResponseEntity.ok(
                playlistService.createPlaylist(playlist, dto.getArtistsIds(), dto.getSongsIds()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Playlist> updateItem(
            @PathVariable String id,
            @RequestBody PlaylistRequestDTO dto) {

        Playlist playlist = new Playlist();

        playlist.setName(dto.getName());
        playlist.setDuration(dto.getDuration());
        playlist.setCover(dto.getCover());
        playlist.setType(dto.getType());
        playlist.setYear(dto.getYear());

        Optional<Playlist> updatedItem = playlistService.updatePlaylist(id, playlist, dto.getArtistsIds(),
                dto.getSongsIds());

        return updatedItem.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable String id) {
        boolean deleted = playlistService.deletePlaylist(id);
        return deleted
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    // Adicionar música à playlist
    @PostMapping("/{playlistId}/music/{musicId}") // Corrigido o Path e a ordem
    public ResponseEntity<Playlist> addMusicToPlaylist(
            @PathVariable String playlistId,
            @PathVariable String musicId) {
        Optional<Playlist> updatedPlaylist = playlistService.addMusicToPlaylist(musicId, playlistId);
        return updatedPlaylist.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Remover música da playlist
    @DeleteMapping("/{playlistId}/music/{musicId}") // Corrigido o Path e a ordem
    public ResponseEntity<Playlist> removeMusicFromPlaylist(
            @PathVariable String playlistId,
            @PathVariable String musicId) {
        Optional<Playlist> updatedPlaylist = playlistService.removeMusicFromPlaylist(musicId, playlistId);
        return updatedPlaylist.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}
