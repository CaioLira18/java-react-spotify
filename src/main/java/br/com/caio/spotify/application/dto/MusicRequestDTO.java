package br.com.caio.spotify.application.dto;

import java.util.List;

import br.com.caio.spotify.application.entities.enums.ContentEnum;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MusicRequestDTO {

    private String name;
    private String duration;
    private String cover;
    private String musicUrl;
    private ContentEnum type;
    private List<String> artistsIds;
}
