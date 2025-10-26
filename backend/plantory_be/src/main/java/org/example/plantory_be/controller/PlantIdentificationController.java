package org.example.plantory_be.controller;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.example.plantory_be.dto.response.PlantIdentificationResponse;
import org.example.plantory_be.entity.PlantIdentification;
import org.example.plantory_be.service.PlantIdentificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/identification")
@RequiredArgsConstructor
public class PlantIdentificationController {

    private final PlantIdentificationService plantIdentificationService;

    /**
     * 사용자가 업로드한 이미지로 식물 식별 실행
     */
    @PostMapping("/identify")
    public ResponseEntity<PlantIdentificationResponse> identifyPlant(
        @RequestParam("image") MultipartFile image) {
        PlantIdentificationResponse result = plantIdentificationService.identifyPlant(image);
        return ResponseEntity.ok(result);
    }

    /**
     * 전체 식별 이력 조회
     */
    @GetMapping("/history")
    public ResponseEntity<List<PlantIdentification>> getAllIdentifications() {
        List<PlantIdentification> results = plantIdentificationService.getAllIdentifications();
        return ResponseEntity.ok(results);
    }
}
