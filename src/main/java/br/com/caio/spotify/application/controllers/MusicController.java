package br.com.caio.spotify.application.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.caio.spotify.application.dto.MusicRequestDTO;
import br.com.caio.spotify.application.entities.Music;
import br.com.caio.spotify.application.services.MusicService;

@RestController
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
        return music.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Music> createItem(@RequestBody MusicRequestDTO dto) {
        Music music = new Music();
        music.setName(dto.getName());
        music.setDuration(dto.getDuration());
        music.setCover(dto.getCover());
        music.setMusicUrl(dto.getMusicUrl());
        music.setYear(dto.getYear());
        music.setType(dto.getType());
        music.setStatus(dto.getStatus());
        music.setStyle(dto.getStyle());

        return ResponseEntity.ok(
                musicService.createMusic(music, dto.getArtistsIds()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Music> updateItem(
            @PathVariable String id,
            @RequestBody MusicRequestDTO dto) {

        Music music = new Music();
        music.setName(dto.getName());
        music.setDuration(dto.getDuration());
        music.setCover(dto.getCover());
        music.setMusicUrl(dto.getMusicUrl());
        music.setType(dto.getType());
        music.setYear(dto.getYear());
        music.setStatus(dto.getStatus());
        music.setStyle(dto.getStyle());

        Optional<Music> updatedItem = musicService.updateMusic(id, music, dto.getArtistsIds());

        return updatedItem.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable String id) {
        try {
            boolean deleted = musicService.deleteMusic(id);
            if (deleted) {
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body("Erro ao deletar música: " + e.getMessage());
        }
    }
}
