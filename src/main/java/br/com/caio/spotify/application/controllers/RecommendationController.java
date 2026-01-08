package br.com.caio.spotify.application.controllers;

import br.com.caio.spotify.application.dto.RecommendationResponseDTO;
import br.com.caio.spotify.application.gemini.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "http://localhost:5173") 
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<RecommendationResponseDTO>> getAiMixes(@PathVariable String userId) {
        List<RecommendationResponseDTO> mixes = recommendationService.generateUserMixes(userId);
        return ResponseEntity.ok(mixes);
    }
}