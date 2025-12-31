package br.com.caio.spotify.application.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.caio.spotify.application.entities.Artists;
import br.com.caio.spotify.application.repositories.ArtistRepository;

@Service
public class ArtistService {

    @Autowired
    private ArtistRepository artistRepository;

    public List<Artists> findAll() {
        return artistRepository.findAll();
    }

    public Optional<Artists> findById(String id) {
        return artistRepository.findById(id);
    }

    public Artists createItem(Artists artist) {
        return artistRepository.save(artist);
    }

    public Optional<Artists> updateItem(String id, Artists updatedItem) {
        return artistRepository.findById(id).map(item -> {
            item.setName(updatedItem.getName());
            item.setBannerPhoto(updatedItem.getBannerPhoto());
            item.setProfilePhoto(updatedItem.getProfilePhoto());
            item.setDescription(updatedItem.getDescription());
            item.setMusicas(updatedItem.getMusicas());
            item.setStatus(updatedItem.getStatus());
            return artistRepository.save(item);
        });
    }

    public boolean deleteItem(String id) {
        return artistRepository.findById(id).map(item -> {
            artistRepository.delete(item);
            return true;
        }).orElse(false);
    }
}