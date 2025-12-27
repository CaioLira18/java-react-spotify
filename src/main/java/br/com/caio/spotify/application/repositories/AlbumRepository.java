package br.com.caio.spotify.application.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.caio.spotify.application.entities.Album;


@Repository
public interface AlbumRepository extends  JpaRepository<Album, String> {
    Optional<Album> findAllById(String id);
}
