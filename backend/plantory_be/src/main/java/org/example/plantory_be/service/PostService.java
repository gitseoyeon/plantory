package org.example.plantory_be.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.plantory_be.dto.request.PostRequest;
import org.example.plantory_be.dto.response.PostResponse;
import org.example.plantory_be.entity.LikeTargetType;
import org.example.plantory_be.entity.Post;
import org.example.plantory_be.entity.User;
import org.example.plantory_be.exception.ResourceNotFoundException;
import org.example.plantory_be.exception.UnauthorizedException;
import org.example.plantory_be.repository.CommentRepository;
import org.example.plantory_be.repository.LikeRepository;
import org.example.plantory_be.repository.PostRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class PostService {

    private final PostRepository postRepository;
    private final AuthenticationService authenticationService;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;

    public PostResponse createPost(PostRequest request) {
        User currentUser = authenticationService.getCurrentUser();

        Post post = Post.builder()
                .content(request.getContent())
                .imageUrl(request.getImageUrl())
                .title(request.getTitle())
                .category(request.getCategory())
                .user(currentUser)
                .deleted(false)
                .build();

        post = postRepository.save(post);
        return PostResponse.fromEntity(post);
    }

    @Transactional(readOnly = true)
    public Page<PostResponse> getAllPosts(Pageable pageable) {
        User currentUser = authenticationService.getCurrentUser();
        Page<Post> posts = postRepository.findAllActive(pageable);
        return posts.map(post -> {
            PostResponse response = PostResponse.fromEntity(post);
            Long likeCount = likeRepository.countByTargetTypeAndId(post.getId(), LikeTargetType.POST);
            boolean isLiked = likeRepository.existsByUserAndTargetIdAndTargetType(currentUser, post.getId(), LikeTargetType.POST);
            Long commentCount = commentRepository.countByPostId(post.getId());

            response.setLikeCount(likeCount);
            response.setLiked(isLiked);
            response.setCommentCount(commentCount);
            return response;
        });
    }

    @Transactional(readOnly = true)
    public PostResponse getPost(Long postId) {
        User currentUser = authenticationService.getCurrentUser();
        Post post = postRepository.findByIdAndNotDeleted(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        return PostResponse.fromEntity(post);
    }

    @Transactional(readOnly = true)
    public Page<PostResponse> getUserPosts(Long userId, Pageable pageable) {
        User currentUser = authenticationService.getCurrentUser();
        Page<Post> posts = postRepository.findByUserIdAndNotDeleted(userId, pageable);
        return posts.map(post -> {
            PostResponse response = PostResponse.fromEntity(post);
            return response;
        });
    }

    @Transactional(readOnly = true)
    public Long getUserPostCount(Long userId) {
        authenticationService.getCurrentUser();
        return postRepository.countByUserIdAndNotDeleted(userId);
    }

    @Transactional(readOnly = true)
    public List<PostResponse> getTopPostsByEachCategory() {
        User currentUser = authenticationService.getCurrentUser();
        List<Post> topPosts = postRepository.findTop1PostByEachCategory();

        return topPosts.stream().map(post -> {
            PostResponse response = PostResponse.fromEntity(post);

            Long likeCount = likeRepository.countByTargetTypeAndId(post.getId(), LikeTargetType.POST);
            boolean isLiked = likeRepository.existsByUserAndTargetIdAndTargetType(currentUser, post.getId(), LikeTargetType.POST);
            Long commentCount = commentRepository.countByPostId(post.getId());

            response.setLikeCount(likeCount);
            response.setLiked(isLiked);
            response.setCommentCount(commentCount);

            return response;
        }).toList();
    }


    public PostResponse updatePost(Long postId, PostRequest request) {
        User currentUser = authenticationService.getCurrentUser();
        Post post = postRepository.findByIdAndNotDeleted(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        if (!post.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to update this post");
        }

        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setCategory(request.getCategory());

        post = postRepository.save(post);
        return PostResponse.fromEntity(post);
    }

    public void deletePost(Long postId) {
        User currentUser = authenticationService.getCurrentUser();
        Post post = postRepository.findByIdAndNotDeleted(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        if (!post.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to delete this post");
        }

        post.setDeleted(true);
        postRepository.save(post);
    }
}