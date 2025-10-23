package org.example.plantory_be.service;

import org.example.plantory_be.entity.Like;
import org.example.plantory_be.entity.LikeTargetType;
import org.example.plantory_be.entity.User;
import org.example.plantory_be.exception.BadRequestException;
import org.example.plantory_be.notification.NotificationEvent;
import org.example.plantory_be.repository.CommentRepository;
import org.example.plantory_be.repository.LikeRepository;
import lombok.RequiredArgsConstructor;
import org.example.plantory_be.repository.PostRepository;
import org.springframework.context.ApplicationEventPublisher;
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
    private final ApplicationEventPublisher eventPublisher;

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

            Long receiverId = resolveOwenerId(targetId, targetType);
            if(receiverId != null && !receiverId.equals(currentUser.getId())) {
                eventPublisher.publishEvent(
                        new NotificationEvent(
                                receiverId,
                                "LIKE",
                                currentUser.getNickName() + "님이 좋아요를 눌렀습니다.",
                                targetId,
                                currentUser.getId(),
                                currentUser.getNickName()
                        )
                );
            }
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

    private Long resolveOwenerId(Long targetId, LikeTargetType targetType) {
        return switch (targetType) {
            case POST -> postRepository.findById(targetId)
                    .map(p -> p.getUser().getId())
                    .orElse(null);
            case COMMENT -> commentRepository.findById(targetId)
                    .map(c -> c.getUser().getId())
                    .orElse(null);
        };
    }
}