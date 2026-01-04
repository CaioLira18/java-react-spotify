package br.com.caio.spotify.application.controllers;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/spotify/playlist")
public class SpotifyAPI {

    private final String RAPID_API_URL = "https://spotify23.p.rapidapi.com/playlist";
    private final String API_KEY = "b3230055fdmsh2bc2187765ce3f5p185965jsn519e425c38a1";
    private final String API_HOST = "spotify23.p.rapidapi.com";

    // Cache simples para não estourar a cota de requisições (Quota/Rate Limit)
    private final Map<String, String> playlistCache = new ConcurrentHashMap<>();

    @GetMapping("/{id}")
    public ResponseEntity<String> getPlaylist(@PathVariable String id) {
        // 1. Verifica se a resposta já está no Cache
        if (playlistCache.containsKey(id)) {
            System.out.println("Retornando dados do Cache para a playlist: " + id);
            return ResponseEntity.ok(playlistCache.get(id));
        }

        RestTemplate restTemplate = new RestTemplate();

        // 2. Configuração dos Headers conforme o RapidAPI
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-rapidapi-key", API_KEY);
        headers.set("x-rapidapi-host", API_HOST);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            // Montagem da URL com Query Parameter
            String url = RAPID_API_URL + "/?id=" + id;

            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    String.class);

            // 3. Salva no Cache se a requisição for bem-sucedida
            if (response.getStatusCode() == HttpStatus.OK) {
                playlistCache.put(id, response.getBody());
            }

            return response;

        } catch (HttpClientErrorException.TooManyRequests e) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body("Erro: Limite de requisições do RapidAPI excedido (429). Aguarde alguns instantes ou verifique sua cota.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao buscar playlist: " + e.getMessage());
        }
    }

    // Adicione este endpoint para buscar ouvintes reais
    @GetMapping("/artist-overview/{id}")
    public ResponseEntity<String> getArtistOverview(@PathVariable String id) {
        // 1. Verifica cache (evita chamadas repetidas ao RapidAPI)
        if (playlistCache.containsKey("overview-" + id)) {
            return ResponseEntity.ok(playlistCache.get("overview-" + id));
        }

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-rapidapi-key", API_KEY);
        headers.set("x-rapidapi-host", API_HOST);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            // Endpoint que contém monthlyListeners
            String url = "https://spotify23.p.rapidapi.com/artist_overview/?id=" + id;

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                playlistCache.put("overview-" + id, response.getBody());
            }
            return response;

        } catch (HttpClientErrorException.TooManyRequests e) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body("{\"error\": \"Cota esgotada no RapidAPI\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}