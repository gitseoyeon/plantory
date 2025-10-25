const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/identification`;

export const identifyPlant = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
   const response = await axios.post(`${API_BASE_URL}/identify`, formData, {
      // ❌ Content-Type을 수동으로 지정하지 말 것!
      // axios가 boundary 포함한 헤더를 자동으로 설정함
    });
    return response.data;
  } catch (error) {
    console.error("식물 식별 요청 실패:", error.response?.data || error);
    throw error;
  }
};
