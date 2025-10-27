package org.example.plantory_be.controller;

import lombok.RequiredArgsConstructor;
import org.example.plantory_be.entity.PlantDictionary;
import org.example.plantory_be.service.PlantDictionaryService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/plants")
@RequiredArgsConstructor
public class PlantDictionaryController {

    private final PlantDictionaryService plantDictionaryService;

    /**
     * 페이지 기반 목록 조회 및 검색(자동 호출 포함)
     */
    @GetMapping("/page")
    public ResponseEntity<Page<PlantDictionary>> getPlantsPage(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(required = false) String query
    ) {
        Page<PlantDictionary> result = plantDictionaryService.getPlantsPage(page, size, query);
        return ResponseEntity.ok(result);
    }

    /**
     * 개별 식물 조회
     */
    @GetMapping("/perenual/{perenualId}")
    public ResponseEntity<PlantDictionary> getPlantByPerenualId(@PathVariable Long perenualId) {
        PlantDictionary plant = plantDictionaryService.getOrFetchPlantByPerenualId(perenualId);
        return plant != null ? ResponseEntity.ok(plant) : ResponseEntity.notFound().build();
    }

    /**
     * 테스트용 강제 데이터 로드
     */
    @GetMapping("/fetch")
    public String fetchAndSavePlants() {
        plantDictionaryService.fetchAndSavePlants(10);
        return "식물 데이터 저장 완료!";
    }
}
