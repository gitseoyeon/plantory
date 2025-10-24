package org.example.plantory_be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.plantory_be.entity.UserPlantPhoto;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPlantDiaryPhotoResponse {

    private Long id;      //plantId
    private String image; //imageUrl

    private String memo;

    public static UserPlantDiaryPhotoResponse fromEntity(UserPlantPhoto entity) {
        return UserPlantDiaryPhotoResponse.builder()
                .id(entity.getUserPlantDiary().getId() !=null ? entity.getUserPlantDiary().getId() : null)
                .image(entity.getImageUrl())
                .memo(entity.getMemo())
                .build();
    }
}
