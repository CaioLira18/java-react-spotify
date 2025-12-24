package br.com.caio.spotify.application.repositories;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import br.com.caio.spotify.application.entities.Playlist;


@Repository
public interface PlaylistRepository extends  JpaRepository<Playlist, String> {
    Optional<Playlist> findAllById(String id);
}
