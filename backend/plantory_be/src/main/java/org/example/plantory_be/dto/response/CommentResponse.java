package org.example.plantory_be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.plantory_be.dto.UserDto;
import org.example.plantory_be.entity.Comment;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse {
    private Long id;
    private String content;
    private Long parentId;
    private UserDto user;
    private LocalDateTime createdAt;
    private Long likeCount;
    private boolean isLiked;
    private List<CommentResponse> children;

    public static CommentResponse fromEntity(Comment comment) {
        List<CommentResponse> childResponses = comment.getChildren() != null
                ? comment.getChildren().stream()
                .map(CommentResponse::fromEntity)
                .toList()
                : List.of();

        return CommentResponse.builder()
                .id(comment.getId())
                .parentId(comment.getParent() != null ? comment.getParent().getId() : null)
                .content(comment.getContent())
                .user(UserDto.fromEntity(comment.getUser()))
                .createdAt(comment.getCreatedAt())
                .children(childResponses)
                .build();
    }
}