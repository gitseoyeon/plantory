package org.example.plantory_be.controller;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.example.plantory_be.entity.PlantDictionary;
import org.example.plantory_be.service.PlantDictionaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/plants")
@RequiredArgsConstructor
public class PlantDictionaryController {

    private final PlantDictionaryService plantDictionaryService;

    /**
     * 전체 식물 조회
     * DB가 비어 있으면 Perenual API 자동 호출 → 저장 후 반환
     */
    @GetMapping
    public List<PlantDictionary> getAllPlants() {
        return plantDictionaryService.getOrFetchAllPlants();
    }

    /**
     * Perenual ID 기준으로 특정 식물 조회
     * DB에 없으면 Perenual API 자동 호출 → 저장 후 반환
     */
    @GetMapping("/perenual/{perenualId}")
    public ResponseEntity<PlantDictionary> getPlantByPerenualId(@PathVariable Long perenualId) {
        PlantDictionary plant = plantDictionaryService.getOrFetchPlantByPerenualId(perenualId);
        if (plant != null) {
            return ResponseEntity.ok(plant);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Perenual API 데이터 수동 저장 (테스트용)
     * 호출 시 강제로 1페이지 데이터 저장
     */
    @GetMapping("/fetch")
    public String fetchAndSavePlants() {
        plantDictionaryService.fetchAndSavePlants();
        return "식물 데이터 저장 완료!";
    }

    @GetMapping("/search")
    public ResponseEntity<List<PlantDictionary>> searchPlants(@RequestParam String query) {
        List<PlantDictionary> results = plantDictionaryService.searchPlants(query);
        return ResponseEntity.ok(results);
    }

}
