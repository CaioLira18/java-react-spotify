package br.com.caio.spotify.application.entities;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import br.com.caio.spotify.application.entities.enums.ContentEnum;
import br.com.caio.spotify.application.entities.enums.StatusMusic;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "tb_albums")
public class Album {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String name;
    private String cover;
    private String duration;
    private String year;
    private ContentEnum type;
    private StatusMusic status;

    @ManyToMany
    @JsonIgnoreProperties({"listAlbums", "musicas"})
    @JoinTable(name = "tb_album_artists", joinColumns = @JoinColumn(name = "album_id"), inverseJoinColumns = @JoinColumn(name = "artist_id"))
    private Set<Artists> artistsNames = new HashSet<>();
    
    @ManyToMany
    @JoinTable(name = "tb_album_musics", joinColumns = @JoinColumn(name = "album_id"), inverseJoinColumns = @JoinColumn(name = "music_id"))
    private Set<Music> musicsNames = new HashSet<>(); 

}
