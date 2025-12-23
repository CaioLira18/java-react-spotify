package br.com.caio.spotify.application.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.com.caio.spotify.application.entities.User;
import br.com.caio.spotify.application.repositories.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    public User createItem(User user) {
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        return userRepository.save(user);
    }

    public Optional<User> updateItem(String id, User updatedItem) {
        return userRepository.findById(id).map(item -> {
            item.setName(updatedItem.getName());
            item.setEmail(updatedItem.getEmail());
            item.setPassword(updatedItem.getPassword());
            item.setRole(updatedItem.getRole());
            item.setListMusic(updatedItem.getListMusic());

            if (!updatedItem.getPassword().equals(item.getPassword())) {
                item.setPassword(passwordEncoder.encode(updatedItem.getPassword()));
            }

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