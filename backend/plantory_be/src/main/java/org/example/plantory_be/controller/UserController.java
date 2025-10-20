package org.example.plantory_be.controller;

import lombok.RequiredArgsConstructor;
import org.example.plantory_be.dto.response.UserPrivateProfileResponse;
import org.example.plantory_be.dto.response.UserPublicProfileResponse;
import org.example.plantory_be.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
