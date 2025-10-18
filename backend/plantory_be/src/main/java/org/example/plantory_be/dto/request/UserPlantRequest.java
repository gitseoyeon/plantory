package org.example.plantory_be.dto.request;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.plantory_be.entity.PotSize;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserPlantRequest {

    private Long species_id;

    @NotBlank(message = "식물이름을 입력하세요")
    @Size(max = 200, message = "이름은 200자를 초과 할 수 없습니다")
    private String name;

    @NotBlank(message = "닉네임을 입력하세요")
    @Size(max = 200, message = "닉네임은 200자를 초과 할 수 없습니다")
    private String petName;

    private LocalDate acquiredDate;

    private String imageUrl;

    private boolean indoor ;

    private String location;

    private  String store;

    private BigDecimal price;

    private PotSize potSize;

    private String qrUrl;

    private String qrImageUrl;

}
