import { create } from "zustand";
import { postService } from "../services/post";
import { commentService } from "../services/comment";

const useLikeStore = create((set, get) => ({
  likes: {}, // postId, commentId 별 좋아요 상태 저장
  loading: false,
  error: null,

  /**
   * ✅ 게시글 좋아요 토글
   */
  togglePostLike: async (postId) => {
    set({ loading: true, error: null });

    try {
      const { isLiked, likeCount } = await postService.toggleLike(postId);

      set((state) => ({
        likes: {
          ...state.likes,
          [`post-${postId}`]: { liked: isLiked, likeCount },
        },
        loading: false,
      }));

      return { isLiked, likeCount };
    } catch (err) {
      console.error("게시글 좋아요 실패:", err);
      set({
        loading: false,
        error: err.response?.data?.message || "게시글 좋아요 실패",
      });
      throw err;
    }
  },

  /**
   * ✅ 댓글/대댓글 좋아요 토글
   */
  toggleCommentLike: async (postId, commentId) => {
    set({ loading: true, error: null });

    try {
      const { isLiked, likeCount } = await commentService.toggleLike(
        postId,
        commentId
      );

      set((state) => ({
        likes: {
          ...state.likes,
          [`comment-${commentId}`]: { liked: isLiked, likeCount }, // ✅ 수정
        },
        loading: false,
      }));

      return { isLiked, likeCount };
    } catch (err) {
      console.error("댓글 좋아요 실패:", err);
      set({
        loading: false,
        error: err.response?.data?.message || "댓글 좋아요 실패",
      });
      throw err;
    }
  },
}));

export default useLikeStore;
