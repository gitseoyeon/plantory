package org.example.plantory_be.repository;

import org.example.plantory_be.dto.response.UserPlantDiaryPhotoResponse;
import org.example.plantory_be.entity.UserPlantDiary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserPlantDiaryRepository extends JpaRepository<UserPlantDiary, Long> {

    Page<UserPlantDiary> findByOrderByCreatedAtDesc(Pageable pageable);

    @Query("""
        SELECT new org.example.plantory_be.dto.UserPlantDiaryPhotoResponse(
            d.userPlant.id,
            p.imageUrl,
            d.memo
        )
        FROM UserPlantPhoto p
        LEFT JOIN p.diary d
        ORDER BY p.id DESC
    """)
    Page<UserPlantDiaryPhotoResponse> findDiaryPhotos(Pageable pageable);

    Page<UserPlantDiary> findByUserPlantIdOrderByCreatedAtDesc(Long plantId, Pageable pageable);
}
