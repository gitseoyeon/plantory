package org.example.plantory_be.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_plants_diary",
        indexes = {
                @Index(name = "idx_user_plants_diary_plant_id", columnList = "plant_id")
        })
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPlantDiary {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "plant_id", nullable = false)
        private UserPlant userPlant;

        @Column(length = 500)
        private String physical;

        @Column(length = 500)
        private String manage;

        @Column(length = 500)
        private String preferred;

        @CreationTimestamp
        @Column(name = "created_at", updatable = false)
        private LocalDateTime createdAt;
}
