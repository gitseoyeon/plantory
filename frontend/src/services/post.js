import api from "./api";

export const postService = {
  // 전체 포스트 목록 조회
  async getAllPosts(page = 0, size = 10) {
    const res = await api.get("/api/posts", { params: { page, size } });
    return res.data;
  },

  // 단일 포스트 조회
  async getPostById(postId) {
    const res = await api.get(`/api/posts/${postId}`);
    return res.data;
  },
  createPost: async (formData) => {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("category", formData.category);
    if (formData.file) data.append("file", formData.file);

    const response = await api.post("/api/posts", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updatePost: async (postId, formData) => {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("category", formData.category);
    if (formData.file) data.append("file", formData.file);
    if (formData.imageUrl) data.append("imageUrl", formData.imageUrl);

    const response = await api.put(`/api/posts/${postId}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // 포스트 삭제
  async deletePost(postId) {
    const res = await api.delete(`/api/posts/${postId}`);
    return res.data;
  },

  // 특정 사용자 포스트 목록 조회
  async getPostsByUser(userId) {
    const res = await api.get(`/api/posts/user/${userId}`);
    return res.data;
  },

  // 특정 사용자 포스트 개수 조회
  async getUserPostCount(userId) {
    const res = await api.get(`/api/posts/user/${userId}/count`);
    return res.data;
  },

  // 좋아요 토글
  async toggleLike(postId) {
    const res = await api.post(`/api/posts/${postId}/like`);
    return res.data;
  },
};
