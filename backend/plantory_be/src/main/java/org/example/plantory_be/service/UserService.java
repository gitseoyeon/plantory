package org.example.plantory_be.service;

import lombok.RequiredArgsConstructor;
import org.example.plantory_be.dto.response.UserPrivateProfileResponse;
import org.example.plantory_be.dto.response.UserPublicProfileResponse;
import org.example.plantory_be.entity.User;
import org.example.plantory_be.exception.ResourceNotFoundException;
import org.example.plantory_be.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final AuthenticationService authenticationService;

    @Transactional(readOnly = true)
    public UserPrivateProfileResponse getUserPrivateProfile() {
        User user = authenticationService.getCurrentUser();
        return UserPrivateProfileResponse.fromEntity(user);
    }

    @Transactional(readOnly = true)
    public UserPublicProfileResponse getUserPublicProfile(Long userId) {
        authenticationService.getCurrentUser();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("유저 정보를 찾을 수 없습니다."));

        return UserPublicProfileResponse.fromEntity(user);
    }
}
