package org.example.plantory_be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.plantory_be.entity.UserPlantDiary;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPlantDiaryResponse {

    private Long id;
    private Long plantId;
    private LocalDate diaryDate;
    private String physical;
    private String manage;
    private String preferred;
    private String careNotes;
    private LocalDateTime createdAt;

    private List<UserPlantPhotoResponse> userPlantPhotos;

    public static UserPlantDiaryResponse fromEntity(UserPlantDiary entity) {
        return UserPlantDiaryResponse.builder()
                .id(entity.getId())
                .plantId(entity.getUserPlant().getId())
                .diaryDate(entity.getDiaryDate())
                .physical(entity.getPhysical())
                .manage(entity.getManage())
                .preferred(entity.getPreferred())
                .careNotes(entity.getCareNotes())
                .createdAt(entity.getCreatedAt())
                .userPlantPhotos(
                        entity.getUserPlantPhotos() != null
                                ? entity.getUserPlantPhotos().stream()
                                .map(UserPlantPhotoResponse::fromEntity)
                                .collect(Collectors.toList())
                                : null
                )
                .build();
    }
}
