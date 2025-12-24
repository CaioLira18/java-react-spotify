package br.com.caio.spotify.application.entities;

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
@Table(name = "tb_musicas")
public class Music {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private ContentEnum type;
    private String name;
    private String duration;
    private String cover;
    @ManyToMany
    @JoinTable(name = "tb_music_artists", joinColumns = @JoinColumn(name = "music_id"), inverseJoinColumns = @JoinColumn(name = "artist_id"))
    private List<Artists> artistsNames;

    private String musicUrl;
}
