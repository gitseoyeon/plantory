package org.example.plantory_be.controller;

import lombok.RequiredArgsConstructor;
import org.example.plantory_be.dto.request.UserPlantDiaryRequest;
import org.example.plantory_be.dto.response.UserPlantDiaryResponse;
import org.example.plantory_be.service.UserPlantDiaryService;
import org.example.plantory_be.service.UserPlantService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/{plant}")
@RequiredArgsConstructor
public class UserPlantDiaryController {
    private final UserPlantService userPlantService;
    private final UserPlantDiaryService diaryService;

    @PostMapping
    public ResponseEntity<UserPlantDiaryResponse> createDiary(
            @RequestBody UserPlantDiaryRequest request
    ) {
        UserPlantDiaryResponse response = diaryService.createUserPlantDiary(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<UserPlantDiaryResponse>> listUserPlantDiary(
            @PathVariable Long plantId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        Pageable pageable = PageRequest.of(page, size);
        Page<UserPlantDiaryResponse> userPlants = diaryService.listUserPlantsDiary(plantId, pageable);
        return ResponseEntity.ok(userPlants);
    }

    @PutMapping("/{diaryId}")
    public ResponseEntity<UserPlantDiaryResponse> updateDiary(
            @PathVariable Long diaryId,
            @RequestBody UserPlantDiaryRequest request
    ) {
        UserPlantDiaryResponse updated = diaryService.updateUserPlantDiary(diaryId, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{diaryId}")
    public ResponseEntity<Void> deleteDiary(
            @PathVariable Long diaryId
    ) {
        userPlantService.deleteUserPlant(diaryId);
        return ResponseEntity.noContent().build();
    }
}
