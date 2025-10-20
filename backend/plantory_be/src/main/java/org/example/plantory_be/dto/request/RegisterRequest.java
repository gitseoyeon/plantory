package org.example.plantory_be.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "이름은 필수 값 입니다.")
    @Size(min = 2, max = 30, message = "이름은 2-30자 사이어야 합니다.")
    private String username;

    @NotBlank(message = "이메일은 필수 값 입니다.")
    @Email(message = "올바른 이메일 형식이 아닙니다.")
    private String email;

    @NotBlank(message = "비밀번호는 필수 값 입니다.")
    @Size(min = 8, message = "비밀번호는 최소 6자 이상이어야 합니다.")
    private String password;

    @NotBlank(message = "별명을 작성해주세요")
    private String nickname;

    private String profileImageUrl;
}
