package org.example.plantory_be.repository;

import org.example.plantory_be.entity.Like;
import org.example.plantory_be.entity.LikeTargetType;
import org.example.plantory_be.entity.Post;
import org.example.plantory_be.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    @Query("SELECT COUNT(l) FROM Like l WHERE l.targetId = :targetId AND l.targetType = :targetType")
    Long countByTargetTypeAndId(
            @Param("targetId") Long targetId,
            @Param("targetType") LikeTargetType targetType
    );

    boolean existsByUserAndTargetIdAndTargetType(User user, Long targetId, LikeTargetType targetType);

    void deleteByUserAndTargetIdAndTargetType(User user, Long targetId, LikeTargetType targetType);
}