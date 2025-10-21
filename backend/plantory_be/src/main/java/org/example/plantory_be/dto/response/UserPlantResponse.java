package org.example.plantory_be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.plantory_be.entity.PotSize;
import org.example.plantory_be.entity.UserPlant;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPlantResponse {
    private Long id;
    private Long userId;
    private Long speciesId;
    private String name;
    private String petName;
    private String speciesName;
    private LocalDate acquiredDate;
    private String imageUrl;
    private boolean indoor;
    private String location;
    private String store;
    private BigDecimal price;
    private PotSize potSize;
    private String qrUrl;
    private String qrImageUrl;
    private LocalDateTime createdAt;

    public static UserPlantResponse fromEntity(UserPlant entity) {
        return UserPlantResponse.builder()
                .id(entity.getId())
                .userId(entity.getUser().getId())
                .speciesId(entity.getUserPlantSpecies() != null ? entity.getUserPlantSpecies().getId() : null)
                .name(entity.getName())
                .petName(entity.getPetName())
                .speciesName(entity.getUserPlantSpecies() != null ? entity.getUserPlantSpecies().getName() : null)
                .acquiredDate(entity.getAcquiredDate())
                .imageUrl(entity.getImageUrl())
                .indoor(entity.isIndoor())
                .location(entity.getLocation())
                .store(entity.getStore())
                .price(entity.getPrice())
                .potSize(entity.getPotSize())
                .qrUrl(entity.getQrUrl())
                .qrImageUrl(entity.getQrImageUrl())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
