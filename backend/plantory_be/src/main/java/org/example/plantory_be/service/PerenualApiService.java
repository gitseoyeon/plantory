package org.example.plantory_be.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class PerenualApiService {

    @Value("${perenual.api.key}")
    private String apiKey;

    private static final String BASE_URL = "https://perenual.com/api/species/details/";

    // 식물 ID 기반으로 상세 데이터 호출
    public String fetchPlantData(Long plantId) {
        String url = UriComponentsBuilder.fromHttpUrl(BASE_URL + plantId)
            .queryParam("key", apiKey)
            .toUriString();

        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForObject(url, String.class);
    }
}
