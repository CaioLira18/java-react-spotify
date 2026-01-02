package br.com.caio.spotify.application.dto;

import java.util.List;

import br.com.caio.spotify.application.entities.enums.ContentEnum;
import br.com.caio.spotify.application.entities.enums.StatusMusic;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class PlaylistRequestDTO {
    private String name;
    private String description;
    private String cover;
    private String year; 
    private ContentEnum type;
    private StatusMusic status;
    private List<String> songsIds;

}