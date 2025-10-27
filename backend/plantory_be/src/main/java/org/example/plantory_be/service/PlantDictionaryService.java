package org.example.plantory_be.service;

import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.plantory_be.entity.PlantDictionary;
import org.example.plantory_be.repository.PlantDictionaryRepository;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
@RequiredArgsConstructor
public class PlantDictionaryService {

    private final PlantDictionaryRepository plantDictionaryRepository;

    @Value("${perenual.api.key}")
    private String apiKey;

    @Value("${perenual.api.base-url}")
    private String baseUrl;

    public List<PlantDictionary> getAllPlants() {
        return getOrFetchAllPlants();
    }

    public PlantDictionary getPlantByPerenualId(Long perenualId) {
        return plantDictionaryRepository.findByPerenualId(perenualId).orElse(null);
    }

    public List<PlantDictionary> getOrFetchAllPlants() {
        List<PlantDictionary> plants = plantDictionaryRepository.findAll();

        if (plants.isEmpty()) {
            log.info("[자동 호출] DB 비어있음 → Perenual species-list 호출 시작 (page=1)");
            long t0 = System.nanoTime();
            fetchAndSavePlants(5);
            long ms = (System.nanoTime() - t0) / 1_000_000;
            plants = plantDictionaryRepository.findAll();
            log.info("[자동 호출 완료] {}개 저장 ({} ms)", plants.size(), ms);
        } else {
            log.debug("[캐시 히트] DB에서 {}개 반환", plants.size());
        }

        return plants;
    }

    public PlantDictionary getOrFetchPlantByPerenualId(Long perenualId) {
        return plantDictionaryRepository.findByPerenualId(perenualId)
            .orElseGet(() -> {
                log.info("[자동 호출] perenualId={} 미존재 → details 호출 시작", perenualId);
                long t0 = System.nanoTime();

                PlantDictionary fetchedPlant = fetchSinglePlant(perenualId);
                if (fetchedPlant != null) {
                    plantDictionaryRepository.save(fetchedPlant);
                    long ms = (System.nanoTime() - t0) / 1_000_000;
                    log.info("[자동 저장 완료] perenualId={} ({} ms)", perenualId, ms);
                } else {
                    log.warn("[자동 호출 실패] perenualId={} : Perenual 응답 없음/파싱 실패", perenualId);
                }
                return fetchedPlant;
            });
    }

    private PlantDictionary fetchSinglePlant(Long perenualId) {
        RestTemplate restTemplate = new RestTemplate();
        String url = baseUrl + "/species/details/" + perenualId + "?key=" + apiKey;

        try {
            log.debug("[HTTP] GET {}", url);
            String response = restTemplate.getForObject(url, String.class);
            JSONObject json = new JSONObject(response);

            PlantDictionary plant = new PlantDictionary();
            plant.setPerenualId(perenualId);
            plant.setCommonName(json.optString("common_name", "Unknown"));

            if (json.has("scientific_name") && json.get("scientific_name") instanceof JSONArray) {
                plant.setScientificName(json.getJSONArray("scientific_name").optString(0, ""));
            } else {
                plant.setScientificName(json.optString("scientific_name", ""));
            }

            if (json.has("other_name") && json.get("other_name") instanceof JSONArray) {
                JSONArray otherNames = json.getJSONArray("other_name");
                plant.setOtherName(otherNames.length() > 0 ? otherNames.optString(0, "") : "");
            }

            if (json.has("default_image") && !json.isNull("default_image")) {
                JSONObject imageObj = json.getJSONObject("default_image");
                plant.setImageUrl(imageObj.optString("regular_url", ""));
            }

            return plant;
        } catch (Exception e) {
            log.error("단일 식물 API 호출/파싱 실패 perenualId={}: {}", perenualId, e.getMessage(), e);
            return null;
        }
    }

    public void fetchAndSavePlants(int maxPages) {
        RestTemplate restTemplate = new RestTemplate();

        int startPage = 5;

        for (int page = startPage; page < startPage + maxPages; page++) {
            String url = baseUrl + "/species-list?key=" + apiKey + "&page=" + page;
            log.info("[HTTP] GET {}", url);

            try {
                String response = restTemplate.getForObject(url, String.class);
                JSONObject json = new JSONObject(response);
                JSONArray dataArray = json.getJSONArray("data");

                if (dataArray.isEmpty()) {
                    log.info("더 이상 데이터 없음. page={}에서 중단", page);
                    break;
                }

                List<PlantDictionary> newPlants = new ArrayList<>();

                for (int i = 0; i < dataArray.length(); i++) {
                    JSONObject plantJson = dataArray.getJSONObject(i);
                    Long perenualId = (long) plantJson.getInt("id");

                    if (plantDictionaryRepository.findByPerenualId(perenualId).isPresent()) {
                        continue;
                    }

                    PlantDictionary plant = new PlantDictionary();
                    plant.setPerenualId(perenualId);
                    plant.setCommonName(plantJson.optString("common_name", "Unknown"));

                    if (plantJson.has("default_image") && !plantJson.isNull("default_image")) {
                        JSONObject imageObj = plantJson.getJSONObject("default_image");
                        plant.setImageUrl(imageObj.optString("regular_url", ""));
                    }

                    newPlants.add(plant);
                }

                plantDictionaryRepository.saveAll(newPlants);
                log.info("[page {}] {}개 저장 완료", page, newPlants.size());

            } catch (Exception e) {
                log.error("API 호출 실패 page={}: {}", page, e.getMessage());
                break;
            }
        }
    }


    public Page<PlantDictionary> getPlantsPage(int page, int size, String query) {
        Pageable pageable = PageRequest.of(page, size);

        if (query == null || query.trim().isEmpty()) {
            return plantDictionaryRepository.findAll(pageable);
        } else {
            return plantDictionaryRepository.searchPlants(query, pageable);
        }
    }

}
