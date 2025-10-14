package org.example.plantory_be.service;

import lombok.RequiredArgsConstructor;
import org.example.plantory_be.dto.UserDto;
import org.example.plantory_be.dto.request.RegisterRequest;
import org.example.plantory_be.dto.response.AuthResponse;
import org.example.plantory_be.entity.AuthProvider;
import org.example.plantory_be.entity.User;
import org.example.plantory_be.exception.UserAlreadyException;
import org.example.plantory_be.repository.UserRepository;
import org.example.plantory_be.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        if(userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyException("이미 사용중인 이메일입니다.");
        }

        if(userRepository.existsByNickName(request.getNickname())) {
            throw new UserAlreadyException("이미 사용중인 닉네임입니다.");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .nickName(request.getNickname())
                .profileImageUrl(request.getProfileImageUrl() != null ? request.getProfileImageUrl() : null)
                .provider(AuthProvider.LOCAL)
                .build();

        userRepository.save(user);

        String jwtToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .user(UserDto.fromEntity(user))
                .build();
    }
}
