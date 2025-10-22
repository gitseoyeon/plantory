package org.example.plantory_be.dto.request;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;
import org.example.plantory_be.entity.PreferStyle;

@Data
@Builder
public class UserProfileUpdateRequest {
    @NotBlank(message = "이메일은 필수 값 입니다.")
    private String email;

    @NotBlank(message = "사용자명은 필수 값 입니다.")
    private String username;

    private String profileImageUrl;
    private String bio;
    private String experience;
    private String interest;
    @Enumerated(EnumType.STRING)
    private PreferStyle style;
}
