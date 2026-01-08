package br.com.caio.spotify.application.entities;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import br.com.caio.spotify.application.entities.enums.StatusArtist;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tb_artistas")
@Getter
@Setter
public class Artists {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String name;
    private String profilePhoto;
    private String bannerPhoto;
    private String description;

    private StatusArtist status;

    @ManyToMany(mappedBy = "artistsNames")
    @JsonIgnoreProperties({"artistsNames"})
    private Set<Music> musicas = new HashSet<>();

}
