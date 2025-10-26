package org.example.plantory_be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * AI 식물 식별 결과 응답 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PlantIdentificationResponse {
    private String koreanName;     // 번역된 이름
    private String englishName;    // 영어 이름
    private double confidence;     // 정확도
    private String previewUrl;     // 업로드 이미지
    private String imageUrl;       // 결과 이미지
}
