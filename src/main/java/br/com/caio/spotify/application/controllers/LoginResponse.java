package br.com.caio.spotify.application.controllers;

import br.com.caio.spotify.application.entities.enums.UserEnum;

public class LoginResponse {
    private String id;
    private String email;
    private String name;
    private UserEnum role;

    public LoginResponse(String id, String email, String name, UserEnum role) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
    }

    // Construtor padrão
    public LoginResponse() {
    }

    // Getters
    public String getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public UserEnum getRole() {
        return role;
    }

    // Setters
    public void setId(String id) {
        this.id = id;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setRole(UserEnum role) {
        this.role = role;
    }
}