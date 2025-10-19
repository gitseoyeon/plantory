package org.example.plantory_be.service;

import org.example.plantory_be.entity.Like;
import org.example.plantory_be.entity.Post;
import org.example.plantory_be.entity.User;
import org.example.plantory_be.exception.BadRequestException;
import org.example.plantory_be.repository.LikeRepository;
import org.example.plantory_be.repository.PostRepository;
import org.example.plantory_be.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final AuthenticationService authenticationService;

    public boolean toggleLike(Long postId) {
        User currentUser = authenticationService.getCurrentUser();

        Post post = postRepository.findByIdAndNotDeleted(postId)
                .orElseThrow(() -> new BadRequestException("Post not found"));

        boolean alreadyLiked = likeRepository.existsByUserAndPost(currentUser, post);

        if (alreadyLiked) {
            likeRepository.deleteByUserAndPost(currentUser, post);
            return false;
        } else {
            Like like = Like.builder()
                    .user(currentUser)
                    .post(post)
                    .build();
            likeRepository.save(like);
            return true;
        }
    }

    @Transactional(readOnly = true)
    public Long getLikeCount(Long postId) { return likeRepository.countByPostId(postId); }

    @Transactional(readOnly = true)
    public boolean isLikedByCurrentUser(Long postId) {
        User currentUser = authenticationService.getCurrentUser();

        Post post = postRepository.findByIdAndNotDeleted(postId)
                .orElseThrow(() -> new BadRequestException("Post not found"));

        return likeRepository.existsByUserAndPost(currentUser, post);
    }
}