import api from "./api";

export const userService = {
  /**
   * 🔹 현재 로그인한 사용자 프로필 가져오기 ("/api/users/profile/me")
   */
  async getMyProfile() {
    const res = await api.get("/api/users/profile/me");
    return res.data;
  },

  /**
   * 🔹 특정 사용자 프로필 가져오기
   * @param {number} userId 사용자 ID
   */
  async getUserProfile(userId) {
    const res = await api.get(`/api/users/profile/${userId}`);
    return res.data;
  },

  /**
   * 🔹 사용자 프로필 수정
   * @param {object} data 수정할 프로필 데이터
   */
  async updateUserProfile(data) {
    const res = await api.patch("/api/users/profile/me", data);
    return res.data;
  },

  /**
   * 🔹 프로필 이미지 업로드 (multipart/form-data)
   */
  async uploadProfileImage(file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/api/uploads/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data; // { url: "/uploads/profile/..." }
  },
};
