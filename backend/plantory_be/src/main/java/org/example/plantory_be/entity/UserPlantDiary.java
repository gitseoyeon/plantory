package org.example.plantory_be.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;
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
        @JoinColumn(name = "user_id", nullable = false)
        private User user;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "plant_id", nullable = false)
        @OnDelete(action = OnDeleteAction.CASCADE)
        private UserPlant userPlant;

        @Column
        private LocalDate diaryDate;

        @Column(length = 200)
        private String physical;

        @Column(length = 200)
        private String manage;

        @Column(length = 200)
        private String preferred;

        @Column(name = "care_notes", length = 200)
        private String careNotes;

        @CreationTimestamp
        @Column(name = "created_at", updatable = false)
        private LocalDateTime createdAt;
}
