package br.com.caio.spotify.application.dto;

import java.util.List;

import br.com.caio.spotify.application.entities.enums.ContentEnum;
import br.com.caio.spotify.application.entities.enums.StatusMusic;
import br.com.caio.spotify.application.entities.enums.StyleMusic;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MusicRequestDTO {

    private String name;
    private String duration;
    private String cover;
    private String musicUrl;
    private String year;
    private ContentEnum type;
    private StatusMusic status;
    private StyleMusic style;
    private List<String> artistsIds;
}
