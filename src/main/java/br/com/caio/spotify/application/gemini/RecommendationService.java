package br.com.caio.spotify.application.gemini;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import br.com.caio.spotify.application.dto.MixRecommendationDTO;
import br.com.caio.spotify.application.entities.Music;
import br.com.caio.spotify.application.entities.User;
import br.com.caio.spotify.application.entities.enums.StyleMusic;
import br.com.caio.spotify.application.repositories.MusicRepository;
import br.com.caio.spotify.application.repositories.UserRepository;

@Service
public class RecommendationService {

    private final ChatClient chatClient;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MusicRepository musicRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public RecommendationService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public List<Object> generateUserMixes(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        List<Music> favorites = user.getListMusic();

        String favoritesInfo = favorites.stream()
                .map(m -> m.getName() + " (Gênero: " + m.getStyle() + ")")
                .collect(Collectors.joining(", "));

        String prompt = """
            Com base nestas músicas favoritas: %s.
            Sugira 3 mixes de músicas.
            Responda APENAS um JSON no seguinte formato de lista:
            [
              {"title": "Nome do Mix", "styles": ["POP", "ROCK"], "startYear": "2010", "endYear": "2020"},
              ...
            ]
            Use apenas os estilos: %s.
            """.formatted(favoritesInfo, Arrays.toString(StyleMusic.values()));

        try {
            String jsonResponse = chatClient.prompt(prompt).call().content();

            List<MixRecommendationDTO> recommendations = objectMapper.readValue(
                jsonResponse, 
                new TypeReference<List<MixRecommendationDTO>>() {}
            );

            return recommendations.stream().map(rec -> {
                List<Music> musics = musicRepository.findTop20ByStyleInAndYearBetween(
                    rec.getStyles(), 
                    rec.getStartYear(), 
                    rec.getEndYear()
                );
                
                return new Object() {
                    public String title = rec.getTitle();
                    public List<Music> songs = musics;
                };
            }).collect(Collectors.toList());

        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar mixes com IA: " + e.getMessage());
        }
    }
}