package org.example.plantory_be.repository;

import org.example.plantory_be.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    @EntityGraph(attributePaths = {"user"})
    @Query("SELECT p FROM Post p WHERE p.deleted = false ORDER BY p.createdAt DESC")
    Page<Post> findAllActive(Pageable pageable);

    @EntityGraph(attributePaths = {"user"})
    @Query("SELECT p FROM Post p WHERE p.user.id = :userId AND p.deleted = false ORDER BY p.createdAt DESC")
    Page<Post> findByUserIdAndNotDeleted(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.id = :id AND p.deleted = false")
    Optional<Post> findByIdAndNotDeleted(@Param("id") Long id);

    @Query("SELECT COUNT(p) FROM Post p WHERE p.user.id = :userId AND p.deleted = false")
    long countByUserIdAndNotDeleted(@Param("userId") Long userId);

    boolean existsByIdAndDeletedFalse(Long id);

    @Query(value = """
                SELECT p.*
                FROM posts p
                WHERE p.id = (
                    SELECT p2.id
                    FROM posts p2
                    LEFT JOIN likes l2
                        ON l2.target_id = p2.id
                        AND l2.target_type = 'POST'
                    WHERE p2.category = p.category
                      AND p2.is_deleted = false
                    GROUP BY p2.id
                    ORDER BY COUNT(l2.id) DESC, p2.created_at DESC
                    LIMIT 1
                )
            """, nativeQuery = true)
    List<Post> findTop1PostByEachCategory();
}