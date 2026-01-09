package br.com.caio.spotify.application.entities;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import br.com.caio.spotify.application.entities.enums.UserEnum;
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
@Table(name = "tb_users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String name;
    private String image;
    private String email;
    private String password;
    private UserEnum role;

    /**
     * Lista de Músicas Favoritadas
     */
    @ManyToMany
    @JoinTable(name = "tb_user_favorite_musics", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "music_id"))
    private List<Music> listMusic = new ArrayList<>();

    /**
     * Lista de Artistas Favoritos
     */
    @ManyToMany
    @JoinTable(name = "tb_user_favorite_artists", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "artist_id"))
    private Set<Artists> listArtists = new HashSet<>();
    
    /**
     * Lista de Albums Favoritos
     */
    @ManyToMany
    @JoinTable(name = "tb_user_favorite_albums", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "albums_id"))
    private List<Album> listAlbums = new ArrayList<>();

    /**
     * Lista de Albums Favoritos
     */
    @ManyToMany
    @JoinTable(name = "tb_user_favorite_playlists", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "playlist_id"))
    private List<Playlist> listPlaylists = new ArrayList<>();

    public List<Music> getListMusic() {
        return listMusic;
    }

    public void setListMusic(List<Music> listMusic) {
        this.listMusic = listMusic;
    }

    


}