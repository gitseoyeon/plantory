package org.example.plantory_be.entity;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_plants",
        indexes = {
                @Index(name = "idx_user_plants_user_id", columnList = "user_id"),
                @Index(name = "idx_user_plants_species_id", columnList = "species_id")
        })
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPlant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "species_id")
    private UserPlantSpecies userPlantSpecies;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "pet_name", nullable = false, length = 200)
    private String petName;

    @Column(name = "acquired_date")
    private LocalDate acquiredDate;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Column(name = "is_indoor")
    private boolean Indoor ;

    @Column(length = 200)
    private String location;

    @Column(length = 200)
    private  String store;

    @Column(precision=12)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(name = "pot_size", length = 10)
    private PotSize potSize;

    @Column
    private String qrUrl;

    @Column
    private String qrImageUrl;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

}
