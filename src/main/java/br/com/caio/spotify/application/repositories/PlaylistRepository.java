package br.com.caio.spotify.application.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.caio.spotify.application.entities.Playlist;
import jakarta.transaction.Transactional;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, String> {

    @Query("SELECT p FROM Playlist p LEFT JOIN FETCH p.musicsNames WHERE p.id = :id")
    Optional<Playlist> findByIdCustom(@Param("id") String id);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM tb_user_favorite_playlists WHERE playlist_id = :playlistId", nativeQuery = true)
    void removePlaylistFromAllFavorites(@Param("playlistId") String playlistId);
}