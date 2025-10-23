package org.example.plantory_be.repository;

import java.util.List;
import java.util.Optional;
import org.example.plantory_be.entity.PlantDictionary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PlantDictionaryRepository extends JpaRepository<PlantDictionary, Long> {

    Optional<PlantDictionary> findByPerenualId(Long perenualId);

    @Query("""
        SELECT p FROM PlantDictionary p
        WHERE (:query IS NULL OR TRIM(:query) = '' 
               OR LOWER(CAST(p.commonName AS string)) LIKE LOWER(CONCAT('%', TRIM(:query), '%'))
               OR LOWER(CAST(p.koreanName AS string)) LIKE LOWER(CONCAT('%', TRIM(:query), '%'))
               OR LOWER(CAST(p.englishName AS string)) LIKE LOWER(CONCAT('%', TRIM(:query), '%'))
               OR LOWER(CAST(p.scientificName AS string)) LIKE LOWER(CONCAT('%', TRIM(:query), '%'))
               OR LOWER(CAST(p.origin AS string)) LIKE LOWER(CONCAT('%', TRIM(:query), '%'))
               OR LOWER(CAST(p.familyName AS string)) LIKE LOWER(CONCAT('%', TRIM(:query), '%')))
        """)
    List<PlantDictionary> searchPlants(@Param("query") String query);
}
