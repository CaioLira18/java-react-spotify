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
import br.com.caio.spotify.application.dto.RecommendationResponseDTO;
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

    /**
     * Gera mixes personalizados baseados nos favoritos do usuário.
     * Alterado de List<Object> para List<RecommendationResponseDTO> para corrigir o erro de compilação.
     */
    public List<RecommendationResponseDTO> generateUserMixes(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        List<Music> favorites = user.getListMusic();

        // Transforma a lista de favoritos em uma string para enviar ao prompt da IA
        String favoritesInfo = favorites.stream()
                .map(m -> m.getName() + " (Gênero: " + m.getStyle() + ")")
                .collect(Collectors.joining(", "));

        String prompt = """
                Analise as músicas favoritas do usuário: %s.
                Gere 3 sugestões de mixes temáticos.
                Retorne ESTRITAMENTE um array JSON seguindo este modelo, sem textos adicionais:
                [
                  {"title": "Mix Relaxante", "styles": ["POP"], "startYear": "2015", "endYear": "2024"}
                ]
                Estilos permitidos: %s.
                """.formatted(favoritesInfo, Arrays.toString(StyleMusic.values()));

        try {
            // Chamada à API do Gemini
            String jsonResponse = chatClient.prompt(prompt).call().content();

            // Mapeia o JSON retornado pela IA para uma lista de DTOs de recomendação
            List<MixRecommendationDTO> recommendations = objectMapper.readValue(
                    jsonResponse,
                    new TypeReference<List<MixRecommendationDTO>>() {
                    });

            // Para cada recomendação da IA, busca as músicas reais no banco de dados
            return recommendations.stream().map(rec -> {
                List<Music> musics = musicRepository.findTop20ByStyleInAndYearBetween(
                        rec.getStyles(),
                        rec.getStartYear(),
                        rec.getEndYear());

                // Retorna a instância correta do DTO usando o construtor com argumentos
                // Isso resolve o erro "List<Object> cannot be converted to List<RecommendationResponseDTO>"
                return new RecommendationResponseDTO(rec.getTitle(), musics);
                
            }).collect(Collectors.toList());

        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar mixes com IA: " + e.getMessage());
        }
    }
}