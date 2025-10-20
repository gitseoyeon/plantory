package org.example.plantory_be.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.plantory_be.dto.request.UserProfileUpdateRequest;
import org.example.plantory_be.dto.response.UserPrivateProfileResponse;
import org.example.plantory_be.dto.response.UserPublicProfileResponse;
import org.example.plantory_be.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/profile/me")
    public ResponseEntity<UserPrivateProfileResponse> getMyProfile() {
        return ResponseEntity.ok(userService.getUserPrivateProfile());
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<UserPublicProfileResponse> getProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserPublicProfile(userId));
    }

    @PatchMapping("/profile/me")
    public ResponseEntity<UserPrivateProfileResponse> modifyProfile(@Valid @RequestBody UserProfileUpdateRequest request) {
        return ResponseEntity.ok(userService.modifyUserProfile(request));
    }

}
