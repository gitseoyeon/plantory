package org.example.plantory_be.repository;

import org.example.plantory_be.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByPostIdAndParentIsNullOrderByCreatedAtDesc(Long postId);

    @Query("SELECT DISTINCT c FROM Comment c LEFT JOIN FETCH c.children WHERE c.id = :id")
    Optional<Comment> findByIdWithChildren(@Param("id") Long id);

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.post.id = :postId")
    Long countByPostId(@Param("postId") Long postId);

    Page<Comment> findByParentIdOrderByCreatedAtDesc(Long parentId, Pageable pageable);

    @Query("SELECT c FROM Post c WHERE c.id = :id AND c.deleted = false")
    Optional<Object> findByIdAndNotDeleted(Long commentId);

    boolean existsByIdAndDeletedFalse(Long id);
}