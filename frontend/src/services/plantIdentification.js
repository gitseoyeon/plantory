import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/identification";

// 식물 이미지 업로드 및 AI 식별 요청
export const identifyPlant = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await axios.post(`${API_BASE_URL}/identify`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("식물 식별 요청 실패:", error);
    throw error;
  }
};
