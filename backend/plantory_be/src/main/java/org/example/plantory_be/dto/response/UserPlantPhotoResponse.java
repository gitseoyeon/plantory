package org.example.plantory_be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.plantory_be.entity.UserPlantPhoto;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPlantPhotoResponse {

    private Long id;
    private Long diaryId;
    private String imageUrl;
    private String memo;
    private LocalDateTime createdAt;

    public static UserPlantPhotoResponse fromEntity(UserPlantPhoto entity) {
        return UserPlantPhotoResponse.builder()
                .id(entity.getId())
                .diaryId(entity.getUserPlantDiary() != null ? entity.getUserPlantDiary().getId() : null)
                .imageUrl(entity.getImageUrl())
                .memo(entity.getMemo())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
