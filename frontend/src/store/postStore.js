import { create } from "zustand";
import { postService } from "../services/post";
import { ko } from "date-fns/locale";

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

  fetchPostById: async (postId) => {
    set({ loading: true });
    try {
      const data = await postService.getPostById(postId);
      set({ post: data, loading: false });
    } catch (err) {
      set({ loading: false, error: err.message });
    }
  },

// ✅ 좋아요 토글 
toggleLike: async (postId) => {
  try {
    const res = await postService.toggleLike(postId);
    const { liked, likeCount } = res.data ?? res; 

    if (typeof likeCount !== "number") {
      console.warn("likeCount 값이 비정상:", res);
      return null;
    }

    set((state) => {
      const updatedPosts = state.posts.map((p) =>
        p.id === postId ? { ...p, liked, likeCount } : p
      );

      // ✅ 상세 페이지(post) 상태
      const updatedPost =
        state.post && state.post.id === postId
          ? { ...state.post, liked, likeCount }
          : state.post;

      return { posts: updatedPosts, post: updatedPost };
    });

    return { liked, likeCount };
  } catch (err) {
    console.error("좋아요 토글 실패:", err);
    return null;
  }
},


}));

export default postStore;
