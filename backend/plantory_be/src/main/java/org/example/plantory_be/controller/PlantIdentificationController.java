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
     * [수동 호출용]
     * 사용자가 업로드한 이미지로 식물 식별 실행
     */
    @PostMapping("/identify")
    public ResponseEntity<PlantIdentificationResponse> identifyPlant(
        @RequestParam("image") MultipartFile image) {
        PlantIdentificationResponse result = plantIdentificationService.identifyAndSave(image);
        return ResponseEntity.ok(result);
    }

    /**
     * [자동 호출용]
     * DB에 식별 결과가 없을 경우 자동으로 Plant.id API를 호출해 초기 데이터 생성
     */
    @GetMapping("/auto-identifications")
    public ResponseEntity<List<PlantIdentification>> getOrFetchAllIdentifications() {
        List<PlantIdentification> results = plantIdentificationService.getOrFetchAllIdentifications();
        return ResponseEntity.ok(results);
    }
}
