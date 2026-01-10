package br.com.caio.spotify.application.dto;

import java.util.List;

import br.com.caio.spotify.application.entities.enums.ContentEnum;
import br.com.caio.spotify.application.entities.enums.StatusMusic;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class AlbumRequestDTO {
    private String name;
    private String cover;
    private ContentEnum type;
    private StatusMusic status;
    private String year; 
    private List<String> artistsIds;
    private List<String> songsIds;

}