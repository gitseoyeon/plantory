package org.example.plantory_be.controller;

import lombok.RequiredArgsConstructor;
import org.example.plantory_be.dto.request.UserPlantRequest;
import org.example.plantory_be.dto.response.UserPlantResponse;
import org.example.plantory_be.entity.PotSize;
import org.example.plantory_be.service.UserPlantQrService;
import org.example.plantory_be.service.UserPlantService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/plant")
@RequiredArgsConstructor
public class UserPlantController {

    private final UserPlantService userPlantService;
    private final UserPlantQrService userPlantQrService;

    @PostMapping
    public ResponseEntity<UserPlantResponse> createPlant(
            @RequestBody UserPlantRequest request
    ) {
        UserPlantResponse response = userPlantService.createUserPlant(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/all")
    public ResponseEntity<Page<UserPlantResponse>> getAllUserPlants(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        Pageable pageable = PageRequest.of(page, size);
        Page<UserPlantResponse> userPlants = userPlantService.listAllUserPlants(pageable);
        return ResponseEntity.ok(userPlants);
    }

    @GetMapping
    public ResponseEntity<Page<UserPlantResponse>> getMyUserPlants(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        Pageable pageable = PageRequest.of(page, size);
        Page<UserPlantResponse> userPlants = userPlantService.listMyUserPlants(pageable);
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

    @GetMapping("/potsize")
    public ResponseEntity<List<Map<String, String>>> getAllPotSizes() {
        List<Map<String, String>> potSizes = Arrays.stream(PotSize.values())
                .map(size -> Map.of(
                        "value", size.name(),
                        "label", size.getLabel()
                ))
                .toList();

        return ResponseEntity.ok(potSizes);
    }

    //사용자화면이 아닌 개발자확인용
    @PostMapping("/qr")
    public ResponseEntity<Map<String, String>> generatePlantQr() {

       UserPlantQrService.QRResult result = userPlantQrService.generateQrForPlant(5L);

        Map<String, String> res = new HashMap<>();
        res.put("qrImageUrl", result.qrImageUrl());
        res.put("localPath", result.localPath().toString());

        return ResponseEntity.ok(res);
    }
}
