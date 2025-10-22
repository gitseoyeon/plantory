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


    public List<PlantDictionary> getAllPlants() {
        return plantDictionaryRepository.findAll();
    }


    public PlantDictionary getPlantByPerenualId(Long perenualId) {
        return plantDictionaryRepository.findByPerenualId(perenualId).orElse(null);
    }

    // Perenual API 데이터 가져와 DB에 저장
    public void fetchAndSavePlants() {
        RestTemplate restTemplate = new RestTemplate();
        String url = baseUrl + "/species-list?key=" + apiKey + "&page=1"; // 1페이지만 테스트용

        String response = restTemplate.getForObject(url, String.class);
        JSONObject json = new JSONObject(response);
        JSONArray dataArray = json.getJSONArray("data");

        List<PlantDictionary> plants = new ArrayList<>();

        for (int i = 0; i < dataArray.length(); i++) {
            JSONObject plantJson = dataArray.getJSONObject(i);
            Long perenualId = Long.valueOf(plantJson.getInt("id"));

            // DB 중복 방지
            if (plantDictionaryRepository.findByPerenualId(perenualId).isPresent()) {
                continue;
            }

            PlantDictionary plant = new PlantDictionary();
            plant.setPerenualId(perenualId);
            plant.setCommonName(plantJson.optString("common_name", "Unknown"));


            plant.setScientificName(
                plantJson.has("scientific_name") && plantJson.get("scientific_name") instanceof JSONArray
                    ? plantJson.getJSONArray("scientific_name").optString(0, "")
                    : plantJson.optString("scientific_name", "")
            );


            plant.setOtherName(
                plantJson.has("other_name") && plantJson.get("other_name") instanceof JSONArray &&
                    plantJson.getJSONArray("other_name").length() > 0
                    ? plantJson.getJSONArray("other_name").optString(0, "")
                    : ""
            );


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
