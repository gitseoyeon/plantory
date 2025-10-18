package org.example.plantory_be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.plantory_be.entity.UserPlantSpecies;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPlantSpeciesResponse {
    private Long id;
    private String name;

    public static UserPlantSpeciesResponse fromEntity(UserPlantSpecies species) {
        return UserPlantSpeciesResponse.builder()
                .id(species.getId())
                .name(species.getName())
                .build();
    }
}
