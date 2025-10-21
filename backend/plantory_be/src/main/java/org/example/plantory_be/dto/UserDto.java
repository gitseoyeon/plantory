package org.example.plantory_be.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.plantory_be.entity.User;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String nickName;
    private String profileImageUrl;
    private String bio;
    private String experience;
    private String interest;
    private String style;

    public static UserDto fromEntity(User user) {
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .nickName(user.getNickName())
                .profileImageUrl(user.getProfileImageUrl())
                .bio(user.getBio())
                .experience(user.getExperience())
                .interest(user.getInterest())
                .style(user.getStyle() != null ? user.getStyle().name() : null)
                .build();
    }
}
