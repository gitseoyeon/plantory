package org.example.plantory_be.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.plantory_be.entity.User;
import org.example.plantory_be.exception.ResourceNotFoundException;
import org.example.plantory_be.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AuthenticationService {

    private final UserRepository userRepository;

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getPrincipal() == null) {
            throw new ResourceNotFoundException("No authenticated user found");
        }

        String username;

        if (authentication.getPrincipal() instanceof User userPrincipal) {
            username = userPrincipal.getEmail();
        } else if (authentication.getPrincipal() instanceof UserDetails userDetails) {
            username = userDetails.getUsername();
        } else {
            username = authentication.getName();
        }

        return userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found for username: " + username));
    }
}
