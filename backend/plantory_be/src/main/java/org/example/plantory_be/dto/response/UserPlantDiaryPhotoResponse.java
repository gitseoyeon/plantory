package org.example.plantory_be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPlantDiaryPhotoResponse {

    private Long plantId;
    private Long id;
    private String imageUrl;
    private String memo;

}
