package org.example.plantory_be.controller;

import lombok.RequiredArgsConstructor;
import org.example.plantory_be.dto.request.UserPlantDiaryRequest;
import org.example.plantory_be.dto.response.UserPlantDiaryResponse;
import org.example.plantory_be.service.UserPlantDiaryImageService;
import org.example.plantory_be.service.UserPlantDiaryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/diary")
@RequiredArgsConstructor
public class UserPlantDiaryController {
    private final UserPlantDiaryService diaryService;
    private final UserPlantDiaryImageService imageService;

    @PostMapping
    public ResponseEntity<UserPlantDiaryResponse> createDiary(
            @RequestBody UserPlantDiaryRequest request
    ) {
        UserPlantDiaryResponse response = diaryService.createUserPlantDiary(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<UserPlantDiaryResponse>> listPlantDiary(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        Pageable pageable = PageRequest.of(page, size);
        Page<UserPlantDiaryResponse> userPlants = diaryService.listPlantsDiary(pageable);
        return ResponseEntity.ok(userPlants);
    }

    @GetMapping("/{plantId}")
    public ResponseEntity<Page<UserPlantDiaryResponse>> listUserPlantDiary(
            @PathVariable Long plantId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        Pageable pageable = PageRequest.of(page, size);
        Page<UserPlantDiaryResponse> userPlants = diaryService.listUserPlantsDiary(plantId, pageable);
        return ResponseEntity.ok(userPlants);
    }

    @PutMapping("/{plantId}/{diaryId}")
    public ResponseEntity<UserPlantDiaryResponse> updateDiary(
            @PathVariable Long diaryId,
            @RequestBody UserPlantDiaryRequest request
    ) {
        UserPlantDiaryResponse updated = diaryService.updateUserPlantDiary(diaryId, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{plantId}/{diaryId}")
    public ResponseEntity<Void> deleteDiary(
            @PathVariable Long diaryId
    ) {
        diaryService.deleteUserPlantDiary(diaryId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/photos/{plantId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> uploadPlantPhoto(
            @PathVariable Long plantId,
            @RequestParam("file") MultipartFile file
    ) {
        var result = imageService.saveOne(plantId, file);

        Map<String, Object> body = new HashMap<>();
        body.put("fileName", result.getFileName());
        body.put("imageUrl", result.getImageUrl()); // 프런트 미리보기 <img src> 가능
        return ResponseEntity.ok(body);
    }
}
