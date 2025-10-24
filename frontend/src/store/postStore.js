import { create } from "zustand";
import { postService } from "../services/post";

const postStore = create((set) => ({
  posts: [],
  post: null,
  loading: false,
  error: null,

  // ✅ 전체 포스트 가져오기
  fetchAllPosts: async () => {
    set({ loading: true });
    try {
      const data = await postService.getAllPosts();
      set({ posts: data.content || data, loading: false });
    } catch (err) {
      console.error("포스트 불러오기 실패:", err);
      set({ loading: false });
    }
  },

  // ✅ 단일 포스트 가져오기
  fetchPostById: async (postId) => {
    set({ loading: true });
    try {
      const data = await postService.getPostById(postId);
      set({ post: data, loading: false });
    } catch (err) {
      set({ loading: false, error: err.message });
    }
  },

  // ✅ 포스트 생성
  createPost: async (data) => {
    set({ loading: true });
    try {
      const created = await postService.createPost(data);
      set((state) => ({
        posts: [created, ...state.posts],
        loading: false,
      }));
      return created;
    } catch (err) {
      console.error("포스트 생성 실패:", err);
      set({ loading: false, error: err.message });
    }
  },

  // ✅ 포스트 수정
  updatePost: async (postId, data) => {
    set({ loading: true });
    try {
      const updated = await postService.updatePost(postId, data);
      set((state) => ({
        posts: state.posts.map((p) => (p.id === postId ? updated : p)),
        post: state.post?.id === postId ? updated : state.post,
        loading: false,
      }));
      return updated;
    } catch (err) {
      console.error("포스트 수정 실패:", err);
      set({ loading: false, error: err.message });
    }
  },

  // ✅ 좋아요 토글
  toggleLike: async (postId) => {
    try {
      const res = await postService.toggleLike(postId);
      const { isLiked, likeCount } = res; // 백엔드 응답 필드명 맞춤

      set((state) => {
        const updatedPosts = state.posts.map((p) =>
          p.id === postId ? { ...p, isLiked, likeCount } : p
        );

        const updatedPost =
          state.post && state.post.id === postId
            ? { ...state.post, isLiked, likeCount }
            : state.post;

        return { posts: updatedPosts, post: updatedPost };
      });
    } catch (err) {
      console.error("좋아요 토글 실패:", err);
    }
  },
}));

export default postStore;
