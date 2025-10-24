package org.example.plantory_be.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserPlantPhotoRequest {

    @Size(max = 255, message = "이미지 URL은 255자 이내여야 합니다.")
    private String imageUrl;

    @Size(max = 200, message = "메모는 200자 이내여야 합니다.")
    private String memo;

}
