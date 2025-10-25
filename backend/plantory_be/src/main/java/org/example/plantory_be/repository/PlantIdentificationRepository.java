package org.example.plantory_be.repository;

import org.example.plantory_be.entity.PlantIdentification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlantIdentificationRepository extends JpaRepository<PlantIdentification, Long> {
}
