package br.com.caio.spotify.application.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.caio.spotify.application.entities.Album;
import jakarta.transaction.Transactional;

@Repository
public interface AlbumRepository extends JpaRepository<Album, String> {
    
    // Otimizado com JOIN FETCH
    @Query("SELECT a FROM Album a " +
           "LEFT JOIN FETCH a.artistsNames " +
           "LEFT JOIN FETCH a.musicsNames " +
           "WHERE a.id = :id")
    Optional<Album> findByIdCustom(@Param("id") String id);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM tb_user_favorite_albums WHERE albums_id = :albumId", nativeQuery = true)
    void removeAlbumFromAllFavorites(@Param("albumId") String albumId);
}