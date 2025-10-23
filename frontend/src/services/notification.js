import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * 모든 알림 목록 조회
 */
export const getNotifications = async (page = 0, size = 10) => {
  const token = localStorage.getItem("accessToken");
  try {
    const res = await axios.get(`${API_BASE}/api/notifications`, {
      params: { page, size },
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
    return res.data.content; // ✅ content만 반환
  } catch (err) {
    console.error("❌ 알림 목록 불러오기 실패:", err);
    throw err;
  }
};

/**
 * 특정 알림 읽음 처리
 */
export const markAsRead = async (id) => {
  const token = localStorage.getItem("accessToken"); // ✅ 동일하게 처리
  try {
    await axios.post(
      `${API_BASE}/api/notifications/${id}/read`,
      {},
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      }
    );
  } catch (err) {
    console.error("❌ 알림 읽음 처리 실패:", err);
    throw err;
  }
};

/**
 * 모든 알림 읽음 처리
 */
export const markAllAsRead = async () => {
  const token = localStorage.getItem("accessToken");
  try {
    await axios.post(
      `${API_BASE}/api/notifications/read-all`,
      {},
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      }
    );
  } catch (err) {
    console.error("❌ 전체 읽음 처리 실패:", err);
    throw err;
  }
};
