package org.example.plantory_be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.example.plantory_be.entity.PlantDictionary;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlantDictionaryResponse {

    private Long id;
    private String commonName;
    private String koreanName;
    private String englishName;
    private String scientificName;
    private String origin;
    private String familyName;
    private String imageUrl;

    public static PlantDictionaryResponse fromEntity(PlantDictionary entity) {
        return PlantDictionaryResponse.builder()
            .id(entity.getId())
            .commonName(entity.getCommonName())
            .koreanName(entity.getKoreanName())
            .englishName(entity.getEnglishName())
            .scientificName(entity.getScientificName())
            .origin(entity.getOrigin())
            .familyName(entity.getFamilyName())
            .imageUrl(entity.getImageUrl())
            .build();
    }
}

