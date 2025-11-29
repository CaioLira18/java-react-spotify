package br.com.caio.spotify.application.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.caio.spotify.application.entities.Artists;

@Repository
public interface ArtistRepository extends JpaRepository<Artists, String> {
    
}
