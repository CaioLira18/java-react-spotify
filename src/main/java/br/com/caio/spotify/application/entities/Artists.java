package br.com.caio.spotify.application.entities;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="tb_artistas")
@Getter
@Setter
public class Artists {
    
    @Id
    @GeneratedValue(strategy=GenerationType.UUID)
    private String id;

    private String name;
    private String profilePhoto;
    private String bannerPhoto;
    private String description;

    @OneToMany
    private List<Music> musicas;

    
}
