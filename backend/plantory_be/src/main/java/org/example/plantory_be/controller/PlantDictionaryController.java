package org.example.plantory_be.controller;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.example.plantory_be.entity.PlantDictionary;
import org.example.plantory_be.service.PlantDictionaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
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

    @GetMapping("/plants/save")
    public String savePlantsFromApi() {
        plantDictionaryService.fetchAndSavePlants();
        return " Perenual 데이터 저장 완료!";
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlantDictionary> getPlantById(@PathVariable Long id) {
        PlantDictionary plant = plantDictionaryService.getPlantById(id);
        if (plant != null) {
            return ResponseEntity.ok(plant);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Perenual API 데이터 가져와 DB에 저장 (테스트용)
    @GetMapping("/fetch")
    public String fetchAndSavePlants() {
        plantDictionaryService.fetchAndSavePlants();
        return "식물 데이터 저장 완료!";
    }
}