package br.com.caio.spotify.application.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
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

    @GetMapping("/listeners-by-name/{name}")
    public ResponseEntity<?> getListenersByName(@PathVariable String name) {

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("x-rapidapi-key", API_KEY);
        headers.set("x-rapidapi-host", API_HOST);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            // 1️⃣ Buscar artista pelo nome
            String searchUrl =
                "https://spotify23.p.rapidapi.com/search/?q=" + name + "&type=artists&limit=1";

            ResponseEntity<Map> searchRes =
                restTemplate.exchange(searchUrl, HttpMethod.GET, entity, Map.class);

            Map body = searchRes.getBody();
            if (body == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Resposta vazia do Spotify.");
            }

            Map artists = (Map) body.get("artists");
            List<Map> items = artists != null ? (List<Map>) artists.get("items") : null;

            if (items == null || items.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Artista não localizado.");
            }

            Map firstItem = items.get(0);

            String uri = null;
            if (firstItem.containsKey("data")) {
                Map dataNode = (Map) firstItem.get("data");
                uri = dataNode != null ? (String) dataNode.get("uri") : null;
            } else {
                uri = (String) firstItem.get("uri");
            }

            if (uri == null) {
                return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("URI do artista não encontrada.");
            }

            String spotifyId = uri.replace("spotify:artist:", "");

            // 2️⃣ Buscar overview do artista
            String overviewUrl =
                "https://spotify23.p.rapidapi.com/artist_overview/?id=" + spotifyId;

            ResponseEntity<String> spotifyResponse =
                restTemplate.exchange(overviewUrl, HttpMethod.GET, entity, String.class);

            // 🔥 RETORNO LIMPO (SEM HEADERS DA RAPIDAPI)
            return ResponseEntity
                .status(spotifyResponse.getStatusCode())
                .body(spotifyResponse.getBody());

        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erro ao integrar com Spotify: " + e.getMessage());
        }
    }
}
