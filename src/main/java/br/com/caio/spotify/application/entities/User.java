package br.com.caio.spotify.application.entities;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class User {
    
    @Id
    @GeneratedValue(strategy=GenerationType.UUID)
    private String id;

    private String name;
    private String email;
    private String password;

    /**
     * Lista de Musicas Favoritdas
    */
    @OneToMany(mappedBy="id")
    private List<Music> listMusic;
}
