package org.example.plantory_be.service;

import org.example.plantory_be.dto.response.CommentResponse;
import org.example.plantory_be.dto.request.CommentRequest;
import org.example.plantory_be.entity.Comment;
import org.example.plantory_be.entity.Post;
import org.example.plantory_be.entity.User;
import org.example.plantory_be.exception.ResourceNotFoundException;
import org.example.plantory_be.repository.CommentRepository;
import org.example.plantory_be.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final AuthenticationService authenticationService;

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
        return CommentResponse.fromEntity(comment);
    }

    @Transactional(readOnly = true)
    public Page<CommentResponse> getComments(Long postId, Pageable pageable) {
        authenticationService.getCurrentUser();

        postRepository.findByIdAndNotDeleted(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        Page<Comment> comments = commentRepository.findByPostIdAndParentIsNullOrderByCreatedAtDesc(postId, pageable);
        return comments.map(CommentResponse::fromEntity);
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
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You are not authorized to update this post");
        }

        commentRepository.delete(comment);
    }

    @Transactional(readOnly = true)
    public Page<CommentResponse> getReplies(Long parentId, Pageable pageable) {
        return commentRepository.findByParentIdOrderByCreatedAtDesc(parentId, pageable)
                .map(CommentResponse::fromEntity);
    }
}