package org.example.plantory_be.controller;

import lombok.RequiredArgsConstructor;
import org.example.plantory_be.dto.request.UserPlantRequest;
import org.example.plantory_be.dto.response.UserPlantResponse;
import org.example.plantory_be.service.UserPlantService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/plant")
@RequiredArgsConstructor
public class UserPlantController {

    private final UserPlantService userPlantService;

    @PostMapping
    public ResponseEntity<UserPlantResponse> createPlant(
            @RequestBody UserPlantRequest request
    ) {
        UserPlantResponse response = userPlantService.createUserPlant(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    @GetMapping
    public ResponseEntity<Page<UserPlantResponse>> getMyUserPlants(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        Pageable pageable = PageRequest.of(page, size);
        Page<UserPlantResponse> userPlants = userPlantService.listUserPlants(pageable);
        return ResponseEntity.ok(userPlants);
    }

    @PutMapping("/{plantId}")
    public ResponseEntity<UserPlantResponse> updatePlant(
            @PathVariable Long plantId,
            @RequestBody UserPlantRequest request
    ) {
        UserPlantResponse updated = userPlantService.updateUserPlant(plantId, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{plantId}")
    public ResponseEntity<Void> deletePlant(
            @PathVariable Long plantId
    ) {
        userPlantService.deleteUserPlant(plantId);
        return ResponseEntity.noContent().build();
    }
}
