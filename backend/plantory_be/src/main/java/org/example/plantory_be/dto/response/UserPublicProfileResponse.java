package org.example.plantory_be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.plantory_be.entity.User;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPublicProfileResponse {
    private String nickname;
    private String profileImageUrl;
    private String bio;
    private String experience;
    private String interest;
    private String style;

    public static UserPublicProfileResponse fromEntity(User user) {
        return UserPublicProfileResponse.builder()
                .nickname(user.getNickName())
                .profileImageUrl(user.getProfileImageUrl())
                .bio(user.getBio())
                .experience(user.getExperience())
                .interest(user.getInterest())
                .style(user.getStyle() != null ? user.getStyle().name() : null)
                .build();
    }
}
