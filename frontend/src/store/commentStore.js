import { create } from "zustand";
import { commentService } from "../services/comment";

/**
 * 댓글 + 대댓글 전용 Zustand Store
 */
const useCommentStore = create((set, get) => ({
  comments: [], // 계층형 댓글 리스트
  loading: false,
  error: null,

  /**
   * ✅ 댓글 전체 불러오기
   * 서버에서 평면(flat) 구조로 내려주면 nestComments()로 계층 변환
   */
  fetchComments: async (postId) => {
    set({ loading: true, error: null });
    try {
      const data = await commentService.getComments(postId);
      const nested = nestComments(data);
      set({ comments: nested, loading: false });
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "댓글 불러오기 실패",
      });
    }
  },

  /**
   * ✅ 댓글 등록
   */
  createComment: async (postId, content, parentId = null) => {
    set({ loading: true, error: null });
    try {
      const newComment = await commentService.createComment(
        postId,
        content,
        parentId
      );

      set((state) => {
        if (!parentId) {
          // 일반 댓글
          return { comments: [newComment, ...state.comments], loading: false };
        }

        // 대댓글
        return {
          comments: addReplyToParent(state.comments, parentId, newComment),
          loading: false,
        };
      });
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "댓글 등록 실패",
      });
    }
  },

  /**
   * ✅ 댓글 수정
   */
  updateComment: async (postId, commentId, data) => {
    set({ loading: true, error: null });
    try {
      const updated = await commentService.updateComment(
        postId,
        commentId,
        data
      );
      set((state) => ({
        comments: updateCommentInTree(state.comments, commentId, updated),
        loading: false,
      }));
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "댓글 수정 실패",
      });
    }
  },

  /**
   * ✅ 댓글 삭제
   */
  deleteComment: async (postId, commentId) => {
    set({ loading: true, error: null });
    try {
      await commentService.deleteComment(postId, commentId);
      set((state) => ({
        comments: removeCommentFromTree(state.comments, commentId),
        loading: false,
      }));
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "댓글 삭제 실패",
      });
    }
  },

  /**
   * ✅ 댓글/대댓글 좋아요 토글
   */
  toggleLike: async (postId, commentId) => {
    try {
      const { isLiked, likeCount } = await commentService.toggleLike(
        postId,
        commentId
      );
      set((state) => ({
        comments: updateLikeInComments(state.comments, commentId, {
          isLiked,
          likeCount,
        }),
      }));
    } catch (err) {
      console.error("댓글 좋아요 실패:", err);
      set({
        error: err.response?.data?.message || "댓글 좋아요 실패",
      });
    }
  },
}));

/* -------------------------------------------------------
 * 헬퍼 함수들 (트리형 데이터 업데이트 전용)
 * -----------------------------------------------------*/

/** 평면 구조 → 중첩 트리 변환 */
function nestComments(flat) {
  if (!Array.isArray(flat)) return [];
  const map = {};
  const roots = [];

  flat.forEach((c) => (map[c.id] = { ...c, replies: [] }));
  flat.forEach((c) => {
    if (c.parentId) map[c.parentId]?.replies.push(map[c.id]);
    else roots.push(map[c.id]);
  });

  return roots;
}

/** 대댓글 추가 */
function addReplyToParent(comments, parentId, reply) {
  return comments.map((c) => {
    if (c.id === parentId) {
      return { ...c, replies: [...(c.replies || []), reply] };
    }
    if (c.replies && c.replies.length > 0) {
      return { ...c, replies: addReplyToParent(c.replies, parentId, reply) };
    }
    return c;
  });
}

/** 댓글 내용 업데이트 */
const updateCommentInTree = (comments, commentId, updated) => {
  return comments.map((comment) => {
    if (comment.id === commentId) {
      // ✅ 기존 replies 유지
      return { ...comment, ...updated, replies: comment.replies };
    }
    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: updateCommentInTree(comment.replies, commentId, updated),
      };
    }
    return comment;
  });
};

/** 댓글/대댓글 삭제 */
function removeCommentFromTree(comments, commentId) {
  return comments
    .filter((c) => c.id !== commentId)
    .map((c) => ({
      ...c,
      replies: c.replies ? removeCommentFromTree(c.replies, commentId) : [],
    }));
}

/** 좋아요 상태 업데이트 */
function updateLikeInComments(comments, commentId, likeData) {
  return comments.map((c) => {
    if (c.id === commentId) return { ...c, ...likeData };
    if (c.replies && c.replies.length > 0) {
      return {
        ...c,
        replies: updateLikeInComments(c.replies, commentId, likeData),
      };
    }
    return c;
  });
}

export default useCommentStore;
