package org.example.plantory_be.controller;

import lombok.RequiredArgsConstructor;
import org.example.plantory_be.dto.response.UserPlantSpeciesResponse;
import org.example.plantory_be.service.UserPlantSpeciesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/plant/species")
@RequiredArgsConstructor
public class UserPlantSpeciesController {

    private final UserPlantSpeciesService speciesService;

    @GetMapping
    public ResponseEntity<List<UserPlantSpeciesResponse>> listUserPlantSpecies() {
        List<UserPlantSpeciesResponse> species = speciesService.listUserPlantSpecies();
        return ResponseEntity.ok(species);
    }
}
