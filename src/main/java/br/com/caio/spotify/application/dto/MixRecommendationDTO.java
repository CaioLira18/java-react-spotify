package br.com.caio.spotify.application.dto;

import java.util.List;

import br.com.caio.spotify.application.entities.enums.StyleMusic;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MixRecommendationDTO {
    private String title;
    private List<StyleMusic> styles; 
    private String startYear;
    private String endYear;
}
