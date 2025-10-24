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

    // 검색 대상: commonName(영문 일반명), englishName(영어명), scientificName(학명), koreanName(한글명), origin(원산지), familyName(과 이름)
    @Query("""
    SELECT p FROM PlantDictionary p
    WHERE (:query IS NULL OR TRIM(:query) = ''
           OR REPLACE(LOWER(p.commonName), ' ', '') LIKE LOWER(CONCAT('%', REPLACE(TRIM(:query), ' ', ''), '%'))
           OR REPLACE(LOWER(p.koreanName), ' ', '') LIKE LOWER(CONCAT('%', REPLACE(TRIM(:query), ' ', ''), '%'))
           OR REPLACE(LOWER(p.englishName), ' ', '') LIKE LOWER(CONCAT('%', REPLACE(TRIM(:query), ' ', ''), '%'))
           OR REPLACE(LOWER(p.scientificName), ' ', '') LIKE LOWER(CONCAT('%', REPLACE(TRIM(:query), ' ', ''), '%'))
           OR REPLACE(LOWER(p.origin), ' ', '') LIKE LOWER(CONCAT('%', REPLACE(TRIM(:query), ' ', ''), '%'))
           OR REPLACE(LOWER(p.familyName), ' ', '') LIKE LOWER(CONCAT('%', REPLACE(TRIM(:query), ' ', ''), '%'))
    )
""")
    List<PlantDictionary> searchPlants(@Param("query") String query);


}
