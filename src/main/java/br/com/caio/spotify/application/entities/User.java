package br.com.caio.spotify.application.entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import br.com.caio.spotify.application.entities.enums.UserEnum;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "tb_users")
public class User {
    
    @Id
    @GeneratedValue(strategy=GenerationType.UUID)
    private String id;

    private String name;
    private String image;
    private String email;
    private String password;
    private UserEnum role;

    /**
     * Lista de Musicas Favoritadas
    */
    @OneToMany(mappedBy="id")
    @JsonIgnore
    private List<Music> listMusic;

    /**
     * Lista de Artistas Favoritos
    */
    @OneToMany(mappedBy="id")
    @JsonIgnore
    private List<Artists> listArtists;

    /**
     * Lista de Playlists Favoritos
    */
    @OneToMany(mappedBy="id")
    @JsonIgnore
    private List<Playlist> listPlaylists;
}
