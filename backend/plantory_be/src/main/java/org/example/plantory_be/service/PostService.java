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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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
    private final FileUploadService fileUploadService;

    @Value("${app.public.base-url}")
    private String baseUrl; // ✅ yml에 정의된 public base url 사용

    /**
     * ✅ 게시글 생성
     */
    public PostResponse createPost(PostRequest request) {
        User currentUser = authenticationService.getCurrentUser();

        String imageUrl = null;
        MultipartFile file = request.getFile();

        if (file != null && !file.isEmpty()) {
            imageUrl = fileUploadService.uploadProfileImage(file);
        } else if (request.getImageUrl() != null && !request.getImageUrl().isEmpty()) {
            imageUrl = request.getImageUrl();
        }

        Post post = Post.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .category(request.getCategory())
                .imageUrl(imageUrl)
                .user(currentUser)
                .deleted(false)
                .build();

        post = postRepository.save(post);
        log.info("게시글 생성 완료: id={}, title={}", post.getId(), post.getTitle());

        return toResponse(post, currentUser);
    }

    /**
     * ✅ 전체 게시글 조회 (페이지)
     */
    @Transactional(readOnly = true)
    public Page<PostResponse> getAllPosts(Pageable pageable) {
        User currentUser = authenticationService.getCurrentUser();
        Page<Post> posts = postRepository.findAllActive(pageable);

        return posts.map(post -> toResponse(post, currentUser));
    }

    /**
     * ✅ 단일 게시글 조회
     */
    @Transactional(readOnly = true)
    public PostResponse getPost(Long postId) {
        User currentUser = authenticationService.getCurrentUser();
        Post post = postRepository.findByIdAndNotDeleted(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        return toResponse(post, currentUser);
    }

    /**
     * ✅ 특정 유저의 게시글 목록 조회
     */
    @Transactional(readOnly = true)
    public Page<PostResponse> getUserPosts(Long userId, Pageable pageable) {
        Page<Post> posts = postRepository.findByUserIdAndNotDeleted(userId, pageable);
        return posts.map(PostResponse::fromEntity);
    }

    /**
     * ✅ 특정 유저의 게시글 개수 조회
     */
    @Transactional(readOnly = true)
    public Long getUserPostCount(Long userId) {
        return postRepository.countByUserIdAndNotDeleted(userId);
    }

    /**
     * ✅ 카테고리별 인기 게시글 조회
     */
    @Transactional(readOnly = true)
    public List<PostResponse> getTopPostsByEachCategory() {
        User currentUser = authenticationService.getCurrentUser();
        List<Post> topPosts = postRepository.findTop1PostByEachCategory();

        return topPosts.stream()
                .map(post -> toResponse(post, currentUser))
                .toList();
    }

    /**
     * ✅ 게시글 수정
     */
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

        String imageUrl = null;
        MultipartFile file = request.getFile();

        if (file != null && !file.isEmpty()) {
            imageUrl = fileUploadService.uploadProfileImage(file);
        } else if (request.getImageUrl() != null && !request.getImageUrl().isEmpty()) {
            imageUrl = request.getImageUrl();
        }
        post.setImageUrl(imageUrl);

        post = postRepository.save(post);
        return toResponse(post, currentUser);
    }

    /**
     * ✅ 게시글 삭제
     */
    public void deletePost(Long postId) {
        User currentUser = authenticationService.getCurrentUser();
        Post post = postRepository.findByIdAndNotDeleted(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        if (!post.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to delete this post");
        }

        if (post.getImageUrl() != null && !post.getImageUrl().isEmpty()) {
            fileUploadService.deleteFile(post.getImageUrl());
        }

        post.setDeleted(true);
        postRepository.save(post);

        log.info("게시글 이미지 삭제 완료: id={}, image={}", postId, post.getImageUrl());
    }

    /**
     * ✅ 공통 응답 변환 메서드 (imageUrl 절대경로 변환 포함)
     */
    private PostResponse toResponse(Post post, User currentUser) {
        PostResponse response = PostResponse.fromEntity(post);

        Long likeCount = likeRepository.countByTargetTypeAndId(post.getId(), LikeTargetType.POST);
        boolean isLiked = likeRepository.existsByUserAndTargetIdAndTargetType(currentUser, post.getId(), LikeTargetType.POST);
        Long commentCount = commentRepository.countByPostId(post.getId());

        response.setLikeCount(likeCount);
        response.setLiked(isLiked);
        response.setCommentCount(commentCount);

        // ✅ 이미지 URL 절대경로 변환
        if (response.getImageUrl() != null &&
                !response.getImageUrl().isEmpty() &&
                !response.getImageUrl().startsWith("http")) {

            String normalizedBaseUrl = baseUrl.endsWith("/")
                    ? baseUrl.substring(0, baseUrl.length() - 1)
                    : baseUrl;

            response.setImageUrl(normalizedBaseUrl + response.getImageUrl());
        }

        return response;
    }
}
