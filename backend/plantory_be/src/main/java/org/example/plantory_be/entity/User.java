package org.example.plantory_be.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.plantory_be.dto.request.UserProfileUpdateRequest;
import org.example.plantory_be.dto.response.UserPrivateProfileResponse;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "nickname", nullable = false, unique = true)
    private String nickName;

    @Column(name = "profile_image_url", columnDefinition = "TEXT")
    private String profileImageUrl;

    @Enumerated(EnumType.STRING)
    private AuthProvider provider;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String experience;

    private String interest;

    @Enumerated(EnumType.STRING)
    private PreferStyle style;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    public UserPrivateProfileResponse updateProfile(UserProfileUpdateRequest profile) {
        this.email = profile.getEmail();
        this.username = profile.getUsername();
        this.profileImageUrl = profile.getProfileImageUrl();
        this.bio = profile.getBio();
        this.experience = profile.getExperience();
        this.style = profile.getStyle();

        return UserPrivateProfileResponse.builder()
                .email(email)
                .username(username)
                .profileImageUrl(profileImageUrl)
                .bio(bio)
                .experience(experience)
                .style(style != null ? style.name() : null)
                .build();
    }
}
