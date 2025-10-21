package org.example.plantory_be.service;

import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.example.plantory_be.entity.PlantDictionary;
import org.example.plantory_be.repository.PlantDictionaryRepository;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class PlantDictionaryService {

    private final PlantDictionaryRepository plantDictionaryRepository;

    @Value("${perenual.api.key}")
    private String apiKey;

    @Value("${perenual.api.base-url}")
    private String baseUrl;

    // 전체 식물 목록 조회
    public List<PlantDictionary> getAllPlants() {
        return plantDictionaryRepository.findAll();
    }

    // Perenual API에서 데이터 받아와 DB에 저장하는 기능
    public void fetchAndSavePlants() {
        RestTemplate restTemplate = new RestTemplate();
        String url = baseUrl + "/species-list?key=" + apiKey + "&page=1"; // 1페이지만 테스트

        String response = restTemplate.getForObject(url, String.class);
        JSONObject json = new JSONObject(response);
        JSONArray dataArray = json.getJSONArray("data");

        List<PlantDictionary> plants = new ArrayList<>();

        for (int i = 0; i < dataArray.length(); i++) {
            JSONObject plantJson = dataArray.getJSONObject(i);

            PlantDictionary plant = new PlantDictionary();
            plant.setPerenualId(plantJson.getInt("id"));
            plant.setCommonName(plantJson.optString("common_name", "Unknown"));
            plant.setScientificName(plantJson.getJSONArray("scientific_name").optString(0, ""));
            plant.setOtherName(
                plantJson.has("other_name") && plantJson.getJSONArray("other_name").length() > 0
                    ? plantJson.getJSONArray("other_name").optString(0, "")
                    : ""
            );

            // 이미지 처리
            if (plantJson.has("default_image") && !plantJson.isNull("default_image")) {
                JSONObject imageObj = plantJson.getJSONObject("default_image");
                plant.setImageUrl(imageObj.optString("regular_url", ""));
            }

            plants.add(plant);
        }

        plantDictionaryRepository.saveAll(plants);
        System.out.println(plants.size() + "개 식물 저장 완료!");
    }
}
