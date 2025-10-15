package org.example.plantory_be.config;

import lombok.RequiredArgsConstructor;
import org.example.plantory_be.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {
    private final UserRepository userRepository;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return loginId -> {
            try {
                Long userId = Long.parseLong(loginId);
                return userRepository.findById(userId)
                        .orElseThrow(() -> new UsernameNotFoundException("유저를 찾을 수 없습니다: " + userId));
            } catch (NumberFormatException e) {
                return userRepository.findByEmail(loginId)
                        .or(() -> userRepository.findByUsername(loginId))
                        .orElseThrow(() -> new UsernameNotFoundException("유저가 존재하지 않습니다."));
            }
        };
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }


}
