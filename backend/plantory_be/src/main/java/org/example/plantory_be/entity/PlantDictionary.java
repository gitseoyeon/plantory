package org.example.plantory_be.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

@Entity
@Table(name = "plant_dictionary")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlantDictionary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "scientific_name") private String scientificName; // 학명

    @Column(name = "korean_name") private String koreanName; // 한글 이름

    @Column(name = "english_name") private String englishName; // 영어 이름

    @Column(name = "origin") private String origin; // 원산지

    @Column(name = "family_name") private String familyName; // 과 이름

    @Column(name = "lifespan") private String lifespan; // 수명

    @Column(name = "height") private String height; // 크기/높이

    @Column(name = "water") private String water; // 물 주기

    @Column(name = "sunlight") private String sunlight; // 햇빛 조건

    @Column(name = "temperature") private String temperature; //온도

    @Column(name = "humidity") private String humidity; //습도

    @Column(name = "soil") private String soil; //흙 종류

    @Column(name = "fertilizer") private String fertilizer; //비료 종류

    @Column(name = "propagation") private String propagation; // 번식 방법

    @Column(name = "description", columnDefinition = "TEXT") private String description; // 설명

    @Column(name = "special_care", columnDefinition = "TEXT") private String specialCare; // 관리 팁

    @Column(name = "seasonal_care", columnDefinition = "TEXT") private String seasonalCare; // 계절별 관리법

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt; // 생성일

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;// 수정일

    // 테스트용
    @Column(name = "perenual_id")
    private Long perenualId;

    @Column(name = "common_name")
    private String commonName;

    @Column(name = "other_name")
    private String otherName;

    @Column(name = "image_url")
    private String imageUrl;

}
