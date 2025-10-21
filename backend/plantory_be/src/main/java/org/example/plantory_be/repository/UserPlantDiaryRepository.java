package org.example.plantory_be.repository;

import org.example.plantory_be.entity.UserPlantDiary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserPlantDiaryRepository extends JpaRepository<UserPlantDiary, Long> {

    Page<UserPlantDiary> findByUserPlantId(Long plantId, Pageable pageable);
}
