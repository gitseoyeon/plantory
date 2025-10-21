package org.example.plantory_be.repository;


import org.example.plantory_be.entity.PlantDictionary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlantDictionaryRepository extends JpaRepository<PlantDictionary, Long> {
}