package org.example.plantory_be.service;

import org.example.plantory_be.dto.UserDto;
import org.example.plantory_be.dto.response.CommentResponse;
import org.example.plantory_be.dto.request.CommentRequest;
import org.example.plantory_be.dto.response.PostResponse;
import org.example.plantory_be.entity.Comment;
import org.example.plantory_be.entity.LikeTargetType;
import org.example.plantory_be.entity.Post;
import org.example.plantory_be.entity.User;
import org.example.plantory_be.exception.ResourceNotFoundException;
import org.example.plantory_be.notification.NotificationEvent;
import org.example.plantory_be.repository.CommentRepository;
import org.example.plantory_be.repository.LikeRepository;
import org.example.plantory_be.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final AuthenticationService authenticationService;
    private final ApplicationEventPublisher eventPublisher;
    private final LikeRepository likeRepository;

    public CommentResponse createComment(Long postId, CommentRequest request) {
        User currentUser = authenticationService.getCurrentUser();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Page not found"));

        Comment parent = null;
        if (request.getParentId() != null) {
            parent = commentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent comment not found"));
        }

        Comment comment = Comment.builder()
                .content(request.getContent())
                .post(post)
                .user(currentUser)
                .parent(parent)
                .build();

        comment = commentRepository.save(comment);

        Long receiverId = post.getUser().getId();
        if(!receiverId.equals(currentUser.getId())) {
            eventPublisher.publishEvent(
                    new NotificationEvent(
                            receiverId,
                            "COMMENT",
                            currentUser.getNickName() + "님이 댓글을 남겼습니다.",
                            post.getId(),
                            currentUser.getId(),
                            currentUser.getNickName()
                    )
            );
        }
        return CommentResponse.fromEntity(comment);
    }

    /**
     * ✅ 댓글 + 대댓글 재귀 조회 (Page → List 구조)
     */
    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByPost(Long postId) {
        User currentUser = authenticationService.getCurrentUser();
        postRepository.findByIdAndNotDeleted(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        // 루트 댓글만 가져오고, children은 엔티티의 @OneToMany 로딩
        List<Comment> rootComments = commentRepository.findByPostIdAndParentIsNullOrderByCreatedAtDesc(postId);

        return rootComments.stream()
                .map(c -> convertToResponseRecursive(c, currentUser))
                .collect(Collectors.toList());
    }

    /**
     * ✅ 댓글 엔티티 → DTO 변환 (재귀적으로 replies 포함)
     */
    private CommentResponse convertToResponseRecursive(Comment comment, User currentUser) {
        Long likeCount = likeRepository.countByTargetTypeAndId(comment.getId(), LikeTargetType.COMMENT);
        boolean isLiked = likeRepository.existsByUserAndTargetIdAndTargetType(currentUser, comment.getId(), LikeTargetType.COMMENT);

        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.isDeleted() ? "(삭제된 댓글입니다)" : comment.getContent())
                .createdAt(comment.getCreatedAt())
                .user(UserDto.fromEntity(comment.getUser()))
                .parentId(comment.getParent() != null ? comment.getParent().getId() : null)
                .likeCount(likeCount)
                .isLiked(isLiked)
                .children(comment.getChildren().stream()
                        .map(child -> convertToResponseRecursive(child, currentUser))
                        .collect(Collectors.toList()))
                .build();
    }

    public CommentResponse updateComment(Long commentId, CommentRequest request) {
        User currentUser = authenticationService.getCurrentUser();
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You are not authorized to update this post");
        }

        comment.setContent(request.getContent());
        comment = commentRepository.save(comment);

        return CommentResponse.fromEntity(comment);
    }

    public void deleteComment(Long commentId) {
        User currentUser = authenticationService.getCurrentUser();
        Comment comment = commentRepository.findByIdWithChildren(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You are not authorized to delete this post");
        }

        commentRepository.delete(comment);
    }

    @Transactional(readOnly = true)
    public Page<CommentResponse> getReplies(Long parentId, Pageable pageable) {
        return commentRepository.findByParentIdOrderByCreatedAtDesc(parentId, pageable)
                .map(CommentResponse::fromEntity);
    }
}