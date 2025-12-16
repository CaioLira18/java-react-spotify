package br.com.caio.spotify.application.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.caio.spotify.application.entities.User;
import br.com.caio.spotify.application.repositories.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    public User createItem(User user) {
        return userRepository.save(user);
    }

    public Optional<User> updateItem(String id, User updatedItem) {
        return userRepository.findById(id).map(item -> {
            item.setName(updatedItem.getName());
            item.setEmail(updatedItem.getEmail());
            item.setListMusic(updatedItem.getListMusic());
            return userRepository.save(item);
        });
    }

    public boolean deleteItem(String id) {
        return userRepository.findById(id).map(item -> {
            userRepository.delete(item);
            return true;
        }).orElse(false);
    }
}