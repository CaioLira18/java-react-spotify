package br.com.caio.spotify.application.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.caio.spotify.application.entities.Music;
import br.com.caio.spotify.application.entities.enums.StyleMusic;

@Repository
public interface MusicRepository extends JpaRepository<Music, String> {

    @Query("SELECT m FROM Music m LEFT JOIN FETCH m.artistsNames WHERE m.id = :id")
    Optional<Music> findByIdCustom(@Param("id") String id);

    @Modifying
    @Query(value = "DELETE FROM tb_user_favorite_musics WHERE music_id = :musicId", nativeQuery = true)
    void removeMusicFromAllFavorites(@Param("musicId") String musicId);

    @Modifying
    @Query(value = "DELETE FROM tb_album_musics WHERE music_id = :musicId", nativeQuery = true)
    void removeMusicFromAlbum(@Param("musicId") String musicId);

    List<Music> findTop20ByStyleInAndYearBetween(List<StyleMusic> styles, String startYear, String endYear);
}