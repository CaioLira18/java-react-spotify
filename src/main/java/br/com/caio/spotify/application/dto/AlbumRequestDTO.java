package br.com.caio.spotify.application.dto;

import java.util.List;

import br.com.caio.spotify.application.entities.enums.ContentEnum;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class AlbumRequestDTO {
    private String name;
    private String duration;
    private String cover;
    private ContentEnum type;
    private String year; 
    private List<String> artistsIds;
    private List<String> songsIds;

}