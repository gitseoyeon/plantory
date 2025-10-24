package org.example.plantory_be.entity;

import jakarta.persistence.*;
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

    @Column(name = "image_url")
    private String imageUrl; // 업로드 이미지 경로

    @Column(name = "identified_name")
    private String identifiedName; // 식별된 식물명

    @Column(name = "confidence")
    private Double confidence; // AI가 반환한 신뢰도

    @Column(name = "identified_at")
    private String identifiedAt; // 식별 시각
}