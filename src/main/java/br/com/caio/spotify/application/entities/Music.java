package br.com.caio.spotify.application.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name="tb_musicas")
public class Music {
    
    @Id
    private String id;

    private String name;
    private String duration;
    private String cover;
}
