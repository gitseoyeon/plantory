package org.example.plantory_be.service;

import org.example.plantory_be.entity.Like;
import org.example.plantory_be.entity.LikeTargetType;
import org.example.plantory_be.entity.User;
import org.example.plantory_be.exception.BadRequestException;
import org.example.plantory_be.repository.CommentRepository;
import org.example.plantory_be.repository.LikeRepository;
import lombok.RequiredArgsConstructor;
import org.example.plantory_be.repository.PostRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final AuthenticationService authenticationService;

    public boolean toggleLike(Long targetId, LikeTargetType targetType) {
        User currentUser = authenticationService.getCurrentUser();

        boolean alreadyLiked = likeRepository.existsByUserAndTargetIdAndTargetType(currentUser, targetId, targetType);

        if (alreadyLiked) {
            likeRepository.deleteByUserAndTargetIdAndTargetType(currentUser, targetId, targetType);
            return false;
        } else {
            Like like = Like.builder()
                    .user(currentUser)
                    .targetType(targetType)
                    .targetId(targetId)
                    .build();
            likeRepository.save(like);
            return true;
        }
    }

    @Transactional(readOnly = true)
    public Long getLikeCount(Long targetId, LikeTargetType targetType) {
        return likeRepository.countByTargetTypeAndId(targetId, targetType);
    }

    @Transactional(readOnly = true)
    public boolean isLikedByCurrentUser(Long targetId, LikeTargetType targetType) {
        User currentUser = authenticationService.getCurrentUser();

        boolean existsAndNotDeleted = switch (targetType) {
            case POST -> postRepository.existsByIdAndDeletedFalse(targetId);
            case COMMENT -> commentRepository.existsByIdAndDeletedFalse(targetId);
            default -> throw new BadRequestException("Unsupported resource type: " + targetType);
        };

        return likeRepository.existsByUserAndTargetIdAndTargetType(currentUser, targetId, targetType);
    }
}