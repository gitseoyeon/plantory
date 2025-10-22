import api from "./api";

export const commentService = {
  // 댓글 작성 (parentId 포함 시 대댓글)
  async createComment(postId, data) {
    const response = await api.post(`/api/comments/posts/${postId}`, data);
    return response.data;
  },

  // 댓글 목록 조회
  async getComments(postId, page = 0, size = 10) {
    const response = await api.get(`/api/comments/posts/${postId}`, {
      params: { page, size },
    });
    return response.data;
  },

  // 댓글 수정
  async updateComment(postId, commentId, data) {
    const response = await api.put(`/api/comments/posts/${postId}/${commentId}`, data);
    return response.data;
  },

  // 댓글 삭제
  async deleteComment(postId, commentId) {
    const response = await api.delete(`/api/comments/posts/${postId}/${commentId}`);
    return response.data;
  },

  // 대댓글 목록 조회
  async getReplies(postId, commentId) {
    const response = await api.get(`/api/comments/${commentId}/replies`);
    return response.data;
  },

  // 댓글 좋아요 토글
  async toggleLike(postId, commentId) {
    const response = await api.post(`/api/comments/posts/${postId}/${commentId}/like`);
    return response.data;
  },
};
