package org.example.plantory_be.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.plantory_be.dto.request.CommentRequest;
import org.example.plantory_be.dto.response.CommentResponse;
import org.example.plantory_be.entity.LikeTargetType;
import org.example.plantory_be.service.CommentService;
import org.example.plantory_be.service.LikeService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;
    private final LikeService likeService;

    @PostMapping("/posts/{postId}")
    public ResponseEntity<CommentResponse> createComment(
            @PathVariable Long postId,
            @Valid @RequestBody CommentRequest request
    ) {
        CommentResponse response = commentService.createComment(postId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/posts/{postId}")
    public ResponseEntity<Page<CommentResponse>> getComments(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CommentResponse> comments = commentService.getComments(postId, pageable);
        return ResponseEntity.ok(comments);
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody CommentRequest request
    ) {
        CommentResponse updated = commentService.updateComment(commentId, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{commentId}/replies")
    public ResponseEntity<Page<CommentResponse>> getReplies(
            @PathVariable Long commentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CommentResponse> replies = commentService.getReplies(commentId, pageable);
        return ResponseEntity.ok(replies);
    }

    @PostMapping("/{commentId}/like")
    public ResponseEntity<?> toggleLike(@PathVariable Long commentId) {
        boolean isLiked = likeService.toggleLike(commentId, LikeTargetType.COMMENT);
        Long likeCount = likeService.getLikeCount(commentId, LikeTargetType.COMMENT);

        return ResponseEntity.ok().body(Map.of(
                "isLiked", isLiked,
                "likeCount", likeCount
        ));
    }
}
