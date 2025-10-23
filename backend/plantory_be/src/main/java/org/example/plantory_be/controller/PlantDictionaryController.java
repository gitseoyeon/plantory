package org.example.plantory_be.controller;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.example.plantory_be.dto.response.PlantDictionaryResponse;
import org.example.plantory_be.entity.PlantDictionary;
import org.example.plantory_be.repository.PlantDictionaryRepository;
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


    @GetMapping
    public List<PlantDictionary> getAllPlants() {
        return plantDictionaryService.getAllPlants();
    }


    @GetMapping("/perenual/{perenualId}")
    public ResponseEntity<PlantDictionary> getPlantByPerenualId(@PathVariable Long perenualId) {
        PlantDictionary plant = plantDictionaryService.getPlantByPerenualId(perenualId);
        if (plant != null) {
            return ResponseEntity.ok(plant);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/plants/save")
    public String savePlantsFromApi() {
        plantDictionaryService.fetchAndSavePlants();
        return " Perenual 데이터 저장 완료!";
    }

    // Perenual API 데이터 가져와 DB에 저장 (테스트용)
    @GetMapping("/fetch")
    public String fetchAndSavePlants() {
        plantDictionaryService.fetchAndSavePlants();
        return "식물 데이터 저장 완료!";
    }

    @GetMapping("/search")
    public List<PlantDictionaryResponse> searchPlants(@RequestParam(required = false) String query) {
        return plantDictionaryService.searchPlants(query);
    }

}