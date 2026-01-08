package br.com.caio.spotify.application.controllers;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/spotify")
public class SpotifyController {

    private final String API_KEY = "b3230055fdmsh2bc2187765ce3f5p185965jsn519e425c38a1";
    private final String API_HOST = "spotify23.p.rapidapi.com";

    private final Map<String, String> albumCache = new ConcurrentHashMap<>();
    private final Map<String, String> artistCache = new ConcurrentHashMap<>();

    @GetMapping("/listeners-by-name/{name}")
    public ResponseEntity<?> getListenersByName(@PathVariable String name) {
        if (artistCache.containsKey(name.toLowerCase())) {
            return ResponseEntity.ok(artistCache.get(name.toLowerCase()));
        }

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-rapidapi-key", API_KEY);
        headers.set("x-rapidapi-host", API_HOST);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            String searchUrl = "https://spotify23.p.rapidapi.com/search/?q=" + name + "&type=artists&limit=1";
            ResponseEntity<Map> searchRes = restTemplate.exchange(searchUrl, HttpMethod.GET, entity, Map.class);

            Map body = searchRes.getBody();
            Map artists = (Map) body.get("artists");
            List<Map> items = (List<Map>) artists.get("items");

            if (items == null || items.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Artista não encontrado");
            }

            Map data = (Map) items.get(0).get("data");
            String uri = (String) data.get("uri");
            String spotifyId = uri.replace("spotify:artist:", "");

            String overviewUrl = "https://spotify23.p.rapidapi.com/artist_overview/?id=" + spotifyId;
            ResponseEntity<String> response = restTemplate.exchange(overviewUrl, HttpMethod.GET, entity, String.class);

            artistCache.put(name.toLowerCase(), response.getBody());
            return ResponseEntity.ok(response.getBody());

        } catch (Exception e) {
            e.printStackTrace(); 
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro no servidor: " + e.getMessage());
        }
    }

    @GetMapping("/album-by-id/{id}")
    public ResponseEntity<?> getAlbumById(@PathVariable String id) {
        String mockJson = "{"
            + "\"id\": \"" + id + "\","
            + "\"name\": \"Álbum (Modo Desenvolvimento)\","
            + "\"spotifyId\": \"" + id + "\","
            + "\"cover\": \"https://i.scdn.co/image/ab67616d0000b273735e0767c33658514860d892\","
            + "\"year\": \"2024\","
            + "\"artistsNames\": [{\"id\": \"1\", \"name\": \"Artista Simulado\"}],"
            + "\"musicsNames\": [],"
            + "\"albums\": [{" 
            + "  \"images\": [{\"url\": \"https://i.scdn.co/image/ab67616d0000b273735e0767c33658514860d892\"}],"
            + "  \"release_date\": \"2024-01-01\""
            + "}]"
            + "}";

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(mockJson);
    }
}