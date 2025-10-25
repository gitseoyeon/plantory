package org.example.plantory_be.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

@Entity
@Table(name = "plant_identifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlantIdentification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 업로드된 식물 이미지 URL (혹은 Base64)
    @Column(name = "preview_url", columnDefinition = "TEXT")
    private String previewUrl;  // ✅ 업로드 이미지 (사용자 제공 이미지)

    // AI 결과 이미지 URL
    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;  // ✅ AI가 반환한 유사 이미지

    // 번역된 한글 이름 (Papago 결과)
    @Column(name = "identified_name")
    private String identifiedName;

    // 영어 이름 (AI 원본 결과)
    @Column(name = "english_name")
    private String englishName;

    // 학명 (공식 등록명)
    @Column(name = "scientific_name")
    private String scientificName;

    // AI의 신뢰도 (%)
    @Column(name = "confidence")
    private Double confidence;

    // 식별 시각
    @Column(name = "identified_at")
    private LocalDateTime identifiedAt;

}
