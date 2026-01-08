package br.com.caio.spotify.application.dto;

import java.util.List;

import br.com.caio.spotify.application.entities.Music;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RecommendationResponseDTO {
    private String title;
    private List<Music> songs;
}