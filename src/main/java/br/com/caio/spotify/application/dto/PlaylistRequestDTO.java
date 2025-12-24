package br.com.caio.spotify.application.dto;

import java.util.List;

import br.com.caio.spotify.application.entities.enums.ContentEnum;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlaylistRequestDTO {

    private String name;
    private String cover;
    private String duration;
    private ContentEnum type;
    private List<String> artistsIds;
    private List<String> songsIds;
}
