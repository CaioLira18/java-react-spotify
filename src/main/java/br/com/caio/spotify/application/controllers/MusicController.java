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

import br.com.caio.spotify.application.entities.Music;
import br.com.caio.spotify.application.services.MusicService;



@RestController
@CrossOrigin(origins = {
    "http://localhost:5173",
})
@RequestMapping("/api/songs")
public class MusicController {

    @Autowired
    private MusicService musicService;

    @GetMapping
    public ResponseEntity<List<Music>> getAllItems() {
        return ResponseEntity.ok(musicService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Music> getItemById(@PathVariable String id) {
        Optional<Music> music = musicService.findMusicById(id);
        return music.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Music> createItem(@RequestBody Music music) {
        return ResponseEntity.ok(musicService.createMusic(music));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Music> updateItem(@PathVariable String id, @RequestBody Music music) {
        Optional<Music> updatedItem = musicService.updateMusic(id, music);
        return updatedItem.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable String id) {
        boolean deleted = musicService.deleteMusic(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}