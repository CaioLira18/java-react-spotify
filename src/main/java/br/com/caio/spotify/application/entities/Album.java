package br.com.caio.spotify.application.entities;

import java.util.ArrayList;
import java.util.List;

import br.com.caio.spotify.application.entities.enums.ContentEnum;
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
@Table(name = "tb_playlists")
public class Album {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String name;
    private String cover;
    private String duration;
    private String year;
    private ContentEnum type;

    @ManyToMany 
    @JoinTable(name = "tb_playlist_artists", joinColumns = @JoinColumn(name = "playlist_id"), inverseJoinColumns = @JoinColumn(name = "artist_id"))
    private List<Artists> artistsNames = new ArrayList<>(); // Inicialize a lista

    @ManyToMany 
    @JoinTable(name = "tb_playlist_musics", joinColumns = @JoinColumn(name = "playlist_id"), inverseJoinColumns = @JoinColumn(name = "music_id"))
    private List<Music> musicsNames = new ArrayList<>(); // Inicialize a lista

}
